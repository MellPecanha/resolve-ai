import request from "supertest";
import bcrypt from "bcryptjs";
import { db } from "../prisma/db.js";
import { app } from "../app.js";

export async function createTestUser({
  name,
  email,
  role = "SOLICITANTE",
}: {
  name: string;
  email: string;
  role?: "SOLICITANTE" | "GESTOR";
}) {
  const password = await bcrypt.hash("123456", 12);

  return db.orm.public.User.create({
    name,
    email,
    password,
    role,
  });
}

export async function loginAs(
  email: string,
  password = "123456",
) {
  const response = await request(app)
    .post("/auth/login")
    .send({
      email,
      password,
    });

  if (response.status !== 200) {
    throw new Error(
      `Falha ao fazer login de ${email}: ${JSON.stringify(response.body)}`,
    );
  }

  return response.body.token as string;
}

export async function createTestOccurrence(
  requesterId: number,
) {
  return db.orm.public.Occurrence.create({
    title: "Problema de iluminação",
    description: "Poste apagado na rua.",
    category: "Iluminação",
    location: "Rua de teste, 123",
    requesterId,
  });
}
