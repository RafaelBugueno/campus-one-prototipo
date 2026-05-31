import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Briefcase, GraduationCap, Bell, PanelLeft, ChevronDown, ChevronUp, X, Navigation, BarChart, Settings, Network, Star, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import Logo from '@/imports/campusone-logo.png';

type PublicationStatus = 'en-seleccion' | 'activo' | 'en-evaluacion' | 'finalizado';
type UserType = 'estudiante' | 'administrador' | 'empresario';
type OwnershipFilter = 'general' | 'publicados' | 'participando' | 'practicas' | 'reportados' | 'solicitudes' | 'gestionar-filtros';

type Participant = {
  id: string;
  name: string;
  email: string;
  role: string;
  rating: number;
};

type ApplicantStatus = 'postulando' | 'en-evaluacion' | 'aceptado';

type Applicant = {
  id: string;
  name: string;
  email: string;
  career: string;
  status: ApplicantStatus;
};

type Publication = {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  isMyPost: boolean;
  isParticipating: boolean;
  isPractice: boolean;
  date: string;
  projectName: string;
  tags: string[];
  discipline: string;
  requirements: string;
  duration: string;
  location: string;
  status?: PublicationStatus;
  contactEmail?: string;
  contactPhone?: string;
  career?: string;
  scheduleType?: string;
  experienceLevel?: string;
  participants?: Participant[];
  applicants?: Applicant[];
};

