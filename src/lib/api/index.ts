import { createApiClient } from './client';
import { API_BASE_URL } from '../../config';

export const apiClient = createApiClient(API_BASE_URL);

export * from './schema';
export * from './client';
