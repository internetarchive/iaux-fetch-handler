import { expect } from '@open-wc/testing';
import { legacyArgsAsFetchOptions } from '../src/fetch-retry/legacy-args';
import { MockRetryConfig } from './mocks/mock-retry-config';

describe('FetchRetrier Legacy Args', () => {
  it('can convert RequestInit to FetchOptions', async () => {
    const options = legacyArgsAsFetchOptions({ method: 'GET' });
    expect(options).to.deep.equal({
      requestInit: {
        method: 'GET',
      },
    });
  });

  it('leaves FetchOptions unchanged', async () => {
    const retryConfig = new MockRetryConfig();
    const options = legacyArgsAsFetchOptions({
      requestInit: { method: 'POST' },
      retryConfig: retryConfig,
    });
    expect(options).to.deep.equal({
      requestInit: {
        method: 'POST',
      },
      retryConfig: retryConfig,
    });
  });
});
