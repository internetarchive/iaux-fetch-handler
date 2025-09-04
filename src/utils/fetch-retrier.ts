import type { AnalyticsHandlerInterface } from '@internetarchive/analytics-manager';
import { AnalyticsHandler } from '@internetarchive/analytics-manager';
import { promisedSleep } from './promised-sleep';
import type { ApiRequestInit } from '../fetch-handler-interface';

/**
 * A class that retries a fetch request.
 */
export interface FetchRetrierInterface {
  /**
   * Execute a fetch with retry.
   *
   * @param requestInfo RequestInfo
   * @param init Optional RequestInit
   * @param retries Optional number of retries to attempt
   * @returns Promise<Response>
   */
  fetchRetry(
    requestInfo: RequestInfo,
    init?: ApiRequestInit,
    retries?: number,
  ): Promise<Response>;
}

/** @inheritdoc */
export class FetchRetrier implements FetchRetrierInterface {
  private analyticsHandler = new AnalyticsHandler({ enableAnalytics: true });
  private sleep = promisedSleep; // default sleep function

  private retryCount = 2;

  private retryDelay = 1000;

  constructor(options?: {
    analyticsHandler?: AnalyticsHandlerInterface;
    retryCount?: number;
    retryDelay?: number;
    sleepFn?: (ms: number) => Promise<void>; // <-- add this!
  }) {
    if (options?.analyticsHandler)
      this.analyticsHandler = options.analyticsHandler;
    if (options?.retryCount) this.retryCount = options.retryCount;
    if (options?.retryDelay) this.retryDelay = options.retryDelay;
    if (options?.sleepFn) this.sleep = options.sleepFn; // override if provided
  }

  /** @inheritdoc */
  public async fetchRetry(
    requestInfo: RequestInfo,
    init?: RequestInit,
    retries: number = this.retryCount,
  ): Promise<Response> {
    const urlString =
      typeof requestInfo === 'string' ? requestInfo : requestInfo.url;
    const retryNumber = this.retryCount - retries + 1;
    const shouldRetry =
      (init as ApiRequestInit | undefined)?.shouldRetry ?? false;

    try {
      const response = await fetch(requestInfo, init);
      if (response.ok) return response;

      if (!shouldRetry) {
        // don't retry on 4xx errors in general since this will never succeed
        if (response.status >= 400 && response.status < 500) {
          this.log4xxEvent(urlString);
          return response;
        }
      }

      if (retries > 0) {
        await this.sleep(this.retryDelay);
        this.logRetryEvent(
          urlString,
          retryNumber,
          response.statusText,
          response.status,
        );
        return this.fetchRetry(requestInfo, init, retries - 1);
      }
      this.logFailureEvent(urlString, response.status);
      return response;
    } catch (error) {
      // if a content blocker is detected, log it and don't retry
      if (this.isContentBlockerError(error)) {
        this.logContentBlockingEvent(urlString, error);
        throw error;
      }

      if (retries > 0) {
        await this.sleep(this.retryDelay);
        // intentionally duplicating the error message here since we want something
        // in the status code even though we won't have an actual code
        this.logRetryEvent(urlString, retryNumber, error, error);
        return this.fetchRetry(requestInfo, init, retries - 1);
      }

      this.logFailureEvent(urlString, error);
      throw error;
    }
  }

  private isContentBlockerError(error: unknown): boolean {
    // all of the content blocker errors are `TypeError`
    if (!(error instanceof TypeError)) return false;
    const message = error.message.toLowerCase();
    return message.includes('content blocker');
  }

  private readonly eventCategory = 'offshootFetchRetry';

  private logRetryEvent(
    urlString: string,
    retryNumber: number,
    status: unknown,
    code: unknown,
  ) {
    this.analyticsHandler.sendEvent({
      category: this.eventCategory,
      action: 'retryingFetch',
      label: `retryNumber: ${retryNumber} / ${this.retryCount}, code: ${code}, status: ${status}, url: ${urlString}`,
    });
  }

  private logFailureEvent(urlString: string, error: unknown) {
    this.analyticsHandler.sendEvent({
      category: this.eventCategory,
      action: 'fetchFailed',
      label: `error: ${error}, url: ${urlString}`,
    });
  }

  private log4xxEvent(urlString: string) {
    this.analyticsHandler.sendEvent({
      category: this.eventCategory,
      action: 'status4xxNotRetrying',
      label: `url: ${urlString}`,
    });
  }

  private logContentBlockingEvent(urlString: string, error: unknown) {
    this.analyticsHandler.sendEvent({
      category: this.eventCategory,
      action: 'contentBlockerDetectedNotRetrying',
      label: `error: ${error}, url: ${urlString}`,
    });
  }
}
