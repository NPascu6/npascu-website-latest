import * as signalR from '@microsoft/signalr';
import { FinnhubQuoteDto } from '../models/market';
import { API_BASE_URL } from '../config';

export const connectQuotesHub = (
  onQuote: (symbol: string, quote: FinnhubQuoteDto) => void
) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/quotesHub`)
    .withAutomaticReconnect()
    .build();

  connection.on('ReceiveQuote', onQuote);
  return connection.start().then(() => connection);
};

export const connectMarketHub = (
  onUpdate: (symbol: string, data: unknown) => void
) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/market`)
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
