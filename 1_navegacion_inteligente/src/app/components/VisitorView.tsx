import { useState, useEffect, useRef } from 'react';
import { Search, List, Filter, X, MapPin, Calendar } from 'lucide-react';
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
  hasActiveEvent?: boolean;
  eventCategory?: string;
  eventStartDate?: string;
  eventEndDate?: string;
}

const generateExternalLinks = (poiName: string, category: string): string[] => {
  const links: string[] = [];
  if (category === 'Salas') {
    links.push(`https://academico.userena.cl/horarios/${poiName.toLowerCase().replace(/\s+/g, '-')}`);
    links.push(`https://academico.userena.cl/programas/${poiName.toLowerCase().replace(/\s+/g, '-')}`);
  }
  if (category === 'Laboratorios') {
    links.push(`https://infraestructura.userena.cl/equipamiento/${poiName.toLowerCase().replace(/\s+/g, '-')}`);
    links.push(`https://infraestructura.userena.cl/reservas/${poiName.toLowerCase().replace(/\s+/g, '-')}`);
  }
  if (category === 'Servicios') {
    links.push(`https://servicios.userena.cl/contacto`);
    links.push(`https://servicios.userena.cl/horarios-atencion`);
  }
  if (category === 'Oficinas') {
    links.push(`https://oficinas.userena.cl/directorio`);
    links.push(`https://oficinas.userena.cl/contacto/${poiName.toLowerCase().replace(/\s+/g, '-')}`);
  }
  return links;
};

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
  const eventCategories = ['Conferencia', 'Taller', 'Seminario', 'Reunión'];

  for (let floor = 1; floor <= 3; floor++) {
    for (let i = 0; i < 5; i++) {
      const poiType = poiTypes[i % poiTypes.length];
      const offsetLat = ((i % 3) - 1) * spacing;
      const offsetLng = (Math.floor(i / 3) - 0.5) * spacing;
      const poiName = `${poiType.name} ${String.fromCharCode(65 + i)} - Piso ${floor}`;
      const hasEvent = Math.random() < 0.2;
      const eventCat = hasEvent ? eventCategories[Math.floor(Math.random() * eventCategories.length)] : undefined;
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + Math.floor(Math.random() * 60));
      const endDate = new Date(futureDate);
      endDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 5) + 1);

      pois.push({
        id: `${id}`,
        name: poiName,
        category: poiType.category,
        campus: campusName,
        floor,
        position: [centerLat + offsetLat, centerLng + offsetLng],
        description: `${poiType.description} en el piso ${floor}`,
        externalLinks: generateExternalLinks(poiName, poiType.category),
        hasActiveEvent: hasEvent,
        eventCategory: eventCat,
        eventStartDate: hasEvent ? futureDate.toISOString().split('T')[0] : undefined,
        eventEndDate: hasEvent ? endDate.toISOString().split('T')[0] : undefined
      });
      id++;
    }
  }
  return pois;
};

const CAMPUS_COORDS: { [key: string]: [number, number] } = {
  'Ignacio Domeyko': [-29.908548, -71.246099],
  'Isabel Bongard': [-29.911262, -71.245408],
  'Andrés Bello': [-29.913318, -71.242221],
  'Mecánica': [-29.909625, -71.246190]
};

const MOCK_POIS: POI[] = [
  ...generatePOIsForCampus('Ignacio Domeyko', CAMPUS_COORDS['Ignacio Domeyko'][0], CAMPUS_COORDS['Ignacio Domeyko'][1], 1),
  ...generatePOIsForCampus('Isabel Bongard', CAMPUS_COORDS['Isabel Bongard'][0], CAMPUS_COORDS['Isabel Bongard'][1], 16),
  ...generatePOIsForCampus('Andrés Bello', CAMPUS_COORDS['Andrés Bello'][0], CAMPUS_COORDS['Andrés Bello'][1], 31),
  ...generatePOIsForCampus('Mecánica', CAMPUS_COORDS['Mecánica'][0], CAMPUS_COORDS['Mecánica'][1], 46)
];

