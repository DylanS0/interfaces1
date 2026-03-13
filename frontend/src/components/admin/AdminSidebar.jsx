import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', description: 'Vista general' },
    { path: '/admin/palettes', label: 'Paletas Globales', icon: '🎨', description: 'CRUD maestro' },
    { path: '/admin/typography', label: 'Tipografías', icon: '📝', description: 'Fuentes del sistema' },
    { path: '/admin/users', label: 'Usuarios', icon: '👥', description: 'Gestión de usuarios' },
    { path: '/admin/settings', label: 'Configuración', icon: '⚙️', description: 'Ajustes globales' }
  ];

  return (
    <aside className="w-72 bg-gray-900 text-white min-h-screen">
      {/* Admin Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">🔧 Admin Panel</h1>
        <p className="text-sm text-gray-400 mt-1">Configuración Global</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                block p-4 rounded-lg mb-2 transition-all
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-800 text-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Sistema Online
        </div>
      </div>
    </aside>
  );
}