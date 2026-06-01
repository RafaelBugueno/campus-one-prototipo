import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCircle,
  MapPin,
  Briefcase,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react';

const sidebarColor = 'rgb(0,50,130)';

// Componente del Logo con el SVG corregido (solo una versión)
const CampusOneLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="30 20 160 160"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      {/* Triángulos decorativos superiores */}
      <path d="M 189.6983,160.47596 H 94.999995 L 189.6983,109.99999 Z" fill="#cf142b" />
      <path d="m 189.6983,30.475975 h -20 l 20,50.47597 z" fill="#cf142b" />
      <path d="M 189.6983,14.524033 H 99.698305 L 189.6983,36.427918 Z" fill="#800000" />
      <path d="m 189.6983,160.47596 h -25 l 25,-50.47597 z" fill="#800000" />
      
      {/* Elementos circulares del logo */}
      <path
        d="M 90.489119,161.91722 A 54.999996,54.999992 0 0 1 35.489376,106.91747 v 54.99975 z"
        fill="#000080"
      />
      <circle cx="67.989235" cy="134.41734" r="7.5" fill="#000080" />
      <path
        d="M 95.849395,21.917371 A 79.761772,72.417697 0 0 0 37.634226,91.642817 79.761772,72.417697 0 0 0 53.559864,134.97028 76.717649,69.653862 0 0 1 52.977876,126.9118 76.717649,69.653862 0 0 1 129.69559,57.257863 76.717649,69.653862 0 0 1 180.48922,74.805487 L 163.9779,36.971767 Z"
        fill="#000080"
      />
      <circle cx="114.23923" cy="101.91737" r="31.25" fill="#cf142b" />
    </g>
  </svg>
);

const matchItems = [
  { title: 'Match Académico', icon: Users, path: '/' },
  { title: 'Ver Perfil', icon: UserCircle, path: '/edit-profile' },
];

const hubItems = [
  { title: 'Mapa Campus', icon: MapPin },
  { title: 'Empleabilidad', icon: Briefcase },
  { title: 'Eficiencia Administrativa', icon: FileSpreadsheet },
  { title: 'Rating y Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleToggleSidebar = () => {
      setCollapsed((prev) => {
        const newState = !prev;
        window.dispatchEvent(new Event('toggle-sidebar-state'));
        return newState;
      });
    };

    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
    };
  }, []);

  return (
    <aside
      className={`
        fixed left-0 top-0 z-50
        h-screen
        border-r border-white/10
        shadow-lg
        transition-all duration-300
        ${collapsed ? 'w-12' : 'w-64'}
      `}
      style={{ backgroundColor: sidebarColor }}
    >
      <div className="flex h-full flex-col">
        {/* HEADER */}
        <div className="border-b border-white/10 px-3 py-4">
          <div
            onClick={() => navigate('/')}
            className={`
              flex cursor-pointer items-center
              ${collapsed ? 'justify-center' : 'gap-3'}
            `}
          >
            {/* LOGO CONTAINER */}
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-md
                bg-white
                p-1.5
              "
            >
              <CampusOneLogo className="h-full w-full" />
            </div>

            {/* TITULO */}
            {!collapsed && (
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">
                  CampusOne
                </p>
                <p className="text-[11px] text-white/70">
                  Universidad de La Serena
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {/* MATCH ACADÉMICO */}
          <div className="mb-6">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] uppercase tracking-widest text-white/60">
                Match Académico
              </p>
            )}

            <div className="flex flex-col gap-1">
              {matchItems.map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  title={collapsed ? item.title : undefined}
                  className={`
                    flex w-full items-center
                    rounded-md
                    px-3 py-2.5
                    text-sm
                    transition
                    ${collapsed ? 'justify-center px-0' : 'gap-3 text-left'}
                    ${index === 0
                      ? 'bg-white text-[rgb(0,50,130)]'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* HUB */}
          <div>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] uppercase tracking-widest text-white/60">
                CampusOne
              </p>
            )}

            <div className="flex flex-col gap-1">
              {hubItems.map((item) => (
                <button
                  key={item.title}
                  title={collapsed ? item.title : undefined}
                  className={`
                    flex w-full items-center
                    rounded-md
                    px-3 py-2.5
                    text-sm
                    text-white/75
                    transition
                    hover:bg-white/10
                    hover:text-white
                    ${collapsed ? 'justify-center px-0' : 'gap-3 text-left'}
                  `}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
