import { expect } from '@open-wc/testing';
import { NoRetryConfiguration } from '../src/fetch-retry/configuration/no-retry-configuration';

describe('NoRetryConfiguration', () => {
  it('should not retry', async () => {
    const config = new NoRetryConfiguration();
    expect(config.shouldRetry()).to.be.false;
  });

  it('has no delay', async () => {
    const config = new NoRetryConfiguration();
    expect(config.retryDelay()).to.equal(Infinity);
  });
});
