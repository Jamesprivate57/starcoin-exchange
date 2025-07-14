import { useEffect, useState } from "react";

function App() {
  const [address, setAddress] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState([]);
  const API = "http://localhost:5000";
  const PRICE_PER_STC = 3486;

  useEffect(() => {
    fetch(`${API}/transactions`)
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  const handleBuy = () => {
    const usd = parseFloat(amountUSD);
    const stcAmount = usd / PRICE_PER_STC;

    if (!address || isNaN(usd) || usd <= 0) {
      setMessage("Please enter a valid amount and address.");
      return;
    }

    if (stcAmount < 2) {
      setMessage("Minimum purchase is 2 STC.");
      return;
    }

    fetch(`${API}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: address,
        usd: usd,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setMessage(data.message);
          setAmountUSD("");
          setAddress("");

          fetch(`${API}/transactions`)
            .then((res) => res.json())
            .then((data) => setTransactions(data));
        } else {
          setMessage(data.error || "Transaction failed.");
        }
      });
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Buy Starcoin (STC) <span className="text-yellow-400 text-4xl">⭐</span>
        </h1>
        <p className="text-sm text-gray-300">
          1 STC = <span className="font-bold">${PRICE_PER_STC} USD</span> — Securely purchase and mint directly.
          <br />
          <span className="text-red-400">Minimum purchase is 2 STC (${PRICE_PER_STC * 2})</span>
        </p>

        <div className="bg-gray-800 p-4 rounded-xl space-y-4">
          <div className="space-y-2">
            <label className="block text-sm">Your Starcoin Wallet Address:</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-900 text-white rounded"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x1234abcd..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm">Amount (USD):</label>
            <input
              type="number"
              className="w-full p-2 bg-gray-900 text-white rounded"
              value={amountUSD}
              onChange={(e) => setAmountUSD(e.target.value)}
              placeholder={`${PRICE_PER_STC * 2}`}
            />
          </div>

          <button
            onClick={handleBuy}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Buy Now
          </button>

          {message && (
            <p className="text-sm text-green-400 font-mono mt-2">{message}</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-400">No transactions yet.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {transactions.map((tx, i) => (
                <li key={i} className="border-b border-gray-700 pb-1">
                  <span className="font-bold">{tx.stc} STC</span> sent to{" "}
                  <span className="text-green-300">{tx.address}</span> (${tx.usd})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
