import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await axios.get("http://localhost:10000/transactions");
    setTransactions(res.data);
  };

  const handleBuy = async () => {
    if (!wallet || !amount) return alert("Enter wallet address and amount");
    try {
      await axios.post("http://localhost:10000/mint", {
        name: wallet,
        stc: parseFloat(amount),
      });
      setAmount("");
      fetchTransactions();
    } catch (err) {
      alert("Transaction failed");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono px-4 py-10">
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-yellow-400">Buy Starcoin (STC)</h1>
        <p className="text-sm text-gray-300">
          1 STC = <span className="font-semibold">$4.99 USD</span> — Securely purchase and mint directly.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Your Starcoin Wallet Address"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded"
          />
          <input
            type="number"
            placeholder="Amount (STC)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-32 px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded"
          />
          <button
            onClick={handleBuy}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded"
          >
            Buy Now
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-400">Recent Transactions</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-200">
            {transactions.length === 0 && <li>No transactions yet.</li>}
            {transactions.map((tx, idx) => (
              <li key={idx}>
                [{tx.timestamp}] Minted {tx.stc} STC for <span className="text-green-300">{tx.name}</span> (${tx.usd})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
