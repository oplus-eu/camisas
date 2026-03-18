import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
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

    // Serve STATIC files first
    const distPath = resolve(__dirname, 'dist');
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

    // Admin endpoint
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

} catch (globalError) {
    console.error('💥 CRITICAL STARTUP ERROR:', globalError);
}
