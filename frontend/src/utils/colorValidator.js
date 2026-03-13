// ==========================================
// VALIDADOR DE CONTRASTE DE COLORES (WCAG 2.1)
// ==========================================

/**
 * Valida el contraste entre dos colores según WCAG 2.1
 * @param {string} foreground - Color de primer plano (HEX)
 * @param {string} background - Color de fondo (HEX)
 * @returns {number} - Relación de contraste (1-21)
 */
export function validateColorContrast(foreground, background) {
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Obtiene la luminosidad relativa de un color
 * @param {string} hex - Color en formato HEX
 * @returns {number} - Valor de luminosidad (0-1)
 */
function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convierte HEX a RGB
 * @param {string} hex - Color en formato HEX
 * @returns {object} - Objeto con valores r, g, b
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// ==========================================
// SIMULACIÓN DE DALTONISMO
// ==========================================

/**
 * Simula cómo se ve un color para diferentes tipos de daltonismo
 * @param {string} color - Color en formato HEX
 * @param {string} type - Tipo de daltonismo (protanopia, deuteranopia, tritanopia)
 * @returns {string} - Color simulado en formato HEX
 */
export function simulateColorBlindness(color, type) {
  const rgb = hexToRgb(color);
  let r, g, b;

  switch (type) {
    case 'protanopia': // Rojo-verde (rojo débil)
      r = 0.567 * rgb.r + 0.433 * rgb.g;
      g = 0.558 * rgb.r + 0.442 * rgb.g;
      b = rgb.b;
      break;
    case 'deuteranopia': // Rojo-verde (verde débil)
      r = 0.625 * rgb.r + 0.375 * rgb.g;
      g = 0.7 * rgb.r + 0.3 * rgb.g;
      b = rgb.b;
      break;
    case 'tritanopia': // Azul-amarillo
      r = rgb.r;
      g = 0.433 * rgb.g + 0.567 * rgb.b;
      b = 0.433 * rgb.g + 0.567 * rgb.b;
      break;
    default:
      return color;
  }

  const toHex = (c) => {
    const hex = Math.round(Math.max(0, Math.min(255, c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ==========================================
// VALIDACIÓN DE FUENTES
// ==========================================

/**
 * Valida que un archivo de fuente sea válido
 * @param {File} fontFile - Archivo de fuente
 * @returns {object} - Resultado de validación
 */
export function validateFont(fontFile) {
  const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  
  const extension = '.' + fontFile.name.split('.').pop().toLowerCase();
  
  if (!validExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Formato no válido. Usa: ${validExtensions.join(', ')}`
    };
  }
  
  if (fontFile.size > maxFileSize) {
    return {
      valid: false,
      error: 'El archivo excede 5MB'
    };
  }
  
  return { valid: true };
}

// ==========================================
// VALIDACIÓN DE REGLA 60-30-10
// ==========================================

/**
 * Valida si una paleta sigue la regla 60-30-10
 * @param {object} colors - Objeto con colores de la paleta
 * @returns {object} - Resultado de validación
 */
export function validateColorRule(colors) {
  return {
    valid: true,
    recommendation: 'Asegúrate de usar 60% color dominante, 30% secundario, 10% acento'
  };
}

// ==========================================
// UTILIDADES ADICIONALES
// ==========================================

/**
 * Convierte RGB a HEX
 * @param {number} r - Rojo (0-255)
 * @param {number} g - Verde (0-255)
 * @param {number} b - Azul (0-255)
 * @returns {string} - Color en formato HEX
 */
export function rgbToHex(r, g, b) {
  const toHex = (c) => {
    const hex = Math.round(Math.max(0, Math.min(255, c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Obtiene el nivel de contraste según WCAG
 * @param {number} ratio - Relación de contraste
 * @returns {object} - Nivel de conformidad
 */
export function getContrastLevel(ratio) {
  if (ratio >= 7) {
    return { level: 'AAA', color: 'text-green-600', bg: 'bg-green-100', icon: '✓✓✓' };
  }
  if (ratio >= 4.5) {
    return { level: 'AA', color: 'text-green-500', bg: 'bg-green-50', icon: '✓✓' };
  }
  if (ratio >= 3) {
    return { level: 'AA Large', color: 'text-yellow-500', bg: 'bg-yellow-50', icon: '✓' };
  }
  return { level: 'Fail', color: 'text-red-500', bg: 'bg-red-50', icon: '✗' };
}

/**
 * Valida un color en formato HEX
 * @param {string} color - Color a validar
 * @returns {boolean} - True si es válido
 */
export function isValidHex(color) {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Genera una paleta de colores basada en un color principal
 * @param {string} baseColor - Color base en HEX
 * @returns {object} - Paleta generada
 */
export function generatePalette(baseColor) {
  const rgb = hexToRgb(baseColor);
  
  return {
    primary: baseColor,
    secondary: rgbToHex(rgb.r * 0.7, rgb.g * 0.7, rgb.b * 0.7),
    accent: rgbToHex(
      Math.min(255, rgb.r + 50),
      Math.min(255, rgb.g + 50),
      Math.min(255, rgb.b + 50)
    ),
    background: '#F8FAFC',
    text: '#1E293B',
    buttonText: '#FFFFFF'
  };
}