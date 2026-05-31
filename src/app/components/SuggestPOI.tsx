import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutWithNavbar } from './LayoutWithNavbar';

export default function SuggestPOI() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sede: '',
    floor: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'Académico',
    'Servicios',
    'Eventos',
    'Deportes',
    'Cafetería/Comida',
    'Biblioteca',
    'Administrativo',
  ];

  const sedes = ['Campus Limarí', 'Campus Andrés Bello', 'Campus Isabel Bongard'];

  const floors = ['Piso 1', 'Piso 2', 'Piso 3', 'Piso 4', 'Piso 5'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: string[] = [];
    if (!formData.name) newErrors.push('nombre');
    if (!formData.category) newErrors.push('categoría');
    if (!formData.sede) newErrors.push('sede');
    if (!formData.floor) newErrors.push('piso');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    setShowSuccess(true);

    setTimeout(() => {
      navigate('/student-map');
    }, 2000);
  };

  return (
    <LayoutWithNavbar>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        {/* Back Button */}
        <Link to="/student-map">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed top-20 left-6 bg-white text-[#003082] p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-30"
          >
            <ArrowLeft size={24} />
          </motion.button>
        </Link>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-['Outfit'] font-bold text-[#003082] mb-2">
                Sugerir Punto de Interés
              </h1>
              <p className="text-gray-600 font-['Plus_Jakarta_Sans'] text-sm">
                Ayúdanos a mejorar nuestro mapa colaborativo
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-['Plus_Jakarta_Sans'] font-semibold text-gray-700 mb-2"
                >
                  Nombre del lugar
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all font-['Plus_Jakarta_Sans'] ${
                    errors.includes('nombre')
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-[#003082]'
                  }`}
                  placeholder="Ej: Biblioteca Central"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-['Plus_Jakarta_Sans'] font-semibold text-gray-700 mb-2"
                >
                  Categoría
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all font-['Plus_Jakarta_Sans'] ${
                    errors.includes('categoría')
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-[#003082]'
                  }`}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sede Dropdown */}
              <div>
                <label
                  htmlFor="sede"
                  className="block text-sm font-['Plus_Jakarta_Sans'] font-semibold text-gray-700 mb-2"
                >
                  Sede
                </label>
                <select
                  id="sede"
                  value={formData.sede}
                  onChange={(e) => setFormData({ ...formData, sede: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all font-['Plus_Jakarta_Sans'] ${
                    errors.includes('sede')
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-[#003082]'
                  }`}
                >
                  <option value="">Seleccionar sede</option>
                  {sedes.map((sede) => (
                    <option key={sede} value={sede}>
                      {sede}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor Dropdown */}
              <div>
                <label
                  htmlFor="floor"
                  className="block text-sm font-['Plus_Jakarta_Sans'] font-semibold text-gray-700 mb-2"
                >
                  Piso
                </label>
                <select
                  id="floor"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all font-['Plus_Jakarta_Sans'] ${
                    errors.includes('piso')
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-[#003082]'
                  }`}
                >
                  <option value="">Seleccionar piso</option>
                  {floors.map((floor) => (
                    <option key={floor} value={floor}>
                      {floor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {errors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-semibold text-red-700 text-sm">
                        Si no se llenó un campo obligatorio, se indica y no se lleva a cabo la
                        sugerencia del POI
                      </p>
                      <p className="font-['Plus_Jakarta_Sans'] text-red-600 text-xs mt-1">
                        Campos faltantes: {errors.join(', ')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-[#003082] hover:bg-[#CF142B] text-white rounded-xl font-['Plus_Jakarta_Sans'] font-bold text-lg transition-colors shadow-lg mt-6"
              >
                Confirmar Sugerencia
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Success Message Modal */}
        <AnimatePresence>
          {showSuccess && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-full max-w-md mx-4"
              >
                <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="text-green-600" size={40} />
                  </motion.div>
                  <h2 className="text-2xl font-['Outfit'] font-bold text-gray-800 mb-3">
                    ¡Sugerencia enviada!
                  </h2>
                  <p className="font-['Plus_Jakarta_Sans'] text-gray-600">
                    Mensaje de éxito en la sugerencia de POI
                  </p>
                  <p className="font-['Plus_Jakarta_Sans'] text-sm text-gray-500 mt-2">
                    Nuestra sede será notificada y revisará tu solicitud
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </LayoutWithNavbar>
  );
}
