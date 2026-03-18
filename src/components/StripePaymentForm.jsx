import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TBirxAG7XmMZYX99AUVS9NH0LCQbRjGHC1Wa6ILKCWGr6XNTJCIT3pCvjouI5MD564m4pcZ8sYPnTGiQLpefB8Y00cXvUp0oS');

function CheckoutForm({ total, email, items, deliveryDetails, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage('');

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // For PaymentElement, we typically handle redirects or 
                // use redirect: 'if_required' for card/wallet payments.
                return_url: window.location.origin,
            },
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Send confirmation email
            try {
                await fetch('/send-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        email, 
                        amount: total, 
                        items,
                        customerDetails: deliveryDetails
                    }),
                });
            } catch (emailErr) {
                console.error('Error sending confirmation email:', emailErr);
            }
            onSuccess();
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
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{email}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                    Secure checkout powered by Stripe
                </p>
            </div>

            <div style={{ minHeight: '300px' }}>
                <PaymentElement options={{ layout: 'tabs' }} />
            </div>

            {errorMessage && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 'var(--space-2) 0' }}>{errorMessage}</p>
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
                    transition: 'all var(--transition-fast)',
                    marginTop: 'var(--space-4)'
                }}
            >
                {isProcessing ? 'Processing...' : `Pay €${total.toFixed(2)}`}
            </button>
        </form>
    );
}

export default function StripePaymentForm({ total, email, items, deliveryDetails, onSuccess, onError }) {
    const [clientSecret, setClientSecret] = useState('');
    const [isLoadingSecret, setIsLoadingSecret] = useState(true);

    useEffect(() => {
        const fetchSecret = async () => {
            try {
                const response = await fetch('/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total, currency: 'eur', email }),
                });
                const data = await response.json();
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error('Error fetching payment intent:', err);
                if (onError) onError(err);
            } finally {
                setIsLoadingSecret(false);
            }
        };

        fetchSecret();
    }, [total, email]);

    if (isLoadingSecret) {
        return <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-secondary)' }}>Loading payment methods...</div>;
    }

    if (!clientSecret) {
        return <div style={{ color: '#ef4444' }}>Error initializing payment. Please try again.</div>;
    }

    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#FFDF00',
            colorBackground: '#0a0a0a',
            colorText: '#ffffff',
            colorDanger: '#df1b41',
            fontFamily: 'Outfit, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px',
        },
        rules: {
            '.Input': {
                border: '1px solid #27272a',
                backgroundColor: '#0a0a0a',
            },
            '.Input:focus': {
                border: '1px solid #FFDF00',
                boxShadow: 'none',
            },
        }
    };

    return (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
            <CheckoutForm 
                total={total} 
                email={email} 
                items={items} 
                deliveryDetails={deliveryDetails} 
                onSuccess={onSuccess} 
            />
        </Elements>
    );
}
