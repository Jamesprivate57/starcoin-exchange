import { useEffect, useState } from "react";

const COINS = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
    { id: "ethereum", symbol: "ETH", name: "Ethereum" },
    { id: "solana", symbol: "SOL", name: "Solana" },
    { id: "pepe", symbol: "PEPE", name: "Pepe" },
    { id: "shiba-inu", symbol: "SHIB", name: "Shiba Inu" },
    { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
    { id: "ripple", symbol: "XRP", name: "XRP" },
    { id: "ethereum-gas", symbol: "ETH Gas", name: "ETH Gas" },
    { id: "starcoin", symbol: "STAR", name: "Starcoin" },
];

function CryptoTicker() {
    const [prices, setPrices] = useState({});

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const ids = COINS.filter(
                    (c) => c.id !== "ethereum-gas" && c.id !== "starcoin"
                )
                    .map((c) => c.id)
                    .join(",");

                const res = await fetch(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
                );
                const data = await res.json();

                data["ethereum-gas"] = { usd: 1.44, usd_24h_change: 0 };
                data["starcoin"] = { usd: 2499, usd_24h_change: 0 };

                setPrices(data);
            } catch (err) {
                console.error("Failed to fetch prices:", err);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="ticker-bar text-sm text-white">
            <div className="ticker-track">
                {[...Array(2)].flatMap((_, repeatIndex) =>
                    COINS.map(({ symbol, id }, i) => {
                        const coin = prices[id];
                        if (!coin) return null;

                        const price = parseFloat(coin.usd).toFixed(4);
                        const change = parseFloat(coin.usd_24h_change).toFixed(2);
                        const isUp = parseFloat(change) >= 0;

                        return (
                            <span key={`${symbol}-${repeatIndex}-${i}`} className="inline-block mr-8">
                                <span className="text-white">{symbol}</span>{" "}
                                <span className="text-gray-300">${price}</span>{" "}
                                <span className={isUp ? "text-green-400" : "text-red-400"}>
                                    ({change}%)
                                </span>
                            </span>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default CryptoTicker;
