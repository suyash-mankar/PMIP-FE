import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("jwt_token");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
