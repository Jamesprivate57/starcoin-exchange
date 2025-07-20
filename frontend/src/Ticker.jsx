// src/Ticker.jsx
import React, { useEffect, useState, useRef } from "react";

export default function Ticker({ transactions }) {
    const [tickerWidth, setTickerWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const tickerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (tickerRef.current && containerRef.current) {
            setTickerWidth(tickerRef.current.scrollWidth);
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }, [transactions]);

    const animationDuration = tickerWidth ? (tickerWidth / 100) * 10 : 20; // Adjust speed here

    return (
        <div
            ref={containerRef}
            className="w-full overflow-hidden bg-gray-900 text-white text-sm font-semibold"
            style={{ height: "30px", lineHeight: "30px", whiteSpace: "nowrap" }}
            aria-label="Recent transactions ticker"
        >
            <div
                ref={tickerRef}
                style={{
                    display: "inline-block",
                    paddingLeft: containerWidth,
                    animation: `scrollLeft ${animationDuration}s linear infinite`,
                }}
            >
                {transactions && transactions.length > 0 ? (
                    transactions.map((tx, i) => (
                        <span key={i} className="px-4">
                            {tx.via?.toUpperCase() ?? "N/A"} sold {tx.stc?.toFixed(2) ?? "0"} STC for $
                            {tx.usd?.toFixed(2) ?? "0"}
                        </span>
                    ))
                ) : (
                    <span className="px-4">No recent transactions.</span>
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
