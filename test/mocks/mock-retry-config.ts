import type { RetryConfiguring } from '../../src/fetch-retry/configuration/retry-configuring';

export class MockRetryConfig implements RetryConfiguring {
  mockRetryCount: number = 2;

  mockRetryDelay: number = 0;

  shouldRetry(
    response: Response | null,
    retryNumber: number,
    error?: unknown,
  ): boolean {
    return retryNumber < this.mockRetryCount;
  }

  retryDelay(): number {
    return this.mockRetryDelay;
  }
}
