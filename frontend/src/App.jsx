// File: C:\CryptoProjects\starcoin-exchange\frontend\src\App.jsx

import { useEffect, useState } from "react";
import "./index.css";

const API = "http://localhost:5000";
const PRICE_PER_STC = 3486;
const DONATION_BUTTON_ID = "F73VQ5AQ28N2G";
const PAYPAL_URL = "https://www.paypal.com/cgi-bin/webscr";
const PAYPAL_BUSINESS = "jamnmarg@gmail.com";
const PAYPAL_NOTIFY_URL = "https://28995eb5f0a4.ngrok-free.app/paypal/notify";
const PAYPAL_RETURN_URL = "https://28995eb5f0a4.ngrok-free.app/paypal/success";

function App() {
    const [address, setAddress] = useState("");
    const [amountUSD, setAmountUSD] = useState("");
    const [email, setEmail] = useState("");
    const [sellUSD, setSellUSD] = useState("");
    const [sellWallet, setSellWallet] = useState("");
    const [message, setMessage] = useState("");
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch(`${API}/transactions`)
            .then(res => res.json())
            .then(data => setTransactions(data));
    }, []);

    const handleManualBuy = () => {
        if (!address || !amountUSD) return alert("Missing wallet or amount");
        fetch(`${API}/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, usd: amountUSD, email }),
        })
            .then(res => res.json())
            .then(() => fetch(`${API}/transactions`))
            .then(res => res.json())
            .then(data => {
                alert("Transaction sent ✅");
                setTransactions(data);
                setAddress(""); setAmountUSD(""); setEmail("");
            });
    };

    const handleSell = () => {
        if (!sellWallet || !sellUSD) return alert("Missing wallet or amount");
        fetch(`${API}/sell`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Bob", usd: parseFloat(sellUSD), address: sellWallet }),
        })
            .then(res => res.json())
            .then(data => {
                setMessage(data.message || data.error);
                return fetch(`${API}/transactions`);
            })
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setSellUSD(""); setSellWallet("");
            });
    };

    return (
        <div className="flex justify-center min-h-screen p-6">
            <div className="w-full max-w-4xl bg-black bg-opacity-70 p-8 rounded-2xl text-white space-y-12">

                {/* Header */}
                <header className="text-center space-y-2">
                    <h1 className="text-4xl font-bold">🚀 Buy Starcoin (STC)</h1>
                    <p className="text-lg">1 STC = ${PRICE_PER_STC} USD</p>
                </header>

                {/* Bulk Pricing */}
                <section className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">💰 Bulk Discount Pricing</h2>
                    <ul className="list-disc list-inside inline-block text-left">
                        <li>1 STC → ${PRICE_PER_STC}</li>
                        <li>2 STC → $6899 (Save $73)</li>
                        <li>3 STC → $9999 (Save $159)</li>
                    </ul>
                </section>

                {/* Bank Transfer */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">🏦 Pay with Bank Transfer</h2>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
                        <input type="text" className="text-black p-2 w-64" placeholder="Your Wallet Address" value={address} onChange={e => setAddress(e.target.value)} />
                        <input type="number" className="text-black p-2 w-32" placeholder="USD Amount" value={amountUSD} onChange={e => setAmountUSD(e.target.value)} />
                        <input type="email" className="text-black p-2 w-64" placeholder="Email (receipt)" value={email} onChange={e => setEmail(e.target.value)} />
                        <button onClick={handleManualBuy} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded font-semibold">Transfer Now</button>
                    </div>
                </section>

                {/* PayPal + Card */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">💳 Pay with PayPal or Card</h2>
                    <div className="flex justify-center gap-8">
                        <form action={PAYPAL_URL} method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_xclick" />
                            <input type="hidden" name="business" value={PAYPAL_BUSINESS} />
                            <input type="hidden" name="item_name" value="Starcoin Purchase" />
                            <input type="hidden" name="amount" value={amountUSD} />
                            <input type="hidden" name="currency_code" value="USD" />
                            <input type="hidden" name="custom" value={address} />
                            <input type="hidden" name="notify_url" value={PAYPAL_NOTIFY_URL} />
                            <input type="hidden" name="return" value={PAYPAL_RETURN_URL} />
                            <button type="submit">
                                <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="Pay with PayPal" className="h-12" />
                            </button>
                        </form>

                        <form action={PAYPAL_URL} method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_xclick" />
                            <input type="hidden" name="business" value={PAYPAL_BUSINESS} />
                            <input type="hidden" name="item_name" value="Starcoin Purchase" />
                            <input type="hidden" name="amount" value={amountUSD} />
                            <input type="hidden" name="currency_code" value="USD" />
                            <input type="hidden" name="custom" value={address} />
                            <input type="hidden" name="notify_url" value={PAYPAL_NOTIFY_URL} />
                            <input type="hidden" name="return" value={PAYPAL_RETURN_URL} />
                            <input type="hidden" name="landing_page" value="billing" />
                            <button type="submit">
                                <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/AM_mc_vs_dc_ae.jpg" alt="Pay with Card" className="h-12" />
                            </button>
                        </form>
                    </div>
                </section>

                {/* Donate */}
                <section className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold">🙏 Donate Without Buying</h2>
                    <form action="https://www.paypal.com/donate" method="post" target="_blank">
                        <input type="hidden" name="hosted_button_id" value={DONATION_BUTTON_ID} />
                        <button className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded font-semibold">Donate</button>
                    </form>
                </section>

                {/* Sell USD → STC */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">💵 Sell USD → STC</h2>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
                        <input type="number" className="text-black p-2 w-32" placeholder="USD Amount" value={sellUSD} onChange={e => setSellUSD(e.target.value)} />
                        <input type="text" className="text-black p-2 w-64" placeholder="Your STC Wallet" value={sellWallet} onChange={e => setSellWallet(e.target.value)} />
                        <button onClick={handleSell} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold">Sell Now</button>
                    </div>
                    {message && <p className="text-green-400 text-center">{message}</p>}
                </section>

                {/* Transactions */}
                <section className="space-y-2">
                    <h2 className="text-2xl font-semibold text-center">📜 Recent Transactions</h2>
                    <ul className="mx-auto max-w-2xl space-y-4 text-left">
                        {transactions.map((tx, i) => (
                            <li key={i}>
                                <strong>{tx.stc} STC = ${tx.usd}</strong><br />
                                Wallet: {tx.wallet}<br />
                                TXID: {tx.txid}<br />
                                Block: {tx.block}<br />
                                Time: {tx.time}<br />
                                Method: {tx.via}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Disclaimer */}
                <footer className="text-center text-sm text-gray-400">
                    ⚠️ Starcoin is a digital asset. Prices are volatile and subject to change. Confirm all payments.<br />
                    Starcoin is experimental. All payments are final.
                </footer>
            </div>
        </div>
    );
}

export default App;
