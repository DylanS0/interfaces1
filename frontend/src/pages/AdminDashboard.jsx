import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { Header } from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPalettes: 0,
    activeClients: 0,
    systemHealth: 'OK'
  });

  useEffect(() => {
    // Load dashboard stats (mock data for now)
    setStats({
      totalUsers: 150,
      totalPalettes: 45,
      activeClients: 23,
      systemHealth: 'OK'
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
            <p className="text-gray-500 mt-1">Bienvenido, {user.email}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Usuarios</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
                <span className="text-4xl">👥</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Paletas Creadas</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalPalettes}</p>
                </div>
                <span className="text-4xl">🎨</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Clientes Activos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeClients}</p>
                </div>
                <span className="text-4xl">🟢</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Estado del Sistema</p>
                  <p className="text-3xl font-bold text-green-600">{stats.systemHealth}</p>
                </div>
                <span className="text-4xl">✅</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/admin/palettes" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="text-2xl mb-2 block">🎨</span>
                <h3 className="font-medium text-gray-800">Gestionar Paletas</h3>
                <p className="text-sm text-gray-500">CRUD de paletas maestras</p>
              </a>

              <a href="/admin/typography" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-2xl mb-2 block">📝</span>
                <h3 className="font-medium text-gray-800">Tipografías</h3>
                <p className="text-sm text-gray-500">Fuentes del sistema</p>
              </a>

              <a href="/admin/users" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="text-2xl mb-2 block">👥</span>
                <h3 className="font-medium text-gray-800">Usuarios</h3>
                <p className="text-sm text-gray-500">Gestión de accesos</p>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}