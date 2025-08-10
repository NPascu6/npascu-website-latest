import {describe, it, expect} from 'vitest';
import {applyOrderBookUpdate, OrderBook} from '../../lib/stream/orderBook';

describe('applyOrderBookUpdate', () => {
  const empty: OrderBook = {bids: [], asks: []};

  it('adds a new bid and sorts descending', () => {
    const book = applyOrderBookUpdate(empty, {side:'bid', price:100, size:1}, 10);
    const book2 = applyOrderBookUpdate(book, {side:'bid', price:101, size:2}, 10);
    expect(book2.bids.map(b=>b.price)).toEqual([101,100]);
  });

  it('updates size for existing level', () => {
    const book = applyOrderBookUpdate(empty, {side:'ask', price:200, size:1}, 10);
    const book2 = applyOrderBookUpdate(book, {side:'ask', price:200, size:3}, 10);
    expect(book2.asks[0].size).toBe(3);
  });

  it('removes level when size is zero', () => {
    const book = applyOrderBookUpdate(empty, {side:'bid', price:100, size:1}, 10);
    const book2 = applyOrderBookUpdate(book, {side:'bid', price:100, size:0}, 10);
    expect(book2.bids.length).toBe(0);
  });

  it('caps depth', () => {
    let book: OrderBook = {bids: [], asks: []};
    for(let i=0;i<5;i++){
      book = applyOrderBookUpdate(book,{side:'bid',price:100-i,size:1},3);
    }
    expect(book.bids.length).toBe(3);
    expect(book.bids[0].price).toBe(100);
  });
});
