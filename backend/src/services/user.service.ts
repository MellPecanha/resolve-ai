import bcrypt from "bcryptjs";

import { db } from "../prisma/db.js";
import type { UpdateProfileDTO } from "../dtos/user.dto.js";
import { AppError } from "../errors/AppError.js";

export async function listManagers() {
  return db.orm.public.User
    .where({
      role: "GESTOR",
    })
    .select(
      "id",
      "name",
      "email",
      "role",
    )
    .orderBy([
      (user) => user.name.asc(),
      (user) => user.id.asc(),
    ])
    .all();
}

export async function updateProfile(
  userId: number,
  data: UpdateProfileDTO,
) {
  const user = await db.orm.public.User
    .where({
      id: userId,
    })
    .first();

  if (!user) {
    throw new AppError(
      "Usuário não encontrado",
      404,
    );
  }

  const existingUser =
    await db.orm.public.User
      .where({
        email: data.email,
      })
      .first();

  if (
    existingUser &&
    existingUser.id !== userId
  ) {
    throw new AppError(
      "Este e-mail já está cadastrado",
      409,
    );
  }

  const changingPassword =
    data.currentPassword !== undefined ||
    data.newPassword !== undefined ||
    data.confirmNewPassword !== undefined;

  let passwordHash: string | undefined;

  if (changingPassword) {
    const passwordMatches =
      await bcrypt.compare(
        data.currentPassword!,
        user.password,
      );

    if (!passwordMatches) {
      throw new AppError(
        "A senha atual está incorreta",
        401,
      );
    }

    passwordHash = await bcrypt.hash(
      data.newPassword!,
      12,
    );
  }

  const updatedUser =
    await db.orm.public.User
      .where({
        id: userId,
      })
      .update({
        name: data.name,
        email: data.email,
        ...(passwordHash
          ? {
            password: passwordHash,
          }
          : {}),
      });

  if (!updatedUser) {
    throw new AppError(
      "Não foi possível atualizar o usuário",
      500,
    );
  }

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  };
}
