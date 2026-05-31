import { X, User, Settings, Info, HelpCircle } from 'lucide-react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidePanel({ isOpen, onClose }: SidePanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[2000]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[2001] shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-[#003082]">
            <h2 className="text-xl text-[#003082]">Menú</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
              <button className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
                <User className="w-5 h-5 text-[#003082]" />
                <span className="text-[#003082]">Mi Perfil</span>
              </button>

              <button className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
                <Settings className="w-5 h-5 text-[#003082]" />
                <span className="text-[#003082]">Configuración</span>
              </button>

              <button className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
                <Info className="w-5 h-5 text-[#003082]" />
                <span className="text-[#003082]">Acerca de</span>
              </button>

              <button className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
                <HelpCircle className="w-5 h-5 text-[#003082]" />
                <span className="text-[#003082]">Ayuda</span>
              </button>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-br from-[#003082] to-[#CF142B] rounded-lg">
              <h3 className="text-white mb-2">Universidad de La Serena</h3>
              <p className="text-white text-sm opacity-90">
                Sistema de Navegación Campus v1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
