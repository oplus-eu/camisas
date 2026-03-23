import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('--- STARTING SELEÇÃO SERVER ---');

try {
    // 1. Load Environment Variables
    const envPath = resolve(__dirname, '.env');
    if (existsSync(envPath)) {
        const envFile = readFileSync(envPath, 'utf-8');
        for (const line of envFile.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx === -1) continue;
            const key = trimmed.slice(0, eqIdx).trim();
            const value = trimmed.slice(eqIdx + 1).trim();
            process.env[key] = value;
        }
        console.log('✅ .env file loaded.');
    } else {
        console.log('ℹ️ Running with Environment Variables only (No .env found).');
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
        console.warn('⚠️ STRIPE_SECRET_KEY is missing!');
    } else {
        console.log('✅ Stripe key found.');
    }

    const app = express();
    app.use(cors());
    app.use(express.json());

    // Serve STATIC files from /dist
    let distPath = resolve(__dirname, 'dist');
    if (!existsSync(distPath)) {
        distPath = resolve(__dirname, '..', 'dist');
    }
    
    console.log(`📂 Checking for frontend at: ${distPath}`);
    if (existsSync(distPath)) {
        app.use(express.static(distPath));
        console.log('✅ Serving frontend from /dist');
    } else {
        console.warn('⚠️ /dist folder not found! Frontend will not load.');
    }

    // API Routes
    app.get('/api-status', (req, res) => res.json({ status: 'ok' }));

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    app.post('/create-payment-intent', async (req, res) => {
        try {
            const { amount, currency = 'eur', metadata, email } = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency,
                metadata: { ...metadata, customer_email: email },
                automatic_payment_methods: { enabled: true },
            });
            res.json({ clientSecret: paymentIntent.client_secret });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.post('/send-confirmation', async (req, res) => {
        try {
            const { email, amount, items, customerDetails } = req.body;
            
            // Generate unique Order ID
            const orderId = `SEL-${Math.random().toString(36).toUpperCase().substring(2, 11)}`;
            
            const newOrder = {
                id: orderId,
                email,
                amount,
                items,
                customerDetails,
                date: new Date().toISOString(),
                status: 'Paid'
            };

            // 1. Save to JSON Database
            let dbDir = resolve(__dirname, 'db');
            if (basename(__dirname) !== 'server' && !existsSync(dbDir)) {
                dbDir = resolve(__dirname, 'server/db');
            }
            
            if (!existsSync(dbDir)) {
                mkdirSync(dbDir, { recursive: true });
            }
            
            const dbPath = resolve(dbDir, 'orders.json');
            let orders = [];
            if (existsSync(dbPath)) {
                try {
                    orders = JSON.parse(readFileSync(dbPath, 'utf8'));
                } catch (e) {
                    console.error('Error parsing orders.json:', e);
                    orders = [];
                }
            }
            
            orders.push(newOrder);
            writeFileSync(dbPath, JSON.stringify(orders, null, 2));
            console.log(`✅ Order ${orderId} saved to database.`);

            // 2. Send Customer Confirmation Email
            const itemsHtml = items.map(item => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.size})</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `).join('');

            const customerMailOptions = {
                from: `"Seleção Exclusive" <${process.env.SMTP_USER}>`,
                to: email,
                subject: `Order Confirmed: ${orderId} 🇧🇷`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                        <h1 style="color: #FFDF00; text-align: center; background: #0a0a0a; padding: 20px; margin: 0; letter-spacing: 0.2em;">SELEÇÃO</h1>
                        <div style="padding: 20px;">
                            <h2>Thank you for your order, ${customerDetails.firstName}!</h2>
                            <p>We've received your payment and are preparing your exclusive Brazil 2026 items for shipment.</p>
                            
                            <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
                                <p><strong>Order ID:</strong> ${orderId}</p>
                                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                            </div>

                            <h3>Order Summary</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background: #eee;">
                                        <th style="padding: 10px; text-align: left;">Item</th>
                                        <th style="padding: 10px; text-align: center;">Qty</th>
                                        <th style="padding: 10px; text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                                        <td style="padding: 10px; text-align: right;"><strong>€${amount.toFixed(2)}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div style="margin-top: 30px;">
                                <h3>Shipping Address</h3>
                                <p>
                                    ${customerDetails.firstName} ${customerDetails.lastName}<br>
                                    ${customerDetails.address}<br>
                                    ${customerDetails.zip} ${customerDetails.city}<br>
                                    ${customerDetails.country}
                                </p>
                            </div>
                        </div>
                        <div style="text-align: center; color: #888; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                            © 2026 Seleção Exclusive. All rights reserved.
                        </div>
                    </div>
                `
            };

            // 3. Send Admin Notification Email
            const adminMailOptions = {
                from: `"Seleção System" <${process.env.SMTP_USER}>`,
                to: process.env.SMTP_USER,
                subject: `NEW ORDER ALERT: ${orderId} (€${amount.toFixed(2)})`,
                text: `New order received from ${customerDetails.firstName} ${customerDetails.lastName} (${email}).\nTotal: €${amount.toFixed(2)}\nOrder ID: ${orderId}\nCheck the Admin Dashboard for details.`
            };

            await transporter.sendMail(customerMailOptions);
            await transporter.sendMail(adminMailOptions);
            console.log(`📧 Notification emails sent for order ${orderId}.`);

            res.json({ success: true, orderId });
        } catch (error) {
            console.error('💥 Error in /send-confirmation:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Admin endpoint (legacy header-based)
    app.get('/admin-orders', (req, res) => {
        const password = req.headers['x-admin-password'];
        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const dbPath = resolve(__dirname, 'server/db/orders.json');
        if (existsSync(dbPath)) {
            res.json(JSON.parse(readFileSync(dbPath, 'utf8')));
        } else {
            res.json([]);
        }
    });

    // Admin: verify password (used by AdminDashboard login form)
    app.post('/verify-password', (req, res) => {
        const { password } = req.body;
        if (password === process.env.ADMIN_PASSWORD) {
            res.json({ ok: true });
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    });

    // Admin: fetch all orders (used by AdminDashboard after login)
    app.get('/orders', (req, res) => {
        let dbDir = resolve(__dirname, 'db');
        if (!existsSync(dbDir)) {
            dbDir = resolve(__dirname, 'server/db');
        }
        const dbPath = resolve(dbDir, 'orders.json');
        
        if (existsSync(dbPath)) {
            res.json(JSON.parse(readFileSync(dbPath, 'utf8')));
        } else {
            res.json([]);
        }
    });

    // Catch-all React Routing (Fixed for Express 5)
    app.get('*all', (req, res) => {
        const indexPath = resolve(distPath, 'index.html');
        if (existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).send('Not Found');
        }
    });

    // START LISTEN
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 BOOT SUCCESSFUL! READY ON PORT ${PORT}`);
    });

    // Keep the process alive in environments that might terminate early
    setInterval(() => {}, 1000 * 60 * 60); // 1 hour heartbeat

} catch (globalError) {
    console.error('💥 CRITICAL STARTUP ERROR:', globalError);
}
