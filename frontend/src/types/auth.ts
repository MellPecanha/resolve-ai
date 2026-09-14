export type UserRole = "SOLICITANTE" | "GESTOR";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
