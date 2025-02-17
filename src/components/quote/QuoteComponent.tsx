import React, {useEffect, useState} from 'react';
import * as signalR from '@microsoft/signalr';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {Link, useLocation} from 'react-router-dom';
import CollapsableSection from "../common/CollapsableSection";

// Define a TypeScript interface for the quote data.
export interface FinnhubQuote {
    c: number;  // current price
    h: number;  // high price
    l: number;  // low price
    o: number;  // open price
    pc: number; // previous close
    t: number;  // timestamp (in seconds)
}

// Wrap the quote with an "updated" flag.
interface QuoteData {
    quote: FinnhubQuote;
    updated: boolean;
}

// Dictionary type for quotes.
interface Quotes {
    [symbol: string]: QuoteData;
}

// Duration for the blink effect (in milliseconds)
const blinkDuration = 500;

// Mapping of symbols to emojis.
const symbolEmojis: { [symbol: string]: string } = {
    "BINANCE:BTCUSDT": "₿",
    "BINANCE:ETHUSDT": "⚡",
    "BINANCE:XRPUSDT": "🚀",
    "BINANCE:BNBUSDT": "🔵",
    "BINANCE:ADAUSDT": "🧡",
    "BINANCE:SOLUSDT": "🌞",
    "OANDA:EUR_USD": "€/$",
    "OANDA:GBP_USD": "£/$",
    "OANDA:USD_JPY": "$/¥",
    "OANDA:USD_CHF": "$/CHF",
    "OANDA:EUR_CHF": "€ / CHF"
};

// Available symbols – 6 Binance pairs and 5 OANDA Forex pairs.
export const availableSymbols = [
    "BINANCE:BTCUSDT",
    "BINANCE:ETHUSDT",
    "BINANCE:XRPUSDT",
    "BINANCE:BNBUSDT",
    "BINANCE:ADAUSDT",
    "BINANCE:SOLUSDT",
    "OANDA:EUR_USD",
    "OANDA:GBP_USD",
    "OANDA:USD_JPY",
    "OANDA:USD_CHF",
    "OANDA:EUR_CHF"
];

const QuotesComponent: React.FC = () => {
    const [quotes, setQuotes] = useState<Quotes>({});
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const location = useLocation();

    // On mount, select all available symbols.
    useEffect(() => {
        setSelectedSymbols(availableSymbols);
    }, []);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl('https://npascu-api-v1.onrender.com/quotesHub')
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => console.log('Connected to SignalR hub.'))
            .catch(err => console.error('Error connecting:', err));

        connection.on('ReceiveQuote', (symbol: string, newQuote: FinnhubQuote) => {
            setQuotes(prev => {
                const prevData = prev[symbol];
                let updated = false;
                if (prevData) {
                    if (
                        prevData.quote.c !== newQuote.c ||
                        prevData.quote.h !== newQuote.h ||
                        prevData.quote.l !== newQuote.l ||
                        prevData.quote.o !== newQuote.o ||
                        prevData.quote.pc !== newQuote.pc ||
                        prevData.quote.t !== newQuote.t
                    ) {
                        updated = true;
                    }
                } else {
                    updated = true;
                }
                const newData: QuoteData = {quote: newQuote, updated};
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

        return () => {
            connection.stop().catch(err =>
                console.error('Error while stopping connection:', err)
            );
        };
    }, []);

    // Toggle a symbol in the checkbox list.
    const handleCheckboxChange = (symbol: string) => {
        setSelectedSymbols(prev => {
            if (prev.includes(symbol)) {
                return prev.filter(s => s !== symbol);
            } else {
                return [...prev, symbol];
            }
        });
    };

    // Handler for "Select All" button.
    const handleSelectAll = () => {
        if (availableSymbols.length === selectedSymbols.length) {
            setSelectedSymbols([]);
        } else {
            setSelectedSymbols([...availableSymbols]);
        }
    };

    // Inline style for blinking effect on quote items.
    const quoteStyle = (updated: boolean): React.CSSProperties => ({
        transition: 'background-color 0.3s ease',
        backgroundColor: updated ? (isDarkTheme ? '#555' : '#ff0') : 'transparent',
        padding: '0.5rem',
        borderRadius: '4px',
        position: 'relative'
    });

    // Styling for checkbox labels.
    const checkboxLabelStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.5rem',
        color: isDarkTheme ? '#fff' : '#222'
    };

    // Loader flag.
    const isLoading = Object.keys(quotes).length === 0;

    return (
        <div
            style={{
                minHeight: "calc(100vh - 6rem)",
                overflowY: "auto",
                backgroundColor: isDarkTheme ? "#1a1d24" : "#fff",
                color: isDarkTheme ? "#fff" : "#222",
                padding: "0.3rem"
            }}
        >
            {/* Navigation "X" button to go to root */}
            {location.pathname !== "/" && <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Link to="/" style={{fontSize: '2rem', textDecoration: 'none', color: isDarkTheme ? '#fff' : '#222'}}>
                    ×
                </Link>
            </div>}

            {/* Checkbox list for symbol selection */}
            <div style={{marginBottom: '1rem', width: '100%'}}>
                <CollapsableSection title={"Symbols"}>
                    <div style={{
                        display: 'grid',
                        flexWrap: 'wrap',
                        gap: '0.75rem', height: '14em', overflowY: 'auto'
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
                <div style={{textAlign: 'center', padding: '2rem'}}>Loading quotes...</div>
            ) : (
                <ul
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        listStyle: 'none',
                        padding: 0
                    }}
                >
                    {Object.entries(quotes)
                        .filter(([symbol]) => selectedSymbols.includes(symbol))
                        .map(([symbol, data]) => (
                            <li key={symbol} style={{...quoteStyle(data.updated), border: '1px solid #ccc'}}>
                                {/* "Close" button on the card */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '0.25rem',
                                        right: '0.25rem',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        color: isDarkTheme ? '#fff' : '#222'
                                    }}
                                    onClick={() => handleCheckboxChange(symbol)}
                                >
                                    ×
                                </div>
                                <strong>{symbolEmojis[symbol] ? `${symbolEmojis[symbol]} ${symbol}` : symbol}</strong>: <br/>
                                Price: {data.quote.c} <br/>
                                High: {data.quote.h} <br/>
                                Low: {data.quote.l} <br/>
                                Open: {data.quote.o} <br/>
                                PrevClose: {data.quote.pc} <br/>
                                <small>{new Date(data.quote.t * 1000).toLocaleTimeString()}</small>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default QuotesComponent;
