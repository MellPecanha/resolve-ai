import {
  Navigate,
  Outlet,
} from "react-router-dom";

import type { UserRole } from "../types/auth";
import { useAuth } from "../contexts/useAuth";

interface RoleRouteProps {
  allowedRole: UserRole;
}

function RoleRoute({
  allowedRole,
}: RoleRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== allowedRole) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}

export default RoleRoute;
