import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginModal } from '../LoginModal';
import RatingApp from '../RatingApp';

export function RatingRouter() {
  const { userType, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginModal(false);

      // Solo permitir acceso a estudiantes y administradores
      const allowedTypes = ['student', 'admin'];
      if (!allowedTypes.includes(userType as string)) {
        navigate('/');
        return;
      }
    } else {
      setShowLoginModal(true);
    }
  }, [isAuthenticated, userType, navigate]);

  const handleLoginClose = () => {
    if (!isAuthenticated) {
      navigate('/');
    }
    setShowLoginModal(false);
  };

  // Si no está autenticado o no es estudiante/admin, mostrar mensaje
  if (!isAuthenticated || (userType !== 'student' && userType !== 'admin')) {
    return (
      <>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Este módulo requiere autenticación como estudiante o administrador.
            </p>
          </div>
        </div>
        <LoginModal isOpen={showLoginModal} onClose={handleLoginClose} />
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-[2000]">
      <RatingApp />
    </div>
  );
}