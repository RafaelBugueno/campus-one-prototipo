import { useState } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  unread?: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  read?: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hola, ¿cómo estás?', sender: 'other', timestamp: '10:30', read: true },
    { id: '2', text: 'Hola! Todo bien, ¿y tú?', sender: 'me', timestamp: '10:32', read: true },
    { id: '3', text: 'Genial, te quería preguntar sobre el proyecto', sender: 'other', timestamp: '10:33', read: false }
  ]);

  const [contacts] = useState<ChatContact[]>([
    {
      id: '1',
      name: 'Carlos Ramírez González',
      lastMessage: 'Genial, te quería preguntar sobre el proyecto',
      unread: 2
    },
    {
      id: '2',
      name: 'Ana Fernández Silva',
      lastMessage: 'Nos vemos mañana entonces',
      unread: 0
    },
    {
      id: '3',
      name: 'Roberto Díaz Morales',
      lastMessage: 'Perfecto, gracias!',
      unread: 1
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim() && selectedContact) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: message,
          sender: 'me',
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          read: false
        }
      ]);
      setMessage('');
    }
  };

  const totalUnread = contacts.reduce((sum, contact) => sum + (contact.unread || 0), 0);

  return (
    <>
      {/* ICONO ESTÁTICO */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          relative flex h-10 w-10 items-center justify-center
          text-black transition hover:bg-gray-100 rounded-full
          focus:outline-none
        "
        title="Mensajes"
      >
        <MessageCircle className="h-5 w-5" />
        {totalUnread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {totalUnread}
          </span>
        )}
      </button>

      {/* VENTANA DE CHAT */}
      {isOpen && (
        <>
          {/* Overlay para móvil - respeta sidebar */}
          <div
            className="fixed inset-0 left-12 md:left-0 bg-black/50 z-[100] md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Ventana de chat - respeta sidebar en móvil */}
          <div className="fixed top-0 bottom-0 left-12 right-0 md:inset-auto md:bottom-4 md:right-4 md:left-auto md:top-auto md:w-96 md:h-[500px] md:rounded-xl h-[100dvh] bg-white md:border-2 border-gray-300 shadow-2xl z-[101] flex flex-col overflow-hidden">
            {/* HEADER */}
            <div className="text-white p-4 flex justify-between items-center flex-shrink-0" style={{ backgroundColor: 'rgb(0,50,130)' }}>
              <h3 className="font-semibold truncate">
                {selectedContact ? selectedContact.name : 'Mensajes'}
              </h3>
              <div className="flex gap-2 flex-shrink-0">
                {selectedContact && (
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="hover:bg-white/20 p-1.5 rounded transition"
                  >
                    <Minimize2 className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1.5 rounded transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* CONTENIDO */}
            {!selectedContact ? (
              /* LISTA DE CONTACTOS */
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {contacts.map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="p-4 border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {contact.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{contact.name}</p>
                            <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                          </div>
                        </div>
                      </div>
                      {contact.unread && contact.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center flex-shrink-0">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* VENTANA DE CHAT */
              <>
                {/* MENSAJES */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 bg-gray-50">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-lg ${
                          msg.sender === 'me'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p
                            className={`text-xs ${
                              msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'
                            }`}
                          >
                            {msg.timestamp}
                          </p>
                          {msg.sender === 'me' && (
                            <span className="text-xs">
                              {msg.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* INPUT */}
                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 safe-bottom">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Escribe un mensaje..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
