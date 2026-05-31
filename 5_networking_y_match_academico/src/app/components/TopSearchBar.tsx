import { useState } from 'react';
import { useNavigate } from 'react-router';

interface User {
  id: string;
  name: string;
  career: string;
  type: 'Estudiante' | 'Mentor' | 'Expositor' | 'Administrador';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Carlos Ramírez',
    career: 'Ingeniería en Computación',
    type: 'Mentor'
  },
  {
    id: '2',
    name: 'Ana Fernández',
    career: 'Ingeniería Civil Informática',
    type: 'Estudiante'
  },
  {
    id: '3',
    name: 'Roberto Díaz',
    career: 'Ingeniería en Software',
    type: 'Expositor'
  }
];

export function TopSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = mockUsers.filter(user =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered);
    setIsOpen(true);
  };

  const handleSelectUser = (user: User) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/profile/${user.id}`);
  };

  return (
    <div className="relative w-72">

      {/* INPUT */}
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar personas..."
        className="w-full border px-3 py-2 focus:outline-none"
      />

      {/* RESULTADOS */}
      {isOpen && results.length > 0 && (
        <div className="absolute w-full bg-white border shadow-md z-50">

          {results.map((user) => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">
                {user.career} · {user.type}
              </p>
            </div>
          ))}

        </div>
      )}

      {/* SIN RESULTADOS */}
      {isOpen && results.length === 0 && (
        <div className="absolute w-full bg-white border shadow-md p-3 text-gray-500">
          No se encontraron resultados
        </div>
      )}

    </div>
  );
}