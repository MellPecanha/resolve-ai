export type OccurrenceStatus =
  | "ABERTA"
  | "EM_ANALISE"
  | "EM_ATENDIMENTO"
  | "RESOLVIDA"
  | "CANCELADA";

export type OccurrencePriority =
  | "BAIXA"
  | "MEDIA"
  | "ALTA"
  | "URGENTE";

export interface Occurrence {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl?: string | null;
  status: OccurrenceStatus;
  priority: OccurrencePriority;
  solution?: string | null;
  requesterId: number;
  responsibleId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export type OccurrenceHistoryType =
  | "STATUS"
  | "PRIORIDADE"
  | "RESPONSAVEL";

export interface OccurrenceHistory {
  id: number;
  occurrenceId: number;

  type: OccurrenceHistoryType;

  previousStatus: OccurrenceStatus | null;
  newStatus: OccurrenceStatus | null;

  previousPriority: OccurrencePriority | null;
  newPriority: OccurrencePriority | null;

  previousResponsibleId: number | null;
  newResponsibleId: number | null;

  changedById: number;
  observation: string | null;
  createdAt: string;

  changedBy?: {
    id: number;
    name: string;
    role: "SOLICITANTE" | "GESTOR";
  };
}
export interface OccurrenceComment {
  id: number;
  content: string;
  occurrenceId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    role: "SOLICITANTE" | "GESTOR";
  };
}

export interface OccurrenceRating {
  id: number;
  score: number;
  comment: string | null;
  occurrenceId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
