import { Request, Response } from "express";
import pool from "../db/db";

// GET all trucks
export const getAllTrucks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM trucks ORDER BY truck_code");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET all schedules
export const getAllSchedules = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT ts.*, t.truck_code, r.region_code,
        COUNT(tb.id) as bag_count
      FROM truck_schedules ts
      LEFT JOIN trucks t ON t.id = ts.truck_id
      LEFT JOIN regions r ON r.id = ts.region_id
      LEFT JOIN truck_bags tb ON tb.truck_schedule_id = ts.id
      GROUP BY ts.id, t.truck_code, r.region_code
      ORDER BY ts.scheduled_departure DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST create truck schedule
export const createSchedule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { truck_id, region_id, scheduled_departure } = req.body;

    const result = await pool.query(
      `
      INSERT INTO truck_schedules (truck_id, region_id, scheduled_departure)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [truck_id, region_id, scheduled_departure],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH update schedule (delay or depart)
export const updateSchedule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { scheduleId } = req.params;
    const { status, delay_reason, actual_departure } = req.body;

    const result = await pool.query(
      `
      UPDATE truck_schedules
      SET status = $1, delay_reason = $2, actual_departure = $3
      WHERE id = $4
      RETURNING *
    `,
      [status, delay_reason, actual_departure, scheduleId],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
