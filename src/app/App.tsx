import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import StudentPOIPanel from './components/StudentPOIPanel';
import SuggestPOI from './components/SuggestPOI';
import { LayoutWithNavbar } from './components/LayoutWithNavbar';
import MapaVisitante from './components/MapaVisitante';
import EficienciaAdministrativaVisitante from './components/EficienciaAdministrativaVisitante';
import { NavigationRouter } from './components/navigation/NavigationRouter';
import { EmpleabilidadRouter } from './components/navigation/EmpleabilidadRouter';
import { NetworkingRouter } from './components/navigation/NetworkingRouter';
import { EficienciaRouter } from './components/navigation/EficienciaRouter';
import { RatingRouter } from './components/navigation/RatingRouter';
import { AuthProvider } from './contexts/AuthContext';
import heroImage from '@/imports/image-8.png';

function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[HomePage] Componente montado');
    return () => {
      console.log('[HomePage] Componente desmontado');
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;

      const heroHeight = heroRef.current.offsetHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / heroHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <LayoutWithNavbar>
      <div className="relative min-h-screen bg-slate-50">
        {/* Hero Section */}
        <div ref={heroRef} className="relative">
          {/* Imagen de fondo con overlay y título */}
          <div
            className="relative h-[55vh] bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImage})`,
              opacity: 1 - scrollProgress * 0.5
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#003082]/50 via-[#003082]/40 to-[#003082]/70" />

            {/* Título sobre la imagen */}
            <div
              className="relative z-10 h-full flex flex-col items-center justify-center px-8"
              style={{
                opacity: 1 - scrollProgress * 1.5
              }}
            >
              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-6xl font-['Museo_Sans'] font-bold text-white mb-2 tracking-tight text-center"
              >
                Tech Hub ULS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-lg md:text-xl font-['Museo_Sans'] text-white/90 text-center"
              >
                Universidad de La Serena
              </motion.p>
            </div>
          </div>

          {/* Sección blanca con párrafos - STICKY */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="sticky top-14 bg-slate-50 px-8 md:px-16 py-12 z-[100] shadow-none"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Párrafo 1 */}
              <p className="text-base font-['Museo_Sans'] text-gray-700 leading-relaxed">
                La Universidad de La Serena, con más de 40 años de trayectoria, es una institución pública comprometida con la excelencia académica, la investigación y el desarrollo regional.
              </p>

              {/* Párrafo 2 */}
              <p className="text-base font-['Museo_Sans'] text-gray-700 leading-relaxed">
                Este sitio, desarrollado por estudiantes para estudiantes, reúne herramientas y recursos creados desde la experiencia directa para facilitar la conexión, orientación y acceso a oportunidades dentro de la comunidad.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </LayoutWithNavbar>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student-map" element={<StudentPOIPanel />} />
          <Route path="/suggest-poi" element={<SuggestPOI />} />
          <Route path="/mapa_visitante" element={<MapaVisitante />} />
          <Route path="/eficiencia_administrativa_visitante" element={<EficienciaAdministrativaVisitante />} />
          <Route path="/navegacion-inteligente" element={<NavigationRouter />} />
          <Route path="/empleabilidad-y-colaboracion" element={<EmpleabilidadRouter />} />
          <Route path="/networking-y-match-academico/*" element={<NetworkingRouter />} />
          <Route path="/eficiencia-administrativa" element={<EficienciaRouter />} />
          <Route path="/rating-y-analytics/*" element={<RatingRouter />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
