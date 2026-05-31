import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EficienciaAdministrativaApp from '../EficienciaAdministrativaApp';
import EficienciaAdministrativaConCuentaApp from '../EficienciaAdministrativaConCuentaApp';

export function EficienciaRouter() {
  const { isAuthenticated, userType } = useAuth();

  useEffect(() => {
    console.log('[EficienciaRouter] Montado - Usuario:', userType, 'Autenticado:', isAuthenticated);
    document.body.style.overflow = 'hidden';
    return () => {
      console.log('[EficienciaRouter] Desmontado');
      document.body.style.overflow = '';
    };
  }, [isAuthenticated, userType]);

  // Si NO está autenticado, mostrar versión sin cuenta (visitante)
  if (!isAuthenticated || userType === 'visitor') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        backgroundColor: 'white'
      }}>
        <EficienciaAdministrativaApp />
      </div>
    );
  }

  // Si está autenticado, mostrar versión con cuenta
  // El componente con cuenta tiene su propio sistema de modo (general/admin) en el selector
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2000,
      backgroundColor: 'white'
    }}>
      <EficienciaAdministrativaConCuentaApp />
    </div>
  );
}
