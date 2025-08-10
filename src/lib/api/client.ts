import { ZodSchema } from 'zod';
import {
  Candle,
  CandleSchema,
  Health,
  HealthSchema,
  Quote,
  QuoteSchema,
  SymbolLite,
  SymbolSchema,
} from './schema';

export interface ApiClient {
  health: { get: () => Promise<Health> };
  symbols: { search: (query: string) => Promise<SymbolLite[]> };
  quotes: { get: (symbol: string) => Promise<Quote> };
  candles: {
    get: (
      symbol: string,
      interval: '1m' | '5m' | '15m' | '1h' | '1d',
      from: Date,
      to: Date,
    ) => Promise<Candle[]>;
  };
}

export function createApiClient(baseURL: string, fetchImpl: typeof fetch = fetch): ApiClient {
  const request = async <T>(
    path: string,
    schema: ZodSchema<T>,
    init?: RequestInit,
  ): Promise<T> => {
    let attempt = 0;
    let delay = 500;
    while (true) {
      const res = await fetchImpl(`${baseURL}${path}`, init);
      if (res.ok) {
        const json = await res.json();
        return schema.parse(json);
      }
      if ((res.status === 429 || res.status >= 500) && attempt < 3) {
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
        attempt++;
        continue;
      }
      throw new Error(`Request failed: ${res.status}`);
    }
  };

  return {
    health: {
      get: () => request('/healthz', HealthSchema),
    },
    symbols: {
      search: (query: string) =>
        request(`/symbols?query=${encodeURIComponent(query)}`, SymbolSchema.array()),
    },
    quotes: {
      get: (symbol: string) => request(`/quotes/${encodeURIComponent(symbol)}`, QuoteSchema),
    },
    candles: {
      get: (symbol, interval, from, to) => {
        const params = new URLSearchParams({
          interval,
          from: from.toISOString(),
          to: to.toISOString(),
        });
        return request(`/candles/${encodeURIComponent(symbol)}?${params.toString()}`, CandleSchema.array());
      },
    },
  };
}
