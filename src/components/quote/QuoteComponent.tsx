import React, {useEffect, useRef, useState} from "react";
import * as signalR from "@microsoft/signalr";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {Link, useLocation} from "react-router-dom";
import CollapsableSection from "../common/CollapsableSection";
import {FaArrowDown, FaArrowUp} from "react-icons/fa";
import Loading from "../../pages/generic/Loading";
import OrderBook from "./OrderBook";
import DepthChart from "./DepthChartComponent";
import CommonDialog from "../common/CommonDialog";

// --- Interfaces ---
export interface FinnhubQuote {
    c: number; // current price
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number; // timestamp in seconds (or ms if you convert)
}

export interface FinnhubTrade {
    p: number; // trade price
    s: string; // symbol
    t: number; // timestamp in ms
    v: number; // volume
    c?: number | null;
    side?: "bid" | "ask";
}

interface QuoteData {
    quote: FinnhubQuote;
    updated: boolean;
    direction?: "up" | "down" | "neutral";
}

interface Quotes {
    [symbol: string]: QuoteData;
}

interface OrderBooks {
    [symbol: string]: FinnhubTrade[];
}

const blinkDuration = 500;
const symbolEmojis: { [symbol: string]: string } = {
    "BINANCE:BTCUSDT": "🪙",
    "BINANCE:ETHUSDT": "💎",
    "BINANCE:XRPUSDT": "🚀",
    "BINANCE:BNBUSDT": "💛",
    "BINANCE:ADAUSDT": "🧡",
    "BINANCE:SOLUSDT": "🌞",
    "BINANCE:DOGEUSDT": "🐶",
    "BINANCE:DOTUSDT": "📌",
    "BINANCE:LTCUSDT": "💰",
    "BINANCE:LINKUSDT": "🔗",
    "BINANCE:UNIUSDT": "🦄",
    "BINANCE:MATICUSDT": "🔷",
    "BINANCE:AVAXUSDT": "❄️",
    "BINANCE:ALGOUSDT": "🥇",
    "BINANCE:ATOMUSDT": "🌌",
};

// The symbols you display
export const availableSymbols = [
    "BINANCE:BTCUSDT",
    "BINANCE:ETHUSDT",
    "BINANCE:XRPUSDT",
    "BINANCE:BNBUSDT",
    "BINANCE:ADAUSDT",
    "BINANCE:SOLUSDT",
    "BINANCE:DOGEUSDT",
    "BINANCE:DOTUSDT",
    "BINANCE:LTCUSDT",
    "BINANCE:LINKUSDT",
    "BINANCE:UNIUSDT",
    "BINANCE:MATICUSDT",
    "BINANCE:AVAXUSDT",
    "BINANCE:ALGOUSDT",
    "BINANCE:ATOMUSDT",
];

const formatTime = (timestamp: number): string =>
    new Date(
        timestamp > 1e10 ? timestamp : timestamp * 1000
    ).toLocaleTimeString();

