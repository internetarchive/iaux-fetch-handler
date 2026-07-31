import { html, LitElement, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { FetchRetrier } from '../src/fetch-retry/fetch-retrier';
import { FetchRetryConfig } from '../src/fetch-retry/configuration/configurations';
import type { RetryConfiguring } from '../src/fetch-retry/configuration/retry-configuring';

type AttemptLog = {
  attempt: number;
  status: number;
  timeSinceStartMs: number;
};

const CONFIGS: Record<string, RetryConfiguring> = {
  default: FetchRetryConfig.default,
  noRetry: FetchRetryConfig.noRetry,
};

/**
 * Temporarily replaces window.fetch with one that returns a transient
 * failure (503) a fixed number of times before succeeding, so the retry
 * demo doesn't depend on a real flaky server.
 */
class FlakyFetchInstaller {
  private callCount = 0;

  private original?: typeof window.fetch;

  constructor(
    private failCount: number,
    private onAttempt: (status: number) => void,
  ) {}

  install(): void {
    this.original = window.fetch.bind(window);
    window.fetch = async (): Promise<Response> => {
      this.callCount += 1;
      const status = this.callCount <= this.failCount ? 503 : 200;
      this.onAttempt(status);
      return new Response(
        JSON.stringify({ attempt: this.callCount, ok: status === 200 }),
        { status },
      );
    };
  }

  uninstall(): void {
    if (this.original) window.fetch = this.original;
  }
}

@customElement('retry-demo')
export class RetryDemo extends LitElement {
  @state() private configKey: keyof typeof CONFIGS = 'default';

  @state() private failCount = 2;

  @state() private loading = false;

  @state() private log: AttemptLog[] = [];

  @state() private outcome?: { success: boolean; totalMs: number };

  private async sendRequest() {
    this.log = [];
    this.outcome = undefined;
    this.loading = true;

    const startedAt = performance.now();
    const installer = new FlakyFetchInstaller(this.failCount, status => {
      this.log = [
        ...this.log,
        {
          attempt: this.log.length + 1,
          status,
          timeSinceStartMs: Math.round(performance.now() - startedAt),
        },
      ];
    });

    installer.install();
    try {
      const retrier = new FetchRetrier({
        retryConfig: CONFIGS[this.configKey],
      });
      const response = await retrier.fetchRetry('/demo/flaky-endpoint');
      this.outcome = {
        success: response.ok,
        totalMs: Math.round(performance.now() - startedAt),
      };
    } finally {
      installer.uninstall();
      this.loading = false;
    }
  }

  render() {
    return html`
      <h1>FetchRetrier Demo</h1>
      <p>
        Simulates a flaky backend (no real network call) so you can see
        <code>DefaultRetryConfiguration</code>'s exponential backoff vs
        <code>NoRetryConfiguration</code> giving up immediately.
      </p>

      <fieldset>
        <legend>Setup</legend>
        <label>
          Retry config:
          <select
            .value=${this.configKey}
            @change=${(e: Event) => {
              this.configKey = (e.target as HTMLSelectElement).value as
                | 'default'
                | 'noRetry';
            }}
          >
            <option value="default">
              Default (2 retries, exponential backoff)
            </option>
            <option value="noRetry">No retry</option>
          </select>
        </label>
        <label>
          Simulated backend fails this many times before succeeding (503):
          <input
            type="number"
            min="0"
            max="5"
            .value=${String(this.failCount)}
            @input=${(e: Event) => {
              this.failCount = Number((e.target as HTMLInputElement).value);
            }}
          />
        </label>
      </fieldset>

      <button @click=${this.sendRequest} ?disabled=${this.loading}>
        ${this.loading ? 'Sending…' : 'Send request'}
      </button>

      ${this.log.length
        ? html`
            <h3>Attempts</h3>
            <table>
              <thead>
                <tr>
                  <th>Attempt</th>
                  <th>Status</th>
                  <th>Time since start</th>
                </tr>
              </thead>
              <tbody>
                ${this.log.map(
                  entry => html`
                    <tr>
                      <td>${entry.attempt}</td>
                      <td class=${entry.status === 200 ? 'pass' : 'fail'}>
                        ${entry.status}
                      </td>
                      <td>${entry.timeSinceStartMs}ms</td>
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          `
        : ''}
      ${this.outcome
        ? html`
            <p class=${this.outcome.success ? 'pass' : 'fail'}>
              ${this.outcome.success
                ? `✅ Succeeded after ${this.log.length} attempt(s)`
                : `❌ Gave up after ${this.log.length} attempt(s)`}
              — ${this.outcome.totalMs}ms total
            </p>
          `
        : ''}
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      padding: 20px;
      max-width: 900px;
    }

    fieldset {
      margin-bottom: 12px;
    }

    label {
      display: block;
      margin-bottom: 8px;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th,
    td {
      border: 1px solid #ccc;
      padding: 6px 10px;
      text-align: left;
    }

    .pass {
      color: #0a7a0a;
    }

    .fail {
      color: #b00020;
    }
  `;
}
