import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

type UserRole =
  | "SOLICITANTE"
  | "GESTOR";

export function authorize(
  ...allowedRoles: UserRole[]
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new AppError(
        "Usuário não autenticado",
        401,
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        "Você não tem permissão para realizar esta ação",
        403,
      );
    }

    next();
  };
}