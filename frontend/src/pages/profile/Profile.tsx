import {
  useState,
  type FormEvent,
} from "react";

import {
  Check,
  ChevronDown,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../contexts/useAuth";
import { updateMyProfile } from "../../services/user.service";

function Profile() {
  const {
    user,
    updateUser,
  } = useAuth();

  const [name, setName] =
    useState(user?.name ?? "");

  const [email, setEmail] =
    useState(user?.email ?? "");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmNewPassword, setConfirmNewPassword] =
    useState("");

  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  if (!user) {
    return null;
  }

  const roleLabel =
    user.role === "GESTOR"
      ? "Gestor"
      : "Solicitante";

  const initial = user.name
    .charAt(0)
    .toUpperCase();

  function handleTogglePassword() {
    setIsChangingPassword(
      (current) => !current,
    );

    setError("");
    setSuccess("");
  }

  function handleCancelPasswordChange() {
    setIsChangingPassword(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");

    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      name.trim().length < 2
    ) {
      setError(
        "O nome deve ter pelo menos 2 caracteres.",
      );

      return;
    }

    if (!email.trim()) {
      setError(
        "Informe um e-mail válido.",
      );

      return;
    }

    if (isChangingPassword) {
      if (
        !currentPassword ||
        !newPassword ||
        !confirmNewPassword
      ) {
        setError(
          "Preencha todos os campos para alterar sua senha.",
        );

        return;
      }

      if (newPassword.length < 6) {
        setError(
          "A nova senha deve ter pelo menos 6 caracteres.",
        );

        return;
      }

      if (
        newPassword !== confirmNewPassword
      ) {
        setError(
          "A nova senha e a confirmação não coincidem.",
        );

        return;
      }
    }

    setIsSubmitting(true);

    try {
      const updatedUser =
        await updateMyProfile({
          name: name.trim(),
          email: email.trim(),
          ...(isChangingPassword
            ? {
              currentPassword,
              newPassword,
              confirmNewPassword,
            }
            : {}),
        });

      updateUser(updatedUser);

      setName(updatedUser.name);
      setEmail(updatedUser.email);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setIsChangingPassword(false);

      setSuccess(
        "Seus dados foram atualizados com sucesso.",
      );
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
          "Não foi possível atualizar seus dados.",
        );
      } else {
        setError(
          "Não foi possível atualizar seus dados.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page profile-page">
      <div className="profile-header">
        <span className="page-eyebrow">
          Conta
        </span>

        <h1>Meu perfil</h1>

        <p>
          Gerencie as informações da sua conta
          no Resolve Aí.
        </p>
      </div>

      <section className="profile-card">
        <div className="profile-identity">
          <div className="profile-large-avatar">
            {initial}
          </div>

          <div className="profile-identity-info">
            <h2>{user.name}</h2>

            <p>{user.email}</p>

            <span className="profile-role">
              <UserRound size={14} />
              {roleLabel}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-section">
            <div className="profile-section-heading">
              <div>
                <h2>
                  Informações da conta
                </h2>

                <p>
                  Atualize seu nome e e-mail.
                  Seu tipo de usuário não pode
                  ser alterado.
                </p>
              </div>
            </div>

            <div className="profile-form-grid">
              <Input
                id="profile-name"
                name="name"
                type="text"
                label="Nome"
                placeholder="Seu nome"
                autoComplete="name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                minLength={2}
                required
              />

              <Input
                id="profile-email"
                name="email"
                type="email"
                label="E-mail"
                placeholder="seu@email.com"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                required
              />

              <div className="profile-readonly-field">
                <span>
                  Tipo de usuário
                </span>

                <strong>
                  {roleLabel}
                </strong>

                <small>
                  Esse dado não pode ser alterado.
                </small>
              </div>
            </div>
          </div>

          <div className="profile-section profile-security-section">
            <div className="profile-section-heading profile-security-heading">
              <div className="profile-security-title">
                <div className="profile-section-icon">
                  <LockKeyhole size={18} />
                </div>

                <div>
                  <h2>
                    Senha
                  </h2>

                  <p>
                    Sua senha está protegida.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={`profile-password-toggle ${isChangingPassword
                    ? "active"
                    : ""
                  }`}
                onClick={
                  handleTogglePassword
                }
              >
                {isChangingPassword
                  ? "Fechar"
                  : "Alterar senha"}

                <ChevronDown
                  size={16}
                  className={
                    isChangingPassword
                      ? "rotated"
                      : ""
                  }
                />
              </button>
            </div>

            {isChangingPassword && (
              <div className="profile-password-content">
                <div className="profile-password-info">
                  <p>
                    Para sua segurança, informe
                    sua senha atual antes de
                    definir uma nova.
                  </p>
                </div>

                <div className="profile-form-grid">
                  <Input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    label="Senha atual"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(
                        event.target.value,
                      )
                    }
                  />

                  <Input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    label="Nova senha"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value,
                      )
                    }
                    minLength={6}
                  />

                  <Input
                    id="confirm-new-password"
                    name="confirmNewPassword"
                    type="password"
                    label="Confirmar nova senha"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={
                      confirmNewPassword
                    }
                    onChange={(event) =>
                      setConfirmNewPassword(
                        event.target.value,
                      )
                    }
                    minLength={6}
                  />
                </div>

                <button
                  type="button"
                  className="profile-password-cancel"
                  onClick={
                    handleCancelPasswordChange
                  }
                >
                  Cancelar alteração
                </button>
              </div>
            )}
          </div>

          {(error || success) && (
            <div className="profile-feedback">
              {error && (
                <div className="form-feedback-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="form-feedback-success">
                  <Check size={16} />
                  {success}
                </div>
              )}
            </div>
          )}

          <div className="profile-actions">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Salvando..."
                : "Salvar alterações"}
            </Button>
          </div>
        </form>

        <div className="profile-security">
          <div className="profile-security-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <strong>
              Conta protegida
            </strong>

            <p>
              Sua senha é armazenada de forma
              segura e seu tipo de usuário é
              controlado pelo sistema.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;
