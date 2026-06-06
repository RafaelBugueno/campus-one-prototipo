import { useState } from 'react';
import { FileText, Users, Briefcase, GraduationCap, Bell, PanelLeft, ChevronDown, ChevronUp, X, Navigation, BarChart, Settings, Network, Star, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import Logo from '../../imports/logoCampusOne.svg';

type PublicationStatus = 'en-seleccion' | 'activo' | 'en-evaluacion' | 'finalizado';
type UserType = 'estudiante' | 'administrador' | 'empresario' | 'academico';
type OwnershipFilter = 'general' | 'publicados' | 'participando' | 'practicas' | 'reportados' | 'solicitudes' | 'gestionar-filtros' | 'proyectos-publicados' | 'ofertas-practica-publicadas';

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
  maxMembers?: number;
  reportReason?: string;
  reportCount?: number;
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
    location: 'Híbrido',
    maxMembers: 2,
    applicants: [
      { id: 'ag1', name: 'Andrea Morales', email: 'andrea.morales@uls.cl', career: 'Diseño Gráfico', status: 'aceptado' },
      { id: 'ag2', name: 'Roberto Fuentes', email: 'roberto.fuentes@uls.cl', career: 'Diseño UX/UI', status: 'aceptado' }
    ]
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
    maxMembers: 3,
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
    id: '23',
    title: 'Desarrollador de Software',
    description: 'Desarrollo de sistema de gestión de inventario para laboratorio universitario',
    category: 'participando',
    author: 'Facultad de Ingeniería',
    isMyPost: false,
    isParticipating: true,
    isPractice: false,
    date: '2026-03-15',
    projectName: 'Sistema Inventario Lab ULS',
    tags: ['Python', 'Django', 'PostgreSQL', 'Backend'],
    discipline: 'ingenieria',
    requirements: 'Python, Django, bases de datos relacionales, diseño de APIs REST.',
    duration: '4 meses',
    location: 'Presencial',
    status: 'en-evaluacion',
    participants: [
      { id: 'ep1', name: 'Valentina Soto', email: 'valentina.soto@uls.cl', role: 'Desarrolladora Backend', rating: 0 },
      { id: 'ep2', name: 'Rodrigo Herrera', email: 'rodrigo.herrera@uls.cl', role: 'Desarrollador Frontend', rating: 0 },
      { id: 'ep3', name: 'Camila Navarro', email: 'camila.navarro@uls.cl', role: 'Tester QA', rating: 0 }
    ]
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
    experienceLevel: 'Estudiante',
    reportCount: 2
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
    experienceLevel: 'Estudiante',
    reportCount: 4
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
    experienceLevel: 'Estudiante',
    reportCount: 1
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

  // SOLICITUDES - Solicitudes de perfiles de empresa pendientes de aprobación (solo administrador)
  {
    id: '61',
    title: 'Solicitud de Perfil Empresarial',
    description: 'Tech Solutions SpA es una empresa de tecnología con más de 10 años de experiencia en el desarrollo de soluciones digitales. Contamos con un equipo multidisciplinario especializado en transformación digital, desarrollo web y móvil. Nuestra misión es impulsar la innovación tecnológica en la región y contribuir a la formación de nuevos profesionales mediante programas de prácticas y colaboración universitaria.',
    category: 'solicitudes',
    author: 'Tech Solutions SpA',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-05-13',
    projectName: 'Solicitud - Tech Solutions SpA',
    tags: ['Tecnología', 'Software', 'Innovación'],
    discipline: 'ingenieria',
    requirements: 'RUT: 76.123.456-7 | Giro: Desarrollo de software | Dirección: Av. Francisco de Aguirre 123, La Serena',
    duration: 'Registro permanente',
    location: 'La Serena, Región de Coquimbo',
    contactEmail: 'registro@techsolutions.cl',
    contactPhone: '+56 9 8888 7777'
  },
  {
    id: '62',
    title: 'Solicitud de Perfil Empresarial',
    description: 'Agencia Creativa Ltda es una agencia de diseño y marketing digital fundada en 2018. Nos especializamos en branding, diseño gráfico, marketing digital y gestión de redes sociales. Trabajamos con empresas locales y nacionales, ayudándolas a construir su identidad visual y presencia digital. Buscamos establecer alianzas con la universidad para ofrecer oportunidades de práctica a estudiantes de diseño y comunicaciones.',
    category: 'solicitudes',
    author: 'Agencia Creativa Ltda',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-05-12',
    projectName: 'Solicitud - Agencia Creativa Ltda',
    tags: ['Diseño', 'Marketing', 'Branding'],
    discipline: 'diseno',
    requirements: 'RUT: 77.234.567-8 | Giro: Servicios de publicidad y marketing | Dirección: Los Carrera 456, La Serena',
    duration: 'Registro permanente',
    location: 'La Serena, Región de Coquimbo',
    contactEmail: 'contacto@agenciacreativa.cl'
  },
  {
    id: '63',
    title: 'Solicitud de Perfil Empresarial',
    description: 'DataConsult es una consultora especializada en análisis de datos, business intelligence y consultoría estratégica. Con presencia en Chile y Latinoamérica, ayudamos a empresas a tomar decisiones basadas en datos mediante el uso de tecnologías como Power BI, Tableau y Python. Estamos comprometidos con la formación de talento joven y ofrecemos programas de mentoría y prácticas profesionales para estudiantes de ingeniería y ciencias.',
    category: 'solicitudes',
    author: 'DataConsult',
    isMyPost: false,
    isParticipating: false,
    isPractice: false,
    date: '2026-05-10',
    projectName: 'Solicitud - DataConsult',
    tags: ['Consultoría', 'Data', 'Business Intelligence'],
    discipline: 'ciencias',
    requirements: 'RUT: 78.345.678-9 | Giro: Consultoría en tecnologías de información | Dirección: Balmaceda 789, La Serena',
    duration: 'Registro permanente',
    location: 'La Serena, Región de Coquimbo',
    contactEmail: 'registro@dataconsult.cl',
    contactPhone: '+56 9 7777 6666'
  }
];

