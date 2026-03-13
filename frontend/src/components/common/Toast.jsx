import React, { useEffect } from 'react';

export function Toast({ show, message, type = 'info', onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`${styles[type]} text-white px-6 py-3 rounded-lg shadow-lg 
                        flex items-center gap-3 min-w-[300px]`}>
        <span className="text-lg">{icons[type]}</span>
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="hover:opacity-75">✕</button>
      </div>
    </div>
  );
}