import { Router } from "express";

import {
  create,
  list,
  findById,
  changePriority,
  assign,
  changeStatus,
  changeSolution,
  addComment,
  getComments,
  getHistory,
  rate,
  getRatingByOccurrence,
  updateOccurrenceRating,
} from "../controllers/occurrence.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const occurrenceRoutes = Router();

occurrenceRoutes.post(
  "/",
  authenticate,
  asyncHandler(create),
);

occurrenceRoutes.get(
  "/",
  authenticate,
  asyncHandler(list),
);

occurrenceRoutes.get(
  "/:id",
  authenticate,
  asyncHandler(findById),
);

occurrenceRoutes.patch(
  "/:id/priority",
  authenticate,
  authorize("GESTOR"),
  asyncHandler(changePriority),
);

occurrenceRoutes.patch(
  "/:id/responsible",
  authenticate,
  authorize("GESTOR"),
  asyncHandler(assign),
);

occurrenceRoutes.patch(
  "/:id/status",
  authenticate,
  authorize("GESTOR"),
  asyncHandler(changeStatus),
);

occurrenceRoutes.patch(
  "/:id/solution",
  authenticate,
  authorize("GESTOR"),
  asyncHandler(changeSolution),
);

occurrenceRoutes.get(
  "/:id/history",
  authenticate,
  asyncHandler(getHistory),
);

occurrenceRoutes.get(
  "/:id/comments",
  authenticate,
  asyncHandler(getComments),
);

occurrenceRoutes.post(
  "/:id/comments",
  authenticate,
  asyncHandler(addComment),
);

occurrenceRoutes.post(
  "/:id/rating",
  authenticate,
  asyncHandler(rate),
);
occurrenceRoutes.get(
  "/:id/rating",
  authenticate,
  asyncHandler(getRatingByOccurrence),
);

occurrenceRoutes.patch(
  "/:id/rating",
  authenticate,
  asyncHandler(updateOccurrenceRating),
);
export { occurrenceRoutes };
