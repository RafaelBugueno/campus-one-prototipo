import { Building2, GraduationCap, UserCircle } from 'lucide-react';

interface HomeScreenProps {
  onSelectRole: (role: 'visitor' | 'student' | 'admin') => void;
}

export default function HomeScreen({ onSelectRole }: HomeScreenProps) {
  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-[rgb(0,50,130)] to-[#C8102E]">
      <div className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl text-white mb-4">
          Universidad de La Serena
        </h1>
        <div className="flex flex-col gap-6 w-80">
          <button
            onClick={() => onSelectRole('visitor')}
            className="flex items-center justify-center gap-4 px-8 py-6 bg-white text-[rgb(0,50,130)] rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
          >
            <UserCircle className="w-8 h-8" />
            <span className="text-2xl">Visitante</span>
          </button>
          <button
            onClick={() => onSelectRole('student')}
            className="flex items-center justify-center gap-4 px-8 py-6 bg-white text-[rgb(0,50,130)] rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
          >
            <GraduationCap className="w-8 h-8" />
            <span className="text-2xl">Estudiante</span>
          </button>
          <button
            onClick={() => onSelectRole('admin')}
            className="flex items-center justify-center gap-4 px-8 py-6 bg-white text-[rgb(0,50,130)] rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
          >
            <Building2 className="w-8 h-8" />
            <span className="text-2xl">Administrador</span>
          </button>
        </div>
      </div>
    </div>
  );
}
