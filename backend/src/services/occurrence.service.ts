import { db } from "../prisma/db.js";

import type {
  CreateOccurrenceDTO,
  UpdatePriorityDTO,
  UpdateSolutionDTO,
  UpdateStatusDTO,
} from "../dtos/occurrence.dto.js";

import { AppError } from "../errors/AppError.js";

type UserRole = "SOLICITANTE" | "GESTOR";

export async function createOccurrence(
  data: CreateOccurrenceDTO,
  requesterId: number,
) {
  const occurrence = await db.orm.public.Occurrence.create({
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    imageUrl: data.imageUrl,
    requesterId,
  });

  return occurrence;
}

export async function listOccurrences(
  userId: number,
  role: UserRole,
) {
  if (role === "GESTOR") {
    return db.orm.public.Occurrence
      .orderBy((occurrence) => occurrence.createdAt.desc())
      .all();
  }

  return db.orm.public.Occurrence
    .where({
      requesterId: userId,
    })
    .orderBy((occurrence) => occurrence.createdAt.desc())
    .all();
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

  return occurrence;
}

export async function updatePriority(
  occurrenceId: number,
  priority: UpdatePriorityDTO["priority"],
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
      priority,
    });
}

export async function assignResponsible(
  occurrenceId: number,
  responsibleId: number,
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

  return db.orm.public.Occurrence
    .where({ id: occurrenceId })
    .update({
      responsibleId,
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

    await tx.orm.public.OccurrenceStatusHistory.create({
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
  content: string,
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

export async function listStatusHistory(
  occurrenceId: number,
  userId: number,
  role: UserRole,
) {
  await findOccurrenceById(
    occurrenceId,
    userId,
    role,
  );

  return db.orm.public.OccurrenceStatusHistory
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

  const existingRating =
    await db.orm.public.Rating
      .where({ occurrenceId })
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
    );
  }

  if (occurrence.status !== "RESOLVIDA") {
    throw new AppError(
      "A ocorrência precisa estar resolvida",
    );
  }

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