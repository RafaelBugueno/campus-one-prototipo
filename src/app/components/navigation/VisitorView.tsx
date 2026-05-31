import { useState, useEffect, useRef } from 'react';
import { Search, List, Filter, X, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CustomSidebar } from './CustomSidebar';
import { CustomNavbar } from './CustomNavbar';

interface POI {
  id: string;
  name: string;
  category: string;
  campus: string;
  floor: number;
  position: [number, number];
  description?: string;
  externalLinks?: string[];
}

// Campus boundaries with NW, NE, SE, SW coordinates
interface CampusBounds {
  nw: [number, number];
  ne: [number, number];
  se: [number, number];
  sw: [number, number];
  center: [number, number];
}

const CAMPUS_BOUNDS: { [key: string]: CampusBounds } = {
  'Ignacio Domeyko': {
    nw: [-29.90495, -71.25170],
    ne: [-29.90490, -71.24995],
    se: [-29.90655, -71.24990],
    sw: [-29.90660, -71.25175],
    center: [-29.90575, -71.25082]
  },
  'Isabel Bongard': {
    nw: [-29.90555, -71.25285],
    ne: [-29.90545, -71.25110],
    se: [-29.90735, -71.25100],
    sw: [-29.90745, -71.25295],
    center: [-29.90640, -71.25197]
  },
  'Andrés Bello': {
    nw: [-29.91310, -71.24260],
    ne: [-29.91295, -71.23920],
    se: [-29.91560, -71.23900],
    sw: [-29.91580, -71.24280],
    center: [-29.91435, -71.24090]
  },
  'Mecánica': {
    nw: [-29.90520, -71.25115],
    ne: [-29.90515, -71.25035],
    se: [-29.90605, -71.25030],
    sw: [-29.90610, -71.25120],
    center: [-29.90562, -71.25075]
  }
};

// Helper function to generate POIs distributed within campus bounds
const generatePOIsForCampus = (
  campusName: string,
  bounds: CampusBounds,
  startId: number
): POI[] => {
  const pois: POI[] = [];
  let id = startId;

  const poiTypesByFloor = {
    1: [
      { name: 'Recepción', category: 'Servicios', description: 'Área de recepción y atención al público' },
      { name: 'Sala', category: 'Salas', description: 'Sala de clases equipada' },
      { name: 'Laboratorio', category: 'Laboratorios', description: 'Laboratorio de computación' },
      { name: 'Baño', category: 'Baños', description: 'Servicios higiénicos piso 1' },
      { name: 'Cafetería', category: 'Servicios', description: 'Área de cafetería' },
      { name: 'Biblioteca', category: 'Servicios', description: 'Sala de lectura y estudio' },
      { name: 'Auditorio', category: 'Salas', description: 'Sala de conferencias' }
    ],
    2: [
      { name: 'Sala', category: 'Salas', description: 'Sala de clases' },
      { name: 'Oficina', category: 'Oficinas', description: 'Oficina de profesores' },
      { name: 'Laboratorio', category: 'Laboratorios', description: 'Laboratorio especializado' },
      { name: 'Baño', category: 'Baños', description: 'Servicios higiénicos piso 2' },
      { name: 'Sala de Reuniones', category: 'Servicios', description: 'Sala de reuniones' },
      { name: 'Secretaría', category: 'Oficinas', description: 'Secretaría académica' }
    ],
    3: [
      { name: 'Sala', category: 'Salas', description: 'Sala de seminarios' },
      { name: 'Oficina Directiva', category: 'Oficinas', description: 'Oficinas directivas' },
      { name: 'Sala de Estudios', category: 'Servicios', description: 'Sala de estudio grupal' },
      { name: 'Baño', category: 'Baños', description: 'Servicios higiénicos piso 3' },
      { name: 'Terraza', category: 'Servicios', description: 'Área de descanso' }
    ]
  };

  // Calculate bounds for random distribution
  const minLat = Math.max(bounds.se[0], bounds.sw[0]);
  const maxLat = Math.min(bounds.nw[0], bounds.ne[0]);
  const minLng = Math.min(bounds.nw[1], bounds.sw[1]);
  const maxLng = Math.max(bounds.ne[1], bounds.se[1]);

  for (let floor = 1; floor <= 3; floor++) {
    const floorPOIs = poiTypesByFloor[floor as keyof typeof poiTypesByFloor];

    floorPOIs.forEach((poiType, index) => {
      // Distribute POIs in a grid pattern within the bounds
      const gridSize = Math.ceil(Math.sqrt(floorPOIs.length));
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;

      const latRange = maxLat - minLat;
      const lngRange = maxLng - minLng;

      // Add some randomness to avoid perfect grid
      const randomOffsetLat = (Math.random() - 0.5) * (latRange / gridSize) * 0.3;
      const randomOffsetLng = (Math.random() - 0.5) * (lngRange / gridSize) * 0.3;

      const lat = minLat + (row + 0.5) * (latRange / gridSize) + randomOffsetLat;
      const lng = minLng + (col + 0.5) * (lngRange / gridSize) + randomOffsetLng;

      pois.push({
        id: `${id}`,
        name: `${poiType.name} ${String.fromCharCode(65 + index)}`,
        category: poiType.category,
        campus: campusName,
        floor: floor,
        position: [lat, lng],
        description: `${poiType.description}`
      });
      id++;
    });
  }

  return pois;
};

