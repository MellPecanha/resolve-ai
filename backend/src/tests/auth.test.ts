import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("Auth", () => {
  it("deve registrar um novo usuário", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Usuário Teste",
        email: `teste-${Date.now()}@example.com`,
        password: "123456",
      });

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("role");

    expect(response.body).not.toHaveProperty("password");
  });

  it("não deve permitir email duplicado", async () => {
    const email = `duplicado-${Date.now()}@example.com`;

    await request(app)
      .post("/auth/register")
      .send({
        name: "Primeiro Usuário",
        email,
        password: "123456",
      });

    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Segundo Usuário",
        email,
        password: "123456",
      });

    expect(response.status).toBe(409);
  });

  it("deve realizar login com credenciais válidas", async () => {
    const email = `login-${Date.now()}@example.com`;

    await request(app)
      .post("/auth/register")
      .send({
        name: "Login Teste",
        email,
        password: "123456",
      });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email,
        password: "123456",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });

  it("não deve realizar login com senha incorreta", async () => {
    const email = `senha-${Date.now()}@example.com`;

    await request(app)
      .post("/auth/register")
      .send({
        name: "Senha Teste",
        email,
        password: "123456",
      });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email,
        password: "senha-incorreta",
      });

    expect(response.status).toBe(401);
  });
});
