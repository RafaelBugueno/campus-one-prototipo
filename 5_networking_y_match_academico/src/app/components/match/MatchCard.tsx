import { Check, X, User, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface MatchUser {
  id?: string;
  name: string;
  rut: string;
  career: string;
  year: string;
  level: string;
  type: 'Estudiante' | 'Mentor' | 'Expositor' | 'Administrador';
  interests: string[];
  match: number;
  avatar?: string;
}

interface MatchCardProps {
  user: MatchUser;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onClick?: () => void;
}

const primaryColor = 'rgb(0,123,255)';

export const MatchCard = ({ user, onAccept, onReject, onClick }: MatchCardProps) => {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-12 w-12 rounded-2xl object-cover shrink-0"
            />
          ) : (
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
              <User className="h-6 w-6" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">
                {user.name}
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {user.type}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {user.career}
            </p>
            <p className="text-sm text-slate-400">
              {user.level} · Ingreso {user.year}
            </p>

            {user.interests && user.interests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {user.interests.slice(0, 3).map((interest, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {interest}
                  </span>
                ))}
                {user.interests.length > 3 && (
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-400">
                    +{user.interests.length - 3} más
                  </span>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                className="rounded-xl"
                style={{ backgroundColor: primaryColor }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept(user.rut || user.id || '');
                }}
              >
                Conectar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(user.rut || user.id || '');
                }}
              >
                <X className="mr-1 h-4 w-4" />
                Rechazar
              </Button>
            </div>
          </div>
        </div>

        <div className="min-w-[110px] rounded-2xl bg-blue-50 px-4 py-3 text-center shrink-0">
          <p className="text-3xl font-bold text-blue-700">
            {user.match}%
          </p>
          <p className="text-xs font-medium text-blue-500">
            Compatibilidad
          </p>
        </div>
      </div>
    </article>
  );
};
