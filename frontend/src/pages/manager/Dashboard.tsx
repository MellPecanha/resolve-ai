import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Flame,
} from "lucide-react";

import { useAuth } from "../../contexts/useAuth";
import Card from "../../components/ui/Card";
import { api } from "../../services/api";

interface DashboardData {
  total: number;

  byStatus: Record<
    "ABERTA" |
    "EM_ANALISE" |
    "EM_ATENDIMENTO" |
    "RESOLVIDA" |
    "CANCELADA",
    number
  >;

  byPriority: Record<
    "BAIXA" |
    "MEDIA" |
    "ALTA" |
    "URGENTE",
    number
  >;

  byCategory: {
    category: string;
    total: number;
  }[];
}

const statusLabels = {
  ABERTA: "Aberta",
  EM_ANALISE: "Em análise",
  EM_ATENDIMENTO: "Em atendimento",
  RESOLVIDA: "Resolvida",
  CANCELADA: "Cancelada",
};

const priorityLabels = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

function Dashboard() {
  const { user } = useAuth();

  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");

        const response =
          await api.get<DashboardData>(
            "/dashboard",
          );

        setData(response.data);
      } catch (error) {
        console.error(
          "Erro ao carregar dashboard:",
          error,
        );

        setError(
          "Não foi possível carregar os indicadores.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalActive = useMemo(() => {
    if (!data) return 0;

    return (
      data.byStatus.ABERTA +
      data.byStatus.EM_ANALISE +
      data.byStatus.EM_ATENDIMENTO
    );
  }, [data]);

  if (loading) {
    return (
      <section className="page">
        <header className="page-header">
          <div>
            <p className="page-eyebrow">
              Olá, {user?.name}
            </p>

            <h1 className="page-title">
              Dashboard
            </h1>
          </div>
        </header>

        <div className="state-card">
          <div className="loading-spinner" />

          <div>
            <strong>
              Carregando indicadores
            </strong>

            <p>
              Aguarde enquanto buscamos os dados.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="page">
        <div className="state-card state-card-error">
          <AlertCircle size={22} />

          <div>
            <strong>
              Não foi possível carregar o dashboard
            </strong>

            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">
            Olá, {user?.name}
          </p>

          <h1 className="page-title">
            Dashboard
          </h1>

          <p className="page-description">
            Acompanhe as ocorrências e o andamento
            dos atendimentos.
          </p>
        </div>
      </header>

      <div className="dashboard-grid">
        <Card className="stat-card">
          <div className="stat-icon">
            <ClipboardList size={20} />
          </div>

          <span className="stat-label">
            Total
          </span>

          <strong className="stat-value">
            {data.total}
          </strong>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <Clock3 size={20} />
          </div>

          <span className="stat-label">
            Em andamento
          </span>

          <strong className="stat-value">
            {totalActive}
          </strong>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <span className="stat-label">
            Resolvidas
          </span>

          <strong className="stat-value">
            {data.byStatus.RESOLVIDA}
          </strong>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <Flame size={20} />
          </div>

          <span className="stat-label">
            Urgentes
          </span>

          <strong className="stat-value">
            {data.byPriority.URGENTE}
          </strong>
        </Card>
      </div>

      <div className="dashboard-sections">
        <Card className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Status</h2>
              <p>
                Distribuição das ocorrências.
              </p>
            </div>
          </div>

          <div className="dashboard-bars">
            {Object.entries(
              data.byStatus,
            ).map(([status, total]) => {
              const percentage =
                data.total > 0
                  ? (total / data.total) *
                  100
                  : 0;

              return (
                <div
                  className="dashboard-bar-item"
                  key={status}
                >
                  <div className="dashboard-bar-label">
                    <span>
                      {
                        statusLabels[
                        status as keyof typeof statusLabels
                        ]
                      }
                    </span>

                    <strong>
                      {total}
                    </strong>
                  </div>

                  <div className="dashboard-bar-track">
                    <div
                      className="dashboard-bar-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Prioridades</h2>
              <p>
                Nível de prioridade das ocorrências.
              </p>
            </div>
          </div>

          <div className="dashboard-priority-list">
            {Object.entries(
              data.byPriority,
            ).map(([priority, total]) => (
              <div
                className="dashboard-priority-item"
                key={priority}
              >
                <span>
                  {
                    priorityLabels[
                    priority as keyof typeof priorityLabels
                    ]
                  }
                </span>

                <strong>{total}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <h2>Ocorrências por categoria</h2>

            <p>
              Categorias com maior volume de solicitações.
            </p>
          </div>
        </div>

        {data.byCategory.length === 0 ? (
          <p className="details-description">
            Ainda não há dados por categoria.
          </p>
        ) : (
          <div className="dashboard-category-list">
            {data.byCategory.map(
              (item) => {
                const percentage =
                  data.total > 0
                    ? (item.total /
                      data.total) *
                    100
                    : 0;

                return (
                  <div
                    className="dashboard-category-item"
                    key={item.category}
                  >
                    <div>
                      <strong>
                        {item.category}
                      </strong>

                      <span>
                        {item.total} ocorrência
                        {item.total !== 1
                          ? "s"
                          : ""}
                      </span>
                    </div>

                    <div className="dashboard-category-track">
                      <div
                        className="dashboard-bar-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </Card>
    </section>
  );
}

export default Dashboard;
