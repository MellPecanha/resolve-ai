import {
  useState,
  type FormEvent,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { register } from "../../services/auth.service";

function Register() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
        },
      });
    } catch (error) {
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

        setError(
          response?.data?.message ??
          "Não foi possível criar sua conta.",
        );
      } else {
        setError(
          "Não foi possível criar sua conta.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-header">
        <h1 className="auth-title">
          Crie sua conta.
        </h1>

        <p className="auth-description">
          Cadastre-se para registrar e
          acompanhar suas ocorrências.
        </p>
      </div>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <Input
          id="name"
          name="name"
          type="text"
          label="Nome"
          placeholder="Seu nome"
          autoComplete="name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          minLength={2}
          required
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          autoComplete="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Senha"
          placeholder="••••••••"
          autoComplete="new-password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value,
            )
          }
          minLength={6}
          required
        />

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          className="auth-form-button"
        >
          {isSubmitting
            ? "Criando conta..."
            : "Criar conta"}
        </Button>
      </form>

      <p className="auth-switch">
        Já possui uma conta?{" "}
        <Link to="/login">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