const QuotesComponent: React.FC = () => {
    const [quotes, setQuotes] = useState<Quotes>({});
    const [orderBooks, setOrderBooks] = useState<OrderBooks>({});
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
    const [selectedSymbolForOrderBook, setSelectedSymbolForOrderBook] = useState<
        string | null
    >(null);
    const [selectedSymbolForDepthChart, setSelectedSymbolForDepthChart] =
        useState<string | null>(null);

    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const location = useLocation();

    // ------------------------------
    // Pattern array to produce trades
    // e.g. 1,2,3,4,5,4,3,2 => repeat
    // ------------------------------
    const pattern = useRef<number[]>([1, 2, 3, 4, 5, 4, 3, 2]);
    // Keep an independent pattern index for each symbol so trade generation
    // for one symbol doesn't affect the others
    const patternIndicesRef = useRef<{ [symbol: string]: number }>({});

    // We'll track last time from real feed. If your feed is slow, you can do "offline simulation" too
    const lastRealUpdateRef = useRef<number>(Date.now());

    useEffect(() => {
        setSelectedSymbols(availableSymbols);
    }, []);

    useEffect(() => {
        // 1) Setup the SignalR connection
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_API_KEY)
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => console.log("Connected to quotes hub."))
            .catch((err) => console.error("Error connecting to quotes hub:", err));

        // 2) "ReceiveQuote"
        connection.on("ReceiveQuote", (symbol: string, newQuote: FinnhubQuote) => {
            lastRealUpdateRef.current = Date.now();

            const applyRandomPercentage = (value: number) => {
                const randomFactor = (Math.random() - 0.5) * 0.02; // ±1%
                const newValue = value * (1 + randomFactor);
                return newValue === value ? value * 1.0001 : newValue;
            };

            const randomizedQuote: FinnhubQuote = {
                ...newQuote,
                c: applyRandomPercentage(newQuote.c),
                t: applyRandomPercentage(newQuote.t),
            };

            setQuotes((prev) => {
                const prevData = prev[symbol];
                let updated = false;
                if (prevData) {
                    if (
                        prevData.quote.c !== randomizedQuote.c ||
                        prevData.quote.t !== randomizedQuote.t
                    ) {
                        updated = true;
                    }
                } else {
                    updated = true;
                }
                const direction = prevData?.direction || "neutral";
                const newData: QuoteData = {
                    quote: randomizedQuote,
                    updated,
                    direction,
                };

                if (updated) {
                    // blink the tile for blinkDuration ms
                    setTimeout(() => {
                        setQuotes((current) => {
                            const data = current[symbol];
                            if (data && data.updated) {
                                return {...current, [symbol]: {...data, updated: false}};
                            }
                            return current;
                        });
                    }, blinkDuration);
                }
                return {...prev, [symbol]: newData};
            });
        });

        // 3) "ReceiveTrade" -> produce multiple buy/sell trades in a pattern
        connection.on(
            "ReceiveTrade",
            (symbol: string, incomingTrade: FinnhubTrade) => {
                lastRealUpdateRef.current = Date.now();

                const currentQuote = quotes[symbol]?.quote;
                const midPrice = currentQuote?.c ?? incomingTrade.p;

                // Each symbol maintains its own index into the pattern so
                // updates happen independently across symbols
                const currentIndex =
                    patternIndicesRef.current[symbol] ?? 0;
                const howMany = pattern.current[currentIndex];
                patternIndicesRef.current[symbol] =
                    (currentIndex + 1) % pattern.current.length;

                // We'll produce "howMany" buy trades + "howMany" sell trades,
                // each with small randomization around midPrice
                const tradesToAdd: FinnhubTrade[] = [];

                for (let i = 0; i < howMany; i++) {
                    // Slight random factor (±0.05%)
                    const variationFactor = 1 + (Math.random() - 0.5) * 0.001;
                    const basePrice = incomingTrade.p * variationFactor;

                    // Force buy below mid
                    const buyAdjustment = Math.abs(Math.random() * 0.001);
                    const buyPrice = Math.min(
                        basePrice * (1 - buyAdjustment),
                        midPrice * (1 - buyAdjustment)
                    );
                    tradesToAdd.push({
                        ...incomingTrade,
                        p: parseFloat(buyPrice.toFixed(6)),
                        side: "bid",
                        t: Date.now(),
                        v: incomingTrade.v * (1 + Math.random() * 0.1),
                    });
                }

                for (let i = 0; i < howMany; i++) {
                    // Slight random factor (±0.05%)
                    const variationFactor = 1 + (Math.random() - 0.5) * 0.001;
                    const basePrice = incomingTrade.p * variationFactor;

                    // Force sell above mid
                    const sellAdjustment = Math.abs(Math.random() * 0.001);
                    const sellPrice = Math.max(
                        basePrice * (1 + sellAdjustment),
                        midPrice * (1 + sellAdjustment)
                    );
                    tradesToAdd.push({
                        ...incomingTrade,
                        p: parseFloat(sellPrice.toFixed(6)),
                        side: "ask",
                        t: Date.now(),
                        v: incomingTrade.v * (1 + Math.random() * 0.1),
                    });
                }

                // Add them to the order book
                setOrderBooks((prev) => {
                    const currentTrades = prev[symbol] || [];
                    // Prepend new trades
                    const updatedTrades = [...tradesToAdd, ...currentTrades];
                    return {...prev, [symbol]: updatedTrades.slice(0, 1000)};
                });

                // Also update the quotes direction based on the last buy
                // (or pick any of the trades, your choice)
                const lastBuy = tradesToAdd.find((t) => t.side === "bid");
                if (lastBuy) {
                    setQuotes((prev) => {
                        const prevData = prev[symbol];
                        if (!prevData) return prev;

                        let direction: "up" | "down" | "neutral" = "neutral";
                        if (lastBuy.p > prevData.quote.c) direction = "up";
                        else if (lastBuy.p < prevData.quote.c) direction = "down";

                        return {
                            ...prev,
                            [symbol]: {
                                ...prevData,
                                updated: true,
                                direction,
                            },
                        };
                    });
                }
            }
        );

        return () => {
            connection
                .stop()
                .catch((err) => console.error("Error stopping connection:", err));
        };
    }, []);

    // (Optional) If your API feed is slow, you can do an "offline simulation" approach
    // every X seconds to produce trades or randomize quotes

    const handleCheckboxChange = (symbol: string) => {
        setSelectedSymbols((prev) =>
            prev.includes(symbol)
                ? prev.filter((s) => s !== symbol)
                : [...prev, symbol]
        );
    };

    const handleSelectAll = () => {
        if (selectedSymbols.length === availableSymbols.length) {
            setSelectedSymbols([]);
        } else {
            setSelectedSymbols([...availableSymbols]);
        }
    };

    const handleOpenOrderBook = (symbol: string) => {
        setSelectedSymbolForOrderBook(symbol);
        setIsOrderBookOpen(true);
    };
    const closeOrderBookPopup = () => {
        setIsOrderBookOpen(false);
        setSelectedSymbolForOrderBook(null);
    };

    const handleOpenDepthChart = (symbol: string) => {
        setIsDepthChartOpen(true);
        setSelectedSymbolForDepthChart(symbol);
    };
    const closeDepthChartPopup = () => {
        setIsDepthChartOpen(false);
        setSelectedSymbolForDepthChart(null);
    };

    const isLoading = Object.keys(quotes).length === 0;
    const [isOrderBookOpen, setIsOrderBookOpen] = useState(false);
    const [isDepthChartOpen, setIsDepthChartOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeOrderBookPopup();
                closeDepthChartPopup();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectedSymbolForOrderBook &&
                event.target instanceof HTMLElement &&
                !event.target.closest(".order-book-popup")
            ) {
                closeOrderBookPopup();
            }
            if (
                selectedSymbolForDepthChart &&
                event.target instanceof HTMLElement &&
                !event.target.closest(".depth-chart-popup")
            ) {
                closeDepthChartPopup();
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [selectedSymbolForOrderBook, selectedSymbolForDepthChart]);

    return (
        <div
            className={`overflow-y-auto p-1 ${
                isDarkTheme ? "bg-[#1a1d24] text-white" : "bg-white text-gray-900"
            }`}
        >
            {location.pathname !== "/" && (
                <div className="flex justify-end">
                    <Link
                        to="/"
                        className={`text-4xl no-underline ${
                            isDarkTheme ? "text-white" : "text-gray-900"
                        }`}
                    >
                        ×
                    </Link>
                </div>
            )}

            {/* Symbols Section */}
            <div className="mb-2 w-full">
                <CollapsableSection title="Symbols" isCollapsed={true}>
                    <div className="flex h-56 overflow-y-auto flex-wrap items-center justify-center">
                        {availableSymbols.map((symbol) => (
                            <label
                                key={symbol}
                                className={`flex w-full p-1 items-center border-gray-600 border-2 cursor-pointer hover:bg-gray-700 hover:text-sky-50 ${
                                    isDarkTheme ? "text-white" : "text-gray-900"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSymbols.includes(symbol)}
                                    onChange={() => handleCheckboxChange(symbol)}
                                    className="accent-blue-500"
                                />
                                {symbolEmojis[symbol]
                                    ? `${symbolEmojis[symbol]} ${symbol}`
                                    : symbol}
                            </label>
                        ))}
                    </div>
                    <button
                        style={{
                            background: isDarkTheme ? "#20242c" : "#ECEFF1",
                            color: isDarkTheme ? "#ECEFF1" : "#20242c",
                        }}
                        onClick={handleSelectAll}
                        className="mt-1 w-full rounded py-2 text-white"
                    >
                        {selectedSymbols.length === availableSymbols.length
                            ? "Deselect All"
                            : "Select All"}
                    </button>
                </CollapsableSection>
            </div>

            {/* Main Content */}
            {isLoading ? (
                <div className="text-center py-8">
                    <Loading/>
                </div>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-flow-col sm:grid-rows-3 sm:[grid-auto-columns:1fr] gap-1 list-none p-0 overflow-y-auto h-[600px] sm:h-auto">
                    {Object.entries(quotes)
                        .filter(([symbol]) => selectedSymbols.includes(symbol))
                        .map(([symbol, data]) => (
                            <li
                                key={symbol}
                                className="relative border border-green-900 rounded p-3 transition-colors duration-300"
                                onClick={() => handleOpenOrderBook(symbol)}
                            >
                                <div
                                    className="absolute top-1 right-1 cursor-pointer font-bold"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCheckboxChange(symbol);
                                    }}
                                >
                                    ×
                                </div>
                                <strong className="text-xl">
                                    {symbolEmojis[symbol]
                                        ? `${symbolEmojis[symbol]} ${symbol}`
                                        : symbol}
                                </strong>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center">
                    <span
                        className={`text-base font-bold ${
                            data.direction === "up"
                                ? "text-green-500"
                                : data.direction === "down"
                                    ? "text-red-500"
                                    : isDarkTheme
                                        ? "text-white"
                                        : "text-gray-900"
                        }`}
                    >
                      {data.quote.c.toFixed(2)}
                    </span>
                                        {data.direction === "up" && (
                                            <FaArrowUp className="ml-2" color="#00cc00"/>
                                        )}
                                        {data.direction === "down" && (
                                            <FaArrowDown className="ml-2" color="#ff3333"/>
                                        )}
                                    </div>
                                    <div className="space-x-2 space-y-2">
                                        <button
                                            className="rounded bg-green-700 py-1 px-2 text-sm text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenOrderBook(symbol);
                                            }}
                                        >
                                            Order Book
                                        </button>
                                        <button
                                            className="rounded bg-blue-700 py-1 px-2 text-sm text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDepthChart(symbol);
                                            }}
                                        >
                                            Depth Chart
                                        </button>
                                    </div>
                                </div>
                                <small className="block mt-1">{formatTime(data.quote.t)}</small>
                            </li>
                        ))}
                </ul>
            )}

            <CommonDialog
                title={""}
                onClose={() => setIsOrderBookOpen(false)}
                isOpen={isOrderBookOpen}
            >
                <OrderBook
                    selectedSymbolForOrderBook={selectedSymbolForOrderBook}
                    isDarkTheme={isDarkTheme}
                    closeOrderBookPopup={closeOrderBookPopup}
                    orderBooks={orderBooks}
                    quotes={quotes}
                />
            </CommonDialog>

            <DepthChart
                selectedSymbolForDepthChart={selectedSymbolForDepthChart}
                isDarkTheme={isDarkTheme}
                closeDepthChartPopup={closeDepthChartPopup}
                trades={
                    selectedSymbolForDepthChart
                        ? orderBooks[selectedSymbolForDepthChart] || []
                        : []
                }
                midPrice={
                    selectedSymbolForDepthChart
                        ? quotes[selectedSymbolForDepthChart]?.quote.c || 0
                        : 0
                }
            />
        </div>
    );
};

export default QuotesComponent;
