import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── SVG paths from design ────────────────────────────────────────────────────
const SVG_SIDEBAR =
  "M12 2V33.5M5.33333 2H28.6667C30.5076 2 32 3.567 32 5.5V30C32 31.933 30.5076 33.5 28.6667 33.5H5.33333C3.49238 33.5 2 31.933 2 30V5.5C2 3.567 3.49238 2 5.33333 2Z";
const SVG_BELL =
  "M17.6481 29.7083C17.3917 30.1503 17.0237 30.5172 16.5809 30.7722C16.1381 31.0273 15.6361 31.1615 15.1252 31.1615C14.6142 31.1615 14.1122 31.0273 13.6694 30.7722C13.2266 30.5172 12.8586 30.1503 12.6022 29.7083M23.8752 10.75C23.8752 8.42936 22.9533 6.20376 21.3123 4.56282C19.6714 2.92187 17.4458 2 15.1252 2C12.8045 2 10.5789 2.92187 8.93797 4.56282C7.29703 6.20376 6.37516 8.42936 6.37516 10.75C6.37516 20.9583 2.00016 23.875 2.00016 23.875H28.2502C28.2502 23.875 23.8752 20.9583 23.8752 10.75Z";
const SVG_INFO =
  "M22 30V22M22 14H22.02M42 22C42 33.0457 33.0457 42 22 42C10.9543 42 2 33.0457 2 22C2 10.9543 10.9543 2 22 2C33.0457 2 42 10.9543 42 22Z";
const SVG_LIST =
  "M8.16667 1.5H25.5M8.16667 9.5H25.5M8.16667 17.5H25.5M1.5 1.5H1.51333M1.5 9.5H1.51333M1.5 17.5H1.51333";
const SVG_USERS =
  "M22.8333 25.5V22.8333C22.8333 21.4188 22.2714 20.0623 21.2712 19.0621C20.271 18.0619 18.9145 17.5 17.5 17.5H6.83333C5.41885 17.5 4.06229 18.0619 3.0621 19.0621C2.0619 20.0623 1.5 21.4188 1.5 22.8333V25.5M30.8333 25.5V22.8333C30.8325 21.6516 30.4391 20.5037 29.7152 19.5698C28.9912 18.6358 27.9775 17.9688 26.8333 17.6733M21.5 1.67333C22.6472 1.96707 23.6641 2.63427 24.3902 3.56975C25.1163 4.50523 25.5105 5.65577 25.5105 6.84C25.5105 8.02423 25.1163 9.17477 24.3902 10.1103C23.6641 11.0457 22.6472 11.7129 21.5 12.0067M17.5 6.83333C17.5 9.77885 15.1122 12.1667 12.1667 12.1667C9.22115 12.1667 6.83333 9.77885 6.83333 6.83333C6.83333 3.88781 9.22115 1.5 12.1667 1.5C15.1122 1.5 17.5 3.88781 17.5 6.83333Z";
const SVG_CAL =
  "M18.8333 1.5V6.5M8.16667 1.5V6.5M1.5 11.5H25.5M4.16667 4H22.8333C24.3061 4 25.5 5.11929 25.5 6.5V24C25.5 25.3807 24.3061 26.5 22.8333 26.5H4.16667C2.69391 26.5 1.5 25.3807 1.5 24V6.5C1.5 5.11929 2.69391 4 4.16667 4Z";
const SVG_MAP_PIN1 =
  "M25.5 13.5C25.5 22.8333 13.5 30.8333 13.5 30.8333C13.5 30.8333 1.5 22.8333 1.5 13.5C1.5 10.3174 2.76428 7.26516 5.01472 5.01472C7.26516 2.76428 10.3174 1.5 13.5 1.5C16.6826 1.5 19.7348 2.76428 21.9853 5.01472C24.2357 7.26516 25.5 10.3174 25.5 13.5Z";
const SVG_MAP_PIN2 =
  "M13.5 17.5C15.7091 17.5 17.5 15.7091 17.5 13.5C17.5 11.2909 15.7091 9.5 13.5 9.5C11.2909 9.5 9.5 11.2909 9.5 13.5C9.5 15.7091 11.2909 17.5 13.5 17.5Z";
