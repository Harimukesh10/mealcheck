import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

interface AuthguardProps {
  children: ReactNode;
  role: "admin" | "member";
}

const AuthGuard = ({ children, role }: AuthguardProps) => {
  const selectProperty = (state: RootState) => state.auth.user;
  const user = useSelector(selectProperty);
  const userRole = user?.role;

  if (!userRole || (role && userRole !== role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;