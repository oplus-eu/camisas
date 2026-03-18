import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Cart from './components/Cart';
import SizeGuide from './components/SizeGuide';
import AdminDashboard from './components/AdminDashboard';
import ShippingReturns from './components/ShippingReturns';
import productsData from './data/products.json';
import { translations } from './data/translations';
import './index.css';

function App() {
  const [language, setLanguage] = useState('en');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState('shop'); // 'shop', 'size-guide', 'admin', 'shipping'
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [cartInitialStep, setCartInitialStep] = useState('cart');

  const openSizeGuide = () => {
    setSelectedProduct(null);
    setIsCartOpen(false);
    setView('size-guide');
  };

  const openShipping = () => {
    setSelectedProduct(null);
    setIsCartOpen(false);
    setView('shipping');
  };

  const openAdmin = () => {
    setSelectedProduct(null);
    setIsCartOpen(false);
    setView('admin');
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  const toggleMusic = () => {
    setIsMusicPlaying(prev => !prev);
  };

  const collectionRef = useRef(null);

  const scrollToCollection = () => {
    if (view !== 'shop') {
      setView('shop');
      setTimeout(() => {
        collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check for successful payment on mount (returned from redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientSecret = params.get('payment_intent_client_secret');
    const status = params.get('redirect_status');

    if (clientSecret && status === 'succeeded') {
      // 1. Success! Clear cart
      setCartItems([]);
      // 2. Open cart directly to success step
      setCartInitialStep('success');
      setIsCartOpen(true);
      // 3. Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleAddToCart = (product, size) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.size === size);
      if (existingItem) {
        return prev.map(item =>
          (item.id === product.id && item.size === size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setSelectedProduct(null); // Close modal on add
    setIsCartOpen(true);      // Open cart to show success
  };

  const handleRemoveItem = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const handleUpdateQuantity = (id, size, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id, size);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        (item.id === id && item.size === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    // Only clear the cart items; the Cart component handles the rest of the flow
    setCartItems([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        language={language}
        onToggleLanguage={toggleLanguage}
        t={t}
        onGoHome={() => setView('shop')}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
      />

      <main style={{ flex: 1 }}>
        {view === 'shop' ? (
          <>
            <Hero scrollToCollection={scrollToCollection} t={t} />

            <section
              ref={collectionRef}
              id="collection"
              style={{ padding: 'var(--space-16) 0', backgroundColor: 'var(--color-bg-base)' }}
            >
              <div className="container">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 'var(--space-12)',
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: 'var(--space-4)'
                }}>
                  <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: '300',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {t.theCollection}
                  </h2>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {productsData.length} {t.exclusiveItems}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 'var(--space-6)',
                  rowGap: 'var(--space-12)'
                }}>
                  {productsData.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={setSelectedProduct}
                      t={t}
                      language={language}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : view === 'size-guide' ? (
          <SizeGuide onBack={() => setView('shop')} language={language} t={t} />
        ) : view === 'shipping' ? (
          <ShippingReturns onBack={() => setView('shop')} language={language} />
        ) : (
          <AdminDashboard onBack={() => setView('shop')} />
        )}
      </main>

      <footer style={{
        padding: 'var(--space-12) 0',
        backgroundColor: 'var(--color-bg-surface-elevated)',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-12)'
        }}>
          <div>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', fontSize: '1.25rem', letterSpacing: '0.1em' }}>SELEÇÃO</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{t.footerText}</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>{t.support}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li><button onClick={openShipping} style={{ background: 'transparent', border: 'none', padding: 0, color: 'inherit', font: 'inherit', cursor: 'pointer', textAlign: 'left' }}>{t.shippingReturns}</button></li>
              <li>
                <button 
                  onClick={openSizeGuide}
                  style={{ background: 'transparent', border: 'none', padding: 0, color: 'inherit', font: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  {t.sizeGuide}
                </button>
              </li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t.contactUs}</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>{t.legal}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t.termsOfService}</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t.privacyPolicy}</a></li>
            </ul>
          </div>
        </div>
        <div className="container" style={{
          textAlign: 'center',
          paddingTop: 'var(--space-8)',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <p>2026 Seleção Exclusive</p>
          <button 
            onClick={openAdmin}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--color-text-muted)', 
              fontSize: '10px', 
              cursor: 'pointer',
              marginTop: '10px',
              opacity: 0.5
            }}
          >
            Admin Panel
          </button>
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        t={t}
        onOpenSizeGuide={openSizeGuide}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
        t={t}
        language={language}
        onOpenSizeGuide={openSizeGuide}
        initialStep={cartInitialStep}
      />
      {/* Hidden Music Player */}
      {isMusicPlaying && (
        <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <iframe 
            width="0" 
            height="0" 
            src="https://www.youtube.com/embed/sQESmAtuxNI?autoplay=1" 
            title="Brasil Music" 
            frameBorder="0" 
            allow="autoplay; encrypted-media" 
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default App;
