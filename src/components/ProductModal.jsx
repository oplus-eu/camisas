import { X, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductModal({ product, onClose, onAddToCart, t, onOpenSizeGuide }) {
    const [selectedSize, setSelectedSize] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showSizeError, setShowSizeError] = useState(false);

    useEffect(() => {
        if (product) {
            setSelectedSize('');
            setCurrentImageIndex(0);
            setShowSizeError(false);
        }
    }, [product]);

    if (!product) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)'
        }}>
            {/* Backdrop */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--color-overlay)',
                    backdropFilter: 'blur(8px)',
                    cursor: 'pointer'
                }}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div style={{
                position: 'relative',
                backgroundColor: 'var(--color-bg-base)',
                border: '1px solid var(--color-border)',
                width: '100%',
                maxWidth: '1000px',
                maxHeight: '90vh',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                borderRadius: '4px',
                animation: 'modalSlideUp var(--transition-normal)'
            }} className="modal-grid">

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 'var(--space-4)',
                        right: 'var(--space-4)',
                        background: 'var(--color-bg-surface-elevated)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'background-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-border-hover)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-bg-surface-elevated)'}
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column' }} className="modal-layout">
                    {/* Image Gallery Area */}
                    <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-surface)' }} className="modal-gallery">
                        <div style={{
                            aspectRatio: '3/4',
                            width: '100%',
                            overflow: 'hidden',
                            borderRadius: '2px',
                            marginBottom: 'var(--space-4)'
                        }}>
                            <img
                                src={product.images[currentImageIndex]}
                                alt={`${product.name} view ${currentImageIndex + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Thumbnails */}
                        <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    style={{
                                        width: '60px',
                                        height: '80px',
                                        flexShrink: 0,
                                        padding: 0,
                                        border: currentImageIndex === index ? '2px solid var(--color-primary)' : '2px solid transparent',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        transition: 'border-color var(--transition-fast)'
                                    }}
                                >
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Area */}
                    <div style={{ padding: 'var(--space-6) var(--space-4)' }} className="modal-info">
                        <div style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            backgroundColor: 'var(--color-bg-surface-elevated)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: 'var(--space-4)',
                            color: 'var(--color-text-secondary)'
                        }}>
                            {product.name.includes('Player Version') ? 'Player Version' : 
                             product.category === 'Kids' ? 'Kids' : 
                             product.category === 'Women' ? (t.language === 'en' ? "Woman's" : "Feminino") : 
                             (t.language === 'en' ? "Men's" : "Masculino")}
                        </div>

                        <h2 style={{
                            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                            fontWeight: '500',
                            marginBottom: 'var(--space-2)',
                            lineHeight: 1.1
                        }}>
                            {product.name}
                        </h2>

                        <p style={{
                            fontSize: '1.25rem',
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--space-8)'
                        }}>
                            €{product.price.toFixed(2)}
                        </p>

                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                <span style={{ fontWeight: '500', textTransform: 'uppercase', fontSize: '0.875rem' }}>{t.selectSize}</span>
                                <span 
                                    onClick={onOpenSizeGuide}
                                    style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'underline', cursor: 'pointer' }}
                                >
                                    {t.sizeGuide}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setShowSizeError(false);
                                        }}
                                        style={{
                                            padding: 'var(--space-3)',
                                            minWidth: '60px',
                                            background: selectedSize === size ? 'var(--color-text-primary)' : 'var(--color-bg-surface)',
                                            color: selectedSize === size ? 'var(--color-bg-base)' : 'var(--color-text-primary)',
                                            border: '1px solid',
                                            borderColor: selectedSize === size ? 'var(--color-text-primary)' : (showSizeError ? '#ef4444' : 'var(--color-border)'),
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            transition: 'all var(--transition-fast)',
                                            borderRadius: '2px'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedSize !== size) e.target.style.borderColor = 'var(--color-border-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedSize !== size) e.target.style.borderColor = showSizeError ? '#ef4444' : 'var(--color-border)';
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {showSizeError && (
                                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: 'var(--space-2)', minHeight: '20px', animation: 'shake 0.4s ease-in-out' }}>
                                    Please select a size before adding to cart
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                if (!selectedSize) {
                                    setShowSizeError(true);
                                    return;
                                }
                                onAddToCart(product, selectedSize);
                            }}
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-bg-base)',
                                border: 'none',
                                padding: 'var(--space-4)',
                                fontSize: '1rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                borderRadius: '2px',
                                transition: 'background-color var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primary-hover)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
                        >
                            <ShoppingBag size={20} />
                            {t.addToCart} - €{product.price.toFixed(2)}
                        </button>

                        <div style={{ marginTop: 'var(--space-6)', color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            <p>Exclusive item from the Brazil 2026 collection. Premium materials, engineered for performance and iconic style.</p>
                            <ul style={{ paddingLeft: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                                <li>100% Recycled Polyester High-Performance Knit</li>
                                <li>Strategic ventilation zones</li>
                                <li>Embroidered crest and details</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        @media (min-width: 768px) {
          .modal-layout {
            flex-direction: row !important;
          }
          .modal-gallery {
            width: 50%;
            padding: var(--space-6) !important;
          }
          .modal-info {
            width: 50%;
            padding: var(--space-8) var(--space-6) !important;
          }
        }
      `}</style>
        </div>
    );
}
