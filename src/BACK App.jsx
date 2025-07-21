import { useEffect, useState } from "react";
import BACKEND_URL from "./config"; // Ensure this exports the backend API URL correctly

const API = BACKEND_URL || "http://localhost:5000";
const DONATION_BUTTON_ID = "F73VQ5AQ28N2G";

export default function App() {
  const [address, setAddress] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [email, setEmail] = useState("");
  const [sellUSD, setSellUSD] = useState("");
  const [sellWallet, setSellWallet] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawEmail, setWithdrawEmail] = useState("");
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [price, setPrice] = useState(3486);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    async function fetchPrice() {
      try {
        setLoadingPrice(true);
        const res = await fetch(`${API}/price/live`);
        const data = await res.json();
        if (data.litecoin?.usd) {
          setPrice((data.litecoin.usd * 3486) / 100);
        }
      } catch {
        // fail silently or add error state here if desired
      } finally {
        setLoadingPrice(false);
      }
    }
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoadingTransactions(true);
        const res = await fetch(`${API}/transactions?limit=20`);
        const data = await res.json();
        setTransactions(data);
      } catch {
        setTransactions([]);
      } finally {
        setLoadingTransactions(false);
      }
    }
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleManualBuy = async () => {
    if (!address || !amountUSD) {
      alert("Please enter wallet address and amount");
      return;
    }
    try {
      const res = await fetch(`${API}/transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, usd: amountUSD, email }),
      });
      const data = await res.json();
      if (data.status === "success") {
        alert("Purchase successful! TXID: " + data.txid);
        setAddress("");
        setAmountUSD("");
        setEmail("");
      } else {
        alert("Error: " + data.msg);
      }
    } catch {
      alert("Request failed");
    }
  };

  const handleSell = async () => {
    if (!sellWallet || !sellUSD) {
      alert("Please enter wallet address and USD amount");
      return;
    }
    try {
      const res = await fetch(`${API}/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "User", usd: parseFloat(sellUSD), address: sellWallet }),
      });
      const data = await res.json();
      setMessage(data.message || data.error || "Unknown response");
      setSellUSD("");
      setSellWallet("");
    } catch {
      setMessage("Sell request failed");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawEmail || !withdrawAmount) {
      alert("Please enter withdrawal amount and PayPal email");
      return;
    }
    try {
      const res = await fetch(`${API}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount), email: withdrawEmail }),
      });
      const data = await res.json();
      setMessage(data.message || data.error || "Unknown response");
      setWithdrawAmount("");
      setWithdrawEmail("");
    } catch {
      setMessage("Withdrawal request failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <header className="bg-gradient-to-r from-yellow-500 to-orange-500 shadow-md py-6 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-4xl font-bold text-black">Starcoin Exchange</h1>
          <p className="text-lg sm:text-xl font-semibold text-black mt-4 sm:mt-0">
            1 STC ≈ ${loadingPrice ? "..." : (price ?? 0).toFixed(2)} USD
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Bulk Pricing Info */}
        <section className="bg-yellow-100 text-black rounded-md p-6 shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Bulk Discount Pricing</h2>
          <ul className="list-disc list-inside space-y-1 text-lg">
            <li>1 STC → $3486</li>
            <li>2 STC → $6899 (Save $73)</li>
            <li>3 STC → $9999 (Save $159)</li>
          </ul>
        </section>

        {/* Manual Buy */}
        <section className="bg-gray-800 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Buy Starcoin (Manual)</h2>
          <input
            type="text"
            placeholder="Your STC Wallet Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 mb-4 rounded text-black"
          />
          <input
            type="number"
            placeholder="Amount in USD"
            value={amountUSD}
            onChange={(e) => setAmountUSD(e.target.value)}
            className="w-full p-3 mb-4 rounded text-black"
          />
          <input
            type="email"
            placeholder="Email for receipt (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded text-black"
          />
          <button
            onClick={handleManualBuy}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded w-full"
          >
            Buy Starcoin
          </button>
        </section>

        {/* PayPal Buy */}
        <section className="bg-gray-800 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Buy Starcoin (PayPal)</h2>
          <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_blank"
            className="space-y-4"
          >
            <input type="hidden" name="cmd" value="_donations" />
            <input type="hidden" name="business" value="jamnmarg@gmail.com" />
            <input type="hidden" name="item_name" value="Buy Starcoin (STC)" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="notify_url" value={`${API}/paypal/notify`} />
            <input
              type="hidden"
              name="return"
              value="https://starcoin-static.onrender.com/paypal/success"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount in USD"
              min="6972"
              className="w-full p-3 rounded text-black"
              required
            />
            <input
              type="text"
              name="custom"
              placeholder="Your STC Wallet Address"
              className="w-full p-3 rounded text-black"
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded w-full"
            >
              Pay with PayPal
            </button>
          </form>
        </section>

        {/* Sell Starcoin */}
        <section className="bg-gray-800 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Sell Starcoin</h2>
          <input
            type="number"
            placeholder="USD Amount to Sell"
            value={sellUSD}
            onChange={(e) => setSellUSD(e.target.value)}
            className="w-full p-3 mb-4 rounded text-black"
          />
          <input
            type="text"
            placeholder="Your STC Wallet Address"
            value={sellWallet}
            onChange={(e) => setSellWallet(e.target.value)}
            className="w-full p-3 mb-4 rounded text-black"
          />
          <button
            onClick={handleSell}
            className="bg-blue-600 hover:bg-blue-700 font-bold py-3 px-6 rounded w-full"
          >
            Sell STC
          </button>
        </section>

        {/* Withdraw to PayPal */}
        <section className="bg-gray-800 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Withdraw to PayPal</h2>
          <input
            type="number"
            placeholder="Amount in USD"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full p-3 mb-4 rounded text-black"
          />
          <input
            type="email"
            placeholder="Your PayPal Email"
            value={withdrawEmail}
            onChange={(e) => setWithdrawEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded text-black"
          />
          <button
            onClick={handleWithdraw}
            className="bg-yellow-600 hover:bg-yellow-700 font-bold py-3 px-6 rounded w-full"
          >
            Request Withdrawal
          </button>
        </section>

        {/* Message Box */}
        {message && (
          <div className="bg-red-700 text-white p-4 rounded mb-6">
            <strong>Status:</strong> {message}
          </div>
        )}

        {/* Recent Transactions */}
        <section className="bg-gray-800 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          {loadingTransactions ? (
            <p>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto space-y-2 text-sm">
              {transactions.map((tx, i) => (
                <li key={i} className="border-b border-gray-700 pb-2">
                  <div>
                    <span className="font-semibold">{tx.via?.toUpperCase() ?? "N/A"}</span> |{" "}
                    {tx.time ? new Date(tx.time).toLocaleString() : "Unknown time"}
                  </div>
                  <div>
                    <strong>{tx.stc?.toFixed(4) ?? "0.0000"} STC</strong> ≈ ${tx.usd?.toFixed(2) ?? "0.00"} | Wallet: {tx.wallet ?? "N/A"}
                  </div>
                  <div>TXID: {tx.txid ?? "N/A"}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="bg-gray-900 py-6 border-t border-gray-700">
        <p className="text-center text-xs text-gray-500">
          ⚠️ Starcoin is experimental. Prices may vary. All payments are final.
        </p>
      </footer>
    </div>
  );
}
