import React, { useState, useEffect } from 'react';
import { paletteService } from '../../services/paletteService';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Toast } from '../common/Toast';
import { ColorPicker } from '../client/ColorPicker';

export function PaletteManager() {
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPalette, setEditingPalette] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    name: '',
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

  useEffect(() => {
    loadPalettes();
  }, []);

  const loadPalettes = async () => {
    try {
      const data = await paletteService.getAll();
      setPalettes([...data.defaultPalettes, ...data.userPalettes]);
    } catch (error) {
      showToast('Error al cargar paletas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPalette(null);
    setFormData({
      name: '',
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
    setShowModal(true);
  };

  const handleOpenEdit = (palette) => {
    setEditingPalette(palette);
    setFormData({
      name: palette.name,
      colors: palette.colors,
      mode: palette.mode
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingPalette) {
        await paletteService.update(editingPalette.id, formData);
        showToast('Paleta actualizada', 'success');
      } else {
        await paletteService.create(formData.name, formData.colors, formData.mode);
        showToast('Paleta creada', 'success');
      }
      
      setShowModal(false);
      loadPalettes();
    } catch (error) {
      showToast(error.response?.data?.error || 'Error al guardar', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta paleta?')) return;
    
    try {
      await paletteService.delete(id);
      showToast('Paleta eliminada', 'success');
      loadPalettes();
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const updateColor = (key, value) => {
    setFormData(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Cargando...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestor de Paletas</h1>
          <p className="text-gray-500">Crea y administra paletas de colores globales</p>
        </div>
        <Button onClick={handleOpenCreate}>+ Nueva Paleta</Button>
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {palettes.map((palette) => (
          <div 
            key={palette.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
          >
            {/* Color Preview */}
            <div className="h-24 flex">
              <div className="flex-1" style={{ backgroundColor: palette.colors.primary }} />
              <div className="flex-1" style={{ backgroundColor: palette.colors.secondary }} />
              <div className="flex-1" style={{ backgroundColor: palette.colors.accent }} />
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{palette.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  palette.is_default ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {palette.is_default ? 'Default' : palette.mode}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleOpenEdit(palette)}
                  className="flex-1"
                >
                  Editar
                </Button>
                {!palette.is_default && (
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(palette.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPalette ? 'Editar Paleta' : 'Nueva Paleta'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Nombre de la Paleta"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ej: Corporativo Azul"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modo</label>
            <select
              value={formData.mode}
              onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="colorblind">Daltónico</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ColorPicker label="Primario (60%)" colorKey="primary" value={formData.colors.primary} onChange={updateColor} />
            <ColorPicker label="Secundario (30%)" colorKey="secondary" value={formData.colors.secondary} onChange={updateColor} />
            <ColorPicker label="Acento (10%)" colorKey="accent" value={formData.colors.accent} onChange={updateColor} />
            <ColorPicker label="Fondo" colorKey="background" value={formData.colors.background} onChange={updateColor} />
            <ColorPicker label="Texto" colorKey="text" value={formData.colors.text} onChange={updateColor} />
            <ColorPicker label="Texto Botón" colorKey="buttonText" value={formData.colors.buttonText} onChange={updateColor} showContrast={false} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!formData.name}>
              {editingPalette ? 'Actualizar' : 'Crear'}
            </Button>
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