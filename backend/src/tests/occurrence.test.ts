import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { app } from "../app.js";
import { db } from "../prisma/db.js";
import {
  createTestOccurrence,
  createTestUser,
  loginAs,
} from "./helpers.js";

describe("Occurrences", () => {
  let solicitante1: Awaited<ReturnType<typeof createTestUser>>;
  let solicitante2: Awaited<ReturnType<typeof createTestUser>>;
  let gestor1: Awaited<ReturnType<typeof createTestUser>>;
  let gestor2: Awaited<ReturnType<typeof createTestUser>>;

  let solicitanteToken: string;
  let solicitante2Token: string;
  let gestorToken: string;
  let gestor2Token: string;

  beforeAll(async () => {
    const suffix = `${Date.now()}-${Math.random()}`;

    solicitante1 = await createTestUser({
      name: "Solicitante 1",
      email: `solicitante1-${suffix}@test.com`,
    });

    solicitante2 = await createTestUser({
      name: "Solicitante 2",
      email: `solicitante2-${suffix}@test.com`,
    });

    gestor1 = await createTestUser({
      name: "Gestor 1",
      email: `gestor1-${suffix}@test.com`,
      role: "GESTOR",
    });

    gestor2 = await createTestUser({
      name: "Gestor 2",
      email: `gestor2-${suffix}@test.com`,
      role: "GESTOR",
    });

    solicitanteToken = await loginAs(solicitante1.email);
    solicitante2Token = await loginAs(solicitante2.email);
    gestorToken = await loginAs(gestor1.email);
    gestor2Token = await loginAs(gestor2.email);
  });

  describe("upload de imagem", () => {
    it("deve criar um upload pré-assinado para o solicitante", async () => {
      const response = await request(app)
        .post("/uploads/occurrence-image")
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          contentType: "image/jpeg",
          size: 1024,
        });

      expect(response.status).toBe(201);
      expect(response.body.key).toMatch(
        new RegExp(
          `^occurrence-images/${solicitante1.id}/`,
        ),
      );
      expect(new URL(response.body.url).pathname).toBe(
        "/occurrence-images",
      );
      expect(response.body.fields).toHaveProperty(
        "Content-Type",
        "image/jpeg",
      );
    });

    it("deve rejeitar tipo e tamanho não permitidos", async () => {
      const response = await request(app)
        .post("/uploads/occurrence-image")
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          contentType: "image/gif",
          size: 6 * 1024 * 1024,
        });

      expect(response.status).toBe(400);
    });
  });

  describe("criação", () => {
    it("deve permitir que um solicitante crie uma ocorrência", async () => {
      const response = await request(app)
        .post("/occurrences")
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          title: "Poste apagado",
          description: "O poste está apagado durante a noite.",
          category: "Iluminação",
          location: "Rua Principal, 100",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Poste apagado");
      expect(response.body.description).toBe(
        "O poste está apagado durante a noite.",
      );
      expect(response.body.category).toBe("Iluminação");
      expect(response.body.location).toBe("Rua Principal, 100");
      expect(response.body.requesterId).toBe(solicitante1.id);
    });

    it("não deve permitir criar ocorrência sem autenticação", async () => {
      const response = await request(app)
        .post("/occurrences")
        .send({
          title: "Poste apagado",
          description: "O poste está apagado.",
          category: "Iluminação",
          location: "Rua Principal",
        });

      expect(response.status).toBe(401);
    });

    it("deve rejeitar dados inválidos", async () => {
      const response = await request(app)
        .post("/occurrences")
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          title: "A",
          description: "B",
          category: "I",
          location: "R",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("acesso", () => {
    it("deve permitir que o solicitante visualize sua própria ocorrência", async () => {
      const occurrence = await createTestOccurrence(solicitante1.id);

      const response = await request(app)
        .get(`/occurrences/${occurrence.id}`)
        .set("Authorization", `Bearer ${solicitanteToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(occurrence.id);
    });

    it("não deve permitir que um solicitante visualize ocorrência de outro solicitante", async () => {
      const occurrence = await createTestOccurrence(solicitante2.id);

      const response = await request(app)
        .get(`/occurrences/${occurrence.id}`)
        .set("Authorization", `Bearer ${solicitanteToken}`);

      expect(response.status).toBe(403);
    });

    it("deve permitir que o gestor visualize ocorrência de qualquer solicitante", async () => {
      const occurrence = await createTestOccurrence(solicitante2.id);

      const response = await request(app)
        .get(`/occurrences/${occurrence.id}`)
        .set("Authorization", `Bearer ${gestorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(occurrence.id);
    });
  });

  describe("listagem", () => {
    it("deve retornar somente ocorrências do solicitante", async () => {
      const ownOccurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await createTestOccurrence(solicitante2.id);

      const response = await request(app)
        .get("/occurrences")
        .set("Authorization", `Bearer ${solicitanteToken}`);

      expect(response.status).toBe(200);

      expect(
        response.body.data.every(
          (item: { requesterId: number }) =>
            item.requesterId === solicitante1.id,
        ),
      ).toBe(true);

      expect(
        response.body.data.some(
          (item: { id: number }) =>
            item.id === ownOccurrence.id,
        ),
      ).toBe(true);
    });

    it("deve retornar ocorrências de todos os solicitantes para o gestor", async () => {
      await createTestOccurrence(solicitante1.id);
      await createTestOccurrence(solicitante2.id);

      const response = await request(app)
        .get("/occurrences")
        .set("Authorization", `Bearer ${gestorToken}`);

      expect(response.status).toBe(200);

      const requesterIds = response.body.data.map(
        (item: { requesterId: number }) => item.requesterId,
      );

      expect(requesterIds).toContain(solicitante1.id);
      expect(requesterIds).toContain(solicitante2.id);
    });

    it("deve filtrar por prioridade", async () => {
      const occurrence = await createTestOccurrence(solicitante1.id);

      await db.orm.public.Occurrence
        .where({ id: occurrence.id })
        .update({
          priority: "ALTA",
        });

      const response = await request(app)
        .get("/occurrences?priority=ALTA")
        .set("Authorization", `Bearer ${gestorToken}`);

      expect(response.status).toBe(200);

      expect(
        response.body.data.every(
          (item: { priority: string }) => item.priority === "ALTA",
        ),
      ).toBe(true);
    });

    it("deve filtrar por status", async () => {
      const occurrence = await createTestOccurrence(solicitante1.id);

      await db.orm.public.Occurrence
        .where({ id: occurrence.id })
        .update({
          status: "EM_ANALISE",
        });

      const response = await request(app)
        .get("/occurrences?status=EM_ANALISE")
        .set("Authorization", `Bearer ${gestorToken}`);

      expect(response.status).toBe(200);

      expect(
        response.body.data.every(
          (item: { status: string }) =>
            item.status === "EM_ANALISE",
        ),
      ).toBe(true);
    });
  });

  describe("prioridade", () => {
    it("deve permitir que o gestor altere a prioridade", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/priority`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          priority: "URGENTE",
        });

      expect(response.status).toBe(200);
      expect(response.body.priority).toBe("URGENTE");
    });

    it("deve criar histórico ao alterar a prioridade", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/priority`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          priority: "ALTA",
        });

      expect(response.status).toBe(200);

      const history =
        await db.orm.public.OccurrenceHistory
          .where({
            occurrenceId: occurrence.id,
            type: "PRIORIDADE",
          })
          .all();

      expect(history).toHaveLength(1);
      expect(history[0].previousPriority).toBe("MEDIA");
      expect(history[0].newPriority).toBe("ALTA");
      expect(history[0].changedById).toBe(gestor1.id);
      expect(history[0].previousStatus).toBeNull();
      expect(history[0].newStatus).toBeNull();
    });

    it("não deve criar histórico quando a prioridade não muda", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/priority`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          priority: "MEDIA",
        });

      expect(response.status).toBe(400);

      const history =
        await db.orm.public.OccurrenceHistory
          .where({
            occurrenceId: occurrence.id,
            type: "PRIORIDADE",
          })
          .all();

      expect(history).toHaveLength(0);
    });

    it("não deve permitir que solicitante altere prioridade", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/priority`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          priority: "URGENTE",
        });

      expect(response.status).toBe(403);
    });
  });

  describe("responsável", () => {
    it("deve permitir atribuir um gestor como responsável", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/responsible`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          responsibleId: gestor2.id,
        });

      expect(response.status).toBe(200);
      expect(response.body.responsibleId).toBe(gestor2.id);
    });

    it("deve criar histórico ao atribuir um responsável", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/responsible`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          responsibleId: gestor2.id,
        });

      expect(response.status).toBe(200);

      const history =
        await db.orm.public.OccurrenceHistory
          .where({
            occurrenceId: occurrence.id,
            type: "RESPONSAVEL",
          })
          .all();

      expect(history).toHaveLength(1);
      expect(history[0].previousResponsibleId).toBeNull();
      expect(history[0].newResponsibleId).toBe(gestor2.id);
      expect(history[0].changedById).toBe(gestor1.id);
      expect(history[0].previousStatus).toBeNull();
      expect(history[0].newStatus).toBeNull();
      expect(history[0].previousPriority).toBeNull();
      expect(history[0].newPriority).toBeNull();
    });

    it("não deve criar histórico quando o responsável não muda", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await request(app)
        .patch(`/occurrences/${occurrence.id}/responsible`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          responsibleId: gestor2.id,
        });

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/responsible`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          responsibleId: gestor2.id,
        });

      expect(response.status).toBe(400);

      const history =
        await db.orm.public.OccurrenceHistory
          .where({
            occurrenceId: occurrence.id,
            type: "RESPONSAVEL",
          })
          .all();

      expect(history).toHaveLength(1);
    });

    it("deve registrar a troca de responsável no histórico", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await request(app)
        .patch(`/occurrences/${occurrence.id}/responsible`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          responsibleId: gestor1.id,
        });

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/responsible`)
        .set("Authorization", `Bearer ${gestor2Token}`)
        .send({
          responsibleId: gestor2.id,
        });

      expect(response.status).toBe(200);

      const history =
        await db.orm.public.OccurrenceHistory
          .where({
            occurrenceId: occurrence.id,
            type: "RESPONSAVEL",
          })
          .all();

      expect(history).toHaveLength(2);

      const lastHistory = history[history.length - 1];

      expect(lastHistory.previousResponsibleId).toBe(
        gestor1.id,
      );
      expect(lastHistory.newResponsibleId).toBe(gestor2.id);
      expect(lastHistory.changedById).toBe(gestor2.id);
    });

    it("não deve permitir atribuir um solicitante como responsável", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/responsible`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          responsibleId: solicitante2.id,
        });

      expect(response.status).toBe(400);
    });

    it("não deve permitir que solicitante atribua responsável", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/responsible`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          responsibleId: gestor2.id,
        });

      expect(response.status).toBe(403);
    });
  });

  describe("status e histórico", () => {
    it("deve permitir que gestor altere o status", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/status`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          status: "EM_ANALISE",
          observation: "Ocorrência encaminhada para análise.",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("EM_ANALISE");
    });

    it("não deve permitir que solicitante altere o status", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/status`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          status: "EM_ANALISE",
        });

      expect(response.status).toBe(403);
    });

    it("deve criar histórico ao alterar o status", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await request(app)
        .patch(`/occurrences/${occurrence.id}/status`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          status: "EM_ANALISE",
          observation: "Início da análise.",
        });

      const response = await request(app)
        .get(`/occurrences/${occurrence.id}/history`)
        .set("Authorization", `Bearer ${gestorToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);

      expect(response.body[0].type).toBe("STATUS");
      expect(response.body[0].previousStatus).toBe("ABERTA");
      expect(response.body[0].newStatus).toBe("EM_ANALISE");
      expect(response.body[0].changedById).toBe(gestor1.id);
      expect(response.body[0].observation).toBe(
        "Início da análise.",
      );
    });

    it("deve retornar os dados do gestor que alterou o histórico", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await request(app)
        .patch(`/occurrences/${occurrence.id}/status`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          status: "EM_ANALISE",
          observation: "Análise iniciada.",
        });

      const response = await request(app)
        .get(`/occurrences/${occurrence.id}/history`)
        .set("Authorization", `Bearer ${gestorToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);

      expect(response.body[0].changedBy).toBeDefined();
      expect(response.body[0].changedBy.id).toBe(gestor1.id);
      expect(response.body[0].changedBy.name).toBe(
        "Gestor 1",
      );
      expect(response.body[0].changedBy.role).toBe("GESTOR");
    });

    it("não deve criar histórico quando o status não muda", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/status`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          status: "ABERTA",
        });

      expect(response.status).toBe(400);

      const history =
        await db.orm.public.OccurrenceHistory
          .where({
            occurrenceId: occurrence.id,
            type: "STATUS",
          })
          .all();

      expect(history).toHaveLength(0);
    });

    it("deve permitir que o solicitante consulte o histórico da própria ocorrência", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await request(app)
        .patch(`/occurrences/${occurrence.id}/status`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          status: "EM_ANALISE",
          observation: "Ocorrência em análise.",
        });

      const response = await request(app)
        .get(`/occurrences/${occurrence.id}/history`)
        .set("Authorization", `Bearer ${solicitanteToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].type).toBe("STATUS");
    });

    it("não deve permitir que solicitante consulte histórico de ocorrência de outra pessoa", async () => {
      const occurrence = await createTestOccurrence(
        solicitante2.id,
      );

      const response = await request(app)
        .get(`/occurrences/${occurrence.id}/history`)
        .set("Authorization", `Bearer ${solicitanteToken}`);

      expect(response.status).toBe(403);
    });

    it("deve retornar históricos de tipos diferentes", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await request(app)
        .patch(`/occurrences/${occurrence.id}/priority`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          priority: "ALTA",
        });

      await request(app)
        .patch(`/occurrences/${occurrence.id}/responsible`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          responsibleId: gestor2.id,
        });

      await request(app)
        .patch(`/occurrences/${occurrence.id}/status`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          status: "EM_ANALISE",
          observation: "Início da análise.",
        });

      const response = await request(app)
        .get(`/occurrences/${occurrence.id}/history`)
        .set("Authorization", `Bearer ${gestorToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);

      const types = response.body.map(
        (item: { type: string }) => item.type,
      );

      expect(types).toContain("PRIORIDADE");
      expect(types).toContain("RESPONSAVEL");
      expect(types).toContain("STATUS");
    });
  });

  describe("comentários", () => {
    it("deve permitir solicitante comentar na própria ocorrência", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .post(`/occurrences/${occurrence.id}/comments`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          content: "Alguma atualização sobre o problema?",
        });

      expect(response.status).toBe(201);
      expect(response.body.content).toBe(
        "Alguma atualização sobre o problema?",
      );
      expect(response.body.authorId).toBe(solicitante1.id);
    });

    it("não deve permitir solicitante comentar em ocorrência de outra pessoa", async () => {
      const occurrence = await createTestOccurrence(
        solicitante2.id,
      );

      const response = await request(app)
        .post(`/occurrences/${occurrence.id}/comments`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          content: "Comentário indevido.",
        });

      expect(response.status).toBe(403);
    });

    it("deve permitir gestor comentar em qualquer ocorrência", async () => {
      const occurrence = await createTestOccurrence(
        solicitante2.id,
      );

      const response = await request(app)
        .post(`/occurrences/${occurrence.id}/comments`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          content: "Comentário do gestor.",
        });

      expect(response.status).toBe(201);
      expect(response.body.authorId).toBe(gestor1.id);
    });

    it("deve listar comentários de uma ocorrência", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await request(app)
        .post(`/occurrences/${occurrence.id}/comments`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          content: "Primeiro comentário.",
        });

      const response = await request(app)
        .get(`/occurrences/${occurrence.id}/comments`)
        .set("Authorization", `Bearer ${solicitanteToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].content).toBe(
        "Primeiro comentário.",
      );
    });
  });

  describe("solução", () => {
    it("deve permitir gestor registrar solução", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/solution`)
        .set("Authorization", `Bearer ${gestorToken}`)
        .send({
          solution: "O poste foi reparado.",
        });

      expect(response.status).toBe(200);
      expect(response.body.solution).toBe(
        "O poste foi reparado.",
      );
    });

    it("não deve permitir solicitante registrar solução", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .patch(`/occurrences/${occurrence.id}/solution`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          solution: "Tentei resolver.",
        });

      expect(response.status).toBe(403);
    });
  });

  describe("avaliação", () => {
    it("deve permitir solicitante avaliar ocorrência resolvida", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await db.orm.public.Occurrence
        .where({ id: occurrence.id })
        .update({
          status: "RESOLVIDA",
        });

      const response = await request(app)
        .post(`/occurrences/${occurrence.id}/rating`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          score: 5,
          comment: "Problema resolvido rapidamente.",
        });

      expect(response.status).toBe(201);
      expect(response.body.score).toBe(5);
      expect(response.body.comment).toBe(
        "Problema resolvido rapidamente.",
      );
    });

    it("não deve permitir avaliação antes da resolução", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      const response = await request(app)
        .post(`/occurrences/${occurrence.id}/rating`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          score: 5,
        });

      expect(response.status).toBe(400);
    });

    it("não deve permitir outro usuário avaliar a ocorrência", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await db.orm.public.Occurrence
        .where({ id: occurrence.id })
        .update({
          status: "RESOLVIDA",
        });

      const response = await request(app)
        .post(`/occurrences/${occurrence.id}/rating`)
        .set("Authorization", `Bearer ${solicitante2Token}`)
        .send({
          score: 5,
        });

      expect(response.status).toBe(403);
    });

    it("não deve permitir duas avaliações para a mesma ocorrência", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await db.orm.public.Occurrence
        .where({ id: occurrence.id })
        .update({
          status: "RESOLVIDA",
        });

      const first = await request(app)
        .post(`/occurrences/${occurrence.id}/rating`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          score: 5,
        });

      expect(first.status).toBe(201);

      const second = await request(app)
        .post(`/occurrences/${occurrence.id}/rating`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          score: 4,
        });

      expect(second.status).toBe(409);
    });

    it("deve rejeitar score fora do intervalo de 1 a 5", async () => {
      const occurrence = await createTestOccurrence(
        solicitante1.id,
      );

      await db.orm.public.Occurrence
        .where({ id: occurrence.id })
        .update({
          status: "RESOLVIDA",
        });

      const response = await request(app)
        .post(`/occurrences/${occurrence.id}/rating`)
        .set("Authorization", `Bearer ${solicitanteToken}`)
        .send({
          score: 6,
        });

      expect(response.status).toBe(400);
    });
  });

  it("deve permitir consultar a avaliação do solicitante", async () => {
    const occurrence = await createTestOccurrence(
      solicitante1.id,
    );

    await db.orm.public.Occurrence
      .where({ id: occurrence.id })
      .update({
        status: "RESOLVIDA",
      });

    await request(app)
      .post(`/occurrences/${occurrence.id}/rating`)
      .set("Authorization", `Bearer ${solicitanteToken}`)
      .send({
        score: 5,
        comment: "Excelente resolução.",
      });

    const response = await request(app)
      .get(`/occurrences/${occurrence.id}/rating`)
      .set("Authorization", `Bearer ${solicitanteToken}`);

    expect(response.status).toBe(200);
    expect(response.body.score).toBe(5);
    expect(response.body.comment).toBe(
      "Excelente resolução.",
    );
  });

  it("deve retornar null quando a ocorrência ainda não possui avaliação", async () => {
    const occurrence = await createTestOccurrence(
      solicitante1.id,
    );

    await db.orm.public.Occurrence
      .where({ id: occurrence.id })
      .update({
        status: "RESOLVIDA",
      });

    const response = await request(app)
      .get(`/occurrences/${occurrence.id}/rating`)
      .set("Authorization", `Bearer ${solicitanteToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
  });

  it("deve permitir solicitante atualizar sua avaliação", async () => {
    const occurrence = await createTestOccurrence(
      solicitante1.id,
    );

    await db.orm.public.Occurrence
      .where({ id: occurrence.id })
      .update({
        status: "RESOLVIDA",
      });

    await request(app)
      .post(`/occurrences/${occurrence.id}/rating`)
      .set("Authorization", `Bearer ${solicitanteToken}`)
      .send({
        score: 5,
        comment: "Muito bom.",
      });

    const response = await request(app)
      .patch(`/occurrences/${occurrence.id}/rating`)
      .set("Authorization", `Bearer ${solicitanteToken}`)
      .send({
        score: 3,
        comment: "Pode melhorar.",
      });

    expect(response.status).toBe(200);
    expect(response.body.score).toBe(3);
    expect(response.body.comment).toBe(
      "Pode melhorar.",
    );
  });

  it("não deve permitir outro usuário alterar a avaliação", async () => {
    const occurrence = await createTestOccurrence(
      solicitante1.id,
    );

    await db.orm.public.Occurrence
      .where({ id: occurrence.id })
      .update({
        status: "RESOLVIDA",
      });

    await request(app)
      .post(`/occurrences/${occurrence.id}/rating`)
      .set("Authorization", `Bearer ${solicitanteToken}`)
      .send({
        score: 5,
      });

    const response = await request(app)
      .patch(`/occurrences/${occurrence.id}/rating`)
      .set("Authorization", `Bearer ${solicitante2Token}`)
      .send({
        score: 1,
      });

    expect(response.status).toBe(403);
  });
});
