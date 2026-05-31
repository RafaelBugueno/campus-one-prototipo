import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginModal } from '../LoginModal';
import TechHub from '../../../../5_networking_y_match_academico/src/app/pages/TechHub';
import ProfileView from '../../../../5_networking_y_match_academico/src/app/pages/ProfileView';
import EditProfile from '../../../../5_networking_y_match_academico/src/app/pages/EditProfile';
import Agenda from '../../../../5_networking_y_match_academico/src/app/pages/Agenda';
import AdminPanel from '../../../../5_networking_y_match_academico/src/app/pages/AdminPanel';
import OrganizerPanel from '../../../../5_networking_y_match_academico/src/app/pages/OrganizerPanel';

// Componente que redirige según el tipo de usuario
function RoleBasedRedirect({ userType }: { userType: string }) {
  const redirectPath = (() => {
    switch (userType) {
      case 'admin':
        return 'admin';
      case 'organizer':
        return 'organizer';
      case 'student':
      case 'mentor':
      default:
        return 'home';
    }
  })();

  return <Navigate to={redirectPath} replace />;
}

export function NetworkingRouter() {
  const { userType, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginModal(false);

      if (userType === 'visitor' || userType === 'empresario') {
        navigate('/');
        return;
      }

      const allowedTypes = ['student', 'admin', 'mentor', 'organizer'];
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

  if (!isAuthenticated || userType === 'visitor' || userType === 'empresario') {
    return (
      <>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Este módulo requiere autenticación y está disponible solo para estudiantes, mentores, administradores y organizadores.
            </p>
          </div>
        </div>
        <LoginModal isOpen={showLoginModal} onClose={handleLoginClose} />
      </>
    );
  }

  return (
    <div className="h-screen overflow-y-auto">
      <Routes>
        <Route index element={<RoleBasedRedirect userType={userType as string} />} />
        <Route path="home" element={<TechHub />} />
        <Route path="profile/:id" element={<ProfileView />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="organizer" element={<OrganizerPanel />} />
      </Routes>
    </div>
  );
}
