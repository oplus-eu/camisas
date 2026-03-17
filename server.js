import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// Load .env file manually (no dotenv dependency needed)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '.env');
try {
    const envFile = readFileSync(envPath, 'utf-8');
    for (const line of envFile.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        process.env[key] = value; // Force overwrite
    }
} catch {
    console.warn('⚠️  No .env file found at server/.env — using environment variables only.');
}

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes('REPLACE')) {
    console.warn('⚠️  Missing Stripe secret key! Payments will not work.');
} else {
    console.log('✅ Stripe key found.');
}


const stripe = new Stripe(STRIPE_SECRET_KEY);
const app = express();

// API Test endpoint
app.get('/api-status', (req, res) => {
    res.json({ status: 'ok', message: 'Stripe/Email API is running' });
});

// Serve frontend static files after the build
const distPath = resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Request logger (MOVE TO TOP)
app.use((req, res, next) => {
    console.log(`🌐 [${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
});

app.use(cors()); // Allow all origins for development to avoid port conflicts
app.use(express.json());

// Configure NodeMailer transporter
// The user will need to provide these in server/.env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ SMTP Connection Error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// Create a PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'eur', metadata, email } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe uses cents
            currency,
            metadata: {
                ...metadata,
                customer_email: email
            },
            automatic_payment_methods: { enabled: true },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Send Confirmation Email
app.post('/send-confirmation', async (req, res) => {
    console.log('📬 Received request to send confirmation email');
    const { email, amount, items, customerDetails } = req.body;
    console.log(`   To: ${email}, Amount: €${amount}`);

    const orderId = `SEL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP credentials not configured. Skipping email.');
        return res.status(200).json({ message: 'Email skipped - no credentials' });
    }

    // Save order to a local "database" (JSON file)
    const orderData = {
        id: orderId,
        email,
        amount,
        items,
        customerDetails,
        date: new Date().toISOString(),
        status: 'Paid'
    };

    try {
        const dbDir = resolve(__dirname, 'db');
        const dbPath = resolve(dbDir, 'orders.json');
        
        if (!existsSync(dbDir)) mkdirSync(dbDir);
        
        let orders = [];
        if (existsSync(dbPath)) {
            orders = JSON.parse(readFileSync(dbPath, 'utf-8'));
        }
        orders.push(orderData);
        writeFileSync(dbPath, JSON.stringify(orders, null, 2));
        console.log(`💾 Order ${orderId} saved to database.`);
    } catch (err) {
        console.error('❌ Error saving order:', err);
    }

    try {
        console.log('   Generating items thermal...');
        // Generate items HTML
        let itemsHtml = '';
        if (items && Array.isArray(items)) {
            itemsHtml = `
                <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                    <h3 style="margin-top: 0; font-size: 16px; color: #333;">Items Ordered</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${items.map(item => `
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9;">
                                    <div style="font-weight: 600;">${item.name}</div>
                                    <div style="font-size: 12px; color: #666;">Size: ${item.size} × ${item.quantity}</div>
                                </td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9; text-align: right; vertical-align: top;">
                                    €${(item.price * item.quantity).toFixed(2)}
                                </td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            `;
        }

        console.log('   Preparing mail options...');
        const mailOptions = {
            from: `"Seleção Shop" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Order Confirmed - ${orderId} 🇧🇷`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #009b3a; text-align: center;">ORDER CONFIRMED!</h1>
                    <p style="text-align: center; color: #666; font-size: 14px;">Order ID: <strong>${orderId}</strong></p>
                    <p>Thank you for your purchase from the **Brazil 2026 Collection**.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h2 style="margin-top: 0; font-size: 18px;">Order Summary</h2>
                        <p style="margin: 5px 0;"><strong>Total Paid:</strong> €${amount.toFixed(2)}</p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> Processing</p>
                        ${itemsHtml}
                    </div>
                    
                    <p>Your exclusive Seleção items are being prepared for shipping and will be on their way shortly.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666; text-align: center;">
                        This is an automated confirmation for your order at Seleção Shop.<br>
                        © 2026 Camisa Seleção. All Rights Reserved.
                    </p>
                </div>
            `,
        };

        console.log('   Sending email via Nodemailer...');
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Confirmation email successfully sent to: ${email}`);

        // Seller Notification
        if (process.env.SELLER_EMAIL) {
            console.log(`   Sending notification to seller: ${process.env.SELLER_EMAIL}...`);
            const sellerMailOptions = {
                from: `"Seleção Orders" <${process.env.SMTP_USER}>`,
                to: process.env.SELLER_EMAIL,
                subject: `NEW ORDER - ${orderId} 🇧🇷`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 2px solid #009b3a;">
                        <h2 style="color: #009b3a;">New Sale Notification! 🎉</h2>
                        <p><strong>Order ID:</strong> ${orderId}</p>
                        <p><strong>Customer:</strong> ${customerDetails?.firstName} ${customerDetails?.lastName} (${email})</p>
                        <p><strong>Total:</strong> €${amount.toFixed(2)}</p>
                        <hr>
                        <h3>Delivery Info:</h3>
                        <p>
                            ${customerDetails?.address}<br>
                            ${customerDetails?.city}, ${customerDetails?.zip}<br>
                            ${customerDetails?.country}<br>
                            Phone: ${customerDetails?.phone}
                        </p>
                        <hr>
                        <h3>Items Ordered:</h3>
                        ${items.map(item => `<p>• ${item.name} (${item.size}) x ${item.quantity} - €${(item.price * item.quantity).toFixed(2)}</p>`).join('')}
                        <hr>
                        <p style="font-size: 12px;">Check your admin panel for full details.</p>
                    </div>
                `
            };
            await transporter.sendMail(sellerMailOptions);
            console.log(`📧 Seller notification sent.`);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({ error: 'Failed to send confirmation email', details: error.message });
    }
});

// GET Orders for Admin Panel
app.get('/orders', (req, res) => {
    try {
        const dbPath = resolve(__dirname, 'db/orders.json');
        if (existsSync(dbPath)) {
            const data = readFileSync(dbPath, 'utf-8');
            res.json(JSON.parse(data));
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Verify Admin Password
app.post('/verify-password', (req, res) => {
    const { password } = req.body;
    const correctPassword = process.env.ADMIN_PASSWORD || 'brazil2026';
    
    if (password === correctPassword) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
});

// Handle React routing (must be LAST)
app.get('*', (req, res) => {
    const indexPath = resolve(__dirname, 'dist/index.html');
    console.log(`🔍 Request: ${req.path} | Searching for index at: ${indexPath}`);
    if (existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error('❌ Frontend build NOT found at:', indexPath);
        res.status(404).send('Frontend not built yet. Run npm run build.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server fully started on port ${PORT}`);
    console.log(`📂 Node version: ${process.version}`);
    console.log(`📁 Root dir: ${__dirname}`);
});
