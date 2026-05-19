import { Navigate } from 'react-router-dom';
import { authStorage } from '../utils/security';

export default function ProtectedRoute({ children }) {
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
