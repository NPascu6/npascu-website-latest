import React, { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { FinnhubTrade } from "./QuoteComponent";

const formatTime = (timestamp: number): string => {
    // If timestamp > 1e10, assume it's in ms; otherwise, seconds.
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
 * Computes a background color based on trade volume relative to the maximum volume.
 * We use a squared ratio for more granular shades.
 *
 * For dark theme, brightness ranges from 60% (low volume) down to 20% (high volume).
 * For light theme, brightness ranges from 80% (low volume) down to 30% (high volume).
 * Sells use a green hue (120) and buys use a red hue (0).
 */
const getRowColorByVolume = (
    tradeVolume: number,
    maxVolume: number,
    darkTheme: boolean,
    isSell: boolean
): string => {
    const ratio = tradeVolume / maxVolume; // value between 0 and 1
    const adjustedRatio = Math.pow(ratio, 2); // non-linear scaling
    const baseBrightness = darkTheme ? 60 : 80;
    const brightnessDelta = darkTheme ? 40 : 50;
    const brightness = baseBrightness - adjustedRatio * brightnessDelta;
    const hue = isSell ? 120 : 0;
    // HSL color:
    return `hsl(${hue}, 100%, ${brightness}%)`;
};

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

    // Price-based vs volume-based sorting:
    const [sortCriteria, setSortCriteria] = useState<"price" | "volume">("price");

    // Function to scroll the mid-price divider into view.
    const scrollToMid = useCallback(() => {
        if (orderBookContainerRef.current && midPriceRef.current) {
            const container = orderBookContainerRef.current;
            const midEl = midPriceRef.current;
            const containerRect = container.getBoundingClientRect();
            const midRect = midEl.getBoundingClientRect();
            const offset =
                midRect.top -
                containerRect.top -
                containerRect.height / 2 +
                midRect.height / 2;
            container.scrollBy({ top: offset, behavior: "smooth" });
        }
    }, []);

    const throttledScrollToMid = useCallback(throttle(scrollToMid, 500), [scrollToMid]);

    useEffect(() => {
        if (selectedSymbolForOrderBook) {
            throttledScrollToMid();
        }
    }, [selectedSymbolForOrderBook, sortCriteria, throttledScrollToMid]);

    // Periodically re-center every 5s if the popup is open
    useEffect(() => {
        if (selectedSymbolForOrderBook) {
            const intervalId = setInterval(() => {
                throttledScrollToMid();
            }, 5000);
            return () => clearInterval(intervalId);
        }
    }, [selectedSymbolForOrderBook, sortCriteria, throttledScrollToMid]);

    if (!selectedSymbolForOrderBook) return null;

    const midPrice = quotes[selectedSymbolForOrderBook]?.quote.c || 0;
    // All trades for this symbol
    const allTrades = orderBooks[selectedSymbolForOrderBook] || [];

    // We want to keep the latest trades first by timestamp, so sort descending by 't'
    const sortedByTimeDesc = [...allTrades].sort((a, b) => b.t - a.t);

    // Partition into sells and buys
    const sellsAll = sortedByTimeDesc.filter((trade) => trade.p >= midPrice);
    const buysAll = sortedByTimeDesc.filter((trade) => trade.p < midPrice);

    // Keep only up to 50 of each (latest) to maintain half/half
    const latestSells = sellsAll.slice(0, 50);
    const latestBuys = buysAll.slice(0, 50);

    // Now do the final sort based on price/volume
    if (sortCriteria === "price") {
        // Sells in ascending order by price (closest to mid at the top)
        latestSells.sort((a, b) => a.p - b.p);
        // Buys in descending order by price (closest to mid at the top)
        latestBuys.sort((a, b) => b.p - a.p);
    } else {
        // Volume-based descending
        latestSells.sort((a, b) => b.v - a.v);
        latestBuys.sort((a, b) => b.v - a.v);
    }

    // Determine max volume for color scaling
    const maxVolume = Math.max(
        ...[...latestSells, ...latestBuys].map((t) => t.v),
        1
    );

    return (
        <div
            onClick={closeOrderBookPopup}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            <div
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                className={`relative p-2 w-11/12 max-w-xl ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                    }`}
            >
                <button
                    onClick={closeOrderBookPopup}
                    className={`absolute top-2 right-2 bg-transparent border-0 text-2xl cursor-pointer ${isDarkTheme ? "text-white" : "text-gray-900"
                        }`}
                >
                    ×
                </button>

                <div className="mb-4 flex justify-between items-center">
                    <h2>{selectedSymbolForOrderBook} Order Book</h2>
                    {/* Optional: UI toggler to switch sort criteria */}
                    <div className="flex items-center space-x-2">
                        <span>Sort:</span>
                        <select
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value as "price" | "volume")}
                            className={`p-1 rounded ${isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
                                }`}
                        >
                            <option value="price">Price</option>
                            <option value="volume">Volume</option>
                        </select>
                    </div>
                </div>

                {latestSells.length > 0 || latestBuys.length > 0 ? (
                    <div ref={orderBookContainerRef} className="grid gap-2 h-[35em] overflow-y-auto">
                        {/* Sells */}
                        {latestSells.map((trade, index) => {
                            const rowBg = getRowColorByVolume(trade.v, maxVolume, isDarkTheme, true);
                            return (
                                <div
                                    key={`sell-${index}`}
                                    className="grid grid-cols-3 p-1 transition-all duration-300 ease-in-out"
                                    // Force text to be dark for better contrast (especially in dark theme):
                                    style={{ backgroundColor: rowBg, color: isDarkTheme ? "#000" : "inherit" }}
                                >
                                    <div>{trade.p}</div>
                                    <div>{trade.v}</div>
                                    <div>{formatTime(trade.t)}</div>
                                </div>
                            );
                        })}

                        {/* Mid Price Divider */}
                        <div
                            ref={midPriceRef}
                            className="flex items-center justify-center border-t-2 border-b-2 border-black p-1 font-bold transition-all duration-300 ease-in-out"
                        >
                            {midPrice ? `MID ${midPrice.toFixed(2)}` : "Mid Price Unavailable"}
                        </div>

                        {/* Buys */}
                        {latestBuys.map((trade, index) => {
                            const rowBg = getRowColorByVolume(trade.v, maxVolume, isDarkTheme, false);
                            return (
                                <div
                                    key={`buy-${index}`}
                                    className="grid grid-cols-3 p-1 transition-all duration-300 ease-in-out"
                                    style={{ backgroundColor: rowBg, color: isDarkTheme ? "#000" : "inherit" }}
                                >
                                    <div>{trade.p}</div>
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
