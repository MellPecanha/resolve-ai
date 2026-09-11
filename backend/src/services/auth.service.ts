import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../prisma/db.js";
import type { LoginDTO, RegisterDTO } from "../dtos/auth.dto.js";
import { authConfig } from "../config/auth.js";
import { AppError } from "../errors/AppError.js";

export async function registerUser(data: RegisterDTO) {
  const existingUser = await db.orm.public.User
    .where({ email: data.email })
    .first();

  if (existingUser) {
    throw new AppError(
  "E-mail já cadastrado",
  409,
);
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await db.orm.public.User.create({
    name: data.name,
    email: data.email,
    password: passwordHash,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function loginUser(data: LoginDTO) {
  const user = await db.orm.public.User
    .where({ email: data.email })
    .first();

  if (!user) {
    throw new AppError(
  "E-mail ou senha inválidos",
  401,
);
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.password,
  );

  if (!passwordMatches) {
    throw new AppError(
  "E-mail ou senha inválidos",
  401,
);
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    authConfig.jwtSecret,
    {
      expiresIn: authConfig.jwtExpiresIn,
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
