import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Send,
  Star,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  addOccurrenceComment,
  createOccurrenceRating,
  getOccurrence,
  getOccurrenceComments,
  getOccurrenceHistory,
  getOccurrenceRating,
  updateOccurrenceRating,
} from "../../services/occurrence.service";

import type {
  Occurrence,
  OccurrenceComment,
  OccurrenceHistory,
  OccurrencePriority,
  OccurrenceRating,
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

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function OccurrenceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [occurrence, setOccurrence] =
    useState<Occurrence | null>(null);
  const [history, setHistory] = useState<
    OccurrenceHistory[]
  >([]);
  const [comments, setComments] = useState<
    OccurrenceComment[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comment, setComment] = useState("");
  const [sendingComment, setSendingComment] =
    useState(false);
  const [commentError, setCommentError] =
    useState("");
  const [commentSuccess, setCommentSuccess] =
    useState("");

  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] =
    useState("");
  const [existingRating, setExistingRating] =
    useState<OccurrenceRating | null>(null);
  const [sendingRating, setSendingRating] =
    useState(false);
  const [ratingError, setRatingError] =
    useState("");
  const [ratingSuccess, setRatingSuccess] =
    useState("");

  useEffect(() => {
    async function loadOccurrence() {
      if (!id) {
        setError("Ocorrência não encontrada.");
        setLoading(false);
        return;
      }

      try {
        setError("");

        const occurrenceId = Number(id);

        const [
          occurrenceData,
          historyData,
          commentsData,
          ratingData,
        ] = await Promise.all([
          getOccurrence(occurrenceId),
          getOccurrenceHistory(occurrenceId),
          getOccurrenceComments(occurrenceId),
          getOccurrenceRating(occurrenceId),
        ]);

        setOccurrence(occurrenceData);
        setHistory(historyData);
        setComments(commentsData);

        setExistingRating(ratingData);

        if (ratingData) {
          setRating(ratingData.score);
          setRatingComment(ratingData.comment ?? "");
        } else {
          setRating(0);
          setRatingComment("");
        }
      } catch (error) {
        console.error(
          "Erro ao carregar ocorrência:",
          error,
        );

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
          setError(
            "Não foi possível carregar a ocorrência.",
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadOccurrence();
  }, [id]);

  async function handleAddComment(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!id || !comment.trim()) {
      return;
    }

    try {
      setSendingComment(true);
      setCommentError("");
      setCommentSuccess("");

      await addOccurrenceComment(
        Number(id),
        comment.trim(),
      );

      const updatedComments =
        await getOccurrenceComments(Number(id));

      setComments(updatedComments);
      setComment("");

      setCommentSuccess(
        "Comentário adicionado com sucesso.",
      );

      setTimeout(() => {
        setCommentSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Erro ao adicionar comentário:",
        error,
      );

      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const response = (
          error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        ).response;

        setCommentError(
          response?.data?.message ??
          "Não foi possível adicionar o comentário.",
        );
      } else {
        setCommentError(
          "Não foi possível adicionar o comentário.",
        );
      }
    } finally {
      setSendingComment(false);
    }
  }

  async function handleRating(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!id || rating === 0) {
      setRatingError(
        "Selecione uma nota antes de enviar.",
      );
      return;
    }

    try {
      setSendingRating(true);
      setRatingError("");
      setRatingSuccess("");

      const ratingData = existingRating
        ? await updateOccurrenceRating(
          Number(id),
          rating,
          ratingComment.trim() || undefined,
        )
        : await createOccurrenceRating(
          Number(id),
          rating,
          ratingComment.trim() || undefined,
        );

      setExistingRating(ratingData);
      setRating(ratingData.score);
      setRatingComment(ratingData.comment ?? "");

      setRatingSuccess(
        existingRating
          ? "Avaliação atualizada com sucesso."
          : "Avaliação enviada com sucesso.",
      );
    } catch (error) {
      console.error(
        "Erro ao avaliar ocorrência:",
        error,
      );

      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const response = (
          error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        ).response;

        setRatingError(
          response?.data?.message ??
          "Não foi possível enviar sua avaliação.",
        );
      } else {
        setRatingError(
          "Não foi possível enviar sua avaliação.",
        );
      }
    } finally {
      setSendingRating(false);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <div className="state-card">
          <div className="loading-spinner" />

          <div>
            <strong>Carregando ocorrência</strong>
            <p>
              Aguarde enquanto buscamos os detalhes.
            </p>
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
          onClick={() =>
            navigate("/minhas-ocorrencias")
          }
        >
          <ArrowLeft size={16} />
          Voltar para minhas ocorrências
        </button>

        <div className="state-card state-card-error">
          <AlertCircle size={22} />

          <div>
            <strong>
              Não foi possível carregar a ocorrência
            </strong>

            <p>
              {error ||
                "Ocorrência não encontrada."}
            </p>
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
        onClick={() =>
          navigate("/minhas-ocorrencias")
        }
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

        <span
          className={`badge ${status.className}`}
        >
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
              <div className="details-card-title-with-icon">
                <MessageCircle size={18} />
                <h2>Comentários</h2>
              </div>

              <span className="details-card-count">
                {comments.length}
              </span>
            </div>

            {comments.length === 0 ? (
              <div className="details-empty">
                <MessageCircle size={20} />

                <p>
                  Ainda não há comentários nesta
                  ocorrência.
                </p>
              </div>
            ) : (
              <div className="comments-list">
                {comments.map((item) => {
                  const authorName =
                    item.author?.name ??
                    "Usuário";

                  const authorRole =
                    item.author?.role;

                  return (
                    <div
                      className="comment-item"
                      key={item.id}
                    >
                      <div className="comment-avatar">
                        {authorName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="comment-content">
                        <div className="comment-header">
                          <strong>
                            {authorName}
                          </strong>

                          <span>
                            {formatShortDate(
                              item.createdAt,
                            )}
                          </span>
                        </div>

                        <p>{item.content}</p>

                        <span className="comment-role">
                          {authorRole === "GESTOR"
                            ? "Gestor"
                            : "Solicitante"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <form
              className="comment-form"
              onSubmit={handleAddComment}
            >
              <textarea
                className="comment-input"
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                placeholder="Adicione um comentário..."
                rows={3}
                disabled={sendingComment}
              />

              <div className="comment-form-footer">
                <div>
                  {commentError && (
                    <span className="form-feedback form-feedback-error">
                      {commentError}
                    </span>
                  )}

                  {commentSuccess && (
                    <span className="form-feedback form-feedback-success">
                      {commentSuccess}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={
                    sendingComment ||
                    !comment.trim()
                  }
                >
                  <Send size={15} />

                  {sendingComment
                    ? "Enviando..."
                    : "Comentar"}
                </button>
              </div>
            </form>
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

                  if (
                    item.type === "PRIORIDADE" &&
                    item.newPriority
                  ) {
                    HistoryIcon = AlertCircle;
                    title = `Prioridade: ${priorityLabels[item.newPriority]}`;

                    if (item.previousPriority) {
                      transition = `${priorityLabels[item.previousPriority]} → ${priorityLabels[item.newPriority]}`;
                    }
                  }

                  if (
                    item.type === "RESPONSAVEL"
                  ) {
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
                    <div
                      className="history-item"
                      key={item.id}
                    >
                      <div className="history-marker">
                        <HistoryIcon size={15} />
                      </div>

                      <div className="history-content">
                        <div className="history-top">
                          <strong>{title}</strong>

                          <span>
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        {transition && (
                          <span className="history-transition">
                            {transition}
                          </span>
                        )}

                        {item.changedBy && (
                          <span className="history-user">
                            Alterado por{" "}
                            <strong>
                              {item.changedBy.name}
                            </strong>
                          </span>
                        )}

                        {item.observation && (
                          <p>
                            {item.observation}
                          </p>
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

          {occurrence.status === "RESOLVIDA" && (
            <div className="details-card rating-card">
              <div className="details-card-header">
                <div className="details-card-title-with-icon">
                  <Star size={18} />
                  <h2>
                    {existingRating
                      ? "Sua avaliação"
                      : "Avalie a resolução"}
                  </h2>
                </div>
              </div>

              <p className="details-description">
                {existingRating
                  ? "Você pode alterar sua avaliação a qualquer momento."
                  : "Como você avalia a resolução desta ocorrência?"}
              </p>

              <form
                className="rating-form"
                onSubmit={handleRating}
              >
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        className={`rating-star ${value <= rating
                          ? "rating-star-active"
                          : ""
                          }`}
                        onClick={() =>
                          setRating(value)
                        }
                        aria-label={`Avaliar com ${value} ${value === 1
                          ? "estrela"
                          : "estrelas"
                          }`}
                      >
                        <Star
                          size={30}
                          fill={
                            value <= rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    ),
                  )}
                </div>

                <div className="rating-label">
                  {rating === 0
                    ? "Selecione uma nota"
                    : `${rating} ${rating === 1
                      ? "estrela"
                      : "estrelas"
                    }`}
                </div>

                <textarea
                  className="comment-input"
                  value={ratingComment}
                  onChange={(event) =>
                    setRatingComment(
                      event.target.value,
                    )
                  }
                  placeholder="Conte, se quiser, como foi a resolução..."
                  rows={3}
                  disabled={sendingRating}
                />

                {ratingError && (
                  <span className="form-feedback form-feedback-error">
                    {ratingError}
                  </span>
                )}

                {ratingSuccess && (
                  <span className="form-feedback form-feedback-success">
                    {ratingSuccess}
                  </span>
                )}

                <div className="rating-form-footer">
                  <button
                    type="submit"
                    className="button button-primary"
                    disabled={
                      sendingRating ||
                      rating === 0
                    }
                  >
                    {sendingRating
                      ? existingRating
                        ? "Atualizando..."
                        : "Enviando..."
                      : existingRating
                        ? "Atualizar avaliação"
                        : "Enviar avaliação"}
                  </button>
                </div>
              </form>
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
                  {
                    priorityLabels[
                    occurrence.priority
                    ]
                  }
                </strong>
              </div>

              <div className="details-info-item">
                <span>Responsável</span>

                <strong>
                  {occurrence.responsibleId
                    ? `Gestor #${occurrence.responsibleId}`
                    : "Ainda não atribuído"}
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
