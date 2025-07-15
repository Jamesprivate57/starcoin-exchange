import { useEffect, useState } from "react";
import "./index.css";

const API = "http://localhost:5000";
const PRICE_PER_STC = 3486;

function App() {
  const [address, setAddress] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [email, setEmail] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${API}/transactions`)
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  const handleManualBuy = () => {
    if (!address || !amountUSD) return alert("Missing wallet or amount");
    fetch(`${API}/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, usd: amountUSD, email }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Transaction sent ✅");
        fetch(`${API}/transactions`)
          .then((res) => res.json())
          .then((data) => setTransactions(data));
        setAddress("");
        setEmail("");
        setAmountUSD("");
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🚀 Buy Starcoin (STC)</h1>
      <p className="mb-4">1 STC = ${PRICE_PER_STC} USD</p>

      <div className="mb-4">
        <h3 className="font-semibold">💰 Bulk Discount Pricing</h3>
        <ul className="list-disc list-inside">
          <li>1 STC → ${PRICE_PER_STC}</li>
          <li>2 STC → $6899 (Save $73)</li>
          <li>3 STC → $9999 (Save $159)</li>
        </ul>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          className="text-black p-1 w-full"
          placeholder="Your Starcoin Wallet Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="number"
          className="text-black p-1 w-full"
          placeholder="Amount in USD"
          value={amountUSD}
          onChange={(e) => setAmountUSD(e.target.value)}
        />
        <input
          type="email"
          className="text-black p-1 w-full"
          placeholder="Your Email (for receipt)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded"
          onClick={handleManualBuy}
        >
          Buy Now (Manual)
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold">💳 Buy with PayPal</h2>
        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_top"
        >
          <input type="hidden" name="cmd" value="_xclick" />
          <input type="hidden" name="business" value="jamesnmarg@live.com.au" />
          <input type="hidden" name="item_name" value="Starcoin Purchase" />
          <input type="hidden" name="amount" value={amountUSD} />
          <input type="hidden" name="currency_code" value="USD" />
          <input
            type="hidden"
            name="notify_url"
            value="https://28995eb5f0a4.ngrok-free.app/paypal/notify"
          />
          <input
            type="hidden"
            name="return"
            value="https://28995eb5f0a4.ngrok-free.app/paypal/success"
          />
          <input type="hidden" name="custom" value={address} />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif"
            border="0"
            name="submit"
            alt="PayPal - The safer, easier way to pay online!"
          />
        </form>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold">📜 Recent Transactions</h2>
        <ul className="mt-2">
          {transactions.map((tx, i) => (
            <li key={i} className="mb-2">
              {tx.stc} STC = ${tx.usd}<br />
              Wallet: {tx.wallet}<br />
              TXID: {tx.txid}<br />
              Block: {tx.block}<br />
              Time: {tx.time}<br />
              Method: {tx.via}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        ⚠️ Disclaimer: Starcoin is a digital asset. Prices are volatile and subject to change. Make sure to confirm all payments.<br />
        Starcoin is experimental. All payments are final.
      </p>
    </div>
  );
}

export default App;
