# 🌟 Starcoin Exchange

A lightweight web-based platform for users to buy **Starcoin (STC)** with a fixed USD rate. Built using **React + Tailwind CSS** on the frontend and **Flask** for the backend API.

> ✅ Live frontend: https://starcoin-static.onrender.com  
> ✅ Live backend API: https://starcoin-exchange.onrender.com

---

## 💸 Live Trade Demo

- 🔒 **1 STC = $3486 USD** (fixed price)
- 💼 Payments to PayPal: `jamesnmargie@live.com.au`
- 🪙 Starcoin is minted into the selected wallet upon mock purchase
- 🧾 Shows last 10 transactions for transparency

---

## 🔧 Project Structure

```
starcoin-exchange/
├── backend/               # Flask backend API
│   ├── app.py             # Main Flask app
│   ├── wallets.json       # Mock wallet balances
│   └── transactions.json  # Transaction history
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
└── README.md
```

---

## ⚙️ Local Setup Instructions

### 🔹 Backend (Flask)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask
python app.py
```

### 🔹 Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

> Update the API endpoint in:

`frontend/src/config.js`
```js
export const API_URL = "https://starcoin-exchange.onrender.com";
```

---

## 🏦 Default Wallets

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

- ✅ Fixed exchange rate: 1 STC = $3486 USD
- 🔄 Real-time balance updates for wallets
- 🧪 Mock minting with USD → STC
- 📜 Display of recent transactions
- 🎨 Tailwind CSS styling and dark UI
- 🖼️ Background image support (`src/assets/bg.jpg`)
- 🚀 Easy to deploy via Render.com

---

## 🚀 Deployment URLs

- 🌐 Frontend: https://starcoin-static.onrender.com
- 🛠️ Backend API: https://starcoin-exchange.onrender.com

---

## 🧭 Roadmap

- [ ] Integrate live PayPal verification
- [ ] Enable user-auth with wallet linking
- [ ] Connect real Starcoin node (JSON-RPC or CLI)
- [ ] Enable on-chain transfers + confirmations
- [ ] Add email receipts and real KYC/AML
- [ ] Deploy with domain + HTTPS certificate

---

## 👤 Author

**James Jackson**  
✉️ Email: `jamesnmargie@live.com.au`  
🪙 STC Wallet: `rstar1qxxxxxx...` *(available upon request)*

---

## 🛡️ Disclaimer

This platform is a proof-of-concept exchange. No real cryptocurrency is transferred unless specifically integrated with a Starcoin full node. Please verify all payments and regulatory compliance before production use.
