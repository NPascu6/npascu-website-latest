import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { FinnhubTrade } from "./QuoteComponent";
import CommonDialog from "../common/CommonDialog";

// --- Helpers -------------------------------------------------------------

const formatTime = (timestamp: number): string =>
    new Date(timestamp > 1e10 ? timestamp : timestamp * 1000).toLocaleTimeString();

function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let inThrottle = false;
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    } as T;
}

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
    const containerRef = useRef<HTMLDivElement>(null);
    const midRef = useRef<HTMLDivElement>(null);

    const [sortCriteria, setSortCriteria] = useState<"price" | "volume">("price");
    const [localTrades, setLocalTrades] = useState<FinnhubTrade[]>([]);

    // Build localTrades whenever symbol or data changes
    useEffect(() => {
        if (!selectedSymbolForOrderBook) return;
        const raw = orderBooks[selectedSymbolForOrderBook] || [];
        const duped: FinnhubTrade[] = [];
        raw.forEach((t) => {
            duped.push({ ...t, side: "buy" });
            duped.push({ ...t, side: "sell" });
        });
        setLocalTrades(duped.slice(0, 1000));
    }, [selectedSymbolForOrderBook, orderBooks]);

    // scroll-to-mid logic
    const scrollToMid = useCallback(() => {
        const c = containerRef.current;
        const m = midRef.current;
        if (c && m) {
            const cRect = c.getBoundingClientRect();
            const mRect = m.getBoundingClientRect();
            const offset = mRect.top - cRect.top - cRect.height / 2 + mRect.height / 2;
            c.scrollBy({ top: offset, behavior: "smooth" });
        }
    }, []);

    const throttled = useCallback(throttle(scrollToMid, 250), [scrollToMid]);

    useEffect(() => {
        if (selectedSymbolForOrderBook) throttled();
    }, [selectedSymbolForOrderBook, sortCriteria, throttled]);

    useEffect(() => {
        if (!selectedSymbolForOrderBook) return;
        const id = setInterval(throttled, 2000);
        return () => clearInterval(id);
    }, [selectedSymbolForOrderBook, sortCriteria, throttled]);

    if (!selectedSymbolForOrderBook) return null;

    // Prepare data
    const midPrice = quotes[selectedSymbolForOrderBook]?.quote.c || 0;
    let sells = localTrades.filter((t) => t.side === "sell");
    let buys = localTrades.filter((t) => t.side === "buy");

    if (sortCriteria === "price") {
        sells.sort((a, b) => a.p - b.p);
        buys.sort((a, b) => b.p - a.p);
    } else {
        sells.sort((a, b) => b.v - a.v);
        buys.sort((a, b) => a.v - b.v);
    }

    sells = sells.slice(0, 500);
    buys = buys.slice(0, 500);

    const maxVol = Math.max(...[...sells, ...buys].map((t) => t.v), 1);

    const [bP, bV] = buys[0] ? [buys[0].p, buys[0].v] : [0, 0];
    const [sP, sV] = sells[0] ? [sells[0].p, sells[0].v] : [0, 0];

    const bPDec = checkNumberLengthToAdjustDecimals(bP);
    const bVDec = checkNumberLengthToAdjustDecimals(bV);
    const sPDec = checkNumberLengthToAdjustDecimals(sP);
    const sVDec = checkNumberLengthToAdjustDecimals(sV);

    return (
        <div>
            <div className="mb-4 flex justify-end items-center space-x-2">
                <span>Sort:</span>
                <select
                    value={sortCriteria}
                    onChange={(e) =>
                        setSortCriteria(e.target.value as "price" | "volume")
                    }
                    className="p-1 rounded bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                >
                    <option value="price">Price</option>
                    <option value="volume">Volume</option>
                </select>
            </div>

            {/* Order Book List */}
            <div
                ref={containerRef}
                className="grid gap-2 h-[60vh] overflow-y-auto"
            >
                {/* Sells (asks) */}
                {sells.map((t, i) => (
                    <div
                        key={`sell-${i}`}
                        className="grid grid-cols-3 p-1 transition-all duration-150"
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
                        <div>{t.p.toFixed(sPDec)}</div>
                        <div>{t.v.toFixed(sVDec)}</div>
                        <div>{formatTime(t.t)}</div>
                    </div>
                ))}

                {/* Mid-price divider */}
                <div
                    ref={midRef}
                    className="sticky top-[50%] flex items-center justify-center border-t-2 border-b-2 border-gray-400 py-2 bg-white dark:bg-gray-800 bg-opacity-90 font-bold"
                >
                    {midPrice ? `MID ${midPrice.toFixed(4)}` : "Mid Price Unavailable"}
                </div>

                {/* Buys (bids) */}
                {buys.map((t, i) => (
                    <div
                        key={`buy-${i}`}
                        className="grid grid-cols-3 p-1 transition-all duration-150"
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
                        <div>{t.p.toFixed(bPDec)}</div>
                        <div>{t.v.toFixed(bVDec)}</div>
                        <div>{formatTime(t.t)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderBook;
