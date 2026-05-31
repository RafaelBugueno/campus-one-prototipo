import { createBrowserRouter } from 'react-router';
import TechHub from './pages/TechHub';
import ProfileView from './pages/ProfileView';
import EditProfile from './pages/EditProfile';
import Agenda from './pages/Agenda';
import AdminPanel from './pages/AdminPanel';
import OrganizerPanel from './pages/OrganizerPanel';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: TechHub,
  },

  // 👤 PERFIL (propio o ajeno)
  {
    path: '/profile/:id',
    Component: ProfileView,
  },

  // ✏️ EDITAR PERFIL
  {
    path: '/edit-profile',
    Component: EditProfile,
  },

  // 📅 AGENDA (mentores / expositores)
  {
    path: '/agenda',
    Component: Agenda,
  },

  // 👑 ADMIN PANEL
  {
    path: '/admin',
    Component: AdminPanel,
  },

  // 🧠 ORGANIZADOR
  {
    path: '/organizer',
    Component: OrganizerPanel,
  },
]);