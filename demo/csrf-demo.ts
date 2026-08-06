import { html, LitElement, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { FetchHandler } from '../src/fetch-handler';
import { CapturingFetchRetrier } from './capturing-fetch-retrier';

/** `Headers` isn't typed as iterable under this project's `lib` config. */
function headerEntries(headers?: HeadersInit): [string, string][] {
  const entries: [string, string][] = [];
  new Headers(headers).forEach((value, key) => entries.push([key, value]));
  return entries;
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Scenario = {
  label: string;
  method: Method;
  includeCsrfToken: boolean;
  existingHeaderValue?: string;
  tokenValue?: string;
  tokenThrows?: boolean;
  noTokenSource?: boolean;
  expectHeader: boolean;
  expectValue?: string;
  expectThrows?: boolean;
};

const SCENARIOS: Scenario[] = [
  {
    label: 'POST + includeCsrfToken: true → header attached',
    method: 'POST',
    includeCsrfToken: true,
    tokenValue: 'demo-token-abc',
    expectHeader: true,
    expectValue: 'demo-token-abc',
  },
  {
    label: 'PUT + includeCsrfToken: true → header attached',
    method: 'PUT',
    includeCsrfToken: true,
    tokenValue: 'demo-token-abc',
    expectHeader: true,
    expectValue: 'demo-token-abc',
  },
  {
    label: 'DELETE + includeCsrfToken: true → header attached',
    method: 'DELETE',
    includeCsrfToken: true,
    tokenValue: 'demo-token-abc',
    expectHeader: true,
    expectValue: 'demo-token-abc',
  },
  {
    label: 'POST without includeCsrfToken → NOT attached (opt-in default off)',
    method: 'POST',
    includeCsrfToken: false,
    tokenValue: 'demo-token-abc',
    expectHeader: false,
  },
  {
    label: 'GET + includeCsrfToken: true → NOT attached (GET never gets it)',
    method: 'GET',
    includeCsrfToken: true,
    tokenValue: 'demo-token-abc',
    expectHeader: false,
  },
  {
    label: 'Existing X-CSRF-Token header is preserved, not overwritten',
    method: 'POST',
    includeCsrfToken: true,
    existingHeaderValue: 'manual-token',
    tokenValue: 'auto-token',
    expectHeader: true,
    expectValue: 'manual-token',
  },
  {
    label:
      "Invalid/garbage token is attached as-is (FetchHandler doesn't validate — that's the server's job)",
    method: 'POST',
    includeCsrfToken: true,
    tokenValue: 'garbage-not-a-real-token',
    expectHeader: true,
    expectValue: 'garbage-not-a-real-token',
  },
  {
    label: 'getCsrfToken() throwing rejects the request',
    method: 'POST',
    includeCsrfToken: true,
    tokenThrows: true,
    expectHeader: false,
    expectThrows: true,
  },
  {
    label: 'No getCsrfToken configured at all → never attaches',
    method: 'POST',
    includeCsrfToken: true,
    noTokenSource: true,
    expectHeader: false,
  },
];

type ScenarioResult = {
  pass: boolean;
  actualHeaders: [string, string][];
  actualError?: string;
};

@customElement('csrf-demo')
export class CsrfDemo extends LitElement {
  @state() private method: Method = 'POST';
  @state() private includeCsrfToken = true;
  @state() private tokenValue = 'demo-token-123';
  @state() private tokenThrows = false;
  @state() private existingHeaderValue = '';
  @state() private manualResult?: {
    url: string;
    method: string;
    headers: [string, string][];
  };
  @state() private manualError?: string;
  @state() private scenarioResults: Record<number, ScenarioResult> = {};

  @state() private liveBaseUrl = 'https://archive.org';

  @state() private liveEndpointPath = '/services/account/settings/';

  @state() private liveAction = 'verify-password';

  @state() private liveIdentifier = '@abc';

  @state() private livePassword = 'abc';

  @state() private liveIncludeCsrfToken = true;

  @state() private liveLoading = false;

  @state() private liveTokenFetching = false;

  @state() private liveCsrfToken = '';

  @state() private liveHeaders?: [string, string][];

  @state() private liveResult?: unknown;

  @state() private liveError?: string;

  private buildHandler(options: {
    tokenValue?: string;
    tokenThrows?: boolean;
    noTokenSource?: boolean;
  }): { handler: FetchHandler; retrier: CapturingFetchRetrier } {
    const retrier = new CapturingFetchRetrier();
    const handler = new FetchHandler({
      apiBaseUrl: 'https://example.org',
      fetchRetrier: retrier,
      getCsrfToken: options.noTokenSource
        ? undefined
        : async () => {
            if (options.tokenThrows) {
              throw new Error('Simulated getCsrfToken() failure');
            }
            return options.tokenValue ?? '';
          },
    });
    return { handler, retrier };
  }

  private async sendManualRequest() {
    this.manualError = undefined;
    this.manualResult = undefined;
    const { handler, retrier } = this.buildHandler({
      tokenValue: this.tokenValue,
      tokenThrows: this.tokenThrows,
    });
    const headers: Record<string, string> = {};
    if (this.existingHeaderValue) {
      headers['X-CSRF-Token'] = this.existingHeaderValue;
    }
    try {
      await handler.fetchApiResponse('/demo/endpoint', {
        method: this.method,
        includeCredentials: true,
        headers,
        includeCsrfToken: this.includeCsrfToken,
      });
      this.manualResult = {
        url: retrier.lastUrl,
        method: retrier.lastInit?.method ?? this.method,
        headers: headerEntries(retrier.lastInit?.headers),
      };
    } catch (err) {
      this.manualError = String(err);
    }
  }

  private async runScenario(index: number) {
    const scenario = SCENARIOS[index];
    const { handler, retrier } = this.buildHandler({
      tokenValue: scenario.tokenValue,
      tokenThrows: scenario.tokenThrows,
      noTokenSource: scenario.noTokenSource,
    });
    const headers: Record<string, string> = {};
    if (scenario.existingHeaderValue) {
      headers['X-CSRF-Token'] = scenario.existingHeaderValue;
    }

    let actualHeaders: [string, string][] = [];
    let actualError: string | undefined;
    let threw = false;
    try {
      await handler.fetchApiResponse('/demo/endpoint', {
        method: scenario.method,
        includeCredentials: true,
        headers,
        includeCsrfToken: scenario.includeCsrfToken,
      });
      actualHeaders = headerEntries(retrier.lastInit?.headers);
    } catch (err) {
      threw = true;
      actualError = String(err);
    }

    const hasHeader = actualHeaders.some(
      ([key]) => key.toLowerCase() === 'x-csrf-token',
    );
    const headerValue = actualHeaders.find(
      ([key]) => key.toLowerCase() === 'x-csrf-token',
    )?.[1];

    const pass =
      Boolean(scenario.expectThrows) === threw &&
      hasHeader === scenario.expectHeader &&
      (scenario.expectValue === undefined ||
        headerValue === scenario.expectValue);

    this.scenarioResults = {
      ...this.scenarioResults,
      [index]: { pass, actualHeaders, actualError },
    };
  }

  private async runAllScenarios() {
    for (let i = 0; i < SCENARIOS.length; i += 1) {
      await this.runScenario(i);
    }
  }

  /**
   * Fetch a real, signed CSRF token from the target host's own
   * /services/csrf-token endpoint (requires the browser to have a session
   * cookie for that host — i.e. you're logged in there already).
   */
  private async fetchRealCsrfToken(baseUrl: string): Promise<string> {
    const response = await fetch(`${baseUrl}/services/csrf-token`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    const json = await response.json();
    if (!json?.success || !json?.value?.token) {
      throw new Error(`Failed to fetch CSRF token: ${JSON.stringify(json)}`);
    }
    return json.value.token as string;
  }

  /** Populates the CSRF Token field from the real csrf-token endpoint. */
  private async fetchLiveToken() {
    this.liveError = undefined;
    this.liveTokenFetching = true;
    try {
      this.liveCsrfToken = await this.fetchRealCsrfToken(this.liveBaseUrl);
    } catch (err) {
      this.liveError = String(err);
    } finally {
      this.liveTokenFetching = false;
    }
  }

  /**
   * Sends a real PUT/DELETE to a real backend (no mock retrier), so you can
   * confirm the header is both attached correctly and actually accepted by
   * a server whose CORS policy allow-lists X-CSRF-Token. Uses whatever is
   * currently in the CSRF Token field — fetching a fresh one first only if
   * it's still empty — so you can hand-edit the token to a bad value and
   * confirm the backend actually rejects it. When "includeCsrfToken" is
   * unchecked, no token is fetched or attached at all, so you can also
   * confirm the endpoint's real-world behavior without the header.
   */
  private async sendLiveRequest() {
    this.liveError = undefined;
    this.liveResult = undefined;
    this.liveHeaders = undefined;
    this.liveLoading = true;
    try {
      let token = '';
      if (this.liveIncludeCsrfToken) {
        if (!this.liveCsrfToken) {
          this.liveCsrfToken = await this.fetchRealCsrfToken(this.liveBaseUrl);
        }
        token = this.liveCsrfToken;
      }

      const fetchHandler = new FetchHandler({
        apiBaseUrl: this.liveBaseUrl,
        getCsrfToken: async () => token,
      });
      const body = {
        action: this.liveAction,
        identifier: this.liveIdentifier,
        password: this.livePassword,
        'csrf-token': token, // (in-case, existing backend expects it in the body too)
      };

      // fetchApiResponse always sets Accept; Content-Type is set explicitly
      // here (matching ia-verification.ts); X-CSRF-Token is only added when
      // includeCsrfToken is checked — this is exactly what FetchHandler
      // will send.
      this.liveHeaders = [
        ['Accept', 'application/json'],
        ['Content-Type', 'application/json'],
        ...(this.liveIncludeCsrfToken
          ? ([['X-CSRF-Token', token]] as [string, string][])
          : []),
      ];

      this.liveResult = await fetchHandler.fetchApiPathResponse(
        this.liveEndpointPath,
        {
          method: 'POST',
          includeCredentials: true,
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
          includeCsrfToken: this.liveIncludeCsrfToken,
        },
      );
    } catch (err) {
      this.liveError = String(err);
    } finally {
      this.liveLoading = false;
    }
  }

  render() {
    return html`
      <h1>FetchHandler CSRF Demo</h1>
      <p>
        Exercises the CSRF auto-attach logic (<code>getCsrfToken</code> /
        <code>includeCsrfToken</code>) against a captured request instead of a
        real network call, so you can see exactly what FetchHandler would send
        for a given scenario.
      </p>

      <div class="demo-columns">
        <div class="demo-column">
          <section>
            <h2>Scenario checklist</h2>
            <button @click=${this.runAllScenarios}>Run all</button>
            <table>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Run</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                ${SCENARIOS.map((scenario, index) => {
                  const result = this.scenarioResults[index];
                  return html`
                    <tr>
                      <td>${scenario.label}</td>
                      <td>
                        <button @click=${() => this.runScenario(index)}>
                          Run
                        </button>
                      </td>
                      <td>
                        ${
                          result
                            ? html`
                                <span class=${result.pass ? 'pass' : 'fail'}>
                                  ${result.pass ? '✅ PASS' : '❌ FAIL'}
                                </span>
                                <br />
                                <small>
                                  ${
                                    result.actualError
                                      ? `threw: ${result.actualError}`
                                      : result.actualHeaders.length
                                        ? result.actualHeaders
                                            .map(([k, v]) => `${k}: ${v}`)
                                            .join(', ')
                                        : '(no headers)'
                                  }
                                </small>
                              `
                            : html`<em>not run</em>`
                        }
                      </td>
                    </tr>
                  `;
                })}
              </tbody>
            </table>
          </section>

          <section>
            <h2>Manual request</h2>
            <fieldset>
              <legend>Request</legend>
              <label>
                Method:
                <select
                  .value=${this.method}
                  @change=${(e: Event) => {
                    this.method = (e.target as HTMLSelectElement)
                      .value as Method;
                  }}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  .checked=${this.includeCsrfToken}
                  @change=${(e: Event) => {
                    this.includeCsrfToken = (
                      e.target as HTMLInputElement
                    ).checked;
                  }}
                />
                includeCsrfToken
              </label>
              <label>
                Existing X-CSRF-Token header (blank = none):
                <input
                  type="text"
                  .value=${this.existingHeaderValue}
                  @input=${(e: Event) => {
                    this.existingHeaderValue = (
                      e.target as HTMLInputElement
                    ).value;
                  }}
                  placeholder="e.g. manual-token"
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>getCsrfToken() behavior</legend>
              <label>
                <input
                  type="checkbox"
                  .checked=${this.tokenThrows}
                  @change=${(e: Event) => {
                    this.tokenThrows = (e.target as HTMLInputElement).checked;
                  }}
                />
                simulate getCsrfToken() throwing (e.g. token endpoint down)
              </label>
              <label>
                Token value returned:
                <input
                  type="text"
                  .value=${this.tokenValue}
                  @input=${(e: Event) => {
                    this.tokenValue = (e.target as HTMLInputElement).value;
                  }}
                  ?disabled=${this.tokenThrows}
                />
              </label>
            </fieldset>

            <button @click=${this.sendManualRequest}>Send</button>

            ${
              this.manualError
                ? html`<pre class="error">Error: ${this.manualError}</pre>`
                : ''
            }
            ${
              this.manualResult
                ? html`
                    <h3>Resulting request</h3>
                    <p>
                      <strong>${this.manualResult.method}</strong> ${
                        this.manualResult.url
                      }
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th>Header</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.manualResult.headers.map(
                          ([k, v]) =>
                            html`<tr>
                              <td>${k}</td>
                              <td>${v}</td>
                            </tr>`,
                        )}
                      </tbody>
                    </table>
                    ${
                      this.manualResult.headers.some(
                        ([k]) => k.toLowerCase() === 'x-csrf-token',
                      )
                        ? html`<p class="pass">✅ X-CSRF-Token attached</p>`
                        : html`<p class="skip">
                            ⏭️ No X-CSRF-Token header sent
                          </p>`
                    }
                  `
                : ''
            }
          </section>
        </div>

        <div class="demo-column">
          <section>
            <h2>Live request (real network call)</h2>
            <p>
              Fires an actual request at a real backend — fetches a genuine
              signed CSRF token from that host's
              <code>/services/csrf-token</code>, then POSTs to the account
              settings service (matching <code>ia-verification.ts</code>'s
              <code>verifyIAPassword()</code> call) with
              <code>includeCsrfToken: true</code>. Requires you to already be
              logged in to the target host in this browser (session cookie).
            </p>
            <fieldset>
              <legend>Target</legend>
              <label>
                Base URL:
                <input
                  type="text"
                  size="50"
                  .value=${this.liveBaseUrl}
                  @input=${(e: Event) => {
                    this.liveBaseUrl = (e.target as HTMLInputElement).value;
                  }}
                />
              </label>
              <label>
                Endpoint path:
                <input
                  type="text"
                  size="30"
                  .value=${this.liveEndpointPath}
                  @input=${(e: Event) => {
                    this.liveEndpointPath = (
                      e.target as HTMLInputElement
                    ).value;
                  }}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  .checked=${this.liveIncludeCsrfToken}
                  @change=${(e: Event) => {
                    this.liveIncludeCsrfToken = (
                      e.target as HTMLInputElement
                    ).checked;
                  }}
                />
                includeCsrfToken (uncheck to simulate sending without a token)
              </label>
              <label>
                Action:
                <input
                  type="text"
                  .value=${this.liveAction}
                  @input=${(e: Event) => {
                    this.liveAction = (e.target as HTMLInputElement).value;
                  }}
                />
              </label>
              <label>
                Identifier:
                <input
                  type="text"
                  .value=${this.liveIdentifier}
                  @input=${(e: Event) => {
                    this.liveIdentifier = (e.target as HTMLInputElement).value;
                  }}
                />
              </label>
              <label>
                Password:
                <input
                  type="text"
                  .value=${this.livePassword}
                  @input=${(e: Event) => {
                    this.livePassword = (e.target as HTMLInputElement).value;
                  }}
                />
              </label>
            </fieldset>

            <fieldset ?disabled=${!this.liveIncludeCsrfToken}>
              <legend>CSRF Token</legend>
              <label>
                X-CSRF-Token:
                <input
                  type="text"
                  size="50"
                  .value=${this.liveCsrfToken}
                  @input=${(e: Event) => {
                    this.liveCsrfToken = (e.target as HTMLInputElement).value;
                  }}
                  placeholder="fetched automatically, or edit to test a bad token"
                />
              </label>
              <button
                @click=${this.fetchLiveToken}
                ?disabled=${this.liveTokenFetching}
              >
                ${this.liveTokenFetching ? 'Fetching…' : 'Fetch token'}
              </button>
              <small>
                Auto-fetched from <code>/services/csrf-token</code> on Send if
                left blank. Edit it to send a bad/expired token and confirm the
                backend actually rejects it.
                ${
                  !this.liveIncludeCsrfToken
                    ? html`<br /><strong
                          >includeCsrfToken is unchecked — no token will be
                          sent.</strong
                        >`
                    : ''
                }
              </small>
            </fieldset>

            <button
              @click=${this.sendLiveRequest}
              ?disabled=${this.liveLoading}
            >
              ${this.liveLoading ? 'Sending…' : 'Send live request'}
            </button>

            ${
              this.liveError
                ? html`<pre class="error">Error: ${this.liveError}</pre>`
                : ''
            }
            ${
              this.liveHeaders
                ? html`
                    <h3>Request headers sent</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Header</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.liveHeaders.map(
                          ([k, v]) =>
                            html`<tr>
                              <td>${k}</td>
                              <td>${v}</td>
                            </tr>`,
                        )}
                      </tbody>
                    </table>
                    <p>
                      <small>
                        Value came from the CSRF Token field above (auto-fetched
                        from
                        <code>${this.liveBaseUrl}/services/csrf-token</code>
                        unless you edited it).
                      </small>
                    </p>
                  `
                : ''
            }
            ${
              this.liveResult !== undefined
                ? html`
                    <h3>Response</h3>
                    <pre>${JSON.stringify(this.liveResult, null, 2)}</pre>
                  `
                : ''
            }
          </section>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .demo-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      align-items: start;
    }

    @media (max-width: 900px) {
      .demo-columns {
        grid-template-columns: 1fr;
      }
    }

    section {
      margin-bottom: 32px;
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
      vertical-align: top;
    }

    .pass {
      color: #0a7a0a;
    }

    .fail {
      color: #b00020;
    }

    .skip {
      color: #666;
    }

    .error {
      color: #b00020;
      white-space: pre-wrap;
    }
  `;
}
