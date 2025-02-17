import React, {useEffect, useState} from 'react';
import * as signalR from '@microsoft/signalr';
import {RootState} from "../../store/store";
import {useSelector} from "react-redux";

// Define a TypeScript interface for the quote data.
export interface FinnhubQuote {
    c: number;  // current price
    h: number;  // high price
    l: number;  // low price
    o: number;  // open price
    pc: number; // previous close
    t: number;  // timestamp
}

// Create a type for a dictionary mapping a symbol to its quote.
interface Quotes {
    [symbol: string]: FinnhubQuote;
}

const QuotesComponent: React.FC = () => {
    const [quotes, setQuotes] = useState<Quotes>({});
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

    useEffect(() => {
        // Build the SignalR connection.
        const connection = new signalR.HubConnectionBuilder()
            .withUrl('https://npascu-api-v1.onrender.com/quotesHub')
            .withAutomaticReconnect()
            .build();

        // Start the connection.
        connection
            .start()
            .then(() => console.log('Connected to SignalR hub.'))
            .catch(err => console.error('Error connecting:', err));

        // Listen for "ReceiveQuote" events.
        connection.on('ReceiveQuote', (symbol: string, quote: FinnhubQuote) => {
            setQuotes(prevQuotes => ({
                ...prevQuotes,
                [symbol]: quote
            }));
        });

        // Cleanup the connection when the component unmounts.
        return () => {
            connection.stop().catch(err =>
                console.error('Error while stopping connection:', err)
            );
        };
    }, []);

    return (
        <div style={{
            height: "calc(100vh - 6rem)", overflow: "auto", backgroundColor: isDarkTheme ? "#1a1d24" : "#fff",
            color: isDarkTheme ? "#fff" : "#222",

        }}>
            <h1 className={"justify-self-center m-4 border-b-2"}>Live Quotes</h1>
            <ul className={"md:grid md:grid-cols-3 md:gap-4 sm:grid-cols-1"}>
                {Object.entries(quotes).map(([symbol, quote]) => (
                    <li className={"border-2 p-2"} key={symbol}>
                        <strong>{symbol}</strong>: Price {quote.c}, High {quote.h}, Low {quote.l}, Open {quote.o},
                        PrevClose {quote.pc}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuotesComponent;
