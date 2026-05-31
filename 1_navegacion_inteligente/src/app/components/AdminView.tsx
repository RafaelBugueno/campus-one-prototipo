import { useState, useEffect, useRef } from 'react';
import { Search, List, Filter, X, MapPin, LayoutGrid } from 'lucide-react';
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

const generatePOIsForCampus = (
  campusName: string,
  centerLat: number,
  centerLng: number,
  startId: number
): POI[] => {
  const pois: POI[] = [];
  let id = startId;
  const spacing = 0.00015;

  const poiTypes = [
    { name: 'Sala', category: 'Salas', description: 'Sala de clases equipada' },
    { name: 'Laboratorio', category: 'Laboratorios', description: 'Laboratorio especializado' },
    { name: 'Oficina', category: 'Oficinas', description: 'Oficina administrativa' },
    { name: 'Baño', category: 'Baños', description: 'Servicios higiénicos' },
    { name: 'Sala de Estudio', category: 'Servicios', description: 'Espacio de estudio' }
  ];

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

const CAMPUS_COORDS: { [key: string]: [number, number] } = {
  'Ignacio Domeyko': [-29.90896, -71.24613],
  'Isabel Bongard': [-29.9027, -71.2519],
  'Andrés Bello': [-29.913, -71.242],
  'Mecánica': [-29.9095, -71.2470]
};

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

const MODULES = ['Académico', 'Infraestructura', 'Servicios'];
const MODULE_INFO: { [key: string]: string[] } = {
  'Académico': ['Horarios', 'Profesores', 'Programas'],
  'Infraestructura': ['Planos', 'Capacidad', 'Equipamiento'],
  'Servicios': ['Contacto', 'Horarios de atención', 'Requisitos']
};

interface AdminViewProps {
  onGoHome?: () => void;
}

const validateCoordinates = (lat: number, lng: number, campus: string): boolean => {
  const campusCoords = CAMPUS_COORDS[campus];
  if (!campusCoords) return false;

  const threshold = 0.005;
  const latDiff = Math.abs(lat - campusCoords[0]);
  const lngDiff = Math.abs(lng - campusCoords[1]);

  return latDiff < threshold && lngDiff < threshold;
};

export default function AdminView({ onGoHome }: AdminViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const rectanglesRef = useRef<L.Rectangle[]>([]);

  const [selectedCampus, setSelectedCampus] = useState('Ignacio Domeyko');
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showCampusSelector, setShowCampusSelector] = useState(false);
  const [showPOIPanel, setShowPOIPanel] = useState(false);
  const [showManagePanel, setShowManagePanel] = useState(false);
  const [poiPanelView, setPOIPanelView] = useState<'main' | 'filter' | 'search' | 'list'>('main');
  const [manageView, setManageView] = useState<'main' | 'create' | 'edit' | 'delete' | 'edit-form' | 'create-form'>('main');
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [infoError, setInfoError] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDraggingFloor, setIsDraggingFloor] = useState(false);
  const floorSliderRef = useRef<HTMLDivElement>(null);

  // POI management form state
  const [selectedPOIForEdit, setSelectedPOIForEdit] = useState('');
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editCoordinates, setEditCoordinates] = useState('');
  const [editCampus, setEditCampus] = useState('');
  const [editFloor, setEditFloor] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [coordError, setCoordError] = useState(false);
  const [showExternalLinkPanel, setShowExternalLinkPanel] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedModuleInfo, setSelectedModuleInfo] = useState('');

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

  const handleEditPOISelect = () => {
    if (!selectedPOIForEdit) {
      setShowErrors(true);
      return;
    }

    const poi = MOCK_POIS.find(p => p.id === selectedPOIForEdit);
    if (poi) {
      setEditName(poi.name);
      setEditCategory(poi.category);
      setEditCoordinates(`${poi.position[0]}, ${poi.position[1]}`);
      setEditCampus(poi.campus);
      setEditFloor(poi.floor.toString());
      setManageView('edit-form');
      setShowErrors(false);
    }
  };

  const handleCreatePOI = () => {
    setEditName('');
    setEditCategory('');
    setEditCoordinates('');
    setEditCampus('');
    setEditFloor('');
    setManageView('create-form');
    setShowErrors(false);
  };

  const handleSavePOI = () => {
    if (!editName || !editCategory || !editCoordinates || !editCampus || !editFloor) {
      setShowErrors(true);
      return;
    }

    const coords = editCoordinates.split(',').map(c => parseFloat(c.trim()));
    if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
      setShowErrors(true);
      return;
    }

    if (!validateCoordinates(coords[0], coords[1], editCampus)) {
      setCoordError(true);
      return;
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowManagePanel(false);
      setManageView('main');
      setCoordError(false);
      setShowErrors(false);
    }, 2000);
  };

  const handleDeletePOI = () => {
    if (!selectedPOIForEdit) {
      setShowErrors(true);
      return;
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowManagePanel(false);
      setManageView('main');
      setSelectedPOIForEdit('');
      setShowErrors(false);
    }, 2000);
  };

  const handleExternalLinkConfirm = () => {
    if (!selectedModule || !selectedModuleInfo) {
      return;
    }
    setShowExternalLinkPanel(false);
    setSelectedModule('');
    setSelectedModuleInfo('');
  };

  const handleFloorSliderInteraction = (clientY: number) => {
    if (!floorSliderRef.current) return;
    const rect = floorSliderRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, y / rect.height));
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

  useEffect(() => {
    if (mapInstanceRef.current && CAMPUS_COORDS[selectedCampus]) {
      mapInstanceRef.current.setView(CAMPUS_COORDS[selectedCampus], 17);
    }
  }, [selectedCampus]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    rectanglesRef.current.forEach(rect => rect.remove());
    rectanglesRef.current = [];

    filteredPOIs.forEach(poi => {
      const size = 0.00008;
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
    const percentage = (3 - selectedFloor) / 2;
    return percentage * 100;
  };

  const handleToggleSidebar = () => {
    window.dispatchEvent(new Event('toggle-sidebar'));
  };

  return (
    <div className="size-full relative flex">
      <CustomSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        onLogoClick={onGoHome}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-12' : 'ml-64'
        }`}
      >
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

        <div className="relative h-screen pt-16">

      <div className="absolute top-1/4 right-6 h-1/2 z-[1000] flex flex-col items-center">
        <span className="text-[#003082] text-xs mb-2">Piso</span>

        <div
          ref={floorSliderRef}
          className="flex items-center flex-1"
          onTouchStart={handleFloorTouchStart}
          onTouchMove={handleFloorTouchMove}
          onTouchEnd={handleFloorTouchEnd}
          onMouseDown={handleFloorMouseDown}
        >
          <div className="relative w-1 h-full bg-gray-300 rounded-full">
            <div
              className="absolute bottom-0 w-full bg-[#003082] rounded-full transition-all duration-150"
              style={{ height: `${(selectedFloor / 3) * 100}%` }}
            />

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

      {!showPOIPanel && !showManagePanel && !selectedPOI && (
        <div className="absolute bottom-8 right-8 z-[1000] flex flex-col gap-4">
          <button
            onClick={() => {
              setShowPOIPanel(true);
              setPOIPanelView('main');
            }}
            className="bg-[#CF142B] text-white w-16 h-16 rounded-full shadow-lg hover:bg-[#a50f22] transition-colors flex items-center justify-center"
            title="Panel de POI"
          >
            <MapPin className="w-7 h-7" />
          </button>

          <button
            onClick={() => {
              setShowManagePanel(true);
              setManageView('main');
            }}
            className="bg-[#CF142B] text-white w-16 h-16 rounded-full shadow-lg hover:bg-[#a50f22] transition-colors flex items-center justify-center"
            title="Gestión de POI"
          >
            <LayoutGrid className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* POI Panel (same as Student/Visitor) */}
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
                  onClick={() => setPOIPanelView('list')}
                  className="flex-1 px-4 py-2 bg-[#003082] text-white rounded-lg hover:bg-[#002060]"
                >
                  Ver resultados
                </button>
                <button
                  onClick={() => setSelectedCategories([])}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Limpiar
                </button>
              </div>
            </div>
          )}

          {poiPanelView === 'search' && (
            <div className={`fixed top-24 z-[1001] max-w-md ${
              sidebarCollapsed ? 'left-[calc(48px+1rem)]' : 'left-[calc(256px+1rem)]'
            } right-4`}>
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
            <div className={`fixed top-24 z-[1001] max-w-md ${
              sidebarCollapsed ? 'left-[calc(48px+1rem)]' : 'left-[calc(256px+1rem)]'
            } right-4`}>
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

      {/* Management Panel */}
      {showManagePanel && (
        <div className={`fixed top-24 z-[1001] max-w-md ${
          sidebarCollapsed ? 'left-[calc(48px+1rem)]' : 'left-[calc(256px+1rem)]'
        } right-4`}>
          <div className="bg-white rounded-lg shadow-xl border-2 border-[#003082] p-6">
            {manageView === 'main' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl text-[#003082]">Gestión de POI</h3>
                  <button onClick={() => setShowManagePanel(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleCreatePOI}
                    className="px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 text-[#003082] border-2 border-gray-300"
                  >
                    Crear POI
                  </button>
                  <button
                    onClick={() => setManageView('edit')}
                    className="px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 text-[#003082] border-2 border-gray-300"
                  >
                    Editar POI
                  </button>
                  <button
                    onClick={() => setManageView('delete')}
                    className="px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 text-[#003082] border-2 border-gray-300"
                  >
                    Eliminar POI
                  </button>
                </div>
              </>
            )}

            {manageView === 'edit' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl text-[#003082]">Seleccionar POI</h3>
                  <button onClick={() => setManageView('main')}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <select
                    value={selectedPOIForEdit}
                    onChange={(e) => setSelectedPOIForEdit(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                      showErrors && !selectedPOIForEdit
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#003082] focus:ring-[#CF142B]'
                    }`}
                  >
                    <option value="">Seleccionar POI</option>
                    {MOCK_POIS.map(poi => (
                      <option key={poi.id} value={poi.id}>{poi.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleEditPOISelect}
                    className="w-full px-6 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}

            {manageView === 'delete' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl text-[#003082]">Eliminar POI</h3>
                  <button onClick={() => setManageView('main')}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {showSuccess && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg">
                    <p className="text-green-700 text-center">¡POI eliminado exitosamente!</p>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <select
                    value={selectedPOIForEdit}
                    onChange={(e) => setSelectedPOIForEdit(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                      showErrors && !selectedPOIForEdit
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#003082] focus:ring-[#CF142B]'
                    }`}
                  >
                    <option value="">Seleccionar POI</option>
                    {MOCK_POIS.map(poi => (
                      <option key={poi.id} value={poi.id}>{poi.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleDeletePOI}
                    className="w-full px-6 py-3 bg-[#CF142B] text-white rounded-lg hover:bg-[#a50f22] transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}

            {(manageView === 'edit-form' || manageView === 'create-form') && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl text-[#003082]">
                    {manageView === 'edit-form' ? 'Editar POI' : 'Crear POI'}
                  </h3>
                  <button onClick={() => setManageView('main')}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {showSuccess && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg">
                    <p className="text-green-700 text-center">
                      ¡POI {manageView === 'edit-form' ? 'editado' : 'creado'} exitosamente!
                    </p>
                  </div>
                )}

                {coordError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
                    <p className="text-red-700 text-center text-sm">
                      Error de validación geoespacial: Las coordenadas no corresponden al campus seleccionado
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nombre del POI"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                      showErrors && !editName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#003082] focus:ring-[#CF142B]'
                    }`}
                  />

                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                      showErrors && !editCategory
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#003082] focus:ring-[#CF142B]'
                    }`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={editCoordinates}
                    onChange={(e) => setEditCoordinates(e.target.value)}
                    placeholder="Coordenadas (lat, lng)"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                      (showErrors && !editCoordinates) || coordError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#003082] focus:ring-[#CF142B]'
                    }`}
                  />

                  <select
                    value={editCampus}
                    onChange={(e) => setEditCampus(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                      showErrors && !editCampus
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#003082] focus:ring-[#CF142B]'
                    }`}
                  >
                    <option value="">Seleccionar sede</option>
                    {CAMPUSES.map(campus => (
                      <option key={campus} value={campus}>{campus}</option>
                    ))}
                  </select>

                  <select
                    value={editFloor}
                    onChange={(e) => setEditFloor(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                      showErrors && !editFloor
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#003082] focus:ring-[#CF142B]'
                    }`}
                  >
                    <option value="">Seleccionar piso</option>
                    <option value="1">Piso 1</option>
                    <option value="2">Piso 2</option>
                    <option value="3">Piso 3</option>
                  </select>

                  <button
                    onClick={() => setShowExternalLinkPanel(true)}
                    className="w-full px-6 py-3 bg-gray-50 border-2 border-gray-300 text-[#003082] rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Enlace externo
                  </button>

                  <button
                    onClick={handleSavePOI}
                    className="w-full px-6 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* External Link Panel */}
      {showExternalLinkPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1002] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl border-2 border-[#003082] p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-[#003082]">Enlace Externo</h3>
              <button onClick={() => {
                setShowExternalLinkPanel(false);
                setSelectedModule('');
                setSelectedModuleInfo('');
              }}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  setSelectedModuleInfo('');
                }}
                className="w-full px-4 py-3 border-2 border-[#003082] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF142B]"
              >
                <option value="">Seleccionar módulo</option>
                {MODULES.map(mod => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>

              {selectedModule && (
                <select
                  value={selectedModuleInfo}
                  onChange={(e) => setSelectedModuleInfo(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#003082] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF142B]"
                >
                  <option value="">Seleccionar información</option>
                  {MODULE_INFO[selectedModule]?.map(info => (
                    <option key={info} value={info}>{info}</option>
                  ))}
                </select>
              )}

              <button
                onClick={handleExternalLinkConfirm}
                className="w-full px-6 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPOI && (
        <>
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
