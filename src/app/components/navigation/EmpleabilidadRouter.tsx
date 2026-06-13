import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginModal } from '../LoginModal';
import PublicationsList from '../../../../3_empleabilidad_y_colaboracion/src/app/components/PublicationsList';
import { Footer } from '../Footer';

export function EmpleabilidadRouter() {
  const { userType, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginModal(false);

      if (userType === 'visitor') {
        navigate('/');
        return;
      }

      const allowedTypes = ['student', 'admin', 'empresario'];
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

  if (!isAuthenticated || userType === 'visitor') {
    return (
      <>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Este módulo requiere autenticación.
            </p>
          </div>
        </div>
        <LoginModal isOpen={showLoginModal} onClose={handleLoginClose} />
      </>
    );
  }

  const getUserTypeParam = (): 'estudiante' | 'administrador' | 'empresario' => {
    switch (userType) {
      case 'student': return 'estudiante';
      case 'admin': return 'administrador';
      case 'empresario': return 'empresario';
      default: return 'estudiante';
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-white">
      <div className="flex-1">
        <PublicationsList initialUserType={getUserTypeParam()} />
      </div>
      <Footer />
    </div>
  );
}
