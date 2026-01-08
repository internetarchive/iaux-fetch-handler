import type { FetchOptions } from '../../src/fetch-options';
import type { FetchRetrierInterface } from '../../src/fetch-retry/fetch-retrier';
import { legacyArgsAsFetchOptions } from '../../src/fetch-retry/legacy-args';

export class MockFetchRetrier implements FetchRetrierInterface {
  requestInfo?: RequestInfo;
  init?: RequestInit;
  retries?: number;

  async fetchRetry(
    request: RequestInfo,
    options?: RequestInit | FetchOptions,
  ): Promise<Response> {
    const fetchOptions = legacyArgsAsFetchOptions(options);
    this.init = fetchOptions?.requestInit;
    this.requestInfo = request;
    return new Response(JSON.stringify({ boop: 'snoot' }), { status: 200 });
  }
}
