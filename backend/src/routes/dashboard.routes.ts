import { Router } from "express";

import { dashboard } from "../controllers/dashboard.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const dashboardRoutes = Router();

dashboardRoutes.get(
  "/",
  authenticate,
  authorize("GESTOR"),
  asyncHandler(dashboard),
);

export { dashboardRoutes };
