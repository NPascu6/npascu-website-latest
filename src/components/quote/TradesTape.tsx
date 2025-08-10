import React from 'react';
import {useMarketStream} from '../../hooks/useMarketStream';

interface Props {
  symbol: string;
}

const TradesTape: React.FC<Props> = ({symbol}) => {
  const {trades} = useMarketStream(symbol, 10);
  return (
    <ul className="text-xs max-h-64 overflow-y-auto">
      {trades.map((t, i) => (
        <li key={i} className={t.side === 'buy' ? 'text-green-600' : 'text-red-600'}>
          {new Date(t.ts).toLocaleTimeString()} {t.price.toFixed(2)} ({t.size.toFixed(2)})
        </li>
      ))}
    </ul>
  );
};

export default TradesTape;
