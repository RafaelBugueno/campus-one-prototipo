import { User } from 'lucide-react';
import { Button } from '../ui/button';

interface UserCardUser {
  id?: string;
  name: string;
  career?: string;
  type?: string;
  avatar?: string;
}

interface UserCardProps {
  user: UserCardUser;
  onConnect?: () => void;
}

const primaryColor = 'rgb(0,123,255)';

export const UserCard = ({ user, onConnect }: UserCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center hover:border-blue-200 transition">
      <div className="flex gap-3 items-center">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
            <User className="h-5 w-5" />
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-900">{user.name}</p>
          {user.career && (
            <p className="text-xs text-slate-500">{user.career}</p>
          )}
        </div>
      </div>

      <Button
        onClick={onConnect}
        className="rounded-xl"
        size="sm"
        style={{ backgroundColor: primaryColor }}
      >
        Conectar
      </Button>
    </div>
  );
};