import { z } from "zod";

export const createOccurrenceImageUploadSchema = z.object({
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]),
  size: z.number().int().positive().max(5 * 1024 * 1024),
});

export type CreateOccurrenceImageUploadDTO = z.infer<
  typeof createOccurrenceImageUploadSchema
>;
