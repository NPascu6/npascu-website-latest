import React, {useState} from "react";
import {FinnhubTrade} from "./QuoteComponent";
import CommonDialog from "../common/CommonDialog";

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
    isAsk: boolean,
    top10: boolean
): string {
    const ratio = volume / maxVolume;
    const adjusted = ratio * ratio;
    const base = dark ? 60 : 80;
    const delta = dark ? 40 : 50;
    let lightness = base - adjusted * delta;
    const hue = isAsk ? 120 : 0;
    if (top10) lightness = Math.max(lightness - 15, 0);
    return `hsl(${hue}, 100%, ${lightness}%)`;
}

// --- Component -----------------------------------------------------------

interface OrderBookProps {
    selectedSymbolForOrderBook: string | null;
    closeOrderBookPopup: () => void;
    isDarkTheme: boolean;
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
    const [sortCriteria, setSortCriteria] = useState<"price" | "volume">("price");

    if (!selectedSymbolForOrderBook) return null;

    // Prepare raw trades
    const raw = orderBooks[selectedSymbolForOrderBook] || [];
    const trades: FinnhubTrade[] = [];
    raw.forEach((t) => {
        trades.push({...t, side: "bid"});
        trades.push({...t, side: "ask"});
    });
    const limited = trades.slice(0, 1000);

    let asks = limited.filter((t) => t.side === "ask");
    let bids = limited.filter((t) => t.side === "bid");

    // Sort
    if (sortCriteria === "price") {
        asks.sort((a, b) => a.p - b.p);
        bids.sort((a, b) => b.p - a.p);
    } else {
        asks.sort((a, b) => b.v - a.v);
        bids.sort((a, b) => b.v - a.v);
    }

    // Limit to top 500
    asks = asks.slice(0, 500);
    bids = bids.slice(0, 500);

    const maxVol = Math.max(...[...asks, ...bids].map((t) => t.v), 1);

    const [bestBidPrice, bestBidVol] = bids[0] ? [bids[0].p, bids[0].v] : [0, 0];
    const [bestAskPrice, bestAskVol] = asks[0] ? [asks[0].p, asks[0].v] : [0, 0];

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

            <div className="relative h-[60vh] w-full">
                {/* Asks above mid (scrollable upward) */}
                <div className="absolute inset-x-0 top-0 bottom-1/2 overflow-y-auto flex flex-col-reverse">
                    {asks.slice().reverse().map((t, i) => (
                        <div
                            key={`ask-${i}`}
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
                <div
                    className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center border-t-2 border-b-2 border-gray-400 py-2 bg-white dark:bg-gray-800 bg-opacity-90 font-bold">
                    {midPrice ? `MID ${midPrice.toFixed(4)}` : "Mid Price Unavailable"}
                </div>

                {/* Bids below mid (scrollable downward) */}
                <div className="absolute inset-x-0 top-1/2 bottom-0 overflow-y-auto flex flex-col">
                    {bids.map((t, i) => (
                        <div
                            key={`bid-${i}`}
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
