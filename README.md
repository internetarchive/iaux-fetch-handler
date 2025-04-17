![Build Status](https://github.com/internetarchive/iaux-fetch-handler-service/actions/workflows/ci.yml/badge.svg) [![codecov](https://codecov.io/gh/internetarchive/iaux-fetch-handler-service/graph/badge.svg?token=ZOYRJ2BV9W)](https://codecov.io/gh/internetarchive/iaux-fetch-handler-service)


# Internet Archive Fetch Handler Service


A custom service for handling API requests.


## Installation

```bash
npm install @internetarchive/fetch-handler-service
```


## Sample Usage

```ts
import { IaFetchHandler } from '../src/ia-fetch-handler';

@property({ type: Object }) data: any = null;
@property({ type: String }) error: string = '';
@property({ type: Boolean }) loading: boolean = false;

private fetchHandler: IaFetchHandler;

this.fetchHandler = new IaFetchHandler({
  iaApiBaseUrl: 'https://archive.org',
});


async fetchData() {
  this.loading = true;
  this.error = '';
  try {
    const result =
      await this.fetchHandler.fetchIAApiResponse('/metadata/goody');
    this.data = result;
  } catch (error) {
    this.error = `Error fetching data: ${error}`;
  } finally {
    this.loading = false;
  }
}
```

See the `demo` directory for a more detailed example.

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
