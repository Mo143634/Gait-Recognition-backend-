import { Router } from "express";
import * as dashboardController from "./dashboard.controller.js";
import { authentication } from "../../middleware/authenticaion.middleware.js";

const router = Router();

// Secure all dashboard routes
router.use(authentication());

// Stats Cards
router.get("/stats/subjects", dashboardController.getSubjects);
router.get("/stats/videos", dashboardController.getVideos);
router.get("/stats/accuracy", dashboardController.getAccuracy);
router.get("/stats/sessions", dashboardController.getSessions);

// Combined Stats (for efficiency if needed)
router.get("/stats", dashboardController.getAllStats);

// Recognition Accuracy Chart
router.get("/accuracy-chart", dashboardController.getAccuracyChart);

// System Status
router.get("/system-status", dashboardController.getSystemStatus);

// Recent Uploads Table
router.get("/recent-uploads", dashboardController.getRecentUploads);

export default router;
