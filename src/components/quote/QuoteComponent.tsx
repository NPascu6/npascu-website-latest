import React, {MouseEvent, useEffect, useRef, useState} from 'react';
import * as signalR from '@microsoft/signalr';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {Link, useLocation} from 'react-router-dom';
import CollapsableSection from "../common/CollapsableSection";
import {FaArrowDown, FaArrowUp} from 'react-icons/fa';
import Loading from "../../pages/generic/Loading";

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
    "BINANCE:BTCUSDT": "₿",
    "BINANCE:ETHUSDT": "⚡",
    "BINANCE:XRPUSDT": "🚀",
    "BINANCE:BNBUSDT": "🔵",
    "BINANCE:ADAUSDT": "🧡",
    "BINANCE:SOLUSDT": "🌞",
};

export const availableSymbols = [
    "BINANCE:BTCUSDT",
    "BINANCE:ETHUSDT",
    "BINANCE:XRPUSDT",
    "BINANCE:BNBUSDT",
    "BINANCE:ADAUSDT",
    "BINANCE:SOLUSUT", // check spelling!
    "BINANCE:DOGEUSDT",
    "BINANCE:DOTUSDT",
];

const formatTime = (timestamp: number): string => {
    // If timestamp > 1e10, assume it's in ms; otherwise, seconds.
    return new Date(timestamp > 1e10 ? timestamp : timestamp * 1000).toLocaleTimeString();
};

/**
 * Computes a background color for an order book row based on the trade price relative to the mid price.
 * For light theme: at mid price, brightness is high (≈80%) and decreases toward 30% at ±10%.
 * For dark theme: brightness is about 60% at mid, falling to 20% at the extremes.
 * Hue is 120 (green) for prices above mid and 0 (red) for prices below mid.
 */
const getRowColor = (tradePrice: number, midPrice: number, darkTheme: boolean): string => {
    const diff = (tradePrice - midPrice) / midPrice;
    const clamped = Math.max(-0.1, Math.min(0.1, diff));
    if (darkTheme) {
        const brightness = 60 - (Math.abs(clamped) / 0.1) * 40; // 60% to 20%
        const hue = clamped >= 0 ? 120 : 0;
        return `hsl(${hue}, 100%, ${brightness}%)`;
    } else {
        const brightness = 80 - (Math.abs(clamped) / 0.1) * 50; // 80% to 30%
        const hue = clamped >= 0 ? 120 : 0;
        return `hsl(${hue}, 100%, ${brightness}%)`;
    }
};

/**
 * Partition the trades into sells and buys based on the mid price.
 * Sells: trades with price >= mid, sorted ascending (best sell is closest to mid).
 * Buys: trades with price < mid, sorted descending (best buy is closest to mid).
 * Sorting is based on the provided criteria ("price" or "volume").
 */
const partitionTrades = (
    trades: FinnhubTrade[],
    midPrice: number,
    sortCriteria: 'price' | 'volume'
): { sells: FinnhubTrade[]; buys: FinnhubTrade[] } => {
    let sells = trades.filter(trade => trade.p >= midPrice);
    let buys = trades.filter(trade => trade.p < midPrice);
    if (sortCriteria === 'price') {
        sells = sells.sort((a, b) => a.p - b.p);
        buys = buys.sort((a, b) => b.p - a.p);
    } else {
        sells = sells.sort((a, b) => b.v - a.v);
        buys = buys.sort((a, b) => b.v - a.v);
    }
    return {sells, buys};
};

