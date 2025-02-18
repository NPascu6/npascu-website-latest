import React, { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { FinnhubTrade } from "./QuoteComponent";

const formatTime = (timestamp: number): string => {
    // If timestamp > 1e10, assume it's ms; otherwise seconds
    return new Date(timestamp > 1e10 ? timestamp : timestamp * 1000).toLocaleTimeString();
};

/**
 * Simple throttle function.
 */
function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let inThrottle = false;
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    } as T;
}

/**
 * Computes a background color based on trade volume relative to max volume.
 * We use a squared ratio for non-linear scaling.
 * For dark theme: brightness from 60% (low volume) down to 20% (high).
 * For light theme: brightness from 80% down to 30%.
 * Sells: hue=120 (green), Buys: hue=0 (red).
 *
 * If `isTop10` is true, we boost the saturation or shift brightness to make it more prominent.
 */
function getRowColorByVolume(
    tradeVolume: number,
    maxVolume: number,
    darkTheme: boolean,
    isSell: boolean,
    isTop10: boolean
): string {
    // Normal ratio-based brightness
    const ratio = tradeVolume / maxVolume; // 0..1
    const adjustedRatio = ratio * ratio; // squared
    const baseBrightness = darkTheme ? 60 : 80;
    const brightnessDelta = darkTheme ? 40 : 50;
    let brightness = baseBrightness - adjustedRatio * brightnessDelta;
    const hue = isSell ? 120 : 0; // green or red

    // If it's a top-10 row, make it stand out more
    if (isTop10) {
        brightness -= 15;
        if (brightness < 0) brightness = 0; // clamp
    }

    return `hsl(${hue}, 100%, ${brightness}%)`;
}

interface OrderBookProps {
    selectedSymbolForOrderBook: string | null;
    isDarkTheme: boolean;
    closeOrderBookPopup: () => void;
    orderBooks: { [key: string]: FinnhubTrade[] };
    quotes: { [key: string]: { quote: { c: number } } };
}

