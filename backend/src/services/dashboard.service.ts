import { db } from "../prisma/db.js";

const statuses = [
  "ABERTA",
  "EM_ANALISE",
  "EM_ATENDIMENTO",
  "RESOLVIDA",
  "CANCELADA",
] as const;

const priorities = [
  "BAIXA",
  "MEDIA",
  "ALTA",
  "URGENTE",
] as const;

export async function getDashboard() {
  const occurrences =
    await db.orm.public.Occurrence.all();

  const byStatus = Object.fromEntries(
    statuses.map((status) => [
      status,
      occurrences.filter(
        (occurrence) =>
          occurrence.status === status,
      ).length,
    ]),
  );

  const byPriority = Object.fromEntries(
    priorities.map((priority) => [
      priority,
      occurrences.filter(
        (occurrence) =>
          occurrence.priority === priority,
      ).length,
    ]),
  );

  const categoryMap = new Map<
    string,
    number
  >();

  for (const occurrence of occurrences) {
    const current =
      categoryMap.get(occurrence.category) ?? 0;

    categoryMap.set(
      occurrence.category,
      current + 1,
    );
  }

  const byCategory = Array.from(
    categoryMap.entries(),
  )
    .map(([category, total]) => ({
      category,
      total,
    }))
    .sort(
      (a, b) => b.total - a.total,
    );

  return {
    total: occurrences.length,

    byStatus,

    byPriority,

    byCategory,
  };
}
