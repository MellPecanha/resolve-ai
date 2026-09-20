import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../app.js";
import {
  createTestUser,
  loginAs,
} from "./helpers.js";

describe("Users", () => {
  describe("GET /users/gestores", () => {
    it("deve listar os gestores autenticados em ordem alfabética", async () => {
      const gestorB = await createTestUser({
        name: "Bruno Gestor",
        email: `bruno-${Date.now()}@test.com`,
        role: "GESTOR",
      });

      const gestorA = await createTestUser({
        name: "Ana Gestora",
        email: `ana-${Date.now()}@test.com`,
        role: "GESTOR",
      });

      await createTestUser({
        name: "Carlos Solicitante",
        email: `carlos-${Date.now()}@test.com`,
        role: "SOLICITANTE",
      });

      const token = await loginAs(gestorB.email);

      const response = await request(app)
        .get("/users/gestores")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);

      expect(response.body.length).toBeGreaterThanOrEqual(2);

      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: gestorA.id,
            name: gestorA.name,
            email: gestorA.email,
            role: "GESTOR",
          },
          {
            id: gestorB.id,
            name: gestorB.name,
            email: gestorB.email,
            role: "GESTOR",
          },
        ]),
      );
    });

    it("não deve listar solicitantes", async () => {
      const gestor = await createTestUser({
        name: "Gestor",
        email: `gestor-${Date.now()}@test.com`,
        role: "GESTOR",
      });

      await createTestUser({
        name: "Solicitante",
        email: `solicitante-${Date.now()}@test.com`,
        role: "SOLICITANTE",
      });

      const token = await loginAs(gestor.email);

      const response = await request(app)
        .get("/users/gestores")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: gestor.id,
            name: gestor.name,
            email: gestor.email,
            role: "GESTOR",
          },
        ]),
      );

      expect(response.body).not.toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: "Solicitante",
            email: expect.stringContaining("@test.com"),
            role: "SOLICITANTE",
          },
        ]),
      );
    });

    it("não deve permitir acesso sem autenticação", async () => {
      const response = await request(app)
        .get("/users/gestores");

      expect(response.status).toBe(401);
    });

    it("não deve permitir acesso para solicitante", async () => {
      const solicitante = await createTestUser({
        name: "Solicitante",
        email: `solicitante-${Date.now()}@test.com`,
        role: "SOLICITANTE",
      });

      const token = await loginAs(solicitante.email);

      const response = await request(app)
        .get("/users/gestores")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe("PATCH /users/me", () => {
    it("deve atualizar nome e e-mail do usuário autenticado", async () => {
      const user = await createTestUser({
        name: "Usuário Original",
        email: `original-${Date.now()}@test.com`,
      });

      const token = await loginAs(user.email);

      const response = await request(app)
        .patch("/users/me")
        .set(
          "Authorization",
          `Bearer ${token}`,
        )
        .send({
          name: "Usuário Atualizado",
          email: `atualizado-${Date.now()}@test.com`,
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        id: user.id,
        name: "Usuário Atualizado",
        email: expect.stringContaining(
          "atualizado-",
        ),
        role: "SOLICITANTE",
      });
    });

    it("não deve permitir e-mail já utilizado por outro usuário", async () => {
      const existingUser =
        await createTestUser({
          name: "Outro Usuário",
          email: `existente-${Date.now()}@test.com`,
        });

      const user = await createTestUser({
        name: "Usuário",
        email: `usuario-${Date.now()}@test.com`,
      });

      const token = await loginAs(user.email);

      const response = await request(app)
        .patch("/users/me")
        .set(
          "Authorization",
          `Bearer ${token}`,
        )
        .send({
          name: "Usuário Atualizado",
          email: existingUser.email,
        });

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        message: "Este e-mail já está cadastrado",
      });
    });

    it("deve alterar a senha quando a senha atual estiver correta", async () => {
      const user = await createTestUser({
        name: "Usuário",
        email: `senha-${Date.now()}@test.com`,
      });

      const token = await loginAs(user.email);

      const response = await request(app)
        .patch("/users/me")
        .set(
          "Authorization",
          `Bearer ${token}`,
        )
        .send({
          name: user.name,
          email: user.email,
          currentPassword: "123456",
          newPassword: "654321",
          confirmNewPassword: "654321",
        });

      expect(response.status).toBe(200);

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({
          email: user.email,
          password: "654321",
        });

      expect(loginResponse.status).toBe(200);
    });

    it("não deve alterar a senha com senha atual incorreta", async () => {
      const user = await createTestUser({
        name: "Usuário",
        email: `senha-incorreta-${Date.now()}@test.com`,
      });

      const token = await loginAs(user.email);

      const response = await request(app)
        .patch("/users/me")
        .set(
          "Authorization",
          `Bearer ${token}`,
        )
        .send({
          name: user.name,
          email: user.email,
          currentPassword: "senha-errada",
          newPassword: "654321",
          confirmNewPassword: "654321",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "A senha atual está incorreta",
      });
    });

    it("não deve permitir troca de senha com confirmação diferente", async () => {
      const user = await createTestUser({
        name: "Usuário",
        email: `confirmacao-${Date.now()}@test.com`,
      });

      const token = await loginAs(user.email);

      const response = await request(app)
        .patch("/users/me")
        .set(
          "Authorization",
          `Bearer ${token}`,
        )
        .send({
          name: user.name,
          email: user.email,
          currentPassword: "123456",
          newPassword: "654321",
          confirmNewPassword: "123456",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Dados inválidos",
      );
    });

    it("não deve permitir acesso sem autenticação", async () => {
      const response = await request(app)
        .patch("/users/me")
        .send({
          name: "Usuário",
          email: "usuario@email.com",
        });

      expect(response.status).toBe(401);
    });

    it("deve manter a role original do usuário", async () => {
      const user = await createTestUser({
        name: "Gestor",
        email: `gestor-profile-${Date.now()}@test.com`,
        role: "GESTOR",
      });

      const token = await loginAs(user.email);

      const response = await request(app)
        .patch("/users/me")
        .set(
          "Authorization",
          `Bearer ${token}`,
        )
        .send({
          name: "Gestor Atualizado",
          email: user.email,
        });

      expect(response.status).toBe(200);

      expect(response.body.role).toBe(
        "GESTOR",
      );
    });
  });
});
