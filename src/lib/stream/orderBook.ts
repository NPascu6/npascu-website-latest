export interface Level {
  price: number;
  size: number;
}

export interface OrderBook {
  bids: Level[];
  asks: Level[];
}

export interface BookUpdate {
  side: 'bid' | 'ask';
  price: number;
  size: number;
}

export function applyOrderBookUpdate(
  book: OrderBook,
  update: BookUpdate,
  depth: number,
): OrderBook {
  const copy: OrderBook = {
    bids: [...book.bids],
    asks: [...book.asks],
  };
  const sideLevels = update.side === 'bid' ? copy.bids : copy.asks;
  const comparator = update.side === 'bid'
    ? (a: Level, b: Level) => b.price - a.price
    : (a: Level, b: Level) => a.price - b.price;

  const idx = sideLevels.findIndex(l => l.price === update.price);

  if (update.size === 0) {
    if (idx !== -1) sideLevels.splice(idx, 1);
  } else {
    if (idx !== -1) {
      sideLevels[idx].size = update.size;
    } else {
      sideLevels.push({ price: update.price, size: update.size });
    }
    sideLevels.sort(comparator);
    if (sideLevels.length > depth) sideLevels.length = depth;
  }

  return copy;
}
