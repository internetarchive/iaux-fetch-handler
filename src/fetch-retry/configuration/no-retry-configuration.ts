import type { RetryConfiguring } from './retry-configuring';
import type { Milliseconds } from './milliseconds';

export class NoRetryConfiguration implements RetryConfiguring {
  static readonly shared: Readonly<RetryConfiguring> =
    new NoRetryConfiguration();

  shouldRetry(): boolean {
    return false;
  }

  retryDelay(): Milliseconds {
    return 0;
  }
}
