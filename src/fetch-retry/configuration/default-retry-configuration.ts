import type { RetryConfiguring } from './retry-configuring';
import type { Milliseconds } from './milliseconds';

export class DefaultRetryConfiguration implements RetryConfiguring {
  static readonly shared: Readonly<RetryConfiguring> =
    new DefaultRetryConfiguration();

  private readonly maxRetries: Readonly<number> = 2;

  constructor(options?: { maxRetries?: number }) {
    if (options?.maxRetries !== undefined) {
      this.maxRetries = options.maxRetries;
    }
  }

  shouldRetry(response: Response | null, retryNumber: number): boolean {
    if (response === null) return false;
    if (retryNumber > this.maxRetries) return false;
    return response.status >= 500 && response.status < 600;
  }

  retryDelay(retryNumber: number): Milliseconds {
    // Exponential backoff up to 10 seconds
    return Math.min(500 * 2 ** retryNumber, 10000);
  }
}
