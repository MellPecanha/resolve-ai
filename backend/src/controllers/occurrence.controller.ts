import type { Request, Response } from "express";

import {
  createOccurrenceSchema,
  listOccurrencesSchema,
  updatePrioritySchema,
  assignResponsibleSchema,
  updateStatusSchema,
  updateSolutionSchema,
  createCommentSchema,
  createRatingSchema,
  updateRatingSchema,
} from "../dtos/occurrence.dto.js";

import {
  createOccurrence,
  listOccurrences,
  findOccurrenceById,
  updatePriority,
  assignResponsible,
  updateStatus,
  updateSolution,
  createComment,
  listComments,
  listOccurrenceHistory,
  createRating,
  getRating,
  updateRating,
} from "../services/occurrence.service.js";

import { AppError } from "../errors/AppError.js";

export async function create(
  req: Request,
  res: Response,
) {
  const data =
    createOccurrenceSchema.parse(req.body);

  const occurrence =
    await createOccurrence(
      data,
      req.user!.id,
    );

  return res.status(201).json(occurrence);
}

export async function list(
  req: Request,
  res: Response,
) {
  const filters =
    listOccurrencesSchema.parse(req.query);

  const result = await listOccurrences(
    req.user!.id,
    req.user!.role,
    filters,
  );

  return res.json(result);
}

export async function findById(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const occurrence =
    await findOccurrenceById(
      occurrenceId,
      req.user!.id,
      req.user!.role,
    );

  return res.json(occurrence);
}

export async function changePriority(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const data =
    updatePrioritySchema.parse(
      req.body,
    );

  const occurrence =
    await updatePriority(
      occurrenceId,
      data.priority,
      req.user!.id,
    );

  return res.json(occurrence);
}

export async function assign(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const data =
    assignResponsibleSchema.parse(
      req.body,
    );

  const occurrence =
    await assignResponsible(
      occurrenceId,
      data.responsibleId,
      req.user!.id,
    );

  return res.json(occurrence);
}

export async function changeStatus(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const data =
    updateStatusSchema.parse(
      req.body,
    );

  const occurrence =
    await updateStatus(
      occurrenceId,
      data,
      req.user!.id,
    );

  return res.json(occurrence);
}

export async function changeSolution(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const data =
    updateSolutionSchema.parse(
      req.body,
    );

  const occurrence =
    await updateSolution(
      occurrenceId,
      data,
    );

  return res.json(occurrence);
}

export async function addComment(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const data =
    createCommentSchema.parse(
      req.body,
    );

  const comment =
    await createComment(
      occurrenceId,
      req.user!.id,
      req.user!.role,
      data.content,
    );

  return res.status(201).json(comment);
}

export async function getComments(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const comments =
    await listComments(
      occurrenceId,
      req.user!.id,
      req.user!.role,
    );

  return res.json(comments);
}

export async function getHistory(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const history =
    await listOccurrenceHistory(
      occurrenceId,
      req.user!.id,
      req.user!.role,
    );

  return res.json(history);
}

export async function getRatingByOccurrence(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const rating =
    await getRating(
      occurrenceId,
      req.user!.id,
      req.user!.role,
    );

  return res.json(rating);
}

export async function rate(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const data =
    createRatingSchema.parse(
      req.body,
    );

  const rating =
    await createRating(
      occurrenceId,
      req.user!.id,
      data.score,
      data.comment,
    );

  return res.status(201).json(rating);
}

export async function updateOccurrenceRating(
  req: Request,
  res: Response,
) {
  const occurrenceId =
    Number(req.params.id);

  if (Number.isNaN(occurrenceId)) {
    throw new AppError(
      "ID inválido",
      400,
    );
  }

  const data =
    updateRatingSchema.parse(
      req.body,
    );

  const rating =
    await updateRating(
      occurrenceId,
      req.user!.id,
      data.score,
      data.comment,
    );

  return res.json(rating);
}
