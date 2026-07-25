import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

interface Props {
  allow?: Role[]; // 允许访问的角色，不填则任意已登录用户
}

const ProtectedRoute = ({ allow }: Props) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
