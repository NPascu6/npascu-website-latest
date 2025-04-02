import React, {useEffect, useState} from 'react';
import * as signalR from '@microsoft/signalr';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {Link, useLocation} from 'react-router-dom';
import CollapsableSection from "../common/CollapsableSection";
import {FaArrowDown, FaArrowUp} from 'react-icons/fa';
import Loading from "../../pages/generic/Loading";
import OrderBook from "./OrderBook";
import DepthChart from "./DepthChartCompontent";

// --- Interfaces ---
export interface FinnhubQuote {
    c: number;  // current price
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;  // timestamp in seconds
}

export interface FinnhubTrade {
    p: number;  // trade price
    s: string;  // symbol
    t: number;  // timestamp in milliseconds
    v: number;  // volume
    c?: number | null;
    side?: 'buy' | 'sell';  // added side
}

interface QuoteData {
    quote: FinnhubQuote;
    updated: boolean;
    direction?: 'up' | 'down' | 'neutral';
}

interface Quotes {
    [symbol: string]: QuoteData;
}

interface OrderBooks {
    [symbol: string]: FinnhubTrade[];
}

const blinkDuration = 500;

const symbolEmojis: { [symbol: string]: string } = {
    "BINANCE:BTCUSDT": "🪙",  // Bitcoin
    "BINANCE:ETHUSDT": "💎",  // Ethereum
    "BINANCE:XRPUSDT": "🚀",  // Ripple
    "BINANCE:BNBUSDT": "💛",  // Binance Coin (using a yellow heart)
    "BINANCE:ADAUSDT": "🧡",  // Cardano
    "BINANCE:SOLUSDT": "🌞",  // Solana
    "BINANCE:DOGEUSDT": "🐶", // Dogecoin
    "BINANCE:DOTUSDT": "📌",  // Polkadot
    "BINANCE:LTCUSDT": "💰",  // Litecoin
    "BINANCE:LINKUSDT": "🔗", // Chainlink
    "BINANCE:UNIUSDT": "🦄",  // Uniswap
    "BINANCE:MATICUSDT": "🔷",// MATIC (using a blue diamond)
    "BINANCE:AVAXUSDT": "❄️",  // Avalanche
    "BINANCE:ALGOUSDT": "🥇",  // Algorand (gold medal)
    "BINANCE:ATOMUSDT": "🌌"   // Cosmos
};

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
    "BINANCE:ATOMUSDT"
];

const formatTime = (timestamp: number): string =>
    new Date(timestamp > 1e10 ? timestamp : timestamp * 1000).toLocaleTimeString();

