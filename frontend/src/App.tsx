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
import Profile from "./pages/profile/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import ManagerOccurrences from "./pages/manager/Occurrence";
import ManagerOccurrenceDetails from "./pages/manager/OccurrenceDetails";

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
              path="/perfil"
              element={<Profile />}
            />

            <Route
              element={
                <RoleRoute
                  allowedRole="SOLICITANTE"
                />
              }
            >
            </Route>

            <Route
              element={
                <RoleRoute
                  allowedRole="GESTOR"
                />
              }
            >
            </Route>
          </Route>
        </Route>

        <Route
          path="/"
          element={<Home />}
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
