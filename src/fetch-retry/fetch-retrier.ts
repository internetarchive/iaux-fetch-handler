import type { AnalyticsHandlerInterface } from '@internetarchive/analytics-manager';
import { AnalyticsHandler } from '@internetarchive/analytics-manager';
import { promisedSleep } from '../utils/promised-sleep';
import {
  DefaultRetryConfiguration,
  type RetryConfiguring,
} from './fetch-retry-configuring';
import { type FetchOptions } from '../fetch-options';

/**
 * A class that retries a fetch request.
 */
export interface FetchRetrierInterface {
  /**
   * Execute a fetch with retry.
   *
   * @param request RequestInfo
   * @param options Optional RequestInit | FetchOptions
   * @returns Promise<Response>
   */
  fetchRetry(
    request: RequestInfo,
    options?: RequestInit | FetchOptions,
  ): Promise<Response>;
}

/** @inheritdoc */
export class FetchRetrier implements FetchRetrierInterface {
  private analyticsHandler = new AnalyticsHandler({ enableAnalytics: true });

  private retryConfiguration: RetryConfiguring =
    new DefaultRetryConfiguration();

  constructor(options?: {
    analyticsHandler?: AnalyticsHandlerInterface;
    retryConfiguration?: RetryConfiguring;
  }) {
    if (options?.analyticsHandler)
      this.analyticsHandler = options.analyticsHandler;
    if (options?.retryConfiguration)
      this.retryConfiguration = options.retryConfiguration;
  }

  /** @inheritdoc */
  public async fetchRetry(
    request: RequestInfo,
    options?: RequestInit | FetchOptions,
  ): Promise<Response> {
    const fetchOptions = this.legacyArgsAsFetchOptions(options);
    return await this.fetchRetryWithOptions(request, 0, fetchOptions);
  }

  private legacyArgsAsFetchOptions(
    options?: RequestInit | FetchOptions,
  ): FetchOptions | undefined {
    if (!options) return undefined;
    // if options is already FetchOptions, return it
    if ('requestInit' in options || 'retryConfig' in options) {
      return options as FetchOptions;
    }
    // otherwise, it's RequestInit
    return { requestInit: options as RequestInit };
  }

  private async fetchRetryWithOptions(
    request: RequestInfo,
    retryNumber: number,
    options?: FetchOptions,
  ): Promise<Response> {
    const urlString = typeof request === 'string' ? request : request.url;

    try {
      const response = await fetch(request, options?.requestInit);
      if (response.ok) return response;

      if (response.status >= 400 && response.status < 500) {
        this.log40xResponse(response);
      }

      const retryConfig = options?.retryConfig ?? this.retryConfiguration;
      if (retryConfig.shouldRetry(response, retryNumber)) {
        const delay = retryConfig.retryDelay(retryNumber);
        await promisedSleep(delay);
        this.logRetryEvent(
          urlString,
          retryNumber,
          response.statusText,
          response.status,
        );
        return this.fetchRetryWithOptions(request, retryNumber + 1, options);
      }
      this.logFailureEvent(urlString, response.status);
      return response;
    } catch (error) {
      // if a content blocker is detected, log it and don't retry
      if (this.isContentBlockerError(error)) {
        this.logContentBlockingEvent(urlString, error);
        throw error;
      }

      const retryConfig = options?.retryConfig ?? this.retryConfiguration;
      if (retryConfig.shouldRetry(null, retryNumber)) {
        const delay = retryConfig.retryDelay(retryNumber);
        await promisedSleep(delay);
        this.logRetryEvent(urlString, retryNumber, error, error);
        return this.fetchRetryWithOptions(request, retryNumber + 1, options);
      }
      this.logFailureEvent(urlString, error);
      throw error;
    }
  }

  //   private async handleRetry(request: RequestInfo,
  //     retryNumber: number,
  //     options?: FetchOptions,
  // ): Promise<Response | undefined> {
  //     const retryConfig = options?.retryConfig ?? this.retryConfiguration;
  //     if (await retryConfig.shouldRetry(null, retryNumber)) {
  //       const delay = retryConfig.retryDelay(retryNumber);
  //       await promisedSleep(delay);
  //       this.logRetryEvent(urlString, retryNumber, error, error);
  //       return this.fetchRetryWithOptions(request, options);
  //     }
  //   }

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
      label: `retryNumber: ${retryNumber}, code: ${code}, status: ${status}, url: ${urlString}`,
    });
  }

  private logFailureEvent(urlString: string, error: unknown) {
    this.analyticsHandler.sendEvent({
      category: this.eventCategory,
      action: 'fetchFailed',
      label: `error: ${error}, url: ${urlString}`,
    });
  }

  private log40xResponse(response: Response) {
    const status = response.status;

    this.analyticsHandler.sendEvent({
      category: this.eventCategory,
      action: `status40xResponse`,
      label: `http status ${status}, url: ${response.url}`,
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
