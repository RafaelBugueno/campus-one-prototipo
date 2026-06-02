import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { FloatingWidgets } from '../components/FloatingWidgets';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  User,
  Save,
  Search,
  Shield,
  Users,
  Network,
  Settings,
  Trash2,
  Pencil,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  career: string;
  role: 'Estudiante' | 'Mentor' | 'Expositor' | 'Organizador' | 'Administrador';
  matchEnabled: boolean;
  maxConnections: number;
  connections: string[];
}

const primaryColor = 'rgb(0,123,255)';
const darkBlue = 'rgb(0,50,130)';

export default function AdminPanel() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState('');

  const [description, setDescription] = useState(
    'Administrador del sistema Tech Hub ULS.'
  );

  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      name: 'Carlos Ramírez',
      career: 'Ingeniería en Computación',
      role: 'Mentor',
      matchEnabled: true,
      maxConnections: 10,
      connections: ['Ana Fernández', 'Roberto Díaz'],
    },
    {
      id: '2',
      name: 'Ana Fernández',
      career: 'Ingeniería Civil Informática',
      role: 'Estudiante',
      matchEnabled: true,
      maxConnections: 5,
      connections: ['Carlos Ramírez'],
    },
    {
      id: '3',
      name: 'Roberto Díaz',
      career: 'Ingeniería en Software',
      role: 'Expositor',
      matchEnabled: false,
      maxConnections: 8,
      connections: ['Carlos Ramírez'],
    },
    {
      id: '4',
      name: 'Marcela Torres',
      career: 'Administración Académica',
      role: 'Organizador',
      matchEnabled: true,
      maxConnections: 20,
      connections: ['Ana Fernández', 'Carlos Ramírez'],
    },
  ]);

  useEffect(() => {
    const handleSidebarState = () => {
      setSidebarCollapsed((prev) => !prev);
    };

    window.addEventListener('toggle-sidebar-state', handleSidebarState);

    return () => {
      window.removeEventListener('toggle-sidebar-state', handleSidebarState);
    };
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.career.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (id: string, newRole: UserData['role']) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  };

  const handleCareerChange = (id: string, newCareer: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, career: newCareer } : user
      )
    );
  };

  const handleMatchToggle = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, matchEnabled: !user.matchEnabled }
          : user
      )
    );
  };

  const handleMaxConnectionsChange = (id: string, value: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, maxConnections: value }
          : user
      )
    );
  };

  const goToEditProfile = (user: UserData) => {
    if (user.role === 'Estudiante') {
      navigate('/edit-profile');
    } else if (user.role === 'Mentor' || user.role === 'Expositor') {
      navigate('/agenda');
    } else if (user.role === 'Organizador') {
      navigate('/organizer-panel');
    } else if (user.role === 'Administrador') {
      navigate('/admin-panel');
    }
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
              Administración
            </span>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Panel de Administración
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Gestiona usuarios, roles, conexiones y configuración del Match Académico.
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
                  <p className="text-sm text-slate-500">Match activo</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {users.filter((u) => u.matchEnabled).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Roles</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">5</p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
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
                  <h2 className="text-xl font-bold">Mi perfil administrador</h2>
                  <p className="mt-1 text-sm text-white/75">
                    Información visible del administrador.
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-100 shadow-sm">
                      <User className="h-14 w-14 text-slate-400" />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      Administrador Tech Hub
                    </h3>

                    <p className="text-sm text-slate-500">
                      Gestión académica · ULS
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
            </section>

            <section className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="px-6 py-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                  }}
                >
                  <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
                  <p className="mt-1 text-sm text-white/75">
                    Edita roles, carreras, conexiones y disponibilidad de match.
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Search className="h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Buscar usuario por nombre, carrera o rol..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    />
                  </div>

                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                              <User className="h-6 w-6" />
                            </div>

                            <div>
                              <p className="text-lg font-bold text-slate-900">
                                {user.name}
                              </p>

                              <span
                                className={`
                                  mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold
                                  ${
                                    user.matchEnabled
                                      ? 'bg-green-50 text-green-700'
                                      : 'bg-red-50 text-red-600'
                                  }
                                `}
                              >
                                {user.matchEnabled
                                  ? 'Match habilitado'
                                  : 'Match deshabilitado'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => goToEditProfile(user)}
                              className="rounded-xl"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar Perfil
                            </Button>

                            <Button size="sm" className="rounded-xl">
                              <Save className="mr-2 h-4 w-4" />
                              Guardar
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-xl"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                          <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-semibold text-slate-700">
                              Carrera
                            </label>

                            <Input
                              value={user.career}
                              onChange={(e) =>
                                handleCareerChange(user.id, e.target.value)
                              }
                              className="h-11 rounded-xl bg-white"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700">
                              Rol
                            </label>

                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  e.target.value as UserData['role']
                                )
                              }
                              className="
                                h-11 w-full rounded-xl border border-slate-200 bg-white px-3
                                text-sm text-slate-700 outline-none
                              "
                            >
                              <option>Estudiante</option>
                              <option>Mentor</option>
                              <option>Expositor</option>
                              <option>Organizador</option>
                              <option>Administrador</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700">
                              Límite conexiones
                            </label>

                            <Input
                              type="number"
                              value={user.maxConnections}
                              onChange={(e) =>
                                handleMaxConnectionsChange(
                                  user.id,
                                  Number(e.target.value)
                                )
                              }
                              className="h-11 rounded-xl bg-white"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-4 rounded-xl bg-white p-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                              <Network className="h-4 w-4 text-slate-400" />
                              Conexiones actuales
                            </p>

                            {user.connections.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {user.connections.map((connection, index) => (
                                  <span
                                    key={index}
                                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                                  >
                                    {connection}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400">
                                Este usuario no tiene conexiones.
                              </p>
                            )}
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleMatchToggle(user.id)}
                            variant={user.matchEnabled ? 'default' : 'destructive'}
                            className="rounded-xl"
                          >
                            {user.matchEnabled ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Habilitado
                              </>
                            ) : (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deshabilitado
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}

                    {filteredUsers.length === 0 && (
                      <div className="rounded-xl bg-slate-50 p-8 text-center">
                        <Settings className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                        <p className="text-sm text-slate-500">
                          No se encontraron usuarios.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
