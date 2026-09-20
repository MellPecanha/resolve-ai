import { api } from "./api";

import type {
  Manager,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "../types/user";

export async function listManagers(): Promise<Manager[]> {
  const response = await api.get<Manager[]>(
    "/users/gestores",
  );

  return response.data;
}

export async function updateMyProfile(
  data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> {
  const response =
    await api.patch<UpdateProfileResponse>(
      "/users/me",
      data,
    );

  return response.data;
}
