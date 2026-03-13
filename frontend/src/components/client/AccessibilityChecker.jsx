import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { validateColorContrast, getContrastLevel } from '../../utils/colorValidator';

export function AccessibilityChecker() {
  const { state, loadPalette } = useTheme();

  const contrastChecks = [
    { label: 'Texto / Fondo', fg: state.colors.text, bg: state.colors.background },
    { label: 'Primario / Fondo', fg: state.colors.primary, bg: state.colors.background },
    { label: 'Botón / Texto', fg: state.colors.buttonText, bg: state.colors.accent },
    { label: 'Secundario / Fondo', fg: state.colors.secondary, bg: state.colors.background }
  ];

  const handleModeChange = (mode) => {
    if (mode === 'dark') {
      loadPalette({
        colors: {
          primary: '#60A5FA',
          secondary: '#9CA3AF',
          accent: '#34D399',
          background: '#1F2937',
          text: '#F9FAFB',
          buttonText: '#000000'
        },
        mode: 'dark'
      });
    } else if (mode === 'colorblind') {
      loadPalette({
        colors: {
          primary: '#2563EB',
          secondary: '#6B7280',
          accent: '#F59E0B',
          background: '#FEF3C7',
          text: '#1F2937',
          buttonText: '#000000'
        },
        mode: 'colorblind'
      });
    } else {
      loadPalette({
        colors: {
          primary: '#3B82F6',
          secondary: '#64748B',
          accent: '#10B981',
          background: '#F8FAFC',
          text: '#1E293B',
          buttonText: '#FFFFFF'
        },
        mode: 'light'
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">♿ Verificador de Accesibilidad</h3>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Relación de Contraste (WCAG 2.1)</h4>
        <div className="space-y-3">
          {contrastChecks.map((check, idx) => {
            const ratio = validateColorContrast(check.fg, check.bg);
            const level = getContrastLevel(ratio);
            
            return (
              <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${level.bg}`}>
                <div className="flex items-center gap-3">
                  <div className="flex">
                    <div className="w-8 h-8 border border-gray-300 rounded" style={{ backgroundColor: check.fg }} />
                    <div className="w-8 h-8 border border-gray-300 rounded -ml-2" style={{ backgroundColor: check.bg }} />
                  </div>
                  <span className="text-sm text-gray-700">{check.label}</span>
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${level.color}`}>{level.icon} {level.level}</span>
                  <p className="text-xs text-gray-500">{ratio.toFixed(2)}:1</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Modos de Visualización</h4>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleModeChange('light')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              state.mode === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ☀️ Claro
          </button>
          <button
            onClick={() => handleModeChange('dark')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              state.mode === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌙 Oscuro
          </button>
          <button
            onClick={() => handleModeChange('colorblind')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              state.mode === 'colorblind' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👁️ Daltónico
          </button>
        </div>
      </div>
    </div>
  );
}