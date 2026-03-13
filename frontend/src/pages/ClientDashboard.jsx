import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ColorPicker } from '../components/client/ColorPicker';
import { FontUploader } from '../components/client/FontUploader';
import { LivePreview } from '../components/client/LivePreview';
import { AccessibilityChecker } from '../components/client/AccessibilityChecker';
import { Toast } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export function ClientDashboard() {
  const { 
    state, 
    updateColor, 
    updateTypography, 
    handleUndo, 
    canUndo,
    loadPalette,
    defaultPalettes,
    savedPalettes,
    saveCustomPalette,
    deleteCustomPalette
  } = useTheme();
  
  const [activeTab, setActiveTab] = useState('colors');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [paletteName, setPaletteName] = useState('');

  const handleSave = () => {
    setToast({ show: true, message: '¡Cambios guardados en el navegador!', type: 'success' });
  };

  const handleReset = () => {
    if (window.confirm('¿Resetear todos los cambios?')) {
      window.localStorage.removeItem('theme-settings');
      window.location.reload();
    }
  };

  const handleSavePalette = () => {
    if (!paletteName.trim()) {
      setToast({ show: true, message: 'Ingresa un nombre para la paleta', type: 'error' });
      return;
    }
    saveCustomPalette(paletteName, state.colors, state.mode);
    setShowSaveModal(false);
    setPaletteName('');
    setToast({ show: true, message: 'Paleta guardada', type: 'success' });
  };

  const handleLoadPalette = (palette) => {
    loadPalette(palette);
    setToast({ show: true, message: `Paleta "${palette.name}" cargada`, type: 'success' });
  };

  const handleDeletePalette = (palette) => {
    if (window.confirm(`¿Eliminar "${palette.name}"?`)) {
      deleteCustomPalette(palette.id);
      setToast({ show: true, message: 'Paleta eliminada', type: 'info' });
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎨</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Theme Customizer</h1>
                <p className="text-xs text-gray-500">Personaliza colores y tipografía en tiempo real</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  canUndo
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                title="Ctrl+Z"
              >
                ↩️ Deshacer
              </button>
              
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                🔄 Resetear
              </button>
              
              <button
                onClick={() => setShowSaveModal(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
              >
                💾 Guardar Paleta
              </button>
              
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600"
              >
                ✓ Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm p-2">
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'colors', label: '🎨 Colores', icon: '🎨' },
                  { id: 'palettes', label: '📚 Paletas', icon: '📚' },
                  { id: 'typography', label: '📝 Tipografía', icon: '📝' },
                  { id: 'accessibility', label: '♿ Accesibilidad', icon: '♿' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Controls */}
            {activeTab === 'colors' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Paleta de Colores
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Regla 60-30-10: 60% dominante, 30% secundario, 10% acento
                </p>
                
                <div className="space-y-2">
                  <ColorPicker label="🎯 Color Dominante (60%)" colorKey="primary" />
                  <ColorPicker label="📌 Color Secundario (30%)" colorKey="secondary" />
                  <ColorPicker label="⭐ Color de Acento (10%)" colorKey="accent" />
                  <ColorPicker label="🖼️ Color de Fondo" colorKey="background" />
                  <ColorPicker label="📄 Color de Texto" colorKey="text" />
                  <ColorPicker label="🔘 Color Texto Botón" colorKey="buttonText" showContrast={false} />
                </div>

                {/* Color Distribution Visual */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Distribución 60-30-10</h4>
                  <div className="flex h-10 rounded-lg overflow-hidden">
                    <div className="flex-[6] flex items-center justify-center text-white text-xs font-medium" style={{ backgroundColor: state.colors.primary }}>60%</div>
                    <div className="flex-[3] flex items-center justify-center text-white text-xs font-medium" style={{ backgroundColor: state.colors.secondary }}>30%</div>
                    <div className="flex-[1] flex items-center justify-center text-white text-xs font-medium" style={{ backgroundColor: state.colors.accent }}>10%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Palettes Tab */}
            {activeTab === 'palettes' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Paletas Predefinidas</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {defaultPalettes.map(palette => (
                      <button
                        key={palette.id}
                        onClick={() => handleLoadPalette(palette)}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                      >
                        <div className="flex gap-1">
                          {[palette.colors.primary, palette.colors.secondary, palette.colors.accent].map((c, i) => (
                            <div key={i} className="w-8 h-8 rounded" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{palette.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{palette.mode}</p>
                        </div>
                        <span className="text-blue-500">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                {savedPalettes.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">💾 Mis Paletas Guardadas</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {savedPalettes.map(palette => (
                        <div key={palette.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                          <div className="flex gap-1">
                            {[palette.colors.primary, palette.colors.secondary, palette.colors.accent].map((c, i) => (
                              <div key={i} className="w-8 h-8 rounded" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{palette.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{palette.mode}</p>
                          </div>
                          <button
                            onClick={() => handleLoadPalette(palette)}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Cargar
                          </button>
                          <button
                            onClick={() => handleDeletePalette(palette)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Typography Controls - SIMPLIFICADO */}
            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Tamaños de Fuente
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Title Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        H Título (px)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={state.typography.title.size}
                          onChange={(e) => updateTypography('title', { size: parseInt(e.target.value) || 24 })}
                          className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="12"
                          max="72"
                        />
                        <input
                          type="range"
                          value={state.typography.title.size}
                          onChange={(e) => updateTypography('title', { size: parseInt(e.target.value) })}
                          className="flex-1"
                          min="12"
                          max="72"
                        />
                        <span className="text-sm text-gray-500 w-12">{state.typography.title.size}px</span>
                      </div>
                    </div>

                    {/* Subtitle Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        H Subtítulo (px)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={state.typography.subtitle.size}
                          onChange={(e) => updateTypography('subtitle', { size: parseInt(e.target.value) || 18 })}
                          className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="12"
                          max="48"
                        />
                        <input
                          type="range"
                          value={state.typography.subtitle.size}
                          onChange={(e) => updateTypography('subtitle', { size: parseInt(e.target.value) })}
                          className="flex-1"
                          min="12"
                          max="48"
                        />
                        <span className="text-sm text-gray-500 w-12">{state.typography.subtitle.size}px</span>
                      </div>
                    </div>

                    {/* Paragraph Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ¶ Párrafo (px)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={state.typography.paragraph.size}
                          onChange={(e) => updateTypography('paragraph', { size: parseInt(e.target.value) || 14 })}
                          className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="10"
                          max="32"
                        />
                        <input
                          type="range"
                          value={state.typography.paragraph.size}
                          onChange={(e) => updateTypography('paragraph', { size: parseInt(e.target.value) })}
                          className="flex-1"
                          min="10"
                          max="32"
                        />
                        <span className="text-sm text-gray-500 w-12">{state.typography.paragraph.size}px</span>
                      </div>
                    </div>
                  </div>
                </div>

                <FontUploader />
              </div>
            )}

            {/* Accessibility Controls */}
            {activeTab === 'accessibility' && <AccessibilityChecker />}
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <LivePreview />
            
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Tips de Diseño</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Usa máximo 2-3 fuentes diferentes (Consistencia)</li>
                <li>• Mantén contraste mínimo de 4.5:1 (WCAG AA)</li>
                <li>• Evita párrafos demasiado largos (Legibilidad)</li>
                <li>• Ctrl+Z para deshacer cambios (Reversión)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Save Palette Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="💾 Guardar Paleta Personalizada"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Paleta
            </label>
            <input
              type="text"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              placeholder="Ej: Mi Paleta Corporativa"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
            <div className="flex gap-2">
              {[state.colors.primary, state.colors.secondary, state.colors.accent].map((c, i) => (
                <div key={i} className="w-12 h-12 rounded border border-gray-300" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowSaveModal(false)}>Cancelar</Button>
            <Button onClick={handleSavePalette} disabled={!paletteName.trim()}>Guardar</Button>
          </div>
        </div>
      </Modal>

      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}