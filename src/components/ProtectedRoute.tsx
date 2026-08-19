import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { token, role } = useAuth();

  // User is not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in but does not have permission
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    if (role === "MANAGER") {
      return <Navigate to="/dashboard" replace />;
    }

    if (role === "TECHNICIAN") {
      return <Navigate to="/technician/work-orders" replace />;
    }

    if (role === "CUSTOMER") {
      return <Navigate to="/customer/work-orders" replace />;
    }

    if (role === "DISPATCHER") {
      return <Navigate to="/dispatcher/work-orders" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
