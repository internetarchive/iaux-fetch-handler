import type { RetryConfiguring } from '../../src/fetch-retry/fetch-retry-configuring';

export class MockRetryConfig implements RetryConfiguring {
  mockRetryDelay: number = 0;

  shouldRetry(
    response: Response | null,
    retryNumber: number,
    error?: unknown,
  ): Promise<boolean> {
    return Promise.resolve(retryNumber < 2);
  }

  retryDelay(): number {
    return this.mockRetryDelay;
  }
}
