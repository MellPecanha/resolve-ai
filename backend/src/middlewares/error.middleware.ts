import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: error.issues,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Erro interno do servidor",
  });
}
