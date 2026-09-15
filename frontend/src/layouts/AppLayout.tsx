import {
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../contexts/useAuth";

function AppLayout() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const isManager =
    user.role === "GESTOR";

  function handleLogout() {
    signOut();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <div className="brand-mark">
            <img
              className="brand-mark-image"
              src="/favicon.svg"
              alt=""
              aria-hidden="true"
            />
          </div>

          <span>
            resolve <strong>aí</strong>
          </span>
        </div>

        <div className="app-user">
          <div className="app-user-info">
            <span className="app-user-name">
              {user.name}
            </span>

            <span className="app-user-role">
              {isManager
                ? "Gestor"
                : "Solicitante"}
            </span>
          </div>

          <div className="app-avatar">
            {user.name
              .charAt(0)
              .toUpperCase()}
          </div>
        </div>
      </header>

      <aside className="app-sidebar">
        <nav className="sidebar-nav">
          {isManager ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `sidebar-item ${isActive
                    ? "sidebar-item-active"
                    : ""
                  }`
                }
              >
                <span className="sidebar-icon">
                  <Settings size={20} />
                </span>

                <span className="sidebar-label">
                  Dashboard
                </span>
              </NavLink>

              <NavLink
                to="/ocorrencias"
                className={({ isActive }) =>
                  `sidebar-item ${isActive
                    ? "sidebar-item-active"
                    : ""
                  }`
                }
              >
                <span className="sidebar-icon">
                  <UserRound size={20} />
                </span>

                <span className="sidebar-label">
                  Ocorrências
                </span>
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/minhas-ocorrencias"
              className={({ isActive }) =>
                `sidebar-item ${isActive
                  ? "sidebar-item-active"
                  : ""
                }`
              }
            >
              <span className="sidebar-icon">
                <Settings size={20} />
              </span>

              <span className="sidebar-label">
                Minhas ocorrências
              </span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-item sidebar-logout"
            onClick={handleLogout}
          >
            <span className="sidebar-icon">
              <LogOut size={20} />
            </span>

            <span className="sidebar-label">
              Sair
            </span>
          </button>
        </div>
      </aside>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
