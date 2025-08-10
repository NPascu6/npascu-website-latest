import { z } from 'zod';

export const QuoteSchema = z.object({
  symbol: z.string(),
  ts: z.coerce.date(),
  last: z.number().nullable(),
  bid: z.number().nullable(),
  ask: z.number().nullable(),
  volume: z.number().nullable().optional(),
  vwap: z.number().nullable().optional(),
  provider: z.string(),
  isDelayed: z.boolean(),
  meta: z.record(z.any()).optional(),
});
export type Quote = z.infer<typeof QuoteSchema>;

export const CandleSchema = z.object({
  symbol: z.string(),
  interval: z.enum(['1m','5m','15m','1h','1d']),
  ts: z.coerce.date(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number().nullable().optional(),
  provider: z.string(),
  meta: z.record(z.any()).optional(),
});
export type Candle = z.infer<typeof CandleSchema>;

export const SymbolSchema = z.object({
  symbol: z.string(),
  name: z.string().optional(),
  exchange: z.string().optional(),
});
export type SymbolLite = z.infer<typeof SymbolSchema>;

export const HealthSchema = z.object({ ok: z.boolean() });
export type Health = z.infer<typeof HealthSchema>;