const CAMPUS_COORDS: { [key: string]: [number, number] } = {
  'Ignacio Domeyko': CAMPUS_BOUNDS['Ignacio Domeyko'].center,
  'Isabel Bongard': CAMPUS_BOUNDS['Isabel Bongard'].center,
  'Andrés Bello': CAMPUS_BOUNDS['Andrés Bello'].center,
  'Mecánica': CAMPUS_BOUNDS['Mecánica'].center
};

const MOCK_POIS: POI[] = [
  ...generatePOIsForCampus('Ignacio Domeyko', CAMPUS_BOUNDS['Ignacio Domeyko'], 1),
  ...generatePOIsForCampus('Isabel Bongard', CAMPUS_BOUNDS['Isabel Bongard'], 100),
  ...generatePOIsForCampus('Andrés Bello', CAMPUS_BOUNDS['Andrés Bello'], 200),
  ...generatePOIsForCampus('Mecánica', CAMPUS_BOUNDS['Mecánica'], 300)
];

const CAMPUSES = ['Ignacio Domeyko', 'Isabel Bongard', 'Andrés Bello', 'Mecánica'];
const CATEGORIES = ['Salas', 'Laboratorios', 'Servicios', 'Oficinas', 'Baños'];

const CATEGORY_COLORS: { [key: string]: string } = {
  'Salas': '#3B82F6',
  'Laboratorios': '#10B981',
  'Servicios': '#F59E0B',
  'Oficinas': '#8B5CF6',
  'Baños': '#EC4899'
};

interface VisitorViewProps {
  onGoHome?: () => void;
}

