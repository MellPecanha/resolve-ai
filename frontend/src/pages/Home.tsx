import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Eye,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <header className="home-header">
        <Link to="/" className="home-brand">
          <img src="/favicon.svg" alt="Resolve Aí" />
          <span>resolve <strong>aí</strong></span>
        </Link>
      </header>

      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-badge">Gestão de ocorrências</span>

          <h1>
            Problemas identificados.
            <br />
            <span>Resolve Aí.</span>
          </h1>

          <p>
            Uma plataforma para registrar, acompanhar e gerenciar
            ocorrências de forma simples, organizada e transparente.
          </p>

          <div className="home-actions">
            <Link to="/login" className="button button-primary">
              Entrar
              <ArrowRight size={18} />
            </Link>

            <Link to="/cadastro" className="button button-secondary">
              Criar conta
            </Link>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="home-section-heading">
          <span>Como funciona</span>

          <h2>Do problema à solução.</h2>

          <p>
            Tudo o que você precisa para acompanhar uma ocorrência
            em um só lugar.
          </p>
        </div>

        <div className="home-feature-grid">
          <article className="home-feature-card">
            <div className="home-feature-icon">
              <ClipboardList size={22} />
            </div>

            <h3>Registre</h3>

            <p>
              Cadastre uma ocorrência informando título, descrição,
              categoria e localização.
            </p>
          </article>

          <article className="home-feature-card">
            <div className="home-feature-icon">
              <Eye size={22} />
            </div>

            <h3>Acompanhe</h3>

            <p>
              Consulte o status, histórico e comentários enquanto
              sua ocorrência é analisada.
            </p>
          </article>

          <article className="home-feature-card">
            <div className="home-feature-icon">
              <Wrench size={22} />
            </div>

            <h3>Resolva</h3>

            <p>
              Gestores podem atribuir responsáveis, atualizar
              prioridades e registrar a solução.
            </p>
          </article>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span>Resolve Aí</span>

          <h2>Uma gestão mais simples e transparente.</h2>

          <p>
            Centralize suas ocorrências e acompanhe cada etapa
            até a resolução.
          </p>
        </div>

        <Link to="/cadastro" className="button button-primary">
          Começar agora
          <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="home-footer">
        <span>© 2026 Resolve Aí</span>

        <span className="home-footer-status">
          <CheckCircle2 size={15} />
          Plataforma de gestão de ocorrências
        </span>
      </footer>
    </main>
  );
}

export default Home;
