export default function ProductCard({ product, onSelect, t, language }) {
    return (
        <div
            style={{
                cursor: 'pointer',
                group: 'true', // pseudo class trigger replacement
                position: 'relative'
            }}
            onClick={() => onSelect(product)}
            className="product-card"
        >
            <div style={{
                position: 'relative',
                aspectRatio: '3/4',
                backgroundColor: 'var(--color-bg-surface)',
                overflow: 'hidden',
                marginBottom: 'var(--space-4)',
                borderRadius: '4px'
            }}>
                <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform var(--transition-slow)'
                    }}
                    className="product-image"
                />
                <div style={{
                    position: 'absolute',
                    top: 'var(--space-3)',
                    right: 'var(--space-3)',
                    backgroundColor: 'var(--color-bg-base)',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {product.name.includes('Player Version') ? 'Player Version' : 
                     product.category === 'Kids' ? 'Kids' : 
                     product.category === 'Women' ? (language === 'en' ? "Woman's" : "Feminino") : 
                     (language === 'en' ? "Men's" : "Masculino")}
                </div>
            </div>

            <div>
                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    marginBottom: 'var(--space-1)',
                    color: 'var(--color-text-primary)'
                }}>
                    {product.name}
                </h3>
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem'
                }}>
                    €{product.price.toFixed(2)}
                </p>
            </div>

            <style>{`
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
      `}</style>
        </div>
    );
}
