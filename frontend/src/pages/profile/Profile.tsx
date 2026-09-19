import { ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";

function Profile() {
  const { user } = useAuth();

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

  return (
    <main className="page profile-page">
      <div className="profile-header">
        <span className="page-eyebrow">
          Conta
        </span>

        <h1>Meu perfil</h1>

        <p>
          Gerencie e consulte as informações da sua
          conta no Resolve Aí.
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

        <div className="profile-section">
          <div className="profile-section-heading">
            <div>
              <h2>Informações da conta</h2>

              <p>
                Dados utilizados para identificar seu
                acesso à plataforma.
              </p>
            </div>
          </div>

          <div className="profile-fields">
            <div className="profile-field">
              <span>Nome</span>

              <strong>{user.name}</strong>
            </div>

            <div className="profile-field">
              <span>E-mail</span>

              <strong>{user.email}</strong>
            </div>

            <div className="profile-field">
              <span>Tipo de usuário</span>

              <strong>{roleLabel}</strong>
            </div>

            <div className="profile-field">
              <span>Senha</span>

              <strong>••••••••</strong>
            </div>
          </div>
        </div>

        <div className="profile-security">
          <div className="profile-security-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <strong>Conta protegida</strong>

            <p>
              Seu acesso é protegido por autenticação
              e controle de permissões.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;
