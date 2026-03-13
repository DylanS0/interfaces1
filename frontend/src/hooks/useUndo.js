// Implementa la regla de "Permitir la reversión de acciones"
import { useState, useCallback } from 'react';

export function useUndo(maxHistory = 10) {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback((state) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(state)));
      if (newHistory.length > maxHistory) {
        newHistory.shift();
      }
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, maxHistory - 1));
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;

  return { history, addToHistory, undo, canUndo, currentIndex };
}