const SVG_BRIEFCASE =
  "M20.1667 25.5V4.16667C20.1667 3.45942 19.8857 2.78115 19.3856 2.28105C18.8855 1.78095 18.2072 1.5 17.5 1.5H12.1667C11.4594 1.5 10.7811 1.78095 10.281 2.28105C9.78095 2.78115 9.5 3.45942 9.5 4.16667V25.5M4.16667 6.83333H25.5C26.9728 6.83333 28.1667 8.02724 28.1667 9.5V22.8333C28.1667 24.3061 26.9728 25.5 25.5 25.5H4.16667C2.69391 25.5 1.5 24.3061 1.5 22.8333V9.5C1.5 8.02724 2.69391 6.83333 4.16667 6.83333Z";
const SVG_ACTIVITY =
  "M28.1667 13.5H22.8333L18.8333 25.5L10.8333 1.5L6.83333 13.5H1.5";

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode = "general" | "admin";
type Page = "inicio" | "contactos" | "tutorial";

// ─── Data ─────────────────────────────────────────────────────────────────────
const TRAMITES = [
  { id: 1, nombre: "Tramite 1", dificultad: "Fácil", categoria: "Online" },
  { id: 2, nombre: "Tramite 2", dificultad: "Medio", categoria: "Presencial" },
  { id: 3, nombre: "Tramite 3", dificultad: "Difícil", categoria: "Online" },
  { id: 4, nombre: "Tramite 4", dificultad: "Fácil", categoria: "Presencial" },
  { id: 5, nombre: "Tramite 5", dificultad: "Experto", categoria: "Online" },
  { id: 6, nombre: "Tramite 6", dificultad: "Extremo", categoria: "Presencial" },
];

