import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PanelLeft, Search, UserCircle } from 'lucide-react';
import { NotificationsPanel } from './NotificationsPanel';
import { ChatWidget } from './ChatWidget';

export function Navbar() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;

    setSidebarCollapsed(newState);
    window.dispatchEvent(new Event('toggle-sidebar'));
  };

  return (
    <nav
      className={`
        sticky top-0 z-40
        h-14
        border-b border-slate-200
        bg-white
        shadow-sm
        transition-all duration-300
        ${sidebarCollapsed ? 'ml-12 w-[calc(100%-48px)]' : 'ml-64 w-[calc(100%-256px)]'}
      `}
    >
      <div className="flex h-full items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg text-slate-600 transition
              hover:bg-slate-100
            "
            title="Expandir / contraer sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          <div
            className="
              hidden md:flex
              h-10 w-[420px]
              items-center gap-3
              rounded-xl border border-slate-100 bg-slate-50
              px-4
            "
          >
            <Search className="h-4 w-4 text-slate-400" />

            <input
              type="text"
              placeholder="Buscar item, asignatura, servicio..."
              className="
                w-full bg-transparent text-sm text-slate-700
                outline-none placeholder:text-slate-400
              "
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full transition hover:bg-slate-100">
            <ChatWidget />
          </div>

          <div className="rounded-full transition hover:bg-slate-100">
            <NotificationsPanel />
          </div>

          <button
            onClick={() => navigate('/edit-profile')}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full bg-[rgb(0,50,130)] text-white
              transition hover:scale-105
            "
            title="Editar perfil"
          >
            <UserCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}