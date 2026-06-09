import { Router } from "express";
import {
  getAllTrucks,
  getAllSchedules,
  createSchedule,
  updateSchedule,
} from "../controllers/truckController";

const router = Router();

router.get("/", getAllTrucks);
router.get("/schedules", getAllSchedules);
router.post("/schedules", createSchedule);
router.patch("/schedules/:scheduleId", updateSchedule);

export default router;
