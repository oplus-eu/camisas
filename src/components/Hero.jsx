export default function Hero({ scrollToCollection, t }) {
    return (
        <section style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'var(--space-8) var(--space-4)',
            overflow: 'hidden'
        }}>
            {/* Background Image Element */}
            <div className="hero-background" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url("/hero-image.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -2,
                transform: 'scale(1.05)', // slight zoom for premium feel
            }} />

            {/* Dark Overlay Gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.8) 50%, rgba(10, 10, 10, 1) 100%)',
                zIndex: -1,
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, marginTop: '10vh' }}>
                <h2 style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    fontWeight: '300',
                    lineHeight: 1,
                    marginBottom: 'var(--space-6)',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    maxWidth: '800px'
                }}>
                    {t.heroTitle.split(' ')[0]} <br />
                    <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{t.heroTitle.split(' ')[1]}</span>
                </h2>
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                    maxWidth: '500px',
                    marginBottom: 'var(--space-8)',
                    fontWeight: '300',
                    lineHeight: 1.6
                }}>
                    {t.heroSubtitle}
                </p>

                <button
                    onClick={scrollToCollection}
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-bg-base)',
                        border: 'none',
                        padding: 'var(--space-4) var(--space-8)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        borderRadius: '2px', // Brutalist/sharp edge
                        transition: 'background-color var(--transition-fast), transform var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-primary-hover)';
                        e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'var(--color-primary)';
                        e.target.style.transform = 'translateY(0)';
                    }}
                >
                    {t.shopCollection}
                </button>
            </div>

            {/* Scroll indicator */}
            <div style={{
                position: 'absolute',
                bottom: 'var(--space-8)',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-2)',
                opacity: 0.6
            }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scroll</span>
                <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--color-text-primary)' }} />
            </div>
        </section>
    );
}
