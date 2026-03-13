import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export function LivePreview() {
  const { state } = useTheme();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  // Estilos dinámicos
  const containerStyle = {
    fontFamily: state.typography.paragraph.family,
    backgroundColor: state.colors.background,
    color: state.colors.text,
    minHeight: '800px',
    transition: 'all 0.3s ease'
  };

  const h1Style = {
    fontFamily: state.typography.title.family,
    fontSize: `${state.typography.title.size}px`,
    fontWeight: state.typography.title.weight,
    color: state.colors.primary,
    transition: 'all 0.3s ease'
  };

  const h2Style = {
    fontFamily: state.typography.subtitle.family,
    fontSize: `${state.typography.subtitle.size}px`,
    fontWeight: state.typography.subtitle.weight,
    color: state.colors.secondary,
    transition: 'all 0.3s ease'
  };

  const pStyle = {
    fontFamily: state.typography.paragraph.family,
    fontSize: `${state.typography.paragraph.size}px`,
    fontWeight: state.typography.paragraph.weight,
    lineHeight: '1.6',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    fontFamily: state.typography.button.family,
    fontSize: `${state.typography.button.size}px`,
    fontWeight: state.typography.button.weight,
    backgroundColor: state.colors.accent,
    color: state.colors.buttonText,
    padding: '14px 28px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Preview Header */}
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">👁️ Vista Previa - ShoeStore</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            En vivo
          </span>
          {cartCount > 0 && (
            <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
              🛒 {cartCount}
            </span>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div style={containerStyle}>
        
        {/* ========== HEADER ========== */}
        <header style={{ backgroundColor: state.colors.background, borderBottom: `1px solid ${state.colors.secondary}30` }}>
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group cursor-pointer">
                <span className="text-4xl transition-transform duration-300 group-hover:rotate-12" style={{ display: 'inline-block' }}>👟</span>
                <h1 style={h1Style} className="transition-transform duration-300 group-hover:scale-105">ShoeStore</h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-8">
                {['Inicio', 'Hombres', 'Mujeres', 'Ofertas'].map((item) => (
                  <a 
                    key={item} 
                    href="#" 
                    style={{ ...pStyle, color: state.colors.text, textDecoration: 'none', fontWeight: '500' }}
                    className="relative hover:opacity-70 transition-all duration-300 group"
                  >
                    {item}
                    <span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: state.colors.accent }}
                    />
                  </a>
                ))}
              </nav>

              <button 
                style={buttonStyle}
                className="hover:opacity-90 transition-opacity duration-300 hover:scale-105"
              >
                Mi Cuenta
              </button>
            </div>
          </div>
        </header>

        {/* ========== BANNER PRINCIPAL (ALTURA CORREGIDA) ========== */}
        <section 
          className="relative overflow-hidden"
          style={{ 
            backgroundColor: state.colors.primary, 
            padding: '100px 20px',
            minHeight: '500px'
          }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Texto del Banner */}
              <div className="text-left">
                <h2 
                  style={{ ...h1Style, color: state.colors.buttonText, fontSize: '56px', lineHeight: '1.2', marginBottom: '24px' }}
                >
                  Nueva Colección 2026
                </h2>
                <p 
                  style={{ ...pStyle, color: state.colors.buttonText, opacity: 0.95, fontSize: '20px', marginBottom: '32px', maxWidth: '500px' }}
                >
                  Descubre los últimos diseños en calzado deportivo y casual. 
                  Comodidad y estilo en cada paso.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <button 
                    style={{ 
                      ...buttonStyle, 
                      backgroundColor: state.colors.buttonText, 
                      color: state.colors.primary,
                      fontWeight: '600'
                    }}
                    className="hover:scale-105 transition-transform duration-300 shadow-lg"
                  >
                    Ver Colección →
                  </button>
                  <button 
                    style={{ 
                      ...buttonStyle, 
                      backgroundColor: 'transparent', 
                      color: state.colors.buttonText,
                      border: `2px solid ${state.colors.buttonText}`
                    }}
                    className="hover:bg-white/10 transition-all duration-300"
                  >
                    Ver Ofertas
                  </button>
                </div>
              </div>
              
              {/* Emoji/Imagen del Banner */}
              <div className="text-center">
                <span 
                  className="inline-block transition-transform duration-500 hover:scale-110 cursor-pointer"
                  style={{ fontSize: '180px', display: 'inline-block' }}
                >
                  👟
                </span>
              </div>
            </div>
          </div>

          {/* Decoración de fondo */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: state.colors.buttonText, transform: 'translate(30%, -30%)' }}
          />
          <div 
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
            style={{ backgroundColor: state.colors.buttonText, transform: 'translate(-30%, 30%)' }}
          />
        </section>

        {/* ========== PRODUCTOS ========== */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 style={h2Style} className="text-center mb-4">Productos Destacados</h2>
            <p style={{ ...pStyle, textAlign: 'center', marginBottom: '48px', opacity: 0.8 }}>
              Nuestra selección premium de calzado deportivo y casual
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 1, name: 'Air Max Pro', price: '$129.99', emoji: '👟', tag: 'Nuevo' },
                { id: 2, name: 'Urban Runner', price: '$89.99', emoji: '👟', tag: 'Popular' },
                { id: 3, name: 'Classic Leather', price: '$149.99', emoji: '👞', tag: 'Oferta' },
                { id: 4, name: 'Sport Elite', price: '$119.99', emoji: '👟', tag: '' }
              ].map((product) => (
                <div 
                  key={product.id}
                  className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
                  style={{ 
                    border: `1px solid ${state.colors.secondary}20`,
                    transform: hoveredProduct === product.id ? 'translateY(-8px)' : 'translateY(0)'
                  }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Tag */}
                  {product.tag && (
                    <div 
                      className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-semibold text-white z-10"
                      style={{ backgroundColor: state.colors.accent }}
                    >
                      {product.tag}
                    </div>
                  )}
                  
                  {/* Imagen */}
                  <div 
                    className="h-56 flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                    style={{ backgroundColor: `${state.colors.primary}10` }}
                  >
                    <span 
                      className="text-7xl transform transition-transform duration-500 group-hover:rotate-12"
                      style={{ display: 'inline-block' }}
                    >
                      {product.emoji}
                    </span>
                  </div>
                  
                  {/* Info */}
                  <div className="p-5">
                    <h3 style={{ ...h2Style, fontSize: '18px', marginBottom: '8px' }}>{product.name}</h3>
                    <p style={{ ...pStyle, color: state.colors.accent, fontWeight: '700', fontSize: '22px', marginBottom: '16px' }}>
                      {product.price}
                    </p>
                    <button 
                      onClick={addToCart}
                      style={{ ...buttonStyle, width: '100%' }}
                      className="hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2"
                    >
                      <span>🛒</span> Añadir al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SERVICIOS ========== */}
        <section 
          className="py-16 px-4"
          style={{ backgroundColor: `${state.colors.secondary}08` }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 style={h2Style} className="text-center mb-4">Nuestros Servicios</h2>
            <p style={{ ...pStyle, textAlign: 'center', marginBottom: '48px', opacity: 0.8 }}>
              Comprometidos con la mejor experiencia de compra
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🚚', title: 'Envío Gratis', desc: 'En pedidos +$100' },
                { icon: '↩️', title: 'Devoluciones', desc: '30 días garantía' },
                { icon: '💳', title: 'Pago Seguro', desc: 'Todas las tarjetas' },
                { icon: '💬', title: 'Soporte 24/7', desc: 'Atención personalizada' }
              ].map((service, idx) => (
                <div 
                  key={idx}
                  className="text-center p-8 bg-white rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                  style={{ border: `1px solid ${state.colors.secondary}15` }}
                >
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${state.colors.primary}15` }}
                  >
                    {service.icon}
                  </div>
                  <h3 style={{ ...h2Style, fontSize: '18px', marginBottom: '8px' }}>{service.title}</h3>
                  <p style={pStyle}>{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <footer 
          className="py-16 px-4"
          style={{ backgroundColor: state.colors.text, color: state.colors.background }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-4xl">👟</span>
                  <h3 style={{ ...h2Style, color: state.colors.background, fontSize: '22px' }}>ShoeStore</h3>
                </div>
                <p style={{ ...pStyle, opacity: 0.8, lineHeight: '1.8' }}>
                  Tu tienda de confianza para calzado deportivo y casual desde 2020. 
                  Calidad y estilo en cada paso.
                </p>
              </div>

              <div>
                <h4 style={{ ...h2Style, color: state.colors.background, fontSize: '18px', marginBottom: '20px' }}>Enlaces</h4>
                <ul className="space-y-3">
                  {['Sobre Nosotros', 'Catálogo', 'Blog', 'Contacto'].map((item) => (
                    <li key={item}>
                      <a 
                        href="#" 
                        style={{ ...pStyle, color: state.colors.background, opacity: 0.8, textDecoration: 'none' }} 
                        className="hover:opacity-100 transition-opacity flex items-center gap-2 group"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ ...h2Style, color: state.colors.background, fontSize: '18px', marginBottom: '20px' }}>Ayuda</h4>
                <ul className="space-y-3">
                  {['Envíos', 'Devoluciones', 'Tallas', 'FAQ'].map((item) => (
                    <li key={item}>
                      <a 
                        href="#" 
                        style={{ ...pStyle, color: state.colors.background, opacity: 0.8, textDecoration: 'none' }}
                        className="hover:opacity-100 transition-opacity"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ ...h2Style, color: state.colors.background, fontSize: '18px', marginBottom: '20px' }}>Contacto</h4>
                <ul className="space-y-3">
                  <li style={{ ...pStyle, opacity: 0.8 }}>📍 Av. Principal 123, Ciudad</li>
                  <li style={{ ...pStyle, opacity: 0.8 }}>📞 +1 234 567 890</li>
                  <li style={{ ...pStyle, opacity: 0.8 }}>📧 contacto@shoestore.com</li>
                  <li style={{ ...pStyle, opacity: 0.8 }}>🕐 Lun-Vie: 9AM - 6PM</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t" style={{ borderColor: `${state.colors.background}20` }}>
              <p style={{ ...pStyle, opacity: 0.7, fontSize: '14px', textAlign: 'center' }}>
                © 2026 ShoeStore. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}