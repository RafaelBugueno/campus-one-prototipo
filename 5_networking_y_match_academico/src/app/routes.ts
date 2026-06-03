import { createBrowserRouter } from 'react-router-dom'; // 👈 Forzamos el uso de -dom
import React from 'react';

import TechHub from './pages/TechHub';
import ProfileView from './pages/ProfileView';
import EditProfile from './pages/EditProfile';
import Agenda from './pages/Agenda';
import AdminPanel from './pages/AdminPanel';
import OrganizerPanel from './pages/OrganizerPanel';

export const router = createBrowserRouter([
  {
    path: '/',
    element: React.createElement(TechHub),
  },
  {
    path: '/profile/:id',
    element: React.createElement(ProfileView),
  },
  {
    path: '/edit-profile',
    element: React.createElement(EditProfile), // 👈 Tu página mapeada bajo el mismo contexto
  },
  {
    path: '/agenda',
    element: React.createElement(Agenda),
  },
  {
    path: '/admin',
    element: React.createElement(AdminPanel),
  },
  {
    path: '/organizer',
    element: React.createElement(OrganizerPanel),
  },
]);
