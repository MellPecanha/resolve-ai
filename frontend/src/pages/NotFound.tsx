import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-content">
        <span className="not-found-code">404</span>

        <h1>Página não encontrada</h1>

        <p>
          A página que você está procurando não existe ou foi movida.
        </p>

        <button
          type="button"
          className="button button-primary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Voltar
        </button>
      </div>
    </div>
  );
}

export default NotFound;
