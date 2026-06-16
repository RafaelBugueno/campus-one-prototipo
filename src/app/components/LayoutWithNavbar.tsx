import { useState, useEffect, useRef } from 'react';
import { CustomNavbar } from './new-file';
import { CustomSidebar } from './new-file1';
import { LoginModal } from './LoginModal';
import { Footer } from './Footer';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutWithNavbarProps {
  children: React.ReactNode;
}

export function LayoutWithNavbar({ children }: LayoutWithNavbarProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout, userType } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !sidebarCollapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarCollapsed]);

  return (
    <>
      {/* Header Horizontal Superior */}
      <CustomNavbar
        collapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Backdrop - aparece cuando el sidebar está visible */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 z-[1900]"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Barra Vertical Izquierda */}
      <div ref={sidebarRef}>
        <CustomSidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          onLogoClick={() => {
            navigate('/');
          }}
          onLoginOpen={() => setLoginOpen(true)}
          onNavigate={(path) => navigate(path)}
        />
      </div>

      {/* Push Notification justo debajo del header */}
      <AnimatePresence>
        {notificationVisible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.4 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y < -50 || velocity.y < -500) {
                setNotificationVisible(false);
              }
            }}
            className="fixed top-14 left-0 right-0 z-[1300] px-4 pt-2 pb-2 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none"
          >
            <div className="max-w-4xl mx-auto pointer-events-auto">
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-gradient-to-br from-[#003082] via-[#003082]/80 to-[#CF142B] cursor-grab active:cursor-grabbing">
                {/* Drag indicator */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-white/40 rounded-full" />

                <div className="px-4 py-3 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Live Badge */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 bg-[#CF142B]/20 backdrop-blur-sm rounded-full px-2 py-0.5 border border-[#CF142B]/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#CF142B] animate-pulse" />
                            <span className="text-white text-xs font-semibold">
                              En vivo
                            </span>
                          </div>
                      </div>

                      {/* Event Info */}
                      <h3 className="text-base font-bold text-white mb-0.5 truncate">
                        Congreso Universitario 2025
                      </h3>
                      <p className="text-white/70 text-xs truncate">
                        Auditorio Central • 48 actividades
                      </p>
                    </div>

                    {/* Close button */}
                    <button
                      onClick={() => setNotificationVisible(false)}
                      className="text-white/60 hover:text-white transition-colors p-0.5 flex-shrink-0"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#CF142B]/20 to-transparent rounded-full blur-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#003082]/20 to-transparent rounded-full blur-xl pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido principal con padding-top para el navbar */}
      <div className="pt-14 min-h-screen flex flex-col">
        <div className="flex-1">
          {children}
        </div>

        <Footer />
      </div>

      {/* Botón de Login/Logout Circular Flotante */}
      {!isAuthenticated ? (
        <motion.button
          onClick={() => setLoginOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[rgb(0,123,255)] hover:bg-[rgb(0,50,130)] text-white rounded-full shadow-lg flex items-center justify-center z-[1400] transition-colors"
          title="Iniciar Sesión"
        >
          <LogIn size={24} />
        </motion.button>
      ) : (
        <motion.button
          onClick={() => {
            logout();
            navigate('/');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[rgb(200,16,46)] hover:bg-[rgb(150,12,34)] text-white rounded-full shadow-lg flex items-center justify-center z-[1400] transition-colors"
          title={`Cerrar Sesión (${
            userType === 'student' ? 'Estudiante' :
            userType === 'empresario' ? 'Empresario' :
            userType === 'mentor' ? 'Mentor/Expositor' :
            userType === 'organizer' ? 'Organizador' :
            'Administrador'
          })`}
        >
          <LogOut size={24} />
        </motion.button>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
