import { describe, it, expect } from 'vitest';
import { QuoteSchema, CandleSchema, HealthSchema } from '../../lib/api/schema';

describe('api schemas', () => {
  it('parses quote', () => {
    const data = {
      symbol: 'AAPL',
      ts: new Date().toISOString(),
      last: 100,
      bid: 99,
      ask: 101,
      provider: 'test',
      isDelayed: false,
    };
    const quote = QuoteSchema.parse(data);
    expect(quote.symbol).toBe('AAPL');
  });

  it('parses candle', () => {
    const data = {
      symbol: 'AAPL',
      interval: '1d',
      ts: new Date().toISOString(),
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      provider: 'test',
    };
    const candle = CandleSchema.parse(data);
    expect(candle.interval).toBe('1d');
  });

  it('parses health', () => {
    const health = HealthSchema.parse({ ok: true });
    expect(health.ok).toBe(true);
  });
});
