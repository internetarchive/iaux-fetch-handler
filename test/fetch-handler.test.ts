import { expect } from '@open-wc/testing';
import { FetchHandler } from '../src/fetch-handler';
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
      expect(fetchRetrier.init).to.deep.equal({ credentials: 'include' });
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
      expect(fetchRetrier.init).to.deep.equal({
        method: 'POST',
        body,
        headers: { 'x-test': '1', 'content-type': 'application/json' },
      });
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
      const fetchHandler = new FetchHandler({
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
