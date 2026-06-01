import { expect } from '@open-wc/testing';
import { FetchHandler, IaFetchHandler } from '../src/fetch-handler';
import { MockFetchRetrier } from './mocks/mock-fetch-retrier';
import { NoRetryConfiguration } from '../src/fetch-retry/configuration/no-retry-configuration';

describe('Fetch Handler', () => {
  describe('constructor', () => {
    it('has no default apiBaseUrl', () => {
      const fetchHandler = new FetchHandler();
      // @ts-expect-error Accessing private property for test
      expect(fetchHandler.apiBaseUrl).to.equal('');
    });

    it('sets iaApiBaseUrl if provided', () => {
      const fetchHandler = new FetchHandler({
        iaApiBaseUrl: 'https://example.org',
      });
      // @ts-expect-error Accessing private property for test
      expect(fetchHandler.apiBaseUrl).to.equal('https://example.org');
    });

    it('sets apiBaseUrl if provided', () => {
      const fetchHandler = new FetchHandler({
        apiBaseUrl: 'https://api.example.org',
      });
      // @ts-expect-error Accessing private property for test
      expect(fetchHandler.apiBaseUrl).to.equal('https://api.example.org');
    });

    it('uses apiBaseUrl over iaApiBaseUrl if both provided', () => {
      const fetchHandler = new FetchHandler({
        iaApiBaseUrl: 'https://example.org',
        apiBaseUrl: 'https://api.example.org',
      });
      // @ts-expect-error Accessing private property for test
      expect(fetchHandler.apiBaseUrl).to.equal('https://api.example.org');
    });
  });

  describe('fetch', () => {
    it('adds reCache=1 if it is in the current url', async () => {
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new FetchHandler({
        fetchRetrier: fetchRetrier,
        searchParams: '?reCache=1',
      });
      await fetchHandler.fetch('https://foo.org/api/v1/snoot');
      expect(fetchRetrier.requestInfo).to.equal(
        'https://foo.org/api/v1/snoot?reCache=1',
      );
    });

    it('appends reCache=1 when request is a Request object', async () => {
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new FetchHandler({
        fetchRetrier,
        searchParams: '?reCache=1',
      });
      const req = new Request('https://foo.org/api/v1/snoot');
      await fetchHandler.fetch(req);
      expect(fetchRetrier.requestInfo).to.equal(
        'https://foo.org/api/v1/snoot?reCache=1',
      );
    });

    it('does not append reCache when not present', async () => {
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new FetchHandler({
        fetchRetrier,
        searchParams: '?foo=bar',
      });
      await fetchHandler.fetch('https://foo.org/api/v1/snoot');
      expect(fetchRetrier.requestInfo).to.equal('https://foo.org/api/v1/snoot');
    });
  });

  describe('fetchApiPathResponse', () => {
    it('prepends the IA basehost to the url when making a request', async () => {
      const endpoint = '/foo/service/endpoint.php';
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new FetchHandler({
        apiBaseUrl: 'www.example.com',
        fetchRetrier: fetchRetrier,
      });
      await fetchHandler.fetchApiPathResponse(endpoint);
      expect(fetchRetrier.requestInfo).to.equal(
        'www.example.com/foo/service/endpoint.php',
      );
    });

    it('defaults to no apiBaseUrl', async () => {
      const endpoint = '/foo/service/endpoint.php';
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new FetchHandler({
        fetchRetrier: fetchRetrier,
      });
      await fetchHandler.fetchApiPathResponse(endpoint);
      expect(fetchRetrier.requestInfo).to.equal('/foo/service/endpoint.php');
    });
  });

  describe('fetchApiResponse', () => {
    it('adds credentials: include if requested', async () => {
      const endpoint = '/foo/service/endpoint.php';
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new FetchHandler({
        apiBaseUrl: 'www.example.com',
        fetchRetrier: fetchRetrier,
      });
      await fetchHandler.fetchApiResponse(endpoint, {
        includeCredentials: true,
      });
      expect(fetchRetrier.init?.credentials).to.equal('include');
    });

    it('passes method, body, and headers to RequestInit', async () => {
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new FetchHandler({ fetchRetrier });
      const body = JSON.stringify({ hello: 'world' });
      await fetchHandler.fetchApiResponse('https://example.org/api', {
        method: 'POST',
        body,
        headers: { 'x-test': '1', 'content-type': 'application/json' },
      });
      expect(fetchRetrier.init?.method).to.equal('POST');
      expect(fetchRetrier.init?.body).to.equal(body);
      const headers = new Headers(fetchRetrier.init?.headers);
      expect(headers.get('x-test')).to.equal('1');
      expect(headers.get('content-type')).to.equal('application/json');
    });

    it('sends Accept: application/json by default', async () => {
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new FetchHandler({ fetchRetrier });
      await fetchHandler.fetchApiResponse('https://example.org/api');
      const headers = new Headers(fetchRetrier.init?.headers);
      expect(headers.get('accept')).to.equal('application/json');
    });

    it('still sends Accept: application/json when caller supplies other headers', async () => {
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new FetchHandler({ fetchRetrier });
      await fetchHandler.fetchApiResponse('https://example.org/api', {
        headers: { 'x-test': '1' },
      });
      const headers = new Headers(fetchRetrier.init?.headers);
      expect(headers.get('accept')).to.equal('application/json');
      expect(headers.get('x-test')).to.equal('1');
    });

    it('lets caller override the default Accept header', async () => {
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new FetchHandler({ fetchRetrier });
      await fetchHandler.fetchApiResponse('https://example.org/api', {
        headers: { Accept: 'text/plain' },
      });
      const headers = new Headers(fetchRetrier.init?.headers);
      expect(headers.get('accept')).to.equal('text/plain');
    });

    it('passes retryConfig through to retrier', async () => {
      const fetchRetrier = new MockFetchRetrier();
      const retryConfig = new NoRetryConfiguration();
      const fetchHandler = new FetchHandler({ fetchRetrier });
      await fetchHandler.fetchApiResponse('https://example.org/api', {
        retryConfig,
      });
      expect(fetchRetrier.retryConfig).to.equal(retryConfig);
    });
  });

  describe('fetchIAApiResponse', () => {
    it('is an alias for fetchApiPathResponse', async () => {
      const endpoint = '/foo/service/endpoint.php';
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new IaFetchHandler({
        iaApiBaseUrl: 'www.example.com',
        fetchRetrier: fetchRetrier,
      });
      await fetchHandler.fetchIAApiResponse(endpoint);
      expect(fetchRetrier.requestInfo).to.equal(
        'www.example.com/foo/service/endpoint.php',
      );
    });

    it('defaults the baseUrl to https://archive.org', async () => {
      const endpoint = '/foo/service/endpoint.php';
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new IaFetchHandler({
        fetchRetrier: fetchRetrier,
      });
      await fetchHandler.fetchIAApiResponse(endpoint);
      expect(fetchRetrier.requestInfo).to.equal(
        'https://archive.org/foo/service/endpoint.php',
      );
    });

    it('passes iaApiBaseUrl if provided', async () => {
      const endpoint = '/foo/service/endpoint.php';
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new IaFetchHandler({
        iaApiBaseUrl: 'www.example.com',
        fetchRetrier: fetchRetrier,
      });
      await fetchHandler.fetchIAApiResponse(endpoint);
      expect(fetchRetrier.requestInfo).to.equal(
        'www.example.com/foo/service/endpoint.php',
      );
    });
  });
});
