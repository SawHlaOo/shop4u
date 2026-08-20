import { Navigate, Outlet } from 'react-router';
import { useApp } from '../appContext';

export default function RoleGate({ allowedRoles = [], redirectTo = '/' }) {
  const { user } = useApp();
  const isAllowed = allowedRoles.length === 0 || allowedRoles.includes(user?.role);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
