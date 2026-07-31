import {
  FetchRetrier,
  FetchRetrierInterface,
} from './fetch-retry/fetch-retrier';
import { legacyArgsAsFetchOptions } from './fetch-retry/legacy-args';
import type { FetchHandlerInterface } from './fetch-handler-interface';
import type { ApiFetchOptions, FetchOptions } from './fetch-options';

export type FetchHandlerConstructorOptions = {
  /** @deprecated Use `apiBaseUrl` instead. */
  iaApiBaseUrl?: string;
  apiBaseUrl?: string;
  fetchRetrier?: FetchRetrierInterface;
  searchParams?: string;
  /**
   * Optional CSRF token source. When provided, callers can opt individual
   * `POST`/`PUT`/`DELETE` requests into an automatic `X-CSRF-Token` header
   * by passing `requireCsrfToken: true` (see `ApiFetchOptions`/
   * `FetchOptions`). Requests that don't opt in are unaffected — this is
   * off by default because not every backend endpoint's CORS policy
   * allow-lists that header yet.
   */
  getCsrfToken?: () => Promise<string>;
};

const METHODS_REQUIRING_CSRF_TOKEN = new Set(['POST', 'PUT', 'DELETE']);

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

  private getCsrfToken?: () => Promise<string>;

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
    if (options?.getCsrfToken) this.getCsrfToken = options.getCsrfToken;
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
    const finalOptions = await this.withCsrfToken(finalRequest, options);
    return this.fetchRetrier.fetchRetry(finalRequest, finalOptions);
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
    const headers = new Headers({ Accept: 'application/json' });
    if (options?.headers) {
      new Headers(options.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }
    requestInit.headers = headers;
    const response = await this.fetch(url, {
      requestInit: requestInit,
      retryConfig: options?.retryConfig,
      requireCsrfToken: options?.requireCsrfToken,
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
   * If a CSRF token source was configured, the caller opted in via
   * `requireCsrfToken: true`, and the request method needs one, resolve the
   * token and attach it as an `X-CSRF-Token` header. Off by default: not
   * every backend endpoint's CORS policy allow-lists that header yet, so
   * each caller opts in only once its endpoint is known to support it.
   * Requests that already carry that header are left untouched.
   *
   * @param request - The request being made, used to infer the method
   * @param options - The options passed in to `fetch`
   * @returns Options with the CSRF header attached, or the original options
   */
  private async withCsrfToken(
    request: RequestInfo,
    options?: RequestInit | FetchOptions,
  ): Promise<RequestInit | FetchOptions | undefined> {
    if (!this.getCsrfToken) return options;

    const fetchOptions = legacyArgsAsFetchOptions(options) ?? {};
    if (!fetchOptions.requireCsrfToken) return options;

    const requestInit = fetchOptions.requestInit ?? {};
    const method = (
      requestInit.method ??
      (typeof request !== 'string' ? request.method : undefined) ??
      'GET'
    ).toUpperCase();
    if (!METHODS_REQUIRING_CSRF_TOKEN.has(method)) return options;

    const headers = new Headers(requestInit.headers);
    if (headers.has('X-CSRF-Token')) return options;
    headers.set('X-CSRF-Token', await this.getCsrfToken());

    return {
      ...fetchOptions,
      requestInit: { ...requestInit, headers },
    };
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
  constructor(options?: FetchHandlerConstructorOptions) {
    const superOptions = { ...options };
    superOptions.iaApiBaseUrl = options?.iaApiBaseUrl ?? 'https://archive.org';
    super(superOptions);
  }
}
