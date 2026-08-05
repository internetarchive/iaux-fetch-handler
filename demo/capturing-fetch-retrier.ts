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

  async fetchRetry(
    request: RequestInfo,
    options?: RequestInit | FetchOptions,
  ): Promise<Response> {
    const fetchOptions = legacyArgsAsFetchOptions(options);
    this.lastUrl = typeof request === 'string' ? request : request.url;
    this.lastInit = fetchOptions?.requestInit;
    return new Response(JSON.stringify({ demo: true }), { status: 200 });
  }
}
