import {
  useState,
  type SyntheticEvent,
} from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { login } from "../../services/auth.service";
import { useAuth } from "../../contexts/useAuth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const registered =
    Boolean(
      (
        location.state as
        | { registered?: boolean }
        | null
      )?.registered,
    );

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const result = await login({
        email,
        password,
      });

      signIn(
        result.token,
        result.user,
      );

      if (
        result.user.role ===
        "GESTOR"
      ) {
        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      navigate("/minhas-ocorrencias", {
        replace: true,
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
          "Não foi possível realizar o login.",
        );
      } else {
        setError(
          "Não foi possível realizar o login.",
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
          Bem-vindo de volta.
        </h1>

        <p className="auth-description">
          Entre para acompanhar suas
          ocorrências e encontrar soluções.
        </p>
      </div>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      {registered && !error && (
        <div className="auth-success">
          Conta criada com sucesso. Agora você
          pode entrar.
        </div>
      )}

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
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
          autoComplete="current-password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value,
            )
          }
          required
        />

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          className="auth-form-button"
        >
          {isSubmitting
            ? "Entrando..."
            : "Entrar"}
        </Button>
      </form>

      <p className="auth-switch">
        Ainda não tem uma conta?{" "}
        <Link to="/cadastro">
          Criar conta
        </Link>
      </p>

      <p className="auth-switch">
        Esqueceu sua senha? Entre em contato com o suporte.
      </p>
    </AuthLayout>
  );
}

export default Login;
