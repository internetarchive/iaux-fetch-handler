import type { RetryConfiguring } from './fetch-retry/configuration/retry-configuring';

/**
 * Base fetch options for FetchHandler
 */
export type FetchOptions = {
  requestInit?: RequestInit;
  retryConfig?: RetryConfiguring;
};

/**
 * A convenience type for FetchHandler methods with common API fetch options.
 */
export type ApiFetchOptions = {
  includeCredentials?: boolean;
  method?: string;
  body?: BodyInit;
  headers?: HeadersInit;
  retryConfig?: RetryConfiguring;
};
