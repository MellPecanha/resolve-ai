import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../dtos/auth.dto.js";
import { loginUser, registerUser } from "../services/auth.service.js";

export async function register(
  req: Request,
  res: Response,
) {
  const data = registerSchema.parse(req.body);

  const user = await registerUser(data);

  return res.status(201).json(user);
}

export async function login(
  req: Request,
  res: Response,
) {
  const data = loginSchema.parse(req.body);

  const result = await loginUser(data);

  return res.status(200).json(result);
}