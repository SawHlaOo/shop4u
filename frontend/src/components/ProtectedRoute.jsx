import { Navigate, Outlet, useLocation } from 'react-router';
import { useApp } from '../appContext';

export default function ProtectedRoute({ requiredRole = null }) {
  const { user } = useApp();
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
