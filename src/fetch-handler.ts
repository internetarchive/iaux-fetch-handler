import {
  FetchRetrier,
  FetchRetrierInterface,
} from './fetch-retry/fetch-retrier';
import type { FetchHandlerInterface } from './fetch-handler-interface';
import type { ApiFetchOptions, FetchOptions } from './fetch-options';

export type FetchHandlerConstructorOptions = {
  /** @deprecated Use `apiBaseUrl` instead. */
  iaApiBaseUrl?: string;
  apiBaseUrl?: string;
  fetchRetrier?: FetchRetrierInterface;
  searchParams?: string;
};

/**
 * The FetchHandler adds some common helpers:
 * - retry the request if it fails
 * - add `reCache=1` to the request if it's in the current url so the backend sees it
 * - add convenience method for fetching/decoding an API response by just the path
 */
export class FetchHandler implements FetchHandlerInterface {
  private apiBaseUrl: string = '';

  private fetchRetrier: FetchRetrierInterface = new FetchRetrier();

  private searchParams?: string;

  constructor(options?: FetchHandlerConstructorOptions) {
    if (options?.apiBaseUrl) {
      this.apiBaseUrl = options.apiBaseUrl;
    } else if (options?.iaApiBaseUrl) {
      this.apiBaseUrl = options.iaApiBaseUrl;
    }
    if (options?.fetchRetrier) this.fetchRetrier = options.fetchRetrier;
    if (options?.searchParams) {
      this.searchParams = options.searchParams;
    } else {
      this.searchParams = window.location.search;
    }
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

  /** @inheritdoc */
  async fetchApiResponse<T>(
    url: string,
    options?: ApiFetchOptions,
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
  async fetchApiPathResponse<T>(
    path: string,
    options?: ApiFetchOptions,
  ): Promise<T> {
    const url = `${this.apiBaseUrl}${path}`;
    return this.fetchApiResponse(url, options);
  }

  /** @inheritdoc */
  async fetchIAApiResponse<T>(
    path: string,
    options?: ApiFetchOptions,
  ): Promise<T> {
    return this.fetchApiPathResponse(path, options);
  }

  /**
   * Construct a new URL with the given search params added
   *
   * @param urlString - Original URL string
   * @param params - Params to add
   * @returns New URL string with params added
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

/**
 * Backwards compatibility class
 *
 * @deprecated Use `FetchHandler` instead.
 */
export class IaFetchHandler extends FetchHandler {
  constructor(options?: {
    iaApiBaseUrl?: string;
    apiBaseUrl?: string;
    fetchRetrier?: FetchRetrierInterface;
    searchParams?: string;
  }) {
    const superOptions = { ...options };
    superOptions.iaApiBaseUrl = options?.iaApiBaseUrl ?? 'https://archive.org';
    super(superOptions);
  }
}
