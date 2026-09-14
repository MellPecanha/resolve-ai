import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { User } from "../types/auth";
import {
  AuthContext,
  type AuthContextData,
} from "./AuthContext";

const TOKEN_KEY = "resolve-ai-token";
const USER_KEY = "resolve-ai-user";

interface AuthProviderProps {
  children: ReactNode;
}

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): User | null {
  const storedUser =
    localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem(USER_KEY);

    return null;
  }
}

function AuthProvider({
  children,
}: AuthProviderProps) {
  const [token, setToken] =
    useState<string | null>(
      getStoredToken,
    );

  const [user, setUser] =
    useState<User | null>(
      getStoredUser,
    );

  function signIn(
    newToken: string,
    newUser: User,
  ) {
    localStorage.setItem(
      TOKEN_KEY,
      newToken,
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(newUser),
    );

    setToken(newToken);
    setUser(newUser);
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  }

  const value: AuthContextData =
    useMemo(
      () => ({
        user,
        token,
        isAuthenticated: Boolean(
          token && user,
        ),
        signIn,
        signOut,
      }),
      [token, user],
    );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