const OrderBook: React.FC<OrderBookProps> = ({
    selectedSymbolForOrderBook,
    isDarkTheme,
    closeOrderBookPopup,
    orderBooks,
    quotes,
}) => {
    const orderBookContainerRef = useRef<HTMLDivElement>(null);
    const midPriceRef = useRef<HTMLDivElement>(null);

    // Sort mode: "price" or "volume"
    const [sortCriteria, setSortCriteria] = useState<"price" | "volume">("price");

    // Scroll the "MID" divider into view
    const scrollToMid = useCallback(() => {
        if (orderBookContainerRef.current && midPriceRef.current) {
            const container = orderBookContainerRef.current;
            const midEl = midPriceRef.current;
            const containerRect = container.getBoundingClientRect();
            const midRect = midEl.getBoundingClientRect();
            const offset =
                midRect.top - containerRect.top - containerRect.height / 2 + midRect.height / 2;
            container.scrollBy({ top: offset, behavior: "smooth" });
        }
    }, []);

    const throttledScrollToMid = useCallback(throttle(scrollToMid, 500), [scrollToMid]);

    useEffect(() => {
        if (selectedSymbolForOrderBook) {
            throttledScrollToMid();
        }
    }, [selectedSymbolForOrderBook, sortCriteria, throttledScrollToMid]);

    // Periodically recenter every 5s
    useEffect(() => {
        if (selectedSymbolForOrderBook) {
            const intervalId = setInterval(() => {
                throttledScrollToMid();
            }, 5000);
            return () => clearInterval(intervalId);
        }
    }, [selectedSymbolForOrderBook, sortCriteria, throttledScrollToMid]);

    if (!selectedSymbolForOrderBook) return null;

    // --- Build the Order Book data ---
    const midPrice = quotes[selectedSymbolForOrderBook]?.quote.c || 0;
    // All trades for this symbol
    const allTrades = orderBooks[selectedSymbolForOrderBook] || [];

    // Partition by price relative to mid
    let sells = allTrades.filter((t) => t.p >= midPrice);
    let buys = allTrades.filter((t) => t.p < midPrice);

    // Sort each side according to user selection:
    // If "price": sells ascending, buys descending
    // If "volume": both descending by volume
    if (sortCriteria === "price") {
        sells.sort((a, b) => a.p - b.p); // best/lowest ask at top
        buys.sort((a, b) => b.p - a.p);  // best/highest bid at top
    } else {
        // sort by volume descending
        sells.sort((a, b) => b.v - a.v);
        buys.sort((a, b) => b.v - a.v);
    }

    // Keep only 50 sells, 50 buys
    sells = sells.slice(0, 50);
    buys = buys.slice(0, 50);

    // Find max volume for color shading
    const maxVolume = Math.max(...[...sells, ...buys].map((t) => t.v), 1);

    return (
        <div
            onClick={closeOrderBookPopup}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            <div
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                className={`relative p-2 w-11/12 max-w-xl ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
            >
                {/* Close button */}
                <button
                    onClick={closeOrderBookPopup}
                    className={`absolute top-2 right-2 mr-4 bg-transparent border-0 text-2xl cursor-pointer ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                >
                    ×
                </button>

                {/* Header with sort dropdown */}
                <div className="mb-4 flex justify-between items-center">
                    <h2>{selectedSymbolForOrderBook} Order Book</h2>
                    <div className="flex items-center space-x-2">
                        <span>Sort:</span>
                        <select
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value as "price" | "volume")}
                            className={`p-1 rounded ${isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
                        >
                            <option value="price">Price</option>
                            <option value="volume">Volume</option>
                        </select>
                    </div>
                </div>

                {/* Main content */}
                {sells.length > 0 || buys.length > 0 ? (
                    <div ref={orderBookContainerRef} className="grid gap-2 h-[35em] overflow-y-auto">
                        {/* SELL side */}
                        {sells.map((trade, index) => {
                            // isTop10 if index < 10
                            const rowBg = getRowColorByVolume(
                                trade.v,
                                maxVolume,
                                isDarkTheme,
                                true, // isSell
                                index < 10 // top 10 highlight?
                            );
                            return (
                                <div
                                    key={`sell-${index}`}
                                    className="grid grid-cols-3 p-1 transition-all duration-300 ease-in-out"
                                    style={{
                                        backgroundColor: rowBg,
                                        // Use white text for dark mode for better contrast
                                        color: isDarkTheme ? "#fff" : "inherit",
                                        fontWeight: index < 10 ? "bold" : "normal",
                                    }}
                                >
                                    <div>{trade.p.toFixed(4)}</div>
                                    <div>{trade.v}</div>
                                    <div>{formatTime(trade.t)}</div>
                                </div>
                            );
                        })}

                        {/* MID divider */}
                        <div
                            ref={midPriceRef}
                            className="flex items-center justify-center border-t-2 border-b-2 border-black p-1 font-bold transition-all duration-300 ease-in-out"
                        >
                            {midPrice ? `MID ${midPrice.toFixed(4)}` : "Mid Price Unavailable"}
                        </div>

                        {/* BUY side */}
                        {buys.map((trade, index) => {
                            const rowBg = getRowColorByVolume(
                                trade.v,
                                maxVolume,
                                isDarkTheme,
                                false, // isSell = false
                                index < 10
                            );
                            return (
                                <div
                                    key={`buy-${index}`}
                                    className="grid grid-cols-3 p-1 transition-all duration-300 ease-in-out"
                                    style={{
                                        backgroundColor: rowBg,
                                        color: isDarkTheme ? "#fff" : "inherit",
                                        fontWeight: index < 10 ? "bold" : "normal",
                                    }}
                                >
                                    <div>{trade.p.toFixed(4)}</div>
                                    <div>{trade.v}</div>
                                    <div>{formatTime(trade.t)}</div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No trades available.</p>
                )}
            </div>
        </div>
    );
};

export default OrderBook;
