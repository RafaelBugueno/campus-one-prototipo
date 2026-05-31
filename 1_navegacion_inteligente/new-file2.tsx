import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Star,
  BarChart3,
  Trophy,
  GraduationCap,
  Bell,
  HelpCircle,
  MapPin,
  Briefcase,
  Users,
} from 'lucide-react';

const sidebarColor = 'rgb(0,50,130)';

const ratingItems = [
  { title: 'Dashboard', icon: LayoutDashboard },
  { title: 'Evaluar', icon: Star },
  { title: 'Analytics', icon: BarChart3 },
  { title: 'Rankings', icon: Trophy },
  { title: 'Mi Progreso', icon: GraduationCap },
  { title: 'Recordatorios', icon: Bell },
];

const hubItems = [
  { title: 'Mapa Campus', icon: MapPin },
  { title: 'Empleabilidad', icon: Briefcase },
  { title: 'Networking', icon: Users },
  { title: 'Ayuda', icon: HelpCircle },
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
            {/* LOGO */}
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-md
                bg-white
                text-[rgb(0,50,130)]
              "
            >
              <GraduationCap className="h-5 w-5" />
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
          {/* RATING */}
          <div className="mb-6">
            {!collapsed && (
              <p
                className="
                  mb-2 px-3
                  text-[10px]
                  uppercase
                  tracking-widest
                  text-white/60
                "
              >
                Rating & Analytics
              </p>
            )}

            <div className="flex flex-col gap-1">
              {ratingItems.map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => index === 0 && navigate('/')}
                  title={collapsed ? item.title : undefined}
                  className={`
                    flex w-full items-center
                    rounded-md
                    px-3 py-2.5
                    text-sm
                    transition

                    ${
                      collapsed
                        ? 'justify-center px-0'
                        : 'gap-3 text-left'
                    }

                    ${
                      index === 0
                        ? 'bg-white text-[rgb(0,50,130)]'
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4 shrink-0" />

                  {!collapsed && (
                    <span className="truncate">
                      {item.title}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* HUB */}
          <div>
            {!collapsed && (
              <p
                className="
                  mb-2 px-3
                  text-[10px]
                  uppercase
                  tracking-widest
                  text-white/60
                "
              >
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

                    ${
                      collapsed
                        ? 'justify-center px-0'
                        : 'gap-3 text-left'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4 shrink-0" />

                  {!collapsed && (
                    <span className="truncate">
                      {item.title}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}