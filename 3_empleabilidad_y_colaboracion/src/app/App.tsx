import { useEffect, useState } from 'react';
import PublicationsList from './components/PublicationsList';

type UserType = 'estudiante' | 'administrador' | 'empresario';

export default function App() {
  const [initialUserType, setInitialUserType] = useState<UserType>('estudiante');

  useEffect(() => {
    // Get userType from URL parameters
    const params = new URLSearchParams(window.location.search);
    const userType = params.get('userType') as UserType;

    if (userType && ['estudiante', 'administrador', 'empresario'].includes(userType)) {
      setInitialUserType(userType);
    }
  }, []);

  return (
    <div className="size-full">
      <PublicationsList initialUserType={initialUserType} />
    </div>
  );
}