import { expect } from '@open-wc/testing';
import { DefaultRetryConfiguration } from '../src/fetch-retry/configuration/default-retry-configuration';

describe('DefaultRetryConfiguration', () => {
  it('exponential backoff delay', async () => {
    const config = new DefaultRetryConfiguration();
    expect(config.retryDelay(0)).to.equal(500);
    expect(config.retryDelay(1)).to.equal(1000);
    expect(config.retryDelay(2)).to.equal(2000);
  });
});
