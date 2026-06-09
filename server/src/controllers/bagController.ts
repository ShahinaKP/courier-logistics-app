import { Request, Response } from "express";
import pool from "../db/db";

// GET all bags
export const getAllBags = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT b.*, r.region_code, r.region_name,
        COUNT(pb.id) as package_count
      FROM bags b
      LEFT JOIN regions r ON r.id = b.region_id
      LEFT JOIN package_bags pb ON pb.bag_id = b.id
      GROUP BY b.id, r.region_code, r.region_name
      ORDER BY b.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST create new bag
export const createBag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { region_id, direction } = req.body;
    const bag_code = `BAG-${Date.now()}`;

    const result = await pool.query(
      `
      INSERT INTO bags (bag_code, region_id, direction)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [bag_code, region_id, direction],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST add package to bag
export const addPackageToBag = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { bagId } = req.params;
    const { package_id } = req.body;

    await pool.query(
      `
      INSERT INTO package_bags (package_id, bag_id)
      VALUES ($1, $2)
    `,
      [package_id, bagId],
    );

    await pool.query(
      `
      UPDATE packages SET status = 'added_to_bag', updated_at = NOW()
      WHERE id = $1
    `,
      [package_id],
    );

    res.status(201).json({ message: "Package added to bag" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH update bag status (delayed etc)
export const updateBagStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { bagId } = req.params;
    const { status, delay_reason } = req.body;

    await pool.query(
      `
      UPDATE bags SET status = $1, updated_at = NOW() WHERE id = $2
    `,
      [status, bagId],
    );

    // Update all packages in this bag
    if (delay_reason) {
      await pool.query(
        `
        UPDATE packages p SET delay_reason = $1, updated_at = NOW()
        FROM package_bags pb
        WHERE pb.package_id = p.id AND pb.bag_id = $2
      `,
        [delay_reason, bagId],
      );
    }

    res.json({ message: "Bag status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
