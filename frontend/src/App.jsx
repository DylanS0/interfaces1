import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ClientDashboard } from './pages/ClientDashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClientDashboard />} />
      <Route path="/dashboard" element={<ClientDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;