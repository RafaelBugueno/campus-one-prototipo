import { PanelLeft } from 'lucide-react';

interface CustomNavbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export function CustomNavbar({
  collapsed,
  onToggleSidebar,
}: CustomNavbarProps) {
  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-[1500]
        h-14
        border-b border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div className="flex h-full items-center px-5">
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
      </div>
    </nav>
  );
}
