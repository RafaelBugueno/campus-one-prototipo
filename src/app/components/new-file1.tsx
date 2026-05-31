import { useState, useEffect } from 'react';
import {
  HelpCircle,
  MapPin,
  BarChart3,
  Briefcase,
  Users,
  FileCheck,
} from 'lucide-react';
import campusOneLogo from '../../imports/Logo_oficial-1.png';
import { useAuth } from '../contexts/AuthContext';

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
  onLoginOpen?: () => void;
  onNavigate?: (path: string) => void;
}

export function CustomSidebar({ collapsed, onCollapsedChange, onLogoClick, onLoginOpen, onNavigate }: CustomSidebarProps) {
  const { isAuthenticated } = useAuth();

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
        w-64
        ${collapsed ? '-translate-x-full' : 'translate-x-0'}
      `}
      style={{ backgroundColor: sidebarColor }}
    >
      <div className="flex h-full flex-col">
        {/* HEADER */}
        <div className="border-b border-white/10 px-3 py-4">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={onLogoClick}
          >
            {/* LOGO */}
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-md
                bg-white
                overflow-hidden
                p-1.5
              "
            >
              <img
                src={campusOneLogo}
                alt="CampusOne"
                className="w-full h-full object-contain"
              />
            </div>

            {/* TITULO */}
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">
                CampusOne
              </p>

              <p className="text-[11px] text-white/70">
                Universidad de La Serena
              </p>
            </div>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {/* CAMPUSONE ITEMS */}
          <div>
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

            <div className="flex flex-col gap-1">
              {hubItems.map((item, index) => {
                const handleClick = () => {
                  if (item.title === 'Navegación Inteligente') {
                    onNavigate?.('/navegacion-inteligente');
                  } else if (item.title === 'Eficiencia Administrativa') {
                    onNavigate?.('/eficiencia-administrativa');
                  } else if (item.title === 'Empleabilidad y Colaboración') {
                    // If already authenticated, navigate directly; otherwise show login
                    if (isAuthenticated) {
                      onNavigate?.('/empleabilidad-y-colaboracion');
                    } else {
                      onLoginOpen?.();
                    }
                  } else if (item.title === 'Networking y Match Académico') {
                    // If already authenticated, navigate directly; otherwise show login
                    if (isAuthenticated) {
                      onNavigate?.('/networking-y-match-academico');
                    } else {
                      onLoginOpen?.();
                    }
                  } else if (item.title === 'Rating & Analytics') {
                    // If already authenticated, navigate directly; otherwise show login
                    if (isAuthenticated) {
                      onNavigate?.('/rating-y-analytics');
                    } else {
                      onLoginOpen?.();
                    }
                  } else {
                    // Other modules that need login
                    onLoginOpen?.();
                  }
                  onCollapsedChange(true);
                };

                return (
                  <button
                    key={item.title}
                    onClick={handleClick}
                    className={`
                      flex w-full items-center
                      rounded-md
                      px-3 py-2.5
                      text-sm
                      transition
                      gap-3 text-left

                      ${
                        index === 0
                          ? 'bg-white text-[rgb(0,50,130)]'
                          : 'text-white/85 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* AYUDA - FOOTER */}
        <div className="border-t border-white/10 px-2 py-4">
          <button
            className="
              flex w-full items-center
              rounded-md
              px-3 py-2.5
              text-sm
              text-white/85
              transition
              hover:bg-white/10
              hover:text-white
              gap-3 text-left
            "
          >
            <HelpCircle className="h-4 w-4 shrink-0" />
            <span className="truncate">
              Ayuda
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
