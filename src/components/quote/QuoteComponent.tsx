import React, {useEffect, useState} from 'react';
import * as signalR from '@microsoft/signalr';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {Link, useLocation} from 'react-router-dom';
import CollapsableSection from "../common/CollapsableSection";
import {FaArrowDown, FaArrowUp} from 'react-icons/fa';
import Loading from "../../pages/generic/Loading";
import OrderBook from "./OrderBook";

// --- Interfaces ---
// Quote events (from ReceiveQuote)
// Quotes include property "c" for current price and timestamp in seconds.
export interface FinnhubQuote {
    c: number;  // current price
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;  // timestamp in seconds
}

// Trade events (from ReceiveTrade)
// Trades include property "p" for price, and timestamp in milliseconds.
export interface FinnhubTrade {
    p: number;  // trade price
    s: string;  // symbol
    t: number;  // timestamp in milliseconds
    v: number;  // volume
    c?: number | null;
}

// For instrument cards we store quote data plus an "updated" flag and direction.
interface QuoteData {
    quote: FinnhubQuote;
    updated: boolean;
    direction?: 'up' | 'down' | 'neutral';
}

// Dictionary of quotes keyed by symbol.
interface Quotes {
    [symbol: string]: QuoteData;
}

// OrderBooks stores an array of trades per symbol.
interface OrderBooks {
    [symbol: string]: FinnhubTrade[];
}

const blinkDuration = 500;

const symbolEmojis: { [symbol: string]: string } = {
    "BINANCE:BTCUSDT": "🪙",
    "BINANCE:ETHUSDT": "💎",
    "BINANCE:XRPUSDT": "🚀",
    "BINANCE:ADAUSDT": "🧡",
    "BINANCE:SOLUSDT": "🌞",
    "BINANCE:LTCUSDT": "💰",
    "BINANCE:LINKUSDT": "🔗",
    "BINANCE:AVAXUSDT": "❄️"
};

export const availableSymbols = [
    "BINANCE:BTCUSDT",
    "BINANCE:ETHUSDT",
    "BINANCE:XRPUSDT",
    "BINANCE:ADAUSDT",
    "BINANCE:SOLUSDT",
    "BINANCE:LTCUSDT",
    "BINANCE:LINKUSDT",
    "BINANCE:AVAXUSDT"
];

const formatTime = (timestamp: number): string => {
    // If timestamp > 1e10, assume it's in ms; otherwise, seconds.
    return new Date(timestamp > 1e10 ? timestamp : timestamp * 1000).toLocaleTimeString();
};

// --- Component ---
const QuotesComponent: React.FC = () => {
    const [quotes, setQuotes] = useState<Quotes>({});
    const [orderBooks, setOrderBooks] = useState<OrderBooks>({});
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
    const [selectedSymbolForOrderBook, setSelectedSymbolForOrderBook] = useState<string | null>(null);

    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const location = useLocation();

    // Set initial symbols.
    useEffect(() => {
        setSelectedSymbols(availableSymbols);
    }, []);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl('https://npascu-api-v1.onrender.com/quotesHub')
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log('Connected to quotes hub.'))
            .catch(err => console.error('Error connecting to quotes hub:', err));

        // Handle ReceiveQuote events.
        connection.on('ReceiveQuote', (symbol: string, newQuote: FinnhubQuote) => {
            setQuotes(prev => {
                const prevData = prev[symbol];
                let updated = false;
                if (prevData) {
                    if (prevData.quote.c !== newQuote.c || prevData.quote.t !== newQuote.t) {
                        updated = true;
                    }
                } else {
                    updated = true;
                }
                const direction = prevData?.direction || 'neutral';
                const newData: QuoteData = {quote: newQuote, updated, direction};
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

        // Handle ReceiveTrade events.
        connection.on('ReceiveTrade', (symbol: string, newTrade: FinnhubTrade) => {
            // Update order book: store up to 1000 trades.
            setOrderBooks(prev => {
                const currentTrades = prev[symbol] || [];
                const updatedTrades = [newTrade, ...currentTrades];
                return {...prev, [symbol]: updatedTrades.slice(0, 1000)};
            });
            // Update instrument card arrow direction.
            setQuotes(prev => {
                const prevData = prev[symbol];
                if (prevData) {
                    let direction: 'up' | 'down' | 'neutral' = 'neutral';
                    if (newTrade.p > prevData.quote.c) {
                        direction = 'up';
                    } else if (newTrade.p < prevData.quote.c) {
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
    }, []);

    const handleCheckboxChange = (symbol: string) => {
        setSelectedSymbols(prev =>
            prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
        );
    };

    const handleSelectAll = () => {
        setSelectedSymbols(availableSymbols.length === selectedSymbols.length ? [] : [...availableSymbols]);
    };

    const handleOpenOrderBook = (symbol: string) => {
        setSelectedSymbolForOrderBook(symbol);
    };

    const closeOrderBookPopup = () => {
        setSelectedSymbolForOrderBook(null);
    };

    const isLoading = Object.keys(quotes).length === 0;

    return (
        <div
            className={` overflow-y-auto p-1 ${isDarkTheme ? "bg-[#1a1d24] text-white" : "bg-white text-gray-900"}`}
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
                            <label key={symbol}
                                   className={`flex items-center gap-2 mb-2 ${isDarkTheme ? "text-white" : "text-gray-900"}`}>
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
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-1 list-none p-0">
                    {Object.entries(quotes)
                        .filter(([symbol]) => selectedSymbols.includes(symbol))
                        .map(([symbol, data]) => (
                            <li
                                key={symbol}
                                className={`relative border border-green-900 rounded p-3 transition-colors duration-300`}
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
                                    {symbolEmojis[symbol] ? `${symbolEmojis[symbol]} ${symbol}` : symbol}
                                </strong>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span
                                            className={`text-base font-bold ${
                                                data.direction === 'up'
                                                    ? "text-green-500"
                                                    : data.direction === 'down'
                                                        ? "text-red-500"
                                                        : isDarkTheme
                                                            ? "text-white"
                                                            : "text-gray-900"
                                            }`}
                                        >
                                          {data.quote.c}
                                        </span>
                                        {data.direction === 'up' && <FaArrowUp className="ml-2" color="#00cc00"/>}
                                        {data.direction === 'down' && <FaArrowDown className="ml-2" color="#ff3333"/>}
                                    </div>
                                    <button
                                        className="rounded bg-green-700 py-1 px-2 text-sm text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenOrderBook(symbol);
                                        }}
                                    >
                                        Order Book
                                    </button>
                                </div>
                                <small className="block mt-1">{formatTime(data.quote.t)}</small>
                            </li>
                        ))}
                    <OrderBook
                        selectedSymbolForOrderBook={selectedSymbolForOrderBook}
                        isDarkTheme={isDarkTheme}
                        closeOrderBookPopup={closeOrderBookPopup}
                        orderBooks={orderBooks}
                        quotes={quotes}
                    />
                </ul>
            )}
        </div>
    );
};

export default QuotesComponent;
