// src/CryptoTicker.jsx
import React, { useEffect, useState, useRef } from "react";

export default function CryptoTicker() {
    const [prices, setPrices] = useState([]);
    const tickerRef = useRef(null);
    const containerRef = useRef(null);
    const [tickerWidth, setTickerWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        async function fetchPrices() {
            try {
                const res = await fetch(
                    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin,ripple&vs_currencies=usd&include_24hr_change=true"
                );
                const data = await res.json();
                const formatted = [
                    { symbol: "BTC", price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
                    { symbol: "ETH", price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
                    { symbol: "SOL", price: data.solana.usd, change: data.solana.usd_24h_change },
                    { symbol: "DOGE", price: data.dogecoin.usd, change: data.dogecoin.usd_24h_change },
                    { symbol: "XRP", price: data.ripple.usd, change: data.ripple.usd_24h_change },
                ];
                setPrices(formatted);
            } catch {
                setPrices([]);
            }
        }
        fetchPrices();
        const interval = setInterval(fetchPrices, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (tickerRef.current && containerRef.current) {
            setTickerWidth(tickerRef.current.scrollWidth);
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }, [prices]);

    const animationDuration = tickerWidth ? (tickerWidth / 100) * 12 : 20; // tweak speed here

    return (
        <div
            ref={containerRef}
            className="w-full overflow-hidden bg-black text-white text-sm font-semibold select-none"
            style={{ height: "30px", lineHeight: "30px", whiteSpace: "nowrap" }}
            aria-label="Live cryptocurrency prices ticker"
        >
            <div
                ref={tickerRef}
                style={{
                    display: "inline-block",
                    paddingLeft: containerWidth,
                    animation: `scrollLeft ${animationDuration}s linear infinite`,
                }}
            >
                {prices.length === 0 ? (
                    <span className="px-4">Loading prices...</span>
                ) : (
                    prices.map(({ symbol, price, change }) => (
                        <span
                            key={symbol}
                            className="px-6"
                            style={{ color: change >= 0 ? "lightgreen" : "tomato" }}
                        >
                            {symbol} ${price.toFixed(2)} {change >= 0 ? "▲" : "▼"} {change.toFixed(2)}%
                        </span>
                    ))
                )}
            </div>

            <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${tickerWidth + containerWidth}px); }
        }
      `}</style>
        </div>
    );
}
