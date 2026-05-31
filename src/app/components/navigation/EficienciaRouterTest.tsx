export function EficienciaRouterTest() {
  console.log('[EficienciaRouterTest] RENDERIZADO CORRECTAMENTE');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 3000,
      backgroundColor: '#003082',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✓ Módulo 4</h1>
        <p>Eficiencia Administrativa</p>
        <p style={{ fontSize: '16px', marginTop: '20px', opacity: 0.8 }}>
          Si ves esto, la ruta funciona correctamente
        </p>
      </div>
    </div>
  );
}
