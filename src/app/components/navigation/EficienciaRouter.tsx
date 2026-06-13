import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EficienciaAdministrativaApp from '../EficienciaAdministrativaApp';
import EficienciaAdministrativaConCuentaApp from '../EficienciaAdministrativaConCuentaApp';
import { Footer } from '../Footer';

export function EficienciaRouter() {
  const { isAuthenticated, userType } = useAuth();

  useEffect(() => {
    console.log('[EficienciaRouter] Montado - Usuario:', userType, 'Autenticado:', isAuthenticated);
    return () => {
      console.log('[EficienciaRouter] Desmontado');
    };
  }, [isAuthenticated, userType]);

  // Si NO está autenticado, mostrar versión sin cuenta (visitante)
  if (!isAuthenticated || userType === 'visitor') {
    return (
      <div className="min-h-screen w-screen flex flex-col bg-white z-[2000]">
        <div className="flex-1">
          <EficienciaAdministrativaApp />
        </div>
        <Footer />
      </div>
    );
  }

  // Si está autenticado, mostrar versión con cuenta
  // El componente con cuenta tiene su propio sistema de modo (general/admin) en el selector
  return (
    <div className="min-h-screen w-screen flex flex-col bg-white z-[2000]">
      <div className="flex-1">
        <EficienciaAdministrativaConCuentaApp />
      </div>
      <Footer />
    </div>
  );
}
