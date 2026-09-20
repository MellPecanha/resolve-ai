import { Router } from "express";

import {
  getManagers,
  updateMyProfile,
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userRoutes = Router();

userRoutes.get(
  "/gestores",
  authenticate,
  authorize("GESTOR"),
  asyncHandler(getManagers),
);

userRoutes.patch(
  "/me",
  authenticate,
  asyncHandler(updateMyProfile),
);

export { userRoutes };
