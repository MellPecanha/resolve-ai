import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import MyOccurrences from "./pages/requester/MyOccurrences";
import Dashboard from "./pages/manager/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RoleRoute allowedRole="SOLICITANTE" />
            }
          >
            <Route
              path="/minhas-ocorrencias"
              element={<MyOccurrences />}
            />
          </Route>

          <Route
            element={
              <RoleRoute allowedRole="GESTOR" />
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
          </Route>
        </Route>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
