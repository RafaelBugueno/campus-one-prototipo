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
  Search,
  Users,
  ShieldAlert,
  Network,
  Settings,
  Sparkles,
  CheckCircle,
  Eye,
} from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  role: 'Estudiante' | 'Mentor' | 'Organizador';
  career: string;
  maxConnections: number;
  mentorshipEnabled: boolean;
  connections: string[];
}

const primaryColor = 'rgb(0,123,255)';
const darkBlue = 'rgb(0,50,130)';

export default function OrganizerPanel() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [description, setDescription] = useState(
    'Organizador del Tech Hub, encargado de la coordinación de eventos.'
  );

  const [interests, setInterests] = useState<string[]>([
    'Gestión de eventos',
    'Coordinación académica',
  ]);

  const [newInterest, setNewInterest] = useState('');

  const [reports] = useState([
    { id: 1, user: 'Carlos Ramírez', reason: 'Spam en chat' },
    { id: 2, user: 'Ana Fernández', reason: 'Contenido inapropiado' },
  ]);

  const [search, setSearch] = useState('');

  const [users, setUsers] = useState<UserData[]>([
    {
      id: 1,
      name: 'Juan Pérez',
      role: 'Estudiante',
      career: 'Ingeniería en Computación',
      maxConnections: 5,
      mentorshipEnabled: true,
      connections: ['Ana López', 'Carlos Díaz'],
    },
    {
      id: 2,
      name: 'Ana López',
      role: 'Mentor',
      career: 'Ingeniería Civil Industrial',
      maxConnections: 10,
      mentorshipEnabled: true,
      connections: ['Juan Pérez'],
    },
    {
      id: 3,
      name: 'Carlos Díaz',
      role: 'Estudiante',
      career: 'Ingeniería en Computación',
      maxConnections: 4,
      mentorshipEnabled: false,
      connections: ['Juan Pérez'],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<UserData>(users[0]);

  useEffect(() => {
    const handleSidebarState = () => {
      setSidebarCollapsed((prev) => !prev);
    };

    window.addEventListener('toggle-sidebar-state', handleSidebarState);

    return () => {
      window.removeEventListener('toggle-sidebar-state', handleSidebarState);
    };
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()) ||
      user.career.toLowerCase().includes(search.toLowerCase())
  );

  const updateSelectedUser = (updatedUser: UserData) => {
    setSelectedUser(updatedUser);
    setUsers(
      users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
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

  const handleSaveConfig = () => {
    alert('Configuración guardada correctamente');
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
              Organización
            </span>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Panel del Organizador
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Coordina usuarios, mentorías, conexiones y reportes dentro de Tech Hub ULS.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Usuarios</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {users.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Mentorías activas</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {users.filter((u) => u.mentorshipEnabled).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Reportes</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {reports.length}
                  </p>
                </div>
                <ShieldAlert className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Conexiones</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {users.reduce((acc, user) => acc + user.connections.length, 0)}
                  </p>
                </div>
                <Network className="h-8 w-8 text-blue-500" />
              </div>
            </div>
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
                  <h2 className="text-xl font-bold">Mi perfil organizador</h2>
                  <p className="mt-1 text-sm text-white/75">
                    Información visible del organizador.
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-100 shadow-sm">
                      <User className="h-14 w-14 text-slate-400" />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      Organizador Tech Hub
                    </h3>

                    <p className="text-sm text-slate-500">
                      Coordinación académica · ULS
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

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      Intereses
                    </h3>

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

                  <Button
                    className="mt-5 w-full rounded-xl"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </section>

            <section className="space-y-6 lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="px-6 py-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                  }}
                >
                  <h2 className="text-xl font-bold">Organización del Sistema</h2>
                  <p className="mt-1 text-sm text-white/75">
                    Busca usuarios y configura sus opciones.
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Search className="h-4 w-4 text-slate-400" />

                    <Input
                      placeholder="Buscar por nombre, rol o carrera"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
                        Usuarios encontrados
                      </h3>

                      <div className="space-y-3">
                        {filteredUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`
                              w-full rounded-2xl border p-4 text-left transition
                              ${
                                selectedUser.id === user.id
                                  ? 'border-blue-400 bg-blue-50 shadow-sm'
                                  : 'border-slate-200 bg-white hover:bg-slate-50'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-blue-600">
                                <User className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {user.name}
                                </p>

                                <p className="text-sm text-slate-500">
                                  {user.role} · {user.career}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
                        Configuración del usuario
                      </h3>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <Settings className="h-5 w-5" />
                          </div>

                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              {selectedUser.name}
                            </h4>

                            <p className="text-sm text-slate-500">
                              {selectedUser.role} · {selectedUser.career}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Límite de conexiones
                          </label>

                          <Input
                            type="number"
                            value={selectedUser.maxConnections}
                            onChange={(e) =>
                              updateSelectedUser({
                                ...selectedUser,
                                maxConnections: Number(e.target.value),
                              })
                            }
                            className="h-11 rounded-xl bg-white"
                          />
                        </div>

                        <label className="mb-5 flex items-center gap-3 rounded-xl bg-white p-4 text-sm font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={selectedUser.mentorshipEnabled}
                            onChange={() =>
                              updateSelectedUser({
                                ...selectedUser,
                                mentorshipEnabled:
                                  !selectedUser.mentorshipEnabled,
                              })
                            }
                            className="h-4 w-4"
                          />

                          Habilitar mentorías para este usuario
                        </label>

                        <div className="mb-5">
                          <h4 className="mb-3 text-sm font-bold text-slate-700">
                            Conexiones actuales ({selectedUser.connections.length})
                          </h4>

                          <div className="flex flex-wrap gap-2">
                            {selectedUser.connections.map((connection, index) => (
                              <span
                                key={index}
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                              >
                                {connection}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={handleSaveConfig}
                          className="w-full rounded-xl"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Guardar configuración
                        </Button>
                      </div>
                    </div>
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
                  <h2 className="text-xl font-bold">Reportes de usuarios</h2>
                  <p className="mt-1 text-sm text-white/75">
                    Revisa y resuelve reportes pendientes.
                  </p>
                </div>

                <div className="p-6">
                  {reports.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-400">
                      No hay reportes pendientes.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reports.map((report) => (
                        <div
                          key={report.id}
                          className="
                            flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4
                            md:flex-row md:items-center md:justify-between
                          "
                        >
                          <div>
                            <p className="font-bold text-slate-900">
                              {report.user}
                            </p>

                            <p className="text-sm text-slate-500">
                              {report.reason}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="rounded-xl">
                              <Eye className="mr-2 h-4 w-4" />
                              Ver
                            </Button>

                            <Button size="sm" variant="destructive" className="rounded-xl">
                              Resolver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
