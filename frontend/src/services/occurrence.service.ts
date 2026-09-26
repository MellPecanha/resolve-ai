import { api } from "./api";

import type {
  Occurrence,
  OccurrenceComment,
  OccurrenceHistory,
  OccurrencePriority,
  OccurrenceRating,
  OccurrenceStatus,
} from "../types/occurrence";

export interface CreateOccurrenceData {
  title: string;
  description: string;
  category: string;
  location: string;
  imageKey?: string;
}

export interface ListOccurrencesFilters {
  category?: string;
  status?: OccurrenceStatus;
  priority?: OccurrencePriority;
  page?: number;
  limit?: number;
}

export interface OccurrenceListResponse {
  data: Occurrence[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function listOccurrences(
  filters?: ListOccurrencesFilters,
): Promise<OccurrenceListResponse> {
  const response = await api.get<OccurrenceListResponse>("/occurrences", {
    params: filters,
  });

  return response.data;
}

export async function getOccurrence(id: number): Promise<Occurrence> {
  const response = await api.get<Occurrence>(`/occurrences/${id}`);

  return response.data;
}

export async function createOccurrence(
  data: CreateOccurrenceData,
): Promise<Occurrence> {
  const response = await api.post<Occurrence>("/occurrences", data);

  return response.data;
}

type PresignedUpload = {
  key: string;
  url: string;
  fields: Record<string, string>;
};

export async function uploadOccurrenceImage(
  file: File,
): Promise<string> {
  const response = await api.post<PresignedUpload>(
    "/uploads/occurrence-image",
    {
      contentType: file.type,
      size: file.size,
    },
  );

  const upload = response.data;
  const formData = new FormData();

  for (const [name, value] of Object.entries(upload.fields)) {
    formData.append(name, value);
  }

  formData.append("file", file);

  const uploadResponse = await fetch(upload.url, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Não foi possível enviar a imagem.");
  }

  return upload.key;
}

export async function getOccurrenceHistory(
  id: number,
): Promise<OccurrenceHistory[]> {
  const response = await api.get<OccurrenceHistory[]>(
    `/occurrences/${id}/history`,
  );

  return response.data;
}

export async function getOccurrenceComments(
  id: number,
): Promise<OccurrenceComment[]> {
  const response = await api.get<OccurrenceComment[]>(
    `/occurrences/${id}/comments`,
  );

  return response.data;
}

export async function addOccurrenceComment(
  id: number,
  content: string,
): Promise<OccurrenceComment> {
  const response = await api.post<OccurrenceComment>(
    `/occurrences/${id}/comments`,
    {
      content,
    },
  );

  return response.data;
}

export async function getOccurrenceRating(
  id: number,
): Promise<OccurrenceRating | null> {
  const response = await api.get<OccurrenceRating | null>(
    `/occurrences/${id}/rating`,
  );

  return response.data;
}

export async function createOccurrenceRating(
  id: number,
  score: number,
  comment?: string,
): Promise<OccurrenceRating> {
  const response = await api.post<OccurrenceRating>(
    `/occurrences/${id}/rating`,
    {
      score,
      comment,
    },
  );

  return response.data;
}

export async function updateOccurrenceRating(
  id: number,
  score: number,
  comment?: string,
): Promise<OccurrenceRating> {
  const response = await api.patch<OccurrenceRating>(
    `/occurrences/${id}/rating`,
    {
      score,
      comment,
    },
  );

  return response.data;
}

export async function updateOccurrencePriority(
  id: number,
  priority: OccurrencePriority,
): Promise<Occurrence> {
  const response = await api.patch<Occurrence>(
    `/occurrences/${id}/priority`,
    {
      priority,
    },
  );

  return response.data;
}

export async function assignOccurrenceResponsible(
  id: number,
  responsibleId: number,
): Promise<Occurrence> {
  const response = await api.patch<Occurrence>(
    `/occurrences/${id}/responsible`,
    {
      responsibleId,
    },
  );

  return response.data;
}

export async function updateOccurrenceStatus(
  id: number,
  status: OccurrenceStatus,
  observation?: string,
): Promise<Occurrence> {
  const response = await api.patch<Occurrence>(
    `/occurrences/${id}/status`,
    {
      status,
      observation,
    },
  );

  return response.data;
}

export async function updateOccurrenceSolution(
  id: number,
  solution: string,
): Promise<Occurrence> {
  const response = await api.patch<Occurrence>(
    `/occurrences/${id}/solution`,
    {
      solution,
    },
  );

  return response.data;
}
