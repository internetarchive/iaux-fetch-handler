import type { TimeInterval } from './time-interval';

export interface RetryConfiguring {
  shouldRetry(
    response: Response | null,
    retryNumber: number,
    error?: unknown,
  ): boolean;

  retryDelay(retryNumber: number): TimeInterval;
}