const QuotesComponent: React.FC = () => {
    const [quotes, setQuotes] = useState<Quotes>({});
    const [orderBooks, setOrderBooks] = useState<OrderBooks>({});
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
    const [selectedSymbolForOrderBook, setSelectedSymbolForOrderBook] = useState<string | null>(null);
    const [selectedSymbolForDepthChart, setSelectedSymbolForDepthChart] = useState<string | null>(null);
    const [lastTradeSide, setLastTradeSide] = useState<{ [symbol: string]: 'buy' | 'sell' }>({});

    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const location = useLocation();
    const FaArrowDownIcon: any = FaArrowDown;
    const FaArrowUpIcon: any = FaArrowUp;

    useEffect(() => {
        setSelectedSymbols(availableSymbols);
    }, []);

    useEffect(() => {
        function applyRandomPercentage(value: number): number {
            const randomFactor = (Math.random() - 0.5) * 0.02;
            const newValue = value * (1 + randomFactor);
            return newValue === value ? value * 1.0001 : newValue;
        }

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_API_KEY)
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log('Connected to quotes hub.'))
            .catch(err => console.error('Error connecting to quotes hub:', err));

        // Handle ReceiveQuote
        connection.on('ReceiveQuote', (symbol: string, newQuote: FinnhubQuote) => {
            const randomizedQuote = {
                ...newQuote,
                c: applyRandomPercentage(newQuote.c),
                t: applyRandomPercentage(newQuote.t)
            };

            setQuotes(prev => {
                const prevData = prev[symbol];
                let updated = false;
                if (prevData) {
                    if (prevData.quote.c !== randomizedQuote.c || prevData.quote.t !== randomizedQuote.t) {
                        updated = true;
                    }
                } else {
                    updated = true;
                }
                const direction = prevData?.direction || 'neutral';
                const newData: QuoteData = {quote: randomizedQuote, updated, direction};
                if (updated) {
                    setTimeout(() => {
                        setQuotes(current => {
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

        // Handle ReceiveTrade (Balanced Buys/Sells)
        connection.on('ReceiveTrade', (symbol: string, newTrade: FinnhubTrade) => {
            const randomizedTrade: FinnhubTrade = {
                ...newTrade,
                p: applyRandomPercentage(newTrade.p)
            };

            const previousSide = lastTradeSide[symbol] || 'sell';
            const nextSide = previousSide === 'buy' ? 'sell' : 'buy';
            randomizedTrade.side = nextSide;

            setLastTradeSide(prev => ({...prev, [symbol]: nextSide}));

            setOrderBooks(prev => {
                const currentTrades = prev[symbol] || [];
                const updatedTrades = [randomizedTrade, ...currentTrades];
                return {...prev, [symbol]: updatedTrades.slice(0, 1000)};
            });

            setQuotes(prev => {
                const prevData = prev[symbol];
                if (prevData) {
                    let direction: 'up' | 'down' | 'neutral' = 'neutral';
                    if (randomizedTrade.p > prevData.quote.c) {
                        direction = 'up';
                    } else if (randomizedTrade.p < prevData.quote.c) {
                        direction = 'down';
                    }
                    return {
                        ...prev,
                        [symbol]: {
                            ...prevData,
                            updated: true,
                            direction,
                        },
                    };
                }
                return prev;
            });
        });

        return () => {
            connection.stop().catch(err => console.error('Error stopping connection:', err));
        };
    }, []); // Dependency array updated to avoid repeated reconnections

    const handleCheckboxChange = (symbol: string) => {
        setSelectedSymbols(prev =>
            prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
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
    };

    const closeOrderBookPopup = () => {
        setSelectedSymbolForOrderBook(null);
    };

    const handleOpenDepthChart = (symbol: string) => {
        setSelectedSymbolForDepthChart(symbol);
    };

    const closeDepthChartPopup = () => {
        setSelectedSymbolForDepthChart(null);
    };

    const isLoading = Object.keys(quotes).length === 0;

    return (
        <div

            className={`overflow-y-auto p-1 ${isDarkTheme ? "bg-[#1a1d24] text-white" : "bg-white text-gray-900"}`}
        >
            {location.pathname !== "/" && (
                <div className="flex justify-end">
                    <Link
                        to="/"
                        className={`text-4xl no-underline ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                    >
                        ×
                    </Link>
                </div>
            )}
            <div className="mb-2 w-full">
                <CollapsableSection title="Symbols" isCollapsed={true}>
                    <div className="grid gap-3 h-56 overflow-y-auto flex-wrap">
                        {availableSymbols.map(symbol => (
                            <label
                                key={symbol}
                                className={`flex items-center gap-2 mb-2 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSymbols.includes(symbol)}
                                    onChange={() => handleCheckboxChange(symbol)}
                                    className="accent-blue-500"
                                />
                                {symbolEmojis[symbol] ? `${symbolEmojis[symbol]} ${symbol}` : symbol}
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={handleSelectAll}
                        className={`mt-1 w-full rounded bg-${isDarkTheme ? "[#555]" : "blue-600"} py-2 text-white`}
                    >
                        {selectedSymbols.length === availableSymbols.length ? 'Deselect All' : 'Select All'}
                    </button>
                </CollapsableSection>
            </div>
            {isLoading ? (
                <div className="text-center py-8">
                    <Loading/>
                </div>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-1 list-none p-0 overflow-y-auto h-[400px] sm:h-auto">
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
                                            <FaArrowUpIcon className="ml-2" color="#00cc00"/>
                                        )}
                                        {data.direction === "down" && (
                                            <FaArrowDownIcon className="ml-2" color="#ff3333"/>
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

            <OrderBook
                selectedSymbolForOrderBook={selectedSymbolForOrderBook}
                isDarkTheme={isDarkTheme}
                closeOrderBookPopup={closeOrderBookPopup}
                orderBooks={orderBooks}
                quotes={quotes}
            />

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
