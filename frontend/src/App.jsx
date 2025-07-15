import './index.css';
import { useState, useEffect } from 'react';

const API = "https://starcoin-exchange.onrender.com";
const PRICE_PER_STC = 3486;

export default function App() {
  const [address, setAddress] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API}/transactions`)
      .then((res) => res.json())
      .then((data) => setTransactions(data.reverse().slice(0, 10)));
  }, []);

  const handleBuy = async () => {
    if (!address || !amountUSD) {
      setMessage("⚠️ Please enter wallet address and amount.");
      return;
    }

    const res = await fetch(`${API}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, amountUSD }),
    });

    const data = await res.json();
    setMessage(data.message);
    setAddress("");
    setAmountUSD("");

    const txRes = await fetch(`${API}/transactions`);
    const txData = await txRes.json();
    setTransactions(txData.reverse().slice(0, 10));
  };

  return (
    <div className="min-h-screen text-black bg-white px-6 py-10 font-sans">
      <h1 className="text-3xl font-bold mb-4">🚀 Starcoin is the future of free trade. The more you buy, the wealthier you become in digital wealth. 💰</h1>

      <h2 className="text-2xl font-bold mb-2">Buy Starcoin (STC) ⭐</h2>
      <p className="mb-1">1 STC = ${PRICE_PER_STC} USD</p>
      <p className="mb-3">Minimum purchase is 2 STC (${2 * PRICE_PER_STC})</p>

      <div className="mb-6 space-y-1">
        <input
          type="text"
          placeholder="Your Starcoin Wallet Address: rstar1q..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder={`Min $${2 * PRICE_PER_STC}`}
          value={amountUSD}
          onChange={(e) => setAmountUSD(e.target.value)}
          className="border p-2 w-full"
        />
        <button onClick={handleBuy} className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 mt-2 rounded">
          Buy Now
        </button>
        <p className="mt-2 text-red-500">{message}</p>
      </div>

      <h3 className="text-xl font-bold mt-6 mb-2">💰 Bulk Discount Pricing</h3>
      <ul className="list-disc pl-5 text-sm mb-6">
        <li>1 STC → ${PRICE_PER_STC}</li>
        <li>2 STC → ${PRICE_PER_STC * 2 - 73} <span className="text-green-600">(Save $73)</span></li>
        <li>3 STC → $9999 <span className="text-green-600">(Save $159)</span></li>
      </ul>

      <h3 className="text-xl font-bold mb-2">Recent Transactions</h3>
      <ul className="space-y-1 text-sm">
        {transactions.map((tx, i) => (
          <li key={i} className="border-b py-1">
            • {tx.stc_amount} STC → ${tx.usd_amount}<br />
            Wallet: {tx.address.slice(0, 10)}...{tx.address.slice(-4)}<br />
            Block: {tx.block} – {tx.timestamp}
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-600 mt-4">
        ⚠️ Disclaimer: Starcoin is a digital asset. Prices are volatile and subject to change. This is not financial advice. Trade responsibly.
      </p>
    </div>
  );
}
