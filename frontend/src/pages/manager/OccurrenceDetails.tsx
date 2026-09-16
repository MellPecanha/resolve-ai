import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Save,
  Star,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  addOccurrenceComment,
  assignOccurrenceResponsible,
  getOccurrence,
  getOccurrenceComments,
  getOccurrenceHistory,
  getOccurrenceRating,
  updateOccurrencePriority,
  updateOccurrenceSolution,
  updateOccurrenceStatus,
} from "../../services/occurrence.service";

import { listManagers } from "../../services/user.service";

import type {
  Occurrence,
  OccurrenceComment,
  OccurrenceHistory,
  OccurrencePriority,
  OccurrenceStatus,
  OccurrenceRating,
} from "../../types/occurrence";

import type { Manager } from "../../types/user";

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
    className: "badge-analysis",
    icon: AlertCircle,
  },
  EM_ATENDIMENTO: {
    label: "Em atendimento",
    className: "badge-attendance",
    icon: Clock3,
  },
  RESOLVIDA: {
    label: "Resolvida",
    className: "badge-resolved",
    icon: CheckCircle2,
  },
  CANCELADA: {
    label: "Cancelada",
    className: "badge-cancelled",
    icon: AlertCircle,
  },
};

const priorityLabels: Record<
  OccurrencePriority,
  string
