import {
  FetchRetrier,
  FetchRetrierInterface,
} from './fetch-retry/fetch-retrier';
import type { FetchHandlerInterface } from './fetch-handler-interface';
import type { FetchOptions } from './fetch-options';
import type { RetryConfiguring } from './fetch-retry/configuration/retry-configuring';

/**
 * The FetchHandler adds some common helpers:
 * - retry the request if it fails
 * - add `reCache=1` to the request if it's in the current url so the backend sees it
 * - add convenience method for fetching/decoding an API response by just the path
 */
export class IaFetchHandler implements FetchHandlerInterface {
  private iaApiBaseUrl?: string;

  private fetchRetrier: FetchRetrierInterface = new FetchRetrier();

  private searchParams?: string;

  constructor(options?: {
    iaApiBaseUrl?: string;
    fetchRetrier?: FetchRetrierInterface;
    searchParams?: string;
    defaultRetryConfiguration?: RetryConfiguring;
  }) {
    if (options?.iaApiBaseUrl) this.iaApiBaseUrl = options.iaApiBaseUrl;
    if (options?.fetchRetrier) this.fetchRetrier = options.fetchRetrier;
    if (options?.searchParams) {
      this.searchParams = options.searchParams;
    } else {
      this.searchParams = window.location.search;
    }
  }

  /** @inheritdoc */
  async fetchIAApiResponse<T>(
    path: string,
    options?: {
      includeCredentials?: boolean;
      method?: string;
      body?: BodyInit;
      headers?: HeadersInit;
      retryConfig?: RetryConfiguring;
    },
  ): Promise<T> {
    const url = `${this.iaApiBaseUrl}${path}`;
    return this.fetchApiResponse(url, options);
  }

  /** @inheritdoc */
  async fetchApiResponse<T>(
    url: string,
    options?: {
      includeCredentials?: boolean;
      method?: string;
      body?: BodyInit;
      headers?: HeadersInit;
      retryConfig?: RetryConfiguring;
    },
  ): Promise<T> {
    const requestInit: RequestInit = {};
    if (options?.includeCredentials) requestInit.credentials = 'include';
    if (options?.method) requestInit.method = options.method;
    if (options?.body) requestInit.body = options.body;
    if (options?.headers) requestInit.headers = options.headers;
    const response = await this.fetch(url, {
      requestInit: requestInit,
      retryConfig: options?.retryConfig,
    });
    const json = await response.json();
    return json as T;
  }

  /** @inheritdoc */
  async fetch(
    request: RequestInfo,
    options?: RequestInit | FetchOptions,
  ): Promise<Response> {
    let finalRequest = request;
    const urlParams = new URLSearchParams(this.searchParams);
    if (urlParams.get('reCache') === '1') {
      const urlString = typeof request === 'string' ? request : request.url;
      finalRequest = this.addSearchParams(urlString, { reCache: '1' });
    }
    return this.fetchRetrier.fetchRetry(finalRequest, options);
  }

  /**
   * Since RequestInfo can be either a `Request` or `string`, we need to change
   * the way we add search params to it depending on the input.
   */
  private addSearchParams(
    urlString: string,
    params: Record<string, string>,
  ): string {
    const url = new URL(urlString, window.location.href);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    return url.href;
  }
}