export default function PublicationsList() {
  const [userType, setUserType] = useState<UserType>('estudiante');
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
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

  // Modal de crear nuevo proyecto
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectMembers, setProjectMembers] = useState('');
  const [projectDisciplines, setProjectDisciplines] = useState({
    ingenieria: false,
    diseno: false,
    negocios: false,
    ciencias: false,
    artes: false,
  });

  // Modal de crear oferta de práctica (empresario)
  const [showCreateInternshipModal, setShowCreateInternshipModal] = useState(false);
  const [internshipTitle, setInternshipTitle] = useState('');
  const [internshipDescription, setInternshipDescription] = useState('');
  const [internshipEmail, setInternshipEmail] = useState('');
  const [internshipPhone, setInternshipPhone] = useState('');
  const [internshipScheduleType, setInternshipScheduleType] = useState('');
  const [internshipExperienceLevel, setInternshipExperienceLevel] = useState('');
  const [internshipCareer, setInternshipCareer] = useState('');
  const [showInternshipConfirmation, setShowInternshipConfirmation] = useState(false);

  // Modal de reportar oferta de práctica
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Modal de confirmación de eliminación (administrador)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
  const [showCareerSuggestions, setShowCareerSuggestions] = useState(false);

  // Sugerencias de carreras
  const careerSuggestions = [
    'Ingeniería Civil en Computación',
    'Ingeniería en Software',
    'Ingeniería Civil Informática',
    'Ingeniería Civil Industrial',
    'Ingeniería Comercial',
    'Diseño',
    'Diseño Gráfico',
    'Publicidad',
    'Marketing',
    'Administración de Empresas'
  ];

  // Control de postulaciones del estudiante (máximo 2 simultáneas)
  const [appliedProjects, setAppliedProjects] = useState<string[]>([]);
  const [showMaxPostulationsModal, setShowMaxPostulationsModal] = useState(false);
  const [showFullProjectModal, setShowFullProjectModal] = useState(false);
  const [showCapacityFullModal, setShowCapacityFullModal] = useState(false);
  const [showDeleteOfferConfirmation, setShowDeleteOfferConfirmation] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Publication | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const filteredPublications = mockPublications.filter(pub => {
    // Filtro especial para categorías del administrador
    if (ownershipFilter === 'proyectos-publicados') {
      // Mostrar todos los proyectos (no prácticas) que están en 'general', 'publicados' o 'participando'
      if (pub.isPractice) return false;
      if (!['general', 'publicados', 'participando'].includes(pub.category)) return false;
      // No mostrar proyectos finalizados
      if (pub.status === 'finalizado') return false;
    } else if (ownershipFilter === 'ofertas-practica-publicadas') {
      // Mostrar todas las ofertas de práctica (incluyendo las reportadas para el admin)
      if (!pub.isPractice && pub.category !== 'practicas') return false;
    } else {
      // Filtro por categoría base para otras categorías
      if (pub.category !== ownershipFilter) {
        return false;
      }
      // Filtro especial para empresario: solo mostrar ofertas de práctica en "publicados"
      if (userType === 'empresario' && ownershipFilter === 'publicados' && !pub.isPractice) {
        return false;
      }
      // Filtro especial para estudiante/académico: en "publicados" solo mostrar proyectos con estado (no ofertas de práctica)
      if ((userType === 'estudiante' || userType === 'academico') && ownershipFilter === 'publicados' && pub.isPractice) {
        return false;
      }
    }

    // Ocultar ofertas con 5+ reportes del portal de oportunidades del estudiante
    if (ownershipFilter === 'practicas' && userType === 'estudiante') {
      if (pub.reportCount && pub.reportCount >= 5) {
        return false;
      }
    }

    // Filtro por nombre de proyecto (común para todas las categorías)
    if (projectNameFilter && !pub.projectName.toLowerCase().includes(projectNameFilter.toLowerCase())) {
      return false;
    }

    // Filtros específicos según categoría
    if (ownershipFilter === 'practicas' || ownershipFilter === 'ofertas-practica-publicadas') {
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
  }).sort((a, b) => {
    // Ordenar por reportCount en "ofertas-practica-publicadas" (de mayor a menor)
    if (ownershipFilter === 'ofertas-practica-publicadas') {
      const reportCountA = a.reportCount || 0;
      const reportCountB = b.reportCount || 0;
      return reportCountB - reportCountA;
    }
    return 0;
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

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const handleSaveRatings = () => {
    console.log('Guardando calificaciones:', participantRatings);
    setShowRatingModal(false);
    setParticipantRatings({});
    showSuccess('Calificaciones guardadas exitosamente');
  };

  const handleChangeOwnershipFilter = (newFilter: OwnershipFilter) => {
    // Limpiar filtros específicos de ofertas de práctica si se sale de esa categoría
    if (ownershipFilter === 'practicas' && newFilter !== 'practicas') {
      setCareerFilter('');
      setScheduleTypeFilter('');
      setExperienceLevelFilter('');
    }
    setOwnershipFilter(newFilter);
  };

  const handleChangeUserType = (type: UserType) => {
    setUserType(type);
    setShowUserTypeModal(false);
    // Limpiar filtros al cambiar tipo de usuario
    setCareerFilter('');
    setScheduleTypeFilter('');
    setExperienceLevelFilter('');
    setProjectNameFilter('');
    // Cambiar a la primera categoría del nuevo tipo de usuario
    if (type === 'estudiante' || type === 'academico') {
      setOwnershipFilter('general');
    } else if (type === 'empresario') {
      setOwnershipFilter('publicados');
    } else {
      setOwnershipFilter('proyectos-publicados');
    }
  };

  const handleAddDiscipline = () => {
    if (newDisciplineName.trim()) {
      const newId = newDisciplineName.toLowerCase().replace(/\s+/g, '-');
      setAvailableDisciplines([...availableDisciplines, { id: newId, name: newDisciplineName.trim() }]);
      const disciplineName = newDisciplineName.trim();
      setNewDisciplineName('');
      showSuccess(`Disciplina "${disciplineName}" agregada exitosamente`);
    }
  };

  const handleRemoveDiscipline = (disciplineId: string) => {
    if (confirm('¿Estás seguro de eliminar esta disciplina?')) {
      setAvailableDisciplines(availableDisciplines.filter(d => d.id !== disciplineId));
      showSuccess('Disciplina eliminada exitosamente');
    }
  };

  const handleMoveApplicant = (applicantId: string, newStatus: ApplicantStatus) => {
    // Actualizar el estado del postulante
    const updatedApplicants = currentApplicants.map(applicant =>
      applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
    );

    // Si se está moviendo a "aceptado", verificar capacidad
    if (newStatus === 'aceptado' && selectedPublication?.maxMembers) {
      const acceptedCount = updatedApplicants.filter(a => a.status === 'aceptado').length;

      // Si se alcanzó el límite de capacidad, rechazar automáticamente a los demás
      if (acceptedCount >= selectedPublication.maxMembers) {
        const remainingApplicants = updatedApplicants.filter(
          a => a.status === 'postulando' || a.status === 'en-evaluacion'
        );

        if (remainingApplicants.length > 0) {
          // Mover los restantes a rechazados
          const finalApplicants = updatedApplicants.filter(
            a => a.status === 'aceptado' || a.id === applicantId
          );

          setRejectedApplicants([...rejectedApplicants, ...remainingApplicants]);
          setCurrentApplicants(finalApplicants);
          setSelectedApplicant(null);
          setShowCapacityFullModal(true);
          return;
        }
      }
    }

    setCurrentApplicants(updatedApplicants);
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

  const handleCreateProject = () => {
    // Validaciones
    if (!projectTitle.trim()) {
      alert('Por favor ingresa el título del proyecto');
      return;
    }
    if (!projectDescription.trim()) {
      alert('Por favor ingresa la descripción del proyecto');
      return;
    }
    if (!projectMembers.trim() || parseInt(projectMembers) <= 0) {
      alert('Por favor ingresa un número válido de integrantes');
      return;
    }

    const selectedDisciplines = Object.entries(projectDisciplines)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);

    if (selectedDisciplines.length === 0) {
      alert('Por favor selecciona al menos una disciplina');
      return;
    }

    // Crear el proyecto
    console.log('Crear proyecto:', {
      title: projectTitle,
      description: projectDescription,
      members: projectMembers,
      disciplines: selectedDisciplines
    });

    // Limpiar y cerrar modal
    setProjectTitle('');
    setProjectDescription('');
    setProjectMembers('');
    setProjectDisciplines({
      ingenieria: false,
      diseno: false,
      negocios: false,
      ciencias: false,
      artes: false,
    });
    setShowCreateProjectModal(false);
    showSuccess('Proyecto creado exitosamente');
  };

  const handleCreateInternship = () => {
    // Validaciones
    if (!internshipTitle.trim()) {
      alert('Por favor ingresa el título de la oferta');
      return;
    }
    if (!internshipDescription.trim()) {
      alert('Por favor ingresa la descripción de la oferta');
      return;
    }
    if (!internshipEmail.trim() && !internshipPhone.trim()) {
      alert('Por favor ingresa al menos un método de contacto (email o teléfono)');
      return;
    }
    if (!internshipScheduleType) {
      alert('Por favor selecciona el tipo de jornada');
      return;
    }
    if (!internshipExperienceLevel) {
      alert('Por favor selecciona el nivel de experiencia');
      return;
    }
    if (!internshipCareer) {
      alert('Por favor selecciona la carrera');
      return;
    }

    // Crear la oferta
    console.log('Solicitar publicación de oferta:', {
      title: internshipTitle,
      description: internshipDescription,
      email: internshipEmail,
      phone: internshipPhone,
      scheduleType: internshipScheduleType,
      experienceLevel: internshipExperienceLevel,
      career: internshipCareer
    });

    // Cerrar modal de creación y mostrar confirmación
    setShowCreateInternshipModal(false);
    setShowInternshipConfirmation(true);

    // Limpiar formulario
    setInternshipTitle('');
    setInternshipDescription('');
    setInternshipEmail('');
    setInternshipPhone('');
    setInternshipScheduleType('');
    setInternshipExperienceLevel('');
    setInternshipCareer('');
  };

  const handleReportInternship = () => {
    if (!reportReason.trim()) {
      alert('Por favor ingresa el motivo del reporte');
      return;
    }

    console.log('Reportar oferta:', {
      publicationId: selectedPublication?.id,
      reason: reportReason
    });

    // Cerrar ambos modales y limpiar
    setShowReportModal(false);
    setReportReason('');
    setSelectedPublication(null);
    showSuccess('Oferta reportada exitosamente. Será revisada por un administrador.');
  };

  const handleDeleteReportedPublication = () => {
    console.log('Eliminar publicación reportada:', selectedPublication?.id);

    // Cerrar ambos modales
    setShowDeleteConfirmation(false);
    setSelectedPublication(null);
    showSuccess('Publicación eliminada del sistema');
  };

  const postulando = currentApplicants.filter(a => a.status === 'postulando');
  const enEvaluacion = currentApplicants.filter(a => a.status === 'en-evaluacion');
  const aceptados = currentApplicants.filter(a => a.status === 'aceptado');
  const isFull = selectedPublication?.maxMembers ? aceptados.length >= selectedPublication.maxMembers : false;

  return (
    <div className="flex size-full bg-white overflow-hidden relative">
      {/* Modal de crear nuevo proyecto */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Crear Nuevo Proyecto</h2>
                <button
                  onClick={() => {
                    setShowCreateProjectModal(false);
                    setProjectTitle('');
                    setProjectDescription('');
                    setProjectMembers('');
                    setProjectDisciplines({
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
            <div className="p-6">
              <p className="text-gray-600 mb-6">Completa la información de tu proyecto</p>

              <div className="space-y-5">
                {/* Título del Proyecto */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Título del Proyecto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Ej: Sistema de gestión universitaria"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe tu proyecto, objetivos, y qué buscas en los colaboradores..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent resize-none"
                  />
                </div>

                {/* Número de Integrantes */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Número de Integrantes <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={projectMembers}
                    onChange={(e) => setProjectMembers(e.target.value)}
                    placeholder="Ej: 5"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                  />
                </div>

                {/* Disciplinas Requeridas */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Disciplinas Requeridas <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-600 mb-3">Selecciona las disciplinas que necesitas para tu proyecto</p>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={projectDisciplines.ingenieria}
                          onChange={(e) => setProjectDisciplines({ ...projectDisciplines, ingenieria: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-400 text-[#003082] focus:ring-2 focus:ring-[#003082]"
                        />
                        <span className="text-gray-700">Ingeniería</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={projectDisciplines.diseno}
                          onChange={(e) => setProjectDisciplines({ ...projectDisciplines, diseno: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-400 text-[#003082] focus:ring-2 focus:ring-[#003082]"
                        />
                        <span className="text-gray-700">Diseño</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={projectDisciplines.negocios}
                          onChange={(e) => setProjectDisciplines({ ...projectDisciplines, negocios: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-400 text-[#003082] focus:ring-2 focus:ring-[#003082]"
                        />
                        <span className="text-gray-700">Negocios</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={projectDisciplines.ciencias}
                          onChange={(e) => setProjectDisciplines({ ...projectDisciplines, ciencias: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-400 text-[#003082] focus:ring-2 focus:ring-[#003082]"
                        />
                        <span className="text-gray-700">Ciencias</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={projectDisciplines.artes}
                          onChange={(e) => setProjectDisciplines({ ...projectDisciplines, artes: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-400 text-[#003082] focus:ring-2 focus:ring-[#003082]"
                        />
                        <span className="text-gray-700">Artes</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleCreateProject}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Crear Proyecto
                </button>
                <button
                  onClick={() => {
                    setShowCreateProjectModal(false);
                    setProjectTitle('');
                    setProjectDescription('');
                    setProjectMembers('');
                    setProjectDisciplines({
                      ingenieria: false,
                      diseno: false,
                      negocios: false,
                      ciencias: false,
                      artes: false,
                    });
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de oferta de práctica */}
      {showInternshipConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full">
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Solicitud Enviada</h2>
                <button
                  onClick={() => setShowInternshipConfirmation(false)}
                  className="text-white hover:bg-[#0040a0] p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 text-center">
              <div className="mb-4">
                <CheckCircle size={64} className="text-green-500 mx-auto" />
              </div>
              <p className="text-gray-700 text-lg">
                Su oferta será evaluada para ser publicada
              </p>
              <button
                onClick={() => setShowInternshipConfirmation(false)}
                className="mt-6 w-full bg-[#003082] hover:bg-[#0040a0] text-white py-3 rounded-lg font-medium transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reportar Oferta */}
      {showReportModal && selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full">
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Reportar Oferta</h2>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                  }}
                  className="text-white hover:bg-[#0040a0] p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  Motivo del reporte <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Explica por qué estás reportando esta oferta de práctica
                </p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Ej: La oferta parece fraudulenta, las condiciones laborales son abusivas, etc."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReportInternship}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Enviar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirmation && selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full">
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Confirmar Eliminación</h2>
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="text-white hover:bg-[#0040a0] p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-900 text-lg text-center">
                ¿Seguro que quiere eliminar esta publicación?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteReportedPublication}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de crear oferta de práctica */}
      {showCreateInternshipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Nueva Oferta de Práctica</h2>
                <button
                  onClick={() => {
                    setShowCreateInternshipModal(false);
                    setInternshipTitle('');
                    setInternshipDescription('');
                    setInternshipEmail('');
                    setInternshipPhone('');
                    setInternshipScheduleType('');
                    setInternshipExperienceLevel('');
                    setInternshipCareer('');
                  }}
                  className="text-white hover:bg-[#0040a0] p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">Completa la información de tu oferta de práctica</p>

              <div className="space-y-5">
                {/* Título de la Oferta */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Título de la Oferta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={internshipTitle}
                    onChange={(e) => setInternshipTitle(e.target.value)}
                    placeholder="Ej: Práctica Profesional - Desarrollo Web"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={internshipDescription}
                    onChange={(e) => setInternshipDescription(e.target.value)}
                    placeholder="Describe la práctica profesional, responsabilidades, y requisitos..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent resize-none"
                  />
                </div>

                {/* Contacto */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Contacto <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-600 mb-3">Ingresa al menos un método de contacto</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={internshipEmail}
                      onChange={(e) => setInternshipEmail(e.target.value)}
                      placeholder="Email de contacto"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                    />
                    <input
                      type="tel"
                      value={internshipPhone}
                      onChange={(e) => setInternshipPhone(e.target.value)}
                      placeholder="Teléfono de contacto"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Tipo de Jornada */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Tipo de Jornada <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={internshipScheduleType}
                    onChange={(e) => setInternshipScheduleType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent bg-white"
                  >
                    <option value="">Selecciona el tipo de jornada</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                {/* Nivel de Experiencia */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Nivel de Experiencia <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={internshipExperienceLevel}
                    onChange={(e) => setInternshipExperienceLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent bg-white"
                  >
                    <option value="">Selecciona el nivel de experiencia</option>
                    <option value="Sin experiencia">Sin experiencia</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Junior">Junior</option>
                  </select>
                </div>

                {/* Carrera */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Carrera <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={internshipCareer}
                    onChange={(e) => setInternshipCareer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent bg-white"
                  >
                    <option value="">Selecciona la carrera</option>
                    <option value="Ingeniería Civil en Computación">Ingeniería Civil en Computación</option>
                    <option value="Ingeniería en Software">Ingeniería en Software</option>
                    <option value="Ingeniería Civil Informática">Ingeniería Civil Informática</option>
                    <option value="Ingeniería Civil Industrial">Ingeniería Civil Industrial</option>
                    <option value="Ingeniería Comercial">Ingeniería Comercial</option>
                    <option value="Diseño">Diseño</option>
                    <option value="Diseño Gráfico">Diseño Gráfico</option>
                    <option value="Publicidad">Publicidad</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Administración de Empresas">Administración de Empresas</option>
                  </select>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleCreateInternship}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Solicitar Publicación
                </button>
                <button
                  onClick={() => {
                    setShowCreateInternshipModal(false);
                    setInternshipTitle('');
                    setInternshipDescription('');
                    setInternshipEmail('');
                    setInternshipPhone('');
                    setInternshipScheduleType('');
                    setInternshipExperienceLevel('');
                    setInternshipCareer('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  {selectedPublication.maxMembers && (
                    <p className="text-gray-300 text-sm mt-1">
                      Cupo: {aceptados.length} / {selectedPublication.maxMembers} integrantes
                      {aceptados.length >= selectedPublication.maxMembers && (
                        <span className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">CUPO COMPLETO</span>
                      )}
                    </p>
                  )}
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
                                if (!isFull) {
                                  handleMoveApplicant(applicant.id, 'aceptado');
                                }
                              }}
                              disabled={isFull}
                              className={`w-full text-white text-sm py-1.5 rounded transition-colors ${
                                isFull
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600'
                              }`}
                              title={isFull ? 'Cupo completo' : ''}
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
                                if (!isFull) {
                                  handleMoveApplicant(applicant.id, 'aceptado');
                                }
                              }}
                              disabled={isFull}
                              className={`w-full text-white text-sm py-1.5 rounded transition-colors ${
                                isFull
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600'
                              }`}
                              title={isFull ? 'Cupo completo' : ''}
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
                  <p className="text-center text-sm text-gray-600 mb-2">
                    {selectedPublication?.maxMembers
                      ? `${aceptados.length} / ${selectedPublication.maxMembers} postulante${aceptados.length !== 1 ? 's' : ''}`
                      : `${aceptados.length} postulante${aceptados.length !== 1 ? 's' : ''}`
                    }
                  </p>
                  {isFull && (
                    <p className="text-center text-xs text-yellow-700 font-medium mb-4 bg-yellow-100 py-1 px-2 rounded">
                      CUPO COMPLETO
                    </p>
                  )}
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
                onClick={() => handleChangeUserType('academico')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  userType === 'academico'
                    ? 'border-[#003082] bg-[#003082]/10'
                    : 'border-gray-300 hover:border-[#003082]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={32} className="text-[#003082]" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Académico</h3>
                    <p className="text-sm text-gray-600">Acceso a proyectos colaborativos</p>
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
                    <p className="text-sm text-gray-600">Gestión de contenido y empresas</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de proyecto con cupo lleno */}
      {showFullProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full">
            <div className="bg-red-500 text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Cupo Completo</h2>
                <button
                  onClick={() => setShowFullProjectModal(false)}
                  className="text-white hover:bg-red-600 p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <Users size={64} className="text-red-400" />
              </div>
              <p className="text-gray-900 text-lg font-semibold">
                Este proyecto ya no tiene cupos disponibles
              </p>
              <p className="text-gray-600">
                Todos los lugares de este proyecto han sido ocupados. Te invitamos a explorar otras oportunidades disponibles.
              </p>
              <button
                onClick={() => setShowFullProjectModal(false)}
                className="w-full bg-[#003082] hover:bg-[#0040a0] text-white py-3 rounded-lg font-medium transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de capacidad completa (Mis Proyectos) */}
      {showCapacityFullModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full">
            <div className="bg-green-500 text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Cupos Completos</h2>
                <button
                  onClick={() => setShowCapacityFullModal(false)}
                  className="text-white hover:bg-green-600 p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <p className="text-gray-900 text-lg font-semibold">
                ¡Cupo completo alcanzado!
              </p>
              <p className="text-gray-600">
                Has alcanzado el número máximo de participantes para este proyecto. Los postulantes restantes han sido rechazados automáticamente.
              </p>
              <button
                onClick={() => setShowCapacityFullModal(false)}
                className="w-full bg-[#003082] hover:bg-[#0040a0] text-white py-3 rounded-lg font-medium transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito genérico */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full">
            <div className="bg-green-500 text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Operación Exitosa</h2>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="text-white hover:bg-green-600 p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <p className="text-gray-900 text-lg">
                {successMessage}
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#003082] hover:bg-[#0040a0] text-white py-3 rounded-lg font-medium transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación de oferta (Empresario) */}
      {showDeleteOfferConfirmation && offerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full">
            <div className="bg-[#003082] text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Confirmar Eliminación</h2>
                <button
                  onClick={() => {
                    setShowDeleteOfferConfirmation(false);
                    setOfferToDelete(null);
                  }}
                  className="text-white hover:bg-[#0040a0] p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-900 text-lg text-center">
                ¿Seguro que quiere eliminar esta oferta de práctica?
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700 font-medium">{offerToDelete.projectName}</p>
                <p className="text-xs text-gray-500 mt-1">{offerToDelete.title}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteOfferConfirmation(false);
                    setOfferToDelete(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    console.log('Eliminar oferta de práctica:', offerToDelete.id);
                    setShowDeleteOfferConfirmation(false);
                    setOfferToDelete(null);
                    setSelectedPublication(null);
                    showSuccess('Oferta de práctica eliminada');
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de límite de postulaciones */}
      {showMaxPostulationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full">
            <div className="bg-orange-500 text-white p-6 rounded-t-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Límite de Postulaciones</h2>
                <button
                  onClick={() => setShowMaxPostulationsModal(false)}
                  className="text-white hover:bg-orange-600 p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <AlertTriangle size={64} className="text-orange-500" />
              </div>
              <p className="text-gray-900 text-lg font-semibold">
                Ya tienes 2 postulaciones activas
              </p>
              <p className="text-gray-600">
                Solo puedes postular a un máximo de <strong>2 proyectos</strong> simultáneamente. Espera a que una de tus postulaciones sea resuelta antes de postular a otro proyecto.
              </p>
              <button
                onClick={() => setShowMaxPostulationsModal(false)}
                className="w-full bg-[#003082] hover:bg-[#0040a0] text-white py-3 rounded-lg font-medium transition-colors"
              >
                Entendido
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
      {selectedPublication && !showRatingModal && !showApplicantsModal && !showReportModal && !showDeleteConfirmation && (
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

              {/* Solo mostrar requisitos, duración y modalidad si NO es solicitud de empresa */}
              {selectedPublication.category !== 'solicitudes' && (
                <>
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
                </>
              )}

              {/* Información de datos institucionales para solicitudes de empresa */}
              {selectedPublication.category === 'solicitudes' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Datos Institucionales</h3>
                  <p className="text-gray-700 mb-3 whitespace-pre-line">{selectedPublication.requirements}</p>
                  {selectedPublication.location && (
                    <p className="text-gray-700 mb-2">
                      <strong>Ubicación:</strong> {selectedPublication.location}
                    </p>
                  )}
                  <div className="mt-3 pt-3 border-t border-blue-300">
                    <h4 className="font-semibold text-gray-900 mb-2">Contacto</h4>
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
                </div>
              )}

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

              {/* Publicado por - no mostrar en solicitudes de empresa */}
              {selectedPublication.category !== 'solicitudes' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Publicado por</h3>
                  <p className="text-gray-700">{selectedPublication.author}</p>
                </div>
              )}

              {/* Botones de acción según categoría y estado */}
              <div className="flex gap-3 pt-4">
                {/* Ofertas de práctica - estudiante puede reportar, administrador puede eliminar */}
                {selectedPublication.category === 'practicas' && ownershipFilter !== 'ofertas-practica-publicadas' && (
                  <>
                    <button
                      onClick={() => setSelectedPublication(null)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cerrar
                    </button>
                    {(userType === 'estudiante' || userType === 'academico') && (
                      <button
                        onClick={() => {
                          setShowReportModal(true);
                        }}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        Reportar
                      </button>
                    )}
                    {userType === 'administrador' && (
                      <button
                        onClick={() => {
                          setShowDeleteConfirmation(true);
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        Eliminar Publicación
                      </button>
                    )}
                  </>
                )}

                {/* Proyectos publicados - ofertas de práctica del empresario */}
                {selectedPublication.category === 'publicados' && selectedPublication.isPractice && userType === 'empresario' && ownershipFilter !== 'ofertas-practica-publicadas' && (
                  <>
                    <button
                      onClick={() => {
                        setOfferToDelete(selectedPublication);
                        setShowDeleteOfferConfirmation(true);
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
                {selectedPublication.category === 'publicados' && !selectedPublication.isPractice && ownershipFilter !== 'proyectos-publicados' && (
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
                          setSelectedPublication(null);
                          showSuccess('Proyecto finalizado exitosamente');
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

                {/* Proyectos generales - estudiante puede postular y reportar, administrador puede eliminar */}
                {selectedPublication.category === 'general' && ownershipFilter !== 'proyectos-publicados' && (
                  <>
                    <button
                      onClick={() => setSelectedPublication(null)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cerrar
                    </button>
                    {(userType === 'estudiante' || userType === 'academico') && (
                      <>
                        <button
                          onClick={() => {
                            if (appliedProjects.includes(selectedPublication.id)) {
                              return;
                            }
                            if (selectedPublication.maxMembers !== undefined) {
                              const acceptedCount = selectedPublication.applicants?.filter(a => a.status === 'aceptado').length ?? 0;
                              if (acceptedCount >= selectedPublication.maxMembers) {
                                setShowFullProjectModal(true);
                                return;
                              }
                            }
                            if (appliedProjects.length >= 2) {
                              setShowMaxPostulationsModal(true);
                              return;
                            }
                            setAppliedProjects([...appliedProjects, selectedPublication.id]);
                            setSelectedPublication(null);
                          }}
                          disabled={appliedProjects.includes(selectedPublication.id)}
                          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                            appliedProjects.includes(selectedPublication.id)
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                          }`}
                        >
                          {appliedProjects.includes(selectedPublication.id) ? 'Postulado' : 'Postular'}
                        </button>
                        <button
                          onClick={() => {
                            console.log('Reportar publicación');
                            setSelectedPublication(null);
                            showSuccess('Publicación reportada. Será revisada por un administrador.');
                          }}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                          Reportar
                        </button>
                      </>
                    )}
                    {userType === 'administrador' && (
                      <button
                        onClick={() => {
                          setShowDeleteConfirmation(true);
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        Eliminar Publicación
                      </button>
                    )}
                  </>
                )}

                {/* Proyectos participando */}
                {selectedPublication.category === 'participando' && ownershipFilter !== 'proyectos-publicados' && (
                  <>
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

                {/* Proyectos Publicados - Administrador */}
                {(ownershipFilter === 'proyectos-publicados' || ownershipFilter === 'ofertas-practica-publicadas') && (
                  <>
                    <button
                      onClick={() => {
                        setShowDeleteConfirmation(true);
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

                {/* Reportados - Eliminar (Administrador) */}
                {selectedPublication.category === 'reportados' && (
                  <>
                    <button
                      onClick={() => {
                        setShowDeleteConfirmation(true);
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
                        console.log('Aceptar solicitud de perfil de empresa');
                        setSelectedPublication(null);
                        showSuccess('Perfil de empresa aprobado exitosamente');
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => {
                        console.log('Rechazar solicitud de perfil de empresa');
                        setSelectedPublication(null);
                        showSuccess('Solicitud de perfil de empresa rechazada');
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

      {/* Overlay invisible para cerrar sidebar al hacer clic fuera */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Barra lateral izquierda */}
      <div
        className={`bg-[#003082] transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden fixed left-0 top-0 bottom-0 z-20`}
      >
        {/* Header de la sidebar */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <img src={Logo} alt="CampusOne Logo" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-white font-bold ">CampusOne</h1>
              <p className="text-gray-300 text-xs">Universidad de La Serena</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {userType === 'estudiante' && (
            <>
              {/* Empleabilidad y Colaboración - Solo Estudiante */}
              <div className="p-4">
                <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-3">Empleabilidad y Colaboración</h3>
                <div className="space-y-1">
                  <SidebarItem
                    icon={<FileText size={20} />}
                    label="Proyectos Publicados"
                    active={ownershipFilter === 'general'}
                    onClick={() => handleChangeOwnershipFilter('general')}
                  />
                  <SidebarItem
                    icon={<Users size={20} />}
                    label="Mis Proyectos"
                    active={ownershipFilter === 'publicados'}
                    onClick={() => handleChangeOwnershipFilter('publicados')}
                  />
                  <SidebarItem
                    icon={<Briefcase size={20} />}
                    label="Proyectos Inscritos"
                    active={ownershipFilter === 'participando'}
                    onClick={() => handleChangeOwnershipFilter('participando')}
                  />
                  <SidebarItem
                    icon={<GraduationCap size={20} />}
                    label="Portal de Oportunidades"
                    active={ownershipFilter === 'practicas'}
                    onClick={() => handleChangeOwnershipFilter('practicas')}
                  />
                </div>
              </div>

              {/* Otros Módulos - Solo Estudiante */}
              <div className="p-4 border-t border-white/10">
                <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-3">Campus One</h3>
                <div className="space-y-1">
                  <SidebarItem
                    icon={<Navigation size={20} />}
                    label="Navegación Inteligente"
                    //onClick={() => window.open('https://www.figma.com/make/MPbwi8jnlvthVISoiJDHIp/Crear-página-inicial-Visitante--copia-?p=f&t=XnF3nwo78SBpxnWr-0', '_self')}
                    //onClick={() => { window.location.href = 'https://www.figma.com/make/MPbwi8jnlvthVISoiJDHIp/Crear-página-inicial-Visitante--copia-?p=f&t=XnF3nwo78SBpxnWr-0'; }}
                    onClick={() => window.open('https://www.figma.com/make/MPbwi8jnlvthVISoiJDHIp/Crear-página-inicial-Visitante--copia-?p=f&t=XnF3nwo78SBpxnWr-0', '_blank')}
                    //onClick={() => console.log('Navegación Inteligente')}
                  />
                  <SidebarItem
                    icon={<BarChart size={20} />}
                    label="Rating y Analytics"
                    onClick={() => window.open('https://www.figma.com/make/mJ8EVmiupaq6PpDtFqMiUi/Modulo-Software-sinCuenta?t=lmu9EToshPZcc1MG-1', '_blank')}
                    //onClick={() => console.log('Rating y Analytics')}
                  />
                  <SidebarItem
                    icon={<Settings size={20} />}
                    label="Eficiencia Administrativa"
                    onClick={() => window.open('https://www.figma.com/make/mJ8EVmiupaq6PpDtFqMiUi/Modulo-Software-sinCuenta?t=lmu9EToshPZcc1MG-1', '_blank')}
                    
                    //onClick={() => console.log('Eficiencia Administrativa')}
                  />
                  <SidebarItem
                    icon={<Network size={20} />}
                    label="Networking y Match Académico"
                    onClick={() => window.open('https://www.figma.com/make/ErT6JJ5l6ZxNZfeTFkn6iF/Meditation-app-design?p=f&t=cp55LbQFa9EkGKge-0', '_blank')}
                    //onClick={() => { window.location.href = 'https://www.figma.com/make/ErT6JJ5l6ZxNZfeTFkn6iF/Meditation-app-design?p=f&t=cp55LbQFa9EkGKge-0'; }}
                    //onClick={() => console.log('Networking y Match Académico')}
                  />
                </div>
              </div>
            </>
          )}

          {userType === 'academico' && (
            <>
              {/* Empleabilidad y Colaboración - Académico (sin Portal de Oportunidades) */}
              <div className="p-4">
                <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-3">Empleabilidad y Colaboración</h3>
                <div className="space-y-1">
                  <SidebarItem
                    icon={<FileText size={20} />}
                    label="Proyectos Publicados"
                    active={ownershipFilter === 'general'}
                    onClick={() => handleChangeOwnershipFilter('general')}
                  />
                  <SidebarItem
                    icon={<Users size={20} />}
                    label="Mis Proyectos"
                    active={ownershipFilter === 'publicados'}
                    onClick={() => handleChangeOwnershipFilter('publicados')}
                  />
                  <SidebarItem
                    icon={<Briefcase size={20} />}
                    label="Proyectos Participando"
                    active={ownershipFilter === 'participando'}
                    onClick={() => handleChangeOwnershipFilter('participando')}
                  />
                </div>
              </div>

              {/* Otros Módulos - Académico */}
              <div className="p-4 border-t border-white/10">
                <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-3">Campus One</h3>
                <div className="space-y-1">
                  <SidebarItem
                    icon={<Navigation size={20} />}
                    label="Navegación Inteligente"
                    onClick={() => window.open('https://www.figma.com/make/MPbwi8jnlvthVISoiJDHIp/Crear-página-inicial-Visitante--copia-?p=f&t=XnF3nwo78SBpxnWr-0', '_blank')}
                  />
                  <SidebarItem
                    icon={<BarChart size={20} />}
                    label="Rating y Analytics"
                    onClick={() => window.open('https://www.figma.com/make/mJ8EVmiupaq6PpDtFqMiUi/Modulo-Software-sinCuenta?t=lmu9EToshPZcc1MG-1', '_blank')}
                  />
                  <SidebarItem
                    icon={<Settings size={20} />}
                    label="Eficiencia Administrativa"
                    onClick={() => window.open('https://www.figma.com/make/mJ8EVmiupaq6PpDtFqMiUi/Modulo-Software-sinCuenta?t=lmu9EToshPZcc1MG-1', '_blank')}
                  />
                  <SidebarItem
                    icon={<Network size={20} />}
                    label="Networking y Match Académico"
                    onClick={() => window.open('https://www.figma.com/make/ErT6JJ5l6ZxNZfeTFkn6iF/Meditation-app-design?p=f&t=cp55LbQFa9EkGKge-0', '_blank')}
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
                    onClick={() => handleChangeOwnershipFilter('publicados')}
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
                    icon={<FileText size={20} />}
                    label="Proyectos Publicados"
                    active={ownershipFilter === 'proyectos-publicados'}
                    onClick={() => handleChangeOwnershipFilter('proyectos-publicados')}
                  />
                  <SidebarItem
                    icon={<Briefcase size={20} />}
                    label="Ofertas de Práctica Publicadas"
                    active={ownershipFilter === 'ofertas-practica-publicadas'}
                    onClick={() => handleChangeOwnershipFilter('ofertas-practica-publicadas')}
                  />
                  <SidebarItem
                    icon={<AlertTriangle size={20} />}
                    label="Reportados/Ocultos"
                    active={ownershipFilter === 'reportados'}
                    onClick={() => handleChangeOwnershipFilter('reportados')}
                  />
                  <SidebarItem
                    icon={<CheckCircle size={20} />}
                    label="Solicitudes de Empresa"
                    active={ownershipFilter === 'solicitudes'}
                    onClick={() => handleChangeOwnershipFilter('solicitudes')}
                  />
                  <SidebarItem
                    icon={<Settings size={20} />}
                    label="Gestionar Filtros"
                    active={ownershipFilter === 'gestionar-filtros'}
                    onClick={() => handleChangeOwnershipFilter('gestionar-filtros')}
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

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1">

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
              {userType === 'academico' && <BookOpen size={20} className="text-white" />}
              {userType === 'empresario' && <Briefcase size={20} className="text-white" />}
              {userType === 'administrador' && <Settings size={20} className="text-white" />}
            </button>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {/* Filtros - Solo para estudiante/académico y categorías específicas */}
          {(userType === 'estudiante' || userType === 'academico') && ownershipFilter !== 'gestionar-filtros' && (
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
                <div className="space-y-4">
                  {/* Filtro de Carrera con autocompletado */}
                  <div className="relative">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">Carrera</label>
                    <input
                      type="text"
                      placeholder="Buscar carrera..."
                      value={careerFilter}
                      onChange={(e) => {
                        setCareerFilter(e.target.value);
                        setShowCareerSuggestions(e.target.value.length > 0);
                      }}
                      onFocus={() => setShowCareerSuggestions(careerFilter.length > 0)}
                      onBlur={() => setTimeout(() => setShowCareerSuggestions(false), 200)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003082] focus:border-transparent"
                    />
                    {showCareerSuggestions && careerFilter && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {careerSuggestions
                          .filter(career => career.toLowerCase().includes(careerFilter.toLowerCase()))
                          .map((career, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setCareerFilter(career);
                                setShowCareerSuggestions(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-gray-700"
                            >
                              {career}
                            </button>
                          ))}
                        {careerSuggestions.filter(career => career.toLowerCase().includes(careerFilter.toLowerCase())).length === 0 && (
                          <div className="px-4 py-2 text-gray-400 text-sm">No se encontraron sugerencias</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Filtro de Tipo de Jornada - Botones */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">Tipo de Jornada</label>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setScheduleTypeFilter(scheduleTypeFilter === 'Full-time' ? '' : 'Full-time')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          scheduleTypeFilter === 'Full-time'
                            ? 'bg-[#003082] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Full-time
                      </button>
                      <button
                        onClick={() => setScheduleTypeFilter(scheduleTypeFilter === 'Part-time' ? '' : 'Part-time')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          scheduleTypeFilter === 'Part-time'
                            ? 'bg-[#003082] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Part-time
                      </button>
                      <button
                        onClick={() => setScheduleTypeFilter(scheduleTypeFilter === 'Flexible' ? '' : 'Flexible')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          scheduleTypeFilter === 'Flexible'
                            ? 'bg-[#003082] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Flexible
                      </button>
                    </div>
                  </div>

                  {/* Filtro de Nivel de Experiencia - Botones */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">Nivel de Experiencia</label>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setExperienceLevelFilter(experienceLevelFilter === 'Sin experiencia' ? '' : 'Sin experiencia')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          experienceLevelFilter === 'Sin experiencia'
                            ? 'bg-[#003082] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Sin experiencia
                      </button>
                      <button
                        onClick={() => setExperienceLevelFilter(experienceLevelFilter === 'Estudiante' ? '' : 'Estudiante')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          experienceLevelFilter === 'Estudiante'
                            ? 'bg-[#003082] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Estudiante
                      </button>
                      <button
                        onClick={() => setExperienceLevelFilter(experienceLevelFilter === 'Junior' ? '' : 'Junior')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          experienceLevelFilter === 'Junior'
                            ? 'bg-[#003082] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Junior
                      </button>
                      <button
                        onClick={() => setExperienceLevelFilter(experienceLevelFilter === 'Semi-senior' ? '' : 'Semi-senior')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          experienceLevelFilter === 'Semi-senior'
                            ? 'bg-[#003082] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Semi-senior
                      </button>
                      <button
                        onClick={() => setExperienceLevelFilter(experienceLevelFilter === 'Senior' ? '' : 'Senior')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          experienceLevelFilter === 'Senior'
                            ? 'bg-[#003082] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Senior
                      </button>
                    </div>
                  </div>
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
                {/* Botón para crear nuevo proyecto (solo estudiante/académico en publicados) */}
                {(userType === 'estudiante' || userType === 'academico') && ownershipFilter === 'publicados' && (
                  <button
                    onClick={() => setShowCreateProjectModal(true)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">+</span>
                    Crear Nuevo Proyecto
                  </button>
                )}

                {/* Botón para crear nueva oferta (solo empresario) */}
                {userType === 'empresario' && (
                  <button
                    onClick={() => setShowCreateInternshipModal(true)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">+</span>
                    Nueva Oferta de Práctica
                  </button>
                )}

                {/* Contador de resultados */}
                <div className="bg-[#5B7FC7] text-white text-center py-2 rounded-lg mb-4">
                  {filteredPublications.length} proyecto{filteredPublications.length !== 1 ? 's' : ''} encontrado{filteredPublications.length !== 1 ? 's' : ''}
                </div>

                {/* Indicador de postulaciones activas para estudiante en vista general */}
                {(userType === 'estudiante' || userType === 'academico') && ownershipFilter === 'general' && appliedProjects.length > 0 && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-3 text-sm font-medium ${
                    appliedProjects.length >= 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    <Briefcase size={16} />
                    {appliedProjects.length >= 2
                      ? 'Has alcanzado el límite de 2 postulaciones activas'
                      : `Tienes ${appliedProjects.length} postulación activa (puedes postular a ${2 - appliedProjects.length} más)`
                    }
                  </div>
                )}

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
                          ownershipFilter={ownershipFilter}
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
      <span>{label}</span>
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

function PublicationCard({ publication, userType, ownershipFilter, onViewDetails }: { publication: Publication; userType: UserType; ownershipFilter: OwnershipFilter; onViewDetails: () => void }) {
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
    // Administrador en proyectos publicados siempre ve "Detalles"
    if (userType === 'administrador' && ownershipFilter === 'proyectos-publicados') {
      return 'Detalles';
    }
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
      if (publication.status === 'en-evaluacion') return 'Evaluar Participantes';
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
          <div className="flex items-center gap-2">
            {publication.status && (
              <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
                {getStatusText(publication.status)}
              </span>
            )}
            {publication.isPractice && publication.reportCount !== undefined && publication.reportCount > 0 && userType === 'administrador' && ownershipFilter === 'ofertas-practica-publicadas' && (
              <span className="text-xs px-2 py-1 bg-orange-500 rounded-full flex items-center gap-1">
                <AlertTriangle size={14} />
                {publication.reportCount} {publication.reportCount === 1 ? 'reporte' : 'reportes'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contenido blanco */}
      <div className="bg-white p-4">
        <p className="text-gray-700 mb-3">{publication.description}</p>

        {/* Cupos disponibles - mostrar en Proyectos Publicados (general) y Mis Proyectos (publicados) */}
        {(ownershipFilter === 'general' || ownershipFilter === 'publicados') && publication.maxMembers !== undefined && (
          <div className="mb-3">
            {(() => {
              const acceptedCount = publication.applicants?.filter(a => a.status === 'aceptado').length ?? 0;
              const spotsAvailable = publication.maxMembers - acceptedCount;
              const isFull = spotsAvailable <= 0;
              return (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  <Users size={14} />
                  {isFull ? 'Cupo completo' : `${spotsAvailable} cupo${spotsAvailable !== 1 ? 's' : ''} disponible${spotsAvailable !== 1 ? 's' : ''}`}
                  <span className="text-gray-500 font-normal">({acceptedCount}/{publication.maxMembers})</span>
                </span>
              );
            })()}
          </div>
        )}

        {/* Botón */}
        <div className="flex justify-end">
          {/* Ofertas de práctica del empresario - botón eliminar directo */}
          {publication.isPractice && userType === 'empresario' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
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
