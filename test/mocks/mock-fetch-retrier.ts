import type { FetchOptions } from '../../src/fetch-options';
import type { FetchRetrierInterface } from '../../src/fetch-retry/fetch-retrier';
import type { RetryConfiguring } from '../../src/fetch-retry/configuration/retry-configuring';
import { legacyArgsAsFetchOptions } from '../../src/fetch-retry/legacy-args';

export class MockFetchRetrier implements FetchRetrierInterface {
  requestInfo?: RequestInfo;
  init?: RequestInit;
  retries?: number;
  retryConfig?: RetryConfiguring;

  async fetchRetry(
    request: RequestInfo,
    options?: RequestInit | FetchOptions,
  ): Promise<Response> {
    const fetchOptions = legacyArgsAsFetchOptions(options);
    this.init = fetchOptions?.requestInit;
    this.retryConfig = fetchOptions?.retryConfig;
    this.requestInfo = request;
    return new Response(JSON.stringify({ boop: 'snoot' }), { status: 200 });
  }
}
