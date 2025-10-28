import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

type PublicRouteProps = {
  children: React.ReactNode;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext is missing");

  const { user, loading } = auth;

  if (loading) {
    return <div>Loading...</div>;
  }

  // ✅ If logged in, block access to public pages like /login
  if (user) {
    if (user.role === "admin")
      return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/user-dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
