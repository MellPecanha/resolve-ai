import type { UserRole } from "./auth";

export interface Manager {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
