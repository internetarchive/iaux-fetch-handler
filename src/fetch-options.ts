import type { RetryConfiguring } from './fetch-retry/configuration/retry-configuring';

/**
 * Query params to merge into a request URL.
 *
 * The record form is the common case: values are stringified and URL-encoded,
 * and `undefined`/`null` entries are dropped so optional params can be passed
 * straight through without a conditional at the call site. Pass a
 * `URLSearchParams` when a key needs to repeat.
 */
export type QueryParams =
  | URLSearchParams
  | Record<string, string | number | boolean | null | undefined>;

/**
 * Query params for every request a FetchHandler makes.
 *
 * The function form is called per request with the url being requested, so a
 * host can scope its params to certain endpoints by returning `undefined` for
 * the rest. `apiBaseUrl` is already applied by then, so a
 * `fetchApiPathResponse` call is matched on its full url and not its path.
 */
export type QueryParamsProvider =
  QueryParams | ((url: string) => QueryParams | undefined);

/**
 * Base fetch options for FetchHandler
 */
export type FetchOptions = {
  requestInit?: RequestInit;
  retryConfig?: RetryConfiguring;
  /**
   * Query params merged into the request URL, overriding any of the same name
   * already on it or supplied handler-wide.
   */
  queryParams?: QueryParams;
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
   * Query params merged into the request URL, overriding any of the same name
   * already on it or supplied handler-wide.
   */
  queryParams?: QueryParams;
  /**
   * Set to opt this request into an automatic `X-CSRF-Token` header (when
   * the FetchHandler was constructed with a `getCsrfToken` source). Off by
   * default — only opt in once the target endpoint's CORS policy is known
   * to allow-list that header.
   */
  includeCsrfToken?: boolean;
};
