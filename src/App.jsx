function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/transactions`)
      .then((res) => res.json())
      .then(setTransactions)
      .catch(console.error);
  }, []);

  const handleBuy = () => {
    const address = document.getElementById("address").value;
    const amount = parseFloat(document.getElementById("amount").value);
    if (!address || isNaN(amount)) return alert("Please enter valid address and amount");
    fetch(`${import.meta.env.VITE_API_URL}/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setTransactions((prev) => [data, ...prev]);
      })
      .catch(console.error);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white p-10"
      style={{ backgroundImage: `url(/bg.jpg)` }} // ✅ public path
    >
      <div className="bg-black bg-opacity-60 max-w-xl mx-auto p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-300 mb-4">Buy Starcoin (STC)</h1>
        <p className="mb-4 text-sm">1 STC = $4.99 USD — Securely purchase and mint directly to your wallet.</p>
        <div className="flex gap-2 mb-6">
          <input
            id="address"
            placeholder="Your Starcoin Wallet Address"
            className="flex-1 px-3 py-2 rounded text-black"
          />
          <input
            id="amount"
            type="number"
            placeholder="Amount (STC)"
            className="w-32 px-3 py-2 rounded text-black"
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
                [{tx.timestamp}] Minted {tx.stc} STC for{" "}
                <span className="text-green-300">{tx.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
