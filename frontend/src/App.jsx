import './index.css'
import { useEffect, useState } from "react"

function App() {
  const [address, setAddress] = useState("")
  const [amountUSD, setAmountUSD] = useState("")
  const [message, setMessage] = useState("")
  const [transactions, setTransactions] = useState([])
  const API = "http://localhost:5000"
  const PRICE_PER_STC = 3486

  useEffect(() => {
    fetch(`${API}/transactions`)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => {
        console.error("Failed to load transactions:", err)
        setTransactions([]) // fallback to empty
      })
  }, [])

  const handleBuy = () => {
    const usd = parseFloat(amountUSD)

    if (!address || isNaN(usd) || usd <= 0) {
      setMessage("❌ Please enter a valid amount and address.")
      return
    }

    const stcAmount = usd / PRICE_PER_STC
    if (stcAmount < 2) {
      setMessage("❌ Minimum purchase is 2 STC.")
      return
    }

    fetch(`${API}/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, usd })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setMessage(data.message)
          setAmountUSD("")
          setAddress("")
          fetch(`${API}/transactions`)
            .then(res => res.json())
            .then(data => setTransactions(data))
        } else {
          setMessage("❌ " + (data.error || "Transaction failed"))
        }
      })
      .catch(err => {
        setMessage("❌ API error")
        console.error("Buy failed:", err)
      })
  }

  // Demo fallback for display if no real transactions
  const displayTx = transactions.length > 0 ? transactions : [
    {
      stc: 5,
      usd: 25,
      address: "rstar1qa9v...k3shv",
      block: "1892",
      timestamp: "just now"
    }
  ]

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto space-y-6">
      {/* Exciting intro message */}
      <p className="text-pink-300 font-semibold">
        🚀 Starcoin is the future of free trade. The more you buy, the wealthier you become in digital wealth. 💰
      </p>

      {/* Header */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        Buy Starcoin (STC) <span className="text-yellow-400 text-4xl">⭐</span>
      </h1>

      {/* Price info */}
      <p className="text-sm text-gray-300">
        1 STC = <span className="font-bold">${PRICE_PER_STC} USD</span> <br />
        <span className="text-red-400">
          Minimum purchase is 2 STC (${PRICE_PER_STC * 2})
        </span>
      </p>

      {/* Purchase form */}
      <div className="bg-black bg-opacity-70 p-4 rounded-xl space-y-4">
        <div className="space-y-2">
          <label className="block text-sm">Your Starcoin Wallet Address:</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-900 text-white rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="rstar1q..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Amount (USD):</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-900 text-white rounded"
            value={amountUSD}
            onChange={(e) => setAmountUSD(e.target.value)}
            placeholder={`Min $${PRICE_PER_STC * 2}`}
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

      {/* Transaction history */}
      <div className="bg-black bg-opacity-70 p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
        {displayTx.length === 0 ? (
          <p className="text-sm text-gray-300">No transactions yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {displayTx.map((tx, i) => {
              const stc = tx.stc || tx.amount_stc || 0
              const usd = tx.usd || tx.amount_usd || 0
              const addr = tx.address || "unknown"
              const block = tx.block || "N/A"
              const time = tx.timestamp || "just now"

              return (
                <li key={i} className="text-sm mb-2">
                  <span className="font-bold">{stc} STC</span> →
                  <span className="text-green-300"> ${usd}</span><br />
                  <span className="text-gray-300">Wallet:</span> {addr}<br />
                  <span className="text-yellow-300">Block:</span> {block} ·{" "}
                  <span className="text-gray-400">{time}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-sm text-yellow-400 mt-6">
        ⚠️ Disclaimer: Starcoin is a digital asset. Prices are volatile and subject to change.
        This is not financial advice. Trade responsibly.
      </p>
    </div>
  )
}

export default App
