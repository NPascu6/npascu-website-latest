import {useEffect, useRef, useState} from 'react';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {applyOrderBookUpdate, OrderBook, BookUpdate} from '../lib/stream/orderBook';

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
    const base = import.meta.env.VITE_API_BASE;

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

    const conn = new HubConnectionBuilder()
      .withUrl(`${base}/hubs/market`)
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

    conn.on('tradeTick', (t: Trade) => {
      setState(prev => ({
        ...prev,
        trades: [t, ...prev.trades].slice(0, 100),
      }));
    });

    conn.on('snapshot', (q: Quote) => {
      setState(prev => ({...prev, quote: q}));
    });

    conn.onreconnecting(() => setState(prev => ({...prev, status: 'reconnecting'})));
    conn.onreconnected(() => {
      setState(prev => ({...prev, status: 'connected'}));
      conn.invoke('subscribe', symbol).catch(() => {});
    });
    conn.onclose(() => setState(prev => ({...prev, status: 'disconnected'})));

    setState(prev => ({...prev, status: 'connecting'}));
    conn.start()
      .then(() => {
        if (cancelled) return;
        setState(prev => ({...prev, status: 'connected'}));
        conn.invoke('subscribe', symbol).catch(() => {});
      })
      .catch(err => console.error('connection error', err));

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (connRef.current) {
        connRef.current.invoke('unsubscribe', symbol).catch(() => {});
        connRef.current.stop().catch(() => {});
      }
    };
  }, [symbol, depth]);

  return state;
}
