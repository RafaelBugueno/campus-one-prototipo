import { useState, useEffect } from 'react';
import {
  HelpCircle,
  MapPin,
  BarChart3,
  Briefcase,
  Users,
  FileCheck,
} from 'lucide-react';
import campusOneLogo from '../../imports/campusone-logo.png';

const sidebarColor = 'rgb(0,50,130)';

const hubItems = [
  { title: 'Navegación Inteligente', icon: MapPin },
  { title: 'Rating & Analytics', icon: BarChart3 },
  { title: 'Empleabilidad y Colaboración', icon: Briefcase },
  { title: 'Eficiencia Administrativa', icon: FileCheck },
  { title: 'Networking y Match Académico', icon: Users },
];

interface CustomSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onLogoClick?: () => void;
}

export function CustomSidebar({ collapsed, onCollapsedChange, onLogoClick }: CustomSidebarProps) {
  useEffect(() => {
    const handleToggleSidebar = () => {
      onCollapsedChange(!collapsed);
    };

    window.addEventListener('toggle-sidebar', handleToggleSidebar);

    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
    };
  }, [collapsed, onCollapsedChange]);

  return (
    <aside
      className={`
        fixed left-0 top-0 z-[2000]
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
            className={`
              flex cursor-pointer items-center
              ${collapsed ? 'justify-center' : 'gap-3'}
            `}
            onClick={onLogoClick}
          >
            {/* LOGO */}
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-md
                bg-white
                border-2 border-white
                overflow-hidden
              "
            >
              <img
                src={campusOneLogo}
                alt="CampusOne"
                className="w-full h-full object-cover"
              />
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
          {/* NAVEGACION INTELIGENTE */}
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
                Navegación Inteligente
              </p>
            )}
          </div>

          {/* CAMPUSONE ITEMS */}
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
              {hubItems.map((item, index) => (
                <button
                  key={item.title}
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
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
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

        {/* AYUDA - FOOTER */}
        <div className="border-t border-white/10 px-2 py-4">
          <button
            title={collapsed ? 'Ayuda' : undefined}
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
            <HelpCircle className="h-4 w-4 shrink-0" />

            {!collapsed && (
              <span className="truncate">
                Ayuda
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