const mockPublications: Publication[] = [
  // GENERAL - Proyectos generales donde puedo postular
  {
    id: '1',
    title: 'Desarrollador Frontend React',
    description: 'Buscamos desarrollador con experiencia en React y TypeScript para modernizar portal universitario',
    category: 'general',
    author: 'Departamento de Informática',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-05-01',
    projectName: 'Portal Web Universitario',
    tags: ['React', 'TypeScript', 'Frontend', 'UI'],
    discipline: 'ingenieria',
    requirements: 'Experiencia con React, TypeScript, y responsive design. Conocimientos de accesibilidad web.',
    duration: '3 meses',
    location: 'Remoto/Presencial'
  },
  {
    id: '2',
    title: 'Diseñador UX/UI',
    description: 'Rediseño completo de aplicación móvil estudiantil con enfoque en usabilidad',
    category: 'general',
    author: 'María García',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-04-30',
    projectName: 'App Móvil Estudiantes',
    tags: ['UX', 'UI', 'Figma', 'Mobile Design'],
    discipline: 'diseno',
    requirements: 'Dominio de Figma, experiencia en diseño mobile-first, portfolio requerido.',
    duration: '2 meses',
    location: 'Híbrido'
  },
  {
    id: '3',
    title: 'Data Scientist',
    description: 'Análisis predictivo y modelado de datos para investigación financiera aplicada',
    category: 'general',
    author: 'Ana Martínez',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-04-25',
    projectName: 'Análisis Financiero Predictivo',
    tags: ['Python', 'Machine Learning', 'Pandas', 'Scikit-learn'],
    discipline: 'ciencias',
    requirements: 'Python avanzado, librerías ML, estadística, visualización de datos.',
    duration: '3 meses',
    location: 'Presencial'
  },

  // PUBLICADOS - Mis proyectos con diferentes estados
  {
    id: '11',
    title: 'Backend Developer Node.js',
    description: 'Desarrollo de API REST escalable para plataforma de e-commerce universitaria',
    category: 'publicados',
    author: 'Centro de Innovación',
    isMyPost: true,
    isParticipating: false,
    isPractice: false,
    date: '2026-04-28',
    projectName: 'Plataforma E-commerce ULS',
    tags: ['Node.js', 'API REST', 'MongoDB', 'Express'],
    discipline: 'ingenieria',
    requirements: 'Node.js, Express, bases de datos NoSQL, arquitectura de microservicios.',
    duration: '4 meses',
    location: 'Presencial',
    status: 'en-seleccion',
    applicants: [
      { id: 'a1', name: 'Carlos Muñoz', email: 'carlos.munoz@uls.cl', career: 'Ingeniería Civil Informática', status: 'postulando' },
      { id: 'a2', name: 'María Silva', email: 'maria.silva@uls.cl', career: 'Ingeniería en Software', status: 'postulando' },
      { id: 'a3', name: 'Pedro Rojas', email: 'pedro.rojas@uls.cl', career: 'Ingeniería Civil Informática', status: 'en-evaluacion' },
      { id: 'a4', name: 'Ana Torres', email: 'ana.torres@uls.cl', career: 'Ingeniería en Software', status: 'en-evaluacion' },
      { id: 'a5', name: 'Luis Vargas', email: 'luis.vargas@uls.cl', career: 'Ingeniería Civil Informática', status: 'aceptado' },
      { id: 'a6', name: 'Carolina Díaz', email: 'carolina.diaz@uls.cl', career: 'Ingeniería en Software', status: 'aceptado' }
    ]
  },
  {
    id: '12',
    title: 'Desarrollador Full Stack',
    description: 'Sistema de gestión académica con dashboard interactivo',
    category: 'publicados',
    author: 'Dirección de Tecnología',
    isMyPost: true,
    isParticipating: false,
    isPractice: false,
    date: '2026-04-22',
    projectName: 'Sistema Gestión Académica',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Full Stack'],
    discipline: 'ingenieria',
    requirements: 'Stack MERN/PERN, autenticación, manejo de bases de datos relacionales.',
    duration: '5 meses',
    location: 'Híbrido',
    status: 'activo'
  },
  {
    id: '13',
    title: 'Consultor de Estrategia de Negocios',
    description: 'Asesoría estratégica para emprendimientos en fase inicial dentro de incubadora',
    category: 'publicados',
    author: 'Laura Mendoza',
    isMyPost: true,
    isParticipating: false,
    isPractice: false,
    date: '2026-04-23',
    projectName: 'Incubadora StartUp ULS',
    tags: ['Estrategia', 'Emprendimiento', 'Business Plan', 'Consultoría'],
    discipline: 'negocios',
    requirements: 'Experiencia en consultoría, análisis de mercado, modelo de negocios, pitch deck.',
    duration: '8 semanas',
    location: 'Presencial',
    status: 'en-evaluacion',
    participants: [
      { id: 'p1', name: 'Carlos Ramírez', email: 'carlos.ramirez@uls.cl', role: 'Analista de Negocios', rating: 0 },
      { id: 'p2', name: 'Patricia González', email: 'patricia.gonzalez@uls.cl', role: 'Desarrollador de Estrategias', rating: 0 },
      { id: 'p3', name: 'Juan Pérez', email: 'juan.perez@uls.cl', role: 'Consultor Junior', rating: 0 }
    ]
  },
  {
    id: '14',
    title: 'Ilustrador Digital',
    description: 'Creación de material visual para exposición de arte digital universitaria',
    category: 'publicados',
    author: 'Facultad de Artes',
    isMyPost: true,
    isParticipating: false,
    isPractice: false,
    date: '2026-04-24',
    projectName: 'Exposición Arte Digital ULS',
    tags: ['Ilustración', 'Photoshop', 'Arte Digital', 'Creatividad'],
    discipline: 'artes',
    requirements: 'Adobe Photoshop, Illustrator, portfolio artístico, técnicas de ilustración digital.',
    duration: '2 meses',
    location: 'Híbrido',
    status: 'finalizado'
  },

  // PARTICIPANDO - Proyectos en los que estoy participando
  {
    id: '21',
    title: 'Investigador en Biología Molecular',
    description: 'Proyecto de investigación aplicada en genética vegetal',
    category: 'participando',
    author: 'Laboratorio de Biotecnología',
    isMyPost: false,
    isParticipating: true,
    isPractice: false,
    date: '2026-04-20',
    projectName: 'Genética Vegetal Aplicada',
    tags: ['Biología', 'Genética', 'Investigación', 'Laboratorio'],
    discipline: 'ciencias',
    requirements: 'Técnicas de PCR, cultivo celular, análisis genético, redacción científica.',
    duration: '6 meses',
    location: 'Presencial'
  },
  {
    id: '22',
    title: 'Animador 3D',
    description: 'Creación de contenido animado para material educativo multimedia',
    category: 'participando',
    author: 'Centro Multimedia',
    isMyPost: false,
    isParticipating: true,
    isPractice: false,
    date: '2026-04-21',
    projectName: 'Contenido Educativo 3D',
    tags: ['Blender', '3D', 'Animación', 'Rendering'],
    discipline: 'artes',
    requirements: 'Blender o Maya, animación de personajes, renderizado, portfolio requerido.',
    duration: '3 meses',
    location: 'Remoto'
  },

  // PRACTICAS - Ofertas de práctica profesional
  {
    id: '31',
    title: 'Práctica Profesional - Desarrollo Web',
    description: 'Práctica profesional en desarrollo frontend y backend con tecnologías modernas',
    category: 'practicas',
    author: 'Empresa TechSolutions',
    isMyPost: false,
    isParticipating: false,
    isPractice: true,
    date: '2026-05-10',
    projectName: 'Práctica Desarrollo TechSolutions',
    tags: ['React', 'Node.js', 'Práctica', 'Full Stack'],
    discipline: 'ingenieria',
    requirements: 'Conocimientos en React, Node.js, bases de datos. Estudiante de 4to o 5to año.',
    duration: '6 meses',
    location: 'Presencial',
    contactEmail: 'rrhh@techsolutions.cl',
    contactPhone: '+56 9 1234 5678',
    career: 'Ingeniería Civil en Computación',
    scheduleType: 'Part-time',
    experienceLevel: 'Estudiante'
  },
  {
    id: '32',
    title: 'Práctica Profesional - Marketing Digital',
    description: 'Práctica en área de marketing digital y redes sociales para empresa de retail',
    category: 'practicas',
    author: 'Retail Express',
    isMyPost: false,
    isParticipating: false,
    isPractice: true,
    date: '2026-05-08',
    projectName: 'Práctica Marketing Retail Express',
    tags: ['Marketing', 'Social Media', 'Práctica', 'Digital'],
    discipline: 'negocios',
    requirements: 'Estudiante de marketing o publicidad. Conocimientos en redes sociales y análisis de métricas.',
    duration: '4 meses',
    location: 'Híbrido',
    contactEmail: 'practicas@retailexpress.cl',
    contactPhone: '+56 9 8765 4321',
    career: 'Ingeniería Comercial',
    scheduleType: 'Full-time',
    experienceLevel: 'Estudiante'
  },
  {
    id: '33',
    title: 'Práctica Profesional - Diseño UX/UI',
    description: 'Oportunidad de práctica en diseño de experiencias digitales para startup fintech',
    category: 'practicas',
    author: 'FinTech Innovate',
    isMyPost: false,
    isParticipating: false,
    isPractice: true,
    date: '2026-05-05',
    projectName: 'Práctica Diseño FinTech Innovate',
    tags: ['UX', 'UI', 'Diseño', 'Práctica'],
    discipline: 'diseno',
    requirements: 'Portfolio de diseño, dominio de Figma, estudiante de diseño o carreras afines.',
    duration: '5 meses',
    location: 'Remoto',
    contactEmail: 'jobs@fintechinnovate.com',
    career: 'Diseño',
    scheduleType: 'Part-time',
    experienceLevel: 'Estudiante'
  },
  {
    id: '34',
    title: 'Práctica Profesional - Desarrollo Mobile',
    description: 'Desarrollo de aplicaciones móviles nativas para iOS y Android',
    category: 'publicados',
    author: 'Mi Empresa',
    isMyPost: true,
    isParticipating: false,
    isPractice: true,
    date: '2026-05-15',
    projectName: 'Práctica Mobile Developer',
    tags: ['React Native', 'iOS', 'Android', 'Mobile'],
    discipline: 'ingenieria',
    requirements: 'Conocimientos en React Native o Swift/Kotlin. Estudiante de últimos años.',
    duration: '6 meses',
    location: 'Híbrido',
    contactEmail: 'contacto@miempresa.cl',
    contactPhone: '+56 9 9999 8888',
    career: 'Ingeniería en Informática',
    scheduleType: 'Full-time',
    experienceLevel: 'Estudiante'
  },
  {
    id: '35',
    title: 'Práctica Profesional - Análisis de Datos',
    description: 'Análisis de datos y business intelligence para empresa de logística',
    category: 'publicados',
    author: 'Mi Empresa',
    isMyPost: true,
    isParticipating: false,
    isPractice: true,
    date: '2026-05-12',
    projectName: 'Práctica Data Analytics',
    tags: ['Python', 'SQL', 'Power BI', 'Analytics'],
    discipline: 'ciencias',
    requirements: 'Python, SQL, visualización de datos. Estudiante de ingeniería o ciencias.',
    duration: '5 meses',
    location: 'Presencial',
    contactEmail: 'rrhh@miempresa.cl',
    contactPhone: '+56 9 8888 7777',
    career: 'Ingeniería Civil Industrial',
    scheduleType: 'Part-time',
    experienceLevel: 'Estudiante'
  },

  // REPORTADOS - Publicaciones reportadas por usuarios (solo administrador)
  {
    id: '51',
    title: 'Oferta Sospechosa',
    description: 'Esta oferta parece ser fraudulenta o contiene información engañosa',
    category: 'reportados',
    author: 'Usuario Anónimo',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-05-12',
    projectName: 'Oferta Reportada - Trabajo Remoto',
    tags: ['Reportado', 'Spam'],
    discipline: 'ingenieria',
    requirements: 'Reportado por múltiples usuarios como contenido sospechoso.',
    duration: 'N/A',
    location: 'Remoto'
  },
  {
    id: '52',
    title: 'Contenido Inapropiado',
    description: 'Publicación con lenguaje ofensivo y contenido inapropiado',
    category: 'reportados',
    author: 'Usuario Reportado',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-05-11',
    projectName: 'Proyecto Reportado - Contenido Ofensivo',
    tags: ['Reportado', 'Violación de Normas'],
    discipline: 'negocios',
    requirements: 'Contenido reportado por violación de normas de la comunidad.',
    duration: 'N/A',
    location: 'N/A'
  },

  // SOLICITUDES - Ofertas de empleo pendientes de aprobación (solo administrador)
  {
    id: '61',
    title: 'Desarrollador Full Stack Senior',
    description: 'Empresa busca desarrollador full stack con experiencia en React y Node.js',
    category: 'solicitudes',
    author: 'Tech Solutions SpA',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-05-13',
    projectName: 'Solicitud - Desarrollador Full Stack',
    tags: ['React', 'Node.js', 'Full Stack', 'Senior'],
    discipline: 'ingenieria',
    requirements: 'Mínimo 5 años de experiencia, conocimientos en AWS, Docker y Kubernetes.',
    duration: 'Contrato indefinido',
    location: 'Híbrido',
    contactEmail: 'rrhh@techsolutions.cl',
    contactPhone: '+56 9 8888 7777'
  },
  {
    id: '62',
    title: 'Diseñador Gráfico',
    description: 'Agencia creativa busca diseñador gráfico para proyectos de branding',
    category: 'solicitudes',
    author: 'Agencia Creativa Ltda',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-05-12',
    projectName: 'Solicitud - Diseñador Gráfico',
    tags: ['Diseño', 'Branding', 'Adobe Suite'],
    discipline: 'diseno',
    requirements: 'Dominio de Adobe Creative Suite, experiencia en branding corporativo.',
    duration: '6 meses renovables',
    location: 'Presencial',
    contactEmail: 'contacto@agenciacreativa.cl'
  },
  {
    id: '63',
    title: 'Analista de Datos',
    description: 'Consultora requiere analista de datos con experiencia en Power BI',
    category: 'solicitudes',
    author: 'DataConsult',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-05-10',
    projectName: 'Solicitud - Analista de Datos',
    tags: ['Power BI', 'SQL', 'Analytics', 'Data'],
    discipline: 'ciencias',
    requirements: 'SQL avanzado, Power BI, experiencia con grandes volúmenes de datos.',
    duration: '1 año',
    location: 'Remoto',
    contactEmail: 'jobs@dataconsult.cl',
    contactPhone: '+56 9 7777 6666'
  }
];

