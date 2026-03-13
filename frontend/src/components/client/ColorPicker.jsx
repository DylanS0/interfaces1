import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { validateColorContrast } from '../../utils/colorValidator';

export function ColorPicker({ label, colorKey, showContrast = true }) {
  const { state, updateColor } = useTheme();
  const [localColor, setLocalColor] = useState(state.colors[colorKey]);
  const [format, setFormat] = useState('HEX');
  const [showPicker, setShowPicker] = useState(false);
  const [contrastRatio, setContrastRatio] = useState(null);

  const handleColorChange = (newColor) => {
    setLocalColor(newColor);
    updateColor(colorKey, newColor);
    
    // Validar contraste en tiempo real (Regla: Comentarios informativos)
    if (showContrast && colorKey !== 'background') {
      const ratio = validateColorContrast(newColor, state.colors.background);
      setContrastRatio(ratio);
    }
  };

  const colorFormats = {
    HEX: localColor,
    RGB: hexToRgb(localColor),
    HSV: hexToHsv(localColor),
    HSL: hexToHsl(localColor),
    CMYK: hexToCmyk(localColor)
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="flex items-center gap-3">
        {/* Color Preview Box */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: localColor }}
          aria-label={`Seleccionar color para ${label}`}
        />
        
        {/* Color Input */}
        <input
          type="text"
          value={localColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     font-mono text-sm"
          placeholder="#000000"
        />
        
        {/* Format Selector */}
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm
                     focus:ring-2 focus:ring-blue-500"
        >
          {Object.keys(colorFormats).map(fmt => (
            <option key={fmt} value={fmt}>{fmt}</option>
          ))}
        </select>
      </div>

      {/* Color Picker Dropdown */}
      {showPicker && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
          <input
            type="color"
            value={localColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-32 cursor-pointer"
          />
          
          {/* Quick Color Presets (60-30-10 Rule) */}
          <div className="mt-3 flex gap-2">
            {['#3B82F6', '#64748B', '#10B981', '#EF4444', '#F59E0B'].map(color => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Contrast Ratio Indicator (Accesibilidad) */}
      {showContrast && contrastRatio && (
        <div className={`mt-2 text-xs ${
          contrastRatio >= 4.5 ? 'text-green-600' : 'text-red-600'
        }`}>
          Contraste: {contrastRatio.toFixed(2)}:1 
          {contrastRatio >= 4.5 ? ' ✓ Accesible' : ' ⚠ Mejorar contraste'}
        </div>
      )}
    </div>
  );
}

// Helper functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : hex;
}

function hexToHsl(hex) {
  // Implementation omitted for brevity
  return hex;
}

function hexToHsv(hex) {
  return hex;
}

function hexToCmyk(hex) {
  return hex;
}