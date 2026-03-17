import { ShoppingCart, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

export default function Header({ cartCount, onOpenCart, language, onToggleLanguage, t, onGoHome, isMusicPlaying, onToggleMusic }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const promoDeadline = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }, [language]);

    return (
        <>
            {/* Promo Banner */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 51,
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-bg-base)',
                textAlign: 'center',
                padding: '8px 0',
                fontSize: '0.8rem',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
            }}>
                {t.promoBanner} {promoDeadline}
            </div>

            <header style={{
                position: 'fixed',
                top: '32px',
                left: 0,
                width: '100%',
                zIndex: 50,
                transition: 'var(--transition-normal)',
                backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.8)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                borderBottom: isScrolled ? '1px solid var(--color-border)' : '1px solid transparent',
                padding: isScrolled ? 'var(--space-3) 0' : 'var(--space-6) 0'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 
                        onClick={onGoHome}
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            margin: 0,
                            cursor: 'pointer'
                        }}
                    >
                        Seleção
                    </h1>

                    <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                        <a href="#collection" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500', transition: 'color var(--transition-fast)' }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                        >
                            {t.collection}
                        </a>

                        <button
                            onClick={onToggleLanguage}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-primary)',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                transition: 'all var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                                e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            {language === 'en' ? (
                                <>
                                    <img src="https://flagcdn.com/w40/br.png" alt="Brasil" style={{ width: '18px', height: 'auto', borderRadius: '2px' }} />
                                    <span>PT</span>
                                </>
                            ) : (
                                <>
                                    <img src="https://flagcdn.com/w40/gb.png" alt="English" style={{ width: '18px', height: 'auto', borderRadius: '2px' }} />
                                    <span>EN</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={onToggleMusic}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: isMusicPlaying ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all var(--transition-fast)',
                                opacity: isMusicPlaying ? 1 : 0.6
                            }}
                            title={isMusicPlaying ? "Pause Music" : "Play Music"}
                        >
                            {isMusicPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>

                        <button
                            onClick={onOpenCart}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                position: 'relative'
                            }}
                            aria-label="Open cart"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-12px',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-bg-base)',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    height: '20px',
                                    minWidth: '20px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 4px'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>
            </header>
        </>
    );
}
