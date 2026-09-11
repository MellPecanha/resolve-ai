import type { Request, Response } from "express";

import {
  createOccurrenceSchema,
  updatePrioritySchema,
  assignResponsibleSchema,
  updateStatusSchema,
  updateSolutionSchema,
  createCommentSchema,
  createRatingSchema,
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
  listStatusHistory,
  createRating,
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
  const occurrences =
    await listOccurrences(
      req.user!.id,
      req.user!.role,
    );

  return res.json(occurrences);
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
    await listStatusHistory(
      occurrenceId,
      req.user!.id,
      req.user!.role,
    );

  return res.json(history);
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