# 🌟 Starcoin Exchange

A lightweight web-based platform for users to buy **Starcoin (STC)** at a fixed USD rate. Built with **React + Tailwind CSS** (frontend) and **Flask** (backend).  
Designed for rapid deployment and educational use, with real wallet logic and simulated transfers.

> ✅ **Live Frontend:** [https://starcoin-static.onrender.com](https://starcoin-static.onrender.com)  
> ✅ **Live Backend API:** [https://starcoin-exchange.onrender.com](https://starcoin-exchange.onrender.com)

---

## 💸 Live Trade Demo

- 🔒 **Fixed rate:** 1 STC = **$4.99 USD**
- 💼 Fiat payments via PayPal: `jamesnmargie@live.com.au`
- 🪙 STC is minted into your wallet (mocked or real chain support)
- 📋 Shows recent transactions with wallet + block metadata
- 🔐 Data is stored in simple JSON files for speed and transparency

---

## 🔧 Project Structure

```
starcoin-exchange/
├── backend/               # Flask API
│   ├── app.py             # Main backend logic
│   ├── wallets.json       # Per-user balances (USD + STC)
│   └── transactions.json  # Ledger of purchases
│
├── frontend/              # React + Tailwind UI
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── config.js
│   │   ├── index.css
│   │   └── assets/
│   │       └── bg.jpg     # Background image
│   └── vite.config.js
│
├── render.yaml            # Optional: Render.com deployment config
├── requirements.txt       # Flask backend dependencies
└── README.md
```

---

## ⚙️ Local Setup Instructions

### 🔹 Backend (Flask)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 🔹 Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

### 🔹 Update API Endpoint
In `frontend/src/config.js`:
```js
export const API_URL = "https://starcoin-exchange.onrender.com";  // Or http://localhost:5000 for local
```

---

## 🏦 Default Wallets (Example Data)

```json
{
  "Alice": {
    "address": "0xDEADBEEF00000000000000000000000000000000",
    "balance": 100,
    "fiat_balance": 0
  },
  "Bob": {
    "address": "0xFEEDBEEF00000000000000000000000000000000",
    "balance": 50,
    "fiat_balance": 0
  },
  "Charlie": {
    "address": "0xBEEFCAFE00000000000000000000000000000000",
    "balance": 75,
    "fiat_balance": 0
  }
}
```

---

## ✨ Features

- ✅ Fixed exchange rate: **1 STC = $4.99 USD**
- 📈 Transaction history with wallet & block height
- 🔁 Real STC transfers using `litecoin-cli` (regtest/mainnet supported)
- 📦 Full JSON file ledger of all activity
- 🧪 Mint mock balances to simulate a live exchange
- 💼 User wallets show both STC and fiat value
- 📬 Optional QR & email receipts (Mailgun-ready)
- 🎨 Clean responsive layout via Tailwind CSS
- 🔒 CORS-secured Flask backend, cross-browser ready
- 🚀 Deployable in 2 minutes with [Render](https://render.com)

---

## 🌍 Deployment

### 🌐 Frontend
```bash
cd frontend
npm run build
npx serve -s dist
```

### 🛠️ Backend
```bash
cd backend
gunicorn app:app -b 0.0.0.0:5000
```

Or deploy both to Render using `render.yaml` config.

---

## 🧭 Roadmap

- [ ] Live PayPal payment verification via IPN / Webhook
- [ ] User registration + wallet linking (Google/email auth)
- [ ] On-chain STC integration (regtest/mainnet)
- [ ] QR code & transaction email confirmation
- [ ] Admin portal (approve large trades, freeze wallets)
- [ ] Live price from CoinGecko
- [ ] Secure production backend with HTTPS, JWT auth
- [ ] NGINX + Gunicorn setup for full production

---

## 👤 Author

**James Jackson**  
✉️ `jamesnmargie@live.com.au`  
🪙 STC Wallet: `rstar1qxxxx...` *(available upon request)*  
💡 Mission: To launch Starcoin to help fund real-world impact, including child hunger relief and digital freedom initiatives.

---

## 🛡️ Disclaimer

This platform is for educational and demonstration purposes only.  
No actual fiat or crypto is processed unless explicitly integrated.  
Use responsibly. Ensure legal compliance if operating as a real exchange.

---

## 🌐 Links

- Frontend: [https://starcoin-static.onrender.com](https://starcoin-static.onrender.com)
- Backend: [https://starcoin-exchange.onrender.com](https://starcoin-exchange.onrender.com)
