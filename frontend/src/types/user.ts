import type { User, UserRole } from "./auth";

export interface Manager {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export type UpdateProfileResponse = User;
