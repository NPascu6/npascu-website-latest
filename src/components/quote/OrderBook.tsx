import React, {MouseEvent, useCallback, useEffect, useRef, useState} from "react";
import {FinnhubTrade} from "./QuoteComponent";

const formatTime = (timestamp: number): string => {
    // If timestamp > 1e10, assume it's in ms; otherwise, seconds.
    return new Date(timestamp > 1e10 ? timestamp : timestamp * 1000).toLocaleTimeString();
};

/**
 * Partition the trades into sells and buys based on the mid price.
 */
const partitionTrades = (
    trades: FinnhubTrade[],
    midPrice: number,
    sortCriteria: "price" | "volume"
): { sells: FinnhubTrade[]; buys: FinnhubTrade[] } => {
    const sells = [...trades.filter(trade => trade.p >= midPrice)];
    const buys = [...trades.filter(trade => trade.p < midPrice)];

    if (sortCriteria === "price") {
        sells.sort((a, b) => a.p - b.p);
        buys.sort((a, b) => b.p - a.p);
    } else {
        sells.sort((a, b) => b.v - a.v);
        buys.sort((a, b) => b.v - a.v);
    }
    return {sells, buys};
};

/**
 * Computes a background color based on trade volume relative to the maximum volume.
 *
 * We use a squared ratio (non-linear mapping) to provide more granular shades.
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
    // Square the ratio for a more granular, non-linear response.
    const adjustedRatio = Math.pow(ratio, 2);
    const baseBrightness = darkTheme ? 60 : 80;
    const brightnessDelta = darkTheme ? 40 : 50; // maximum reduction in brightness
    const brightness = baseBrightness - adjustedRatio * brightnessDelta;
    const hue = isSell ? 120 : 0;
    return `hsl(${hue}, 100%, ${brightness}%)`;
};

// Simple throttle function.
function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    } as T;
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
    const [sortCriteria, setSortCriteria] = useState<"price" | "volume">("price");

    // Function to scroll the mid-price divider into view.
    const scrollToMid = useCallback(() => {
        if (orderBookContainerRef.current && midPriceRef.current) {
            const container = orderBookContainerRef.current;
            const midEl = midPriceRef.current;
            const containerRect = container.getBoundingClientRect();
            const midRect = midEl.getBoundingClientRect();
            const offset = midRect.top - containerRect.top - containerRect.height / 2 + midRect.height / 2;
            container.scrollBy({top: offset, behavior: "smooth"});
        }
    }, []);

    const throttledScrollToMid = useCallback(throttle(scrollToMid, 500), [scrollToMid]);

    useEffect(() => {
        if (selectedSymbolForOrderBook) {
            throttledScrollToMid();
        }
    }, [selectedSymbolForOrderBook, sortCriteria, throttledScrollToMid]);

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
    // Get the trades and limit to the last 100 entries.
    const trades = orderBooks[selectedSymbolForOrderBook] || [];
    const limitedTrades = trades.length > 100 ? trades.slice(trades.length - 100) : trades;
    // Determine max volume (avoid division by zero)
    const maxVolume = Math.max(...limitedTrades.map(t => t.v), 1);
    const {sells, buys} = partitionTrades(limitedTrades, midPrice, sortCriteria);

    return (
        <div
            onClick={closeOrderBookPopup}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            <div
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                className={`relative p-2 w-11/12 max-w-xl ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
            >
                <button
                    onClick={closeOrderBookPopup}
                    className={`absolute top-2 right-2 bg-transparent border-0 text-2xl cursor-pointer ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                >
                    ×
                </button>
                <div className="mb-4 flex justify-between items-center">
                    <h2>{selectedSymbolForOrderBook} Order Book</h2>
                    {/* Optional: Add UI for changing sort criteria */}
                </div>
                {limitedTrades.length > 0 ? (
                    <div ref={orderBookContainerRef} className="grid gap-2 h-[35em] overflow-y-auto">
                        {/* Sells section */}
                        {sells.map((trade, index) => {
                            const rowBg = getRowColorByVolume(trade.v, maxVolume, isDarkTheme, true);
                            return (
                                <div
                                    key={`sell-${index}`}
                                    className="grid grid-cols-3 p-1 transition-all duration-300 ease-in-out"
                                    style={{backgroundColor: rowBg}}
                                >
                                    <div>{trade.p}</div>
                                    <div>{trade.v}</div>
                                    <div>{formatTime(trade.t)}</div>
                                </div>
                            );
                        })}
                        {/* Mid price divider */}
                        <div
                            ref={midPriceRef}
                            className="flex items-center justify-center border-t-2 border-b-2 border-black p-1 font-bold transition-all duration-300 ease-in-out"
                        >
                            {midPrice ? `MID ${midPrice.toFixed(2)}` : "Mid Price Unavailable"}
                        </div>
                        {/* Buys section */}
                        {buys.map((trade, index) => {
                            const rowBg = getRowColorByVolume(trade.v, maxVolume, isDarkTheme, false);
                            return (
                                <div
                                    key={`buy-${index}`}
                                    className="grid grid-cols-3 p-1 transition-all duration-300 ease-in-out"
                                    style={{backgroundColor: rowBg}}
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
