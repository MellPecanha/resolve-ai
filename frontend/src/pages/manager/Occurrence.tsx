import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  listOccurrences,
} from "../../services/occurrence.service";

import type {
  Occurrence,
  OccurrencePriority,
  OccurrenceStatus,
} from "../../types/occurrence";

const statusConfig: Record<
  OccurrenceStatus,
  {
    label: string;
    className: string;
  }
> = {
  ABERTA: {
    label: "Aberta",
    className: "badge-warning",
  },
  EM_ANALISE: {
    label: "Em análise",
    className: "badge-info",
  },
  EM_ATENDIMENTO: {
    label: "Em atendimento",
    className: "badge-info",
  },
  RESOLVIDA: {
    label: "Resolvida",
    className: "badge-success",
  },
  CANCELADA: {
    label: "Cancelada",
    className: "badge-danger",
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
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function Occurrences() {
  const navigate = useNavigate();

  const [occurrences, setOccurrences] =
    useState<Occurrence[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<OccurrenceStatus | "">("");

  const [priorityFilter, setPriorityFilter] =
    useState<OccurrencePriority | "">("");

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOccurrences() {
      try {
        setLoading(true);
        setError("");

        const response = await listOccurrences({
          page: 1,
          limit: 50,
        });

        setOccurrences(response.data);
      } catch (error) {
        console.error(
          "Erro ao carregar ocorrências:",
          error,
        );

        setError(
          "Não foi possível carregar as ocorrências.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOccurrences();
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        occurrences.map(
          (occurrence) => occurrence.category,
        ),
      ),
    ).sort();
  }, [occurrences]);

  const filteredOccurrences = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return occurrences.filter((occurrence) => {
      const matchesSearch =
        !normalizedSearch ||
        occurrence.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        occurrence.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        occurrence.location
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        !statusFilter ||
        occurrence.status === statusFilter;

      const matchesPriority =
        !priorityFilter ||
        occurrence.priority === priorityFilter;

      const matchesCategory =
        !categoryFilter ||
        occurrence.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });
  }, [
    occurrences,
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setCategoryFilter("");
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">
            Gestão
          </p>

          <h1 className="page-title">
            Ocorrências
          </h1>

          <p className="page-description">
            Visualize e acompanhe todas as ocorrências
            registradas.
          </p>
        </div>
      </header>

      <div className="occurrence-filters">
        <div className="occurrence-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Buscar ocorrência..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="occurrence-filter-group">
          <SlidersHorizontal size={16} />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                | OccurrenceStatus
                | "",
              )
            }
          >
            <option value="">
              Todos os status
            </option>

            {Object.entries(statusConfig).map(
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

          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(
                event.target.value as
                | OccurrencePriority
                | "",
              )
            }
          >
            <option value="">
              Todas as prioridades
            </option>

            {Object.entries(priorityLabels).map(
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

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value,
              )
            }
          >
            <option value="">
              Todas as categorias
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          {(search ||
            statusFilter ||
            priorityFilter ||
            categoryFilter) && (
              <button
                type="button"
                className="filter-clear"
                onClick={clearFilters}
              >
                Limpar
              </button>
            )}
        </div>
      </div>

      {!loading &&
        !error &&
        filteredOccurrences.length > 0 && (
          <div className="occurrence-results-count">
            {filteredOccurrences.length} ocorrência
            {filteredOccurrences.length !== 1
              ? "s"
              : ""}
          </div>
        )}

      {loading && (
        <div className="state-card">
          <div className="loading-spinner" />

          <div>
            <strong>
              Carregando ocorrências
            </strong>

            <p>
              Aguarde enquanto buscamos os registros.
            </p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="state-card state-card-error">
          <AlertCircle size={22} />

          <div>
            <strong>
              Não foi possível carregar
            </strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {!loading &&
        !error &&
        filteredOccurrences.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Search size={22} />
            </div>

            <h2>
              Nenhuma ocorrência encontrada
            </h2>

            <p>
              Tente alterar os filtros ou o termo
              utilizado na busca.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        filteredOccurrences.length > 0 && (
          <div className="occurrence-list">
            {filteredOccurrences.map(
              (occurrence) => {
                const status =
                  statusConfig[
                  occurrence.status
                  ];

                return (
                  <button
                    type="button"
                    className="occurrence-card"
                    key={occurrence.id}
                    onClick={() =>
                      navigate(
                        `/ocorrencias/${occurrence.id}/gestao`,
                      )
                    }
                  >
                    <div className="occurrence-card-main">
                      <div className="occurrence-card-top">
                        <span className="occurrence-category">
                          {occurrence.category}
                        </span>

                        <span
                          className={`badge ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <h2>
                        {occurrence.title}
                      </h2>

                      <p className="occurrence-description">
                        {occurrence.description}
                      </p>

                      <div className="occurrence-meta">
                        <span>
                          {occurrence.location}
                        </span>

                        <span>
                          Prioridade{" "}
                          {priorityLabels[
                            occurrence.priority
                          ]}
                        </span>

                        <span>
                          {formatDate(
                            occurrence.createdAt,
                          )}
                        </span>
                      </div>
                    </div>

                    <ArrowRight
                      className="occurrence-card-arrow"
                      size={19}
                    />
                  </button>
                );
              },
            )}
          </div>
        )}
    </section>
  );
}

export default Occurrences;
