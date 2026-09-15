import {
  ClipboardList,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../contexts/useAuth";
import Card from "../../components/ui/Card";

function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="page-container">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">
            Olá, {user?.name}
          </p>

          <h1 className="page-title">
            Dashboard
          </h1>

          <p className="page-description">
            Acompanhe as ocorrências e o andamento
            dos atendimentos.
          </p>
        </div>
      </header>

      <div className="dashboard-grid">
        <Card className="stat-card">
          <div className="stat-icon">
            <ClipboardList size={20} />
          </div>

          <span className="stat-label">
            Total
          </span>

          <strong className="stat-value">
            —
          </strong>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <Clock3 size={20} />
          </div>

          <span className="stat-label">
            Em atendimento
          </span>

          <strong className="stat-value">
            —
          </strong>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <span className="stat-label">
            Resolvidas
          </span>

          <strong className="stat-value">
            —
          </strong>
        </Card>
      </div>
    </section>
  );
}

export default Dashboard;
