import type { RetryConfiguring } from './retry-configuring';
import type { TimeInterval } from './time-interval';

export class NoRetryConfiguration implements RetryConfiguring {
  shouldRetry(): boolean {
    return false;
  }

  retryDelay(): TimeInterval {
    return 0;
  }
}
