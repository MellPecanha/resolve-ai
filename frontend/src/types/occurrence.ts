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

export interface OccurrenceHistory {
  id: number;
  occurrenceId: number;
  previousStatus: OccurrenceStatus | null;
  newStatus: OccurrenceStatus;
  changedById: number;
  observation: string | null;
  createdAt: string;
}
