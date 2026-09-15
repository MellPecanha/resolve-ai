import { api } from "./api";
import type { Occurrence, OccurrenceHistory } from "../types/occurrence";

export interface CreateOccurrenceData {
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl?: string;
}

export async function listOccurrences(): Promise<Occurrence[]> {
  const response = await api.get<{ data: Occurrence[] }>(
    "/occurrences",
  );

  return response.data.data;
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

export async function getOccurrenceHistory(
  id: number,
): Promise<OccurrenceHistory[]> {
  const response = await api.get<OccurrenceHistory[]>(
    `/occurrences/${id}/history`,
  );

  return response.data;
}
