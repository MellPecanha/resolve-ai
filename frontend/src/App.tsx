import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import NotFound from "./pages/NotFound";
import MyOccurrences from "./pages/requester/MyOccurrences";
import NewOccurrence from "./pages/requester/NewOccurrence";
import OccurrenceDetails from "./pages/requester/OccurrenceDetails";
import Dashboard from "./pages/manager/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import AppLayout from "./layouts/AppLayout";


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
          <Route element={<AppLayout />}>
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
                path="/ocorrencias/:id"
                element={<OccurrenceDetails />}
              />

              <Route
                path="/ocorrencias/nova"
                element={<NewOccurrence />}
              />
            </Route>

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
                element={
                  <div>
                    <h1>
                      Ocorrências
                    </h1>
                  </div>
                }
              />
            </Route>
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
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
