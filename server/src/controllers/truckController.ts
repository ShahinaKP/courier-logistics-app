import { Request, Response } from "express";
import prisma from "../db/prisma";

export const getAllTrucks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const trucks = await prisma.truck.findMany({
      orderBy: { truck_code: "asc" },
    });
    res.json(trucks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllSchedules = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const schedules = await prisma.truckSchedule.findMany({
      include: {
        truck: true,
        region: true,
        truck_bags: true,
      },
      orderBy: { scheduled_departure: "desc" },
    });

    const result = schedules.map((s) => ({
      ...s,
      bag_count: s.truck_bags.length,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createSchedule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { truck_id, region_id, scheduled_departure } = req.body;

    const schedule = await prisma.truckSchedule.create({
      data: {
        truck_id: parseInt(truck_id),
        region_id: parseInt(region_id),
        scheduled_departure: new Date(scheduled_departure),
      },
    });

    res.status(201).json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSchedule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const scheduleId = parseInt(req.params.scheduleId as string);
    const { status, delay_reason, actual_departure } = req.body;

    const schedule = await prisma.truckSchedule.update({
      where: { id: scheduleId },
      data: {
        status,
        delay_reason,
        actual_departure: actual_departure
          ? new Date(actual_departure)
          : undefined,
      },
    });

    res.json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
