import { Navigate } from 'react-router-dom';
import { authStorage } from '../utils/security';

// Protege rutas exclusivas de administrador:
// verifica sesión activa Y que el rol almacenado sea "admin".
export default function AdminRoute({ children }) {
  const user = authStorage.getUser();

  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
