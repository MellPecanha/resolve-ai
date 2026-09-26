import { db } from "../prisma/db.js";

import type {
  CreateOccurrenceDTO,
  UpdatePriorityDTO,
  UpdateSolutionDTO,
  UpdateStatusDTO,
  ListOccurrencesDTO,
} from "../dtos/occurrence.dto.js";

import { AppError } from "../errors/AppError.js";
import {
  getOccurrenceImageUrl,
  isManagedOccurrenceImageKey,
  isOccurrenceImageKey,
} from "./storage.service.js";

type UserRole = "SOLICITANTE" | "GESTOR";

async function withPrivateImageUrl<
  T extends { imageUrl: string | null },
>(occurrence: T) {
  if (
    !occurrence.imageUrl ||
    !isManagedOccurrenceImageKey(occurrence.imageUrl)
  ) {
    return occurrence;
  }

  return {
    ...occurrence,
    imageUrl: await getOccurrenceImageUrl(
      occurrence.imageUrl,
    ),
  };
}

export async function createOccurrence(
  data: CreateOccurrenceDTO,
  requesterId: number,
) {
  if (
    data.imageKey &&
    !isOccurrenceImageKey(data.imageKey, requesterId)
  ) {
    throw new AppError(
      "Imagem de ocorrência inválida",
      400,
    );
  }

  const occurrence = await db.orm.public.Occurrence.create({
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    imageUrl: data.imageKey,
    requesterId,
  });

  return withPrivateImageUrl(occurrence);
}

