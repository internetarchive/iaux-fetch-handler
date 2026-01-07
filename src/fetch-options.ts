import type { RetryConfiguring } from './fetch-retry/fetch-retry-configuring';

export type FetchOptions = {
  requestInit?: RequestInit;
  retryConfig?: RetryConfiguring;
};
