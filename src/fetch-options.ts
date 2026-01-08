import type { RetryConfiguring } from './fetch-retry/configuration/retry-configuring';

export type FetchOptions = {
  requestInit?: RequestInit;
  retryConfig?: RetryConfiguring;
};
