import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'login' | 'register' | 'register-code' | 'register-profile' | 'register-success';

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  
  // Estados para Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Estados para Registro
  const [currentView, setCurrentView] = useState<ModalView>('login');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [userType, setUserType] = useState('estudiante');
  const [registrationPassword, setRegistrationPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [registrationCode] = useState('1111'); // Código siempre 1111
  const [codeError, setCodeError] = useState('');
  // Estados para campos por perfil
  const [profile, setProfile] = useState({
    nombre: '',
    apellido: '',
    correo_institucional: registrationEmail,
    carrera: '',
    nivel_academico: '',
    empresa_nombre: '',
    empresa_descripcion: '',
    empresa_ubicacion: '',
    empresa_contacto_email: '',
    empresa_contacto_telefono: '',
    empresa_datos_institucionales: '',
    expositor_carrera: '',
    expositor_cursando: '',
    expositor_graduado_o_docente: '',
    expositor_nivel: '',
    tipo_docente: '',
    contacto_email: '',
  });
  const [profileError, setProfileError] = useState('');

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

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError('');

    // Validaciones
    if (!registrationEmail.trim()) {
      setRegistrationError('Por favor ingresa tu correo electrónico');
      return;
    }

    if (!registrationEmail.endsWith('@userena.cl')) {
      setRegistrationError('El correo debe terminar con @userena.cl');
      return;
    }

    if (!registrationPassword) {
      setRegistrationError('Por favor ingresa una contraseña');
      return;
    }

    if (registrationPassword.length < 6) {
      setRegistrationError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (registrationPassword !== confirmPassword) {
      setRegistrationError('Las contraseñas no coinciden');
      return;
    }

    // Si todo es válido, mostrar pantalla de código
    setCurrentView('register-code');
    setCodeInput('');
    setCodeError('');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');

    if (codeInput !== registrationCode) {
      setCodeError('Código incorrecto. Por favor intenta de nuevo.');
      return;
    }

    // Código correcto, pasar a formulario por perfil antes de éxito
    setProfile((p) => ({ ...p, correo_institucional: registrationEmail }));
    setCurrentView('register-profile');
  };

  const handleProfileChange = (key: string, value: string) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');

    // Validaciones mínimas por tipo
    if (userType === 'estudiante') {
      if (!profile.nombre.trim() || !profile.apellido.trim() || !profile.carrera.trim()) {
        setProfileError('Por favor completa nombre, apellido y carrera');
        return;
      }
    }

    if (userType === 'empresario') {
      if (!profile.empresa_nombre.trim() || !profile.empresa_descripcion.trim()) {
        setProfileError('Por favor completa nombre y descripción de la empresa');
        return;
      }
    }

    if (userType === 'academico') {
      if (!profile.nombre.trim() || !profile.contacto_email.trim()) {
        setProfileError('Por favor completa nombre y correo de contacto');
        return;
      }
    }

    // Organizador y Administrador requieren tipo_docente
    if (userType === 'organizador' || userType === 'administrador') {
      if (!profile.nombre.trim() || !profile.tipo_docente.trim()) {
        setProfileError('Por favor completa nombre y tipo de docente');
        return;
      }
    }

    // Mentor/expositor: require nombre
    if (userType === 'mentor') {
      if (!profile.nombre.trim()) {
        setProfileError('Por favor ingresa el nombre');
        return;
      }
    }

    // Aquí se podría enviar al servidor la información completa de registro + perfil
    setCurrentView('register-success');
  };

  const handleCloseModal = () => {
    setEmail('');
    setPassword('');
    setError('');
    setCurrentView('login');
    setRegistrationEmail('');
    setUserType('estudiante');
    setRegistrationPassword('');
    setConfirmPassword('');
    setRegistrationError('');
    setCodeInput('');
    setCodeError('');
    setProfile({
      nombre: '',
      apellido: '',
      correo_institucional: '',
      carrera: '',
      nivel_academico: '',
      empresa_nombre: '',
      empresa_descripcion: '',
      empresa_ubicacion: '',
      empresa_contacto_email: '',
      empresa_contacto_telefono: '',
      empresa_datos_institucionales: '',
      expositor_carrera: '',
      expositor_cursando: '',
      expositor_graduado_o_docente: '',
      expositor_nivel: '',
      tipo_docente: '',
      contacto_email: '',
    });
    setProfileError('');
    onClose();
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
    setRegistrationEmail('');
    setUserType('estudiante');
    setRegistrationPassword('');
    setConfirmPassword('');
    setRegistrationError('');
    setCodeInput('');
    setCodeError('');
    setProfile({
      nombre: '',
      apellido: '',
      correo_institucional: '',
      carrera: '',
      nivel_academico: '',
      empresa_nombre: '',
      empresa_descripcion: '',
      empresa_ubicacion: '',
      empresa_contacto_email: '',
      empresa_contacto_telefono: '',
      empresa_datos_institucionales: '',
      expositor_carrera: '',
      expositor_cursando: '',
      expositor_graduado_o_docente: '',
      expositor_nivel: '',
      tipo_docente: '',
      contacto_email: '',
    });
    setProfileError('');
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
            onClick={handleCloseModal}
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
              {/* VISTA DE LOGIN */}
              {currentView === 'login' && (
                <>
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
                        onClick={handleCloseModal}
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

                    {/* Opción de registro */}
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-center text-sm text-slate-600 font-['Museo_Sans'] mb-3">
                        ¿No tienes cuenta?
                      </p>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentView('register')}
                        className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-['Museo_Sans'] font-semibold transition-colors"
                      >
                        Registrarse
                      </motion.button>
                    </div>
                  </form>
                </>
              )}

              {/* VISTA DE REGISTRO */}
              {currentView === 'register' && (
                <>
                  {/* Header con gradiente */}
                  <div
                    className="px-8 py-6 text-white"
                    style={{
                      background: 'linear-gradient(135deg, rgb(0,50,130), rgb(0,123,255))',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-['Museo_Sans'] font-bold">
                        Registrarse
                      </h2>
                      <button
                        onClick={handleCloseModal}
                        className="text-white/75 hover:text-white transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-white/75">
                      Crea tu cuenta en CampusOne
                    </p>
                  </div>

                  {/* Form de Registro */}
                  <form onSubmit={handleRegisterSubmit} className="p-8 space-y-5">
                    {registrationError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-['Museo_Sans']">
                        {registrationError}
                      </div>
                    )}

                    <div>
                      <label htmlFor="reg-email" className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        id="reg-email"
                        value={registrationEmail}
                        onChange={(e) => setRegistrationEmail(e.target.value)}
                        required
                        className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-['Museo_Sans'] text-sm text-slate-700"
                        placeholder="tu.email@userena.cl"
                      />
                    </div>

                    <div>
                      <label htmlFor="user-type" className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">
                        Tipo de usuario
                      </label>
                      <select
                        id="user-type"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-['Museo_Sans'] text-sm text-slate-700 cursor-pointer"
                      >
                        <option value="estudiante">Estudiante</option>
                        <option value="administrador">Administrador</option>
                        <option value="empresario">Empresario</option>
                        <option value="mentor">Mentor</option>
                        <option value="organizador">Organizador</option>
                        <option value="academico">Académico</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="reg-password" className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        id="reg-password"
                        value={registrationPassword}
                        onChange={(e) => setRegistrationPassword(e.target.value)}
                        required
                        className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-['Museo_Sans'] text-sm text-slate-700"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Enviar solicitud de registro
                    </motion.button>

                    {/* Volver al login */}
                    <div className="pt-2 border-t border-slate-200">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBackToLogin}
                        className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-['Museo_Sans'] text-sm font-semibold transition-colors"
                      >
                        Volver al inicio de sesión
                      </motion.button>
                    </div>
                  </form>
                </>
              )}

              {/* VISTA DE INGRESO DE CÓDIGO */}
              {currentView === 'register-code' && (
                <>
                  {/* Header con gradiente */}
                  <div
                    className="px-8 py-6 text-white"
                    style={{
                      background: 'linear-gradient(135deg, rgb(0,50,130), rgb(0,123,255))',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-['Museo_Sans'] font-bold">
                        Verificación
                      </h2>
                      <button
                        onClick={handleCloseModal}
                        className="text-white/75 hover:text-white transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Form de Código */}
                  <form onSubmit={handleCodeSubmit} className="p-8 space-y-5">
                    <div className="bg-blue-50 border border-blue-200 px-4 py-4 rounded-xl">
                      <p className="text-sm font-['Museo_Sans'] text-slate-700">
                        Se envió un código de 4 dígitos al correo <br />
                        <span className="font-semibold text-blue-600">{registrationEmail}</span>
                      </p>
                    </div>

                    {codeError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-['Museo_Sans']">
                        {codeError}
                      </div>
                    )}

                    <div>
                      <label htmlFor="code" className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">
                        Código de verificación
                      </label>
                      <input
                        type="text"
                        id="code"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value)}
                        maxLength={4}
                        placeholder="0000"
                        required
                        className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-['Museo_Sans'] text-sm text-slate-700 text-center tracking-widest"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-11 bg-[rgb(0,123,255)] hover:bg-[#003082] text-white rounded-xl font-['Museo_Sans'] font-semibold transition-colors shadow-sm mt-6"
                    >
                      Verificar código
                    </motion.button>

                    {/* Volver */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentView('register')}
                      className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-['Museo_Sans'] text-sm font-semibold transition-colors"
                    >
                      Volver
                    </motion.button>
                  </form>
                </>
              )}

              {/* VISTA DE ÉXITO */}
              {/* VISTA DE PERFIL (campos según tipo) */}
              {currentView === 'register-profile' && (
                <>
                  <div
                    className="px-8 py-6 text-white"
                    style={{
                      background: 'linear-gradient(135deg, rgb(0,50,130), rgb(0,123,255))',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-['Museo_Sans'] font-bold">Información adicional</h2>
                      <button onClick={handleCloseModal} className="text-white/75 hover:text-white transition-colors">
                        <X size={24} />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-white/75">Completa los datos según tu perfil: {userType}</p>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="p-8 space-y-5">
                    {profileError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-['Museo_Sans']">
                        {profileError}
                      </div>
                    )}

                    {/* Estudiante */}
                    {userType === 'estudiante' && (
                      <>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Nombre</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.nombre} onChange={(e)=>handleProfileChange('nombre', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Apellido</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.apellido} onChange={(e)=>handleProfileChange('apellido', e.target.value)} />
                        </div>
                            <div>
                              <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Carrera</label>
                              <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.carrera} onChange={(e)=>handleProfileChange('carrera', e.target.value)} />
                            </div>
                            <div>
                              <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Nivel académico (número)</label>
                              <input type="number" min="0" className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.nivel_academico} onChange={(e)=>handleProfileChange('nivel_academico', e.target.value)} />
                            </div>
                      </>
                    )}

                    {/* Académico */}
                    {userType === 'academico' && (
                      <>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Nombre</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.nombre} onChange={(e)=>handleProfileChange('nombre', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Correo de contacto</label>
                          <input type="email" className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.contacto_email} onChange={(e)=>handleProfileChange('contacto_email', e.target.value)} />
                        </div>
                      </>
                    )}

                    {/* Empresario */}
                    {userType === 'empresario' && (
                      <>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Nombre de empresa</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.empresa_nombre} onChange={(e)=>handleProfileChange('empresa_nombre', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Descripción</label>
                          <textarea className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.empresa_descripcion} onChange={(e)=>handleProfileChange('empresa_descripcion', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Ubicación</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.empresa_ubicacion} onChange={(e)=>handleProfileChange('empresa_ubicacion', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Teléfono</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.empresa_contacto_telefono} onChange={(e)=>handleProfileChange('empresa_contacto_telefono', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Datos institucionales</label>
                          <textarea className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.empresa_datos_institucionales} onChange={(e)=>handleProfileChange('empresa_datos_institucionales', e.target.value)} />
                        </div>
                      </>
                    )}

                    {/* Expositor */}
                    {userType === 'mentor' && (
                      <>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Nombre</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.nombre} onChange={(e)=>handleProfileChange('nombre', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Carrera (y cursando)</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.expositor_carrera} onChange={(e)=>handleProfileChange('expositor_carrera', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Graduado o docente</label>
                          <select className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.expositor_graduado_o_docente} onChange={(e)=>handleProfileChange('expositor_graduado_o_docente', e.target.value)}>
                            <option value="">Selecciona</option>
                            <option value="graduado">Graduado</option>
                            <option value="docente">Docente</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Nivel (número)</label>
                          <input type="number" min="0" className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.expositor_nivel} onChange={(e)=>handleProfileChange('expositor_nivel', e.target.value)} />
                        </div>
                      </>
                    )}

                    {/* Organizador */}
                    {userType === 'organizador' && (
                      <>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Nombre</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.nombre} onChange={(e)=>handleProfileChange('nombre', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Tipo de docente</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.tipo_docente} onChange={(e)=>handleProfileChange('tipo_docente', e.target.value)} />
                        </div>
                      </>
                    )}

                    {/* Administrador */}
                    {userType === 'administrador' && (
                      <>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Nombre</label>
                          <input className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.nombre} onChange={(e)=>handleProfileChange('nombre', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-['Museo_Sans'] font-semibold text-slate-700 mb-2">Tipo de docente</label>
                          <select className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" value={profile.tipo_docente} onChange={(e)=>handleProfileChange('tipo_docente', e.target.value)}>
                            <option value="">Selecciona</option>
                            <option value="jefe_carrera">Jefe de carrera</option>
                            <option value="profesor">Profesor</option>
                            <option value="ayudantia">Ayudantía</option>
                          </select>
                        </div>
                      </>
                    )}

                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-11 bg-[rgb(0,123,255)] hover:bg-[#003082] text-white rounded-xl font-['Museo_Sans'] font-semibold transition-colors shadow-sm mt-6">Enviar información</motion.button>

                    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setCurrentView('register-code')} className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-['Museo_Sans'] text-sm font-semibold transition-colors">Volver</motion.button>
                  </form>
                </>
              )}

              {currentView === 'register-success' && (
                <>
                  {/* Header con gradiente */}
                  <div
                    className="px-8 py-6 text-white"
                    style={{
                      background: 'linear-gradient(135deg, rgb(0,50,130), rgb(0,123,255))',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-['Museo_Sans'] font-bold">
                        ¡Registro completado!
                      </h2>
                      <button
                        onClick={handleCloseModal}
                        className="text-white/75 hover:text-white transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Contenido de éxito */}
                  <div className="p-8 space-y-6">
                    <div className="flex justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      >
                        <CheckCircle size={64} className="text-green-500" />
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-center font-['Museo_Sans'] font-semibold text-slate-800">
                        Tu solicitud de registro ha sido enviada correctamente
                      </p>
                      <p className="text-center font-['Museo_Sans'] text-sm text-slate-600">
                        Tu postulación a registro será revisada por un administrador. Recibirás una notificación de aceptación o rechazo en el correo:
                      </p>
                      <p className="text-center font-['Museo_Sans'] font-semibold text-blue-600 break-all">
                        {registrationEmail}
                      </p>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCloseModal}
                      className="w-full h-11 bg-[rgb(0,123,255)] hover:bg-[#003082] text-white rounded-xl font-['Museo_Sans'] font-semibold transition-colors shadow-sm mt-6"
                    >
                      Cerrar
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
