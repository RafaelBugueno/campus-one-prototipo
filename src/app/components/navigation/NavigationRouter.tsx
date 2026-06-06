import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import VisitorView from '../../../../1_navegacion_inteligente/src/app/components/VisitorView';
import StudentView from '../../../../1_navegacion_inteligente/src/app/components/StudentView';
import AdminView from '../../../../1_navegacion_inteligente/src/app/components/AdminView';

export function NavigationRouter() {
  const { userType, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si no hay usuario autenticado, mostrar vista de visitante
  if (!isAuthenticated || userType === 'visitor') {
    return <VisitorView onGoHome={() => navigate('/')} />;
  }

  // Si es estudiante, mostrar vista de estudiante
  if (userType === 'student') {
    return <StudentView onGoHome={() => navigate('/')} />;
  }

  // Si es administrador, mostrar vista de administrador
  if (userType === 'admin') {
    return <AdminView onGoHome={() => navigate('/')} />;
  }

  // Por defecto, mostrar vista de visitante
  return <VisitorView onGoHome={() => navigate('/')} />;
}
