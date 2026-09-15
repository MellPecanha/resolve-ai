import { z } from "zod";

export const createOccurrenceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  category: z.string().min(2),
  location: z.string().min(2),
  imageUrl: z.url().optional(),
});

export type CreateOccurrenceDTO = z.infer<
  typeof createOccurrenceSchema
>;

export const updatePrioritySchema = z.object({
  priority: z.enum([
    "BAIXA",
    "MEDIA",
    "ALTA",
    "URGENTE",
  ]),
});

export type UpdatePriorityDTO = z.infer<
  typeof updatePrioritySchema
>;

export const assignResponsibleSchema = z.object({
  responsibleId: z.coerce.number().int().positive(),
});

export type AssignResponsibleDTO = z.infer<
  typeof assignResponsibleSchema
>;

export const updateStatusSchema = z.object({
  status: z.enum([
    "ABERTA",
    "EM_ANALISE",
    "EM_ATENDIMENTO",
    "RESOLVIDA",
    "CANCELADA",
  ]),
  observation: z.string().optional(),
});

export type UpdateStatusDTO = z.infer<
  typeof updateStatusSchema
>;

export const updateSolutionSchema = z.object({
  solution: z.string().min(1),
});

export type UpdateSolutionDTO = z.infer<
  typeof updateSolutionSchema
>;

export const createCommentSchema = z.object({
  content: z.string().min(1),
});

export type CreateCommentDTO = z.infer<
  typeof createCommentSchema
>;

export const createRatingSchema = z.object({
  score: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export type CreateRatingDTO = z.infer<
  typeof createRatingSchema
>;

export const updateRatingSchema = z.object({
  score: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export type UpdateRatingDTO = z.infer<
  typeof updateRatingSchema
>;

export const listOccurrencesSchema = z.object({
  category: z.string().min(1).optional(),

  status: z
    .enum([
      "ABERTA",
      "EM_ANALISE",
      "EM_ATENDIMENTO",
      "RESOLVIDA",
      "CANCELADA",
    ])
    .optional(),

  priority: z
    .enum([
      "BAIXA",
      "MEDIA",
      "ALTA",
      "URGENTE",
    ])
    .optional(),

  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),
});

export type ListOccurrencesDTO = z.infer<
  typeof listOccurrencesSchema
>;
