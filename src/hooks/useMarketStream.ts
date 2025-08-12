import {useEffect, useRef, useState} from 'react';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {applyOrderBookUpdate, OrderBook, BookUpdate} from '../lib/stream/orderBook';
import { API_BASE_URL } from '../config';

export interface Trade {
  price: number;
  size: number;
  side: 'buy' | 'sell';
  ts: number;
}

export interface Quote {
  bid: number;
  ask: number;
  last: number;
  percent?: number;
}

interface MarketState {
  book: OrderBook;
  trades: Trade[];
  quote: Quote | null;
  status: 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
}

export function useMarketStream(symbol?: string, depth = 10): MarketState {
  const [state, setState] = useState<MarketState>({
    book: {bids: [], asks: []},
    trades: [],
    quote: null,
    status: 'idle',
  });
  const connRef = useRef<HubConnection | null>(null);
  const queueRef = useRef<BookUpdate[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    // Use the same base URL as the rest of the app so the websocket and REST
    // requests point to the backend API.
    const base = API_BASE_URL;

    async function seed() {
      try {
        const [snapRes, bookRes] = await Promise.all([
          fetch(`${base}/api/snapshot/${symbol}`),
          fetch(`${base}/api/orderbook/${symbol}?depth=${depth}`),
        ]);
        if (cancelled) return;
        const snapJson = await snapRes.json();
        const bookJson = await bookRes.json();
        setState(prev => ({
          ...prev,
          book: {bids: bookJson.bids ?? [], asks: bookJson.asks ?? []},
          quote: snapJson ?? null,
        }));
      } catch (err) {
        console.error('seed error', err);
      }
    }
    seed();

    const marketHubUrl = new URL('hubs/market', base).toString();
    const conn = new HubConnectionBuilder()
      .withUrl(marketHubUrl)
      .withAutomaticReconnect()
      .build();
    connRef.current = conn;

    const flush = () => {
      const updates = queueRef.current.splice(0);
      if (updates.length === 0) return;
      setState(prev => {
        let book = prev.book;
        for (const u of updates) {
          book = applyOrderBookUpdate(book, u, depth);
        }
        return {...prev, book};
      });
      rafRef.current = null;
    };

    conn.on('orderBookUpdate', (u: BookUpdate | BookUpdate[]) => {
      const arr = Array.isArray(u) ? u : [u];
      queueRef.current.push(...arr);
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flush);
      }
    });

    // Backend emits trade ticks via the "ReceiveTrade" event and provides the
    // raw Finnhub trade structure.  Map it into our Trade interface and derive
    // the side based on the previous trade price so the UI can colour buys and
    // sells correctly.
    conn.on('ReceiveTrade', (_sym: string, t: {p: number; v: number; t: number}) => {
      setState(prev => {
        const last = prev.trades[0];
        const side: 'buy' | 'sell' = last && last.price > t.p ? 'sell' : 'buy';
        const trade: Trade = {price: t.p, size: t.v, side, ts: t.t};
        return {
          ...prev,
          trades: [trade, ...prev.trades].slice(0, 100),
        };
      });
    });

    // Quote updates are sent as "ReceiveQuote" events.  Convert the Finnhub
    // quote format into the simplified Quote used by the hook.
    conn.on('ReceiveQuote', (_sym: string, q: {c: number; dp?: number}) => {
      const quote: Quote = {
        bid: q.c,
        ask: q.c,
        last: q.c,
        percent: q.dp,
      };
      setState(prev => ({...prev, quote}));
    });

    conn.onreconnecting(() =>
      setState(prev => ({...prev, status: 'reconnecting'})),
    );
    conn.onreconnected(() => {
      setState(prev => ({...prev, status: 'connected'}));
      conn.invoke('Subscribe', symbol).catch(() => {});
    });
    conn.onclose(() => setState(prev => ({...prev, status: 'disconnected'})));

    setState(prev => ({...prev, status: 'connecting'}));
    conn.start()
      .then(() => {
        if (cancelled) return;
        setState(prev => ({...prev, status: 'connected'}));
        conn.invoke('Subscribe', symbol).catch(() => {});
      })
      .catch(err => console.error('connection error', err));

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (connRef.current) {
        connRef.current.invoke('Unsubscribe', symbol).catch(() => {});
        connRef.current.stop().catch(() => {});
      }
    };
  }, [symbol, depth]);

  return state;
}
