import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const adminMenuItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/palettes', label: 'Paletas Maestro', icon: '🎨' },
  { path: '/admin/typography', label: 'Tipografías', icon: '📝' },
  { path: '/admin/users', label: 'Usuarios', icon: '👥' },
  { path: '/admin/settings', label: 'Configuración', icon: '⚙️' }
];

const clientMenuItems = [
  { path: '/dashboard', label: 'Mi Dashboard', icon: '🏠' },
  { path: '/dashboard/colors', label: 'Colores', icon: '🎨' },
  { path: '/dashboard/typography', label: 'Tipografía', icon: '📝' },
  { path: '/dashboard/palettes', label: 'Mis Paletas', icon: '📚' },
  { path: '/dashboard/accessibility', label: 'Accesibilidad', icon: '♿' }
];

export function Sidebar({ role = 'client' }) {
  const location = useLocation();
  
  const menuItems = role === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {role === 'admin' ? 'Administración' : 'Personalización'}
        </h2>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Tips */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Tip</h4>
          <p className="text-xs text-blue-700">
            Usa Ctrl+Z para deshacer cambios recientes
          </p>
        </div>
      </div>
    </aside>
  );
}