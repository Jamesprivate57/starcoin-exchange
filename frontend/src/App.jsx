import { useEffect, useState } from "react";
import "./index.css";

const API = "http://localhost:5000";
const PRICE_PER_STC = 3486;

function App() {
  const [address, setAddress] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${API}/transactions`)
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  const handleBuy = () => {
    if (!address || !amountUSD) return;
    fetch(`${API}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: address,
        amount: parseFloat(amountUSD),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setAddress("");
        setAmountUSD("");
        fetch(`${API}/transactions`)
          .then((res) => res.json())
          .then((data) => setTransactions(data));
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        🚀 Starcoin is the future of free trade. The more you buy, the wealthier you become in digital wealth. 💰
      </h1>

      <h2 className="text-2xl font-bold mt-4">
        Buy Starcoin (STC) <span>⭐</span>
      </h2>

      <p className="mt-2">1 STC = $3486 USD</p>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Your Starcoin Wallet Address"
          className="text-black p-1 mr-2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount (USD)"
          className="text-black p-1 mr-2"
          value={amountUSD}
          onChange={(e) => setAmountUSD(e.target.value)}
        />
        <button onClick={handleBuy} className="bg-yellow-400 text-black px-3 py-1 rounded">
          Buy Now
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg">💰 Bulk Discount Pricing</h3>
        <ul className="list-disc list-inside mt-2">
          <li>1 STC → $3486</li>
          <li>2 STC → $6899 (Save $73)</li>
          <li>3 STC → $9999 (Save $159)</li>
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg">Recent Transactions</h3>
        <ul className="mt-2">
          {transactions.map((tx, idx) => (
            <li key={idx}>
              {tx.amountSTC} STC → ${tx.amountUSD} <br />
              Wallet: {tx.wallet} <br />
              Block: {tx.block} – {tx.timestamp}
              <br /><br />
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-sm">
        ⚠️ <b>Disclaimer:</b> Starcoin is a digital asset. Prices are volatile and subject to change. This is not financial advice. Trade responsibly.
      </p>
    </div>
  );
}

export default App;