// --- Component ---
const QuotesComponent: React.FC = () => {
    const [quotes, setQuotes] = useState<Quotes>({});
    const [orderBooks, setOrderBooks] = useState<OrderBooks>({});
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
    const [selectedSymbolForOrderBook, setSelectedSymbolForOrderBook] = useState<string | null>(null);
    // State for sorting criteria: "price" or "volume".
    const [sortCriteria, setSortCriteria] = useState<'price' | 'volume'>('price');

    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const location = useLocation();

    // Refs for auto-scrolling.
    const orderBookContainerRef = useRef<HTMLDivElement>(null);
    const midPriceRef = useRef<HTMLDivElement>(null);

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
            // Update order book.
            setOrderBooks(prev => {
                const currentTrades = prev[symbol] || [];
                const updatedTrades = [newTrade, ...currentTrades];
                return {...prev, [symbol]: updatedTrades.slice(0, 50)};
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

    // Auto-scroll the order book container so the mid-price divider is centered.
    useEffect(() => {
        if (selectedSymbolForOrderBook && orderBookContainerRef.current && midPriceRef.current) {
            const container = orderBookContainerRef.current;
            const midEl = midPriceRef.current;
            const containerRect = container.getBoundingClientRect();
            const midRect = midEl.getBoundingClientRect();
            const offset = midRect.top - containerRect.top - containerRect.height / 2 + midRect.height / 2;
            container.scrollBy({top: offset, behavior: 'smooth'});
        }
    }, [selectedSymbolForOrderBook, sortCriteria]);

    // Throttled auto-scroll: every 5 seconds, ensure the mid-price divider is centered.
    useEffect(() => {
        if (selectedSymbolForOrderBook) {
            const intervalId = setInterval(() => {
                if (orderBookContainerRef.current && midPriceRef.current) {
                    const container = orderBookContainerRef.current;
                    const midEl = midPriceRef.current;
                    const containerRect = container.getBoundingClientRect();
                    const midRect = midEl.getBoundingClientRect();
                    const offset = midRect.top - containerRect.top - containerRect.height / 2 + midRect.height / 2;
                    container.scrollBy({top: offset, behavior: 'smooth'});
                }
            }, 2000);
            return () => clearInterval(intervalId);
        }
    }, [selectedSymbolForOrderBook, sortCriteria]);

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

    const quoteStyle = (updated: boolean): React.CSSProperties => ({
        transition: 'background-color 0.3s ease',
        backgroundColor: updated ? (isDarkTheme ? '#555' : '#ff0') : 'transparent',
        padding: '0.5rem',
        borderRadius: '4px',
        position: 'relative'
    });

    const checkboxLabelStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.5rem',
        color: isDarkTheme ? '#fff' : '#222'
    };

    const isLoading = Object.keys(quotes).length === 0;

    return (
        <div
            style={{
                minHeight: location.pathname !== '/' ? "calc(100vh - 6rem)" : "",
                overflowY: "auto",
                backgroundColor: isDarkTheme ? "#1a1d24" : "#fff",
                color: isDarkTheme ? "#fff" : "#222",
                padding: "0.3rem"
            }}
        >
            {location.pathname !== "/" && (
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Link
                        to="/"
                        style={{
                            fontSize: '2rem',
                            textDecoration: 'none',
                            color: isDarkTheme ? '#fff' : '#222'
                        }}
                    >
                        ×
                    </Link>
                </div>
            )}
            <div style={{marginBottom: '1rem', width: '100%'}}>
                <CollapsableSection title="Symbols" isCollapsed={true}>
                    <div style={{
                        display: 'grid',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        height: '14em',
                        overflowY: 'auto'
                    }}>
                        {availableSymbols.map(symbol => (
                            <label key={symbol} style={checkboxLabelStyle}>
                                <input
                                    type="checkbox"
                                    checked={selectedSymbols.includes(symbol)}
                                    onChange={() => handleCheckboxChange(symbol)}
                                />
                                {symbolEmojis[symbol] ? `${symbolEmojis[symbol]} ${symbol}` : symbol}
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={handleSelectAll}
                        style={{
                            marginTop: '0.2rem',
                            padding: '0.35rem',
                            borderRadius: '0px',
                            border: 'none',
                            backgroundColor: isDarkTheme ? '#555' : '#007bff',
                            color: '#fff',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        {selectedSymbols.length === availableSymbols.length ? 'Deselect All' : 'Select All'}
                    </button>
                </CollapsableSection>
            </div>
            {isLoading ? (
                <div style={{textAlign: 'center', padding: '2rem'}}><Loading/></div>
            ) : (
                <ul style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.3rem',
                    listStyle: 'none',
                    padding: 0
                }}>
                    {Object.entries(quotes)
                        .filter(([symbol]) => selectedSymbols.includes(symbol))
                        .map(([symbol, data]) => (
                            <li
                                key={symbol}
                                style={{
                                    ...quoteStyle(data.updated),
                                    border: '1px solid #004d00',
                                    padding: '0.75rem',
                                    backgroundColor: isDarkTheme ? '#002200' : '#e6ffe6',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '0.25rem',
                                        right: '0.25rem',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        color: isDarkTheme ? '#fff' : '#222',
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCheckboxChange(symbol);
                                    }}
                                >
                                    ×
                                </div>
                                <strong style={{fontSize: '1.2rem'}}>
                                    {symbolEmojis[symbol] ? `${symbolEmojis[symbol]} ${symbol}` : symbol}
                                </strong>
                                <div style={{
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <span
                                            style={{
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                color:
                                                    data.direction === 'up'
                                                        ? '#00cc00'
                                                        : data.direction === 'down'
                                                            ? '#ff3333'
                                                            : isDarkTheme ? '#fff' : '#222',
                                            }}
                                        >
                                          {data.quote.c}
                                        </span>
                                        {data.direction === 'up' && <FaArrowUp className="ml-2" color="#00cc00"/>}
                                        {data.direction === 'down' && <FaArrowDown className="ml-2" color="#ff3333"/>}
                                    </div>
                                    <button
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            border: 'none',
                                            borderRadius: '4px',
                                            backgroundColor: '#006600',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenOrderBook(symbol);
                                        }}
                                    >
                                        Order Book
                                    </button>
                                </div>
                                <small
                                    style={{display: 'block', marginTop: '0.25rem'}}>{formatTime(data.quote.t)}</small>
                            </li>
                        ))}
                </ul>
            )}
            {selectedSymbolForOrderBook && (
                <div
                    onClick={() => closeOrderBookPopup()}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                        style={{
                            backgroundColor: isDarkTheme ? '#333' : '#fff',
                            color: isDarkTheme ? '#fff' : '#222',
                            padding: '0.5rem',
                            borderRadius: '0px',
                            width: '90%',
                            maxWidth: '600px',
                            position: 'relative',
                        }}

                    >
                        <button
                            onClick={closeOrderBookPopup}
                            style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                color: isDarkTheme ? '#fff' : '#222',
                                cursor: 'pointer',
                            }}
                        >
                            ×
                        </button>
                        <div style={{
                            marginBottom: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2>{selectedSymbolForOrderBook} Order Book</h2>
                        </div>
                        {orderBooks[selectedSymbolForOrderBook] && orderBooks[selectedSymbolForOrderBook].length > 0 ? (
                            (() => {
                                const midPrice = quotes[selectedSymbolForOrderBook]?.quote.c || 0;
                                const {
                                    sells,
                                    buys
                                } = partitionTrades(orderBooks[selectedSymbolForOrderBook], midPrice, sortCriteria);
                                return (
                                    <div ref={orderBookContainerRef}
                                         style={{display: 'grid', gap: '0.5rem', height: '35em', overflow: 'auto'}}>
                                        {/* Sells section */}
                                        {sells.map((trade, index) => {
                                            const rowBg = getRowColor(trade.p, midPrice, isDarkTheme);
                                            return (
                                                <div key={`sell-${index}`}
                                                     style={{
                                                         display: 'grid',
                                                         gridTemplateColumns: '1fr 1fr 1fr',
                                                         padding: '0.2rem',
                                                         backgroundColor: rowBg,
                                                         borderRadius: '0px',
                                                     }}
                                                >
                                                    <div>{trade.p}</div>
                                                    <div>{trade.v}</div>
                                                    <div>{formatTime(trade.t)}</div>
                                                </div>
                                            );
                                        })}
                                        {/* Mid price divider */}
                                        <div ref={midPriceRef} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderTop: '2px solid #000',
                                            borderBottom: '2px solid #000',
                                            padding: '0.25rem',
                                            fontWeight: 'bold',
                                        }}>
                                            MID {midPrice.toFixed(2)}
                                        </div>
                                        {/* Buys section */}
                                        {buys.map((trade, index) => {
                                            const rowBg = getRowColor(trade.p, midPrice, isDarkTheme);
                                            return (
                                                <div key={`buy-${index}`}
                                                     style={{
                                                         display: 'grid',
                                                         gridTemplateColumns: '1fr 1fr 1fr',
                                                         padding: '0.25rem',
                                                         backgroundColor: rowBg,
                                                         borderRadius: '0px',
                                                     }}
                                                >
                                                    <div>{trade.p}</div>
                                                    <div>{trade.v}</div>
                                                    <div>{formatTime(trade.t)}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()
                        ) : (
                            <p>No trades available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotesComponent;
