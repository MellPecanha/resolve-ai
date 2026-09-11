import type {
  NextFunction,
  Request,
  Response,
} from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.js";
import { AppError } from "../errors/AppError.js";

type TokenPayload = {
  sub: string;
  role: "SOLICITANTE" | "GESTOR";
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: "SOLICITANTE" | "GESTOR";
      };
    }
  }
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError(
      "Token não informado",
      401,
    );
  }

  const [scheme, token] =
    authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError(
      "Token inválido",
      401,
    );
  }

  try {
    const payload = jwt.verify(
      token,
      authConfig.jwtSecret,
    ) as TokenPayload;

    req.user = {
      id: Number(payload.sub),
      role: payload.role,
    };

    next();
  } catch {
    throw new AppError(
      "Token inválido ou expirado",
      401,
    );
  }
}