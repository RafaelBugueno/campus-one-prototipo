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

// Helper function to generate POIs in a grid pattern without overlapping
const generatePOIsForCampus = (
  campusName: string,
  centerLat: number,
  centerLng: number,
  startId: number
): POI[] => {
  const pois: POI[] = [];
  let id = startId;
  const spacing = 0.00015; // Spacing between POIs to avoid overlap

  // Define POI types for each floor
  const poiTypes = [
    { name: 'Sala', category: 'Salas', description: 'Sala de clases equipada' },
    { name: 'Laboratorio', category: 'Laboratorios', description: 'Laboratorio especializado' },
    { name: 'Oficina', category: 'Oficinas', description: 'Oficina administrativa' },
    { name: 'Baño', category: 'Baños', description: 'Servicios higiénicos' },
    { name: 'Sala de Estudio', category: 'Servicios', description: 'Espacio de estudio' }
  ];

  // Generate 5 POIs per floor (3 floors = 15 POIs per campus)
  for (let floor = 1; floor <= 3; floor++) {
    for (let i = 0; i < 5; i++) {
      const poiType = poiTypes[i % poiTypes.length];
      const offsetLat = ((i % 3) - 1) * spacing;
      const offsetLng = (Math.floor(i / 3) - 0.5) * spacing;

      pois.push({
        id: `${id}`,
        name: `${poiType.name} ${String.fromCharCode(65 + i)} - Piso ${floor}`,
        category: poiType.category,
        campus: campusName,
        floor: floor,
        position: [centerLat + offsetLat, centerLng + offsetLng],
        description: `${poiType.description} en el piso ${floor}`
      });
      id++;
    }
  }

  return pois;
};

// Campus coordinates based on real locations
const CAMPUS_COORDS: { [key: string]: [number, number] } = {
  'Ignacio Domeyko': [-29.90896, -71.24613], // Benavente 980
  'Isabel Bongard': [-29.9027, -71.2519],    // Amunátegui 851
  'Andrés Bello': [-29.913, -71.242],        // Raúl Bitrán 1305
  'Mecánica': [-29.9095, -71.2470]           // Área de Mecánica (cerca de Ignacio Domeyko)
};