export default function PublicationsList({ initialUserType = 'estudiante' }: { initialUserType?: UserType }) {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>(initialUserType);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);

  // Update userType when initialUserType changes
  useEffect(() => {
    setUserType(initialUserType);

    // Set initial ownershipFilter based on user type
    if (initialUserType === 'estudiante') {
      setOwnershipFilter('general');
    } else if (initialUserType === 'empresario') {
      setOwnershipFilter('publicados');
    } else if (initialUserType === 'administrador') {
      setOwnershipFilter('reportados');
    }
  }, [initialUserType]);
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>('general');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [disciplinesOpen, setDisciplinesOpen] = useState(true);
  const [disciplines, setDisciplines] = useState({
    ingenieria: false,
    diseno: false,
    negocios: false,
    ciencias: false,
    artes: false,
  });
  const [projectNameFilter, setProjectNameFilter] = useState('');
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [participantRatings, setParticipantRatings] = useState<{ [key: string]: number }>({});
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [currentApplicants, setCurrentApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);
  const [rejectedApplicants, setRejectedApplicants] = useState<Applicant[]>([]);
  const [showRejectedList, setShowRejectedList] = useState(false);

  // Gestión de disciplinas disponibles (administrador)
  const [availableDisciplines, setAvailableDisciplines] = useState([
    { id: 'ingenieria', name: 'Ingeniería' },
    { id: 'diseno', name: 'Diseño' },
    { id: 'negocios', name: 'Negocios' },
    { id: 'ciencias', name: 'Ciencias' },
    { id: 'artes', name: 'Artes' }
  ]);
  const [newDisciplineName, setNewDisciplineName] = useState('');

  // Filtros específicos para ofertas de práctica
  const [careerFilter, setCareerFilter] = useState('');
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState('');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('');

  // Estados para crear proyecto (estudiante)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectMembers, setNewProjectMembers] = useState('');
  const [newProjectDisciplines, setNewProjectDisciplines] = useState({
    ingenieria: false,
    diseno: false,
    negocios: false,
    ciencias: false,
    artes: false,
  });

  const filteredPublications = mockPublications.filter(pub => {
    // Filtro por categoría base
    if (pub.category !== ownershipFilter) {
      return false;
    }

    // Filtro por nombre de proyecto (común para todas las categorías)
    if (projectNameFilter && !pub.projectName.toLowerCase().includes(projectNameFilter.toLowerCase())) {
      return false;
    }

    // Filtros específicos según categoría
    if (ownershipFilter === 'practicas') {
      // Filtros específicos para ofertas de práctica
      if (careerFilter && pub.career && !pub.career.toLowerCase().includes(careerFilter.toLowerCase())) {
        return false;
      }
      if (scheduleTypeFilter && pub.scheduleType && !pub.scheduleType.toLowerCase().includes(scheduleTypeFilter.toLowerCase())) {
        return false;
      }
      if (experienceLevelFilter && pub.experienceLevel && !pub.experienceLevel.toLowerCase().includes(experienceLevelFilter.toLowerCase())) {
        return false;
      }
    } else {
      // Filtro por disciplina (para general, publicados, participando)
      const activeDisciplines = Object.entries(disciplines)
        .filter(([_, checked]) => checked)
        .map(([key]) => key);
      if (activeDisciplines.length > 0 && !activeDisciplines.includes(pub.discipline)) {
        return false;
      }
    }

    return true;
  });

  const toggleDiscipline = (key: keyof typeof disciplines) => {
    setDisciplines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRateParticipant = (participantId: string, rating: number) => {
    setParticipantRatings(prev => ({
      ...prev,
      [participantId]: rating
    }));
  };

  const handleSaveRatings = () => {
    console.log('Guardando calificaciones:', participantRatings);
    alert('Calificaciones guardadas exitosamente');
    setShowRatingModal(false);
    setParticipantRatings({});
  };

  const handleChangeUserType = (type: UserType) => {
    setUserType(type);
    setShowUserTypeModal(false);
    // Cambiar a la primera categoría del nuevo tipo de usuario
    if (type === 'estudiante') {
      setOwnershipFilter('general');
    } else if (type === 'empresario') {
      setOwnershipFilter('publicados');
    } else {
      setOwnershipFilter('reportados');
    }
  };

  const handleAddDiscipline = () => {
    if (newDisciplineName.trim()) {
      const newId = newDisciplineName.toLowerCase().replace(/\s+/g, '-');
      setAvailableDisciplines([...availableDisciplines, { id: newId, name: newDisciplineName.trim() }]);
      setNewDisciplineName('');
      alert(`Disciplina "${newDisciplineName}" agregada exitosamente`);
    }
  };

  const handleRemoveDiscipline = (disciplineId: string) => {
    if (confirm('¿Estás seguro de eliminar esta disciplina?')) {
      setAvailableDisciplines(availableDisciplines.filter(d => d.id !== disciplineId));
      alert('Disciplina eliminada exitosamente');
    }
  };

  const handleMoveApplicant = (applicantId: string, newStatus: ApplicantStatus) => {
    setCurrentApplicants(currentApplicants.map(applicant =>
      applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
    ));
    setSelectedApplicant(null);
  };

  const handleRejectApplicant = (applicantId: string) => {
    if (confirm('¿Estás seguro de rechazar este postulante?')) {
      const applicant = currentApplicants.find(a => a.id === applicantId);
      if (applicant) {
        setRejectedApplicants([...rejectedApplicants, applicant]);
        setCurrentApplicants(currentApplicants.filter(a => a.id !== applicantId));
      }
      setSelectedApplicant(null);
    }
  };

  const postulando = currentApplicants.filter(a => a.status === 'postulando');
  const enEvaluacion = currentApplicants.filter(a => a.status === 'en-evaluacion');
  const aceptados = currentApplicants.filter(a => a.status === 'aceptado');

  const handleCreateProject = () => {
    if (!newProjectTitle.trim() || !newProjectDescription.trim() || !newProjectMembers.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const selectedDisciplines = Object.entries(newProjectDisciplines)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);

    if (selectedDisciplines.length === 0) {
      alert('Por favor selecciona al menos una disciplina');
      return;
    }

    console.log('Crear proyecto:', {
      title: newProjectTitle,
      description: newProjectDescription,
      members: newProjectMembers,
      disciplines: selectedDisciplines
    });

    alert('Proyecto creado exitosamente');
    setShowCreateProjectModal(false);
    setNewProjectTitle('');
    setNewProjectDescription('');
    setNewProjectMembers('');
    setNewProjectDisciplines({
      ingenieria: false,
      diseno: false,
      negocios: false,
      ciencias: false,
      artes: false,
    });
  };

  const toggleProjectDiscipline = (key: keyof typeof newProjectDisciplines) => {
    setNewProjectDisciplines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex size-full bg-white overflow-hidden relative">
      {/* Modal de gestión de postulantes */}
      {showApplicantsModal && selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Gestionar Postulantes</h2>
                  <p className="text-gray-200">{selectedPublication.projectName}</p>
                </div>
                <button
                  onClick={() => {
                    setShowApplicantsModal(false);
                    setSelectedApplicant(null);
                    setShowRejectedList(false);
                  }}
                  className="text-white hover:bg-[#0040a0] p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Contenido - 3 columnas */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                {/* Columna Postulando */}
                <div className="bg-blue-50 rounded-lg p-4 min-h-[400px]">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Users size={24} className="text-blue-600" />
                    <h3 className="font-bold text-gray-900 text-lg">Postulando</h3>
                  </div>
                  <p className="text-center text-sm text-gray-600 mb-4">{postulando.length} postulante{postulando.length !== 1 ? 's' : ''}</p>
                  <div className="space-y-3">
                    {postulando.map(applicant => (
                      <div
                        key={applicant.id}
                        className={`bg-white rounded-lg p-3 border-2 shadow-sm transition-all cursor-pointer ${
                          selectedApplicant === applicant.id
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedApplicant(selectedApplicant === applicant.id ? null : applicant.id)}
                      >
                        <h4 className="font-semibold text-gray-900">{applicant.name}</h4>
                        <p className="text-sm text-gray-600">{applicant.email}</p>
                        <p className="text-sm text-gray-500 mb-2">{applicant.career}</p>

                        {selectedApplicant === applicant.id && (
                          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveApplicant(applicant.id, 'en-evaluacion');
                              }}
                              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1.5 rounded transition-colors"
                            >
                              Mover a Evaluación
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveApplicant(applicant.id, 'aceptado');
                              }}
                              className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-1.5 rounded transition-colors"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectApplicant(applicant.id);
                              }}
                              className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 rounded transition-colors"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {postulando.length === 0 && (
                      <p className="text-gray-400 text-center text-sm py-8">No hay postulantes</p>
                    )}
                  </div>
                </div>

                {/* Columna En Evaluación */}
                <div className="bg-yellow-50 rounded-lg p-4 min-h-[400px]">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Users size={24} className="text-yellow-600" />
                    <h3 className="font-bold text-gray-900 text-lg">En Evaluación</h3>
                  </div>
                  <p className="text-center text-sm text-gray-600 mb-4">{enEvaluacion.length} postulante{enEvaluacion.length !== 1 ? 's' : ''}</p>
                  <div className="space-y-3">
                    {enEvaluacion.map(applicant => (
                      <div
                        key={applicant.id}
                        className={`bg-white rounded-lg p-3 border-2 shadow-sm transition-all cursor-pointer ${
                          selectedApplicant === applicant.id
                            ? 'border-yellow-500 ring-2 ring-yellow-200'
                            : 'border-gray-200 hover:border-yellow-300'
                        }`}
                        onClick={() => setSelectedApplicant(selectedApplicant === applicant.id ? null : applicant.id)}
                      >
                        <h4 className="font-semibold text-gray-900">{applicant.name}</h4>
                        <p className="text-sm text-gray-600">{applicant.email}</p>
                        <p className="text-sm text-gray-500 mb-2">{applicant.career}</p>

                        {selectedApplicant === applicant.id && (
                          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveApplicant(applicant.id, 'postulando');
                              }}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 rounded transition-colors"
                            >
                              Devolver a Postulando
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveApplicant(applicant.id, 'aceptado');
                              }}
                              className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-1.5 rounded transition-colors"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectApplicant(applicant.id);
                              }}
                              className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 rounded transition-colors"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {enEvaluacion.length === 0 && (
                      <p className="text-gray-400 text-center text-sm py-8">No hay postulantes</p>
                    )}
                  </div>
                </div>

                {/* Columna Aceptado */}
                <div className="bg-green-50 rounded-lg p-4 min-h-[400px]">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Users size={24} className="text-green-600" />
                    <h3 className="font-bold text-gray-900 text-lg">Aceptado</h3>
                  </div>
                  <p className="text-center text-sm text-gray-600 mb-4">{aceptados.length} postulante{aceptados.length !== 1 ? 's' : ''}</p>
                  <div className="space-y-3">
                    {aceptados.map(applicant => (
                      <div
                        key={applicant.id}
                        className={`bg-white rounded-lg p-3 border-2 shadow-sm transition-all cursor-pointer ${
                          selectedApplicant === applicant.id
                            ? 'border-green-500 ring-2 ring-green-200'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => setSelectedApplicant(selectedApplicant === applicant.id ? null : applicant.id)}
                      >
                        <h4 className="font-semibold text-gray-900">{applicant.name}</h4>
                        <p className="text-sm text-gray-600">{applicant.email}</p>
                        <p className="text-sm text-gray-500 mb-2">{applicant.career}</p>

                        {selectedApplicant === applicant.id && (
                          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveApplicant(applicant.id, 'postulando');
                              }}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 rounded transition-colors"
                            >
                              Devolver a Postulando
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveApplicant(applicant.id, 'en-evaluacion');
                              }}
                              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1.5 rounded transition-colors"
                            >
                              Mover a Evaluación
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectApplicant(applicant.id);
                              }}
                              className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 rounded transition-colors"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {aceptados.length === 0 && (
                      <p className="text-gray-400 text-center text-sm py-8">No hay postulantes</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón para ver rechazados */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <button
                  onClick={() => setShowRejectedList(!showRejectedList)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  {showRejectedList ? 'Ocultar' : 'Ver'} Rechazados ({rejectedApplicants.length})
                </button>

                {/* Lista de rechazados */}
                {showRejectedList && (
                  <div className="mt-4 bg-red-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                      <X size={24} className="text-red-600" />
                      Postulantes Rechazados
                    </h3>
                    {rejectedApplicants.length === 0 ? (
                      <p className="text-gray-400 text-center text-sm py-8">No hay postulantes rechazados</p>
                    ) : (
                      <div className="space-y-2">
                        {rejectedApplicants.map(applicant => (
                          <div
                            key={applicant.id}
                            className="bg-white rounded-lg p-3 border border-red-200 shadow-sm"
                          >
                            <h4 className="font-semibold text-gray-900">{applicant.name}</h4>
                            <p className="text-sm text-gray-600">{applicant.email}</p>
                            <p className="text-sm text-gray-500">{applicant.career}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de crear proyecto (estudiante) */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Crear Nuevo Proyecto</h2>
                <button
                  onClick={() => {
                    setShowCreateProjectModal(false);
                    setNewProjectTitle('');
                    setNewProjectDescription('');
                    setNewProjectMembers('');
                    setNewProjectDisciplines({
                      ingenieria: false,
                      diseno: false,
                      negocios: false,
                      ciencias: false,
                      artes: false,
                    });
                  }}
                  className="text-white hover:bg-[#0040a0] p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600">Completa la información de tu proyecto</p>

              {/* Título del proyecto */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Título del Proyecto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sistema de gestión universitaria"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe tu proyecto, objetivos, y qué buscas en los colaboradores..."
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent resize-none"
                />
              </div>

              {/* Número de integrantes */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Número de Integrantes <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 5"
                  value={newProjectMembers}
                  onChange={(e) => setNewProjectMembers(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                />
              </div>

              {/* Disciplinas requeridas */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Disciplinas Requeridas <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">Selecciona las disciplinas que necesitas para tu proyecto</p>
                <div className="flex gap-4 flex-wrap">
                  <DisciplineCheckbox
                    label="Ingeniería"
                    checked={newProjectDisciplines.ingenieria}
                    onChange={() => toggleProjectDiscipline('ingenieria')}
                  />
                  <DisciplineCheckbox
                    label="Diseño"
                    checked={newProjectDisciplines.diseno}
                    onChange={() => toggleProjectDiscipline('diseno')}
                  />
                  <DisciplineCheckbox
                    label="Negocios"
                    checked={newProjectDisciplines.negocios}
                    onChange={() => toggleProjectDiscipline('negocios')}
                  />
                  <DisciplineCheckbox
                    label="Ciencias"
                    checked={newProjectDisciplines.ciencias}
                    onChange={() => toggleProjectDiscipline('ciencias')}
                  />
                  <DisciplineCheckbox
                    label="Artes"
                    checked={newProjectDisciplines.artes}
                    onChange={() => toggleProjectDiscipline('artes')}
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateProject}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Crear Proyecto
                </button>
                <button
                  onClick={() => {
                    setShowCreateProjectModal(false);
                    setNewProjectTitle('');
                    setNewProjectDescription('');
                    setNewProjectMembers('');
                    setNewProjectDisciplines({
                      ingenieria: false,
                      diseno: false,
                      negocios: false,
                      ciencias: false,
                      artes: false,
                    });
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cambio de tipo de usuario */}
      {showUserTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full">
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Cambiar Tipo de Usuario</h2>
                <button
                  onClick={() => setShowUserTypeModal(false)}
                  className="text-white hover:bg-[#0040a0] p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600 mb-4">Selecciona el tipo de usuario:</p>

              <button
                onClick={() => handleChangeUserType('estudiante')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  userType === 'estudiante'
                    ? 'border-[#003082] bg-[#003082]/10'
                    : 'border-gray-300 hover:border-[#003082]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap size={32} className="text-[#003082]" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Estudiante</h3>
                    <p className="text-sm text-gray-600">Acceso a proyectos y ofertas</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleChangeUserType('empresario')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  userType === 'empresario'
                    ? 'border-[#003082] bg-[#003082]/10'
                    : 'border-gray-300 hover:border-[#003082]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase size={32} className="text-[#003082]" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Empresario</h3>
                    <p className="text-sm text-gray-600">Publicar ofertas de práctica</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleChangeUserType('administrador')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  userType === 'administrador'
                    ? 'border-[#003082] bg-[#003082]/10'
                    : 'border-gray-300 hover:border-[#003082]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={32} className="text-[#003082]" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Administrador</h3>
                    <p className="text-sm text-gray-600">Gestión de reportes y solicitudes</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de calificación de participantes */}
      {showRatingModal && selectedPublication && selectedPublication.participants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Puntuar Participantes</h2>
                  <p className="text-gray-200">{selectedPublication.projectName}</p>
                </div>
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    setParticipantRatings({});
                  }}
                  className="text-white hover:bg-[#0040a0] p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">Califica el desempeño de cada participante del proyecto</p>

              <div className="space-y-4">
                {selectedPublication.participants.map(participant => (
                  <div key={participant.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                        <p className="text-sm text-gray-600">{participant.role}</p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                      </div>
                    </div>

                    {/* Estrellas de calificación */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Calificación:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => handleRateParticipant(participant.id, star)}
                            className="transition-colors"
                          >
                            <Star
                              size={28}
                              className={
                                star <= (participantRatings[participant.id] || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          </button>
                        ))}
                      </div>
                      {participantRatings[participant.id] > 0 && (
                        <span className="text-sm font-medium text-gray-700 ml-2">
                          {participantRatings[participant.id]} estrella{participantRatings[participant.id] !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveRatings}
                  disabled={Object.keys(participantRatings).length !== selectedPublication.participants.length}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    Object.keys(participantRatings).length === selectedPublication.participants.length
                      ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Guardar Calificaciones
                </button>
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    setParticipantRatings({});
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {selectedPublication && !showRatingModal && !showApplicantsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedPublication.projectName}</h2>
                  <p className="text-gray-200">{selectedPublication.title}</p>
                  {selectedPublication.status && (
                    <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                      {selectedPublication.status === 'en-seleccion' && 'En Proceso de Selección'}
                      {selectedPublication.status === 'activo' && 'Activo'}
                      {selectedPublication.status === 'en-evaluacion' && 'En Evaluación'}
                      {selectedPublication.status === 'finalizado' && 'Finalizado'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPublication(null)}
                  className="text-white hover:bg-[#0040a0] p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700">{selectedPublication.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Requisitos</h3>
                <p className="text-gray-700">{selectedPublication.requirements}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Duración</h3>
                  <p className="text-gray-700">{selectedPublication.duration}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Modalidad</h3>
                  <p className="text-gray-700">{selectedPublication.location}</p>
                </div>
              </div>

              {/* Información específica para ofertas de práctica */}
              {(selectedPublication.category === 'practicas' || selectedPublication.isPractice) && (
                <>
                  {selectedPublication.career && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Carrera</h3>
                      <p className="text-gray-700">{selectedPublication.career}</p>
                    </div>
                  )}
                  {selectedPublication.scheduleType && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Tipo de Jornada</h3>
                      <p className="text-gray-700">{selectedPublication.scheduleType}</p>
                    </div>
                  )}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Contacto</h3>
                    {selectedPublication.contactEmail && (
                      <p className="text-gray-700 mb-1">
                        <strong>Email:</strong> {selectedPublication.contactEmail}
                      </p>
                    )}
                    {selectedPublication.contactPhone && (
                      <p className="text-gray-700">
                        <strong>Teléfono:</strong> {selectedPublication.contactPhone}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Publicado por</h3>
                <p className="text-gray-700">{selectedPublication.author}</p>
              </div>

              {/* Botones de acción según categoría y estado */}
              <div className="flex gap-3 pt-4">
                {/* Ofertas de práctica - solo ver detalles */}
                {selectedPublication.category === 'practicas' && (
                  <button
                    onClick={() => setSelectedPublication(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cerrar
                  </button>
                )}

                {/* Proyectos publicados - ofertas de práctica del empresario */}
                {selectedPublication.category === 'publicados' && selectedPublication.isPractice && userType === 'empresario' && (
                  <>
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de eliminar esta oferta de práctica?')) {
                          console.log('Eliminar oferta de práctica');
                          alert('Oferta de práctica eliminada');
                          setSelectedPublication(null);
                        }
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Eliminar Oferta
                    </button>
                    <button
                      onClick={() => setSelectedPublication(null)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cerrar
                    </button>
                  </>
                )}

                {/* Proyectos publicados - proyectos de estudiante según estado */}
                {selectedPublication.category === 'publicados' && !selectedPublication.isPractice && (
                  <>
                    {selectedPublication.status === 'en-seleccion' && (
                      <button
                        onClick={() => {
                          if (selectedPublication.applicants) {
                            setCurrentApplicants(selectedPublication.applicants);
                            setRejectedApplicants([]);
                            setShowRejectedList(false);
                            setShowApplicantsModal(true);
                          }
                        }}
                        className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        Gestionar Postulantes
                      </button>
                    )}
                    {selectedPublication.status === 'activo' && (
                      <button
                        onClick={() => {
                          console.log('Finalizar proyecto');
                          alert('Finalizar proyecto');
                        }}
                        className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        Finalizar Proyecto
                      </button>
                    )}
                    {selectedPublication.status === 'en-evaluacion' && (
                      <button
                        onClick={() => {
                          setSelectedPublication(selectedPublication);
                          setShowRatingModal(true);
                        }}
                        className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        Puntuar Participantes
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedPublication(null)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cerrar
                    </button>
                  </>
                )}

                {/* Proyectos generales - postular y reportar */}
                {selectedPublication.category === 'general' && (
                  <>
                    <button
                      onClick={() => {
                        console.log('Postular al proyecto');
                        alert('Postulación enviada');
                      }}
                      className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Postular
                    </button>
                    <button
                      onClick={() => {
                        console.log('Reportar publicación');
                        alert('Publicación reportada. Será revisada por un administrador.');
                        setSelectedPublication(null);
                      }}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Reportar
                    </button>
                    <button
                      onClick={() => setSelectedPublication(null)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cerrar
                    </button>
                  </>
                )}

                {/* Proyectos participando - solo ver detalles */}
                {selectedPublication.category === 'participando' && (
                  <button
                    onClick={() => setSelectedPublication(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cerrar
                  </button>
                )}

                {/* Reportados - Eliminar (Administrador) */}
                {selectedPublication.category === 'reportados' && (
                  <>
                    <button
                      onClick={() => {
                        console.log('Eliminar publicación reportada');
                        alert('Publicación eliminada del sistema');
                        setSelectedPublication(null);
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Eliminar Publicación
                    </button>
                    <button
                      onClick={() => setSelectedPublication(null)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cerrar
                    </button>
                  </>
                )}

                {/* Solicitudes - Aceptar o Rechazar (Administrador) */}
                {selectedPublication.category === 'solicitudes' && (
                  <>
                    <button
                      onClick={() => {
                        console.log('Aceptar solicitud');
                        alert('Oferta de empleo aprobada y publicada');
                        setSelectedPublication(null);
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => {
                        console.log('Rechazar solicitud');
                        alert('Oferta de empleo rechazada');
                        setSelectedPublication(null);
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => setSelectedPublication(null)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cerrar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra lateral izquierda */}
      <div
        className={`bg-[#003082] transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden absolute left-0 top-0 bottom-0 z-20`}
      >
        {/* Header de la sidebar */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full hover:bg-white/10 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <img src={Logo} alt="CampusOne Logo" className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h1 className="text-white font-bold text-sm">CampusOne</h1>
              <p className="text-gray-300 text-xs">Universidad de La Serena</p>
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {userType === 'estudiante' && (
            <>
              {/* Empleabilidad y Colaboración - Solo Estudiante */}
              <div className="p-4">
                <h3 className="text-white/50 text-[10px] uppercase tracking-widest mb-3">Empleabilidad y Colaboración</h3>
                <div className="space-y-1">
                  <SidebarItem
                    icon={<FileText size={20} />}
                    label="Proyectos Publicados"
                    active={ownershipFilter === 'general'}
                    onClick={() => setOwnershipFilter('general')}
                  />
                  <SidebarItem
                    icon={<Users size={20} />}
                    label="Mis Proyectos"
                    active={ownershipFilter === 'publicados'}
                    onClick={() => setOwnershipFilter('publicados')}
                  />
                  <SidebarItem
                    icon={<Briefcase size={20} />}
                    label="Proyectos Participe"
                    active={ownershipFilter === 'participando'}
                    onClick={() => setOwnershipFilter('participando')}
                  />
                  <SidebarItem
                    icon={<GraduationCap size={20} />}
                    label="Portal de Oportunidades"
                    active={ownershipFilter === 'practicas'}
                    onClick={() => setOwnershipFilter('practicas')}
                  />
                </div>
              </div>

              {/* Otros Módulos - Solo Estudiante */}
              <div className="p-4 border-t border-white/10">
                <h3 className="text-white/50 text-[10px]  uppercase tracking-widest mb-3">Campus One</h3>
                <div className="space-y-1">
                  <SidebarItem
                    icon={<Navigation size={20} />}
                    label="Navegación Inteligente"
                    //onClick={() => window.open('https://www.figma.com/make/MPbwi8jnlvthVISoiJDHIp/Crear-página-inicial-Visitante--copia-?p=f&t=XnF3nwo78SBpxnWr-0', '_blank')}
                    onClick={() => console.log('Navegación Inteligente')}
                  />
                  <SidebarItem
                    icon={<BarChart size={20} />}
                    label="Rating y Analytics"
                    onClick={() => console.log('Rating y Analytics')}
                  />
                  <SidebarItem
                    icon={<Settings size={20} />}
                    label="Eficiencia Administrativa"
                    onClick={() => console.log('Eficiencia Administrativa')}
                  />
                  <SidebarItem
                    icon={<Network size={20} />}
                    label="Networking y Match Académico"
                    onClick={() => console.log('Networking y Match Académico')}
                  />
                </div>
              </div>
            </>
          )}

          {userType === 'empresario' && (
            <>
              {/* Publicaciones - Solo Empresario */}
              <div className="p-4">
                <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-3">Ofertas de Práctica</h3>
                <div className="space-y-1">
                  <SidebarItem
                    icon={<Briefcase size={20} />}
                    label="Publicados"
                    active={ownershipFilter === 'publicados'}
                    onClick={() => setOwnershipFilter('publicados')}
                  />
                </div>
              </div>
            </>
          )}

          {userType === 'administrador' && (
            <>
              {/* Gestión - Solo Administrador */}
              <div className="p-4">
                <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-3">Gestión de Contenido</h3>
                <div className="space-y-1">
                  <SidebarItem
                    icon={<AlertTriangle size={20} />}
                    label="Reportados"
                    active={ownershipFilter === 'reportados'}
                    onClick={() => setOwnershipFilter('reportados')}
                  />
                  <SidebarItem
                    icon={<CheckCircle size={20} />}
                    label="Solicitudes"
                    active={ownershipFilter === 'solicitudes'}
                    onClick={() => setOwnershipFilter('solicitudes')}
                  />
                  <SidebarItem
                    icon={<Settings size={20} />}
                    label="Gestionar Filtros"
                    active={ownershipFilter === 'gestionar-filtros'}
                    onClick={() => setOwnershipFilter('gestionar-filtros')}
                  />
                </div>
              </div>

              {/* Otros Módulos - Administrador */}
              <div className="p-4 border-t border-white/10">
                <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-3">Campus One</h3>
                <div className="space-y-1">
                  <SidebarItem
                    icon={<Navigation size={20} />}
                    label="Navegación Inteligente"
                    onClick={() => console.log('Navegación Inteligente')}
                  />
                  <SidebarItem
                    icon={<BarChart size={20} />}
                    label="Rating y Analytics"
                    onClick={() => console.log('Rating y Analytics')}
                  />
                  <SidebarItem
                    icon={<Settings size={20} />}
                    label="Eficiencia Administrativa"
                    onClick={() => console.log('Eficiencia Administrativa')}
                  />
                  <SidebarItem
                    icon={<Network size={20} />}
                    label="Networking y Match Académico"
                    onClick={() => console.log('Networking y Match Académico')}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Contenedor principal que se desplaza */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header horizontal superior */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          {/* Botón toggle sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded transition-colors"
          >
            <PanelLeft size={24} />
          </button>

          {/* Notificaciones y perfil */}
          <div className="flex items-center gap-3">
            {/* Botón de notificaciones */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={22} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
            </button>

            {/* Foto de perfil - Abre modal de cambio de usuario */}
            <button
              onClick={() => setShowUserTypeModal(true)}
              className="w-10 h-10 bg-[#003082] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              {userType === 'estudiante' && <GraduationCap size={20} className="text-white" />}
              {userType === 'empresario' && <Briefcase size={20} className="text-white" />}
              {userType === 'administrador' && <Settings size={20} className="text-white" />}
            </button>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {/* Filtros - Solo para estudiante y categorías específicas */}
          {userType === 'estudiante' && ownershipFilter !== 'gestionar-filtros' && (
            <div className="p-4 bg-white border-b border-gray-200 space-y-4">
              {/* Filtro por nombre de proyecto - común para todas las categorías */}
              <div>
                <input
                  type="text"
                  placeholder="Buscar por nombre de proyecto..."
                  value={projectNameFilter}
                  onChange={(e) => setProjectNameFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                />
              </div>

              {/* Filtros específicos para Ofertas de Práctica */}
              {ownershipFilter === 'practicas' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Filtrar por carrera..."
                    value={careerFilter}
                    onChange={(e) => setCareerFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Tipo de jornada (Full-time, Part-time)..."
                    value={scheduleTypeFilter}
                    onChange={(e) => setScheduleTypeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Nivel de experiencia..."
                    value={experienceLevelFilter}
                    onChange={(e) => setExperienceLevelFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                  />
                </div>
              )}

              {/* Filtros de disciplinas - solo para general, publicados, participando */}
              {ownershipFilter !== 'practicas' && (
                <div>
                  <button
                    onClick={() => setDisciplinesOpen(!disciplinesOpen)}
                    className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#003082] transition-colors"
                  >
                    <span>Filtrar por disciplina</span>
                    {disciplinesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {disciplinesOpen && (
                    <div className="flex gap-4 flex-wrap mt-3">
                      <DisciplineCheckbox
                        label="Ingeniería"
                        checked={disciplines.ingenieria}
                        onChange={() => toggleDiscipline('ingenieria')}
                      />
                      <DisciplineCheckbox
                        label="Diseño"
                        checked={disciplines.diseno}
                        onChange={() => toggleDiscipline('diseno')}
                      />
                      <DisciplineCheckbox
                        label="Negocios"
                        checked={disciplines.negocios}
                        onChange={() => toggleDiscipline('negocios')}
                      />
                      <DisciplineCheckbox
                        label="Ciencias"
                        checked={disciplines.ciencias}
                        onChange={() => toggleDiscipline('ciencias')}
                      />
                      <DisciplineCheckbox
                        label="Artes"
                        checked={disciplines.artes}
                        onChange={() => toggleDiscipline('artes')}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Área de contenido */}
          <div className="flex-1 p-6 overflow-hidden flex flex-col">
            {/* Gestionar Filtros - Solo Administrador */}
            {ownershipFilter === 'gestionar-filtros' ? (
              <div className="bg-white rounded-[20px] shadow-sm p-6 h-full flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestionar Filtros de Disciplinas</h2>
                  <p className="text-gray-600">Agrega o elimina disciplinas que estarán disponibles como filtros para los estudiantes</p>
                </div>

                {/* Agregar nueva disciplina */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Agregar Nueva Disciplina</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Nombre de la disciplina..."
                      value={newDisciplineName}
                      onChange={(e) => setNewDisciplineName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddDiscipline();
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                    />
                    <button
                      onClick={handleAddDiscipline}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Lista de disciplinas actuales */}
                <div className="flex-1 overflow-y-auto">
                  <h3 className="font-semibold text-gray-900 mb-3">Disciplinas Actuales</h3>
                  <div className="space-y-2">
                    {availableDisciplines.map(discipline => (
                      <div
                        key={discipline.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <span className="font-medium text-gray-900">{discipline.name}</span>
                        <button
                          onClick={() => handleRemoveDiscipline(discipline.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Botón para crear nueva oferta (solo empresario) */}
                {userType === 'empresario' && (
                  <button
                    onClick={() => {
                      console.log('Crear nueva oferta de práctica');
                      alert('Funcionalidad de crear nueva oferta de práctica próximamente');
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Nueva Oferta de Práctica
                  </button>
                )}

                {/* Botón para crear nuevo proyecto (solo estudiante en publicados) */}
                {userType === 'estudiante' && ownershipFilter === 'publicados' && (
                  <button
                    onClick={() => setShowCreateProjectModal(true)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Crear Nuevo Proyecto
                  </button>
                )}

                {/* Contador de resultados */}
                <div className="bg-[#5B7FC7] text-white text-center py-2 rounded-lg mb-4">
                  {filteredPublications.length} proyecto{filteredPublications.length !== 1 ? 's' : ''} encontrado{filteredPublications.length !== 1 ? 's' : ''}
                </div>

                {/* Lista de publicaciones con scroll */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-3">
                    {filteredPublications.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400 py-20">
                        No hay publicaciones que coincidan con los filtros
                      </div>
                    ) : (
                      filteredPublications.map(pub => (
                        <PublicationCard
                          key={pub.id}
                          publication={pub}
                          userType={userType}
                          onViewDetails={() => setSelectedPublication(pub)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 ${
        active
          ? 'bg-white/20 text-white font-semibold border border-white/30'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

function DisciplineCheckbox({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-400 text-[#003082] focus:ring-2 focus:ring-[#003082] cursor-pointer"
      />
      <span>{label}</span>
    </label>
  );
}

function PublicationCard({ publication, userType, onViewDetails }: { publication: Publication; userType: UserType; onViewDetails: () => void }) {
  const getStatusText = (status?: PublicationStatus) => {
    if (!status) return '';
    switch (status) {
      case 'en-seleccion': return 'En Proceso de Selección';
      case 'activo': return 'Activo';
      case 'en-evaluacion': return 'En Evaluación';
      case 'finalizado': return 'Finalizado';
    }
  };

  const getButtonText = () => {
    if (publication.category === 'practicas') {
      return 'Ver Detalles';
    }
    if (publication.category === 'reportados' || publication.category === 'solicitudes') {
      return 'Detalles';
    }
    if (publication.category === 'publicados') {
      // Ofertas de práctica del empresario
      if (publication.isPractice && userType === 'empresario') {
        return 'Eliminar';
      }
      // Proyectos del estudiante
      switch (publication.status) {
        case 'en-seleccion': return 'Gestionar Postulantes';
        case 'activo': return 'Finalizar Proyecto';
        case 'en-evaluacion': return 'Puntuar Participantes';
        case 'finalizado': return 'Ver Detalles';
        default: return 'Ver Detalles';
      }
    }
    if (publication.category === 'participando') {
      return 'Detalles';
    }
    return 'Detalles / Postular';
  };

  return (
    <div className="border border-gray-300 rounded-[10px] overflow-hidden">
      {/* Barra azul con nombre del proyecto */}
      <div className="bg-gradient-to-r from-[#1B4FA8] to-[#003082] text-white px-4 py-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{publication.projectName}</h3>
          {publication.status && (
            <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
              {getStatusText(publication.status)}
            </span>
          )}
        </div>
      </div>

      {/* Contenido blanco */}
      <div className="bg-white p-4">
        <p className="text-gray-700 mb-3">{publication.description}</p>

        {/* Botón */}
        <div className="flex justify-end">
          {/* Ofertas de práctica del empresario - botón eliminar directo */}
          {publication.isPractice && userType === 'empresario' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('¿Estás seguro de eliminar esta oferta de práctica?')) {
                  console.log('Eliminar oferta de práctica:', publication.id);
                  alert('Oferta de práctica eliminada');
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Eliminar
            </button>
          )}

          {/* Proyectos con estado */}
          {!publication.isPractice && publication.status !== 'finalizado' && (
            <button
              onClick={onViewDetails}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {getButtonText()}
            </button>
          )}

          {/* Proyectos finalizados */}
          {!publication.isPractice && publication.status === 'finalizado' && (
            <button
              onClick={onViewDetails}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium cursor-default"
            >
              Finalizado
            </button>
          )}

          {/* Ofertas de práctica que no son del empresario */}
          {publication.isPractice && userType !== 'empresario' && (
            <button
              onClick={onViewDetails}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Ver Detalles
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
