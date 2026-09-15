import { useState } from "react";
import { ArrowLeft, ImagePlus, MapPin, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SyntheticEvent } from "react";

import {
  createOccurrence,
  type CreateOccurrenceData,
} from "../../services/occurrence.service";

const categories = [
  "Iluminação",
  "Equipamento",
  "Acessibilidade",
  "Limpeza",
  "Vazamento",
  "Segurança",
  "Manutenção",
  "Outro",
];

function NewOccurrence() {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateOccurrenceData>({
    title: "",
    description: "",
    category: "",
    location: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    field: keyof CreateOccurrenceData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.category ||
      !form.location.trim()
    ) {
      setError("Preencha todos os campos obrigatórios.");

      return;
    }

    try {
      setLoading(true);

      await createOccurrence({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim(),
        imageUrl: form.imageUrl?.trim() || undefined,
      });

      navigate("/minhas-ocorrencias");
    } catch (error) {
      console.error("Erro ao criar ocorrência:", error);

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
          "Não foi possível registrar a ocorrência.",
        );
      } else if (
        error &&
        typeof error === "object" &&
        "request" in error
      ) {
        setError("Não foi possível conectar ao servidor.");
      } else {
        setError("Não foi possível registrar a ocorrência.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/minhas-ocorrencias")}
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <span className="page-eyebrow">Nova solicitação</span>

          <h1>Registrar ocorrência</h1>

          <p>
            Descreva o problema para que ele possa ser analisado e
            resolvido.
          </p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-section">
            <div className="form-section-header">
              <div>
                <h2>Informações da ocorrência</h2>
                <p>
                  Conte o que aconteceu e onde o problema está.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field form-field-full">
                <label htmlFor="title">
                  Título <span>*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    handleChange("title", event.target.value)
                  }
                  placeholder="Ex.: Lâmpada queimada na entrada"
                  maxLength={120}
                  disabled={loading}
                />
              </div>

              <div className="form-field">
                <label htmlFor="category">
                  Categoria <span>*</span>
                </label>

                <select
                  id="category"
                  value={form.category}
                  onChange={(event) =>
                    handleChange("category", event.target.value)
                  }
                  disabled={loading}
                >
                  <option value="">
                    Selecione uma categoria
                  </option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="location">
                  Localização <span>*</span>
                </label>

                <div className="input-with-icon">
                  <MapPin size={17} />

                  <input
                    id="location"
                    type="text"
                    value={form.location}
                    onChange={(event) =>
                      handleChange(
                        "location",
                        event.target.value,
                      )
                    }
                    placeholder="Ex.: Bloco B, entrada principal"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="description">
                  Descrição <span>*</span>
                </label>

                <textarea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    handleChange(
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Descreva o problema com o máximo de detalhes possível..."
                  rows={6}
                  disabled={loading}
                />

                <span className="field-hint">
                  Inclua informações que possam ajudar na identificação
                  e resolução do problema.
                </span>
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="imageUrl">
                  Imagem
                </label>

                <div className="input-with-icon">
                  <ImagePlus size={17} />

                  <input
                    id="imageUrl"
                    type="url"
                    value={form.imageUrl}
                    onChange={(event) =>
                      handleChange(
                        "imageUrl",
                        event.target.value,
                      )
                    }
                    placeholder="Cole a URL de uma imagem, se necessário"
                    disabled={loading}
                  />
                </div>

                <span className="field-hint">
                  Por enquanto, informe uma URL de imagem. O upload de
                  arquivos será integrado posteriormente.
                </span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate("/minhas-ocorrencias")}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={loading}
            >
              <Send size={17} />

              {loading
                ? "Registrando..."
                : "Registrar ocorrência"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default NewOccurrence;