// Generate all POIs
const MOCK_POIS: POI[] = [
  ...generatePOIsForCampus('Ignacio Domeyko', CAMPUS_COORDS['Ignacio Domeyko'][0], CAMPUS_COORDS['Ignacio Domeyko'][1], 1),
  ...generatePOIsForCampus('Isabel Bongard', CAMPUS_COORDS['Isabel Bongard'][0], CAMPUS_COORDS['Isabel Bongard'][1], 16),
  ...generatePOIsForCampus('Andrés Bello', CAMPUS_COORDS['Andrés Bello'][0], CAMPUS_COORDS['Andrés Bello'][1], 31),
  ...generatePOIsForCampus('Mecánica', CAMPUS_COORDS['Mecánica'][0], CAMPUS_COORDS['Mecánica'][1], 46)
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

export default function VisitorView() {
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  // Update rectangles when filtered POIs change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    rectanglesRef.current.forEach(rect => rect.remove());
    rectanglesRef.current = [];

    filteredPOIs.forEach(poi => {
      const size = 0.00008; // Smaller size to avoid overlap
      const bounds: L.LatLngBoundsExpression = [
        [poi.position[0] - size, poi.position[1] - size],
        [poi.position[0] + size, poi.position[1] + size]
      ];

      const color = CATEGORY_COLORS[poi.category] || '#6B7280';

      const rectangle = L.rectangle(bounds, {
        color: color,
        fillColor: color,
        fillOpacity: 0.6,
        weight: 2
      })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`<div style="color: ${color};"><strong>${poi.name}</strong><br/>${poi.category}</div>`)
        .on('click', () => handlePOIClick(poi));

      rectanglesRef.current.push(rectangle);
    });
  }, [filteredPOIs]);

  const getFloorPosition = () => {
    // Calculate position of the circle based on floor (inverted: top = 3, bottom = 1)
    const percentage = (3 - selectedFloor) / 2;
    return percentage * 100;
  };

  const handleToggleSidebar = () => {
    window.dispatchEvent(new Event('toggle-sidebar'));
  };

  return (
    <div className="size-full relative flex">
      {/* Sidebar */}
      <CustomSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-12' : 'ml-64'
        }`}
      >
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
        <span className="text-[#003082] text-xs mb-2">Piso</span>

        <div
          ref={floorSliderRef}
          className="flex items-center flex-1"
          onTouchStart={handleFloorTouchStart}
          onTouchMove={handleFloorTouchMove}
          onTouchEnd={handleFloorTouchEnd}
          onMouseDown={handleFloorMouseDown}
        >
          {/* Vertical Line */}
          <div className="relative w-1 h-full bg-gray-300 rounded-full">
            {/* Active portion */}
            <div
              className="absolute bottom-0 w-full bg-[#003082] rounded-full transition-all duration-150"
              style={{ height: `${(selectedFloor / 3) * 100}%` }}
            />

            {/* Draggable Circle - Only shown when dragging */}
            {isDraggingFloor && (
              <div
                className="absolute w-10 h-10 bg-[#CF142B] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white"
                style={{
                  top: `${getFloorPosition()}%`,
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <span className="text-sm">{selectedFloor}</span>
              </div>
            )}
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
          className="absolute bottom-8 right-8 z-[1000] bg-[#CF142B] text-white w-16 h-16 rounded-full shadow-lg hover:bg-[#a50f22] transition-colors flex flex-col items-center justify-center"
          title="Panel de POI"
        >
          <MapPin className="w-7 h-7" />
        </button>
      )}

      {/* POI Panel */}
      {showPOIPanel && (
        <div className="absolute bottom-8 right-4 left-4 z-[1000] bg-white rounded-lg shadow-xl border-2 border-[#003082] max-w-md mx-auto">
          {poiPanelView === 'main' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl text-[#003082]">Panel de POI</h3>
                <button onClick={() => setShowPOIPanel(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setPOIPanelView('filter')}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
                >
                  <Filter className="w-5 h-5 text-[#003082]" />
                  <div>
                    <div className="text-[#003082]">Filtro de POI</div>
                    <div className="text-sm text-gray-500">por categoría</div>
                  </div>
                </button>
                <button
                  onClick={() => setPOIPanelView('search')}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
                >
                  <Search className="w-5 h-5 text-[#003082]" />
                  <div>
                    <div className="text-[#003082]">Buscador de POI</div>
                    <div className="text-sm text-gray-500">con sugerencias en tiempo real</div>
                  </div>
                </button>
                <button
                  onClick={() => setPOIPanelView('list')}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
                >
                  <List className="w-5 h-5 text-[#003082]" />
                  <div className="text-[#003082]">Listado de POI</div>
                </button>
              </div>
            </div>
          )}

          {poiPanelView === 'filter' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-[#003082]">Filtrar por Categoría</h3>
                <button onClick={() => setPOIPanelView('main')}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {CATEGORIES.map(category => (
                  <label
                    key={category}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-[#CF142B] rounded focus:ring-[#CF142B]"
                    />
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded flex-shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[category] }}
                      />
                      <span className="text-[#003082] text-sm truncate">{category}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPOIPanelView('list');
                  }}
                  className="flex-1 px-4 py-2 bg-[#003082] text-white rounded-lg hover:bg-[#002060]"
                >
                  Ver resultados
                </button>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Limpiar
                </button>
              </div>
            </div>
          )}

          {poiPanelView === 'search' && (
            <div className="fixed inset-x-4 top-24 z-[1001] mx-auto max-w-md">
              <div className="bg-white rounded-lg shadow-xl border-2 border-[#003082] max-h-[70vh] flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl text-[#003082]">Buscar POI</h3>
                    <button onClick={() => setPOIPanelView('main')}>
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar punto de interés..."
                    className="w-full px-4 py-3 border-2 border-[#003082] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF142B]"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {searchQuery && searchResults.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No se encontraron POIs con ese nombre
                    </p>
                  )}
                  {searchQuery && searchResults.map(poi => (
                    <button
                      key={poi.id}
                      onClick={() => handlePOIClick(poi)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: CATEGORY_COLORS[poi.category] }}
                        />
                        <span className="text-[#003082]">{poi.name}</span>
                      </div>
                      <div className="text-sm text-gray-500 ml-5">{poi.category} - Piso {poi.floor}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {poiPanelView === 'list' && (
            <div className="fixed inset-x-4 top-24 z-[1001] mx-auto max-w-md">
              <div className="bg-white rounded-lg shadow-xl border-2 border-[#003082] max-h-[70vh] flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl text-[#003082]">
                      {selectedCategories.length > 0 ? 'POI Filtrados' : 'Todos los POI'}
                    </h3>
                    <button onClick={() => {
                      setPOIPanelView('main');
                      setSelectedCategories([]);
                    }}>
                      <X className="w-5 h-5 text-gray-500" />
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
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: CATEGORY_COLORS[poi.category] }}
                        />
                        <span className="text-[#003082]">{poi.name}</span>
                      </div>
                      <div className="text-sm text-gray-500 ml-5">{poi.category} - Piso {poi.floor}</div>
                    </button>
                  ))}
                  {filteredByCategory.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
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
          <div className="absolute top-20 left-4 right-4 z-[1000] bg-white rounded-lg shadow-xl border-2 border-[#003082] max-w-md mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-[#003082]">Panel informativo</h3>
              <button onClick={() => setSelectedPOI(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {infoError ? (
              <p className="text-[#CF142B] text-sm">
                Error al recuperar la información. Por favor, intente más tarde.
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Nombre:</span>{' '}
                  <span className="text-[#003082]">{selectedPOI.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Categoría:</span>{' '}
                  <span className="text-[#003082]">{selectedPOI.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sede:</span>{' '}
                  <span className="text-[#003082]">{selectedPOI.campus}</span>
                </div>
                <div>
                  <span className="text-gray-600">Piso:</span>{' '}
                  <span className="text-[#003082]">{selectedPOI.floor}</span>
                </div>
                {selectedPOI.description && (
                  <div>
                    <span className="text-gray-600">Descripción:</span>{' '}
                    <span className="text-[#003082]">{selectedPOI.description}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="absolute bottom-24 left-4 right-4 z-[1000] bg-white rounded-lg shadow-xl border-2 border-[#003082] max-w-md mx-auto p-4">
            <h3 className="text-lg text-[#003082] mb-4">Panel de detalle</h3>
            {detailError ? (
              <p className="text-[#CF142B] text-sm">
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
                        className="block text-[#CF142B] hover:underline text-sm"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hay enlaces disponibles</p>
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
                <p className="text-[#CF142B] text-center">
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
