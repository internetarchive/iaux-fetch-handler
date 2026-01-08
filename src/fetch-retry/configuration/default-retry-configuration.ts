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

  private readonly transient4xxStatusCodes: ReadonlySet<number> = new Set([
    408, // Request Timeout
    429, // Too Many Requests
  ]);

  shouldRetry(response: Response | null, retryNumber: number): boolean {
    if (response === null) return false;
    if (retryNumber > this.maxRetries) return false;
    const is5xx = response.status >= 500 && response.status < 600;
    const isTransient4xx = this.transient4xxStatusCodes.has(response.status);
    return is5xx || isTransient4xx;
  }

  retryDelay(retryNumber: number, response?: Response | null): Milliseconds {
    // If we have a Retry-After header, use that
    const retryAfter = response?.headers.get('Retry-After');
    if (retryAfter) {
      const retryAfterSeconds = parseInt(retryAfter, 10);
      if (!isNaN(retryAfterSeconds)) {
        return retryAfterSeconds * 1000;
      }
    }

    // Exponential backoff up to 10 seconds
    return Math.min(500 * 2 ** retryNumber, 10000);
  }
}