export default function VisitorView({ onGoHome }: VisitorViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const rectanglesRef = useRef<L.Rectangle[]>([]);

  const [selectedCampus, setSelectedCampus] = useState('Ignacio Domeyko');
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showCampusSelector, setShowCampusSelector] = useState(false);
  const [showPOIPanel, setShowPOIPanel] = useState(false);
  const [poiPanelView, setPOIPanelView] = useState<'main' | 'filter' | 'search' | 'list'>('main');
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [infoError, setInfoError] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isDraggingFloor, setIsDraggingFloor] = useState(false);
  const floorSliderRef = useRef<HTMLDivElement>(null);

  const filteredPOIs = MOCK_POIS.filter(
    poi => poi.campus === selectedCampus && poi.floor === selectedFloor
  );

  const searchResults = MOCK_POIS.filter(poi =>
    poi.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    poi.campus === selectedCampus
  );

  const filteredByCategory = selectedCategories.length > 0
    ? MOCK_POIS.filter(poi => selectedCategories.includes(poi.category) && poi.campus === selectedCampus)
    : MOCK_POIS.filter(poi => poi.campus === selectedCampus);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePOIClick = (poi: POI) => {
    const hasError = Math.random() > 0.8;
    setInfoError(hasError);
    setDetailError(hasError);
    setSelectedPOI(poi);
    setShowPOIPanel(false);
  };

  const handleFloorSliderInteraction = (clientY: number) => {
    if (!floorSliderRef.current) return;

    const rect = floorSliderRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, y / rect.height));

    // Map percentage to floor (1-3, inverted because top = floor 3)
    const floor = Math.round(3 - percentage * 2);
    setSelectedFloor(Math.max(1, Math.min(3, floor)));
  };

  const handleFloorTouchStart = (e: React.TouchEvent) => {
    setIsDraggingFloor(true);
    handleFloorSliderInteraction(e.touches[0].clientY);
  };

  const handleFloorTouchMove = (e: React.TouchEvent) => {
    if (isDraggingFloor) {
      handleFloorSliderInteraction(e.touches[0].clientY);
    }
  };

  const handleFloorTouchEnd = () => {
    setIsDraggingFloor(false);
  };

  const handleFloorMouseDown = (e: React.MouseEvent) => {
    setIsDraggingFloor(true);
    handleFloorSliderInteraction(e.clientY);
  };

  const handleFloorMouseMove = (e: MouseEvent) => {
    if (isDraggingFloor) {
      handleFloorSliderInteraction(e.clientY);
    }
  };

  const handleFloorMouseUp = () => {
    setIsDraggingFloor(false);
  };

  useEffect(() => {
    if (isDraggingFloor) {
      document.addEventListener('mousemove', handleFloorMouseMove);
      document.addEventListener('mouseup', handleFloorMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleFloorMouseMove);
        document.removeEventListener('mouseup', handleFloorMouseUp);
      };
    }
  }, [isDraggingFloor]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      const map = L.map(mapRef.current, {
        center: CAMPUS_COORDS['Ignacio Domeyko'],
        zoom: 17,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map).on('tileerror', () => {
        setMapError(true);
      });

      mapInstanceRef.current = map;
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center when campus changes
  useEffect(() => {
    if (mapInstanceRef.current && CAMPUS_COORDS[selectedCampus]) {
      mapInstanceRef.current.setView(CAMPUS_COORDS[selectedCampus], 17);
    }
  }, [selectedCampus]);

  // Update markers when filtered POIs change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    rectanglesRef.current.forEach(rect => rect.remove());
    rectanglesRef.current = [];

    filteredPOIs.forEach(poi => {
      const color = CATEGORY_COLORS[poi.category] || '#6B7280';

      const circle = L.circleMarker(poi.position, {
        radius: 8,
        color: '#ffffff',
        fillColor: color,
        fillOpacity: 0.9,
        weight: 2
      })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`<div style="color: ${color};"><strong>${poi.name}</strong><br/>${poi.category}</div>`)
        .on('click', () => handlePOIClick(poi));

      rectanglesRef.current.push(circle);
    });
  }, [filteredPOIs, selectedFloor]);

  const getFloorPosition = () => {
    // Floor 1 at bottom (100%), Floor 2 at middle (50%), Floor 3 at top (0%)
    const percentage = (3 - selectedFloor) / 2;
    return percentage * 100;
  };

  const handleToggleSidebar = () => {
    window.dispatchEvent(new Event('toggle-sidebar'));
  };

  return (
    <div className="size-full relative">
      {/* Overlay oscuro */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-[1550]"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <CustomSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        onLogoClick={onGoHome}
      />

      {/* Main Content */}
      <div className="size-full">
        {/* Navbar */}
        <CustomNavbar
          collapsed={sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          selectedCampus={selectedCampus}
          campuses={CAMPUSES}
          showCampusSelector={showCampusSelector}
          onToggleCampusSelector={() => setShowCampusSelector(!showCampusSelector)}
          onSelectCampus={(campus) => {
            setSelectedCampus(campus);
            setShowCampusSelector(false);
          }}
        />

        {/* Map Container */}
        <div className="relative h-screen pt-16">

      {/* Floor Slider */}
      <div className="absolute top-1/4 right-6 h-1/2 z-[1000] flex flex-col items-center">
        {/* Label */}
        <span className="text-[rgb(0,50,130)] text-xs mb-2">Piso</span>

        <div
          ref={floorSliderRef}
          className="flex items-center flex-1"
          onTouchStart={handleFloorTouchStart}
          onTouchMove={handleFloorTouchMove}
          onTouchEnd={handleFloorTouchEnd}
          onMouseDown={handleFloorMouseDown}
        >
          {/* Vertical Line */}
          <div className="relative w-1 h-full bg-slate-300 rounded-full">
            {/* Active portion */}
            <div
              className="absolute bottom-0 w-full bg-[rgb(0,50,130)] rounded-full transition-all duration-150"
              style={{ height: `${(selectedFloor / 3) * 100}%` }}
            />

            {/* Floor indicator circle */}
            <div
              className="absolute w-10 h-10 bg-[#C8102E] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-semibold transition-all duration-150"
              style={{
                top: `${getFloorPosition()}%`,
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <span className="text-sm">{selectedFloor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* POI Panel Button - Circular */}
      {!showPOIPanel && !selectedPOI && (
        <button
          onClick={() => {
            setShowPOIPanel(true);
            setPOIPanelView('main');
          }}
          className="absolute bottom-8 right-8 z-[1000] bg-[#C8102E] text-white w-16 h-16 rounded-full shadow-lg hover:bg-[#9a0c24] transition-colors flex flex-col items-center justify-center"
          title="Panel de POI"
        >
          <MapPin className="w-7 h-7" />
        </button>
      )}

      {/* POI Panel */}
      {showPOIPanel && (
        <div className="absolute bottom-8 right-4 left-4 z-[1000] bg-white rounded-lg shadow-xl border border-slate-200 shadow-[0_4px_4px_rgba(0,0,0,0.28)] max-w-md mx-auto">
          {poiPanelView === 'main' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl text-[rgb(0,50,130)]">Panel de POI</h3>
                <button onClick={() => setShowPOIPanel(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setPOIPanelView('filter')}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 text-left"
                >
                  <Filter className="w-5 h-5 text-[rgb(0,50,130)]" />
                  <div>
                    <div className="text-[rgb(0,50,130)]">Filtro de POI</div>
                    <div className="text-sm text-slate-500">por categoría</div>
                  </div>
                </button>
                <button
                  onClick={() => setPOIPanelView('search')}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 text-left"
                >
                  <Search className="w-5 h-5 text-[rgb(0,50,130)]" />
                  <div>
                    <div className="text-[rgb(0,50,130)]">Buscador de POI</div>
                    <div className="text-sm text-slate-500">con sugerencias en tiempo real</div>
                  </div>
                </button>
                <button
                  onClick={() => setPOIPanelView('list')}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 text-left"
                >
                  <List className="w-5 h-5 text-[rgb(0,50,130)]" />
                  <div className="text-[rgb(0,50,130)]">Listado de POI</div>
                </button>
              </div>
            </div>
          )}

          {poiPanelView === 'filter' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-[rgb(0,50,130)]">Filtrar por Categoría</h3>
                <button onClick={() => setPOIPanelView('main')}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {CATEGORIES.map(category => (
                  <label
                    key={category}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-[#C8102E] rounded focus:ring-[#C8102E]"
                    />
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded flex-shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[category] }}
                      />
                      <span className="text-[rgb(0,50,130)] text-sm truncate">{category}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPOIPanelView('list');
                  }}
                  className="flex-1 px-4 py-2 bg-[rgb(0,50,130)] text-white rounded-lg hover:bg-[rgb(0,40,110)]"
                >
                  Ver resultados
                </button>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                >
                  Limpiar
                </button>
              </div>
            </div>
          )}

          {poiPanelView === 'search' && (
            <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[1001] mx-auto max-w-md">
              <div className="bg-white rounded-lg shadow-xl border border-slate-200 shadow-[0_4px_4px_rgba(0,0,0,0.28)] max-h-[70vh] flex flex-col">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl text-[rgb(0,50,130)]">Buscar POI</h3>
                    <button onClick={() => setPOIPanelView('main')}>
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar punto de interés..."
                    className="w-full px-4 py-3 border border-slate-200 shadow-[0_4px_4px_rgba(0,0,0,0.28)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {searchQuery && searchResults.length === 0 && (
                    <p className="text-slate-500 text-center py-4">
                      No se encontraron POIs con ese nombre
                    </p>
                  )}
                  {searchQuery && searchResults.map(poi => (
                    <button
                      key={poi.id}
                      onClick={() => handlePOIClick(poi)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-100 rounded-lg border-b border-slate-200 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: CATEGORY_COLORS[poi.category] }}
                        />
                        <span className="text-[rgb(0,50,130)]">{poi.name}</span>
                      </div>
                      <div className="text-sm text-slate-500 ml-5">{poi.category} - Piso {poi.floor}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {poiPanelView === 'list' && (
            <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[1001] mx-auto max-w-md">
              <div className="bg-white rounded-lg shadow-xl border border-slate-200 shadow-[0_4px_4px_rgba(0,0,0,0.28)] max-h-[70vh] flex flex-col">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl text-[rgb(0,50,130)]">
                      {selectedCategories.length > 0 ? 'POI Filtrados' : 'Todos los POI'}
                    </h3>
                    <button onClick={() => {
                      setPOIPanelView('main');
                      setSelectedCategories([]);
                    }}>
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCategories.map(cat => (
                        <span
                          key={cat}
                          className="px-2 py-1 text-xs rounded-full text-white"
                          style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {filteredByCategory.map(poi => (
                    <button
                      key={poi.id}
                      onClick={() => handlePOIClick(poi)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-100 rounded-lg border-b border-slate-200 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: CATEGORY_COLORS[poi.category] }}
                        />
                        <span className="text-[rgb(0,50,130)]">{poi.name}</span>
                      </div>
                      <div className="text-sm text-slate-500 ml-5">{poi.category} - Piso {poi.floor}</div>
                    </button>
                  ))}
                  {filteredByCategory.length === 0 && (
                    <p className="text-slate-500 text-center py-8">
                      No hay POI en esta categoría
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected POI Info Panels */}
      {selectedPOI && (
        <>
          {/* Info Panel */}
          <div className="absolute top-20 left-4 right-4 z-[1000] bg-white rounded-lg shadow-xl border border-slate-200 shadow-[0_4px_4px_rgba(0,0,0,0.28)] max-w-md mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[rgb(0,50,130)]">Panel informativo</h3>
              <button onClick={() => setSelectedPOI(null)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            {infoError ? (
              <p className="text-[#C8102E] text-sm">
                Error al recuperar la información. Por favor, intente más tarde.
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Nombre:</span>{' '}
                  <span className="text-[rgb(0,50,130)]">{selectedPOI.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Categoría:</span>{' '}
                  <span className="text-[rgb(0,50,130)]">{selectedPOI.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sede:</span>{' '}
                  <span className="text-[rgb(0,50,130)]">{selectedPOI.campus}</span>
                </div>
                <div>
                  <span className="text-gray-600">Piso:</span>{' '}
                  <span className="text-[rgb(0,50,130)]">{selectedPOI.floor}</span>
                </div>
                {selectedPOI.description && (
                  <div>
                    <span className="text-gray-600">Descripción:</span>{' '}
                    <span className="text-[rgb(0,50,130)]">{selectedPOI.description}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white rounded-lg shadow-xl border border-slate-200 shadow-[0_4px_4px_rgba(0,0,0,0.28)] max-w-md mx-auto p-4">
            <h3 className="text-lg text-[rgb(0,50,130)] mb-4">Panel de detalle</h3>
            {detailError ? (
              <p className="text-[#C8102E] text-sm">
                Error al recuperar los detalles. Por favor, intente más tarde.
              </p>
            ) : (
              <div>
                <h4 className="text-sm text-gray-600 mb-2">Enlaces externos:</h4>
                {selectedPOI.externalLinks && selectedPOI.externalLinks.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPOI.externalLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[#C8102E] hover:underline text-sm"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No hay enlaces disponibles</p>
                )}
              </div>
            )}
          </div>
        </>
      )}

          {/* Map */}
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-0">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
                <p className="text-[#C8102E] text-center">
                  No se pudo cargar el mapa. Verifica tu conexión a internet.
                </p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="size-full z-0" />
        </div>
      </div>
    </div>
  );
}