> = {
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

  const occurrenceId = Number(id);

  const [occurrence, setOccurrence] =
    useState<Occurrence | null>(null);

  const [history, setHistory] =
    useState<OccurrenceHistory[]>([]);

  const [comments, setComments] =
    useState<OccurrenceComment[]>([]);

  const [rating, setRating] =
    useState<OccurrenceRating | null>(null);

  const [managers, setManagers] =
    useState<Manager[]>([]);

  const [status, setStatus] =
    useState<OccurrenceStatus>("ABERTA");

  const [priority, setPriority] =
    useState<OccurrencePriority>("MEDIA");

  const [responsibleId, setResponsibleId] =
    useState<string>("");

  const [statusObservation, setStatusObservation] =
    useState("");

  const [solution, setSolution] =
    useState("");

  const [newComment, setNewComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    async function loadData() {
      if (!id || Number.isNaN(occurrenceId)) {
        setError("Ocorrência não encontrada.");
        setLoading(false);
        return;
      }

      try {
        setError("");

        const [
          occurrenceData,
          historyData,
          commentsData,
          managersData,
          ratingData,
        ] = await Promise.all([
          getOccurrence(occurrenceId),
          getOccurrenceHistory(occurrenceId),
          getOccurrenceComments(occurrenceId),
          listManagers(),
          getOccurrenceRating(occurrenceId),
        ]);

        setOccurrence(occurrenceData);
        setHistory(historyData);
        setComments(commentsData);
        setManagers(managersData);
        setRating(ratingData);

        setStatus(occurrenceData.status);
        setPriority(occurrenceData.priority);
        setSolution(occurrenceData.solution ?? "");

        setResponsibleId(
          occurrenceData.responsibleId
            ? String(occurrenceData.responsibleId)
            : "",
        );
      } catch (error) {
        console.error(
          "Erro ao carregar ocorrência:",
          error,
        );

        setError(
          "Não foi possível carregar a ocorrência.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, occurrenceId]);

  async function handleSaveStatus() {
    if (!occurrence) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated =
        await updateOccurrenceStatus(
          occurrence.id,
          status,
          statusObservation || undefined,
        );

      const historyData =
        await getOccurrenceHistory(
          occurrence.id,
        );

      setOccurrence(updated);
      setHistory(historyData);
      setStatusObservation("");

      setSuccess(
        "Status atualizado com sucesso.",
      );
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível atualizar o status.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePriority() {
    if (!occurrence) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated =
        await updateOccurrencePriority(
          occurrence.id,
          priority,
        );

      const historyData =
        await getOccurrenceHistory(
          occurrence.id,
        );

      setOccurrence(updated);
      setHistory(historyData);

      setSuccess(
        "Prioridade atualizada com sucesso.",
      );
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível atualizar a prioridade.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveResponsible() {
    if (!occurrence || !responsibleId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated =
        await assignOccurrenceResponsible(
          occurrence.id,
          Number(responsibleId),
        );

      const historyData =
        await getOccurrenceHistory(
          occurrence.id,
        );

      setOccurrence(updated);
      setHistory(historyData);

      setSuccess(
        "Responsável atribuído com sucesso.",
      );
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível atribuir o responsável.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSolution() {
    if (!occurrence || !solution.trim()) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated =
        await updateOccurrenceSolution(
          occurrence.id,
          solution.trim(),
        );

      setOccurrence(updated);

      setSuccess(
        "Solução registrada com sucesso.",
      );
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível registrar a solução.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleAddComment() {
    if (!occurrence || !newComment.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await addOccurrenceComment(
        occurrence.id,
        newComment.trim(),
      );

      const updatedComments =
        await getOccurrenceComments(occurrence.id);

      setComments(updatedComments);

      setNewComment("");

      setSuccess(
        "Comentário adicionado.",
      );
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível adicionar o comentário.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <div className="state-card">
          <div className="loading-spinner" />

          <div>
            <strong>
              Carregando ocorrência
            </strong>

            <p>
              Aguarde enquanto buscamos os dados.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !occurrence) {
    return (
      <section className="page">
        <div className="state-card state-card-error">
          <AlertCircle size={22} />

          <div>
            <strong>
              Não foi possível carregar
            </strong>

            <p>{error}</p>

            <button
              type="button"
              className="button button-secondary"
              onClick={() =>
                navigate("/ocorrencias")
              }
            >
              Voltar
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!occurrence) return null;

  const currentStatus =
    statusConfig[occurrence.status];

  return (
    <section className="page">
      <button
        type="button"
        className="back-button"
        onClick={() =>
          navigate("/ocorrencias")
        }
      >
        <ArrowLeft size={16} />
        Ocorrências
      </button>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {success && (
        <div className="form-success">
          {success}
        </div>
      )}

      <div className="occurrence-details-header">
        <div>
          <div className="occurrence-details-category">
            {occurrence.category}
          </div>

          <h1>{occurrence.title}</h1>

          <div className="occurrence-details-location">
            {occurrence.location}
          </div>
        </div>

        <span
          className={`badge ${currentStatus.className}`}
        >
          {currentStatus.label}
        </span>
      </div>

      <div className="manager-details-grid">
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
              <h2>Gerenciar ocorrência</h2>
            </div>

            <div className="manager-action-grid">
              <div className="manager-action">
                <label>Status</label>

                <select
                  className="input"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as OccurrenceStatus,
                    )
                  }
                >
                  {Object.entries(
                    statusConfig,
                  ).map(
                    ([value, config]) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {config.label}
                      </option>
                    ),
                  )}
                </select>

                <textarea
                  className="input manager-textarea"
                  placeholder="Observação da alteração (opcional)"
                  value={statusObservation}
                  onChange={(event) =>
                    setStatusObservation(
                      event.target.value,
                    )
                  }
                />

                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleSaveStatus}
                  disabled={
                    saving ||
                    status === occurrence.status
                  }
                >
                  <Save size={16} />
                  Atualizar status
                </button>
              </div>

              <div className="manager-action">
                <label>Prioridade</label>

                <select
                  className="input"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target
                        .value as OccurrencePriority,
                    )
                  }
                >
                  {Object.entries(
                    priorityLabels,
                  ).map(
                    ([value, label]) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {label}
                      </option>
                    ),
                  )}
                </select>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleSavePriority}
                  disabled={
                    saving ||
                    priority === occurrence.priority
                  }
                >
                  <Save size={16} />
                  Atualizar prioridade
                </button>
              </div>

              <div className="manager-action">
                <label>Responsável</label>

                <select
                  className="input"
                  value={responsibleId}
                  onChange={(event) =>
                    setResponsibleId(
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    Selecione um gestor
                  </option>

                  {managers.map(
                    (manager) => (
                      <option
                        key={manager.id}
                        value={manager.id}
                      >
                        {manager.name}
                      </option>
                    ),
                  )}
                </select>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={
                    handleSaveResponsible
                  }
                  disabled={
                    saving ||
                    !responsibleId ||
                    Number(responsibleId) ===
                    occurrence.responsibleId
                  }
                >
                  <UserRound size={16} />
                  Atribuir responsável
                </button>
              </div>
            </div>

            <div className="manager-solution">
              <label>Solução aplicada</label>

              <textarea
                className="input manager-solution-input"
                placeholder="Descreva a solução aplicada..."
                value={solution}
                onChange={(event) =>
                  setSolution(
                    event.target.value,
                  )
                }
              />

              <button
                type="button"
                className="button button-primary"
                onClick={handleSaveSolution}
                disabled={
                  saving ||
                  !solution.trim()
                }
              >
                <CheckCircle2 size={16} />
                Registrar solução
              </button>
            </div>
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
                  let title = "";
                  let transition = "";
                  let HistoryIcon = Clock3;

                  if (item.type === "STATUS" && item.newStatus) {
                    const newStatus = statusConfig[item.newStatus];

                    HistoryIcon = newStatus.icon;
                    title = newStatus.label;

                    if (item.previousStatus) {
                      transition = `${statusConfig[item.previousStatus].label} → ${newStatus.label}`;
                    }
                  }

                  if (item.type === "PRIORIDADE" && item.newPriority) {
                    HistoryIcon = AlertCircle;
                    title = `Prioridade: ${priorityLabels[item.newPriority]}`;

                    if (item.previousPriority) {
                      transition = `${priorityLabels[item.previousPriority]} → ${priorityLabels[item.newPriority]}`;
                    }
                  }

                  if (item.type === "RESPONSAVEL") {
                    HistoryIcon = MessageCircle;

                    if (item.newResponsibleId) {
                      title = "Responsável atribuído";

                      if (item.previousResponsibleId) {
                        transition = `Gestor #${item.previousResponsibleId} → Gestor #${item.newResponsibleId}`;
                      } else {
                        transition = `Gestor #${item.newResponsibleId}`;
                      }
                    } else {
                      title = "Responsável removido";

                      if (item.previousResponsibleId) {
                        transition = `Gestor #${item.previousResponsibleId} → Não atribuído`;
                      }
                    }
                  }

                  return (
                    <div className="history-item" key={item.id}>
                      <div className="history-marker">
                        <HistoryIcon size={15} />
                      </div>

                      <div className="history-content">
                        <div className="history-top">
                          <strong>{title}</strong>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>

                        {transition && (
                          <span className="history-transition">
                            {transition}
                          </span>
                        )}

                        {item.changedBy && (
                          <span className="history-user">
                            Alterado por <strong>{item.changedBy.name}</strong>
                          </span>
                        )}

                        {item.observation && <p>{item.observation}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {occurrence.status === "RESOLVIDA" && (
            <div className="details-card manager-rating-card">
              <div className="details-card-header">
                <div className="details-card-title-with-icon">
                  <Star size={18} />
                  <h2>Avaliação do solicitante</h2>
                </div>
              </div>

              {rating ? (
                <div className="manager-rating">
                  <div className="manager-rating-stars">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        size={24}
                        className={
                          value <= rating.score
                            ? "manager-rating-star-active"
                            : "manager-rating-star"
                        }
                        fill={
                          value <= rating.score
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}

                    <span className="manager-rating-score">
                      {rating.score}/5
                    </span>
                  </div>

                  {rating.comment && (
                    <p className="details-description">
                      "{rating.comment}"
                    </p>
                  )}

                  <span className="manager-rating-date">
                    Avaliado em {formatDate(rating.createdAt)}
                  </span>
                </div>
              ) : (
                <p className="details-description">
                  O solicitante ainda não avaliou esta ocorrência.
                </p>
              )}
            </div>
          )}


          <div className="details-card">
            <div className="details-card-header">
              <h2>
                <MessageCircle size={17} />
                Comentários
              </h2>
            </div>

            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="details-description">
                  Ainda não há comentários.
                </p>
              ) : (
                comments.map((comment) => {
                  const authorName = comment.author?.name ?? "Usuário";

                  return (
                    <div
                      className="comment-item"
                      key={comment.id}
                    >
                      <div className="comment-avatar">
                        {authorName.charAt(0).toUpperCase()}
                      </div>

                      <div className="comment-content">
                        <div className="comment-header">
                          <strong>{authorName}</strong>

                          <span>
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>

                        <p>{comment.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="comment-form">
              <textarea
                className="input manager-textarea"
                placeholder="Adicionar comentário..."
                value={newComment}
                onChange={(event) =>
                  setNewComment(
                    event.target.value,
                  )
                }
              />

              <button
                type="button"
                className="button button-primary"
                onClick={handleAddComment}
                disabled={
                  saving ||
                  !newComment.trim()
                }
              >
                <MessageCircle size={16} />
                Adicionar comentário
              </button>
            </div>
          </div>
        </div>

        <aside className="details-sidebar">
          <div className="details-card">
            <div className="details-card-header">
              <h2>Informações</h2>
            </div>

            <div className="details-info-list">
              <div className="details-info-item">
                <span>Status</span>

                <strong>
                  {currentStatus.label}
                </strong>
              </div>

              <div className="details-info-item">
                <span>Prioridade</span>

                <strong>
                  {priorityLabels[
                    occurrence.priority
                  ]}
                </strong>
              </div>

              <div className="details-info-item">
                <span>Responsável</span>

                <strong>
                  {managers.find(
                    (manager) =>
                      manager.id ===
                      occurrence.responsibleId,
                  )?.name ??
                    "Não atribuído"}
                </strong>
              </div>

              <div className="details-info-item">
                <span>Registrada em</span>

                <strong>
                  {formatDate(
                    occurrence.createdAt,
                  )}
                </strong>
              </div>

              <div className="details-info-item">
                <span>Última atualização</span>

                <strong>
                  {formatDate(
                    occurrence.updatedAt,
                  )}
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
