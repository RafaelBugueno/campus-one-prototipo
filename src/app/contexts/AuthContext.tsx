import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'visitor' | 'student' | 'admin' | 'empresario' | 'mentor' | 'organizer' | null;

interface AuthContextType {
  userType: UserType;
  isAuthenticated: boolean;
  login: (type: 'student' | 'admin' | 'empresario' | 'mentor' | 'organizer', email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'campus_one_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(() => {
    // Initialize from localStorage
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      console.log('[AuthContext] Initializing from localStorage:', stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[AuthContext] Parsed userType:', parsed.userType);
        return parsed.userType || null;
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
    return null;
  });

  // Persist to localStorage whenever userType changes
  useEffect(() => {
    try {
      if (userType && userType !== 'visitor') {
        console.log('[AuthContext] Saving to localStorage:', userType);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userType }));
      } else {
        console.log('[AuthContext] Removing from localStorage');
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }, [userType]);

  const login = (type: 'student' | 'admin' | 'empresario' | 'mentor' | 'organizer', email: string) => {
    setUserType(type);
    console.log(`Usuario ${email} ha iniciado sesión como ${type}`);
  };

  const logout = () => {
    setUserType(null);
    console.log('Usuario ha cerrado sesión');
  };

  const isAuthenticated = userType !== null && userType !== 'visitor';

  console.log('[AuthContext] Current state - userType:', userType, 'isAuthenticated:', isAuthenticated);

  return (
    <AuthContext.Provider value={{ userType, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
