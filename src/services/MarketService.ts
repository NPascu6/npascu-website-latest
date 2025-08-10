import { apiClient } from './ApiClient';
import { FinnhubOrderBookDto, FinnhubQuoteDto, FinnhubTradeDto } from '../models/market';

class MarketService {
  getOrderBook(symbol: string, depth?: number) {
    return apiClient.get<FinnhubOrderBookDto>(`/api/OrderBook/${symbol}`, { depth });
  }

  getQuotes() {
    return apiClient.get<Record<string, FinnhubQuoteDto>>('/api/Quotes');
  }

  getQuote(symbol: string) {
    return apiClient.get<FinnhubQuoteDto>(`/api/Quotes/${symbol}`);
  }

  getSnapshot(symbol: string) {
    return apiClient.get<FinnhubQuoteDto>(`/api/Snapshot/${symbol}`);
  }

  getTrades(symbol: string, from: string, to: string, limit?: number) {
    return apiClient.get<FinnhubTradeDto[]>(`/api/Trades/${symbol}`, { from, to, limit });
  }

  healthCheck() {
    return apiClient.get<{ status: string }>('/health');
  }
}

export const marketService = new MarketService();
export default MarketService;
