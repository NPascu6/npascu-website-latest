import { Quote, QuoteSchema } from '../api/schema';

export function subscribeQuotes(
  baseUrl: string,
  symbols: string[],
  onMessage: (quote: Quote) => void,
) {
  const url = new URL('/stream/quotes', baseUrl);
  if (symbols.length > 0) {
    url.searchParams.set('symbols', symbols.join(','));
  }
  const es = new EventSource(url.toString());
  es.onmessage = ev => {
    try {
      const data = JSON.parse(ev.data);
      const parsed = QuoteSchema.safeParse(data);
      if (parsed.success) {
        onMessage(parsed.data);
      }
    } catch {
      // ignore
    }
  };
  return () => es.close();
}
