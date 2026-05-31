import { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  name: string;
  role: string;
  career: string;
  time: string;
  type: 'incoming' | 'pending' | 'accepted';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    name: 'Carlos Ramírez González',
    role: 'Mentor',
    career: 'Ingeniería en Computación',
    time: 'Hace 2 horas',
    type: 'incoming'
  },
  {
    id: '2',
    name: 'Ana Fernández Silva',
    role: 'Estudiante',
    career: 'Ingeniería Civil Informática',
    time: 'Hace 5 horas',
    type: 'incoming'
  },
  {
    id: '3',
    name: 'Roberto Díaz Morales',
    role: '',
    career: 'Ingeniería en Software',
    time: 'Hace 1 día',
    type: 'pending'
  },
  {
    id: '4',
    name: 'Laura Martínez Pérez',
    role: '',
    career: 'Ingeniería en Computación',
    time: '',
    type: 'accepted'
  }
];

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const incomingRequests = notifications.filter(n => n.type === 'incoming');
  const statusRequests = notifications.filter(n => n.type === 'pending' || n.type === 'accepted');

  const handleAccept = (id: string) => {
    console.log('Aceptar solicitud:', id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleReject = (id: string) => {
    console.log('Rechazar solicitud:', id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
        title="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {incomingRequests.length > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {incomingRequests.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-[2000]"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed md:absolute right-2 md:right-0 top-12 z-[2100] w-[calc(100vw-16px)] md:w-[400px] max-w-[400px] rounded-lg bg-white shadow-2xl border border-slate-200"
            >
              {/* Header */}
              <div className="bg-[#003082] text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-90">Centro de Actividad</p>
                    <h3 className="text-lg font-semibold">Notificaciones</h3>
                  </div>
                  {incomingRequests.length > 0 && (
                    <span className="text-sm bg-white/20 px-2 py-1 rounded">
                      {incomingRequests.length} nueva{incomingRequests.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[500px] overflow-y-auto">
                {/* Incoming Requests */}
                {incomingRequests.length > 0 && (
                  <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                        Solicitudes Entrantes
                      </h4>
                      <span className="text-xs text-slate-500">{incomingRequests.length}</span>
                    </div>

                    <div className="space-y-3">
                      {incomingRequests.map(notification => (
                        <div
                          key={notification.id}
                          className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                              </svg>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h5 className="font-semibold text-gray-900 text-sm truncate">
                                  {notification.name}
                                </h5>
                                <span className="text-xs text-blue-600 font-medium flex-shrink-0">
                                  {notification.role}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{notification.career}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAccept(notification.id)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <Check className="h-4 w-4" />
                              Aceptar
                            </button>
                            <button
                              onClick={() => handleReject(notification.id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <X className="h-4 w-4" />
                              Rechazar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Requests */}
                {statusRequests.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                        Estado de Solicitudes
                      </h4>
                      <span className="text-xs text-slate-500">{statusRequests.length}</span>
                    </div>

                    <div className="space-y-2">
                      {statusRequests.map(notification => (
                        <div
                          key={notification.id}
                          className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 text-sm">{notification.name}</h5>
                            <p className="text-sm text-gray-600">{notification.career}</p>
                            {notification.time && (
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            )}
                          </div>

                          {notification.type === 'pending' && (
                            <span className="flex-shrink-0 text-xs font-medium text-orange-600 flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-orange-600"></span>
                              Pendiente
                            </span>
                          )}

                          {notification.type === 'accepted' && (
                            <span className="flex-shrink-0 text-xs font-medium text-green-600 flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
                              Aceptada
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {notifications.length === 0 && (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No hay notificaciones</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
