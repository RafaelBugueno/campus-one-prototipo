import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import TechHub from '../../../../5_networking_y_match_academico/src/app/pages/TechHub';
import ProfileView from '../../../../5_networking_y_match_academico/src/app/pages/ProfileView';
import EditProfile from '../../../../5_networking_y_match_academico/src/app/pages/EditProfile';
import Agenda from '../../../../5_networking_y_match_academico/src/app/pages/Agenda';
import AdminPanel from '../../../../5_networking_y_match_academico/src/app/pages/AdminPanel';
import OrganizerPanel from '../../../../5_networking_y_match_academico/src/app/pages/OrganizerPanel';
import { Footer } from '../Footer';

export function NetworkingRouter() {
  const { userType, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="home" replace />} />

          <Route path="home" element={<TechHub />} />
          <Route path="profile/:id" element={<ProfileView />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="agenda" element={<Agenda />} />

          {userType === 'admin' && (
            <Route path="admin" element={<AdminPanel />} />
          )}

          {userType === 'organizer' && (
            <Route path="organizer" element={<OrganizerPanel />} />
          )}

          <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
