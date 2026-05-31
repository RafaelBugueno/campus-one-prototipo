import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, FileText, Briefcase, Star, Users, Menu, X, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onLoginClick: () => void;
}

export default function Sidebar({ onLoginClick }: SidebarProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    {
      icon: MapPin,
      label: 'Navegación Inteligente',
      id: 'mapa',
      description: 'Visualización de mapas interactivos de las sedes universitarias, con puntos de interés y eventos georreferenciados.'
    },
    {
      icon: Star,
      label: 'Rating & Analytics',
      id: 'rating',
      description: 'Evaluación de servicios y espacios del campus (escala 1–5) con rankings por categoría, y seguimiento gamificado del avance académico personal.'
    },
    {
      icon: Briefcase,
      label: 'Empleabilidad y Colaboración',
      id: 'proyectos',
      description: 'Portal de empleos externos y laboratorio de proyectos interdisciplinarios con postulaciones internas.'
    },
    {
      icon: FileText,
      label: 'Eficiencia Administrativa',
      id: 'tramites',
      description: 'Guías interactivas para trámites, directorio de contactos, panel de plazos con recordatorios, navegación física a dependencias y ranking de dificultad de trámites basado en configuración y retroalimentación estudiantil.'
    },
    {
      icon: Users,
      label: 'Networking y Match Académico',
      id: 'networking',
      description: 'Motor de compatibilidad por intereses y carrera, con solicitudes de conexión, mensajería y agendamiento de mentorías.'
    },
  ];

  return (
    <>
      {/* Botón Toggle del Sidebar */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-0 top-8 z-50 bg-[#003082] text-white p-1.5 hover:bg-[#CF142B] transition-colors shadow-lg"
        style={{
          left: sidebarOpen ? '50px' : '0px',
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ left: sidebarOpen ? '50px' : '0px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            exit={{ x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-screen w-[50px] bg-[#003082] z-40 shadow-xl"
          >
            <div className="flex flex-col h-full py-6">
              {/* Logo Universidad */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 px-2 flex items-center justify-center cursor-pointer"
                onClick={() => navigate('/')}
              >
                <img
                  src="/src/imports/logo_izquierda.png"
                  alt="Universidad de La Serena"
                  className="w-9 h-9 object-contain"
                />
              </motion.div>

              {/* Navegación */}
              <nav className="flex-1 flex flex-col items-center justify-center space-y-8">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'mapa') {
                        navigate('/navegacion-inteligente');
                      } else if (item.id === 'tramites') {
                        navigate('/eficiencia-administrativa');
                      } else if (item.id === 'proyectos') {
                        navigate('/empleabilidad-y-colaboracion');
                      } else if (item.id === 'networking') {
                        navigate('/networking-y-match-academico');
                      } else {
                        onLoginClick();
                      }
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-all group relative"
                    title={item.label}
                  >
                    <item.icon size={24} strokeWidth={2} />
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-full ml-4 px-4 py-3 bg-white text-gray-800 text-sm rounded-lg shadow-2xl whitespace-normal pointer-events-none w-64 z-50"
                    >
                      <div className="font-['Plus_Jakarta_Sans'] font-semibold text-[#003082] mb-1">
                        {item.label}
                      </div>
                      <div className="font-['Plus_Jakarta_Sans'] text-xs text-gray-600 leading-relaxed">
                        {item.description}
                      </div>
                    </motion.div>
                  </motion.button>
                ))}
              </nav>

              {/* Login Button */}
              <motion.button
                onClick={onLoginClick}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-all mb-4 relative group"
                title="Iniciar Sesión"
              >
                <LogIn size={24} strokeWidth={2} />
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-full ml-3 px-2 py-1 bg-white text-gray-800 text-xs rounded shadow-lg whitespace-nowrap pointer-events-none font-['Plus_Jakarta_Sans']"
                >
                  Iniciar Sesión
                </motion.span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
