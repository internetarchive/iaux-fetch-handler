import {
  FetchRetrier,
  FetchRetrierInterface,
} from './fetch-retry/fetch-retrier';
import { legacyArgsAsFetchOptions } from './fetch-retry/legacy-args';
import type { FetchHandlerInterface } from './fetch-handler-interface';
import type {
  ApiFetchOptions,
  FetchOptions,
  QueryParams,
  QueryParamsProvider,
} from './fetch-options';

export type FetchHandlerConstructorOptions = {
  /** @deprecated Use `apiBaseUrl` instead. */
  iaApiBaseUrl?: string;
  apiBaseUrl?: string;
  fetchRetrier?: FetchRetrierInterface;
  /**
   * Query params merged into the URL of every request this handler makes.
   * Pass a function to scope them to certain urls.
   *
   * This is how a host forwards its own ambient params, such as putting
   * `reCache=1` on API calls when the page it's running on was loaded with
   * `reCache=1`. The library has no opinion about which params those are.
   */
  queryParams?: QueryParamsProvider;
  /**
   * Optional CSRF token source. When provided, callers can opt individual
   * `POST`/`PUT`/`DELETE` requests into an automatic `X-CSRF-Token` header
   * by passing `includeCsrfToken: true` (see `ApiFetchOptions`/
   * `FetchOptions`). Requests that don't opt in are unaffected — this is
   * off by default because not every backend endpoint's CORS policy
   * allow-lists that header yet.
   */
  getCsrfToken?: () => Promise<string>;
};

const METHODS_REQUIRING_CSRF_TOKEN = new Set([
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
]);

/**
 * The FetchHandler adds some common helpers:
 * - retry the request if it fails
 * - merge query params into the request URL, per request or for every request
 *   the handler makes
 * - add convenience method for fetching/decoding an API response by just the path
 */
export class FetchHandler implements FetchHandlerInterface {
  private apiBaseUrl: string = '';

  private fetchRetrier: FetchRetrierInterface = new FetchRetrier();

  private queryParams?: QueryParamsProvider;

  private getCsrfToken?: () => Promise<string>;

  constructor(options?: FetchHandlerConstructorOptions) {
    if (options?.apiBaseUrl) {
      this.apiBaseUrl = options.apiBaseUrl;
    } else if (options?.iaApiBaseUrl) {
      this.apiBaseUrl = options.iaApiBaseUrl;
    }
    if (options?.fetchRetrier) this.fetchRetrier = options.fetchRetrier;
    if (options?.queryParams) this.queryParams = options.queryParams;
    if (options?.getCsrfToken) this.getCsrfToken = options.getCsrfToken;
  }

  /** @inheritdoc */
  async fetch(
    request: RequestInfo,
    options?: RequestInit | FetchOptions,
  ): Promise<Response> {
    const finalRequest = this.withQueryParams(
      request,
      legacyArgsAsFetchOptions(options)?.queryParams,
    );
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
      includeCsrfToken: options?.includeCsrfToken,
      queryParams: options?.queryParams,
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
   * Merge the handler-wide query params and this request's own into the
   * request URL.
   *
   * Precedence runs least to most specific: what the caller put on the url
   * string, then the handler-wide params, then this request's params. So a
   * host can inject a param for every request and an individual call can
   * still override it.
   *
   * @param request - The request being made
   * @param requestParams - Params for this request only
   * @returns The request with the merged params on its url, or the original
   *   request when there are no params to add
   */
  private withQueryParams(
    request: RequestInfo,
    requestParams?: QueryParams,
  ): RequestInfo {
    const urlString = typeof request === 'string' ? request : request.url;
    const handlerParams =
      typeof this.queryParams === 'function'
        ? this.queryParams(urlString)
        : this.queryParams;

    const params = FetchHandler.mergeQueryParams([
      handlerParams,
      requestParams,
    ]);
    // `URLSearchParams.size` is too new to rely on, so check for a first key.
    // Bailing here keeps a request with no params byte-identical rather than
    // sending it through a parse/serialize round trip.
    if (params.keys().next().done) return request;

    const finalUrl = this.addSearchParams(urlString, params);
    if (typeof request === 'string') return finalUrl;
    // Rebuild rather than hand back the url on its own, so the method,
    // headers and body of a `Request` survive having params added.
    return new Request(finalUrl, request);
  }

  /**
   * If a CSRF token source was configured, the caller opted in via
   * `includeCsrfToken: true`, and the request method needs one, resolve the
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
    if (!fetchOptions.includeCsrfToken) return options;

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
   * Works on the URL string rather than parsing it into a `URL`, so a
   * base-relative or scheme-relative input (`/services/foo`,
   * `www.example.com/foo`) comes back in the form it went in instead of being
   * resolved against the current page.
   *
   * @param urlString - Original URL string
   * @param params - Params to add, replacing any of the same name already on the URL
   * @returns New URL string with params added
   */
  private addSearchParams(urlString: string, params: QueryParams): string {
    const hashIndex = urlString.indexOf('#');
    const hash = hashIndex === -1 ? '' : urlString.slice(hashIndex);
    const path = hashIndex === -1 ? urlString : urlString.slice(0, hashIndex);

    const queryIndex = path.indexOf('?');
    const base = queryIndex === -1 ? path : path.slice(0, queryIndex);
    const searchParams = new URLSearchParams(
      queryIndex === -1 ? '' : path.slice(queryIndex + 1),
    );

    FetchHandler.replaceParams(searchParams, params);

    const search = searchParams.toString();
    return `${base}${search ? `?${search}` : ''}${hash}`;
  }

  /**
   * Combine several sets of params into one, later sets winning over earlier
   * ones on a shared key.
   *
   * @param paramSets - Params in precedence order, least specific first
   * @returns The combined params
   */
  private static mergeQueryParams(
    paramSets: (QueryParams | undefined)[],
  ): URLSearchParams {
    const merged = new URLSearchParams();
    paramSets.forEach(params => {
      if (params) FetchHandler.replaceParams(merged, params);
    });
    return merged;
  }

  /**
   * Append `params` onto `target`, dropping any values `target` already held
   * for the keys `params` carries.
   *
   * Every key is cleared before any is appended, so a key that repeats within
   * `params` replaces what `target` had rather than stacking onto it.
   *
   * @param target - Params to merge into, modified in place
   * @param params - Params to merge in
   */
  private static replaceParams(
    target: URLSearchParams,
    params: QueryParams,
  ): void {
    const newParams = FetchHandler.asSearchParams(params);

    const clearedKeys = new Set<string>();
    newParams.forEach((_value, key) => {
      if (clearedKeys.has(key)) return;
      clearedKeys.add(key);
      target.delete(key);
    });
    newParams.forEach((value, key) => {
      target.append(key, value);
    });
  }

  /**
   * Normalize the record form of `QueryParams` into `URLSearchParams`,
   * dropping `undefined`/`null` values so callers can pass optional params
   * without guarding each one.
   *
   * @param params - Params in either accepted form
   * @returns The params as `URLSearchParams`
   */
  private static asSearchParams(params: QueryParams): URLSearchParams {
    if (params instanceof URLSearchParams) return params;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      searchParams.append(key, String(value));
    });
    return searchParams;
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
