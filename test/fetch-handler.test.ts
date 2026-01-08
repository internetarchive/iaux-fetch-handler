import { expect } from '@open-wc/testing';
import { IaFetchHandler } from '../src/fetch-handler';
import { MockFetchRetrier } from './mocks/mock-fetch-retrier';
import { NoRetryConfiguration } from '../src/fetch-retry/configuration/no-retry-configuration';

describe('Fetch Handler', () => {
  describe('fetch', () => {
    it('adds reCache=1 if it is in the current url', async () => {
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new IaFetchHandler({
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
      const fetchHandler = new IaFetchHandler({
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
      const fetchHandler = new IaFetchHandler({
        fetchRetrier,
        searchParams: '?foo=bar',
      });
      await fetchHandler.fetch('https://foo.org/api/v1/snoot');
      expect(fetchRetrier.requestInfo).to.equal('https://foo.org/api/v1/snoot');
    });
  });

  describe('fetchIAApiResponse', () => {
    it('prepends the IA basehost to the url when making a request', async () => {
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

  describe('fetchApiResponse', () => {
    it('adds credentials: include if requested', async () => {
      const endpoint = '/foo/service/endpoint.php';
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new IaFetchHandler({
        iaApiBaseUrl: 'www.example.com',
        fetchRetrier: fetchRetrier,
      });
      await fetchHandler.fetchApiResponse(endpoint, {
        includeCredentials: true,
      });
      expect(fetchRetrier.init).to.deep.equal({ credentials: 'include' });
    });

    it('passes method, body, and headers to RequestInit', async () => {
      const fetchRetrier = new MockFetchRetrier();
      const fetchHandler = new IaFetchHandler({ fetchRetrier });
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
      const fetchHandler = new IaFetchHandler({ fetchRetrier });
      await fetchHandler.fetchApiResponse('https://example.org/api', {
        retryConfig,
      });
      expect(fetchRetrier.retryConfig).to.equal(retryConfig);
    });
  });
});
