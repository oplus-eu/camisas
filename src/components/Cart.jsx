import { X, Trash2, ChevronRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import StripePaymentForm from './StripePaymentForm';

export default function Cart({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onCheckout, t, language, onOpenSizeGuide }) {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0.00; // Free shipping promo active
    const total = subtotal + shipping;
    
    const promoDeadline = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }, [language]);

    const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'details', 'payment', 'success'

    const [deliveryDetails, setDeliveryDetails] = useState({
        firstName: '', lastName: '', address: '', city: '', zip: '', country: '', email: '', confirmEmail: '', phone: ''
    });

    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '', expiry: '', cvc: '', nameOnCard: ''
    });

    // Store total before cart clears for Stripe form
    const [checkoutTotal, setCheckoutTotal] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            // Wait for transition before resetting form
            const timer = setTimeout(() => {
                setCheckoutStep('cart');
                setDeliveryDetails({ firstName: '', lastName: '', address: '', city: '', zip: '', country: '', email: '', confirmEmail: '', phone: '' });
                setPaymentDetails({ cardNumber: '', expiry: '', cvc: '', nameOnCard: '' });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const [emailError, setEmailError] = useState('');

    const handleDeliverySubmit = (e) => {
        e.preventDefault();
        if (deliveryDetails.email !== deliveryDetails.confirmEmail) {
            setEmailError(t.confirmEmailError);
            return;
        }
        setEmailError('');
        setCheckoutTotal(total); // Save total before moving to payment
        setCheckoutStep('payment');
    };

    const handleStripeSuccess = () => {
        setCheckoutStep('success');
        onCheckout(); // Clears cart in App.js
    };

    const renderCartHeader = (title, showBack = false) => (
        <div style={{
            padding: 'var(--space-6)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                {showBack && (
                    <button
                        onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'details' : 'cart')}
                        style={{
                            background: 'transparent', border: 'none', color: 'var(--color-text-primary)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0
                        }}>
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h2 style={{ fontSize: '1.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                    {title}
                </h2>
            </div>
            {checkoutStep !== 'success' && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent', border: 'none', color: 'var(--color-text-secondary)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <X size={24} />
                </button>
            )}
        </div>
    );

    const inputStyle = {
        width: '100%', padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-base)',
        border: '1px solid var(--color-border)', color: 'var(--color-text-primary)',
        fontSize: '1rem', marginTop: 'var(--space-1)'
    };

    const labelStyle = { fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: '500' };

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'var(--color-overlay)', backdropFilter: 'blur(4px)',
                    zIndex: 100, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'opacity var(--transition-normal)'
                }}
                onClick={checkoutStep === 'success' ? onClose : undefined}
            />

            {/* Sidebar */}
            <div style={{
                position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '480px', height: '100%',
                backgroundColor: 'var(--color-bg-base)', borderLeft: '1px solid var(--color-border)',
                zIndex: 101, transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform var(--transition-normal)', display: 'flex', flexDirection: 'column',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
            }}>
                {checkoutStep === 'cart' && (
                    <>
                        {renderCartHeader(`${t.yourCart} (${cartItems.reduce((sum, item) => sum + item.quantity, 0)})`)}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                            {cartItems.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: 'var(--space-12)' }}>
                                    <p>{t.cartEmpty}</p>
                                    <button onClick={onClose} style={{ marginTop: 'var(--space-6)', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', padding: 'var(--space-3) var(--space-6)', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.05em' }}>
                                        {t.continueShopping}
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                        <div style={{ width: '100px', aspectRatio: '3/4', backgroundColor: 'var(--color-bg-surface)', flexShrink: 0 }}>
                                            <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-1)' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: '500', margin: 0 }}>{item.name}</h3>
                                                <p style={{ fontWeight: '500', margin: 0 }}>€{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'auto' }}>{t.size}: {item.size}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-3)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)' }}>
                                                    <button onClick={() => onUpdateQuantity(item.id, item.size, item.quantity - 1)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', padding: '4px 12px', cursor: 'pointer' }}>-</button>
                                                    <span style={{ fontSize: '0.875rem', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                    <button onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', padding: '4px 12px', cursor: 'pointer' }}>+</button>
                                                </div>
                                                <button onClick={() => onRemoveItem(item.id, item.size)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                    <Trash2 size={14} /> {t.remove}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {cartItems.length > 0 && (
                            <div style={{ padding: 'var(--space-6)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
                                <button 
                                    onClick={() => { onClose(); onOpenSizeGuide(); }}
                                    style={{ background: 'transparent', border: 'none', padding: 0, color: 'var(--color-text-secondary)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer', marginBottom: 'var(--space-4)', display: 'block' }}
                                >
                                    {t.sizeGuide}
                                </button>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}><span>{t.subtotal}</span><span>€{subtotal.toFixed(2)}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}><span>{t.shipping}</span><span>{shipping === 0 ? `${t.freeShipping} ${promoDeadline}` : `€${shipping.toFixed(2)}`}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)', fontWeight: '600', fontSize: '1.25rem' }}><span>{t.total}</span><span>€{total.toFixed(2)}</span></div>
                                <button onClick={() => setCheckoutStep('details')} style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', border: 'none', padding: 'var(--space-4)', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                    {t.checkout} <ChevronRight size={20} />
                                </button>
                                <button onClick={onClose} style={{ width: '100%', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', padding: 'var(--space-3)', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                                    {t.continueShopping}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {checkoutStep === 'details' && (
                    <>
                        {renderCartHeader(t.deliveryDetails, true)}
                        <form onSubmit={handleDeliverySubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div>
                                        <label style={labelStyle}>{t.firstName}</label>
                                        <input required type="text" style={inputStyle} value={deliveryDetails.firstName} onChange={e => setDeliveryDetails({ ...deliveryDetails, firstName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>{t.lastName}</label>
                                        <input required type="text" style={inputStyle} value={deliveryDetails.lastName} onChange={e => setDeliveryDetails({ ...deliveryDetails, lastName: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>{t.address}</label>
                                    <input required type="text" style={inputStyle} value={deliveryDetails.address} onChange={e => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div>
                                        <label style={labelStyle}>{t.city}</label>
                                        <input required type="text" style={inputStyle} value={deliveryDetails.city} onChange={e => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>{t.zipCode}</label>
                                        <input required type="text" style={inputStyle} value={deliveryDetails.zip} onChange={e => setDeliveryDetails({ ...deliveryDetails, zip: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>{t.country}</label>
                                    <select required style={inputStyle} value={deliveryDetails.country} onChange={e => setDeliveryDetails({ ...deliveryDetails, country: e.target.value })}>
                                        <option value="" disabled>{t.selectCountry}</option>
                                        <option value="PT">Portugal</option>
                                        <option value="NL">Netherlands</option>
                                        <option value="DE">Germany</option>
                                        <option value="FR">France</option>
                                        <option value="ES">Spain</option>
                                        <option value="IT">Italy</option>
                                        <option value="BE">Belgium</option>
                                        <option value="AT">Austria</option>
                                        <option value="IE">Ireland</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>{t.email}</label>
                                    <input required type="email" style={inputStyle} value={deliveryDetails.email} onChange={e => { setDeliveryDetails({ ...deliveryDetails, email: e.target.value }); setEmailError(''); }} />
                                </div>
                                <div>
                                    <label style={labelStyle}>{t.confirmEmail}</label>
                                    <input required type="email" style={{ ...inputStyle, borderColor: emailError ? '#ef4444' : undefined }} value={deliveryDetails.confirmEmail} onChange={e => { setDeliveryDetails({ ...deliveryDetails, confirmEmail: e.target.value }); setEmailError(''); }} />
                                    {emailError && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 'var(--space-1)', margin: 0 }}>{emailError}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>{t.phone}</label>
                                    <input required type="tel" style={inputStyle} value={deliveryDetails.phone} onChange={e => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ marginTop: 'auto', padding: 'var(--space-6)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
                                <button type="submit" style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', border: 'none', padding: 'var(--space-4)', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                                    {t.continueToPayment}
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {checkoutStep === 'payment' && (
                    <>
                        {renderCartHeader(t.payment, true)}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: 'var(--space-6)' }}>
                                <StripePaymentForm
                                    total={checkoutTotal}
                                    email={deliveryDetails.email}
                                    deliveryDetails={deliveryDetails}
                                    items={cartItems}
                                    onSuccess={handleStripeSuccess}
                                />
                            </div>
                        </div>
                    </>
                )}

                {checkoutStep === 'success' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)', textAlign: 'center' }}>
                        <CheckCircle size={64} style={{ color: '#10b981', marginBottom: 'var(--space-6)' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)' }}>{t.orderConfirmed}</h2>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-8)' }}>
                            {t.thankYou}, {deliveryDetails.firstName || 'customer'}! {t.preparedShipping}
                        </p>
                        <button onClick={onClose} style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', border: 'none', padding: 'var(--space-4) var(--space-8)', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                            {t.continueShopping}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
