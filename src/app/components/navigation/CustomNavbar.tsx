import { PanelLeft, ChevronDown } from 'lucide-react';
import { NotificationsPanel } from './NotificationsPanel';

interface CustomNavbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  selectedCampus: string;
  campuses: string[];
  showCampusSelector: boolean;
  onToggleCampusSelector: () => void;
  onSelectCampus: (campus: string) => void;
  showNotifications?: boolean;
}

export function CustomNavbar({
  collapsed,
  onToggleSidebar,
  selectedCampus,
  campuses,
  showCampusSelector,
  onToggleCampusSelector,
  onSelectCampus,
  showNotifications = false,
}: CustomNavbarProps) {
  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-[1500]
        h-16
        border-b border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg text-slate-600 transition
              hover:bg-slate-100
            "
            title="Mostrar / ocultar sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Campus Selector (Center) */}
        <div className="flex-1 flex justify-center relative">
          <button
            onClick={onToggleCampusSelector}
            className="bg-[rgb(0,50,130)] px-4 py-2 rounded-lg flex items-center gap-2 border border-white/20 hover:bg-[rgb(0,60,150)] transition"
          >
            <span className="text-white text-sm font-medium">{selectedCampus}</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>

          {showCampusSelector && (
            <div className="absolute top-12 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden min-w-[200px]">
              {campuses.map(campus => (
                <button
                  key={campus}
                  onClick={() => onSelectCampus(campus)}
                  className={`w-full px-6 py-3 text-left transition ${
                    campus === selectedCampus
                      ? 'bg-[rgb(0,50,130)] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications - Solo para usuarios autenticados */}
        {showNotifications ? <NotificationsPanel /> : <div className="w-9" />}
      </div>
    </nav>
  );
}
