import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { FloatingWidgets } from '../components/FloatingWidgets';
import { MatchCard } from '../components/match/MatchCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Plus,
  X,
  RefreshCw,
  User,
  GraduationCap,
  Calendar,
  BadgeCheck,
  Sparkles,
  Filter,
  TrendingUp,
} from 'lucide-react';

const primaryColor = 'rgb(0,123,255)';
const darkBlue = 'rgb(0,50,130)';
const accentColor = '#C8102E';

interface Interest {
  id: string;
  text: string;
}

interface MatchProfile {
  name: string;
  rut: string;
  career: string;
  year: string;
  level: string;
  type: 'Estudiante' | 'Mentor' | 'Expositor' | 'Administrador';
  interests: string[];
  match: number;
}

export default function TechHub() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [interests, setInterests] = useState<Interest[]>([
    { id: '1', text: 'Inteligencia Artificial' },
    { id: '2', text: 'Desarrollo Web' },
    { id: '3', text: 'Cloud Computing' },
  ]);

  const [newInterest, setNewInterest] = useState('');
  const [isAddingInterest, setIsAddingInterest] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'Estudiante' | 'Mentor' | 'Expositor'>('all');
  const [matches, setMatches] = useState<MatchProfile[]>([]);

  const currentUser = {
    name: 'María López Retamales',
    rut: '20.968.604-k',
    rutCode: '[2534/0010]',
    career: 'Ingeniería en Computación',
    year: '2021',
    level: '3° Nivel',
    type: 'Estudiante' as const,
    status: 'Alumno/a',
  };

  const matchProfiles: MatchProfile[] = [
    {
      name: 'Carlos Ramírez González',
      rut: '19.234.567-8',
      career: 'Ingeniería en Computación',
      year: '2020',
      level: '4° Nivel',
      type: 'Mentor',
      interests: ['Inteligencia Artificial', 'Desarrollo Web', 'Machine Learning'],
      match: 92,
    },
    {
      name: 'Ana Fernández Silva',
      rut: '21.456.789-0',
      career: 'Ingeniería Civil Informática',
      year: '2022',
      level: '2° Nivel',
      type: 'Estudiante',
      interests: ['Programación', 'Base de Datos', 'Cloud Computing'],
      match: 85,
    },
    {
      name: 'Roberto Díaz Morales',
      rut: '18.765.432-1',
      career: 'Ingeniería en Software',
      year: '2018',
      level: 'Egresado',
      type: 'Expositor',
      interests: ['DevOps', 'Microservicios', 'Arquitectura de Software'],
      match: 78,
    },
    {
      name: 'Laura Martínez Pérez',
      rut: '20.345.678-9',
      career: 'Ingeniería en Computación',
      year: '2021',
      level: '3° Nivel',
      type: 'Estudiante',
      interests: ['Desarrollo Web', 'Frontend', 'UX/UI Design'],
      match: 88,
    },
    {
      name: 'Pedro Sánchez Torres',
      rut: '19.876.543-2',
      career: 'Ingeniería en Computación',
      year: '2019',
      level: '5° Nivel',
      type: 'Mentor',
      interests: ['Inteligencia Artificial', 'Data Science', 'Python'],
      match: 90,
    },
    {
      name: 'Sofía González Muñoz',
      rut: '21.234.567-1',
      career: 'Ingeniería Civil Informática',
      year: '2023',
      level: '1° Nivel',
      type: 'Estudiante',
      interests: ['Programación', 'Algoritmos', 'Estructuras de Datos'],
      match: 75,
    },
  ];

  useEffect(() => {
    setMatches(matchProfiles.sort((a, b) => b.match - a.match));
  }, []);

  useEffect(() => {
    const handleSidebarState = () => {
      setSidebarCollapsed((prev) => !prev);
    };

    window.addEventListener('toggle-sidebar-state', handleSidebarState);

    return () => {
      window.removeEventListener('toggle-sidebar-state', handleSidebarState);
    };
  }, []);

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setInterests([
        ...interests,
        { id: Date.now().toString(), text: newInterest.trim() },
      ]);
      setNewInterest('');
      setIsAddingInterest(false);
    }
  };

  const handleRemoveInterest = (id: string) => {
    setInterests(interests.filter((interest) => interest.id !== id));
  };

  const calculateMatch = (profile: MatchProfile): number => {
    let score = 0;
    const userInterestTexts = interests.map((i) => i.text.toLowerCase());

    profile.interests.forEach((interest) => {
      if (
        userInterestTexts.some(
          (ui) =>
            interest.toLowerCase().includes(ui) ||
            ui.includes(interest.toLowerCase())
        )
      ) {
        score += 30;
      }
    });

    if (profile.career === currentUser.career) {
      score += 20;
    }

    const yearDiff = Math.abs(parseInt(profile.year) - parseInt(currentUser.year));

    if (yearDiff <= 1) score += 15;
    else if (yearDiff <= 2) score += 10;

    if (profile.type === 'Mentor' && currentUser.type === 'Estudiante') {
      score += 15;
    }

    return Math.min(score, 100);
  };

  const handleRefreshMatches = () => {
    const updatedMatches = matchProfiles.map((profile) => ({
      ...profile,
      match: calculateMatch(profile),
    }));

    setMatches(updatedMatches.sort((a, b) => b.match - a.match));
  };

  const handleAcceptMatch = (id: string) => {
    console.log('Conectar con:', id);
    setMatches(matches.filter((m) => m.rut !== id));
  };

  const handleRejectMatch = (id: string) => {
    console.log('Rechazar:', id);
    setMatches(matches.filter((m) => m.rut !== id));
  };

  const filteredMatches =
    filterType === 'all'
      ? matches
      : matches.filter((m) => m.type === filterType);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />
      <FloatingWidgets />

      <div
        className={`
          px-6 py-8
          transition-all duration-300
          ${sidebarCollapsed ? 'ml-12' : 'ml-64'}
        `}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Tech Hub ULS
            </span>

            <h1 className="text-3xl font-bold text-slate-900">
              Match Académico
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="lg:col-span-1">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="h-24"
                  style={{
                    background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                  }}
                />

                <div className="px-6 pb-6">
                  <div className="-mt-14 flex justify-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-slate-100 shadow-md">
                      <User className="h-16 w-16 text-slate-400" />
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold text-slate-900">
                      {currentUser.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {currentUser.rut} · {currentUser.rutCode}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {currentUser.status}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4">
                    <div className="flex gap-3">
                      <GraduationCap className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">Carrera</p>
                        <p className="text-sm font-medium text-slate-700">
                          {currentUser.career}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">
                          Información académica
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          Año {currentUser.year} · {currentUser.level} ·{' '}
                          {currentUser.type}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="mt-5 w-full rounded-xl"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => navigate('/networking-y-match-academico/edit-profile')}
                  >
                    Editar Perfil
                  </Button>
                </div>

                <div className="border-t border-slate-100 px-6 py-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                      Intereses
                    </h3>

                    <Sparkles
                      className="h-4 w-4"
                      style={{ color: accentColor }}
                    />
                  </div>

                  <div className="space-y-2">
                    {interests.length === 0 && (
                      <p className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-400">
                        Aun no has agregado intereses.
                      </p>
                    )}

                    {interests.map((interest) => (
                      <div
                        key={interest.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                      >
                        <span>{interest.text}</span>

                        <button
                          onClick={() => handleRemoveInterest(interest.id)}
                          className="rounded-full p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {isAddingInterest ? (
                    <div className="mt-3 flex gap-2">
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Nuevo interés"
                        className="rounded-xl"
                      />

                      <Button
                        onClick={handleAddInterest}
                        className="rounded-xl"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Agregar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingInterest(true)}
                      className="mt-4 w-full rounded-xl border-dashed"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Interés
                    </Button>
                  )}
                </div>
              </div>
            </section>

            <section className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="flex items-center justify-between px-6 py-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                  }}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                      Recomendaciones
                    </p>

                    <h2 className="text-2xl font-bold">
                      Perfiles compatibles
                    </h2>
                  </div>

                  <button
                    onClick={handleRefreshMatches}
                    className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/25"
                  >
                    <RefreshCw size={16} />
                    Actualizar
                  </button>
                </div>

                <div className="p-6">
                  <Tabs defaultValue="all" className="w-full">
                    <div className="mb-4 flex items-center justify-between">
                      <TabsList className="grid w-full max-w-md grid-cols-4 rounded-xl">
                        <TabsTrigger
                          value="all"
                          onClick={() => setFilterType('all')}
                          className="rounded-lg"
                        >
                          Todos
                        </TabsTrigger>

                        <TabsTrigger
                          value="estudiante"
                          onClick={() => setFilterType('Estudiante')}
                          className="rounded-lg"
                        >
                          Estudiantes
                        </TabsTrigger>

                        <TabsTrigger
                          value="mentor"
                          onClick={() => setFilterType('Mentor')}
                          className="rounded-lg"
                        >
                          Mentores
                        </TabsTrigger>

                        <TabsTrigger
                          value="expositor"
                          onClick={() => setFilterType('Expositor')}
                          className="rounded-lg"
                        >
                          Expositores
                        </TabsTrigger>
                      </TabsList>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">
                          {filteredMatches.length} perfiles
                        </span>
                      </div>
                    </div>

                    {['all', 'estudiante', 'mentor', 'expositor'].map((tab) => (
                      <TabsContent key={tab} value={tab} className="mt-4 space-y-4">
                        {filteredMatches.length === 0 ? (
                          <div className="py-12 text-center text-slate-400">
                            <Filter className="mx-auto mb-3 h-12 w-12 opacity-30" />
                            <p>No hay perfiles compatibles</p>
                          </div>
                        ) : (
                          filteredMatches.map((profile, index) => (
                            <MatchCard
                              key={index}
                              user={profile}
                              onAccept={handleAcceptMatch}
                              onReject={handleRejectMatch}
                              onClick={() => navigate(`/networking-y-match-academico/profile/${profile.rut}`)}
                            />
                          ))
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
