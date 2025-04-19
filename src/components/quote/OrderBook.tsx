import React, {MouseEvent, useCallback, useEffect, useRef, useState,} from "react";
import {FinnhubTrade} from "./QuoteComponent";

// Format timestamps nicely
const formatTime = (timestamp: number): string =>
    new Date(
        timestamp > 1e10 ? timestamp : timestamp * 1000
    ).toLocaleTimeString();

/**
 * A simple throttle helper to limit how often a function is called.
 */
function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
): T {
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
 * Adjust the number of decimal places based on the integer part length.
 * For larger numbers, fewer decimals are shown; for smaller numbers, more decimals.
 */
function checkNumberLengthToAdjustDecimals(value: number): number {
    const intPartLength = Math.floor(Math.abs(value)).toString().length;
    if (intPartLength >= 6) return 2;
    if (intPartLength >= 4) return 4;
    return 6;
}

/**
 * Computes a background color based on trade volume relative to max volume.
 * For dark theme, brightness ranges from 60% (low volume) to 20% (high volume);
 * for light theme, from 80% to 30%. Sells are green (hue 120) and buys red (hue 0).
 * Top-10 rows receive a slight brightness reduction.
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

    // Local state that stores the incoming trades, split into buy and sell versions.
    const [localTrades, setLocalTrades] = useState<FinnhubTrade[]>([]);

    // When the selected symbol or orderBooks change, update localTrades.
    useEffect(() => {
        if (!selectedSymbolForOrderBook) return;
        const rawTrades = orderBooks[selectedSymbolForOrderBook] || [];
        const newTrades: FinnhubTrade[] = [];
        for (const t of rawTrades) {
            // Duplicate each trade as both a buy and a sell.
            newTrades.push({...t, side: "buy"});
            newTrades.push({...t, side: "sell"});
        }
        // Optionally limit total trades.
        setLocalTrades(newTrades.slice(0, 1000));
    }, [selectedSymbolForOrderBook, orderBooks]);

    // Scroll-to-mid helper (throttled).
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

    // Reduced throttle delay (250ms instead of 500ms)
    const throttledScrollToMid = useCallback(throttle(scrollToMid, 250), [
        scrollToMid,
    ]);

    useEffect(() => {
        if (selectedSymbolForOrderBook) {
            throttledScrollToMid();
        }
    }, [selectedSymbolForOrderBook, sortCriteria, throttledScrollToMid]);

    // Faster recenter every 2 seconds (instead of 5 seconds).
    useEffect(() => {
        if (selectedSymbolForOrderBook) {
            const intervalId = setInterval(() => {
                throttledScrollToMid();
            }, 2000);
            return () => clearInterval(intervalId);
        }
    }, [selectedSymbolForOrderBook, sortCriteria, throttledScrollToMid]);

    if (!selectedSymbolForOrderBook) return null;

    // Get the mid price from the parent's quotes.
    const midPrice = quotes[selectedSymbolForOrderBook]?.quote.c || 0;

    // Partition localTrades by their side.
    let sells = localTrades.filter((trade) => trade.side === "sell");
    let buys = localTrades.filter((trade) => trade.side === "buy");

    // Sort arrays according to the chosen criteria.
    if (sortCriteria === "price") {
        sells.sort((a, b) => a.p - b.p);
        buys.sort((a, b) => b.p - a.p);
    } else {
        // When sorting by volume, sells in descending and buys in ascending order.
        sells.sort((a, b) => b.v - a.v);
        buys.sort((a, b) => a.v - b.v);
    }

    // Limit the arrays to 500 entries each.
    sells = sells.slice(0, 500);
    buys = buys.slice(0, 500);

    // Determine maximum volume for background color scaling.
    const maxVolume = Math.max(...[...sells, ...buys].map((t) => t.v), 1);

    // Compute decimal formatting based on the first trade in each array.
    const tradeB_P = buys.length > 0 ? buys[0].p : 0;
    const tradeB_V = buys.length > 0 ? buys[0].v : 0;
    const tradeS_P = sells.length > 0 ? sells[0].p : 0;
    const tradeS_V = sells.length > 0 ? sells[0].v : 0;

    const tradeB_PDecimals = checkNumberLengthToAdjustDecimals(tradeB_P);
    const tradeB_VDecimals = checkNumberLengthToAdjustDecimals(tradeB_V);
    const tradeS_PDecimals = checkNumberLengthToAdjustDecimals(tradeS_P);
    const tradeS_VDecimals = checkNumberLengthToAdjustDecimals(tradeS_V);

    return (
        <div
            onClick={closeOrderBookPopup}
            className="fixed top-0 left-0 w-full h-auto bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            <div
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                className={`relative p-2 w-10/12 max-w-xl ${
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
                    <div className="flex items-center space-x-2 mt-8">
                        <span>Sort:</span>
                        <select
                            value={sortCriteria}
                            onChange={(e) =>
                                setSortCriteria(e.target.value as "price" | "volume")
                            }
                            className={`p-1 rounded ${
                                isDarkTheme
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-200 text-black"
                            }`}
                        >
                            <option value="price">Price</option>
                            <option value="volume">Volume</option>
                        </select>
                    </div>
                </div>

                {/* Order Book Content */}
                {sells.length > 0 || buys.length > 0 ? (
                    <div
                        ref={orderBookContainerRef}
                        className="grid gap-2 h-[35em] overflow-y-auto"
                    >
                        {/* Sells (Ask Side) */}
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
                                    <div>{trade.p.toFixed(tradeS_PDecimals)}</div>
                                    <div>{trade.v.toFixed(tradeS_VDecimals)}</div>
                                    <div>{formatTime(trade.t)}</div>
                                </div>
                            );
                        })}

                        {/* Mid Price Divider */}
                        <div
                            ref={midPriceRef}
                            className="flex items-center justify-center border-t-2 border-b-2 border-black p-2 font-bold transition-all duration-300"
                        >
                            {midPrice
                                ? `MID ${midPrice.toFixed(4)}`
                                : "Mid Price Unavailable"}
                        </div>

                        {/* Buys (Bid Side) */}
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
                                        color: isDarkTheme ? "#fff" : "#f2222",
                                        fontWeight: index < 10 ? "bold" : "normal",
                                    }}
                                >
                                    <div>{trade.p.toFixed(tradeB_PDecimals)}</div>
                                    <div>{trade.v.toFixed(tradeB_VDecimals)}</div>
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
