import { PanelLeft, ChevronDown, Bell, Check, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CustomNavbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  selectedCampus: string;
  campuses: string[];
  showCampusSelector: boolean;
  onToggleCampusSelector: () => void;
  onSelectCampus: (campus: string) => void;
  showNotifications?: boolean;
}

export function CustomNavbar({
  collapsed,
  onToggleSidebar,
  selectedCampus,
  campuses,
  showCampusSelector,
  onToggleCampusSelector,
  onSelectCampus,
  showNotifications = false,
}: CustomNavbarProps) {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationPanel(false);
      }
    };

    if (showNotificationPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationPanel]);

  const notifications = [
    {
      id: 1,
      name: 'Carlos Ramírez González',
      type: 'Maestro',
      action: 'Ingeniería en Computación',
      time: 'hace 30 minutos',
      status: 'incoming'
    },
    {
      id: 2,
      name: 'Ana Fernández Silva',
      type: 'Estudiante',
      action: 'Ingeniería Informática',
      time: 'hace 1 hora',
      status: 'incoming'
    },
    {
      id: 3,
      name: 'Roberto Díaz Morales',
      type: 'Pendiente',
      action: 'Ingeniería en Software',
      time: 'hace 1 día',
      status: 'pending'
    }
  ];

  const incomingRequests = notifications.filter(n => n.status === 'incoming');
  const pendingRequests = notifications.filter(n => n.status === 'pending');
  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-[1500]
        h-16
        border-b border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg text-[rgb(0,50,130)] transition
              hover:bg-slate-100
            "
            title="Mostrar / ocultar sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Campus Selector (Center) */}
        <div className="flex-1 flex justify-center relative">
          <button
            onClick={onToggleCampusSelector}
            className="bg-[rgb(0,50,130)] px-4 py-2 rounded-lg flex items-center gap-2 border border-white/20 hover:bg-[rgb(0,60,150)] transition"
          >
            <span className="text-white text-sm font-medium">{selectedCampus}</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>

          {showCampusSelector && (
            <div className="absolute top-12 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden min-w-[200px]">
              {campuses.map(campus => (
                <button
                  key={campus}
                  onClick={() => onSelectCampus(campus)}
                  className={`w-full px-6 py-3 text-left transition ${
                    campus === selectedCampus
                      ? 'bg-[rgb(0,50,130)] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Icon */}
        {showNotifications ? (
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotificationPanel(!showNotificationPanel)}
              className="
                flex h-9 w-9 items-center justify-center
                rounded-lg text-[rgb(0,50,130)] transition
                hover:bg-slate-100 relative
              "
              title="Notificaciones"
            >
              <Bell className="h-5 w-5" />
              {incomingRequests.length > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#C8102E] text-white text-xs">
                  {incomingRequests.length}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotificationPanel && (
              <div className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-xl border-2 border-[rgb(0,50,130)] z-[2000]">
                <div className="bg-[rgb(0,50,130)] text-white px-4 py-3 rounded-t-lg">
                  <div className="text-xs uppercase tracking-wider mb-1">Centro de Actividad</div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notificaciones</h3>
                    <span className="text-xs bg-[#C8102E] px-2 py-1 rounded-full">
                      {incomingRequests.length} nuevas
                    </span>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {/* Incoming Requests */}
                  {incomingRequests.length > 0 && (
                    <div className="p-4">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                        Solicitudes Entrantes
                      </h4>
                      {incomingRequests.map(request => (
                        <div key={request.id} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[rgb(0,50,130)] flex items-center justify-center text-white text-sm">
                              {request.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-[rgb(0,50,130)]">{request.name}</p>
                                  <p className="text-xs text-gray-600">{request.action}</p>
                                </div>
                                <span className="text-xs text-[rgb(0,50,130)] bg-blue-50 px-2 py-1 rounded">
                                  {request.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{request.time}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button className="flex-1 bg-[#10B981] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#059669] transition flex items-center justify-center gap-1">
                              <Check className="w-4 h-4" />
                              Aceptar
                            </button>
                            <button className="flex-1 bg-[#C8102E] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#a50f22] transition flex items-center justify-center gap-1">
                              <X className="w-4 h-4" />
                              Rechazar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pending Requests */}
                  {pendingRequests.length > 0 && (
                    <div className="p-4 bg-gray-50">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                        Estado de Solicitudes
                      </h4>
                      {pendingRequests.map(request => (
                        <div key={request.id} className="mb-3 last:mb-0">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">
                              {request.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-[rgb(0,50,130)]">{request.name}</p>
                                  <p className="text-xs text-gray-600">{request.action}</p>
                                </div>
                                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                  {request.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{request.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-9" />
        )}
      </div>
    </nav>
  );
}
