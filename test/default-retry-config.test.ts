import { expect } from '@open-wc/testing';
import { DefaultRetryConfiguration } from '../src/fetch-retry/configuration/default-retry-configuration';

describe('DefaultRetryConfiguration', () => {
  it('should not retry on null response', async () => {
    const config = new DefaultRetryConfiguration();
    expect(config.shouldRetry(null, 1)).to.be.false;
  });

  it('should not retry after max retries exceeded', async () => {
    const config = new DefaultRetryConfiguration({ maxRetries: 2 });
    const mockResponse = new Response(null, { status: 500 });
    expect(config.shouldRetry(mockResponse, 3)).to.be.false;
  });

  it('should retry on 5xx status codes', async () => {
    const config = new DefaultRetryConfiguration();
    const mockResponse = new Response(null, { status: 502 });
    expect(config.shouldRetry(mockResponse, 1)).to.be.true;
  });

  it('should not retry on non-5xx status codes', async () => {
    const config = new DefaultRetryConfiguration();
    const mockResponse = new Response(null, { status: 404 });
    expect(config.shouldRetry(mockResponse, 1)).to.be.false;
  });

  it('has exponential backoff delay', async () => {
    const config = new DefaultRetryConfiguration();
    expect(config.retryDelay(0)).to.equal(500);
    expect(config.retryDelay(1)).to.equal(1000);
    expect(config.retryDelay(2)).to.equal(2000);
  });
});
