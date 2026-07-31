import type { RetryConfiguring } from './fetch-retry/configuration/retry-configuring';

/**
 * Base fetch options for FetchHandler
 */
export type FetchOptions = {
  requestInit?: RequestInit;
  retryConfig?: RetryConfiguring;
  /**
   * Set to opt this request into an automatic `X-CSRF-Token` header (when
   * the FetchHandler was constructed with a `getCsrfToken` source). Off by
   * default — only opt in once the target endpoint's CORS policy is known
   * to allow-list that header.
   */
  includeCsrfToken?: boolean;
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
  /**
   * Set to opt this request into an automatic `X-CSRF-Token` header (when
   * the FetchHandler was constructed with a `getCsrfToken` source). Off by
   * default — only opt in once the target endpoint's CORS policy is known
   * to allow-list that header.
   */
  includeCsrfToken?: boolean;
};
