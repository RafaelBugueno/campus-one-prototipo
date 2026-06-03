import { useState, useEffect, useRef } from 'react';
import { ChatWidget } from '../components/ChatWidget';
import { useNavigate } from 'react-router-dom'; // Importación para la navegación interna de React Router
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
  BadgeCheck,
  Calendar as CalendarIcon,
  Send,
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Users,
  Search
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
const accentColor = '#C8102E';

interface Post {
  id: number;
  author: string;
  role: string;
  content: string;
  image?: string;
  date: string;
  likes: number;
  comments: number;
}

interface Connection {
  id: string; // Cambiado a string para que coincida con los RUTs identificadores de ProfileView
  name: string;
  role: string;
  avatarUrl?: string;
}

export default function EditProfile() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // Inicialización del hook de navegación
  const [chatOpen, setChatOpen] = useState(false);
  const [chatUserId, setChatUserId] = useState<string>();

  // Estados del perfil
  const [career, setCareer] = useState('Ingeniería en Computación');
  const [description, setDescription] = useState(
    'Apasionada por el desarrollo web y la IA.'
  );
  const [interests, setInterests] = useState<string[]>([
    'Machine Learning',
    'Frontend',
  ]);
  const [newInterest, setNewInterest] = useState('');

  // Estados para conexiones
  const [showConnections, setShowConnections] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Datos simulados sincronizados con las llaves (RUTs) de profilesDatabase en ProfileView.tsx
  const [connections] = useState<Connection[]>([
    { id: '19.234.567-8', name: 'Carlos Ramírez González', role: 'Mentor • Ingeniería en Computación' },
    { id: '21.456.789-0', name: 'Ana Fernández Silva', role: 'Estudiante • Ingeniería Civil Informática' },
    { id: '18.765.432-1', name: 'Roberto Díaz Morales', role: 'Expositor • Ingeniería en Software' },
  ]);

  // Estados para publicaciones e imágenes multimedia
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'María López Retamales',
      role: 'Estudiante • Ingeniería en Computación',
      content: '¡Acabo de actualizar mi perfil! Emocionada por comenzar los nuevos proyectos de Machine Learning este semestre. 🚀',
      date: 'Hace 5 minutos',
      likes: 4,
      comments: 0
    }
  ]);

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

    // Cerrar el globo de conexiones al hacer click fuera de él
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowConnections(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('toggle-sidebar-state', handleSidebarState);
      document.removeEventListener('mousedown', handleClickOutside);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublishPost = () => {
    if (!newPostContent.trim() && !selectedImage) return;

    const newPost: Post = {
      id: Date.now(),
      author: 'María López Retamales',
      role: `Estudiante • ${career}`,
      content: newPostContent.trim(),
      image: selectedImage || undefined,
      date: 'Ahora mismo',
      likes: 0,
      comments: 0
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    handleRemoveSelectedImage();
  };

  // Filtrar conexiones según la búsqueda
  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Manejar redirección al componente ProfileView mediante React Router
  const handleNavigateToProfile = (userId: string) => {
    navigate(`/networking-y-match-academico/profile/${userId}`); 
  };

  // Redirecciona a ProfileView pasando un estado interno para detonar la apertura automática del ChatWidget
  const handleOpenChat = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation(); // Evita el efecto de propagación del onClick del contenedor padre
    setChatUserId(userId);
    setChatOpen(true);
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
          {/* Encabezado de la página */}
          <div className="mb-8">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Perfil personal
            </span>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Editar Perfil
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Actualiza tu información académica, interactúa con la comunidad y gestiona tus intereses.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* ========================================================================= */}
            {/* COLUMNA IZQUIERDA: VISTA PREVIA DEL PERFIL + SISTEMA DE PUBLICACIONES     */}
            {/* ========================================================================= */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Tarjeta de Perfil Principal */}
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
                      <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-slate-100 shadow-md">
                        <User className="h-16 w-16 text-slate-400" />
                      </div>

                      <div className="pb-1">
                        <h2 className="text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                          María López Retamales
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          20.968.604-k
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            <GraduationCap className="h-3.5 w-3.5" />
                            Estudiante
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            3° Nivel
                          </span>

                          {/* ========================================================================= */}
                          {/* CONTENEDOR ANCLA PARA EL GLOBO DE CONEXIONES                              */}
                          {/* ========================================================================= */}
                          <div className="relative inline-block" ref={popoverRef}>
                            <button 
                              onClick={() => setShowConnections(!showConnections)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition shadow-sm"
                            >
                              <Users className="h-3.5 w-3.5" />
                              <span>{connections.length} Conexiones</span>
                            </button>

                            {/* Globo de texto (Popover) */}
                            {showConnections && (
                              <div className="absolute left-0 mt-2 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 border-t border-l border-slate-200 bg-white" />
                                
                                <h3 className="text-sm font-bold text-slate-800 mb-2.5">Mis Conexiones</h3>
                                
                                {/* Buscador dentro del globo */}
                                <div className="relative mb-3">
                                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                  <input 
                                    type="text" 
                                    placeholder="Buscar por nombre o rol..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs outline-none transition focus:border-blue-400 focus:bg-white"
                                  />
                                </div>

                                {/* Listado de conexiones */}
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                  {filteredConnections.length === 0 ? (
                                    <p className="text-center text-xs text-slate-400 py-4">No se encontraron conexiones.</p>
                                  ) : (
                                    filteredConnections.map((conn) => (
                                      <div 
                                        key={conn.id}
                                        onClick={() => handleNavigateToProfile(conn.id)}
                                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer group"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                                            <User className="h-4 w-4 text-slate-400" />
                                          </div>
                                          <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition truncate">
                                              {conn.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 truncate">{conn.role}</p>
                                          </div>
                                        </div>

                                        {/* Icono circular de Chat */}
                                        <button 
                                          onClick={(e) => handleOpenChat(e, conn.id)}
                                          className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition shrink-0"
                                          title={`Conversar con ${conn.name}`}
                                        >
                                          <MessageCircle className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-[3px] w-24 rounded-full" style={{ backgroundColor: accentColor }} />

                  {/* Distribución interna de Información */}
                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 h-full flex flex-col justify-between">
                        <div>
                          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                            Descripción
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-600">
                            {description || <span className="italic text-slate-400">Sin descripción...</span>}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                        Información académica
                      </h3>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <GraduationCap className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400">Carrera</p>
                            <p className="text-sm font-medium text-slate-700">{career}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CalendarIcon className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-400">Año ingreso</p>
                            <p className="text-sm font-medium text-slate-700">2021</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección de Intereses */}
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      Intereses
                    </h3>
                    {interests.length === 0 ? (
                      <p className="text-sm text-slate-400">Este perfil no tiene intereses registrados.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest, index) => (
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

              {/* Recuadro de publicar con carga de imagen */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-base font-bold text-slate-900">Crear Publicación</h3>
                <div className="flex gap-3 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="w-full space-y-3">
                    <textarea
                      placeholder="¿Qué estás pensando o investigando hoy? Comparte una imagen o texto..."
                      className="
                        min-h-[85px] w-full resize-none rounded-xl
                        border border-slate-200 bg-slate-50/50 p-3
                        text-sm text-slate-700 outline-none
                        transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100
                      "
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />

                    {selectedImage && (
                      <div className="relative inline-block mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-60 bg-slate-50">
                        <img src={selectedImage} alt="Adjunto" className="object-cover max-h-60 w-auto rounded-xl" />
                        <button
                          onClick={handleRemoveSelectedImage}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <div className="flex justify-between items-center pt-1">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition p-2 rounded-lg hover:bg-slate-50"
                      >
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                        <span>Adjuntar Imagen</span>
                      </button>

                      <Button
                        onClick={handlePublishPost}
                        className="rounded-xl text-sm px-4 h-9 shadow-sm transition-all"
                        style={{ backgroundColor: primaryColor }}
                        disabled={!newPostContent.trim() && !selectedImage}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Publicar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed de publicaciones */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-base font-bold text-slate-900">Tus Publicaciones</h3>
                  <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                    {posts.length}
                  </span>
                </div>

                {posts.map((post) => (
                  <div key={post.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{post.author}</h4>
                          <p className="text-xs text-slate-400">{post.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{post.date}</span>
                    </div>

                    {post.content && (
                      <p className="mt-4 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                      </p>
                    )}

                    {post.image && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-150 bg-slate-50 max-h-96 flex items-center justify-center">
                        <img src={post.image} alt="Contenido del post" className="w-full object-cover max-h-96" />
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-6 text-slate-400">
                      <button className="flex items-center gap-1.5 text-xs font-medium hover:text-red-500 transition">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-medium hover:text-blue-500 transition">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-medium hover:text-slate-600 transition ml-auto">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* ========================================================================= */}
            {/* COLUMNA DERECHA: FORMULARIO DE EDICIÓN                                    */}
            {/* ========================================================================= */}
            <div className="lg:col-span-1">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sticky top-24">
                <div
                  className="px-6 py-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${darkBlue}, ${primaryColor})`,
                  }}
                >
                  <h2 className="text-xl font-bold">Información del perfil</h2>
                  <p className="mt-1 text-xs text-white/75">Modifica los datos de tu perfil académico.</p>
                </div>

                <div className="p-5">
                  <div className="mb-6 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <User className="h-10 w-10 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">María López Retamales</h3>
                      <Button variant="outline" size="sm" className="mt-2 rounded-xl text-xs">Cambiar foto</Button>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <GraduationCap className="h-4 w-4 text-slate-400" />
                      Carrera
                    </label>
                    <Select value={career} onValueChange={setCareer}>
                      <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 text-sm">
                        <SelectValue placeholder="Selecciona una carrera" />
                      </SelectTrigger>
                      <SelectContent>
                        {careers.map((careerOption) => (
                          <SelectItem key={careerOption} value={careerOption}>{careerOption}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-5">
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <FileText className="h-4 w-4 text-slate-400" />
                      Descripción
                    </label>
                    <textarea
                      className="
                        min-h-[85px] w-full resize-none rounded-xl
                        border border-slate-200 bg-white p-3
                        text-sm text-slate-700 outline-none
                        transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                      "
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3">
                      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        Intereses
                      </h3>
                      <p className="text-xs text-slate-500">Agrega temas para mejorar tus recomendaciones.</p>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {interests.map((interest, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm"
                        >
                          <span className="truncate max-w-[120px]">{interest}</span>
                          <button
                            onClick={() => handleRemoveInterest(index)}
                            className="rounded-full p-0.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Nuevo interés"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        className="h-10 rounded-xl border-slate-200 bg-white text-sm"
                      />
                      <Button
                        onClick={handleAddInterest}
                        className="h-10 rounded-xl px-3 shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button variant="outline" className="w-full rounded-xl order-2 sm:order-1 sm:w-auto text-sm">Cancelar</Button>
                    <Button
                      className="w-full rounded-xl order-1 sm:order-2 sm:w-auto text-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ChatWidget
        initialOpen={chatOpen}
        initialContactId={chatUserId}
      />
    </div>
  );
}
