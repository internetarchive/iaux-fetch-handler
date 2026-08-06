import type { FetchRetrierInterface } from '../src/fetch-retry/fetch-retrier';
import type { FetchOptions } from '../src/fetch-options';
import { legacyArgsAsFetchOptions } from '../src/fetch-retry/legacy-args';

/**
 * Captures the request FetchHandler would have sent instead of making a real
 * network call, so a demo can show exactly what headers/method/url were
 * produced for a given scenario.
 *
 * Pass it to the `fetchRetrier` constructor option.
 */
export class CapturingFetchRetrier implements FetchRetrierInterface {
  lastUrl = '';

  lastInit?: RequestInit;

  /**
   * The `Request` the handler passed along, when it was given one rather than
   * a url string. Adding query params to a `Request` means rebuilding it, so
   * this is what shows the method, headers and body came through intact.
   */
  lastRequest?: Request;

  async fetchRetry(
    request: RequestInfo,
    options?: RequestInit | FetchOptions,
  ): Promise<Response> {
    const fetchOptions = legacyArgsAsFetchOptions(options);
    this.lastUrl = typeof request === 'string' ? request : request.url;
    this.lastRequest = typeof request === 'string' ? undefined : request;
    this.lastInit = fetchOptions?.requestInit;
    return new Response(JSON.stringify({ demo: true }), { status: 200 });
  }
}
