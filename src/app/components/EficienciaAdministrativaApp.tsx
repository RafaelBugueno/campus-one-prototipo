import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import svgPathsInicio from "@/imports/InicioSinCuenta/svg-q451v9z8mh";
import svgPathsSidebar from "@/imports/BarraLateralSinCuenta/svg-xup0yx0r83";
import imgLogo from "@/imports/BarraLateralSinCuenta/6ea58b69f1d64f5516be24fa48d70018b9e1f58b.png";
import imgPlaceholder from "@/imports/TutorialTramiteSinCuenta/7b07c3ad34bf554920e81db89c135fc0cf161ad9.png";

type Page = "inicio" | "contactos" | "tutorial";
type ViewMode = "general" | "administrador";

// ────────── Icons ──────────

function HamburgerIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 35.5">
      <path d={svgPathsInicio.pf8bf000} stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.2503 33.1615">
      <path d={svgPathsInicio.p1677d580} stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

function UserIconWhite({ viewBox = "0 0 27.3333 30.25" }: { viewBox?: string }) {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={viewBox}>
      <path d={svgPathsInicio.p3cea2470} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
      <path d={svgPathsInicio.p2f898100} stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
      <g>
        <path d="M16 2H2V16H16V2Z" stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <path d="M38 2H24V16H38V2Z" stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <path d="M38 24H24V38H38V24Z" stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <path d="M16 24H2V38H16V24Z" stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      </g>
    </svg>
  );
}

// ────────── Navbar ──────────

