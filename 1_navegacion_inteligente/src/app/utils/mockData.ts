// Shared mock data and utilities for Campus One

export interface POI {
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

export const CAMPUS_COORDS: { [key: string]: [number, number] } = {
  'Ignacio Domeyko': [-29.908548, -71.246099],
  'Isabel Bongard': [-29.911262, -71.245408],
  'Andrés Bello': [-29.913318, -71.242221],
  'Mecánica': [-29.909625, -71.246190]
};

export const CAMPUSES = ['Ignacio Domeyko', 'Isabel Bongard', 'Andrés Bello', 'Mecánica'];
export const CATEGORIES = ['Salas', 'Laboratorios', 'Servicios', 'Oficinas', 'Baños'];
export const EVENT_CATEGORIES = ['Conferencia', 'Taller', 'Seminario', 'Reunión'];

export const CATEGORY_COLORS: { [key: string]: string } = {
  'Salas': '#3B82F6',
  'Laboratorios': '#10B981',
  'Servicios': '#F59E0B',
  'Oficinas': '#8B5CF6',
  'Baños': '#EC4899'
};

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

  for (let floor = 1; floor <= 3; floor++) {
    for (let i = 0; i < 5; i++) {
      const poiType = poiTypes[i % poiTypes.length];
      const offsetLat = ((i % 3) - 1) * spacing;
      const offsetLng = (Math.floor(i / 3) - 0.5) * spacing;
      const poiName = `${poiType.name} ${String.fromCharCode(65 + i)} - Piso ${floor}`;
      
      const hasEvent = Math.random() < 0.2;
      const eventCat = hasEvent ? EVENT_CATEGORIES[Math.floor(Math.random() * EVENT_CATEGORIES.length)] : undefined;
      
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
        floor: floor,
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

export const MOCK_POIS: POI[] = [
  ...generatePOIsForCampus('Ignacio Domeyko', CAMPUS_COORDS['Ignacio Domeyko'][0], CAMPUS_COORDS['Ignacio Domeyko'][1], 1),
  ...generatePOIsForCampus('Isabel Bongard', CAMPUS_COORDS['Isabel Bongard'][0], CAMPUS_COORDS['Isabel Bongard'][1], 16),
  ...generatePOIsForCampus('Andrés Bello', CAMPUS_COORDS['Andrés Bello'][0], CAMPUS_COORDS['Andrés Bello'][1], 31),
  ...generatePOIsForCampus('Mecánica', CAMPUS_COORDS['Mecánica'][0], CAMPUS_COORDS['Mecánica'][1], 46)
];
