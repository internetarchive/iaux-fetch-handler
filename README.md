![Build Status](https://github.com/internetarchive/iaux-fetch-handler/actions/workflows/ci.yml/badge.svg) [![codecov](https://codecov.io/gh/internetarchive/iaux-fetch-handler/graph/badge.svg?token=ZOYRJ2BV9W)](https://codecov.io/gh/internetarchive/iaux-fetch-handler)


# Internet Archive Fetch Handler library


A custom library for handling API requests.


## Installation

```bash
npm install @internetarchive/fetch-handler
```


## Sample Usage

```ts
import { FetchHandler } from '@internetarchive/fetch-handler';

@property({ type: Object }) data: any = null;
@property({ type: String }) error: string = '';
@property({ type: Boolean }) loading: boolean = false;

private fetchHandler: FetchHandler;

this.fetchHandler = new FetchHandler({
  apiBaseUrl: 'https://archive.org',
});


async fetchData() {
  this.loading = true;
  this.error = '';
  try {
    const result =
      await this.fetchHandler.fetchApiPathResponse('/metadata/goody');
    this.data = result;
  } catch (error) {
    this.error = `Error fetching data: ${error}`;
  } finally {
    this.loading = false;
  }
}
```

See the `demo` directory for a more detailed example.

## Configuring Retry

You can customize how you'd like `FetchHandler` to retry a request, both globally and per-request.

### Basic Usage

There are two included configurations, `DefaultRetryConfiguration` and `NoRetryConfiguration`, which can be accessed via `FetchRetryConfig.default` and `FetchRetryConfig.noRetry`. `.default` (the default) will retry twice with exponential backoff delay and `.noRetry` will not retry.

Example:

```ts
import { FetchHandler, FetchRetrier, FetchRetryConfig } from '@internetarchive/fetch-handler';

// setting default: retry twice with exponential backoff delay
const fetchRetrier = new FetchRetrier({
  retryConfig: FetchRetryConfig.default
})

const fetchHandler = new FetchHandler({
  fetchRetrier
})

// use default retry configuration
await fetchHander.fetch('https://foo.com/api')

// specify retry config per-request: will not retry this request
await fetchHandler.fetch('https://foo.com/api', {
  retryConfig: FetchRetryConfig.noRetry
})
```

### Custom Retry Configuration

Fetch retrying can be configured using a `RetryConfiguring` object. This interface has two methods:
```ts
interface RetryConfiguring {
  shouldRetry(
    response: Response | null,
    retryNumber: number,
    error?: unknown,
  ): boolean;

  retryDelay(
    retryNumber: number,
    response?: Response | null,
  ): Milliseconds | null;
}

class MyCustomRetryConfig implements RetryConfiguring {
  shouldRetry(
    response: Response | null,
    retryNumber: number
  ): boolean {
    if (response === null) return false;
    if (retryNumber > 1) return false;
    return response.status !== 404;
  }

  retryDelay(retryNumber: number): Milliseconds | null {
    return 1000;
  }
}

const customRetryConfig = new MyCustomRetryConfig();
// use your custom retry config on a request or globally
await fetchHandler.fetch('https://foo.com/api', {
  retryConfig: customRetryConfig
})
```

## CSRF Tokens

`FetchHandler` can automatically attach an `X-CSRF-Token` header to `POST`, `PUT`, and `DELETE` requests. Provide a `getCsrfToken` function when constructing the handler; if omitted, behavior is unchanged (no header is added).

```ts
const fetchHandler = new FetchHandler({
  apiBaseUrl: 'https://archive.org',
  getCsrfToken: async () => {
    const { token } = await fetch('/services/csrf-token').then(r => r.json());
    return token;
  },
});

// automatically sends the X-CSRF-Token header — no need to include it in the body
await fetchHandler.fetchApiPathResponse('/favorites/add', {
  method: 'POST',
  body: JSON.stringify({ identifier: 'goody' }),
});
```

If a caller already sets an `X-CSRF-Token` header explicitly, it's left as-is.

## Local Demo with `web-dev-server`
Add `127.0.0.1 local.archive.org` to your `/etc/hosts` file

```bash
npm run start
```

**NOTE** The first time you visit the site, the browser will say the site is insecure because it's using a self-signed certificate. Accept the certificate and visit the site and the browser will then accept the certificate in the future. It may always say the site is insecure, but for the purposes of development, it's secure enough.

To run a local development server that serves the basic demo located in `demo/index.html`

## Testing with Web Test Runner
To run the suite of Web Test Runner tests, run
```bash
npm run test
```

To run the tests in watch mode (for &lt;abbr title=&#34;test driven development&#34;&gt;TDD&lt;/abbr&gt;, for example), run

```bash
npm run test:watch
```

## Linting with ESLint, Prettier, and Types
To scan the project for linting errors, run
```bash
npm run lint
```

To automatically fix many linting errors, run
```bash
npm run format
```
