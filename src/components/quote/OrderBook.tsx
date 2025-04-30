import React, { useState } from "react";
import { FinnhubTrade } from "./QuoteComponent";

// --- Helpers -------------------------------------------------------------

const formatTime = (timestamp: number): string =>
    new Date(timestamp > 1e10 ? timestamp : timestamp * 1000).toLocaleTimeString();

function checkNumberLengthToAdjustDecimals(value: number): number {
    const intLen = Math.floor(Math.abs(value)).toString().length;
    if (intLen >= 6) return 2;
    if (intLen >= 4) return 4;
    return 6;
}

function getRowColorByVolume(
    volume: number,
    maxVolume: number,
    dark: boolean,
    isSell: boolean,
    top10: boolean
): string {
    const ratio = volume / maxVolume;
    const adjusted = ratio * ratio;
    const base = dark ? 60 : 80;
    const delta = dark ? 40 : 50;
    let lightness = base - adjusted * delta;
    const hue = isSell ? 120 : 0;
    if (top10) lightness = Math.max(lightness - 15, 0);
    return `hsl(${hue}, 100%, ${lightness}%)`;
}

// --- Component -----------------------------------------------------------

interface OrderBookProps {
    selectedSymbolForOrderBook: string | null;
    closeOrderBookPopup : () => void;
    isDarkTheme: boolean;
    orderBooks: { [symbol: string]: FinnhubTrade[] };
    quotes: { [symbol: string]: { quote: { c: number } } };
}

const OrderBook: React.FC<OrderBookProps> = ({
                                                 selectedSymbolForOrderBook,
                                                 isDarkTheme,
                                                 orderBooks,
                                                 quotes,
                                             }) => {
    const [sortCriteria, setSortCriteria] = useState<"price" | "volume">("price");

    if (!selectedSymbolForOrderBook) return null;

    // Prepare raw trades
    const raw = orderBooks[selectedSymbolForOrderBook] || [];
    const trades: FinnhubTrade[] = [];
    raw.forEach((t) => {
        trades.push({ ...t, side: "buy" });
        trades.push({ ...t, side: "sell" });
    });
    const limited = trades.slice(0, 1000);

    let sells = limited.filter((t) => t.side === "sell");
    let buys = limited.filter((t) => t.side === "buy");

    // Sort
    if (sortCriteria === "price") {
        sells.sort((a, b) => a.p - b.p);
        buys.sort((a, b) => b.p - a.p);
    } else {
        sells.sort((a, b) => b.v - a.v);
        buys.sort((a, b) => b.v - a.v);
    }

    // Limit to top 500
    sells = sells.slice(0, 500);
    buys = buys.slice(0, 500);

    const maxVol = Math.max(...[...sells, ...buys].map((t) => t.v), 1);

    const [bestBidPrice, bestBidVol] = buys[0] ? [buys[0].p, buys[0].v] : [0, 0];
    const [bestAskPrice, bestAskVol] = sells[0] ? [sells[0].p, sells[0].v] : [0, 0];

    const bidPriceDecimals = checkNumberLengthToAdjustDecimals(bestBidPrice);
    const bidVolDecimals = checkNumberLengthToAdjustDecimals(bestBidVol);
    const askPriceDecimals = checkNumberLengthToAdjustDecimals(bestAskPrice);
    const askVolDecimals = checkNumberLengthToAdjustDecimals(bestAskVol);

    const midPrice = quotes[selectedSymbolForOrderBook]?.quote.c || 0;

    return (
        <div>
            <div className="mb-4 flex justify-end items-center space-x-2">
                <span>Sort:</span>
                <select
                    value={sortCriteria}
                    onChange={(e) => setSortCriteria(e.target.value as "price" | "volume")}
                    className="p-1 rounded bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                >
                    <option value="price">Price</option>
                    <option value="volume">Volume</option>
                </select>
            </div>

            {/* Order Book Static View */}
            <div className="relative h-[60vh] w-full">
                {/* Sells above mid (grow upward) */}
                <div className="absolute inset-x-0 top-0 bottom-1/2 overflow-hidden flex flex-col-reverse">
                    {sells.map((t, i) => (
                        <div
                            key={`sell-${i}`}
                            className="grid grid-cols-3 p-1"
                            style={{
                                backgroundColor: getRowColorByVolume(
                                    t.v,
                                    maxVol,
                                    isDarkTheme,
                                    true,
                                    i < 10
                                ),
                                color: isDarkTheme ? "#fff" : undefined,
                                fontWeight: i < 10 ? "bold" : "normal",
                            }}
                        >
                            <div>{t.p.toFixed(askPriceDecimals)}</div>
                            <div>{t.v.toFixed(askVolDecimals)}</div>
                            <div>{formatTime(t.t)}</div>
                        </div>
                    ))}
                </div>

                {/* Mid-price divider */}
                <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center border-t-2 border-b-2 border-gray-400 py-2 bg-white dark:bg-gray-800 bg-opacity-90 font-bold">
                    {midPrice ? `MID ${midPrice.toFixed(4)}` : "Mid Price Unavailable"}
                </div>

                {/* Buys below mid (grow downward) */}
                <div className="absolute inset-x-0 top-1/2 bottom-0 overflow-hidden flex flex-col">
                    {buys.map((t, i) => (
                        <div
                            key={`buy-${i}`}
                            className="grid grid-cols-3 p-1"
                            style={{
                                backgroundColor: getRowColorByVolume(
                                    t.v,
                                    maxVol,
                                    isDarkTheme,
                                    false,
                                    i < 10
                                ),
                                color: isDarkTheme ? "#fff" : "#f2222",
                                fontWeight: i < 10 ? "bold" : "normal",
                            }}
                        >
                            <div>{t.p.toFixed(bidPriceDecimals)}</div>
                            <div>{t.v.toFixed(bidVolDecimals)}</div>
                            <div>{formatTime(t.t)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderBook;
