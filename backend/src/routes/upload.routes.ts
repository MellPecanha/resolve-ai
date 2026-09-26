import { Router } from "express";

import { createOccurrenceImageUploadUrl } from "../controllers/upload.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadRoutes = Router();

uploadRoutes.post(
  "/occurrence-image",
  authenticate,
  authorize("SOLICITANTE"),
  asyncHandler(createOccurrenceImageUploadUrl),
);

export { uploadRoutes };
