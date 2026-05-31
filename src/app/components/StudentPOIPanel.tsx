import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LayoutWithNavbar } from './LayoutWithNavbar';

interface POI {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
}

export default function StudentPOIPanel() {
  const [selectedSede, setSelectedSede] = useState('Campus Limarí');
  const [currentFloor, setCurrentFloor] = useState(1);
  const [showSedeSelector, setShowSedeSelector] = useState(false);

  const sedes = ['Campus Limarí', 'Campus Andrés Bello', 'Campus Isabel Bongard'];

  const pois: POI[] = [
    { id: 1, name: 'Biblioteca Central', category: 'Académico', lat: -29.9, lng: -71.25 },
    { id: 2, name: 'Cafetería', category: 'Servicios', lat: -29.901, lng: -71.251 },
    { id: 3, name: 'Laboratorio de Informática', category: 'Académico', lat: -29.902, lng: -71.252 },
    { id: 4, name: 'Auditorio Central', category: 'Eventos', lat: -29.903, lng: -71.253 },
  ];

  return (
    <LayoutWithNavbar>
      <div className="relative h-screen w-full bg-white">
        {/* Sede Selector - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl px-6 py-3 border border-gray-200"
          >
            <button
              onClick={() => setShowSedeSelector(!showSedeSelector)}
              className="flex items-center gap-3 font-['Plus_Jakarta_Sans']"
            >
              <span className="text-gray-600 text-sm">Sede seleccionada:</span>
              <span className="font-semibold text-[#003082]">{selectedSede}</span>
              <motion.div
                animate={{ rotate: showSedeSelector ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={20} className="text-[#003082]" />
              </motion.div>
            </button>

            {showSedeSelector && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
              >
                {sedes.map((sede) => (
                  <button
                    key={sede}
                    onClick={() => {
                      setSelectedSede(sede);
                      setShowSedeSelector(false);
                    }}
                    className={`w-full px-6 py-3 text-left font-['Plus_Jakarta_Sans'] transition-colors ${
                      selectedSede === sede
                        ? 'bg-[#003082] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {sede}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Floor Selector - Bottom Right */}
        <div className="absolute right-6 bottom-12 z-10">
          <div className="mb-2 text-center">
            <span className="text-sm font-['Plus_Jakarta_Sans'] font-semibold text-gray-700">Piso</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          >
            <button
              onClick={() => setCurrentFloor(Math.min(currentFloor + 1, 5))}
              className="w-14 h-12 flex items-center justify-center hover:bg-[#003082] hover:text-white transition-colors border-b border-gray-200"
            >
              <ChevronUp size={20} />
            </button>
            <div className="w-14 h-14 flex items-center justify-center bg-white border-y border-gray-200 text-[#003082] font-['Outfit'] font-bold text-2xl">
              {currentFloor}
            </div>
            <button
              onClick={() => setCurrentFloor(Math.max(currentFloor - 1, 1))}
              className="w-14 h-12 flex items-center justify-center hover:bg-[#003082] hover:text-white transition-colors border-t border-gray-200"
            >
              <ChevronDown size={20} />
            </button>
          </motion.div>
        </div>

        {/* Map with POIs */}
        <div className="h-full w-full relative">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.8234567890123!2d-71.2519!3d-29.9027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9691ca6f1e2d1a0b%3A0x1234567890abcdef!2sUniversidad%20de%20La%20Serena!5e0!3m2!1ses!2scl!4v1234567890123!5m2!1ses!2scl`}
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa de ${selectedSede}`}
          />

          {/* POI Markers Overlay (simulated) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {pois.map((poi, index) => (
              <motion.div
                key={poi.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="absolute pointer-events-auto"
                style={{
                  left: `${index * 80 - 120}px`,
                  top: `${(index % 2) * 60 - 30}px`,
                }}
              >
                <button className="bg-[#CF142B] text-white rounded-full p-3 shadow-xl hover:scale-110 transition-transform">
                  <MapPin size={20} />
                </button>
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-lg shadow-md text-xs font-['Plus_Jakarta_Sans']">
                  {poi.name}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="font-['Plus_Jakarta_Sans'] text-gray-700 text-lg italic">
              Mapa con POI visuales interactivos<br />
              (botones) de la sede seleccionada<br />
              o predeterminada
            </p>
          </div>
        </div>

        {/* Suggest POI Button */}
        <Link to="/suggest-poi">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 left-8 bg-[#CF142B] hover:bg-[#003082] text-white px-6 py-3 rounded-full shadow-2xl font-['Plus_Jakarta_Sans'] font-semibold transition-colors flex items-center gap-2 z-20"
          >
            <MapPin size={20} />
            Sugerir POI
          </motion.button>
        </Link>
      </div>
    </LayoutWithNavbar>
  );
}
