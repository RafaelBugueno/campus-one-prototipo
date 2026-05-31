import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { FloatingWidgets } from '../components/FloatingWidgets';
import { Button } from '../components/ui/button';
import { ChatWidget } from '../components/ChatWidget';
import {
  User,
  GraduationCap,
  Calendar,
  BadgeCheck,
  MessageCircle,
  Pencil,
  Clock,
  Sparkles,
  Users,
  Briefcase,
  Shield,
  Settings,
  Check,
  X,
} from 'lucide-react';

const primaryColor = 'rgb(0,123,255)';
const darkBlue = 'rgb(0,50,130)';
const accentColor = '#C8102E';

interface Profile {
  id: string;
  name: string;
  rut: string;
  career: string;
  year: string;
  level: string;
  type: 'Estudiante' | 'Mentor' | 'Expositor' | 'Administrador' | 'Organizador';
  description: string;
  interests: string[];
  availability?: string[];
}

export default function ProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);

  const currentUser: Profile = {
    id: '1',
    name: 'María López Retamales',
    rut: '20.968.604-k',
    career: 'Ingeniería en Computación',
    year: '2021',
    level: '3° Nivel',
    type: 'Estudiante',
    description: 'Interesada en IA y desarrollo web',
    interests: ['IA', 'Web', 'Machine Learning'],
  };

  const profilesDatabase: Record<string, Profile> = {
    '19.234.567-8': {
      id: '2',
      name: 'Carlos Ramírez González',
      rut: '19.234.567-8',
      career: 'Ingeniería en Computación',
      year: '2020',
      level: '4° Nivel',
      type: 'Mentor',
      description:
        'Mentor en desarrollo backend y arquitectura de software. Experiencia en proyectos de gran escala.',
      interests: ['Backend', 'Microservicios', 'DevOps', 'Arquitectura de Software'],
      availability: ['10:00', '11:00', '15:00'],
    },
    '21.456.789-0': {
      id: '3',
      name: 'Ana Fernández Silva',
      rut: '21.456.789-0',
      career: 'Ingeniería Civil Informática',
      year: '2022',
      level: '2° Nivel',
      type: 'Estudiante',
      description:
        'Estudiante enfocada en desarrollo de aplicaciones y bases de datos.',
      interests: ['Programación', 'Base de Datos', 'Cloud Computing', 'Python'],
    },
    '18.765.432-1': {
      id: '4',
      name: 'Roberto Díaz Morales',
      rut: '18.765.432-1',
      career: 'Ingeniería en Software',
      year: '2018',
      level: 'Egresado',
      type: 'Expositor',
      description:
        'Experto en DevOps y arquitectura de microservicios. Actualmente trabajando en startups tecnológicas.',
      interests: ['DevOps', 'Microservicios', 'Arquitectura de Software', 'Docker', 'Kubernetes'],
      availability: ['14:00', '16:00', '17:00'],
    },
  };

  const profile: Profile = profilesDatabase[id || ''] || {
    id: 'unknown',
    name: 'Usuario Desconocido',
    rut: id || '',
    career: 'No especificada',
    year: 'N/A',
    level: 'N/A',
    type: 'Estudiante',
    description: 'Perfil no encontrado',
    interests: [],
  };

  const isOwner = currentUser.rut === profile.rut;

  const allHours = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00'];
  const occupied = ['10:00'];

  useEffect(() => {
    const handleSidebarState = () => {
      setSidebarCollapsed((prev) => !prev);
    };

    window.addEventListener('toggle-sidebar-state', handleSidebarState);

    return () => {
      window.removeEventListener('toggle-sidebar-state', handleSidebarState);
    };
  }, []);

  const roleIcon = {
    Estudiante: GraduationCap,
    Mentor: Users,
    Expositor: Briefcase,
    Administrador: Shield,
    Organizador: Settings,
  }[profile.type];

  const RoleIcon = roleIcon;

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
              Perfil académico
            </span>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Vista de Perfil
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Visualiza información académica, intereses, disponibilidad y opciones de conexión.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div
              className="h-32"
              style={{
                background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
              }}
            />

            <div className="px-6 pb-6">
              <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-5 md:flex-row md:items-end">
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-white bg-slate-100 shadow-md">
                    <User className="h-16 w-16 text-slate-400" />
                  </div>

                  <div className="pb-1">
                    <h2 className="text-3xl font-bold text-slate-900">
                      {profile.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {profile.rut}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        <RoleIcon className="h-3.5 w-3.5" />
                        {profile.type}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {profile.level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {!isOwner && (
                    <Button
                      onClick={() => setOpenChat(true)}
                      className="rounded-xl"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Conectar
                    </Button>
                  )}

                  {isOwner && (
                    <Button
                      onClick={() => navigate('/edit-profile')}
                      className="rounded-xl"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-6 h-[3px] w-24 rounded-full" style={{ backgroundColor: accentColor }} />

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-3 text-lg font-bold text-slate-900">
                      Descripción
                    </h3>

                    <p className="text-sm leading-relaxed text-slate-600">
                      {profile.description}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="mb-3 text-lg font-bold text-slate-900">
                    Información académica
                  </h3>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <GraduationCap className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">Carrera</p>
                        <p className="text-sm font-medium text-slate-700">
                          {profile.career}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">Año ingreso</p>
                        <p className="text-sm font-medium text-slate-700">
                          {profile.year}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Intereses
                </h3>

                {profile.interests.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    Este perfil no tiene intereses registrados.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {isOwner && profile.type === 'Estudiante' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">
                  Mentorías
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Agenda nuevas mentorías y revisa tus matches disponibles.
                </p>

                <Button
                  className="mt-5 rounded-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  Agendar Mentoría
                </Button>
              </div>
            )}

            {isOwner &&
              (profile.type === 'Mentor' || profile.type === 'Expositor') && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Gestión de Agenda
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Administra disponibilidad, solicitudes y horas agendadas.
                      </p>
                    </div>

                    <Button
                      onClick={() => navigate('/agenda')}
                      className="rounded-xl"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Ir a Agenda
                    </Button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-6">
                    {allHours.map((hour) => (
                      <div
                        key={hour}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-sm font-semibold text-slate-600"
                      >
                        {hour}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 font-bold text-slate-900">
                      Solicitudes pendientes
                    </h4>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Juan Pérez
                      </span>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="rounded-xl"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Aceptar
                        </Button>

                        <Button size="sm" variant="destructive" className="rounded-xl">
                          <X className="mr-2 h-4 w-4" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {!isOwner &&
              (profile.type === 'Mentor' || profile.type === 'Expositor') && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div
                    className="px-6 py-5 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                    }}
                  >
                    <h3 className="text-xl font-bold">Agendar Mentoría</h3>
                    <p className="mt-1 text-sm text-white/75">
                      Selecciona una hora disponible para enviar una solicitud.
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                      {allHours.map((hour) => {
                        const isOccupied = occupied.includes(hour);
                        const isSelected = selectedHour === hour;

                        return (
                          <button
                            key={hour}
                            disabled={isOccupied}
                            onClick={() => setSelectedHour(hour)}
                            className={`
                              rounded-xl border p-3 text-center text-sm font-semibold transition
                              ${
                                isOccupied
                                  ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                                  : isSelected
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-blue-50'
                              }
                            `}
                          >
                            <Clock className="mx-auto mb-1 h-4 w-4" />
                            {hour}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      className="mt-5 rounded-xl"
                      style={{ backgroundColor: primaryColor }}
                      disabled={!selectedHour}
                    >
                      Agendar
                    </Button>
                  </div>
                </div>
              )}

            {isOwner && profile.type === 'Organizador' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">
                  Panel Organizador
                </h3>

                <Button
                  onClick={() => navigate('/organizer-panel')}
                  className="mt-4 rounded-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  Configurar parámetros
                </Button>
              </div>
            )}

            {isOwner && profile.type === 'Administrador' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">
                  Panel Administrador
                </h3>

                <Button
                  onClick={() => navigate('/admin-panel')}
                  className="mt-4 rounded-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  Gestionar Usuarios
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {openChat && <ChatWidget />}
    </div>
  );
}