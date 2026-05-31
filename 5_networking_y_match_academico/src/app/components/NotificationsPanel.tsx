import { useState } from 'react';
import { Bell, Check, X, UserPlus, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ConnectionRequest {
  id: string;
  name: string;
  career: string;
  type: 'Estudiante' | 'Mentor' | 'Expositor';
  timestamp: string;
}

interface SentRequest {
  id: string;
  name: string;
  career: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

export function NotificationsPanel() {
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([
    {
      id: '1',
      name: 'Carlos Ramírez González',
      career: 'Ingeniería en Computación',
      type: 'Mentor',
      timestamp: 'Hace 2 horas',
    },
    {
      id: '2',
      name: 'Ana Fernández Silva',
      career: 'Ingeniería Civil Informática',
      type: 'Estudiante',
      timestamp: 'Hace 5 horas',
    },
  ]);

  const [sentRequests] = useState<SentRequest[]>([
    {
      id: '1',
      name: 'Roberto Díaz Morales',
      career: 'Ingeniería en Software',
      status: 'pending',
      timestamp: 'Hace 1 día',
    },
    {
      id: '2',
      name: 'Laura Martínez Pérez',
      career: 'Ingeniería en Computación',
      status: 'accepted',
      timestamp: 'Hace 2 días',
    },
    {
      id: '3',
      name: 'Pedro Sánchez Torres',
      career: 'Ingeniería Civil Informática',
      status: 'rejected',
      timestamp: 'Hace 3 días',
    },
  ]);

  const handleAccept = (id: string) => {
    setIncomingRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleReject = (id: string) => {
    setIncomingRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const totalNotifications = incomingRequests.length;

  const getStatusBadge = (status: SentRequest['status']) => {
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
          <Clock className="h-3 w-3" />
          Pendiente
        </span>
      );
    }

    if (status === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Aceptada
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
        <XCircle className="h-3 w-3" />
        Rechazada
      </span>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="
          relative flex h-10 w-10 items-center justify-center
          text-black transition hover:bg-gray-100 rounded-full
          focus:outline-none
        "
        title="Notificaciones"
      >
        <Bell className="h-5 w-5" />

        {totalNotifications > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {totalNotifications}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[420px] max-h-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl"
      >
        {/* HEADER */}
        <div
          className="px-5 py-4 text-white"
          style={{
            background: 'rgb(0,50,130)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Centro de actividad
              </p>
              <h3 className="mt-1 text-lg font-bold">Notificaciones</h3>
            </div>

            <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              {totalNotifications} nuevas
            </div>
          </div>
        </div>

        <div className="max-h-[540px] overflow-y-auto p-4">
          {/* SOLICITUDES ENTRANTES */}
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Solicitudes entrantes
              </h4>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                {incomingRequests.length}
              </span>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                <UserPlus className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  No hay solicitudes pendientes
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Las nuevas conexiones apareceran aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                        <UserPlus className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {request.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {request.career}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                            {request.type}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          {request.timestamp}
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAccept(request.id)}
                            className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Aceptar
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleReject(request.id)}
                            className="rounded-xl bg-red-600 text-white hover:bg-red-700"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ESTADO DE SOLICITUDES */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Estado de solicitudes
              </h4>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                {sentRequests.length}
              </span>
            </div>

            <div className="space-y-2">
              {sentRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {request.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {request.career}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {request.timestamp}
                      </p>
                    </div>

                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}