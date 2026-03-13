import React, { useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Toast } from '../common/Toast';

export function FontUploader() {
  const { state, addCustomFont, removeCustomFont, updateTypography } = useTheme();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.ttf') && !file.name.endsWith('.otf')) {
      showToast('Solo se permiten archivos .ttf o .otf', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('El archivo no puede superar 5MB', 'error');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fontData = {
          id: `font_${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: event.target.result,
          uploadedAt: new Date().toLocaleDateString('es-ES')
        };

        addCustomFont(fontData);
        showToast(`Fuente "${fontData.name}" cargada exitosamente`, 'success');
        
        if (window.confirm('¿Deseas aplicar esta fuente a todos los elementos?')) {
          Object.keys(state.typography).forEach(key => {
            updateTypography(key, { family: fontData.name });
          });
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      showToast('Error al cargar la fuente', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📤 Cargar Tipografías
      </h3>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 
                   text-center cursor-pointer hover:border-blue-500 
                   transition-colors bg-gray-50"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf,.otf"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span>Cargando...</span>
          </div>
        ) : (
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Click para subir o arrastra tu archivo .ttf
            </p>
          </div>
        )}
      </div>

      {state.customFonts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Fuentes Cargadas</h4>
          <div className="space-y-2">
            {state.customFonts.map((font) => (
              <div key={font.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium" style={{ fontFamily: font.name }}>{font.name}</div>
                  <div className="text-xs text-gray-500">{font.uploadedAt}</div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Eliminar la fuente "${font.name}"?`)) {
                      removeCustomFont(font.id);
                    }
                  }}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="text-sm font-semibold text-blue-800 mb-2">💡 Consejos</h5>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Usa máximo 2-3 fuentes diferentes</li>
          <li>• Las fuentes sans-serif son más legibles</li>
          <li>• Evita tamaños menores a 14px</li>
        </ul>
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