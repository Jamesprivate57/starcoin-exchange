# 🌟 Starcoin Exchange

A professional crypto platform to **buy, sell, and donate** using **Starcoin (STC)**, with live ticker data, a fixed rate STC price, and PayPal integration.

> ✅ Live Frontend: [starcoin-static.onrender.com](https://starcoin-static.onrender.com)  
> ✅ Live Backend API: [starcoin-exchange.onrender.com](https://starcoin-exchange.onrender.com)

---

## 💹 Key Features

- ✅ Fixed rate: **1 STC → $2499.00**

2 STC → $4898.04 (2% off)
3 STC → $7272.09 (3% off)
4 STC → $9596.16 (4% off)
5 STC → $11870.25 (5% off)**

- 💳 PayPal purchase & donation support
- 🧾 Email receipts (optional)
- 📈 Real-time ticker for BTC, ETH, SOL, SHIB, DOGE, XRP, PEPE, ETH Gas, STAR
- 🟥 Colour-coded % changes (green = up, red = down)
- 🧊 Clean modern UI (Tailwind + frosted glass)
- 🔄 Sell STC → USD
- 🏦 Withdraw USD to PayPal
- 🧾 Recent transaction display

---

## 🧾 Example UI

- **Ticker**: Live, scrolling, price + 24h % for each crypto
- **Manual Buy**: Wallet + USD input, email optional
- **PayPal Buy**: Direct form
- **Donate**: Hosted PayPal button
- **Sell STC**: Convert STC to USD
- **Withdraw**: Payout to PayPal email
- **Recent Transactions**: Displayed with timestamp, address, amount

---

## 📁 Project Structure

starcoin-exchange/
├── backend/ # Flask API
│ ├── app.py # Core logic
│ ├── wallets.json # User wallet balances
│ └── transactions.json # TX log
│
├── frontend/ # React + Tailwind
│ ├── public/
│ │ └── bg.jpg # Page background
│ ├── src/
│ │ ├── App.jsx # Main UI
│ │ ├── CryptoTicker.jsx # Ticker logic
│ │ ├── index.css # Global styles
│ │ └── config.js # Backend URL
│ └── vite.config.js
└── README.md


---

## ⚙️ Local Setup Instructions

### 🔹 Backend (Flask)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask
python app.py

cd frontend/frontend
npm install
npm run dev

// File: frontend/frontend/src/config.js
export const API_URL = "https://starcoin-exchange.onrender.com";

{
  "Alice": {
    "address": "0xDEADBEEF00000000000000000000000000000000",
    "balance": 100,
    "fiat_balance": 0
  }
}

🌐 Deployment
Deployed to Render.com

Static Frontend: vite build → dist served

Backend: Flask + REST endpoints

📈 Roadmap
 Real-time coin ticker (CoinGecko)

 Scrolling ticker UI with colour-coded %

 Manual buy, sell, withdraw

 Starcoin node integration (regtest / mainnet)

 Blockchain TX signing / verification

 Wallet login & balances

 KYC / AML (real users)

 Admin dashboard

 Fiat gateway (Stripe/PayPal)

 Real token listing on CEX/DEX

👤 Author
James Jackson
✉️ jamnmarg@gmail.com
🪙 STC Wallet: rstar1qxxxxxx... (available upon request)

🛡️ Disclaimer
This exchange is a proof-of-concept only. Starcoin is not yet listed or regulated. This demo does not involve real crypto unless connected to an official Starcoin node. Proceed at your own risk.
