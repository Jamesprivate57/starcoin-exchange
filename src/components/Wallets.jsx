// ~/starcoin-exchange/frontend/src/components/Wallets.jsx

import React, { useEffect, useState } from "react";
import BACKEND_URL from "../config";

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [history, setHistory] = useState([]);
  const [sendAmount, setSendAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [message, setMessage] = useState("");

  const fetchWallets = async () => {
    const res = await fetch(`${BACKEND_URL}/wallets`);
    const data = await res.json();
    setWallets(Object.entries(data));
  };

  const fetchTransactions = async () => {
    const res = await fetch(`${BACKEND_URL}/transactions`);
    const data = await res.json();
    setHistory(data.reverse());
  };

  useEffect(() => {
    fetchWallets();
    fetchTransactions();
  }, []);

  const handleWithdraw = async () => {
    const res = await fetch(`${BACKEND_URL}/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Alice",
        amount: Number(withdrawAmount),
        email: paypalEmail
      })
    });
    const result = await res.json();
    setMessage(result.message);
    fetchWallets();
    fetchTransactions();
  };

  const handleTrade = async () => {
    const res = await fetch(`${BACKEND_URL}/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Alice",
        send_amount: Number(sendAmount)
      })
    });
    const result = await res.json();
    setMessage(result.message);
    fetchWallets();
    fetchTransactions();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Trade</h2>
      <input
        type="number"
        placeholder="Send Amount"
        value={sendAmount}
        onChange={(e) => setSendAmount(e.target.value)}
        className="text-black p-2 rounded mr-2"
      />
      <button onClick={handleTrade} className="bg-blue-600 px-4 py-2 rounded">Trade STC → USD</button>

      <h2 className="text-xl font-semibold mt-4 mb-2">Withdraw</h2>
      <input
        type="number"
        placeholder="Amount"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
        className="text-black p-2 rounded mr-2"
      />
      <input
        type="email"
        placeholder="PayPal Email"
        value={paypalEmail}
        onChange={(e) => setPaypalEmail(e.target.value)}
        className="text-black p-2 rounded mr-2"
      />
      <button onClick={handleWithdraw} className="bg-yellow-600 px-4 py-2 rounded">Withdraw to PayPal</button>

      <h2 className="text-xl font-semibold mt-4 mb-2">💼 Starcoin Wallets</h2>
      <ul>
        {wallets.map(([name, { stc, usd }]) => (
          <li key={name}>
            <strong>{name}</strong>: {stc.toFixed(2)} STC, ${usd.toFixed(2)} USD
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">📜 Recent Transactions</h2>
      <ul>
        {history.map((tx, i) => (
          <li key={i}>
            [{new Date(tx.timestamp).toLocaleTimeString()}] {tx.type.toUpperCase()} – {tx.name} {tx.usd ? `→ $${tx.usd}` : ""}
          </li>
        ))}
      </ul>

      {message && <p className="mt-4 font-bold">{message}</p>}
    </div>
  );
};

export default Wallets;
