import { Request, Response } from "express";
import prisma from "../db/prisma";

export const getAllBags = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bags = await prisma.bag.findMany({
      include: {
        region: true,
        package_bags: true,
      },
      orderBy: { created_at: "desc" },
    });

    const result = bags.map((b) => ({
      ...b,
      package_count: b.package_bags.length,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { region_id, direction } = req.body;
    const bag_code = `BAG-${Date.now()}`;

    const bag = await prisma.bag.create({
      data: { bag_code, region_id: parseInt(region_id), direction },
    });

    res.status(201).json(bag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addPackageToBag = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bagId = parseInt(req.params.bagId as string);
    const { package_id } = req.body;

    await prisma.packageBag.create({
      data: { package_id: parseInt(package_id), bag_id: bagId },
    });

    await prisma.package.update({
      where: { id: parseInt(package_id) },
      data: { status: "added_to_bag", updated_at: new Date() },
    });

    res.status(201).json({ message: "Package added to bag" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBagStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bagId = parseInt(req.params.bagId as string);
    const { status, delay_reason } = req.body;

    await prisma.bag.update({
      where: { id: bagId },
      data: { status, updated_at: new Date() },
    });

    if (delay_reason) {
      const packageBags = await prisma.packageBag.findMany({
        where: { bag_id: bagId },
      });

      await prisma.package.updateMany({
        where: {
          id: { in: packageBags.map((pb) => pb.package_id!).filter(Boolean) },
        },
        data: { delay_reason, updated_at: new Date() },
      });
    }

    res.json({ message: "Bag status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