const CAMPUSES = ['Ignacio Domeyko', 'Isabel Bongard', 'Andrés Bello', 'Mecánica'];
const CATEGORIES = ['Salas', 'Laboratorios', 'Servicios', 'Oficinas', 'Baños'];
const EVENT_CATEGORIES = ['Conferencia', 'Taller', 'Seminario', 'Reunión'];

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
  const [poiPanelView, setPOIPanelView] = useState<'main' | 'filter' | 'filter-events' | 'search' | 'list'>('main');
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [infoError, setInfoError] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isDraggingFloor, setIsDraggingFloor] = useState(false);
  const floorSliderRef = useRef<HTMLDivElement>(null);

  // Event filter state
  const [showEventFilters, setShowEventFilters] = useState(false);
  const [selectedEventCategories, setSelectedEventCategories] = useState<string[]>([]);
  const [selectedEventCampus, setSelectedEventCampus] = useState('');
  const [eventDateFrom, setEventDateFrom] = useState('');
  const [eventDateTo, setEventDateTo] = useState('');

  const searchResults = MOCK_POIS.filter(poi =>
    poi.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    poi.campus === selectedCampus
  );

  const filteredEvents = MOCK_POIS.filter(poi => {
    if (!poi.hasActiveEvent) return false;
    if (selectedEventCategories.length > 0 && poi.eventCategory) {
      if (!selectedEventCategories.includes(poi.eventCategory)) return false;
    }
    if (selectedEventCampus && poi.campus !== selectedEventCampus) return false;
    if (eventDateFrom || eventDateTo) {
      const eventStart = poi.eventStartDate ? new Date(poi.eventStartDate) : null;
      const eventEnd = poi.eventEndDate ? new Date(poi.eventEndDate) : null;
      if (eventDateFrom && eventStart && eventStart < new Date(eventDateFrom)) return false;
      if (eventDateTo && eventEnd && eventEnd > new Date(eventDateTo)) return false;
    }
    return true;
  });

  const poisForMap = (() => {
    if (showEventFilters) return filteredEvents;
    const base = MOCK_POIS.filter(poi => poi.campus === selectedCampus && poi.floor === selectedFloor);
    if (selectedCategories.length > 0) return base.filter(poi => selectedCategories.includes(poi.category));
    return base;
  })();

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleEventCategory = (category: string) => {
    setSelectedEventCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
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
    const floor = Math.round(3 - percentage * 2);
    setSelectedFloor(Math.max(1, Math.min(3, floor)));
  };

  const handleFloorTouchStart = (e: React.TouchEvent) => {
    setIsDraggingFloor(true);
    handleFloorSliderInteraction(e.touches[0].clientY);
  };

  const handleFloorTouchMove = (e: React.TouchEvent) => {
    if (isDraggingFloor) handleFloorSliderInteraction(e.touches[0].clientY);
  };

  const handleFloorTouchEnd = () => setIsDraggingFloor(false);

  const handleFloorMouseDown = (e: React.MouseEvent) => {
    setIsDraggingFloor(true);
    handleFloorSliderInteraction(e.clientY);
  };

  const handleFloorMouseMove = (e: MouseEvent) => {
    if (isDraggingFloor) handleFloorSliderInteraction(e.clientY);
  };

  const handleFloorMouseUp = () => setIsDraggingFloor(false);

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
      }).addTo(map).on('tileerror', () => setMapError(true));
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

    poisForMap.forEach(poi => {
      const color = CATEGORY_COLORS[poi.category] || '#6B7280';
      const hasEvent = poi.hasActiveEvent;

      let marker;
      if (hasEvent) {
        const icon = L.divIcon({
          className: 'custom-event-icon',
          html: `<div class="event-marker" style="background-color: ${color}; border: 2px solid ${color}; border-radius: 50%; width: 20px; height: 20px; box-sizing: border-box; animation: event-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        marker = L.marker(poi.position, { icon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`<div style="color: ${color};"><strong>${poi.name}</strong><br/>${poi.category}<br/><span style="color: #C8102E;">📅 Evento Activo</span></div>`)
          .on('click', () => handlePOIClick(poi));
      } else {
        marker = L.circleMarker(poi.position, {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 0.8,
          weight: 2
        })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`<div style="color: ${color};"><strong>${poi.name}</strong><br/>${poi.category}</div>`)
          .on('click', () => handlePOIClick(poi));
      }

      rectanglesRef.current.push(marker as any);
    });
  }, [poisForMap]);

  const getFloorPosition = () => ((3 - selectedFloor) / 2) * 100;

  const handleToggleSidebar = () => window.dispatchEvent(new Event('toggle-sidebar'));

  return (
    <div className="size-full relative">
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-[1550]"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <CustomSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        onLogoClick={onGoHome}
      />

      <div className="size-full">
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

          {/* Floor Slider */}
          <div className="absolute top-1/4 right-6 h-1/2 z-[1000] flex flex-col items-center">
            <span className="text-[rgb(0,50,130)] text-xs mb-2">Piso</span>
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
                  className="absolute bottom-0 w-full bg-[rgb(0,50,130)] rounded-full transition-all duration-150"
                  style={{ height: `${100 - getFloorPosition()}%` }}
                />
                {isDraggingFloor && (
                  <div
                    className="absolute w-10 h-10 bg-[#C8102E] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white"
                    style={{ top: `${getFloorPosition()}%`, left: '50%', transform: 'translate(-50%, -50%)' }}
                  >
                    <span className="text-sm">{selectedFloor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* POI Panel Button */}
          {!showPOIPanel && !selectedPOI && (
            <button
              onClick={() => { setShowPOIPanel(true); setPOIPanelView('main'); }}
              className="absolute bottom-8 right-8 z-[1000] bg-[#C8102E] text-white w-16 h-16 rounded-full shadow-lg hover:bg-[#a50f22] transition-colors flex items-center justify-center"
              title="Panel de POI"
            >
              <MapPin className="w-7 h-7" />
            </button>
          )}

          {/* POI Panel */}
          {showPOIPanel && (
            <div className="absolute bottom-8 right-4 left-4 z-[1000] bg-white rounded-lg shadow-xl border-2 border-slate-200 max-w-md mx-auto">
              {poiPanelView === 'main' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl text-[rgb(0,50,130)]">Panel de POI</h3>
                    <button onClick={() => setShowPOIPanel(false)}>
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => setPOIPanelView('filter')}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <Filter className="w-5 h-5 text-[rgb(0,50,130)]" />
                      <div>
                        <div className="text-[rgb(0,50,130)]">Filtro de POI</div>
                        <div className="text-sm text-gray-500">por categoría</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { setPOIPanelView('filter-events'); setShowEventFilters(true); }}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <Calendar className="w-5 h-5 text-[rgb(0,50,130)]" />
                      <div>
                        <div className="text-[rgb(0,50,130)]">Filtro de eventos</div>
                        <div className="text-sm text-gray-500">por categoría, fechas y sede</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setPOIPanelView('search')}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <Search className="w-5 h-5 text-[rgb(0,50,130)]" />
                      <div>
                        <div className="text-[rgb(0,50,130)]">Buscador de POI</div>
                        <div className="text-sm text-gray-500">con sugerencias en tiempo real</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setPOIPanelView('list')}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
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
                    <h3 className="text-xl text-[rgb(0,50,130)]">Filtro de POI</h3>
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
                          className="w-4 h-4 text-[#C8102E] rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[category] }} />
                          <span className="text-[rgb(0,50,130)] text-sm truncate">{category}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPOIPanel(false)}
                      className="flex-1 px-4 py-2 bg-[rgb(0,50,130)] text-white rounded-lg hover:bg-[#002060]"
                    >
                      Aplicar al mapa
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

              {poiPanelView === 'filter-events' && (
                <div className="fixed inset-x-4 top-16 bottom-0 z-[1001] flex items-center justify-center pointer-events-none">
                  <div className="bg-white rounded-lg shadow-xl border-2 border-slate-200 max-h-[70vh] flex flex-col w-full max-w-md pointer-events-auto">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl text-[rgb(0,50,130)]">Filtro de eventos</h3>
                        <button onClick={() => {
                          setPOIPanelView('main');
                          setShowEventFilters(false);
                          setSelectedEventCategories([]);
                          setSelectedEventCampus('');
                          setEventDateFrom('');
                          setEventDateTo('');
                        }}>
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Categoría de evento</label>
                          <div className="grid grid-cols-2 gap-2">
                            {EVENT_CATEGORIES.map(category => (
                              <label
                                key={category}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedEventCategories.includes(category)}
                                  onChange={() => toggleEventCategory(category)}
                                  className="w-4 h-4 text-[#C8102E] rounded focus:ring-blue-500"
                                />
                                <span className="text-[rgb(0,50,130)] text-sm">{category}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Sede</label>
                          <select
                            value={selectedEventCampus}
                            onChange={(e) => setSelectedEventCampus(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Todas las sedes</option>
                            {CAMPUSES.map(campus => (
                              <option key={campus} value={campus}>{campus}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Rango de fechas</label>
                          <div className="flex gap-2">
                            <input
                              type="date"
                              value={eventDateFrom}
                              onChange={(e) => setEventDateFrom(e.target.value)}
                              className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                            />
                            <input
                              type="date"
                              value={eventDateTo}
                              onChange={(e) => setEventDateTo(e.target.value)}
                              className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="mb-2 text-sm text-gray-600">
                        {filteredEvents.length} evento(s) encontrado(s)
                      </div>
                      {filteredEvents.map(poi => (
                        <button
                          key={poi.id}
                          onClick={() => handlePOIClick(poi)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg border-b border-gray-200 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: CATEGORY_COLORS[poi.category] }} />
                            <span className="text-[rgb(0,50,130)]">{poi.name}</span>
                          </div>
                          <div className="text-sm text-gray-500 ml-5">
                            {poi.eventCategory} - {poi.campus} - Piso {poi.floor}
                          </div>
                          <div className="text-xs text-[#C8102E] ml-5">
                            📅 {poi.eventStartDate} al {poi.eventEndDate}
                          </div>
                        </button>
                      ))}
                      {filteredEvents.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No hay eventos que coincidan con los filtros
                        </p>
                      )}
                    </div>
                    <div className="p-4 border-t border-gray-200 flex gap-2">
                      <button
                        onClick={() => setShowPOIPanel(false)}
                        className="flex-1 px-4 py-2 bg-[rgb(0,50,130)] text-white rounded-lg hover:bg-[#002060]"
                      >
                        Ver en mapa
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEventCategories([]);
                          setSelectedEventCampus('');
                          setEventDateFrom('');
                          setEventDateTo('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {poiPanelView === 'search' && (
                <div className="fixed inset-x-4 top-16 bottom-0 z-[1001] flex items-center justify-center pointer-events-none">
                  <div className="bg-white rounded-lg shadow-xl border-2 border-slate-200 max-h-[70vh] flex flex-col w-full max-w-md pointer-events-auto">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl text-[rgb(0,50,130)]">Buscar POI</h3>
                        <button onClick={() => setPOIPanelView('main')}>
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar punto de interés..."
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {searchQuery && searchResults.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No se encontraron POIs con ese nombre</p>
                      )}
                      {searchQuery && searchResults.map(poi => (
                        <button
                          key={poi.id}
                          onClick={() => handlePOIClick(poi)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg border-b border-gray-200 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: CATEGORY_COLORS[poi.category] }} />
                            <span className="text-[rgb(0,50,130)]">{poi.name}</span>
                          </div>
                          <div className="text-sm text-gray-500 ml-5">{poi.category} - Piso {poi.floor}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {poiPanelView === 'list' && (
                <div className="fixed inset-x-4 top-16 bottom-0 z-[1001] flex items-center justify-center pointer-events-none">
                  <div className="bg-white rounded-lg shadow-xl border-2 border-slate-200 max-h-[70vh] flex flex-col w-full max-w-md pointer-events-auto">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl text-[rgb(0,50,130)]">Listado de POI</h3>
                        <button onClick={() => { setPOIPanelView('main'); setSelectedCategories([]); }}>
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {MOCK_POIS.filter(poi => poi.campus === selectedCampus && poi.floor === selectedFloor).map(poi => (
                        <button
                          key={poi.id}
                          onClick={() => handlePOIClick(poi)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg border-b border-gray-200 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: CATEGORY_COLORS[poi.category] }} />
                            <span className="text-[rgb(0,50,130)]">{poi.name}</span>
                          </div>
                          <div className="text-sm text-gray-500 ml-5">{poi.category} - Piso {poi.floor}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected POI Info Panels */}
          {selectedPOI && (
            <>
              <div className="absolute top-20 left-4 right-4 z-[1000] bg-white rounded-lg shadow-xl border-2 border-slate-200 max-w-md mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-[rgb(0,50,130)]">Panel informativo</h3>
                  <button onClick={() => setSelectedPOI(null)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                {infoError ? (
                  <p className="text-[#C8102E] text-sm">Error al recuperar la información. Por favor, intente más tarde.</p>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Nombre:</span> <span className="text-[rgb(0,50,130)]">{selectedPOI.name}</span></div>
                    <div><span className="text-gray-600">Categoría:</span> <span className="text-[rgb(0,50,130)]">{selectedPOI.category}</span></div>
                    <div><span className="text-gray-600">Sede:</span> <span className="text-[rgb(0,50,130)]">{selectedPOI.campus}</span></div>
                    <div><span className="text-gray-600">Piso:</span> <span className="text-[rgb(0,50,130)]">{selectedPOI.floor}</span></div>
                    {selectedPOI.description && (
                      <div><span className="text-gray-600">Descripción:</span> <span className="text-[rgb(0,50,130)]">{selectedPOI.description}</span></div>
                    )}
                    {selectedPOI.hasActiveEvent && (
                      <div className="mt-3 p-3 bg-red-50 border border-[#C8102E] rounded-lg">
                        <div className="text-[#C8102E] flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Evento Activo</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div>Tipo: {selectedPOI.eventCategory}</div>
                          <div>Fecha: {selectedPOI.eventStartDate} al {selectedPOI.eventEndDate}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white rounded-lg shadow-xl border-2 border-slate-200 max-w-md mx-auto p-4">
                <h3 className="text-lg text-[rgb(0,50,130)] mb-4">Panel de detalle</h3>
                {detailError ? (
                  <p className="text-[#C8102E] text-sm">Error al recuperar los detalles. Por favor, intente más tarde.</p>
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
                            className="block text-[#C8102E] hover:underline text-sm truncate"
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
                <p className="text-[#C8102E] text-center">No se pudo cargar el mapa. Verifica tu conexión a internet.</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="size-full z-0" />
        </div>
      </div>
    </div>
  );
}
