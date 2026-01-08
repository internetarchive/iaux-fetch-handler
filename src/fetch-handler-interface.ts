import type { FetchOptions } from './fetch-options';
import type { RetryConfiguring } from './fetch-retry/configuration/retry-configuring';

export interface FetchHandlerInterface {
  /**
   * Generic fetch function that handles retries and common IA parameters like `reCache=1`
   *
   * @param input RequestInfo
   * @param options RequestInit | FetchOptions
   */
  fetch(
    request: RequestInfo,
    options?: RequestInit | FetchOptions,
  ): Promise<Response>;

  /**
   * A helper function to fetch a response from an API and get a JSON object
   *
   * @param path string
   * @param options?: { includeCredentials?: boolean }
   */
  fetchApiResponse<T>(
    url: string,
    options?: {
      includeCredentials?: boolean;
      method?: string;
      body?: BodyInit;
      headers?: HeadersInit;
      retryConfig?: RetryConfiguring;
    },
  ): Promise<T>;

  /**
   * A helper function to fetch a response from the IA API and get a JSON object
   *
   * This allows you to just pass the path to the API and get the response instead
   * of the full URL. If you need a full URL, use `fetchApiResponse` instead.
   *
   * @param path string
   * @param options?: { includeCredentials?: boolean, retryConfig?: RetryConfiguring }
   */
  fetchIAApiResponse<T>(
    path: string,
    options?: { includeCredentials?: boolean; retryConfig?: RetryConfiguring },
  ): Promise<T>;
}
