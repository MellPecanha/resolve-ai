import { createContext } from "react";

import type { User } from "../types/auth";

export interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
}

export const AuthContext =
  createContext<AuthContextData | undefined>(
    undefined,
  );
