import React, { useEffect, useState } from "react";

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [history, setHistory] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [message, setMessage] = useState("");

  const fetchWallets = async () => {
    try {
      const res = await fetch("http://localhost:5000/wallets");
      const data = await res.json();
      setWallets(data);
    } catch (err) {
      console.error("Error fetching wallets:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/transactions");
      const data = await res.json();
      setHistory(data.reverse());
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchWallets();
    fetchHistory();
    const interval = setInterval(() => {
      fetchWallets();
      fetchHistory();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTransfer = async () => {
    const res = await fetch("http://localhost:5000/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, amount: parseFloat(amount) })
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    fetchWallets();
    fetchHistory();
  };

  const handleTrade = async () => {
    const res = await fetch("http://localhost:5000/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, send_amount: parseFloat(sendAmount) })
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    fetchWallets();
    fetchHistory();
  };

  const handleWithdraw = async () => {
    const res = await fetch("http://localhost:5000/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        amount: parseFloat(withdrawAmount),
        paypal_email: paypalEmail
      })
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    fetchWallets();
    fetchHistory();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🌞 Starcoin Exchange</h1>

      <h2>Transfer</h2>
      <select onChange={(e) => setFrom(e.target.value)} defaultValue="">
        <option disabled value="">From Wallet</option>
        {wallets.map(w => <option key={w.name}>{w.name}</option>)}
      </select>
      <select onChange={(e) => setTo(e.target.value)} defaultValue="">
        <option disabled value="">To Wallet</option>
        {wallets.map(w => <option key={w.name}>{w.name}</option>)}
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Send</button>

      <h2>Trade</h2>
      <input
        type="number"
        placeholder="Send Amount"
        value={sendAmount}
        onChange={(e) => setSendAmount(e.target.value)}
      />
      <button onClick={handleTrade}>Trade STC → USD</button>

      <h2>Withdraw</h2>
      <input
        type="number"
        placeholder="Amount"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
      />
      <input
        type="email"
        placeholder="PayPal Email"
        value={paypalEmail}
        onChange={(e) => setPaypalEmail(e.target.value)}
      />
      <button onClick={handleWithdraw}>Withdraw to PayPal</button>

      <h2>Starcoin Wallets</h2>
      <ul>
        {wallets.map(w => (
          <li key={w.name}>
            <strong>{w.name}</strong>: {w.stc.toFixed(2)} STC, ${w.usd.toFixed(2)} USD
          </li>
        ))}
      </ul>

      <h2>Recent Transactions</h2>
      <ul>
        {history.map((tx, i) => (
          <li key={i}>
            [{new Date(tx.timestamp).toLocaleTimeString()}] {tx.type.toUpperCase()} – {tx.from} {tx.to ? `→ ${tx.to}` : ""}: {tx.amount} {tx.currency}
          </li>
        ))}
      </ul>

      {message && <p><strong>Status:</strong> {message}</p>}
    </div>
  );
};

export default Wallets;
