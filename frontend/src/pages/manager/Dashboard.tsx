import { useAuth } from "../../contexts/useAuth";

function Dashboard() {
  const { user } = useAuth();

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        Olá, {user?.name}.
      </p>

      <p>
        Área do gestor.
      </p>
    </main>
  );
}

export default Dashboard;