export async function listOccurrences(
  userId: number,
  role: UserRole,
  filters: ListOccurrencesDTO,
) {
  const {
    category,
    status,
    priority,
    page,
    limit,
  } = filters;

  let query = db.orm.public.Occurrence;

  if (role === "SOLICITANTE") {
    query = query.where({
      requesterId: userId,
    });
  }

  if (category) {
    query = query.where({
      category,
    });
  }

  if (status) {
    query = query.where({
      status,
    });
  }

  if (priority) {
    query = query.where({
      priority,
    });
  }

  const allOccurrences = await query.all();
  const total = allOccurrences.length;

  const occurrences = await query
    .orderBy([
      (occurrence) => occurrence.createdAt.desc(),
      (occurrence) => occurrence.id.desc(),
    ])
    .limit(limit)
    .offset((page - 1) * limit)
    .all();

  return {
    data: await Promise.all(
      occurrences.map(withPrivateImageUrl),
    ),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findOccurrenceById(
  occurrenceId: number,
  userId: number,
  role: UserRole,
) {
  const occurrence =
    await db.orm.public.Occurrence
      .where({
        id: occurrenceId,
      })
      .first();

  if (!occurrence) {
    throw new AppError(
      "Ocorrência não encontrada",
      404,
    );
  }

  if (
    role === "SOLICITANTE" &&
    occurrence.requesterId !== userId
  ) {
    throw new AppError(
      "Você não tem acesso a esta ocorrência",
      403,
    );
  }

  return withPrivateImageUrl(occurrence);
}

export async function updatePriority(
  occurrenceId: number,
  priority: UpdatePriorityDTO["priority"],
  changedById: number,
) {
  const occurrence =
    await db.orm.public.Occurrence
      .where({ id: occurrenceId })
      .first();

  if (!occurrence) {
    throw new AppError(
      "Ocorrência não encontrada",
      404,
    );
  }

  if (occurrence.priority === priority) {
    throw new AppError(
      "A ocorrência já está com esta prioridade",
      400,
    );
  }

  return db.transaction(async (tx) => {
    const updatedOccurrence =
      await tx.orm.public.Occurrence
        .where({ id: occurrenceId })
        .update({
          priority,
        });

    await tx.orm.public.OccurrenceHistory.create({
      type: "PRIORIDADE",
      occurrenceId,
      previousPriority: occurrence.priority,
      newPriority: priority,
      changedById,
    });

    return updatedOccurrence;
  });
}

export async function assignResponsible(
  occurrenceId: number,
  responsibleId: number,
  changedById: number,
) {
  const occurrence =
    await db.orm.public.Occurrence
      .where({ id: occurrenceId })
      .first();

  if (!occurrence) {
    throw new AppError(
      "Ocorrência não encontrada",
      404,
    );
  }

  const responsible =
    await db.orm.public.User
      .where({ id: responsibleId })
      .first();

  if (!responsible) {
    throw new AppError(
      "Usuário responsável não encontrado",
      404,
    );
  }

  if (responsible.role !== "GESTOR") {
    throw new AppError(
      "O responsável deve ser um gestor",
      400,
    );
  }

  if (occurrence.responsibleId === responsibleId) {
    throw new AppError(
      "Este gestor já está atribuído à ocorrência",
      400,
    );
  }

  return db.transaction(async (tx) => {
    const updatedOccurrence =
      await tx.orm.public.Occurrence
        .where({ id: occurrenceId })
        .update({
          responsibleId,
        });

    await tx.orm.public.OccurrenceHistory.create({
      type: "RESPONSAVEL",
      occurrenceId,
      previousResponsibleId: occurrence.responsibleId,
      newResponsibleId: responsibleId,
      changedById,
    });

    return updatedOccurrence;
  });
}

export async function updateStatus(
  occurrenceId: number,
  data: UpdateStatusDTO,
  changedById: number,
) {
  const occurrence =
    await db.orm.public.Occurrence
      .where({ id: occurrenceId })
      .first();

  if (!occurrence) {
    throw new AppError(
      "Ocorrência não encontrada",
      404,
    );
  }

  if (occurrence.status === data.status) {
    throw new AppError(
      "A ocorrência já está com este status",
      400,
    );
  }

  return db.transaction(async (tx) => {
    const updatedOccurrence =
      await tx.orm.public.Occurrence
        .where({ id: occurrenceId })
        .update({
          status: data.status,
        });

    await tx.orm.public.OccurrenceHistory.create({
      type: "STATUS",
      occurrenceId,
      previousStatus: occurrence.status,
      newStatus: data.status,
      changedById,
      observation: data.observation,
    });

    return updatedOccurrence;
  });
}

export async function updateSolution(
  occurrenceId: number,
  data: UpdateSolutionDTO,
) {
  const occurrence =
    await db.orm.public.Occurrence
      .where({ id: occurrenceId })
      .first();

  if (!occurrence) {
    throw new AppError(
      "Ocorrência não encontrada",
      404,
    );
  }

  return db.orm.public.Occurrence
    .where({ id: occurrenceId })
    .update({
      solution: data.solution,
    });
}

export async function createComment(
  occurrenceId: number,
  authorId: number,
  role: UserRole,
  content: string,
) {
  await findOccurrenceById(
    occurrenceId,
    authorId,
    role,
  );

  return db.orm.public.Comment.create({
    content,
    occurrenceId,
    authorId,
  });
}

export async function listComments(
  occurrenceId: number,
  userId: number,
  role: UserRole,
) {
  await findOccurrenceById(
    occurrenceId,
    userId,
    role,
  );

  return db.orm.public.Comment
    .where({
      occurrenceId,
    })
    .include(
      "author",
      (author) =>
        author.select(
          "id",
          "name",
          "role",
        ),
    )
    .orderBy([
      (comment) => comment.createdAt.asc(),
      (comment) => comment.id.asc(),
    ])
    .all();
}

export async function listOccurrenceHistory(
  occurrenceId: number,
  userId: number,
  role: UserRole,
) {
  await findOccurrenceById(
    occurrenceId,
    userId,
    role,
  );

  return db.orm.public.OccurrenceHistory
    .where({
      occurrenceId,
    })
    .include(
      "changedBy",
      (user) =>
        user.select(
          "id",
          "name",
          "role",
        ),
    )
    .orderBy([
      (history) => history.createdAt.asc(),
      (history) => history.id.asc(),
    ])
    .all();
}

export async function getRating(
  occurrenceId: number,
  userId: number,
  role: UserRole,
) {
  const occurrence =
    await db.orm.public.Occurrence
      .where({ id: occurrenceId })
      .first();

  if (!occurrence) {
    throw new AppError(
      "Ocorrência não encontrada",
      404,
    );
  }

  if (
    role === "SOLICITANTE" &&
    occurrence.requesterId !== userId
  ) {
    throw new AppError(
      "Você não tem acesso a esta avaliação",
      403,
    );
  }

  return db.orm.public.Rating
    .where({ occurrenceId })
    .first();
}

export async function createRating(
  occurrenceId: number,
  userId: number,
  score: number,
  comment?: string,
) {
  const occurrence =
    await db.orm.public.Occurrence
      .where({ id: occurrenceId })
      .first();

  if (!occurrence) {
    throw new AppError(
      "Ocorrência não encontrada",
      404,
    );
  }

  if (occurrence.requesterId !== userId) {
    throw new AppError(
      "Somente o solicitante pode avaliar a ocorrência",
      403,
    );
  }

  if (occurrence.status !== "RESOLVIDA") {
    throw new AppError(
      "A ocorrência precisa estar resolvida",
      400,
    );
  }

  const existingRating =
    await db.orm.public.Rating
      .where({ occurrenceId })
      .first();

  if (existingRating) {
    throw new AppError(
      "Esta ocorrência já foi avaliada",
      409,
    );
  }

  return db.orm.public.Rating.create({
    occurrenceId,
    userId,
    score,
    comment,
  });
}

export async function updateRating(
  occurrenceId: number,
  userId: number,
  score: number,
  comment?: string,
) {
  const occurrence =
    await db.orm.public.Occurrence
      .where({ id: occurrenceId })
      .first();

  if (!occurrence) {
    throw new AppError(
      "Ocorrência não encontrada",
      404,
    );
  }

  if (occurrence.requesterId !== userId) {
    throw new AppError(
      "Somente o solicitante pode alterar a avaliação",
      403,
    );
  }

  if (occurrence.status !== "RESOLVIDA") {
    throw new AppError(
      "A ocorrência precisa estar resolvida",
      400,
    );
  }

  const existingRating =
    await db.orm.public.Rating
      .where({ occurrenceId })
      .first();

  if (!existingRating) {
    throw new AppError(
      "Esta ocorrência ainda não foi avaliada",
      404,
    );
  }

  return db.orm.public.Rating
    .where({ id: existingRating.id })
    .update({
      score,
      comment,
    });
}
