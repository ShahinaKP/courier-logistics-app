import { Router } from "express";
import {
  getAllPackages,
  createPackage,
  updatePackageStatus,
} from "../controllers/packageController";

const router = Router();

router.get("/", getAllPackages);
router.post("/", createPackage);
router.post("/webhook", createPackage);
router.patch("/:trackingId/status", updatePackageStatus);

export default router;
