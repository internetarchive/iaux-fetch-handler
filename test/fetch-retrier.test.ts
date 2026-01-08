import { expect } from '@open-wc/testing';
import sinon from 'sinon';
import { FetchRetrier } from '../src/fetch-retry/fetch-retrier';
import { MockAnalyticsHandler } from './mocks/mock-analytics-handler';
import { MockRetryConfig } from './mocks/mock-retry-config';

describe('FetchRetrier', () => {
  let fetchStub: sinon.SinonStub;
  let analytics: MockAnalyticsHandler;

  beforeEach(() => {
    analytics = new MockAnalyticsHandler();
    fetchStub = sinon.stub(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it('returns response on first success', async () => {
    fetchStub.resolves(new Response('ok', { status: 200 }));
    const retrier = new FetchRetrier({
      analyticsHandler: analytics,
      retryConfiguration: new MockRetryConfig(),
    });

    const res = await retrier.fetchRetry('https://foo.org/data');

    expect(res.status).to.equal(200);
    expect(fetchStub.callCount).to.equal(1);
    expect(analytics.events.length).to.equal(0);
  });

  it('does not retry on 4xx and logs event', async () => {
    fetchStub.resolves(new Response('forbidden', { status: 403 }));
    const retrier = new FetchRetrier({
      analyticsHandler: analytics,
    });

    const res = await retrier.fetchRetry('https://foo.org/403');

    expect(res.status).to.equal(403);
    expect(fetchStub.callCount).to.equal(1);
    expect(analytics.events[0].action).to.equal('status4xxResponse');
  });

  it('does not retry on 404 and logs event', async () => {
    fetchStub.resolves(new Response('not found', { status: 404 }));
    const retrier = new FetchRetrier({
      analyticsHandler: analytics,
    });

    const res = await retrier.fetchRetry('https://foo.org/404');

    expect(res.status).to.equal(404);
    expect(fetchStub.callCount).to.equal(1);
    expect(analytics.events[0].action).to.equal('status4xxResponse');
  });

  it('retries on 4xx if shouldRetry is true in ApiRequestInit', async () => {
    fetchStub.onCall(0).resolves(new Response('bad request', { status: 400 }));
    fetchStub.onCall(1).resolves(new Response('ok', { status: 200 }));

    const retrier = new FetchRetrier({
      analyticsHandler: analytics,
    });

    const res = await retrier.fetchRetry('https://foo.org/should-retry', {
      retryConfig: new MockRetryConfig(),
    });

    expect(res.status).to.equal(200);
    expect(fetchStub.callCount).to.equal(2);
    expect(analytics.events.some(e => e.action === 'retryingFetch')).to.be.true;
  });

  it('retries on 500 and logs retry/failure events', async () => {
    fetchStub.onCall(0).resolves(new Response('fail', { status: 500 }));
    fetchStub.onCall(1).resolves(new Response('fail again', { status: 500 }));
    fetchStub.onCall(2).resolves(new Response('still fail', { status: 500 }));

    const retrier = new FetchRetrier({
      analyticsHandler: analytics,
      retryConfiguration: new MockRetryConfig(),
    });

    const res = await retrier.fetchRetry('https://foo.org/fail');

    expect(res.status).to.equal(500);
    expect(fetchStub.callCount).to.equal(3);
    expect(analytics.events.some(e => e.action === 'retryingFetch')).to.be.true;
    expect(analytics.events.some(e => e.action === 'fetchFailed')).to.be.true;
  });

  it('retries on fetch error and eventually succeeds', async () => {
    fetchStub.onCall(0).rejects(new Error('Network error'));
    fetchStub.onCall(1).resolves(new Response('ok', { status: 200 }));

    const retrier = new FetchRetrier({
      analyticsHandler: analytics,
      retryConfiguration: new MockRetryConfig(),
    });

    const res = await retrier.fetchRetry('https://foo.org/retry');

    expect(res.status).to.equal(200);
    expect(fetchStub.callCount).to.equal(2);
    expect(analytics.events.some(e => e.action === 'retryingFetch')).to.be.true;
  });

  it('throws and logs when retries are exhausted due to network error', async () => {
    fetchStub.rejects(new Error('Boom'));

    const retrier = new FetchRetrier({
      analyticsHandler: analytics,
      retryConfiguration: new MockRetryConfig(),
    });

    try {
      await retrier.fetchRetry('https://foo.org/networkfail');
      throw new Error('Should have thrown');
    } catch (err: unknown) {
      expect((err as Error).message).to.equal('Boom');
    }

    expect(fetchStub.callCount).to.equal(3);
    expect(analytics.events.some(e => e.action === 'fetchFailed')).to.be.true;
  });

  it('detects content blocker error and does not retry', async () => {
    const blockerError = new TypeError('Content Blocker denied request');
    fetchStub.rejects(blockerError);

    const retrier = new FetchRetrier({
      analyticsHandler: analytics,
    });

    try {
      await retrier.fetchRetry('https://foo.org/blocked');
      throw new Error('Should have thrown');
    } catch (err: unknown) {
      expect(err).to.equal(blockerError);
    }

    expect(fetchStub.callCount).to.equal(1);
    expect(
      analytics.events.some(
        e => e.action === 'contentBlockerDetectedNotRetrying',
      ),
    ).to.be.true;
  });

  it('sleeps for each retry attempt', async () => {
    fetchStub.resolves(new Response(null, { status: 500 }));

    const retrier = new FetchRetrier({
      analyticsHandler: analytics,
      retryConfiguration: new MockRetryConfig(),
    });

    const res = await retrier.fetchRetry('https://foo.org/retry-fail');

    expect(res.status).to.equal(500);
  });
});
