import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <span className="text-xl font-bold text-gray-800">Theme Customizer</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to={isAdmin() ? '/admin' : '/dashboard'}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  {isAdmin() ? 'Panel Admin' : 'Mi Dashboard'}
                </Link>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {user.email}
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {user.role}
                    </span>
                  </span>
                  
                  <Button variant="secondary" size="sm" onClick={handleLogout}>
                    Cerrar Sesión
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Iniciar Sesión
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}