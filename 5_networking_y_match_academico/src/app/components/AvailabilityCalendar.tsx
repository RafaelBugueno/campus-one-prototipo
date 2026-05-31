import { useState } from 'react';

type Mode = 'mentor' | 'viewer';

interface Props {
  mode?: Mode; // mentor = define disponibilidad, viewer = agenda
}

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

const hours = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00'
];

export function AvailabilityCalendar({ mode = 'viewer' }: Props) {

  // horarios disponibles (mentor los define)
  const [available, setAvailable] = useState<string[]>([]);

  // horarios ya ocupados (simulado)
  const [occupied] = useState<string[]>([
    'Martes-10:00',
    'Jueves-14:00'
  ]);

  // horario seleccionado para agendar
  const [selected, setSelected] = useState<string | null>(null);

  const toggleAvailability = (slot: string) => {
    if (available.includes(slot)) {
      setAvailable(available.filter(s => s !== slot));
    } else {
      setAvailable([...available, slot]);
    }
  };

  const handleSelect = (slot: string) => {
    if (occupied.includes(slot)) return;
    setSelected(slot);
  };

  const handleSchedule = () => {
    if (!selected) return;
    alert(`Mentoría agendada en ${selected}`);
  };

  return (
    <div className="w-full overflow-x-auto">

      <h2 className="text-xl font-semibold mb-4">
        {mode === 'mentor' ? 'Definir Disponibilidad' : 'Agendar Mentoría'}
      </h2>

      <div className="grid grid-cols-6 gap-2 min-w-[600px]">

        {/* Header */}
        <div></div>
        {days.map(day => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}

        {/* Horas */}
        {hours.map(hour => (
          <>
            <div key={hour} className="font-medium">
              {hour}
            </div>

            {days.map(day => {
              const slot = `${day}-${hour}`;
              const isOccupied = occupied.includes(slot);
              const isAvailable = available.includes(slot);
              const isSelected = selected === slot;

              return (
                <div
                  key={slot}
                  onClick={() =>
                    mode === 'mentor'
                      ? toggleAvailability(slot)
                      : handleSelect(slot)
                  }
                  className={`
                    p-2 text-center border text-sm transition

                    ${isOccupied && 'bg-gray-300 cursor-not-allowed'}
                    
                    ${mode === 'mentor' && isAvailable && 'bg-green-500 text-white'}
                    
                    ${mode === 'viewer' && isSelected && 'bg-blue-500 text-white'}
                    
                    ${!isOccupied && 'hover:bg-gray-100 cursor-pointer'}
                  `}
                >
                  {isOccupied
                    ? 'Ocupado'
                    : mode === 'mentor'
                      ? isAvailable ? 'Disponible' : ''
                      : isSelected ? 'Seleccionado' : ''}
                </div>
              );
            })}
          </>
        ))}

      </div>

      {/* BOTÓN */}
      {mode === 'viewer' && (
        <button
          onClick={handleSchedule}
          className="mt-4 bg-blue-600 text-white px-4 py-2"
        >
          Agendar
        </button>
      )}

    </div>
  );
}