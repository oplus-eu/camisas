import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, User, Euro, Search, MapPin, Phone, Download } from 'lucide-react';

export default function AdminDashboard({ onBack }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginError, setLoginError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            
            if (response.ok) {
                setIsAuthenticated(true);
                setLoginError(false);
            } else {
                setLoginError(true);
            }
        } catch (err) {
            console.error('Login error:', err);
            setLoginError(true);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetch('/orders')
                .then(res => res.json())
                .then(data => {
                    setOrders(data.reverse()); // Newest first
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching orders:', err);
                    setLoading(false);
                });
        }
    }, [isAuthenticated]);

    const filteredOrders = orders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDetails?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDetails?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        if (orders.length === 0) return;

        const headers = [
            'Order ID', 'Date', 'Time', 'Status', 'Customer Name', 'Email', 
            'Address', 'City', 'Zip', 'Country', 'Phone', 
            'Total Amount', 'Items'
        ];

        const rows = orders.map(order => {
            const dateObj = new Date(order.date);
            const dateStr = dateObj.toLocaleDateString('pt-BR');
            const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            const itemsList = order.items.map(i => `${i.name} (${i.size}) x${i.quantity}`).join('; ');
            return [
                order.id,
                dateStr,
                timeStr,
                order.status,
                `${order.customerDetails?.firstName || ''} ${order.customerDetails?.lastName || ''}`,
                order.email,
                order.customerDetails?.address || '',
                order.customerDetails?.city || '',
                order.customerDetails?.zip || '',
                order.customerDetails?.country || '',
                order.customerDetails?.phone || '',
                order.amount.toFixed(2),
                `"${itemsList}"`
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `selecao_orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isAuthenticated) {
        return (
            <div style={{ backgroundColor: 'var(--color-bg-base)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
                <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: 'var(--space-12)', borderRadius: '8px', border: '1px solid var(--color-border)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin <span style={{ color: 'var(--color-primary)' }}>Login</span></h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <input 
                            type="password" 
                            placeholder="Enter Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                            style={{
                                padding: '12px',
                                backgroundColor: 'var(--color-bg-base)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '4px',
                                color: 'white',
                                textAlign: 'center',
                                fontSize: '1rem'
                            }}
                        />
                        {loginError && <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 0 }}>Incorrect password. Try again.</p>}
                        <button 
                            type="submit"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'black',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '4px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            Access Dashboard
                        </button>
                        <button 
                            onClick={onBack}
                            type="button"
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                            Back to Shop
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--color-bg-base)', minHeight: '100vh', padding: '140px 0 var(--space-16) 0' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                {/* Global Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            letterSpacing: '0.05em'
                        }}
                    >
                        <ArrowLeft size={20} />
                        Back to Shop
                    </button>
                    
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                            <input 
                                type="text" 
                                placeholder="Search orders..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 10px 10px 40px',
                                    backgroundColor: 'var(--color-bg-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '4px',
                                    color: 'var(--color-text-primary)'
                                }}
                            />
                        </div>
                        <button
                            onClick={exportToCSV}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'var(--color-bg-surface-elevated)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-primary)',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}
                        >
                            <Download size={18} /> Export
                        </button>
                    </div>
                </div>

                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: '300',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--space-12)',
                    letterSpacing: '0.1em'
                }}>
                    Order <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Dashboard</span>
                </h1>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed var(--color-border)', borderRadius: '8px' }}>
                        <Package size={48} style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', opacity: 0.3 }} />
                        <p style={{ color: 'var(--color-text-secondary)' }}>No orders found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {filteredOrders.map(order => (
                            <div key={order.id} style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '4px',
                                padding: 'var(--space-4) var(--space-6)',
                                overflow: 'hidden'
                            }}>
                                {/* Compact Single Line Header */}
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    flexWrap: 'wrap', 
                                    gap: '24px',
                                    color: 'var(--color-text-secondary)',
                                    fontSize: '0.8125rem'
                                }}>
                                    {/* Name */}
                                    <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'white', minWidth: '120px' }}>
                                        {order.customerDetails?.firstName} {order.customerDetails?.lastName}
                                    </div>

                                    {/* Email */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <User size={14} style={{ opacity: 0.6 }} />
                                        {order.email}
                                    </div>

                                    {/* Phone */}
                                    {order.customerDetails?.phone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Phone size={14} style={{ opacity: 0.6 }} />
                                            {order.customerDetails.phone}
                                        </div>
                                    )}

                                    {/* Address */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                                        <MapPin size={14} style={{ opacity: 0.6 }} />
                                        {order.customerDetails?.address}, {order.customerDetails?.zip} {order.customerDetails?.city}, {order.customerDetails?.country}
                                    </div>

                                    {/* Order ID Tag */}
                                    <div style={{ 
                                        backgroundColor: 'var(--color-primary)', 
                                        color: 'black', 
                                        padding: '2px 8px', 
                                        borderRadius: '4px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '800' 
                                    }}>
                                        {order.id}
                                    </div>

                                    {/* Date */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Clock size={14} style={{ opacity: 0.6 }} />
                                        {new Date(order.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>

                                    {/* Price */}
                                    <div style={{ fontSize: '1.125rem', fontWeight: '400', color: 'var(--color-primary)', marginLeft: 'auto' }}>
                                        € {order.amount.toFixed(2)}
                                    </div>

                                    {/* Status */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '600' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                                        {order.status}
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div style={{ marginTop: 'var(--space-4)' }}>
                                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', letterSpacing: '0.05em', fontWeight: '600' }}>
                                        ITEMS ORDERED
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={{ 
                                                display: 'flex', 
                                                gap: '20px', 
                                                alignItems: 'baseline',
                                                fontSize: '0.8125rem'
                                            }}>
                                                <div style={{ fontWeight: '600', color: 'white', minWidth: '200px' }}>{item.name}</div>
                                                <div style={{ fontWeight: '700', color: 'white' }}>€{(item.price * item.quantity).toFixed(2)}</div>
                                                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                    Size: <span style={{ color: 'white', fontWeight: '600' }}>{item.size}</span> | Qty: <span style={{ color: 'white', fontWeight: '600' }}>{item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
