import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import VisitorView from './components/VisitorView';
import StudentView from './components/StudentView';
import AdminView from './components/AdminView';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'visitor' | 'student' | 'admin'>('home');

  const handleSelectRole = (role: 'visitor' | 'student' | 'admin') => {
    setCurrentView(role);
  };

  const handleGoHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="size-full">
      {currentView === 'home' && <HomeScreen onSelectRole={handleSelectRole} />}
      {currentView === 'visitor' && <VisitorView onGoHome={handleGoHome} />}
      {currentView === 'student' && <StudentView onGoHome={handleGoHome} />}
      {currentView === 'admin' && <AdminView onGoHome={handleGoHome} />}
    </div>
  );
}