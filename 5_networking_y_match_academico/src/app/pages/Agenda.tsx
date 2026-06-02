import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { FloatingWidgets } from '../components/FloatingWidgets';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  X,
  Plus,
  User,
  Save,
  CalendarDays,
  Clock,
  Check,
  Ban,
  Sparkles,
  Users,
} from 'lucide-react';

interface Request {
  id: number;
  name: string;
  day: string;
  hour: string;
}

interface ScheduledMeeting {
  id: number;
  name: string;
  day:
    | 'Lunes'
    | 'Martes'
    | 'Miércoles'
    | 'Jueves'
    | 'Viernes'
    | 'Sábado'
    | 'Domingo';
  hour: string;
}

const primaryColor = 'rgb(0,123,255)';
const darkBlue = 'rgb(0,50,130)';

export default function Agenda() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [description, setDescription] = useState(
    'Mentor con 5 años de experiencia en desarrollo web.'
  );

  const [interests, setInterests] = useState<string[]>([
    'JavaScript',
    'React',
    'Node.js',
  ]);

  const [newInterest, setNewInterest] = useState('');

  const [requests, setRequests] = useState<Request[]>([
    { id: 1, name: 'Juan Pérez', day: 'Lunes', hour: '10:00' },
    { id: 2, name: 'Ana López', day: 'Miércoles', hour: '14:00' },
  ]);

  const [scheduled, setScheduled] = useState<ScheduledMeeting[]>([
    { id: 3, name: 'Carlos Díaz', day: 'Martes', hour: '11:00' },
    { id: 4, name: 'María González', day: 'Jueves', hour: '15:00' },
  ]);

  const days: ScheduledMeeting['day'][] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  const hours = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  const [availability, setAvailability] = useState<
    Record<string, Record<string, boolean>>
  >(({
    Lunes: {
      '09:00': true,
      '10:00': true,
      '11:00': false,
      '12:00': true,
      '13:00': true,
      '14:00': true,
      '15:00': false,
      '16:00': true,
      '17:00': true,
      '18:00': true,
    },
    Martes: {
      '09:00': true,
      '10:00': true,
      '11:00': true,
      '12:00': false,
      '13:00': true,
      '14:00': true,
      '15:00': true,
      '16:00': true,
      '17:00': true,
      '18:00': true,
    },
    Miércoles: {
      '09:00': true,
      '10:00': false,
      '11:00': true,
      '12:00': true,
      '13:00': true,
      '14:00': true,
      '15:00': true,
      '16:00': true,
      '17:00': false,
      '18:00': true,
    },
    Jueves: {
      '09:00': true,
      '10:00': true,
      '11:00': true,
      '12:00': true,
      '13:00': false,
      '14:00': true,
      '15:00': true,
      '16:00': true,
      '17:00': true,
      '18:00': true,
    },
    Viernes: {
      '09:00': true,
      '10:00': true,
      '11:00': true,
      '12:00': true,
      '13:00': true,
      '14:00': true,
      '15:00': true,
      '16:00': false,
      '17:00': true,
      '18:00': true,
    },
    Sábado: {
      '09:00': false,
      '10:00': false,
      '11:00': false,
      '12:00': false,
      '13:00': false,
      '14:00': false,
      '15:00': false,
      '16:00': false,
      '17:00': false,
      '18:00': false,
    },
    Domingo: {
      '09:00': false,
      '10:00': false,
      '11:00': false,
      '12:00': false,
      '13:00': false,
      '14:00': false,
      '15:00': false,
      '16:00': false,
      '17:00': false,
      '18:00': false,
    },
  }));

  useEffect(() => {
    const handleSidebarState = () => {
      setSidebarCollapsed((prev) => !prev);
    };

    window.addEventListener('toggle-sidebar-state', handleSidebarState);

    return () => {
      window.removeEventListener('toggle-sidebar-state', handleSidebarState);
    };
  }, []);

  const toggleAvailability = (day: string, hour: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: !prev[day]?.[hour],
      },
    }));
  };

  const acceptRequest = (req: Request) => {
    const newScheduled: ScheduledMeeting = {
      id: req.id,
      name: req.name,
      day: req.day as ScheduledMeeting['day'],
      hour: req.hour,
    };

    setScheduled([...scheduled, newScheduled]);
    setRequests(requests.filter((r) => r.id !== req.id));
  };

  const rejectRequest = (id: number) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const cancelMeeting = (id: number) => {
    alert('Se envió mensaje de cancelación');
    setScheduled(scheduled.filter((s) => s.id !== id));
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />
      <FloatingWidgets />

      <div
        className={`
          px-6 py-8 transition-all duration-300
          ${sidebarCollapsed ? 'ml-12' : 'ml-64'}
        `}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Panel de mentoría
            </span>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Agenda del Mentor
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Administra tu perfil, disponibilidad semanal, solicitudes y
              mentorías agendadas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="lg:col-span-1">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="px-6 py-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                  }}
                >
                  <h2 className="text-xl font-bold">Perfil del mentor</h2>
                  <p className="mt-1 text-sm text-white/75">
                    Información visible para estudiantes.
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-100 shadow-sm">
                      <User className="h-14 w-14 text-slate-400" />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      Mentor ULS
                    </h3>

                    <p className="text-sm text-slate-500">
                      Development Web · Tecnología
                    </p>
                  </div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Descripción
                  </label>

                  <textarea
                    className="
                      min-h-[120px] w-full resize-none rounded-xl
                      border border-slate-200 bg-white p-4 text-sm text-slate-700
                      outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                    "
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <Button
                    className="mt-5 w-full rounded-xl"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    Intereses
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Áreas en las que puedes apoyar.
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <div
                        key={index}
                        className="
                          flex items-center gap-2 rounded-full border border-blue-100
                          bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700
                        "
                      >
                        <span>{interest}</span>

                        <button
                          onClick={() => handleRemoveInterest(index)}
                          className="rounded-full p-1 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Nuevo interés"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      className="h-11 rounded-xl"
                    />

                    <Button
                      onClick={handleAddInterest}
                      className="h-11 rounded-xl px-4"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6 lg:col-span-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Solicitudes</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {requests.length}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Agendadas</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {scheduled.length}
                      </p>
                    </div>
                    <CalendarDays className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Horario</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        09-18
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="px-6 py-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                  }}
                >
                  <h3 className="text-xl font-bold">Solicitudes de Mentoría</h3>
                  <p className="mt-1 text-sm text-white/75">
                    Acepta o rechaza nuevas solicitudes.
                  </p>
                </div>

                <div className="p-6">
                  {requests.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-400">
                      No hay solicitudes pendientes.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {requests.map((req) => (
                        <div
                          key={req.id}
                          className="
                            flex flex-col gap-3 rounded-xl border border-slate-200
                            bg-slate-50 p-4 md:flex-row md:items-center md:justify-between
                          "
                        >
                          <div>
                            <p className="font-semibold text-slate-900">
                              {req.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {req.day} · {req.hour}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => acceptRequest(req)}
                              className="rounded-xl"
                              style={{ backgroundColor: primaryColor }}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Aceptar
                            </Button>

                            <Button
                              variant="destructive"
                              onClick={() => rejectRequest(req.id)}
                              className="rounded-xl"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Rechazar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="px-6 py-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                  }}
                >
                  <h3 className="text-xl font-bold">Calendario semanal</h3>
                  <p className="mt-1 text-sm text-white/75">
                    Haz clic sobre una celda libre para activar o desactivar
                    disponibilidad.
                  </p>
                </div>

                <div className="overflow-x-auto p-6">
                  <table className="w-full min-w-[900px] border-separate border-spacing-0 overflow-hidden rounded-xl border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border-b border-slate-200 p-3 text-left text-sm font-bold text-slate-600">
                          Hora
                        </th>

                        {days.map((day) => (
                          <th
                            key={day}
                            className="border-b border-slate-200 p-3 text-center text-sm font-bold text-slate-600"
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {hours.map((hour) => (
                        <tr key={hour}>
                          <td className="border-b border-slate-100 bg-slate-50 p-3 text-sm font-bold text-slate-600">
                            {hour}
                          </td>

                          {days.map((day) => {
                            const meeting = scheduled.find(
                              (s) => s.day === day && s.hour === hour
                            );
                            const isAvailable = availability[day]?.[hour] ?? false;

                            return (
                              <td
                                key={`${day}-${hour}`}
                                onClick={() => {
                                  if (!meeting) toggleAvailability(day, hour);
                                }}
                                className={`
                                  border-b border-l border-slate-100 p-3 text-center text-sm transition
                                  ${
                                    meeting
                                      ? 'bg-blue-50'
                                      : isAvailable
                                      ? 'cursor-pointer bg-green-50 hover:bg-green-100'
                                      : 'cursor-pointer bg-red-50 hover:bg-red-100'
                                  }
                                `}
                              >
                                {meeting ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <span className="font-semibold text-slate-800">
                                      {meeting.name}
                                    </span>

                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                                      Agendada
                                    </span>

                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        cancelMeeting(meeting.id);
                                      }}
                                      className="rounded-lg text-xs"
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                ) : isAvailable ? (
                                  <span className="font-bold text-green-600 select-none">
                                    Disponible
                                  </span>
                                ) : (
                                  <span className="font-bold text-red-500 select-none">
                                    No disponible
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
