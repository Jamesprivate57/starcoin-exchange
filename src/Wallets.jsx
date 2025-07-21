// File: C:\CryptoProjects\starcoin-exchange\frontend\src\Wallets.jsx

import React, { useState, useEffect } from "react";
import BACKEND_URL from "./config";

const Wallets = () => {
    const [wallets, setWallets] = useState([]);
    const [sendAmount, setSendAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [usdAmount, setUsdAmount] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);

    const fetchWallets = async () => {
        const res = await fetch(`${BACKEND_URL}/wallets`);
        const data = await res.json();
        setWallets(data);
    };

    const fetchHistory = async () => {
        const res = await fetch(`${BACKEND_URL}/transactions`);
        const data = await res.json();
        setHistory(data);
    };

    const handleTrade = async () => {
        const res = await fetch(`${BACKEND_URL}/buy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from: "Bob", send_amount: parseFloat(sendAmount) })
        });
        const data = await res.json();
        setMessage(data.message || data.error);
        fetchWallets();
        fetchHistory();
    };

    const handleWithdraw = async () => {
        const res = await fetch(`${BACKEND_URL}/withdraw`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from: "Bob", amount: parseFloat(withdrawAmount), email: paypalEmail })
        });
        const data = await res.json();
        setMessage(data.message || data.error);
        fetchWallets();
        fetchHistory();
    };

    const handleSell = async () => {
        const res = await fetch(`${BACKEND_URL}/sell`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Bob",
                usd: parseFloat(usdAmount),
                address: walletAddress
            })
        });
        const data = await res.json();
        setMessage(data.message || data.error);
        setUsdAmount("");
        setWalletAddress("");
        fetchWallets();
        fetchHistory();
    };

    useEffect(() => {
        fetchWallets();
        fetchHistory();
    }, []);

    return (
        <div className="p-4 text-white">
            <h2 className="text-2xl font-bold mb-4">💱 Trade</h2>
            <input
                type="number"
                placeholder="Send Amount"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="text-black p-2 rounded mr-2"
            />
            <button onClick={handleTrade} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                Trade STC → USD
            </button>

            <h2 className="text-2xl font-bold mt-6 mb-2">💰 Sell</h2>
            <input
                type="number"
                placeholder="USD Amount"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                className="text-black p-2 rounded mr-2"
            />
            <input
                type="text"
                placeholder="STC Wallet Address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="text-black p-2 rounded mr-2"
            />
            <button onClick={handleSell} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Sell USD → STC
            </button>

            <h2 className="text-2xl font-bold mt-6 mb-2">💸 Withdraw</h2>
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
            <button onClick={handleWithdraw} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded">
                Withdraw to PayPal
            </button>

            <h2 className="text-2xl font-bold mt-6 mb-2">👛 Wallets</h2>
            <ul className="mb-6">
                {wallets.map((w) => (
                    <li key={w.name}>
                        <strong>{w.name}</strong>: {w.stc.toFixed(2)} STC, ${w.usd.toFixed(2)} USD
                    </li>
                ))}
            </ul>

            <h2 className="text-2xl font-bold mb-2">📜 Recent Transactions</h2>
            <ul className="max-h-64 overflow-y-auto border border-gray-700 p-2">
                {history.map((tx, i) => (
                    <li key={i}>
                        [{new Date(tx.timestamp).toLocaleTimeString()}] {tx.type.toUpperCase()} – {tx.from}{" "}
                        {tx.to ? `→ ${tx.to}` : ""} {tx.stc ? `${tx.stc} STC` : ""} {tx.usd ? `$${tx.usd}` : ""}
                    </li>
                ))}
            </ul>

            {message && <p className="mt-4"><strong>Status:</strong> {message}</p>}
        </div>
    );
};

export default Wallets;
