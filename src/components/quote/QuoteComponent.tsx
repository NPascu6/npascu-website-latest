import React, {useEffect, useState} from 'react';
import * as signalR from '@microsoft/signalr';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

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

// Available symbols – 6 from Binance and 5 from Coinbase (or any other venue).
const availableSymbols = [
    "BINANCE:BTCUSDT",
    "BINANCE:ETHUSDT",
    "BINANCE:XRPUSDT",
    "BINANCE:BNBUSDT",
    "BINANCE:ADAUSDT",
    "BINANCE:SOLUSDT",
    "COINBASE:BTCUSD",
    "COINBASE:ETHUSD",
    "COINBASE:XRPUSD",
    "COINBASE:ADAUSD",
    "COINBASE:SOLUSD"
];

const QuotesComponent: React.FC = () => {
    const [quotes, setQuotes] = useState<Quotes>({});
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

    // Initialize selected symbols to all available on mount.
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

    // Handler for dropdown selection change.
    const handleSymbolSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedSymbols(selected);
    };

    // Inline style for blinking effect.
    const quoteStyle = (updated: boolean): React.CSSProperties => ({
        transition: 'background-color 0.3s ease',
        backgroundColor: updated ? (isDarkTheme ? '#444' : '#ff0') : 'transparent',
        padding: '0.5rem',
        borderRadius: '4px'
    });

    return (
        <div
            style={{
                height: "calc(100vh - 6rem)",
                overflowY: "auto",
                backgroundColor: isDarkTheme ? "#1a1d24" : "#fff",
                color: isDarkTheme ? "#fff" : "#222",
                padding: "1rem"
            }}
        >
            <h1 className="m-4 border-b-2">Live Quotes</h1>
            <div style={{marginBottom: '1rem'}}>
                <label htmlFor="symbolSelect" style={{marginRight: '0.5rem'}}>Select symbols:</label>
                <select
                    id="symbolSelect"
                    multiple
                    value={selectedSymbols}
                    onChange={handleSymbolSelectionChange}
                    style={{minWidth: '300px', padding: '0.5rem'}}
                >
                    {availableSymbols.map(symbol => (
                        <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                </select>
            </div>
            <ul
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem',
                    listStyle: 'none',
                    padding: 0
                }}
            >
                {Object.entries(quotes)
                    .filter(([symbol]) => selectedSymbols.includes(symbol))
                    .map(([symbol, data]) => (
                        <li key={symbol} style={{...quoteStyle(data.updated), border: '1px solid #ccc'}}>
                            <strong>{symbol}</strong>: <br/>
                            Price: {data.quote.c} <br/>
                            High: {data.quote.h} <br/>
                            Low: {data.quote.l} <br/>
                            Open: {data.quote.o} <br/>
                            PrevClose: {data.quote.pc} <br/>
                            <small>{new Date(data.quote.t * 1000).toLocaleTimeString()}</small>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default QuotesComponent;
