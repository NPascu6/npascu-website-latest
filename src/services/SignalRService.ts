import * as signalR from '@microsoft/signalr';
import { FinnhubQuoteDto } from '../models/market';
import { API_BASE_URL } from '../config';

export const connectQuotesHub = (
  onQuote: (symbol: string, quote: FinnhubQuoteDto) => void
) => {
  const quotesHubUrl = new URL('quotesHub', API_BASE_URL).toString();
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(quotesHubUrl)
    .withAutomaticReconnect()
    .build();

  connection.on('ReceiveQuote', onQuote);
  return connection.start().then(() => connection);
};

export const connectMarketHub = (
  onUpdate: (symbol: string, data: unknown) => void
) => {
  const marketHubUrl = new URL('hubs/market', API_BASE_URL).toString();
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(marketHubUrl)
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
