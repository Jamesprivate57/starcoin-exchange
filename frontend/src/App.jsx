// src/App.jsx
import React, { useEffect, useState } from "react";
import {
    FaPaypal,
    FaDonate,
    FaWallet,
    FaExchangeAlt,
    FaMoneyBillWave,
} from "react-icons/fa";

import Ticker from "./Ticker";           // Recent transactions ticker
import CryptoTicker from "./CryptoTicker"; // Live crypto price ticker
import BACKEND_URL from "./config";

const API = BACKEND_URL || "http://localhost:5000";
const DONATION_BUTTON_ID = "F73VQ5AQ28N2G";

const SELL_PRICE = 2499;
const BUY_BACK_RATE = 0.9;
const BUY_BACK_PRICE = +(SELL_PRICE * BUY_BACK_RATE).toFixed(2);

const bulkDiscounts = [
    { amount: 1, price: SELL_PRICE * 1 },
    { amount: 2, price: SELL_PRICE * 2 * 0.98 },
    { amount: 3, price: SELL_PRICE * 3 * 0.95 },
];

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
    const [price, setPrice] = useState(SELL_PRICE);
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    useEffect(() => {
        async function fetchPrice() {
            try {
                setLoadingPrice(true);
                const res = await fetch(`${API}/price/live`);
                const data = await res.json();
                if (data.litecoin?.usd) {
                    setPrice(SELL_PRICE);
                }
            } catch {
                // ignore errors
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
                body: JSON.stringify({
                    wallet: sellWallet,
                    amount: parseFloat(sellUSD) / BUY_BACK_PRICE,
                    paypal_email: withdrawEmail,
                }),
            });
            const data = await res.json();
            setMessage(data.msg || data.error || "Unknown response");
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
        <div
            className="min-h-screen text-white flex flex-col"
            style={{
                backgroundImage: "url('/starcoin-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            {/* Crypto Prices Ticker at top */}
            <CryptoTicker />

            {/* Recent Transactions Ticker below */}
            <Ticker transactions={transactions} />

            <div className="bg-black bg-opacity-80 flex-grow p-6 max-w-7xl mx-auto relative z-10">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold text-yellow-400 flex items-center gap-3">
                        <FaMoneyBillWave size={36} />
                        Starcoin Exchange
                    </h1>
                    <p className="text-lg sm:text-xl font-semibold mt-4 sm:mt-0">
                        1 STC ≈ ${loadingPrice ? "..." : price.toFixed(2)} USD
                    </p>
                    <p className="text-lg sm:text-xl font-semibold mt-4 sm:mt-0 text-green-400">
                        Buy-Back Price: ${BUY_BACK_PRICE.toFixed(2)} USD (90% of Sell Price)
                    </p>
                </header>

                {/* Professional Intro */}
                <section className="mb-10 max-w-3xl">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Starcoin Exchange</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Starcoin (STC) is a cutting-edge digital currency built for rapid and secure value exchange worldwide.
                        Invest today to join a forward-thinking community and take advantage of exclusive early bulk discounts.
                    </p>
                </section>

                {/* Bulk Pricing Info */}
                <section className="bg-yellow-100 text-black rounded-md p-6 shadow-md mb-10 max-w-md">
                    <h2 className="text-xl font-semibold mb-4">💰 Bulk Discount Pricing</h2>
                    <ul className="list-disc list-inside space-y-1 text-lg">
                        {bulkDiscounts.map(({ amount, price }) => (
                            <li key={amount}>
                                {amount} STC → ${price.toFixed(2)}{" "}
                                {amount > 1 ? `(${((1 - price / (SELL_PRICE * amount)) * 100).toFixed(0)}% off)` : ""}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Manual Buy */}
                <section className="bg-gray-900 p-6 rounded-md shadow-md max-w-md mb-10">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <FaWallet /> Buy Starcoin (Manual)
                    </h2>
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
                <section className="bg-gray-900 p-6 rounded-md shadow-md max-w-md mb-10">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <FaPaypal /> Buy Starcoin (PayPal)
                    </h2>
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
                            min={SELL_PRICE}
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

                {/* Donate Button */}
                <section className="text-center mb-10 max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
                        <FaDonate /> Donate Without Buying
                    </h2>
                    <form
                        action="https://www.paypal.com/donate"
                        method="post"
                        target="_blank"
                        className="inline-block"
                    >
                        <input type="hidden" name="hosted_button_id" value={DONATION_BUTTON_ID} />
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded">
                            Donate
                        </button>
                    </form>
                </section>

                {/* Sell Starcoin */}
                <section className="bg-gray-900 p-6 rounded-md shadow-md max-w-md mb-10">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <FaExchangeAlt /> Sell Starcoin
                    </h2>
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
                <section className="bg-gray-900 p-6 rounded-md shadow-md max-w-md mb-10">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <FaMoneyBillWave /> Withdraw to PayPal
                    </h2>
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
                    <div className="bg-red-700 text-white p-4 rounded mb-6 max-w-md">
                        <strong>Status:</strong> {message}
                    </div>
                )}

                {/* Recent Transactions */}
                <section className="bg-gray-900 p-6 rounded-md shadow-md max-w-3xl mx-auto mb-10">
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
                                        <strong>{tx.stc?.toFixed(4) ?? "0.0000"} STC</strong> ≈ $
                                        {tx.usd?.toFixed(2) ?? "0.00"} | Wallet: {tx.wallet ?? "N/A"}
                                    </div>
                                    <div>TXID: {tx.txid ?? "N/A"}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
