import { PanelLeft, ChevronDown } from 'lucide-react';

interface CustomNavbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  selectedCampus: string;
  campuses: string[];
  showCampusSelector: boolean;
  onToggleCampusSelector: () => void;
  onSelectCampus: (campus: string) => void;
}

export function CustomNavbar({
  collapsed,
  onToggleSidebar,
  selectedCampus,
  campuses,
  showCampusSelector,
  onToggleCampusSelector,
  onSelectCampus,
}: CustomNavbarProps) {
  return (
    <nav
      className={`
        fixed top-0 z-[1500]
        h-16
        border-b-2 border-gray-200
        bg-white
        shadow-md
        transition-all duration-300
        ${collapsed ? 'left-12 w-[calc(100%-48px)]' : 'left-64 w-[calc(100%-256px)]'}
      `}
    >
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg text-[#003082] transition
              hover:bg-gray-100
            "
            title="Expandir / contraer sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Campus Selector (Center) */}
        <div className="flex-1 flex justify-center relative">
          <button
            onClick={onToggleCampusSelector}
            className="bg-[#003082] px-4 py-2 rounded-lg flex items-center gap-2 border-2 border-white"
          >
            <span className="text-white text-sm">{selectedCampus}</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>

          {showCampusSelector && (
            <div className="absolute top-12 bg-[#003082] rounded-lg shadow-xl border-2 border-white overflow-hidden min-w-[200px]">
              {campuses.map(campus => (
                <button
                  key={campus}
                  onClick={() => onSelectCampus(campus)}
                  className={`w-full px-6 py-3 text-left hover:bg-[#002060] ${
                    campus === selectedCampus ? 'bg-[#CF142B] text-white' : 'text-white'
                  }`}
                >
                  {campus}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty space for balance */}
        <div className="w-9" />
      </div>
    </nav>
  );
}
