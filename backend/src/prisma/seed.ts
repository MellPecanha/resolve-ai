import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./db.js";

type SeedOccurrence = {
  title: string;
  description: string;
  category: string;
  location: string;
  priority: "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";
  status:
  | "ABERTA"
  | "EM_ANALISE"
  | "EM_ATENDIMENTO"
  | "RESOLVIDA"
  | "CANCELADA";
  requesterId: number;
};

async function main() {
  console.log("🌱 Iniciando seed...");

  const runtime = await db.connect();

  console.log("🔌 Banco conectado.");

  // =========================================================
  // LIMPA O BANCO
  // =========================================================

  const plan = db.raw.sql`
    TRUNCATE TABLE
      "rating",
      "comment",
      "occurrenceHistory",
      "occurrence",
      "user"
    RESTART IDENTITY CASCADE
  `.affectedCount().build();

  await runtime.execute(plan);

  console.log("🗑️ Dados anteriores removidos.");

  // =========================================================
  // SENHA
  // =========================================================

  const password = await bcrypt.hash("123456", 10);

  // =========================================================
  // GESTORES
  // =========================================================

  const gestor1 = await db.orm.public.User.create({
    name: "Ana Gestora",
    email: "ana.gestora@resolveai.com",
    password,
    role: "GESTOR",
  });

  const gestor2 = await db.orm.public.User.create({
    name: "Carlos Gestor",
    email: "carlos.gestor@resolveai.com",
    password,
    role: "GESTOR",
  });

  const gestor3 = await db.orm.public.User.create({
    name: "Mariana Gestora",
    email: "mariana.gestora@resolveai.com",
    password,
    role: "GESTOR",
  });

  const gestores = [gestor1, gestor2, gestor3];

  console.log("👩‍💼 3 gestores criados.");

  // =========================================================
  // SOLICITANTES
  // =========================================================

  const solicitante1 = await db.orm.public.User.create({
    name: "João Silva",
    email: "joao.silva@resolveai.com",
    password,
    role: "SOLICITANTE",
  });

  const solicitante2 = await db.orm.public.User.create({
    name: "Beatriz Souza",
    email: "beatriz.souza@resolveai.com",
    password,
    role: "SOLICITANTE",
  });

  const solicitante3 = await db.orm.public.User.create({
    name: "Lucas Oliveira",
    email: "lucas.oliveira@resolveai.com",
    password,
    role: "SOLICITANTE",
  });

  const solicitante4 = await db.orm.public.User.create({
    name: "Fernanda Costa",
    email: "fernanda.costa@resolveai.com",
    password,
    role: "SOLICITANTE",
  });

  const solicitante5 = await db.orm.public.User.create({
    name: "Rafael Santos",
    email: "rafael.santos@resolveai.com",
    password,
    role: "SOLICITANTE",
  });

  const solicitantes = [
    solicitante1,
    solicitante2,
    solicitante3,
    solicitante4,
    solicitante5,
  ];

  console.log("👥 5 solicitantes criados.");

  // =========================================================
  // OCORRÊNCIAS
  // =========================================================

  const occurrences: SeedOccurrence[] = [
    {
      title: "Buraco na via",
      description:
        "Existe um buraco de grande dimensão causando risco aos motoristas.",
      category: "Infraestrutura",
      location: "Rua das Flores, 120",
      priority: "URGENTE",
      status: "ABERTA",
      requesterId: solicitante1.id,
    },
    {
      title: "Poste com lâmpada apagada",
      description:
        "A iluminação pública está apagada há vários dias.",
      category: "Iluminação",
      location: "Avenida Central, 450",
      priority: "ALTA",
      status: "EM_ANALISE",
      requesterId: solicitante2.id,
    },
    {
      title: "Vazamento de água",
      description:
        "Há um vazamento de água próximo à calçada.",
      category: "Saneamento",
      location: "Rua São Paulo, 87",
      priority: "URGENTE",
      status: "EM_ATENDIMENTO",
      requesterId: solicitante3.id,
    },
    {
      title: "Lixo acumulado",
      description:
        "Grande quantidade de lixo acumulada em área pública.",
      category: "Limpeza Urbana",
      location: "Praça da Matriz",
      priority: "MEDIA",
      status: "RESOLVIDA",
      requesterId: solicitante4.id,
    },
    {
      title: "Árvore com risco de queda",
      description:
        "Árvore apresenta inclinação e pode atingir a rede elétrica.",
      category: "Meio Ambiente",
      location: "Rua das Acácias, 300",
      priority: "ALTA",
      status: "EM_ANALISE",
      requesterId: solicitante5.id,
    },
    {
      title: "Calçada danificada",
      description:
        "Calçada apresenta diversos pontos quebrados.",
      category: "Infraestrutura",
      location: "Rua do Comércio, 55",
      priority: "BAIXA",
      status: "ABERTA",
      requesterId: solicitante1.id,
    },
    {
      title: "Sem coleta de lixo",
      description:
        "A coleta não foi realizada no dia previsto.",
      category: "Limpeza Urbana",
      location: "Rua Primavera, 210",
      priority: "MEDIA",
      status: "EM_ATENDIMENTO",
      requesterId: solicitante2.id,
    },
    {
      title: "Semáforo com defeito",
      description:
        "Semáforo permanece piscando e dificulta o trânsito.",
      category: "Trânsito",
      location: "Avenida Brasil com Rua XV",
      priority: "URGENTE",
      status: "EM_ATENDIMENTO",
      requesterId: solicitante3.id,
    },
    {
      title: "Banco de praça quebrado",
      description:
        "Banco público está quebrado e oferece risco aos usuários.",
      category: "Espaços Públicos",
      location: "Praça Central",
      priority: "BAIXA",
      status: "RESOLVIDA",
      requesterId: solicitante4.id,
    },
    {
      title: "Água parada em terreno",
      description:
        "Terreno abandonado possui grande quantidade de água parada.",
      category: "Saúde Pública",
      location: "Rua Bela Vista, 90",
      priority: "ALTA",
      status: "CANCELADA",
      requesterId: solicitante5.id,
    },
    {
      title: "Placa de trânsito caída",
      description:
        "Placa de sinalização caiu e está no chão.",
      category: "Trânsito",
      location: "Rua Minas Gerais, 150",
      priority: "MEDIA",
      status: "RESOLVIDA",
      requesterId: solicitante1.id,
    },
    {
      title: "Bueiro entupido",
      description:
        "Bueiro está completamente obstruído e pode causar alagamento.",
      category: "Saneamento",
      location: "Rua Paraná, 340",
      priority: "ALTA",
      status: "EM_ANALISE",
      requesterId: solicitante2.id,
    },
    {
      title: "Iluminação pública irregular",
      description:
        "Diversos postes da rua estão sem iluminação.",
      category: "Iluminação",
      location: "Rua das Palmeiras",
      priority: "MEDIA",
      status: "ABERTA",
      requesterId: solicitante3.id,
    },
    {
      title: "Ponto de ônibus danificado",
      description:
        "Estrutura do ponto de ônibus está deteriorada.",
      category: "Transporte",
      location: "Avenida Independência, 800",
      priority: "MEDIA",
      status: "EM_ATENDIMENTO",
      requesterId: solicitante4.id,
    },
    {
      title: "Animal abandonado",
      description:
        "Animal doméstico encontrado abandonado em via pública.",
      category: "Proteção Animal",
      location: "Rua das Oliveiras, 40",
      priority: "ALTA",
      status: "RESOLVIDA",
      requesterId: solicitante5.id,
    },
    {
      title: "Alagamento na rua",
      description:
        "Após chuvas, trecho da rua fica completamente alagado.",
      category: "Infraestrutura",
      location: "Rua Campinas, 500",
      priority: "URGENTE",
      status: "EM_ANALISE",
      requesterId: solicitante1.id,
    },
    {
      title: "Poda de árvore necessária",
      description:
        "Galhos estão avançando sobre a rede elétrica.",
      category: "Meio Ambiente",
      location: "Rua do Bosque, 72",
      priority: "MEDIA",
      status: "RESOLVIDA",
      requesterId: solicitante2.id,
    },
    {
      title: "Problema não identificado",
      description:
        "Solicitante relata uma situação que precisa ser analisada pela equipe.",
      category: "Outras situações",
      location: "Rua Principal, 100",
      priority: "BAIXA",
      status: "CANCELADA",
      requesterId: solicitante3.id,
    },
  ];

  // =========================================================
  // CRIA OCORRÊNCIAS
  // =========================================================

  const createdOccurrences = [];

  for (let index = 0; index < occurrences.length; index++) {
    const occurrenceData = occurrences[index];

    const responsible =
      occurrenceData.status !== "ABERTA"
        ? gestores[index % gestores.length]
        : undefined;

    const occurrence =
      await db.orm.public.Occurrence.create({
        title: occurrenceData.title,
        description: occurrenceData.description,
        category: occurrenceData.category,
        location: occurrenceData.location,
        priority: occurrenceData.priority,
        status: occurrenceData.status,
        requesterId: occurrenceData.requesterId,
        responsibleId: responsible?.id,
        solution:
          occurrenceData.status === "RESOLVIDA"
            ? "Solicitação atendida pela equipe responsável."
            : undefined,
      });

    createdOccurrences.push(occurrence);
  }

  console.log("📋 18 ocorrências criadas.");

  // =========================================================
  // HISTÓRICO
  // =========================================================

  for (
    let index = 0;
    index < createdOccurrences.length;
    index++
  ) {
    const occurrence = createdOccurrences[index];
    const original = occurrences[index];
    const gestor = gestores[index % gestores.length];

    // ---------------------------------------------------------
    // HISTÓRICO DE PRIORIDADE
    // ---------------------------------------------------------

    if (original.priority !== "BAIXA") {
      await db.orm.public.OccurrenceHistory.create({
        type: "PRIORIDADE",
        occurrenceId: occurrence.id,
        previousPriority: "BAIXA",
        newPriority: original.priority,
        changedById: gestor.id,
        observation:
          "Prioridade definida pela equipe responsável após análise da ocorrência.",
      });
    }

    // ---------------------------------------------------------
    // HISTÓRICO DE RESPONSÁVEL
    // ---------------------------------------------------------

    if (occurrence.responsibleId) {
      await db.orm.public.OccurrenceHistory.create({
        type: "RESPONSAVEL",
        occurrenceId: occurrence.id,
        previousResponsibleId: null,
        newResponsibleId: occurrence.responsibleId,
        changedById: gestor.id,
        observation:
          "Ocorrência atribuída a um gestor responsável.",
      });
    }

    // ---------------------------------------------------------
    // HISTÓRICO DE STATUS
    // ---------------------------------------------------------

    if (original.status === "ABERTA") {
      continue;
    }

    if (
      original.status === "EM_ANALISE" ||
      original.status === "EM_ATENDIMENTO" ||
      original.status === "RESOLVIDA"
    ) {
      await db.orm.public.OccurrenceHistory.create({
        type: "STATUS",
        occurrenceId: occurrence.id,
        previousStatus: "ABERTA",
        newStatus: "EM_ANALISE",
        changedById: gestor.id,
        observation:
          "Ocorrência recebida e encaminhada para análise.",
      });
    }

    if (
      original.status === "EM_ATENDIMENTO" ||
      original.status === "RESOLVIDA"
    ) {
      await db.orm.public.OccurrenceHistory.create({
        type: "STATUS",
        occurrenceId: occurrence.id,
        previousStatus: "EM_ANALISE",
        newStatus: "EM_ATENDIMENTO",
        changedById: gestor.id,
        observation:
          "Equipe responsável iniciou o atendimento.",
      });
    }

    if (original.status === "RESOLVIDA") {
      await db.orm.public.OccurrenceHistory.create({
        type: "STATUS",
        occurrenceId: occurrence.id,
        previousStatus: "EM_ATENDIMENTO",
        newStatus: "RESOLVIDA",
        changedById: gestor.id,
        observation:
          "Atendimento concluído com sucesso.",
      });
    }

    if (original.status === "CANCELADA") {
      await db.orm.public.OccurrenceHistory.create({
        type: "STATUS",
        occurrenceId: occurrence.id,
        previousStatus: "ABERTA",
        newStatus: "CANCELADA",
        changedById: gestor.id,
        observation:
          "Ocorrência cancelada após análise da solicitação.",
      });
    }
  }

  console.log("🕒 Histórico de ocorrências criado.");

  // =========================================================
  // COMENTÁRIOS
  // =========================================================

  for (
    let index = 0;
    index < createdOccurrences.length;
    index++
  ) {
    const occurrence = createdOccurrences[index];
    const requester =
      solicitantes[index % solicitantes.length];
    const gestor = gestores[index % gestores.length];

    await db.orm.public.Comment.create({
      occurrenceId: occurrence.id,
      authorId: requester.id,
      content:
        "Gostaria de saber se existe alguma previsão para atendimento desta ocorrência.",
    });

    if (index % 2 === 0) {
      await db.orm.public.Comment.create({
        occurrenceId: occurrence.id,
        authorId: gestor.id,
        content:
          "A ocorrência foi recebida pela equipe responsável e está sendo acompanhada.",
      });
    }
  }

  console.log("💬 Comentários criados.");

  // =========================================================
  // AVALIAÇÕES
  // =========================================================

  for (
    let index = 0;
    index < createdOccurrences.length;
    index++
  ) {
    const occurrence = createdOccurrences[index];
    const original = occurrences[index];

    if (original.status !== "RESOLVIDA") {
      continue;
    }

    const requester =
      solicitantes[index % solicitantes.length];

    await db.orm.public.Rating.create({
      occurrenceId: occurrence.id,
      userId: requester.id,
      score: 4 + (index % 2),
      comment:
        index % 2 === 0
          ? "Problema resolvido rapidamente."
          : "Atendimento satisfatório.",
    });
  }

  console.log("⭐ Avaliações criadas.");

  // =========================================================
  // RESUMO
  // =========================================================

  console.log("\n========================================");
  console.log("✅ SEED FINALIZADO COM SUCESSO");
  console.log("========================================");

  console.log("\n👩‍💼 GESTORES:");
  console.log("ana.gestora@resolveai.com");
  console.log("carlos.gestor@resolveai.com");
  console.log("mariana.gestora@resolveai.com");

  console.log("\n👥 SOLICITANTES:");
  console.log("joao.silva@resolveai.com");
  console.log("beatriz.souza@resolveai.com");
  console.log("lucas.oliveira@resolveai.com");
  console.log("fernanda.costa@resolveai.com");
  console.log("rafael.santos@resolveai.com");

  console.log("\n🔑 Senha de todos:");
  console.log("123456");

  console.log("\n📊 Dados:");
  console.log("- 3 gestores");
  console.log("- 5 solicitantes");
  console.log("- 18 ocorrências");
  console.log("- históricos de status");
  console.log("- históricos de prioridade");
  console.log("- históricos de responsáveis");
  console.log("- comentários");
  console.log("- soluções");
  console.log("- avaliações");

  console.log("========================================\n");
}

main().catch((error) => {
  console.error("❌ Erro ao executar seed:");
  console.error(error);
  process.exit(1);
});
