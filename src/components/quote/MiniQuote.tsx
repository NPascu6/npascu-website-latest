import React from 'react';
import {useMarketStream} from '../../hooks/useMarketStream';

interface Props {
  symbol: string;
}

const MiniQuote: React.FC<Props> = ({symbol}) => {
  const {quote, status} = useMarketStream(symbol, 1);
  if (!quote) return null;
  return (
    <div className="flex items-center space-x-2 text-sm">
      <span>{symbol}</span>
      <span className="font-bold">{quote.last.toFixed(2)}</span>
      <span className="text-green-500">{quote.bid.toFixed(2)}</span>
      <span className="text-red-500">{quote.ask.toFixed(2)}</span>
      {status !== 'connected' && <span className="text-yellow-500">{status}</span>}
    </div>
  );
};

export default MiniQuote;
