import React, { useState, useEffect } from 'react';
import { typographyService } from '../../services/typographyService';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Toast } from '../common/Toast';

export function TypographyManager() {
  const [typography, setTypography] = useState({
    titleFont: 'Inter',
    titleSize: 24,
    titleWeight: 700,
    subtitleFont: 'Inter',
    subtitleSize: 18,
    subtitleWeight: 600,
    paragraphFont: 'Inter',
    paragraphSize: 14,
    paragraphWeight: 400,
    buttonFont: 'Inter',
    buttonSize: 16,
    buttonWeight: 500
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadTypography();
  }, []);

  const loadTypography = async () => {
    try {
      const data = await typographyService.getDefault();
      if (data) setTypography(data);
    } catch (error) {
      showToast('Error al cargar tipografía', 'error');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await typographyService.save(typography);
      showToast('Tipografía guardada', 'success');
    } catch (error) {
      showToast('Error al guardar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFontUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.ttf') && !file.name.endsWith('.otf')) {
      showToast('Solo archivos .ttf o .otf', 'error');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fontName = file.name.replace(/\.[^/.]+$/, '');
        setTypography(prev => ({
          ...prev,
          [`${type}Font`]: fontName
        }));
        showToast('Fuente cargada', 'success');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showToast('Error al cargar fuente', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const updateField = (field, value) => {
    setTypography(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestor de Tipografías</h1>
          <p className="text-gray-500">Configura las fuentes por defecto del sistema</p>
        </div>
        <Button onClick={handleSave} loading={loading}>Guardar Cambios</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Title Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Título</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuente</label>
              <div className="flex gap-2">
                <select
                  value={typography.titleFont}
                  onChange={(e) => updateField('titleFont', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                </select>
                <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                  📤
                  <input
                    type="file"
                    accept=".ttf,.otf"
                    onChange={(e) => handleFontUpload(e, 'title')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño: {typography.titleSize}px
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={typography.titleSize}
                onChange={(e) => updateField('titleSize', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso: {typography.titleWeight}
              </label>
              <select
                value={typography.titleWeight}
                onChange={(e) => updateField('titleWeight', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">SemiBold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">ExtraBold (800)</option>
              </select>
            </div>

            <div 
              className="p-4 bg-gray-50 rounded-lg"
              style={{ 
                fontFamily: typography.titleFont,
                fontSize: `${typography.titleSize}px`,
                fontWeight: typography.titleWeight
              }}
            >
              Título de Ejemplo
            </div>
          </div>
        </div>

        {/* Subtitle Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subtítulo</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuente</label>
              <select
                value={typography.subtitleFont}
                onChange={(e) => updateField('subtitleFont', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño: {typography.subtitleSize}px
              </label>
              <input
                type="range"
                min="12"
                max="48"
                value={typography.subtitleSize}
                onChange={(e) => updateField('subtitleSize', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso: {typography.subtitleWeight}
              </label>
              <select
                value={typography.subtitleWeight}
                onChange={(e) => updateField('subtitleWeight', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">SemiBold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>

            <div 
              className="p-4 bg-gray-50 rounded-lg"
              style={{ 
                fontFamily: typography.subtitleFont,
                fontSize: `${typography.subtitleSize}px`,
                fontWeight: typography.subtitleWeight
              }}
            >
              Subtítulo de Ejemplo
            </div>
          </div>
        </div>

        {/* Paragraph Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Párrafo</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuente</label>
              <select
                value={typography.paragraphFont}
                onChange={(e) => updateField('paragraphFont', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño: {typography.paragraphSize}px
              </label>
              <input
                type="range"
                min="10"
                max="32"
                value={typography.paragraphSize}
                onChange={(e) => updateField('paragraphSize', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div 
              className="p-4 bg-gray-50 rounded-lg"
              style={{ 
                fontFamily: typography.paragraphFont,
                fontSize: `${typography.paragraphSize}px`
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
            </div>
          </div>
        </div>

        {/* Button Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Botones</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuente</label>
              <select
                value={typography.buttonFont}
                onChange={(e) => updateField('buttonFont', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño: {typography.buttonSize}px
              </label>
              <input
                type="range"
                min="12"
                max="24"
                value={typography.buttonSize}
                onChange={(e) => updateField('buttonSize', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg"
              style={{ 
                fontFamily: typography.buttonFont,
                fontSize: `${typography.buttonSize}px`,
                fontWeight: typography.buttonWeight
              }}
            >
              Botón de Ejemplo
            </button>
          </div>
        </div>
      </div>

      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}