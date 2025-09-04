export interface FetchHandlerInterface {
  /**
   * Generic fetch function that handles retries and common IA parameters like `reCache=1`
   *
   * @param input RequestInfo
   * @param init RequestInit
   */
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;

  /**
   * A helper function to fetch a response from an API and get a JSON object
   *
   * @param path string
   * @param options?: { includeCredentials?: boolean }
   */
  fetchApiResponse<T>(
    url: string,
    options?: {
      includeCredentials?: boolean;
      method?: string;
      body?: BodyInit;
      headers?: HeadersInit;
      shouldRetry?: boolean;
    },
  ): Promise<T>;

  /**
   * A helper function to fetch a response from the IA API and get a JSON object
   *
   * This allows you to just pass the path to the API and get the response instead
   * of the full URL. If you need a full URL, use `fetchApiResponse` instead.
   *
   * @param path string
   * @param options?: { includeCredentials?: boolean, shouldRetry?: boolean }
   */
  fetchIAApiResponse<T>(
    path: string,
    options?: { includeCredentials?: boolean; shouldRetry?: boolean },
  ): Promise<T>;
}
