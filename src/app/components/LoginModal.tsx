import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar que el email termina con @userena.cl
    if (!email.endsWith('@userena.cl')) {
      setError('El correo debe terminar con @userena.cl');
      return;
    }

    // Extraer el tipo de usuario del email
    const emailPrefix = email.replace('@userena.cl', '');

    // Mapeo de prefijos de email a tipos de usuario
    const userTypeMap: Record<string, 'student' | 'admin' | 'empresario' | 'mentor' | 'organizer'> = {
      'estudiante': 'student',
      'administrador': 'admin',
      'empresario': 'empresario',
      'mentor': 'mentor',
      'organizador': 'organizer'
    };

    const userType = userTypeMap[emailPrefix];

    // Validar que el tipo de usuario existe
    if (!userType) {
      setError('Usuario no válido. Los usuarios permitidos son: estudiante, administrador, empresario, mentor, organizador');
      return;
    }

    // Validar que la contraseña coincide con el tipo de usuario
    if (password !== emailPrefix) {
      setError('Contraseña incorrecta');
      return;
    }

    // Login exitoso
    login(userType, email);
    const typeMap: Record<typeof userType, string> = {
      student: 'Estudiante',
      admin: 'Administrador',
      empresario: 'Empresario',
      mentor: 'Mentor/Expositor',
      organizer: 'Organizador'
    };
    alert(`Login exitoso como ${typeMap[userType]}!`);
    onClose();
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[3000]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3100] w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
              {/* Header con gradiente */}
              <div
                className="px-8 py-6 text-white"
                style={{
                  background: 'linear-gradient(135deg, rgb(0,50,130), rgb(0,123,255))',
                }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-['Museo_Sans'] font-bold">
                    Iniciar Sesión
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-white/75 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <p className="mt-1 text-sm text-white/75">
                  Accede a tu cuenta de CampusOne
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-['Museo_Sans']">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-['Museo_Sans'] text-sm text-slate-700"
                    placeholder="estudiante@userena.cl"
                  />
                  <p className="mt-1 text-xs text-slate-500 font-['Museo_Sans']">
                    Usa: estudiante, administrador, empresario, mentor u organizador
                  </p>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-['Museo_Sans'] text-sm text-slate-700"
                    placeholder="••••••••"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-11 bg-[rgb(0,123,255)] hover:bg-[#003082] text-white rounded-xl font-['Museo_Sans'] font-semibold transition-colors shadow-sm mt-6"
                >
                  Ingresar
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
