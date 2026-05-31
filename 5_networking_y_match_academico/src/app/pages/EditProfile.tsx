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
  GraduationCap,
  FileText,
  Sparkles,
  Save,
  Eye,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const primaryColor = 'rgb(0,123,255)';
const darkBlue = 'rgb(0,50,130)';

export default function EditProfile() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [career, setCareer] = useState('Ingeniería en Computación');
  const [description, setDescription] = useState(
    'Apasionada por el desarrollo web y la IA.'
  );

  const [interests, setInterests] = useState<string[]>([
    'Machine Learning',
    'Frontend',
  ]);

  const [newInterest, setNewInterest] = useState('');

  const careers = [
    'Ingeniería en Computación',
    'Ingeniería Civil Informática',
    'Ingeniería en Software',
    'Ingeniería en Sistemas',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Redes y Telecomunicaciones',
  ];

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
          px-6 py-8
          transition-all duration-300
          ${sidebarCollapsed ? 'ml-12' : 'ml-64'}
        `}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Perfil personal
            </span>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Editar Perfil
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Actualiza tu información académica, descripción e intereses para
              mejorar tus recomendaciones.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="px-6 py-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                  }}
                >
                  <h2 className="text-2xl font-bold">Información del perfil</h2>
                  <p className="mt-1 text-sm text-white/75">
                    Modifica los datos visibles de tu perfil académico.
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-8 flex items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <User className="h-12 w-12 text-slate-400" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        María López Retamales
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Alumna · Universidad de La Serena
                      </p>

                      <Button variant="outline" className="mt-4 rounded-xl">
                        Cambiar foto
                      </Button>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <GraduationCap className="h-4 w-4 text-slate-400" />
                      Carrera
                    </label>

                    <Select value={career} onValueChange={setCareer}>
                      <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                        <SelectValue placeholder="Selecciona una carrera" />
                      </SelectTrigger>

                      <SelectContent>
                        {careers.map((careerOption) => (
                          <SelectItem key={careerOption} value={careerOption}>
                            {careerOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <FileText className="h-4 w-4 text-slate-400" />
                      Descripción
                    </label>

                    <textarea
                      className="
                        min-h-[130px] w-full resize-none rounded-xl
                        border border-slate-200 bg-white p-4
                        text-sm text-slate-700 outline-none
                        transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                      "
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                          <Sparkles className="h-5 w-5 text-blue-500" />
                          Intereses
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Agrega temas para mejorar tus conexiones académicas.
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {interests.map((interest, index) => (
                        <div
                          key={index}
                          className="
                            flex items-center gap-2 rounded-full
                            border border-blue-100 bg-white px-4 py-2
                            text-sm font-medium text-slate-700 shadow-sm
                          "
                        >
                          <span>{interest}</span>

                          <button
                            onClick={() => handleRemoveInterest(index)}
                            className="
                              rounded-full p-1 text-slate-400
                              transition hover:bg-red-50 hover:text-red-500
                            "
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
                        className="h-11 rounded-xl border-slate-200 bg-white"
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

                  <div className="mt-8 flex justify-end gap-3">
                    <Button variant="outline" className="rounded-xl">
                      Cancelar
                    </Button>

                    <Button
                      className="rounded-xl"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="px-6 py-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    <h3 className="text-xl font-bold">Vista previa</h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-slate-100 shadow-md">
                      <User className="h-16 w-16 text-slate-400" />
                    </div>
                  </div>

                  <div className="mt-5 text-center">
                    <h4 className="text-lg font-bold text-slate-900">
                      María López Retamales
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">{career}</p>
                  </div>

                  <div className="mt-6 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm leading-relaxed text-slate-600">
                      {description}
                    </p>
                  </div>

                  <div className="mt-5">
                    <h5 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
                      Intereses
                    </h5>

                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest, index) => (
                        <span
                          key={index}
                          className="
                            rounded-full bg-blue-50 px-3 py-1.5
                            text-xs font-semibold text-blue-700
                          "
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}