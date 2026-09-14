import { useAuth } from "../../contexts/useAuth";

function MyOccurrences() {
  const { user } = useAuth();

  return (
    <main>
      <h1>Minhas ocorrências</h1>

      <p>
        Olá, {user?.name}.
      </p>

      <p>
        Área do solicitante.
      </p>
    </main>
  );
}

export default MyOccurrences;
