import { useState, useEffect } from "react";
import CryptoTicker from "./CryptoTicker";
import "./index.css";

const BACKEND_URL = "http://localhost:5000";

function App() {
    const [address, setAddress] = useState("");
    const [amountUSD, setAmountUSD] = useState("");
    const [email, setEmail] = useState("");
    const [sellUSD, setSellUSD] = useState("");
    const [sellWallet, setSellWallet] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawEmail, setWithdrawEmail] = useState("");
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/transactions`)
            .then(res => res.json())
            .then(setTransactions)
            .catch(console.error);
    }, []);

    const handleManualBuy = async () => {
        await fetch(`${BACKEND_URL}/buy/manual`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amountUSD, address, email })
        });
        alert("Manual buy request sent!");
    };

    const handleSell = async () => {
        await fetch(`${BACKEND_URL}/sell`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usd: sellUSD, wallet: sellWallet })
        });
        alert("Sell request sent!");
    };

    const handleWithdraw = async () => {
        await fetch(`${BACKEND_URL}/withdraw`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: withdrawAmount, email: withdrawEmail })
        });
        alert("Withdrawal requested!");
    };

    return (
        <>
            <CryptoTicker />
            <div className="container">
                <h1>🌟 Starcoin Exchange</h1>
                <p>1 STC = $2499.00 USD</p>
                <p>Buy-Back Price: $2249.10 USD (90% of Sell Price)</p>

                <h2>Welcome to Starcoin Exchange</h2>
                <p>
                    Starcoin (STC) is a cutting-edge digital currency built for rapid and secure
                    value exchange worldwide. Invest today to join a forward-thinking community
                    and take advantage of exclusive early bulk discounts.
                </p>

                <h3>📦 Bulk Discount Pricing</h3>
                <ul>
                    <li>1 STC → $2499.00</li>
                    <li>2 STC → $4898.04 (2% off)</li>
                    <li>3 STC → $7272.09 (3% off)</li>
                    <li>4 STC → $9596.16 (4% off)</li>
                    <li>5 STC → $11870.25 (5% off)</li>
                </ul>

                {/* Manual Buy */}
                <h3>🛒 Buy Starcoin (Manual)</h3>
                <input placeholder="Your STC Wallet Address" value={address} onChange={e => setAddress(e.target.value)} />
                <input placeholder="Amount in USD" value={amountUSD} onChange={e => setAmountUSD(e.target.value)} />
                <input placeholder="Email for receipt (optional)" value={email} onChange={e => setEmail(e.target.value)} />
                <button onClick={handleManualBuy}>Buy Starcoin</button>

                {/* PayPal Buy */}
                <h3>💳 Buy Starcoin (PayPal)</h3>
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                    <input type="hidden" name="cmd" value="_xclick" />
                    <input type="hidden" name="business" value="jamnmarg@gmail.com" />
                    <input type="hidden" name="item_name" value="Starcoin Purchase" />
                    <input type="hidden" name="currency_code" value="USD" />
                    <input type="hidden" name="notify_url" value="https://28995eb5f0a4.ngrok-free.app/paypal/notify" />
                    <input type="hidden" name="return" value="https://28995eb5f0a4.ngrok-free.app/paypal/success" />
                    <input type="text" name="amount" placeholder="Amount in USD" />
                    <input type="text" name="custom" placeholder="Your STC Wallet Address" />
                    <button type="submit">Pay with PayPal</button>
                </form>

                {/* Donate */}
                <h3>❤️ Donate Without Buying</h3>
                <form action="https://www.paypal.com/donate" method="post" target="_blank">
                    <input type="hidden" name="hosted_button_id" value="F73VQ5AQ28N2G" />
                    <button type="submit">Donate</button>
                </form>

                {/* Sell */}
                <h3>💱 Sell Starcoin</h3>
                <input placeholder="USD Amount to Sell" value={sellUSD} onChange={e => setSellUSD(e.target.value)} />
                <input placeholder="Your STC Wallet Address" value={sellWallet} onChange={e => setSellWallet(e.target.value)} />
                <button onClick={handleSell}>Sell STC</button>

                {/* Withdraw */}
                <h3>🏦 Withdraw to PayPal</h3>
                <input placeholder="Amount in USD" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                <input placeholder="Your PayPal Email" value={withdrawEmail} onChange={e => setWithdrawEmail(e.target.value)} />
                <button onClick={handleWithdraw}>Request Withdrawal</button>

                {/* Recent Transactions */}
                <h3>🧾 Recent Transactions</h3>
                <div className="transaction-list">
                    {transactions.map((tx, i) => (
                        <div key={i} className="mb-2">
                            <strong>{tx.method}</strong> | {tx.time} <br />
                            {tx.amount} STC → {tx.wallet} <br />
                            TXID: {tx.txid}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default App;