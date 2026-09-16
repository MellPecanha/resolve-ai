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
});