const CONTACTOS = [
  {
    id: 1,
    nombre: "Ana García",
    cargo: "Directora",
    unidad: "Rectoría",
    correo: "ana.garcia@userena.cl",
    oficina: "Rectoría 101",
  },
  {
    id: 2,
    nombre: "Alberto Muñoz",
    cargo: "Docente",
    unidad: "FING",
    correo: "alberto.munoz@userena.cl",
    oficina: "FING 205",
  },
  {
    id: 3,
    nombre: "Andrés Pérez",
    cargo: "Administrador",
    unidad: "DAF",
    correo: "andres.perez@userena.cl",
    oficina: "DAF 303",
  },
  {
    id: 4,
    nombre: "Bárbara López",
    cargo: "Secretaria",
    unidad: "FACSO",
    correo: "barbara.lopez@userena.cl",
    oficina: "FACSO 102",
  },
  {
    id: 5,
    nombre: "Bernardo Silva",
    cargo: "Docente",
    unidad: "FCT",
    correo: "bernardo.silva@userena.cl",
    oficina: "FCT 204",
  },
  {
    id: 6,
    nombre: "Carlos Rojas",
    cargo: "Jefe de Depto.",
    unidad: "DAE",
    correo: "carlos.rojas@userena.cl",
    oficina: "DAE 401",
  },
  {
    id: 7,
    nombre: "Carmen Vega",
    cargo: "Coordinadora",
    unidad: "DAAE",
    correo: "carmen.vega@userena.cl",
    oficina: "DAAE 210",
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  open,
  onClose,
  onNavigate,
  onExternalNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (p: Page) => void;
  onExternalNavigate?: (path: string) => void;
}) {
  function NavBtn({
    onClick,
    icon,
    label,
  }: {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
      >
        {icon}
        <span className="text-base font-medium">{label}</span>
      </button>
    );
  }

  function SvgIcon({ d, viewBox = "0 0 27 27" }: { d: string | string[]; viewBox?: string }) {
    const paths = Array.isArray(d) ? d : [d];
    return (
      <svg
        className="size-6 shrink-0"
        fill="none"
        viewBox={viewBox}
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths.map((p, i) => (
          <path key={i} d={p} />
        ))}
      </svg>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/25 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed left-0 top-0 bottom-0 z-50 w-[317px] bg-[#003082] text-white flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <button
          onClick={() => {
            onExternalNavigate?.('/');
            onClose();
          }}
          className="flex items-center gap-3 px-4 py-5 border-b border-white/20 hover:bg-white/10 transition-colors cursor-pointer w-full text-left"
        >
          <div className="w-[70px] h-[70px] bg-white rounded-[10px] flex items-center justify-center shrink-0">
            <span className="text-[#003082] font-bold text-xl leading-tight text-center">
              Campus
              <br />
              One
            </span>
          </div>
          <div>
            <p className="font-bold text-2xl leading-tight">CampusOne</p>
            <p className="text-sm text-white/70 mt-0.5">Universidad de La Serena</p>
          </div>
        </button>

        <div className="border-b border-white/20 mx-4 mt-3" />

        {/* Section: Eficiencia Administrativa */}
        <p className="px-4 pt-3 pb-1 text-[13px] font-light text-white/60 tracking-wide">
          Eficiencia Administrativa
        </p>
        <nav className="flex flex-col gap-0.5 px-2">
          <NavBtn
            onClick={() => {
              onNavigate("inicio");
              onClose();
            }}
            icon={<SvgIcon d={SVG_LIST} viewBox="0 0 27 19" />}
            label="Lista de Tramites"
          />
          <NavBtn
            onClick={() => {
              onNavigate("contactos");
              onClose();
            }}
            icon={<SvgIcon d={SVG_USERS} viewBox="0 0 32.3333 27" />}
            label="Contactos"
          />
          <NavBtn
            onClick={onClose}
            icon={<SvgIcon d={SVG_CAL} viewBox="0 0 27 28" />}
            label="Calendario"
          />
        </nav>

        <div className="border-b border-white/20 mx-4 mt-3" />

        {/* Section: Tech Hub ULS */}
        <p className="px-4 pt-3 pb-1 text-[13px] font-light text-white/60 tracking-wide">
          Tech Hub ULS
        </p>
        <nav className="flex flex-col gap-0.5 px-2">
          <NavBtn
            onClick={() => {
              onExternalNavigate?.('/navegacion-inteligente');
              onClose();
            }}
            icon={<SvgIcon d={[SVG_MAP_PIN1, SVG_MAP_PIN2]} viewBox="0 0 27 32.3333" />}
            label="Mapa Campus"
          />
          <NavBtn
            onClick={() => {
              onExternalNavigate?.('/networking-y-match-academico');
              onClose();
            }}
            icon={<SvgIcon d={SVG_USERS} viewBox="0 0 32.3333 27" />}
            label="Networking"
          />
          <NavBtn
            onClick={() => {
              onExternalNavigate?.('/empleabilidad-y-colaboracion');
              onClose();
            }}
            icon={<SvgIcon d={SVG_BRIEFCASE} viewBox="0 0 29.6667 27" />}
            label="Empleabilidad"
          />
          <NavBtn
            onClick={() => {
              onExternalNavigate?.('/');
              onClose();
            }}
            icon={<SvgIcon d={SVG_ACTIVITY} viewBox="0 0 29.6667 27" />}
            label="Rating & Analitics"
          />
        </nav>
      </div>
    </>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
function TopBar({
  onSidebarToggle,
  searchQuery,
  onSearchChange,
  mode,
  onModeChange,
  bellOpen,
  setBellOpen,
}: {
  onSidebarToggle: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  mode: Mode;
  onModeChange: (m: Mode) => void;
  bellOpen: boolean;
  setBellOpen: (v: boolean) => void;
}) {
  const [fOpen, setFOpen] = useState(false);

  const fRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (fRef.current && !fRef.current.contains(e.target as Node)) setFOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setBellOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 h-[72px] flex items-center px-4 gap-3 shadow-sm">
      {/* Sidebar toggle */}
      <button
        onClick={onSidebarToggle}
        className="shrink-0 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        aria-label="Abrir menú lateral"
      >
        <svg
          className="w-8 h-[35px]"
          fill="none"
          viewBox="0 0 34 35.5"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={SVG_SIDEBAR} />
        </svg>
      </button>

      {/* Separator */}
      <div className="h-[30px] w-px bg-black shrink-0" />

      {/* Search */}
      <div className="flex-1 relative min-w-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscador"
          className="w-full h-[50px] border border-black rounded-[15px] px-5 text-xl font-light text-black placeholder:text-black/40 outline-none focus:ring-2 focus:ring-[#003082]/30 bg-white"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Separator */}
      <div className="h-[30px] w-px bg-black shrink-0" />

      {/* Bell */}
      <div className="relative shrink-0" ref={bellRef}>
        <button
          onClick={() => setBellOpen(!bellOpen)}
          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Notificaciones"
        >
          <svg
            className="size-[35px]"
            fill="none"
            viewBox="0 0 30.2503 33.1615"
            stroke="#1E1E1E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={SVG_BELL} />
          </svg>
        </button>

        {bellOpen && (
          <div className="absolute right-0 top-full mt-3 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl w-72 min-h-[100px] flex flex-col">
            <div className="absolute -top-[9px] right-3 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100">
              <p
                className="font-semibold text-sm text-gray-700"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Notificaciones
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-gray-400 text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>
                No hay notificaciones
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="h-[30px] w-px bg-black shrink-0" />

      {/* F dropdown (mode selector) */}
      <div className="relative shrink-0" ref={fRef}>
        <button
          onClick={() => setFOpen(!fOpen)}
          className="w-[45px] h-[45px] rounded-full bg-[#003082] flex items-center justify-center hover:bg-[#002266] transition-colors cursor-pointer"
          aria-label="Modo de acceso"
        >
          <span
            className="text-white font-bold text-2xl leading-none select-none"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            F
          </span>
        </button>

        {fOpen && (
          <div className="absolute right-0 top-full mt-3 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[170px]">
            <div className="absolute -top-[9px] right-4 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />
            <p
              className="px-4 pt-3 pb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Tipo de acceso
            </p>
            <button
              onClick={() => {
                onModeChange("general");
                setFOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50 ${
                mode === "general" ? "text-[#003082] font-semibold bg-[#003082]/5" : "text-gray-700"
              }`}
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  mode === "general" ? "bg-[#003082]" : "bg-gray-300"
                }`}
              />
              General
              {mode === "general" && <span className="ml-auto text-xs">✓</span>}
            </button>
            <button
              onClick={() => {
                onModeChange("admin");
                setFOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50 ${
                mode === "admin" ? "text-[#003082] font-semibold bg-[#003082]/5" : "text-gray-700"
              }`}
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  mode === "admin" ? "bg-[#003082]" : "bg-gray-300"
                }`}
              />
              Administrador
              {mode === "admin" && <span className="ml-auto text-xs">✓</span>}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Inicio Page ──────────────────────────────────────────────────────────────
const DIFICULTAD_STYLE: Record<string, string> = {
  "Fácil": "bg-green-100 text-green-700",
  "Medio": "bg-yellow-100 text-yellow-700",
  "Difícil": "bg-orange-100 text-orange-700",
  "Experto": "bg-red-100 text-red-700",
  "Extremo": "bg-purple-100 text-purple-700",
};

function InicioPage({
  mode,
  searchQuery,
  infoOpen,
  setInfoOpen,
  onNavigateTutorial,
}: {
  mode: Mode;
  searchQuery: string;
  infoOpen: boolean;
  setInfoOpen: (v: boolean) => void;
  onNavigateTutorial: () => void;
}) {
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) setInfoOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setInfoOpen]);

  const filtered = TRAMITES.filter(
    (t) =>
      t.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.dificultad.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Right-side icon column: Grid + Info, fixed below the header aligned right */}
      <div className="fixed top-[80px] right-4 flex flex-col gap-2 z-20">
        {/* Grid icon */}
        <button className="w-11 h-11 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors cursor-pointer bg-white/80 shadow-sm">
          <svg
            className="size-8"
            fill="none"
            viewBox="0 0 40 40"
            stroke="#1E1E1E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 2H2V16H16V2Z" />
            <path d="M38 2H24V16H38V2Z" />
            <path d="M38 24H24V38H38V24Z" />
            <path d="M16 24H2V38H16V24Z" />
          </svg>
        </button>

        {/* Info icon */}
        <div className="relative" ref={infoRef}>
          <button
            onClick={() => setInfoOpen(!infoOpen)}
            className="w-11 h-11 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors cursor-pointer bg-white/80 shadow-sm"
            aria-label="Información sobre dificultades"
          >
            <svg
              className="size-9"
              fill="none"
              viewBox="0 0 44 44"
              stroke="#1E1E1E"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={SVG_INFO} />
            </svg>
          </button>

          {infoOpen && (
            <div className="absolute right-full mr-3 top-0 z-50">
              <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl p-5 w-[300px]">
                <div className="absolute top-3 -right-[9px] w-4 h-4 bg-white border-r border-t border-gray-200 rotate-45" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  Los tramites se dividen en{" "}
                  <strong className="text-[#003082]">5 dificultades</strong>, estas estan basadas
                  en los siguientes criterios:{" "}
                  <strong>comunicación, tiempo estimado y nivel de burocracia.</strong>
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Fácil", "Medio", "Difícil", "Experto", "Extremo"].map((d, i) => {
                    const colors = [
                      "bg-green-100 text-green-700",
                      "bg-yellow-100 text-yellow-700",
                      "bg-orange-100 text-orange-700",
                      "bg-red-100 text-red-700",
                      "bg-purple-100 text-purple-700",
                    ];
                    return (
                      <span key={d} className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[i]}`}>
                        {d}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page content */}
      <div className="p-8 pr-20 max-w-[1100px]">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            {mode === "admin" ? "Panel Administrativo — Trámites" : "Lista de Trámites"}
          </h1>
          <p className="text-gray-500 mt-1">Universidad de La Serena</p>
        </div>

        {/* Admin circular action buttons */}
        {mode === "admin" && (
          <div className="flex gap-3 mb-6">
            <button
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-2xl leading-none hover:bg-gray-800 transition-colors cursor-pointer"
              title="Nuevo Trámite"
            >
              +
            </button>
            <button
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xl leading-none hover:bg-gray-800 transition-colors cursor-pointer"
              title="Eliminar Trámite"
            >
              ✕
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
            <svg
              className="size-12 opacity-30"
              fill="none"
              viewBox="0 0 27 19"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={SVG_LIST} />
            </svg>
            <p className="text-lg">Sin resultados para &ldquo;{searchQuery}&rdquo;</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((tramite) => (
              <button
                key={tramite.id}
                onClick={onNavigateTutorial}
                className="bg-gradient-to-r from-[#003082] to-[rgba(0,94,255,0.8)] rounded-[36px] shadow-[0px_4px_10px_2px_rgba(0,0,0,0.2)] px-8 py-5 flex items-center hover:scale-[1.008] hover:shadow-[0px_6px_14px_4px_rgba(0,48,130,0.3)] transition-all cursor-pointer text-left w-full"
              >
                <span className="text-white text-xl font-light flex-[2]">{tramite.nombre}</span>
                <span className="text-white/50 mx-4 text-lg">|</span>
                <span className="text-white/70 text-base font-light flex-1">{tramite.categoria}</span>
                <span className="text-white/50 mx-4 text-lg">|</span>
                <span className="text-white/70 text-sm font-light w-20 text-right">Dificultad</span>
                <span className="ml-3">
                  <span
                    className={`inline-block px-3 py-0.5 rounded-full text-sm font-semibold ${
                      DIFICULTAD_STYLE[tramite.dificultad] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tramite.dificultad}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Contactos Page ───────────────────────────────────────────────────────────
type Contacto = (typeof CONTACTOS)[number];

function ContactoModal({ c, onClose }: { c: Contacto; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-[#003082] rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {c.nombre[0]}
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{c.nombre}</p>
            <p className="text-gray-500 text-sm">{c.cargo}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Unidad", value: c.unidad },
            {
              label: "Correo",
              value: (
                <a
                  href={`mailto:${c.correo}`}
                  className="text-[#003082] hover:underline break-all"
                >
                  {c.correo}
                </a>
              ),
            },
            { label: "Oficina", value: c.oficina },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3 items-start">
              <span className="w-16 text-xs font-semibold text-gray-400 pt-0.5 shrink-0 uppercase tracking-wide">
                {label}
              </span>
              <span className="text-gray-700 text-sm">{value}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors font-medium"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function ContactosPage({ mode, searchQuery }: { mode: Mode; searchQuery: string }) {
  const [selected, setSelected] = useState<Contacto | null>(null);

  const filtered = CONTACTOS.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.unidad.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, Contacto[]>>((acc, c) => {
    const l = c.nombre[0].toUpperCase();
    (acc[l] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-[1200px] mx-auto" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Contactos</h1>
        <p className="text-gray-500 mt-1">
          {mode === "admin" ? "Gestión de contactos" : "Directorio de la Universidad"}
        </p>
      </div>

      {/* Admin circular action buttons */}
      {mode === "admin" && (
        <div className="flex gap-3 mb-6">
          <button
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-2xl leading-none hover:bg-gray-800 transition-colors cursor-pointer"
            title="Nuevo Contacto"
          >
            +
          </button>
          <button
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xl leading-none hover:bg-gray-800 transition-colors cursor-pointer"
            title="Eliminar Contacto"
          >
            ✕
          </button>
        </div>
      )}

      {Object.keys(grouped)
        .sort()
        .map((letter) => (
          <div key={letter} className="mb-8">
            {/* Letter header */}
            <div className="flex items-center gap-4 mb-3">
              <span
                className="text-5xl font-bold text-gray-900 leading-none"
                style={{ fontFamily: "'Comforter Brush', cursive" }}
              >
                {letter}
              </span>
              <div className="flex-1 h-[3px] bg-black rounded" />
            </div>

            {/* Contact rows */}
            <div className="bg-gradient-to-r from-[#003082] to-[rgba(0,94,255,0.8)] rounded-[36px] shadow-[0px_4px_10px_2px_rgba(0,0,0,0.2)] overflow-hidden">
              {grouped[letter].map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`w-full flex items-center text-white px-8 py-4 text-left hover:bg-white/10 transition-colors cursor-pointer ${
                    i > 0 ? "border-t border-white/20" : ""
                  }`}
                >
                  <span className="flex-[1.2] text-lg font-light truncate">{c.nombre}</span>
                  <span className="flex-1 text-base font-light opacity-80 truncate">
                    | {c.cargo}
                  </span>
                  <span className="flex-1 text-base font-light opacity-80 truncate">
                    | {c.unidad}
                  </span>
                  <span className="flex-[1.3] text-base font-light opacity-80 truncate">
                    | {c.correo}
                  </span>
                  <span className="flex-1 text-base font-light opacity-80 truncate">
                    | {c.oficina}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

      {filtered.length === 0 && (
        <div className="flex items-center justify-center h-48 text-gray-400">
          Sin resultados para &ldquo;{searchQuery}&rdquo;
        </div>
      )}

      {selected && <ContactoModal c={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── Tutorial Tramite Page ────────────────────────────────────────────────────
function TutorialPage({ mode, onBack }: { mode: Mode; onBack: () => void }) {
  const steps = [
    {
      desc: "Descripción del paso a seguir junto con la mención de los horarios de disponibilidad relacionadas.",
      link: "Link relacionado si es que es necesario",
    },
    {
      desc: "Descripción del paso a seguir junto con la mención de los horarios de disponibilidad relacionadas.",
      link: "Link relacionado si es que es necesario",
    },
  ];

  return (
    <div className="relative" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Admin edit icon — fixed top-right below the F button */}
      {mode === "admin" && (
        <div className="fixed top-[80px] right-4 z-20">
          <button
            className="w-11 h-11 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors cursor-pointer bg-white/80 shadow-sm"
            title="Editar trámite"
          >
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#1E1E1E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      )}

      <div className="p-8 pr-20 max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#003082] text-sm font-semibold hover:opacity-70 transition-opacity mb-6"
        >
          ← Volver a la lista
        </button>

        <h1 className="text-4xl font-bold text-black mb-2">Nombre del Tramite</h1>
        <div className="h-[3px] bg-black w-80 mb-3" />
        <p className="text-gray-500 text-sm mb-1">(Categoría · Online / Presencial)</p>
        <p className="text-gray-700 text-lg mb-10">Descripción del tramite</p>

        {steps.map((step, i) => (
          <div key={i} className="mb-10">
            <div className="flex items-start gap-5">
              <span className="text-3xl font-bold text-black shrink-0">{i + 1}.</span>
              <div className="flex-1">
                <p className="text-gray-700 text-base leading-relaxed">{step.desc}</p>
                <p className="text-[#002056] text-sm mt-2 hover:underline cursor-pointer">
                  {step.link}
                </p>
                {/* Image below the link */}
                <div className="mt-4 border border-black rounded-lg w-[140px] h-[120px] flex items-center justify-center bg-gray-50 text-gray-300 text-xs">
                  Imagen de referencia
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState<Mode>("general");
  const [page, setPage] = useState<Page>("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function handleModeChange(m: Mode) {
    setMode(m);
    setPage("inicio");
    setSearchQuery("");
  }

  function handleNavigate(p: Page) {
    setPage(p);
    setSearchQuery("");
  }

  function handleExternalNavigate(path: string) {
    console.log('[Módulo 4 Con Cuenta] Navegando a:', path);
    navigate(path);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        onSidebarToggle={() => setSidebarOpen((v) => !v)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mode={mode}
        onModeChange={handleModeChange}
        bellOpen={bellOpen}
        setBellOpen={setBellOpen}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        onExternalNavigate={handleExternalNavigate}
      />

      <main className="pt-[72px] min-h-screen">
        {page === "inicio" && (
          <InicioPage
            mode={mode}
            searchQuery={searchQuery}
            infoOpen={infoOpen}
            setInfoOpen={setInfoOpen}
            onNavigateTutorial={() => setPage("tutorial")}
          />
        )}
        {page === "contactos" && (
          <ContactosPage mode={mode} searchQuery={searchQuery} />
        )}
        {page === "tutorial" && (
          <TutorialPage mode={mode} onBack={() => setPage("inicio")} />
        )}
      </main>
    </div>
  );
}
