import React from 'react';
import {useMarketStream} from '../../hooks/useMarketStream';

interface Props {
  symbol: string;
  depth: number;
  isDarkTheme: boolean;
}

const OrderBook: React.FC<Props> = ({symbol, depth, isDarkTheme}) => {
  const {book, status} = useMarketStream(symbol, depth);

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
      {status !== 'connected' && (
        <div className="text-xs text-yellow-500 mb-2">Live • {status}</div>
      )}
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
