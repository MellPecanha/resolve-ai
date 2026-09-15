import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getOccurrence,
  getOccurrenceHistory,
} from "../../services/occurrence.service";

import type {
  Occurrence,
  OccurrenceHistory,
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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function OccurrenceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [history, setHistory] = useState<OccurrenceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOccurrence() {
      if (!id) {
        setError("Ocorrência não encontrada.");
        setLoading(false);
        return;
      }

      try {
        setError("");

        const occurrenceData = await getOccurrence(Number(id));

        const historyData = await getOccurrenceHistory(
          Number(id),
        );

        setOccurrence(occurrenceData);
        setHistory(historyData);
      } catch (error) {
        console.error("Erro ao carregar ocorrência:", error);

        if (
          error &&
          typeof error === "object" &&
          "response" in error
        ) {
          const response = (
            error as {
              response?: {
                status?: number;
                data?: {
                  message?: string;
                };
              };
            }
          ).response;

          setError(
            response?.data?.message ??
            "Não foi possível carregar a ocorrência.",
          );
        } else {
          setError("Não foi possível carregar a ocorrência.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadOccurrence();
  }, [id]);

  if (loading) {
    return (
      <section className="page">
        <div className="state-card">
          <div className="loading-spinner" />

          <div>
            <strong>Carregando ocorrência</strong>
            <p>Aguarde enquanto buscamos os detalhes.</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !occurrence) {
    return (
      <section className="page">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/minhas-ocorrencias")}
        >
          <ArrowLeft size={16} />
          Voltar para minhas ocorrências
        </button>

        <div className="state-card state-card-error">
          <AlertCircle size={22} />

          <div>
            <strong>Não foi possível carregar a ocorrência</strong>
            <p>{error || "Ocorrência não encontrada."}</p>
          </div>
        </div>
      </section>
    );
  }

  const status = statusConfig[occurrence.status];
  const StatusIcon = status.icon;

  return (
    <section className="page">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/minhas-ocorrencias")}
      >
        <ArrowLeft size={16} />
        Minhas ocorrências
      </button>

      <div className="occurrence-details-header">
        <div>
          <div className="occurrence-details-category">
            {occurrence.category}
          </div>

          <h1>{occurrence.title}</h1>

          <div className="occurrence-details-location">
            <MapPin size={15} />
            {occurrence.location}
          </div>
        </div>

        <span className={`badge ${status.className}`}>
          <StatusIcon size={14} />
          {status.label}
        </span>
      </div>

      <div className="occurrence-details-grid">
        <div className="details-main">
          <div className="details-card">
            <div className="details-card-header">
              <h2>Descrição</h2>
            </div>

            <p className="details-description">
              {occurrence.description}
            </p>

            {occurrence.imageUrl && (
              <div className="details-image">
                <img
                  src={occurrence.imageUrl}
                  alt={`Imagem da ocorrência ${occurrence.title}`}
                />
              </div>
            )}
          </div>

          <div className="details-card">
            <div className="details-card-header">
              <h2>Histórico</h2>
            </div>

            {history.length === 0 ? (
              <p className="details-description">
                Ainda não há alterações registradas.
              </p>
            ) : (
              <div className="history-timeline">
                {history.map((item) => {
                  const itemStatus =
                    statusConfig[item.newStatus];

                  const HistoryIcon = itemStatus.icon;

                  return (
                    <div
                      className="history-item"
                      key={item.id}
                    >
                      <div className="history-marker">
                        <HistoryIcon size={15} />
                      </div>

                      <div className="history-content">
                        <div className="history-top">
                          <strong>
                            {itemStatus.label}
                          </strong>

                          <span>
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        {item.observation && (
                          <p>
                            {item.observation}
                          </p>
                        )}

                        {item.previousStatus && (
                          <span className="history-transition">
                            {statusConfig[item.previousStatus].label}
                            {" → "}
                            {itemStatus.label}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {occurrence.solution && (
            <div className="details-card">
              <div className="details-card-header">
                <h2>Solução</h2>

                <span className="badge badge-success">
                  <CheckCircle2 size={13} />
                  Resolvida
                </span>
              </div>

              <p className="details-description">
                {occurrence.solution}
              </p>
            </div>
          )}
        </div>

        <aside className="details-sidebar">
          <div className="details-card">
            <div className="details-card-header">
              <h2>Informações</h2>
            </div>

            <div className="details-info-list">
              <div className="details-info-item">
                <span>Status</span>

                <strong>{status.label}</strong>
              </div>

              <div className="details-info-item">
                <span>Prioridade</span>

                <strong>
                  {priorityLabels[occurrence.priority]}
                </strong>
              </div>

              <div className="details-info-item">
                <span>Registrada em</span>

                <strong>
                  {formatDate(occurrence.createdAt)}
                </strong>
              </div>

              <div className="details-info-item">
                <span>Última atualização</span>

                <strong>
                  {formatDate(occurrence.updatedAt)}
                </strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default OccurrenceDetails;
