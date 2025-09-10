import React, {useMemo} from 'react';
import {FinnhubTrade} from './types';

interface Props {
  symbol: string;
  trades: FinnhubTrade[];
  midPrice: number;
  depth?: number;
  isDarkTheme: boolean;
}

interface Level {
  price: number;
  size: number;
}

const buildBook = (
  trades: FinnhubTrade[],
  midPrice: number,
  depth: number,
): {bids: Level[]; asks: Level[]} => {
  const bids = new Map<number, number>();
  const asks = new Map<number, number>();
  for (const t of trades) {
    const side = t.side ?? (t.p >= midPrice ? 'ask' : 'bid');
    const map = side === 'bid' ? bids : asks;
    map.set(t.p, (map.get(t.p) || 0) + t.v);
  }
  const bidLevels: Level[] = Array.from(bids.entries())
    .sort((a, b) => b[0] - a[0])
    .slice(0, depth)
    .map(([price, size]) => ({price, size}));
  const askLevels: Level[] = Array.from(asks.entries())
    .sort((a, b) => a[0] - b[0])
    .slice(0, depth)
    .map(([price, size]) => ({price, size}));
  return {bids: bidLevels, asks: askLevels};
};

const OrderBook: React.FC<Props> = ({
  symbol,
  trades,
  midPrice,
  depth = 50,
  isDarkTheme,
}) => {
  const book = useMemo(() => buildBook(trades, midPrice, depth), [
    trades,
    midPrice,
    depth,
  ]);
  const bidDecimals = 4;
  const askDecimals = 4;
  const maxVol = Math.max(
    ...book.bids.map(b => b.size),
    ...book.asks.map(a => a.size),
    1,
  );
  const getRowColor = (
    size: number,
    max: number,
    isAsk: boolean,
  ) => {
    const ratio = size / max;
    const adjusted = ratio * ratio;
    const base = isDarkTheme ? 60 : 80;
    const delta = isDarkTheme ? 40 : 50;
    const hue = isAsk ? 120 : 0;
    const light = base - adjusted * delta;
    return `hsl(${hue},100%,${light}%)`;
  };

  return (
    <div>
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-x-0 top-0 bottom-1/2 overflow-y-auto flex flex-col-reverse">
          {book.asks.slice().reverse().map((l, i) => (
            <div
              key={`ask-${l.price}-${i}`}
              className={`grid grid-cols-2 p-1 ${isDarkTheme ? 'text-white' : 'text-black'}`}
              style={{backgroundColor: getRowColor(l.size, maxVol, true)}}
            >
              <div>{l.price.toFixed(askDecimals)}</div>
              <div className="text-right">{l.size.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-20 text-center text-stone-950 dark:text-white bg-white dark:bg-gray-800 bg-opacity-90 border-t-2 border-b-2 border-gray-400 py-2 font-bold">
          {symbol}
        </div>
        <div className="absolute inset-x-0 top-[calc(50%+1rem)] bottom-0 overflow-y-auto flex flex-col">
          {book.bids.map((l, i) => (
            <div
              key={`bid-${l.price}-${i}`}
              className={`grid grid-cols-2 p-1 ${isDarkTheme ? 'text-white' : 'text-black'}`}
              style={{backgroundColor: getRowColor(l.size, maxVol, false)}}
            >
              <div>{l.price.toFixed(bidDecimals)}</div>
              <div className="text-right">{l.size.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
