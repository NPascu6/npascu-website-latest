import { createApiClient } from './client';

const baseUrl = import.meta.env.VITE_API_KEY as string;

export const apiClient = createApiClient(baseUrl);

export * from './schema';
export * from './client';
