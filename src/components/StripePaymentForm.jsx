import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TBirxAG7XmMZYX99AUVS9NH0LCQbRjGHC1Wa6ILKCWGr6XNTJCIT3pCvjouI5MD564m4pcZ8sYPnTGiQLpefB8Y00cXvUp0oS');

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '16px',
            '::placeholder': { color: '#a1a1aa' },
        },
        invalid: { color: '#ef4444', iconColor: '#ef4444' },
    },
};

function CheckoutForm({ total, email: initialEmail, items, deliveryDetails, onSuccess, onError }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Common mobile fix: wait for animations/transitions to settle before rendering the sensitive iframe
    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 400);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage('');

        try {
            // 1. Create PaymentIntent on the server
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total, currency: 'eur', email: initialEmail }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Server error');
            }

            const { clientSecret } = await response.json();

            // 2. Confirm the payment with Stripe.js
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { 
                    card: elements.getElement(CardElement),
                    billing_details: { email: initialEmail }
                },
            });

            if (error) {
                setErrorMessage(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                // Send confirmation email
                try {
                    await fetch('/send-confirmation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            email: initialEmail, 
                            amount: total, 
                            items,
                            customerDetails: deliveryDetails
                        }),
                    });
                } catch (emailErr) {
                    console.error('Error sending confirmation email:', emailErr);
                    // We don't block the success UI if only the email fails
                }
                onSuccess();
            }
        } catch (err) {
            setErrorMessage(err.message || 'An unexpected error occurred.');
            if (onError) onError(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{
                backgroundColor: 'var(--color-bg-surface-elevated)',
                padding: 'var(--space-4)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                marginBottom: 'var(--space-2)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontWeight: '600' }}>€{total.toFixed(2)}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{initialEmail}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                    Secure payment powered by Stripe
                </p>
            </div>

            <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', marginBottom: 'var(--space-2)' }}>
                    Card Details
                </label>
                <div style={{
                    padding: '12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--color-bg-base)',
                    minHeight: '44px',
                    overflow: 'visible',
                    position: 'relative',
                    zIndex: 999,
                    pointerEvents: 'auto',
                    cursor: 'text',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    {isMounted ? (
                        <div style={{ width: '100%', overflow: 'visible' }}>
                            <CardElement options={CARD_ELEMENT_OPTIONS} />
                        </div>
                    ) : (
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Loading payment field...</div>
                    )}
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                    Test card: 4242 4242 4242 4242 &nbsp;|&nbsp; Any future date &nbsp;|&nbsp; Any CVC
                </p>
            </div>

            {errorMessage && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 0 }}>{errorMessage}</p>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                style={{
                    width: '100%',
                    backgroundColor: isProcessing ? 'var(--color-text-secondary)' : 'var(--color-primary)',
                    color: 'var(--color-bg-base)',
                    border: 'none',
                    padding: 'var(--space-4)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    borderRadius: '2px',
                    opacity: isProcessing ? 0.7 : 1,
                    transition: 'all var(--transition-fast)'
                }}
            >
                {isProcessing ? 'Processing...' : `Pay €${total.toFixed(2)}`}
            </button>
        </form>
    );
}
export default function StripePaymentForm({ total, email, items, deliveryDetails, onSuccess, onError }) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm total={total} email={email} items={items} deliveryDetails={deliveryDetails} onSuccess={onSuccess} onError={onError} />
        </Elements>
    );
}
