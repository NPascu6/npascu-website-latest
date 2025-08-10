import * as signalR from '@microsoft/signalr';
import { FinnhubQuoteDto } from '../models/market';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

export const connectQuotesHub = (
  onQuote: (symbol: string, quote: FinnhubQuoteDto) => void
) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/quotesHub`)
    .withAutomaticReconnect()
    .build();

  connection.on('ReceiveQuote', onQuote);
  return connection.start().then(() => connection);
};

export const connectMarketHub = (
  onUpdate: (symbol: string, data: unknown) => void
) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/hubs/market`)
    .withAutomaticReconnect()
    .build();

  connection.on('MarketUpdate', onUpdate);
  return connection.start().then(() => connection);
};

export const subscribe = (connection: signalR.HubConnection, symbol: string) => {
  return connection.invoke('Subscribe', symbol);
};

export const unsubscribe = (connection: signalR.HubConnection, symbol: string) => {
  return connection.invoke('Unsubscribe', symbol);
};
