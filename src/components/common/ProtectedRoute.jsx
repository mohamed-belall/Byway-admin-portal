import { Navigate, useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "../../atoms/auth";

const ProtectedRoute = ({ children }) => {
  const [auth] = useAtom(authAtom);
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
