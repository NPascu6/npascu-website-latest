import React, {useEffect, useState} from 'react';
import * as signalR from '@microsoft/signalr';
import {RootState} from '../../store/store';
import {useSelector} from 'react-redux';

// Define a TypeScript interface for the quote data.
export interface FinnhubQuote {
    c: number;  // current price
    h: number;  // high price
    l: number;  // low price
    o: number;  // open price
    pc: number; // previous close
    t: number;  // timestamp
}

// We add an interface that wraps the quote with an "updated" flag.
interface QuoteData {
    quote: FinnhubQuote;
    updated: boolean;
}

// Type for dictionary mapping symbol to its QuoteData.
interface Quotes {
    [symbol: string]: QuoteData;
}

const blinkDuration = 500; // milliseconds

const QuotesComponent: React.FC = () => {
    const [quotes, setQuotes] = useState<Quotes>({});
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

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

                // Check if we have a previous quote and if any key has changed.
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
                    // First time we get data for this symbol.
                    updated = true;
                }

                const newData: QuoteData = {quote: newQuote, updated};

                // If updated, remove the flag after blinkDuration.
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

    // Inline styles for blinking effect.
    const quoteStyle = (updated: boolean): React.CSSProperties => ({
        transition: 'background-color 0.3s ease',
        backgroundColor: updated ? (isDarkTheme ? '#444' : '#ff0') : 'transparent'
    });

    return (
        <div
            style={{
                height: 'calc(100vh - 6rem)',
                overflow: 'auto',
                backgroundColor: isDarkTheme ? '#1a1d24' : '#fff',
                color: isDarkTheme ? '#fff' : '#222'
            }}
        >
            <h1 className="justify-self-center m-4 border-b-2">Live Quotes</h1>
            <ul className="md:grid md:grid-cols-3 md:gap-4 sm:grid-cols-1">
                {Object.entries(quotes).map(([symbol, data]) => (
                    <li
                        key={symbol}
                        className="border-2 p-2"
                        style={quoteStyle(data.updated)}
                    >
                        <strong>{symbol}</strong>: Price {data.quote.c}, High {data.quote.h}, Low {data.quote.l},
                        Open {data.quote.o}, PrevClose {data.quote.pc}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuotesComponent;
