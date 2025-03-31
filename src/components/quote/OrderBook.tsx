import React, {MouseEvent, useCallback, useEffect, useRef, useState,} from "react";
import {FinnhubTrade} from "./QuoteComponent";

const formatTime = (timestamp: number): string =>
    new Date(timestamp > 1e10 ? timestamp : timestamp * 1000).toLocaleTimeString();

/**
 * Simple throttle helper.
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
 * Uses a squared ratio for non-linear scaling. For dark theme, brightness
 * ranges from 60% (low volume) to 20% (high); for light theme, from 80% to 30%.
 * Sells have hue 120 (green) and buys 0 (red). Top-10 rows get a slight boost.
 */
function getRowColorByVolume(
    tradeVolume: number,
    maxVolume: number,
    darkTheme: boolean,
    isSell: boolean,
    isTop10: boolean
): string {
    const ratio = tradeVolume / maxVolume;
    const adjustedRatio = ratio * ratio;
    const baseBrightness = darkTheme ? 60 : 80;
    const brightnessDelta = darkTheme ? 40 : 50;
    let brightness = baseBrightness - adjustedRatio * brightnessDelta;
    const hue = isSell ? 120 : 0;
    if (isTop10) {
        brightness = Math.max(brightness - 15, 0);
    }
    return `hsl(${hue}, 100%, ${brightness}%)`;
}

interface OrderBookProps {
    selectedSymbolForOrderBook: string | null;
    isDarkTheme: boolean;
    closeOrderBookPopup: () => void;
    orderBooks: { [symbol: string]: FinnhubTrade[] };
    quotes: { [symbol: string]: { quote: { c: number } } };
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
    const [sortCriteria, setSortCriteria] = useState<"price" | "volume">("price");

    // Scroll the "MID" divider into view
    const scrollToMid = useCallback(() => {
        const container = orderBookContainerRef.current;
        const midElement = midPriceRef.current;
        if (container && midElement) {
            const containerRect = container.getBoundingClientRect();
            const midRect = midElement.getBoundingClientRect();
            const offset =
                midRect.top -
                containerRect.top -
                containerRect.height / 2 +
                midRect.height / 2;
            container.scrollBy({top: offset, behavior: "smooth"});
        }
    }, []);

    const throttledScrollToMid = useCallback(throttle(scrollToMid, 500), [
        scrollToMid,
    ]);

    useEffect(() => {
        if (selectedSymbolForOrderBook) {
            throttledScrollToMid();
        }
    }, [selectedSymbolForOrderBook, sortCriteria, throttledScrollToMid]);

    // Recenter periodically (every 5 seconds)
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
    const allTrades = orderBooks[selectedSymbolForOrderBook] || [];

    // Partition trades into sells and buys based on the mid price.
    let sells = allTrades.filter((trade) => trade.p >= midPrice);
    let buys = allTrades.filter((trade) => trade.p < midPrice);

    // Sort based on user selection.
    if (sortCriteria === "price") {
        sells.sort((a, b) => a.p - b.p); // Ascending ask
        buys.sort((a, b) => b.p - a.p); // Descending bid
    } else {
        sells.sort((a, b) => b.v - a.v);
        buys.sort((a, b) => b.v - a.v);
    }

    // Keep up to 500 trades on each side.
    sells = sells.slice(0, 500);
    buys = buys.slice(0, 500);

    const maxVolume = Math.max(...[...sells, ...buys].map((t) => t.v), 1);

    return (
        <div
            onClick={closeOrderBookPopup}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            <div
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                className={`relative p-4 w-11/12 max-w-xl ${
                    isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={closeOrderBookPopup}
                    className={`absolute top-2 right-2 bg-transparent border-0 text-2xl cursor-pointer ${
                        isDarkTheme ? "text-white" : "text-gray-900"
                    }`}
                >
                    &times;
                </button>

                {/* Header and Sort Controls */}
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                        {selectedSymbolForOrderBook} Order Book
                    </h2>
                    <div className="flex items-center space-x-2 mt-6">
                        <span>Sort:</span>
                        <select
                            value={sortCriteria}
                            onChange={(e) =>
                                setSortCriteria(e.target.value as "price" | "volume")
                            }
                            className={`p-1 rounded ${
                                isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
                            }`}
                        >
                            <option value="price">Price</option>
                            <option value="volume">Volume</option>
                        </select>
                    </div>
                </div>

                {/* Order Book Content */}
                {sells.length > 0 || buys.length > 0 ? (
                    <div ref={orderBookContainerRef} className="grid gap-2 h-[35em] overflow-y-auto">
                        {/* Sell Side */}
                        {sells.map((trade, index) => {
                            const rowBg = getRowColorByVolume(
                                trade.v,
                                maxVolume,
                                isDarkTheme,
                                true,
                                index < 10
                            );
                            return (
                                <div
                                    key={`sell-${index}`}
                                    className="grid grid-cols-3 p-1 transition-all duration-300"
                                    style={{
                                        backgroundColor: rowBg,
                                        color: isDarkTheme ? "#fff" : undefined,
                                        fontWeight: index < 10 ? "bold" : "normal",
                                    }}
                                >
                                    <div>{trade.p.toFixed(4)}</div>
                                    <div>{trade.v}</div>
                                    <div>{formatTime(trade.t)}</div>
                                </div>
                            );
                        })}

                        {/* Mid Price Divider */}
                        <div
                            ref={midPriceRef}
                            className="flex items-center justify-center border-t-2 border-b-2 border-black p-2 font-bold transition-all duration-300"
                        >
                            {midPrice ? `MID ${midPrice.toFixed(4)}` : "Mid Price Unavailable"}
                        </div>

                        {/* Buy Side */}
                        {buys.map((trade, index) => {
                            const rowBg = getRowColorByVolume(
                                trade.v,
                                maxVolume,
                                isDarkTheme,
                                false,
                                index < 10
                            );
                            return (
                                <div
                                    key={`buy-${index}`}
                                    className="grid grid-cols-3 p-1 transition-all duration-300"
                                    style={{
                                        backgroundColor: rowBg,
                                        color: isDarkTheme ? "#fff" : undefined,
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
                    <p className="text-center">No trades available.</p>
                )}
            </div>
        </div>
    );
};

export default OrderBook;
