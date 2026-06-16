import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Footer() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  const faqs = [
    { question: '¿Necesito una cuenta para usar Tech Hub ULS?', answer: 'No, puedes acceder como visitante, pero algunas funcionalidades requieren registro.' },
    { question: '¿Cómo me registro en la plataforma?', answer: 'Puedes registrarte a través del botón de inicio de sesión con tu correo universitario o personal.' },
    { question: '¿Qué módulos están disponibles para visitantes?', answer: 'Los visitantes pueden acceder a navegación inteligente, eficiencia administrativa y ver algunos módulos públicos.' },
    { question: '¿Cómo puedo seguir un punto de interés en el mapa?', answer: 'Selecciona el punto en el mapa y haz clic en el botón "Seguir" para recibir notificaciones.' },
    { question: '¿Con quién me contacto si tengo problemas técnicos?', answer: 'Puedes usar el formulario de contacto en el footer o escribir a soporte@techubulis.cl' }
  ];

  return (
    <footer className="bg-[#003082] w-full py-16 px-8 text-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* PREGUNTAS FRECUENTES */}
          <div>
            <h2 className="text-white text-sm font-bold mb-6">PREGUNTAS FRECUENTES</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-[#0052CC] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#0052CC]/80 transition-colors"
                  >
                    <span className="text-white text-sm font-medium text-left">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-white flex-shrink-0 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 py-3 bg-[#0052CC]/50 border-t border-white/20">
                      <p className="text-white text-sm">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PRIVACIDAD Y POLÍTICA */}
          <div>
            <div className="mb-8">
              <h2 className="text-white text-sm font-bold mb-4">PRIVACIDAD Y POLÍTICA</h2>
              <div className="bg-[#0052CC] rounded-lg px-4 py-3">
                <p className="text-white text-sm font-medium">Acerca de COMPUS ONE</p>
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-bold mb-4">CRÉDITOS DEL EQUIPO</h3>
              <div className="space-y-2">
                <div className="bg-[#0052CC] rounded-lg px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium">Líder de Proyecto</span>
                    <span className="text-white text-sm">Jose Villanueva</span>
                  </div>
                </div>
                <div className="bg-[#0052CC] rounded-lg px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium">PMO UX</span>
                    <span className="text-white text-sm">Ignacia Miranda</span>
                  </div>
                </div>
                <div className="bg-[#0052CC] rounded-lg px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium">PMO Base de Datos</span>
                    <span className="text-white text-sm">Jose Rodriguez</span>
                  </div>
                </div>
                <div className="bg-[#0052CC] rounded-lg px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium">PMO Arquitectura</span>
                    <span className="text-white text-sm">Pedro Rojas</span>
                  </div>
                </div>
                <div className="bg-[#0052CC] rounded-lg px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium">PMO Frontend</span>
                    <span className="text-white text-sm">Bastian Pizarro</span>
                  </div>
                </div>
                <div className="bg-[#0052CC] rounded-lg px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium">PMO Backend</span>
                    <span className="text-white text-sm">Emilio Maturana</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULARIO DE CONTACTO */}
          <div>
            <h2 className="text-white text-sm font-bold mb-6">FORMULARIO DE CONTACTO</h2>
            <button
              type="button"
              onClick={() => setShowContactForm(true)}
              className="w-full bg-white text-[#003082] text-sm font-bold py-3 rounded-lg transition-colors hover:bg-slate-100 mb-4"
            >
              Formulario de Contacto
            </button>
            {showContactForm && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowContactForm(false)}
                />
                <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 bg-[#003082]">
                    <h3 className="text-white text-sm font-bold">Formulario de Contacto</h3>
                    <button
                      onClick={() => setShowContactForm(false)}
                      aria-label="Cerrar formulario"
                      className="text-white opacity-90 hover:opacity-100 ml-4"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6">
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Nombre y Apellido"
                          className="w-full px-4 py-2 border rounded-lg text-[13px] focus:outline-none"
                        />
                        <input
                          type="email"
                          placeholder="Correo electrónico"
                          className="w-full px-4 py-2 border rounded-lg text-[13px] focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="tel"
                          placeholder="Número de teléfono"
                          className="w-full px-4 py-2 border rounded-lg text-[13px] focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Ciudad"
                          className="w-full px-4 py-2 border rounded-lg text-[13px] focus:outline-none"
                        />
                      </div>
                      <textarea
                        placeholder="Comentario o consulta..."
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg text-[13px] focus:outline-none resize-none"
                      />
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-[#003082] text-white font-bold py-2 rounded-lg"
                        >
                          Enviar mensaje
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowContactForm(false)}
                          className="flex-0 px-4 py-2 border rounded-lg text-[13px]"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8 flex justify-between items-center">
          <p className="text-white text-sm">© 2025 Tech Hub ULS · Universidad de La Serena · Desarrollado por COMPUS ONE</p>
          <p className="text-white text-sm">Meeting Hub Tech · MHT</p>
        </div>
      </div>
    </footer>
  );
}
