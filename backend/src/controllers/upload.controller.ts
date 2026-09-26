import type { Request, Response } from "express";

import { createOccurrenceImageUploadSchema } from "../dtos/upload.dto.js";
import { createOccurrenceImageUpload } from "../services/storage.service.js";

export async function createOccurrenceImageUploadUrl(
  req: Request,
  res: Response,
) {
  const data =
    createOccurrenceImageUploadSchema.parse(
      req.body,
    );

  const upload = await createOccurrenceImageUpload(
    req.user!.id,
    data,
  );

  return res.status(201).json(upload);
}
