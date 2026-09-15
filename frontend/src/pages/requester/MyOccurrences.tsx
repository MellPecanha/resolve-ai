import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { listOccurrences } from "../../services/occurrence.service";
import type {
  Occurrence,
  OccurrenceStatus,
} from "../../types/occurrence";

const statusConfig: Record<
  OccurrenceStatus,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  ABERTA: {
    label: "Aberta",
    className: "badge-warning",
    icon: Clock3,
  },
  EM_ANALISE: {
    label: "Em análise",
    className: "badge-info",
    icon: AlertCircle,
  },
  EM_ATENDIMENTO: {
    label: "Em atendimento",
    className: "badge-info",
    icon: Clock3,
  },
  RESOLVIDA: {
    label: "Resolvida",
    className: "badge-success",
    icon: CheckCircle2,
  },
  CANCELADA: {
    label: "Cancelada",
    className: "badge-danger",
    icon: AlertCircle,
  },
};

const priorityLabels = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function MyOccurrences() {
  const navigate = useNavigate();

  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOccurrences() {
      try {
        setError("");

        const data = await listOccurrences();

        setOccurrences(data);
      } catch (error) {
        console.error("Erro ao carregar ocorrências:", error);

        setError(
          "Não foi possível carregar suas ocorrências. Tente novamente.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOccurrences();
  }, []);

  function handleNewOccurrence() {
    navigate("/ocorrencias/nova");
  }

  function handleOpenOccurrence(id: number) {
    navigate(`/ocorrencias/${id}`);
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Minhas solicitações</span>

          <h1>Minhas ocorrências</h1>

          <p>
            Acompanhe os problemas que você registrou e veja o andamento de
            cada solicitação.
          </p>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={handleNewOccurrence}
        >
          <Plus size={18} />
          Nova ocorrência
        </button>
      </div>

      {loading && (
        <div className="state-card">
          <div className="loading-spinner" />

          <div>
            <strong>Carregando ocorrências</strong>
            <p>Aguarde enquanto buscamos suas solicitações.</p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="state-card state-card-error">
          <AlertCircle size={22} />

          <div>
            <strong>Não foi possível carregar as ocorrências</strong>
            <p>{error}</p>

            <button
              type="button"
              className="button button-secondary"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {!loading && !error && occurrences.length === 0 && (
        <div className="state-card empty-state">
          <div className="empty-state-icon">
            <AlertCircle size={24} />
          </div>

          <div>
            <strong>Você ainda não registrou nenhuma ocorrência</strong>

            <p>
              Quando surgir um problema, registre uma ocorrência para
              acompanhar a resolução.
            </p>

            <button
              type="button"
              className="button button-primary"
              onClick={handleNewOccurrence}
            >
              <Plus size={18} />
              Registrar ocorrência
            </button>
          </div>
        </div>
      )}

      {!loading && !error && occurrences.length > 0 && (
        <div className="occurrence-list">
          {occurrences.map((occurrence) => {
            const status = statusConfig[occurrence.status];
            const StatusIcon = status.icon;

            return (
              <button
                type="button"
                className="occurrence-card"
                key={occurrence.id}
                onClick={() => handleOpenOccurrence(occurrence.id)}
              >
                <div className="occurrence-card-main">
                  <div className="occurrence-card-top">
                    <span className="occurrence-category">
                      {occurrence.category}
                    </span>

                    <span
                      className={`badge ${status.className}`}
                    >
                      <StatusIcon size={13} />
                      {status.label}
                    </span>
                  </div>

                  <h2>{occurrence.title}</h2>

                  <p className="occurrence-description">
                    {occurrence.description}
                  </p>

                  <div className="occurrence-meta">
                    <span>{occurrence.location}</span>

                    <span>•</span>

                    <span>
                      Prioridade{" "}
                      {priorityLabels[occurrence.priority]}
                    </span>

                    <span>•</span>

                    <span>{formatDate(occurrence.createdAt)}</span>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  className="occurrence-card-arrow"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyOccurrences;
