import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import MyOccurrences from "./pages/requester/MyOccurrences";
import NewOccurrence from "./pages/requester/NewOccurrence";
import OccurrenceDetails from "./pages/requester/OccurrenceDetails";

import Dashboard from "./pages/manager/Dashboard";
import ManagerOccurrences from "./pages/manager/Occurrence";
import ManagerOccurrenceDetails from "./pages/manager/OccurrenceDetails";

import Profile from "./pages/profile/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Register />}
        />

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Perfil — disponível para qualquer usuário autenticado */}
            <Route
              path="/perfil"
              element={<Profile />}
            />

            {/* Área do solicitante */}
            <Route
              element={
                <RoleRoute
                  allowedRole="SOLICITANTE"
                />
              }
            >
              <Route
                path="/minhas-ocorrencias"
                element={<MyOccurrences />}
              />

              <Route
                path="/ocorrencias/nova"
                element={<NewOccurrence />}
              />

              <Route
                path="/ocorrencias/:id"
                element={<OccurrenceDetails />}
              />
            </Route>

            {/* Área do gestor */}
            <Route
              element={
                <RoleRoute
                  allowedRole="GESTOR"
                />
              }
            >
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/ocorrencias"
                element={<ManagerOccurrences />}
              />

              <Route
                path="/ocorrencias/:id/gestao"
                element={
                  <ManagerOccurrenceDetails />
                }
              />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
