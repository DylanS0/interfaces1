import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useUndo } from '../hooks/useUndo';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext();

// Estado inicial simplificado
const initialState = {
  colors: {
    primary: '#3B82F6',      // 60% - Dominante
    secondary: '#64748B',    // 30% - Secundario
    accent: '#10B981',       // 10% - Acento
    background: '#F8FAFC',
    text: '#1E293B',
    buttonText: '#FFFFFF'
  },
  typography: {
    title: { family: 'Inter', size: 24, weight: 700 },
    subtitle: { family: 'Inter', size: 18, weight: 600 },
    paragraph: { family: 'Inter', size: 14, weight: 400 },
    button: { family: 'Inter', size: 16, weight: 500 }
  },
  mode: 'light',
  customFonts: []
};

// Paletas predefinidas
const defaultPalettes = [
  {
    id: 'ocean',
    name: '🌊 Océano Profesional',
    colors: {
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#10B981',
      background: '#F8FAFC',
      text: '#1E293B',
      buttonText: '#FFFFFF'
    },
    mode: 'light'
  },
  {
    id: 'forest',
    name: '🌲 Bosque Moderno',
    colors: {
      primary: '#059669',
      secondary: '#6B7280',
      accent: '#F59E0B',
      background: '#FAFAF9',
      text: '#1F2937',
      buttonText: '#FFFFFF'
    },
    mode: 'light'
  },
  {
    id: 'sunset',
    name: '🌅 Atardecer Vibrante',
    colors: {
      primary: '#DC2626',
      secondary: '#7C3AED',
      accent: '#F97316',
      background: '#FEF2F2',
      text: '#1C1917',
      buttonText: '#FFFFFF'
    },
    mode: 'light'
  },
  {
    id: 'dark',
    name: '🌙 Modo Oscuro Pro',
    colors: {
      primary: '#60A5FA',
      secondary: '#9CA3AF',
      accent: '#34D399',
      background: '#1F2937',
      text: '#F9FAFB',
      buttonText: '#000000'
    },
    mode: 'dark'
  }
];

function themeReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_COLOR':
      return {
        ...state,
        colors: { ...state.colors, [action.payload.key]: action.payload.value }
      };
    case 'UPDATE_TYPOGRAPHY':
      return {
        ...state,
        typography: {
          ...state.typography,
          [action.payload.key]: {
            ...state.typography[action.payload.key],
            ...action.payload.value
          }
        }
      };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'ADD_CUSTOM_FONT':
      return {
        ...state,
        customFonts: [...state.customFonts, action.payload]
      };
    case 'LOAD_PALETTE':
      return {
        ...state,
        colors: action.payload.colors,
        mode: action.payload.mode || 'light'
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const [savedState, setSavedState] = useLocalStorage('theme-settings', initialState);
  const [savedPalettes, setSavedPalettes] = useLocalStorage('custom-palettes', []);
  const { history, addToHistory, undo, canUndo } = useUndo(10);

  // Cargar estado guardado al iniciar
  useEffect(() => {
    if (savedState?.colors) {
      Object.keys(savedState.colors).forEach(key => {
        dispatch({ type: 'UPDATE_COLOR', payload: { key, value: savedState.colors[key] } });
      });
    }
    if (savedState?.typography) {
      Object.keys(savedState.typography).forEach(key => {
        dispatch({ type: 'UPDATE_TYPOGRAPHY', payload: { key, value: savedState.typography[key] } });
      });
    }
  }, []);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    setSavedState(state);
  }, [state]);

  // Aplicar fuentes personalizadas al DOM
  useEffect(() => {
    document.querySelectorAll('[data-custom-font]').forEach(el => el.remove());
    
    state.customFonts.forEach(font => {
      const style = document.createElement('style');
      style.setAttribute('data-custom-font', 'true');
      style.textContent = `
        @font-face {
          font-family: '${font.name}';
          src: url('${font.url}') format('truetype');
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    });
  }, [state.customFonts]);

  // Aplicar modo oscuro
  useEffect(() => {
    if (state.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.mode]);

  const updateColor = (key, value) => {
    addToHistory(state);
    dispatch({ type: 'UPDATE_COLOR', payload: { key, value } });
  };

  const updateTypography = (key, value) => {
    addToHistory(state);
    dispatch({ type: 'UPDATE_TYPOGRAPHY', payload: { key, value } });
  };

  const addCustomFont = (fontData) => {
    addToHistory(state);
    dispatch({ type: 'ADD_CUSTOM_FONT', payload: fontData });
  };

  const loadPalette = (palette) => {
    addToHistory(state);
    dispatch({ type: 'LOAD_PALETTE', payload: palette });
  };

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      dispatch({ type: 'RESET' });
      if (previousState.colors) {
        Object.keys(previousState.colors).forEach(key => {
          dispatch({ type: 'UPDATE_COLOR', payload: { key, value: previousState.colors[key] } });
        });
      }
    }
  };

  const saveCustomPalette = (name, colors, mode) => {
    const newPalette = {
      id: `custom_${Date.now()}`,
      name,
      colors,
      mode,
      isCustom: true
    };
    const updated = [...savedPalettes, newPalette];
    setSavedPalettes(updated);
    return newPalette;
  };

  const deleteCustomPalette = (id) => {
    const updated = savedPalettes.filter(p => p.id !== id);
    setSavedPalettes(updated);
  };

  return (
    <ThemeContext.Provider value={{
      state,
      updateColor,
      updateTypography,
      addCustomFont,
      loadPalette,
      handleUndo,
      canUndo,
      history,
      defaultPalettes,
      savedPalettes,
      saveCustomPalette,
      deleteCustomPalette
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};