import type { RetryConfiguring } from './retry-configuring';
import type { TimeInterval } from './time-interval';

export class DefaultRetryConfiguration implements RetryConfiguring {
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

  retryDelay(retryNumber: number): TimeInterval {
    // Exponential backoff up to 10 seconds
    return Math.min(500 * 2 ** retryNumber, 10000);
  }
}
