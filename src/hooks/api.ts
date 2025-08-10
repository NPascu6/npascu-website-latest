import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.health.get(),
    staleTime: 60_000,
  });
}

export function useSearchSymbols(query: string) {
  return useQuery({
    queryKey: ['symbols', query],
    queryFn: () => apiClient.symbols.search(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 60,
  });
}
