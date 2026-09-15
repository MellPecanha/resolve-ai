import { api } from "./api";

import type { Manager } from "../types/user";

export async function listManagers(): Promise<Manager[]> {
  const response = await api.get<Manager[]>(
    "/users/gestores",
  );

  return response.data;
}
