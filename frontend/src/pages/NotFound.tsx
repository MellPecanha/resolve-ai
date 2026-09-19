import { ArrowLeft, CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <Link to="/" className="not-found-brand">
          <img src="/favicon.svg" alt="Resolve Aí" />
          <span>Resolve Aí</span>
        </Link>

        <div className="not-found-icon">
          <CircleAlert size={28} />
        </div>

        <span className="not-found-code">404</span>

        <h1>Página não encontrada</h1>

        <p>
          A página que você está procurando não existe ou não está mais
          disponível.
        </p>

        <Link to="/" className="button button-primary">
          <ArrowLeft size={18} />
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
