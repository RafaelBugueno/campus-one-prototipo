import { Button } from './ui/button';

interface ProfileCardProps {
  profile: {
    name: string;
    rut: string;
    career: string;
    year: string;
    level: string;
    type: 'Estudiante' | 'Mentor' | 'Expositor' | 'Administrador' | 'Organizador';
    description?: string;
    interests?: string[];
  };

  isOwner?: boolean;
  onConnect?: () => void;
  onEdit?: () => void;
  onSchedule?: () => void;
}

export function ProfileCard({
  profile,
  isOwner = false,
  onConnect,
  onEdit,
  onSchedule
}: ProfileCardProps) {
  const primaryColor = 'rgb(0,123,255)';
  const accentColor = '#C8102E';

  return (
    <div className="bg-white border-2 border-gray-200 shadow-[0_4px_4px_rgba(0,0,0,0.28)]">

      {/* FOTO */}
      <div className="p-6 flex justify-center">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* INFO */}
      <div className="px-6 pb-6 text-center space-y-1">
        <h2 className="text-xl font-semibold">{profile.name}</h2>
        <p>{profile.rut}</p>
        <p className="font-medium">{profile.career}</p>
        <p>Año {profile.year}</p>
        <p>{profile.level}</p>
        <p className="font-semibold">{profile.type}</p>

        {profile.description && (
          <p className="text-sm text-gray-600 mt-2">
            {profile.description}
          </p>
        )}
      </div>

      {/* DIVISOR */}
      <div className="mx-6 h-px" style={{ backgroundColor: accentColor }}></div>

      {/* INTERESES */}
      {profile.interests && (
        <div className="px-6 py-4">
          <h3 className="font-semibold mb-2">Intereses</h3>

          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i, idx) => (
              <span key={idx} className="bg-gray-100 px-2 py-1 text-sm">
                {i}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ACCIONES */}
      <div className="px-6 pb-6 flex flex-col gap-2">

        {/* SI ES PROPIO */}
        {isOwner && (
          <Button onClick={onEdit}>
            Editar Perfil
          </Button>
        )}

        {/* SI ES OTRO */}
        {!isOwner && (
          <>
            <Button onClick={onConnect}>
              Conectar
            </Button>

            {(profile.type === 'Mentor' || profile.type === 'Expositor') && (
              <Button onClick={onSchedule}>
                Agendar Mentoría
              </Button>
            )}
          </>
        )}

      </div>
    </div>
  );
}