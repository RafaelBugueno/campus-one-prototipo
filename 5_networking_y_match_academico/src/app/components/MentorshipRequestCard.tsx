import { useState } from 'react';
import { Button } from './ui/button';

interface MentorshipRequest {
  id: string;
  name: string;
  career: string;
  type: 'Estudiante' | 'Mentor' | 'Expositor';
  message?: string;
  requestedTime: string;
}

interface Props {
  request: MentorshipRequest;
}

export function MentorshipRequestCard({ request }: Props) {
  const [status, setStatus] = useState<'pendiente' | 'aceptado' | 'rechazado'>('pendiente');

  const handleAccept = () => {
    setStatus('aceptado');
  };

  const handleReject = () => {
    setStatus('rechazado');
  };

  return (
    <div className="border p-4 rounded-none shadow-sm bg-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="font-semibold">{request.name}</h4>
          <p className="text-sm text-gray-500">
            {request.career} · {request.type}
          </p>
        </div>

        <span className="text-sm text-blue-600 font-medium">
          {request.requestedTime}
        </span>
      </div>

      {/* MENSAJE */}
      {request.message && (
        <p className="text-sm bg-gray-100 p-2 mb-3">
          {request.message}
        </p>
      )}

      {/* ESTADO */}
      {status === 'pendiente' && (
        <div className="flex gap-2">
          <Button onClick={handleAccept}>
            Aceptar
          </Button>

          <Button variant="destructive" onClick={handleReject}>
            Rechazar
          </Button>
        </div>
      )}

      {status === 'aceptado' && (
        <div className="text-green-600 font-semibold">
          ✔ Solicitud aceptada
        </div>
      )}

      {status === 'rechazado' && (
        <div className="text-red-600 font-semibold">
          ✖ Solicitud rechazada
        </div>
      )}
    </div>
  );
}