function Navbar({
  onSidebarClick,
  viewMode,
  onViewModeChange
}: {
  onSidebarClick: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const { userType } = useAuth();
  const [search, setSearch] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bellOpen) return;
    function handler(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bellOpen]);

  useEffect(() => {
    if (!viewMenuOpen) return;
    function handler(e: MouseEvent) {
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
        setViewMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [viewMenuOpen]);

  const showViewSelector = userType === 'admin';

  return (
    <div className="relative flex items-center h-[60px] mx-8 my-4">
      <div className="absolute inset-0 bg-white border border-black rounded-[15px]" />
      {/* Sidebar button */}
      <button
        onClick={onSidebarClick}
        className="relative z-10 ml-3 w-[36px] h-[36px] flex items-center justify-center cursor-pointer"
        aria-label="Abrir menú"
      >
        <HamburgerIcon />
      </button>
      {/* Left divider */}
      <div className="relative z-10 mx-3 w-px h-[26px] bg-black" />
      {/* Search input */}
      <input
        className="relative z-10 flex-1 text-center text-[20px] font-light text-black bg-transparent outline-none placeholder:text-black/50"
        style={{ fontFamily: "sans-serif" }}
        placeholder="Buscador"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Buscador"
      />
      {/* Right divider */}
      <div className="relative z-10 mx-3 w-px h-[26px] bg-black" />
      {/* Bell with dropdown */}
      <div className="relative z-10 mr-4" ref={bellRef}>
        <button
          className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
          onClick={() => setBellOpen((v) => !v)}
          aria-label="Notificaciones"
        >
          <BellIcon />
        </button>
        {bellOpen && (
          <div className="absolute top-full right-0 mt-2 w-[240px] bg-white border border-gray-200 rounded-xl shadow-xl z-30">
            <div className="px-4 py-3 text-sm text-gray-400 text-center select-none">
              No hay notificaciones
            </div>
          </div>
        )}
      </div>
      {/* View Mode Selector (solo para admin) */}
      {showViewSelector && (
        <div className="relative z-10 mr-3" ref={viewMenuRef}>
          <button
            onClick={() => setViewMenuOpen((v) => !v)}
            className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <span className="text-xs text-gray-500">TIPO DE ACCESO</span>
            <span>{viewMode === 'administrador' ? 'Administrador' : 'General'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {viewMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-30 overflow-hidden">
              <button
                onClick={() => {
                  onViewModeChange('general');
                  setViewMenuOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                  viewMode === 'general' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${viewMode === 'general' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                General
              </button>
              <button
                onClick={() => {
                  onViewModeChange('administrador');
                  setViewMenuOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                  viewMode === 'administrador' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${viewMode === 'administrador' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                Administrador
              </button>
            </div>
          )}
        </div>
      )}

      {/* User circle */}
      <div className="relative z-10 mr-3 w-[40px] h-[40px] rounded-full bg-[#003082] flex items-center justify-center">
        <div className="w-[22px] h-[22px]">
          <UserIconWhite />
        </div>
      </div>
    </div>
  );
}

// ────────── Sliding Sidebar ──────────

function SidebarPanel({
  isOpen,
  onClose,
  onNavigate,
  onExternalNavigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  onExternalNavigate: (path: string) => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[316px] bg-[#003082] z-50 transition-transform duration-300 ease-in-out flex flex-col`}
        style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* Header: logo + name */}
        <button
          onClick={() => onExternalNavigate('/')}
          className="flex items-center gap-3 px-4 pt-8 pb-4 w-full text-left hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="w-[70px] h-[70px] bg-white rounded-[10px] flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={imgLogo} alt="Logo CampusOne" className="w-full h-full object-cover" />
          </div>
          <span className="text-white text-[28px] font-bold leading-none" style={{ fontFamily: "sans-serif" }}>
            CampusOne
          </span>
        </button>

        {/* Subtitle */}
        <div className="px-4 pb-2">
          <div className="w-full h-px bg-white/30 mb-2" />
          <p className="text-white/80 text-[14px] font-light" style={{ fontFamily: "sans-serif" }}>
            Eficiencia Administrativa
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col px-4 pt-4 gap-1">
          <SidebarItem
            icon={
              <svg className="block size-full" fill="none" viewBox="0 0 27 19">
                <path d={svgPathsSidebar.p267b2060} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            }
            label="Lista de Tramites"
            onClick={() => onNavigate("inicio")}
          />
          <SidebarItem
            icon={
              <svg className="block size-full" fill="none" viewBox="0 0 32.3333 27">
                <path d={svgPathsSidebar.p2ce69c80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            }
            label="Contactos"
            onClick={() => onNavigate("contactos")}
          />

          <div className="mt-2 mb-1">
            <p className="text-white/70 text-[13px] font-light px-1" style={{ fontFamily: "sans-serif" }}>Tech Hub ULS</p>
          </div>

          <SidebarItem
            icon={
              <svg className="block size-full" fill="none" viewBox="0 0 27 32.3333">
                <path d={svgPathsSidebar.pb2b3f00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPathsSidebar.p3673b70} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            }
            label="Mapa Campus"
            onClick={() => onExternalNavigate('/navegacion-inteligente')}
          />
          <SidebarItem
            icon={
              <svg className="block size-full" fill="none" viewBox="0 0 32.3333 27">
                <path d={svgPathsSidebar.p33d38600} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            }
            label="Networking"
            onClick={() => onExternalNavigate('/networking-y-match-academico')}
          />
          <SidebarItem
            icon={
              <svg className="block size-full" fill="none" viewBox="0 0 29.6667 27">
                <path d={svgPathsSidebar.p13f1a000} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            }
            label="Empleabilidad"
            onClick={() => onExternalNavigate('/empleabilidad-y-colaboracion')}
          />
          <SidebarItem
            icon={
              <svg className="block size-full" fill="none" viewBox="0 0 29.6667 27">
                <path d={svgPathsSidebar.p14aad500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            }
            label="Rating & Analitics"
            onClick={() => onExternalNavigate('/')}
          />
        </nav>
      </div>
    </>
  );
}

function SidebarItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer w-full text-left"
    >
      <div className="w-[26px] h-[26px] flex-shrink-0">{icon}</div>
      <span className="text-white text-[16px] font-medium" style={{ fontFamily: "sans-serif" }}>
        {label}
      </span>
    </button>
  );
}

// ────────── Tramite Row ──────────

function TramiteRow({
  name,
  dificultad,
  onClick,
  isLast = false,
}: {
  name: string;
  dificultad: string;
  onClick: () => void;
  isLast?: boolean;
}) {
  return (
    <>
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer"
      >
        <span className="text-white text-[26px] font-light" style={{ fontFamily: "sans-serif" }}>
          {name}
        </span>
        <span className="text-white text-[26px] font-light" style={{ fontFamily: "sans-serif" }}>
          {dificultad}
        </span>
      </button>
      {!isLast && <div className="w-full h-px bg-white/40 mx-6" style={{ width: "calc(100% - 3rem)" }} />}
    </>
  );
}

// ────────── Tramite Group ──────────

function TramiteGroup({
  letter,
  tramites,
  onTramiteClick,
}: {
  letter: string;
  tramites: { name: string; dificultad: string }[];
  onTramiteClick: () => void;
}) {
  return (
    <div className="bg-white border border-[rgba(0,0,0,0.5)] rounded-[40px] shadow-[-4px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
      {/* Category label row */}
      <div className="flex items-center gap-4 px-6 pt-5 pb-3">
        <div className="w-px bg-black self-stretch" />
        <span className="text-black text-[52px] leading-none" style={{ fontFamily: "'Comforter Brush', cursive, sans-serif" }}>
          {letter}
        </span>
        <div className="flex-1 h-px bg-black mt-8" />
      </div>
      {/* Blue gradient band */}
      <div className="mx-6 mb-5 rounded-[35px] bg-gradient-to-r from-[#003082] to-[rgba(0,94,255,0.8)] shadow-[0px_4px_4px_5px_rgba(0,0,0,0.25)] overflow-hidden">
        {tramites.map((t, i) => (
          <TramiteRow
            key={i}
            name={t.name}
            dificultad={t.dificultad}
            onClick={onTramiteClick}
            isLast={i === tramites.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

// ────────── Admin Pages ──────────

function AdminInicioPage() {
  return (
    <div className="px-8 pb-8">
      <div className="bg-gradient-to-r from-[#003082] to-[rgba(0,94,255,0.8)] rounded-[40px] p-8 text-white mb-6">
        <h1 className="text-4xl font-bold mb-2">Panel de Administrador</h1>
        <p className="text-lg opacity-90">Gestión de trámites y usuarios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Total de Trámites</h3>
          <p className="text-4xl font-bold text-[#003082]">24</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Usuarios Activos</h3>
          <p className="text-4xl font-bold text-[#003082]">156</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Consultas Pendientes</h3>
          <p className="text-4xl font-bold text-[#003082]">8</p>
        </div>
      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-[#003082] text-white rounded-lg hover:bg-[#002060] transition-colors text-left">
            <h3 className="font-bold mb-1">Gestionar Trámites</h3>
            <p className="text-sm opacity-90">Agregar, editar o eliminar trámites</p>
          </button>
          <button className="p-4 bg-[#003082] text-white rounded-lg hover:bg-[#002060] transition-colors text-left">
            <h3 className="font-bold mb-1">Ver Estadísticas</h3>
            <p className="text-sm opacity-90">Analítica y reportes del sistema</p>
          </button>
          <button className="p-4 bg-[#003082] text-white rounded-lg hover:bg-[#002060] transition-colors text-left">
            <h3 className="font-bold mb-1">Gestionar Usuarios</h3>
            <p className="text-sm opacity-90">Administrar cuentas y permisos</p>
          </button>
          <button className="p-4 bg-[#003082] text-white rounded-lg hover:bg-[#002060] transition-colors text-left">
            <h3 className="font-bold mb-1">Configuración</h3>
            <p className="text-sm opacity-90">Ajustes del sistema</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────── InicioPage ──────────

function InicioPage({ onTramiteClick }: { onTramiteClick: () => void }) {
  const [gridTooltip, setGridTooltip] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!infoOpen) return;
    function handler(e: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setInfoOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [infoOpen]);

  const grupoA = [
    { name: "Tramite 1", dificultad: "Dificultad" },
    { name: "Tramite 2", dificultad: "Dificultad" },
    { name: "Tramite 3", dificultad: "Dificultad" },
  ];
  const grupoB = [
    { name: "Tramite 1", dificultad: "Dificultad" },
    { name: "Tramite 2", dificultad: "Dificultad" },
    { name: "Tramite 3", dificultad: "Dificultad" },
  ];

  return (
    <div className="px-8 pb-8">
      {/* Top toolbar row: Grid + Info icons */}
      <div className="flex items-center justify-end gap-3 mb-4">
        {/* Grid icon with "Ordenar" tooltip */}
        <div className="relative">
          <button
            className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setGridTooltip(true)}
            onMouseLeave={() => setGridTooltip(false)}
            onClick={() => setGridTooltip(false)}
            aria-label="Ordenar"
          >
            <GridIcon />
          </button>
          {gridTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg z-10">
              Ordenar
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
            </div>
          )}
        </div>

        {/* Info icon with click popover */}
        <div className="relative" ref={infoRef}>
          <button
            className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
            onClick={() => setInfoOpen((v) => !v)}
            aria-label="Información sobre dificultades"
          >
            <InfoIcon />
          </button>
          {infoOpen && (
            <div className="absolute right-0 top-full mt-2 w-[360px] bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-20 text-sm text-gray-700 leading-relaxed">
              Los tramites se dividen en 5 dificultades, estas estan basadas en los siguientes criterios: comunicación, tiempo estimado y nivel de burocracia.
              <div className="absolute bottom-full right-4 border-8 border-transparent border-b-white" />
            </div>
          )}
        </div>
      </div>

      {/* Tramite groups */}
      <div className="flex flex-col gap-6">
        <TramiteGroup letter="A" tramites={grupoA} onTramiteClick={onTramiteClick} />
        <TramiteGroup letter="B" tramites={grupoB} onTramiteClick={onTramiteClick} />
      </div>
    </div>
  );
}

// ────────── ContactosPage ──────────

function ContactRow({ name, cargo, unidad, correo, oficina }: { name: string; cargo: string; unidad: string; correo: string; oficina: string }) {
  return (
    <button
      className="flex items-center justify-between w-full px-6 py-4 border-b border-white/30 last:border-0 text-white font-light text-[18px] gap-4 hover:bg-white/10 transition-colors cursor-pointer text-left"
      style={{ fontFamily: "sans-serif" }}
    >
      <span className="flex-[2]">{name}</span>
      <span className="text-white/60">|</span>
      <span className="flex-[2]">{cargo}</span>
      <span className="text-white/60">|</span>
      <span className="flex-[2]">{unidad}</span>
      <span className="text-white/60">|</span>
      <span className="flex-[2]">{correo}</span>
      <span className="text-white/60">|</span>
      <span className="flex-[1]">{oficina}</span>
    </button>
  );
}

function ContactGroup({ letter, contacts }: { letter: string; contacts: { name: string; cargo: string; unidad: string; correo: string; oficina: string }[] }) {
  return (
    <div className="bg-white border border-[rgba(0,0,0,0.5)] rounded-[40px] shadow-[-4px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
      <div className="flex items-center gap-4 px-6 pt-5 pb-3">
        <div className="w-px bg-black self-stretch" />
        <span className="text-black text-[52px] leading-none" style={{ fontFamily: "'Comforter Brush', cursive, sans-serif" }}>
          {letter}
        </span>
        <div className="flex-1 h-px bg-black mt-8" />
      </div>
      <div className="mx-6 mb-5 rounded-[35px] bg-gradient-to-r from-[#003082] to-[rgba(0,94,255,0.8)] shadow-[0px_4px_4px_5px_rgba(0,0,0,0.25)] overflow-hidden">
        {contacts.map((c, i) => (
          <ContactRow key={i} {...c} />
        ))}
      </div>
    </div>
  );
}

function ContactosPage() {
  const contacts = [
    { name: "nombre 1", cargo: "cargo 1", unidad: "unidad 1", correo: "correo 1", oficina: "oficina 1" },
    { name: "nombre 2", cargo: "cargo 2", unidad: "unidad 2", correo: "correo 2", oficina: "oficina 2" },
    { name: "nombre 3", cargo: "cargo 3", unidad: "unidad 3", correo: "correo 3", oficina: "oficina 3" },
  ];

  return (
    <div className="px-8 pb-8">
      <div className="flex flex-col gap-6">
        <ContactGroup letter="A" contacts={contacts} />
        <ContactGroup letter="B" contacts={contacts} />
      </div>
    </div>
  );
}

// ────────── TutorialPage ──────────

function TutorialStep({ number, description, link, imageSrc }: { number: number; description: string; link: string; imageSrc: string }) {
  return (
    <div className="bg-white border border-[rgba(0,0,0,0.5)] rounded-[40px] shadow-[-4px_4px_4px_0px_rgba(0,0,0,0.25)] p-8">
      <p className="text-black text-[18px] mb-2" style={{ fontFamily: "sans-serif" }}>
        <span className="text-[26px] font-semibold">{number}.</span>{" "}
        <span className="font-medium">{description}</span>
      </p>
      <p className="text-[#002056] text-[16px] mb-6" style={{ fontFamily: "sans-serif" }}>
        {link}
      </p>
      <div className="flex items-center gap-6">
        <div className="w-[100px] h-[100px] flex-shrink-0 border border-black rounded overflow-hidden">
          <img src={imageSrc} alt="Imagen de referencia" className="w-full h-full object-cover" />
        </div>
        <p className="text-black text-[16px] font-medium" style={{ fontFamily: "sans-serif" }}>
          Imagen de referencia para este paso
        </p>
      </div>
    </div>
  );
}

function TutorialPage() {
  return (
    <div className="px-8 pb-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-black" style={{ fontFamily: "sans-serif" }}>
          Nombre del Tramite
        </h1>
        <div className="w-[280px] h-[2px] bg-black mt-1 mb-2" />
        <p className="text-black text-[14px] font-light">(Categoría (Online/Presencial))</p>
        <p className="text-black text-[16px] mt-1">Descripción del tramite</p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-6">
        <TutorialStep
          number={1}
          description="Descripción del paso a seguir junto con la mención de los horarios de disponibilidad relacionadas."
          link="Link relacionado si es que es necesario"
          imageSrc={imgPlaceholder}
        />
        <TutorialStep
          number={2}
          description="Descripción del paso a seguir junto con la mención de los horarios de disponibilidad relacionadas."
          link="Link relacionado si es que es necesario"
          imageSrc={imgPlaceholder}
        />
      </div>
    </div>
  );
}

// ────────── App ──────────

export default function App() {
  const { userType } = useAuth();
  const [page, setPage] = useState<Page>("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Si el usuario es admin, iniciar en modo administrador
    return userType === 'admin' ? 'administrador' : 'general';
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[Módulo 4] App montado, página:', page, 'viewMode:', viewMode, 'userType:', userType);
  }, [page, viewMode, userType]);

  // Actualizar viewMode cuando cambie el userType
  useEffect(() => {
    if (userType === 'admin') {
      console.log('[Módulo 4] Usuario admin detectado, cambiando a vista administrador');
      setViewMode('administrador');
    } else if (userType && userType !== 'admin') {
      setViewMode('general');
    }
  }, [userType]);

  function handleNavigate(p: Page) {
    setPage(p);
    setSidebarOpen(false);
  }

  function handleExternalNavigate(path: string) {
    console.log('[Módulo 4] Navegando a:', path);
    setSidebarOpen(false);
    navigate(path);
  }

  function handleViewModeChange(mode: ViewMode) {
    console.log('[Módulo 4] Cambiando vista a:', mode);
    setViewMode(mode);
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-white flex flex-col">
      <Navbar
        onSidebarClick={() => setSidebarOpen(true)}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      <main className="flex-1 overflow-y-auto">
        {viewMode === 'administrador' ? (
          // Vista de Administrador
          <>
            {page === "inicio" && <AdminInicioPage />}
            {page === "contactos" && <ContactosPage />}
            {page === "tutorial" && <TutorialPage />}
          </>
        ) : (
          // Vista General (Visitante)
          <>
            {page === "inicio" && <InicioPage onTramiteClick={() => setPage("tutorial")} />}
            {page === "contactos" && <ContactosPage />}
            {page === "tutorial" && <TutorialPage />}
          </>
        )}
      </main>

      <SidebarPanel
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        onExternalNavigate={handleExternalNavigate}
      />
    </div>
  );
}
