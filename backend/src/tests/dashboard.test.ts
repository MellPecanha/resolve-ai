import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import {
  createTestOccurrence,
  createTestUser,
  loginAs,
} from "./helpers.js";
import { db } from "../prisma/db.js";

describe("Dashboard", () => {
  let solicitante: Awaited<ReturnType<typeof createTestUser>>;
  let gestor: Awaited<ReturnType<typeof createTestUser>>;

  let solicitanteToken: string;
  let gestorToken: string;

  beforeAll(async () => {
    const suffix = `${Date.now()}-${Math.random()}`;

    solicitante = await createTestUser({
      name: "Dashboard Solicitante",
      email: `dashboard-solicitante-${suffix}@test.com`,
    });

    gestor = await createTestUser({
      name: "Dashboard Gestor",
      email: `dashboard-gestor-${suffix}@test.com`,
      role: "GESTOR",
    });

    solicitanteToken = await loginAs(solicitante.email);
    gestorToken = await loginAs(gestor.email);

    await createTestOccurrence(solicitante.id);

    const occurrence2 = await createTestOccurrence(
      solicitante.id,
    );

    await db.orm.public.Occurrence
      .where({ id: occurrence2.id })
      .update({
        status: "EM_ANALISE",
        priority: "ALTA",
      });

    const occurrence3 = await createTestOccurrence(
      solicitante.id,
    );

    await db.orm.public.Occurrence
      .where({ id: occurrence3.id })
      .update({
        status: "RESOLVIDA",
        priority: "URGENTE",
      });
  });

  it("deve permitir que um gestor visualize o dashboard", async () => {
    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer ${gestorToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("byStatus");
    expect(response.body).toHaveProperty("byPriority");
    expect(response.body).toHaveProperty("byCategory");
  });

  it("deve retornar estatísticas de status", async () => {
    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer ${gestorToken}`);

    expect(response.status).toBe(200);

    expect(response.body.byStatus).toHaveProperty("ABERTA");
    expect(response.body.byStatus).toHaveProperty("EM_ANALISE");
    expect(response.body.byStatus).toHaveProperty("EM_ATENDIMENTO");
    expect(response.body.byStatus).toHaveProperty("RESOLVIDA");
    expect(response.body.byStatus).toHaveProperty("CANCELADA");
  });

  it("deve retornar estatísticas de prioridade", async () => {
    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer ${gestorToken}`);

    expect(response.status).toBe(200);

    expect(response.body.byPriority).toHaveProperty("BAIXA");
    expect(response.body.byPriority).toHaveProperty("MEDIA");
    expect(response.body.byPriority).toHaveProperty("ALTA");
    expect(response.body.byPriority).toHaveProperty("URGENTE");
  });

  it("não deve permitir que solicitante acesse o dashboard", async () => {
    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer ${solicitanteToken}`);

    expect(response.status).toBe(403);
  });

  it("não deve permitir acesso ao dashboard sem autenticação", async () => {
    const response = await request(app)
      .get("/dashboard");

    expect(response.status).toBe(401);
  });
});
