import { Request, Response } from "express";
import pool from "../db/db";

// GET all packages grouped for dashboard
export const getAllPackages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT p.*, r.region_code, r.region_name
      FROM packages p
      LEFT JOIN regions r ON r.id = p.region_id
      ORDER BY p.created_at DESC
    `);
    const packages = result.rows;
    res.json({
      packages,
      dashboard: {
        unbagged: packages.filter((p) => p.status === "picked_up"),
        bagged: packages.filter((p) => p.status === "added_to_bag"),
        delayed: packages.filter((p) => p.delay_reason !== null),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST create new package (from webhook)
export const createPackage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      tracking_id,
      sender_name,
      sender_address,
      receiver_name,
      receiver_address,
      weight,
      region_id,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO packages
        (tracking_id, sender_name, sender_address, receiver_name, receiver_address, weight, region_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'to_be_picked_up')
      RETURNING *
    `,
      [
        tracking_id,
        sender_name,
        sender_address,
        receiver_name,
        receiver_address,
        weight,
        region_id,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH update package status
export const updatePackageStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { trackingId } = req.params;
    const { status, current_location, delay_reason } = req.body;

    const result = await pool.query(
      `
      UPDATE packages
      SET status = $1, current_location = $2, delay_reason = $3, updated_at = NOW()
      WHERE tracking_id = $4
      RETURNING *
    `,
      [status, current_location, delay_reason, trackingId],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Package not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
