# 🇧🇷 Seleção Exclusive Webshop

A high-performance, mobile-optimized, bilingual e-commerce platform for exclusive Brazil national team products. Built with **React + Vite** and **Express/Node.js**.

## 🚀 Key Features
- **🌍 Bilingual Support**: Global reach with full English and Portuguese translations.
- **💳 Multi-Payment Checkout**: Integrated with **Stripe PaymentElement** for Credit Cards, Apple Pay, Google Pay, iDEAL, and more.
- **📱 Mobile Optimized**: Includes advanced fixes for mobile input focus, smooth transitions, and autofill checkout.
- **🏗️ Direct Factory Model**: Built-in information architecture explaining direct manufacturing and shipping.
- **👔 Admin Control**: Professional backend dashboard to view and manage customer orders.

---

## 🛠️ Tech Stack
- **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [Lucide Icons](https://lucide.dev/)
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Payments**: [Stripe API](https://stripe.com/)
- **Emails**: [Nodemailer](https://nodemailer.com/) (Gmail SMTP Integration)

---

## 🔑 Technical Roadmap & "Lessons Learned"

### 1. **Stripe Mobile Focus Fix**
On mobile devices, the Stripe iframe can frequently fail to receive focus or appear blank during transitions.
- **Solution**: A 400ms delay is implemented in `StripePaymentForm.jsx` to wait for the sidebar animation to finish before mounting the sensitive iframe. Explicit pixel heights and `overflow: visible` are forced on all parent containers.

### 2. **Redirect Payment Handling (iDEAL/Wero)**
For payment methods that require browser redirects, the app detects return parameters (`payment_intent_client_secret`) in `App.jsx` on mount. It automatically clears the cart and opens the checkout sidebar directly to the "Order Confirmed" screen.

### 3. **Vite Local Proxy**
To avoid CORS issues and relative path errors between the frontend (Port 5173) and backend (Port 3000), `vite.config.js` is configured with a server proxy.

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```text
# Stripe (Frontend) - Must have VITE_ prefix
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe (Backend)
STRIPE_SECRET_KEY=sk_test_...

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin
ADMIN_PASSWORD=your-secret-password
```

### 3. Start Development Servers
In two separate terminals:
```bash
# Terminal 1: Frontend (Vite)
npm run dev

# Terminal 2: Backend (Server)
npm run start
```

---

## 📦 Deployment to Hostinger
1. **Build**: Run `npm run build` locally to generate the `dist/` folder.
2. **Push**: Commit and push changes to GitHub.
3. **Host**: Upload `server.js`, `package.json`, `.env`, and the `dist/` folder to Hostinger.
4. **Node**: Use Hostinger's Node.js selector to point to `server.js`.

---

© 2026 Seleção Exclusive. Driven by passion. 🇧🇷⚽
