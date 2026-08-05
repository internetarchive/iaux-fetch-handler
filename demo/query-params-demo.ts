import { html, LitElement, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { FetchHandler } from '../src/fetch-handler';
import type { QueryParams, QueryParamsProvider } from '../src/fetch-options';
import { CapturingFetchRetrier } from './capturing-fetch-retrier';

const API_BASE_URL = 'https://example.org';

/** The entry points a caller can reach query params through. */
type Method = 'fetchApiPathResponse' | 'fetchApiResponse' | 'fetch';

/** Which handler-wide `queryParams` the host is standing in for. */
type HostParams = 'none' | 'always' | 'scoped';

/**
 * The forms the handler-wide option takes. A host uses this to inject its own
 * ambient params, such as `reCache=1`. The function form is called per
 * request, so params can be scoped to the urls they belong on.
 */
const HOST_PARAMS: Record<HostParams, QueryParamsProvider | undefined> = {
  none: undefined,
  always: { reCache: '1' },
  scoped: url => (url.startsWith(API_BASE_URL) ? { reCache: '1' } : undefined),
};

/** The handler-wide option written the way it would appear in source. */
const HOST_PARAMS_SOURCE: Record<HostParams, string> = {
  none: '',
  always: `{ reCache: '1' }`,
  scoped: `url =>\n    url.startsWith('${API_BASE_URL}') ? { reCache: '1' } : undefined`,
};

/**
 * Which of the two `QueryParams` shapes to send. The record form carries
 * non-string values, including the `undefined`/`null` that get dropped.
 * `URLSearchParams` is the form that lets a key repeat.
 */
type ParamsForm = 'record' | 'searchParams';

/** `undefined` and `null` can't be typed into a text box, so they're a kind. */
type ValueKind = 'string' | 'number' | 'boolean' | 'undefined' | 'null';

type ParamRow = { key: string; value: string; kind: ValueKind };

type Scenario = {
  label: string;
  method: Method;
  target: string;
  params?: QueryParams;
  hostParams?: HostParams;
  expectedUrl: string;
};

type ScenarioResult = { actualUrl: string; pass: boolean; error?: string };

/** A `URLSearchParams` built from pairs, so a key can appear more than once. */
function searchParamsFrom(pairs: [string, string][]): URLSearchParams {
  const params = new URLSearchParams();
  pairs.forEach(([key, value]) => params.append(key, value));
  return params;
}

/** The row's value in the type its kind names. */
function rowValue(row: ParamRow): string | number | boolean | null | undefined {
  switch (row.kind) {
    case 'number':
      return Number(row.value);
    case 'boolean':
      return row.value.trim() === 'true';
    case 'undefined':
      return undefined;
    case 'null':
      return null;
    default:
      return row.value;
  }
}

/** The row's value written the way it would appear in source. */
function describeValue(row: ParamRow): string {
  switch (row.kind) {
    case 'number':
      return String(Number(row.value));
    case 'boolean':
      return String(row.value.trim() === 'true');
    case 'undefined':
      return 'undefined';
    case 'null':
      return 'null';
    default:
      return `'${row.value}'`;
  }
}

/** Quotes a key that isn't a bare identifier, for the source preview. */
function describeKey(key: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : `'${key}'`;
}

const DEFAULT_TARGETS: Record<Method, string> = {
  fetchApiPathResponse: '/services/content-flags/',
  fetchApiResponse: `${API_BASE_URL}/services/content-flags/`,
  fetch: `${API_BASE_URL}/download/goody/page1.jpg?scale=2`,
};

const SCENARIOS: Scenario[] = [
  {
    label: 'Values are URL-encoded',
    method: 'fetchApiPathResponse',
    target: '/search',
    params: { q: 'hello world', 'a&b': 'c=d' },
    expectedUrl: `${API_BASE_URL}/search?q=hello+world&a%26b=c%3Dd`,
  },
  {
    label: 'undefined and null values are dropped',
    method: 'fetchApiPathResponse',
    target: '/services/content-flags/',
    params: { identifier: 'goody', mediatype: undefined, collection: null },
    expectedUrl: `${API_BASE_URL}/services/content-flags/?identifier=goody`,
  },
  {
    label: 'Numbers and booleans are stringified',
    method: 'fetchApiPathResponse',
    target: '/search',
    params: { page: 2, debug: true },
    expectedUrl: `${API_BASE_URL}/search?page=2&debug=true`,
  },
  {
    label: 'Params already on the target are kept',
    method: 'fetchApiPathResponse',
    target: '/search?q=cats',
    params: { rows: 10 },
    expectedUrl: `${API_BASE_URL}/search?q=cats&rows=10`,
  },
  {
    label: 'A param of the same name is replaced, not repeated',
    method: 'fetchApiPathResponse',
    target: '/search?q=cats',
    params: { q: 'dogs' },
    expectedUrl: `${API_BASE_URL}/search?q=dogs`,
  },
  {
    label: 'URLSearchParams repeats a key',
    method: 'fetchApiPathResponse',
    target: '/services/content-flags/',
    params: searchParamsFrom([
      ['flag', 'spam'],
      ['flag', 'violence'],
    ]),
    expectedUrl: `${API_BASE_URL}/services/content-flags/?flag=spam&flag=violence`,
  },
  {
    label:
      'A repeated key replaces what the target had, it does not stack on it',
    method: 'fetchApiPathResponse',
    target: '/search?flag=old',
    params: searchParamsFrom([
      ['flag', 'spam'],
      ['flag', 'violence'],
    ]),
    expectedUrl: `${API_BASE_URL}/search?flag=spam&flag=violence`,
  },
  {
    label: 'A fragment stays at the end',
    method: 'fetchApiPathResponse',
    target: '/details/goody#reviews',
    params: { q: 'cats' },
    expectedUrl: `${API_BASE_URL}/details/goody?q=cats#reviews`,
  },
  {
    label:
      'A relative url stays relative instead of resolving against the page',
    method: 'fetchApiResponse',
    target: '/local/api',
    params: { q: 'cats' },
    expectedUrl: '/local/api?q=cats',
  },
  {
    label: 'fetch() takes queryParams too',
    method: 'fetch',
    target: `${API_BASE_URL}/download/goody/page1.jpg?scale=2`,
    params: { reCache: '1' },
    expectedUrl: `${API_BASE_URL}/download/goody/page1.jpg?scale=2&reCache=1`,
  },
  {
    label: 'A host param and a per-request param coexist',
    method: 'fetchApiPathResponse',
    target: '/search',
    params: { q: 'cats' },
    hostParams: 'always',
    expectedUrl: `${API_BASE_URL}/search?reCache=1&q=cats`,
  },
  {
    label: 'A host param reaches fetch() as well',
    method: 'fetch',
    target: `${API_BASE_URL}/download/goody/page1.jpg?scale=2`,
    hostParams: 'always',
    expectedUrl: `${API_BASE_URL}/download/goody/page1.jpg?scale=2&reCache=1`,
  },
  {
    label: 'A per-request param overrides the host param',
    method: 'fetchApiPathResponse',
    target: '/search',
    params: { reCache: '0' },
    hostParams: 'always',
    expectedUrl: `${API_BASE_URL}/search?reCache=0`,
  },
  {
    label: 'A host param replaces one already on the url',
    method: 'fetch',
    target: `${API_BASE_URL}/search?reCache=0`,
    hostParams: 'always',
    expectedUrl: `${API_BASE_URL}/search?reCache=1`,
  },
  {
    label: 'A scoped host param is left off a url it does not match',
    method: 'fetchApiResponse',
    target: 'https://third-party.org/api',
    hostParams: 'scoped',
    expectedUrl: 'https://third-party.org/api',
  },
  {
    label: 'A scoped host param is added to a url it does match',
    method: 'fetchApiPathResponse',
    target: '/search',
    hostParams: 'scoped',
    expectedUrl: `${API_BASE_URL}/search?reCache=1`,
  },
];

@customElement('query-params-demo')
export class QueryParamsDemo extends LitElement {
  @state() private method: Method = 'fetchApiPathResponse';

  @state() private target = DEFAULT_TARGETS.fetchApiPathResponse;

  @state() private paramsForm: ParamsForm = 'record';

  @state() private rows: ParamRow[] = [
    { key: 'identifier', value: 'goody', kind: 'string' },
    { key: 'mediatype', value: '', kind: 'undefined' },
  ];

  @state() private hostParams: HostParams = 'none';

  @state() private result?: { call: string; url: string };

  @state() private error?: string;

  @state() private scenarioResults: Record<number, ScenarioResult> = {};

  /** A handler set up the way a host with ambient params would build one. */
  private buildHandler(hostParams: HostParams): {
    handler: FetchHandler;
    retrier: CapturingFetchRetrier;
  } {
    const retrier = new CapturingFetchRetrier();
    const handler = new FetchHandler({
      apiBaseUrl: API_BASE_URL,
      fetchRetrier: retrier,
      queryParams: HOST_PARAMS[hostParams],
    });
    return { handler, retrier };
  }

  /** Runs one call and returns the url FetchHandler would have requested. */
  private async capturedUrl(
    method: Method,
    target: string,
    params: QueryParams | undefined,
    hostParams: HostParams,
  ): Promise<string> {
    const { handler, retrier } = this.buildHandler(hostParams);
    if (method === 'fetch') {
      await handler.fetch(target, { queryParams: params });
    } else if (method === 'fetchApiResponse') {
      await handler.fetchApiResponse(target, { queryParams: params });
    } else {
      await handler.fetchApiPathResponse(target, { queryParams: params });
    }
    return retrier.lastUrl;
  }

  /** Rows with a key, which are the only ones that produce a param. */
  private activeRows(): ParamRow[] {
    return this.rows.filter(row => row.key.trim() !== '');
  }

  private buildQueryParams(): QueryParams {
    const rows = this.activeRows();
    if (this.paramsForm === 'searchParams') {
      return searchParamsFrom(rows.map(row => [row.key, row.value]));
    }
    const record: Record<string, string | number | boolean | null | undefined> =
      {};
    rows.forEach(row => {
      record[row.key] = rowValue(row);
    });
    return record;
  }

  /** The equivalent source for whatever the controls are currently set to. */
  private describeCall(): string {
    const rows = this.activeRows();
    const params =
      this.paramsForm === 'searchParams'
        ? `new URLSearchParams([${rows
            .map(row => `['${row.key}', '${row.value}']`)
            .join(', ')}])`
        : `{ ${rows
            .map(row => `${describeKey(row.key)}: ${describeValue(row)}`)
            .join(', ')} }`;
    const construction =
      this.hostParams === 'none'
        ? ''
        : `const fetchHandler = new FetchHandler({\n  apiBaseUrl: '${API_BASE_URL}',\n  queryParams: ${
            HOST_PARAMS_SOURCE[this.hostParams]
          },\n})\n\n`;
    return `${construction}fetchHandler.${this.method}('${this.target}', {\n  queryParams: ${params},\n})`;
  }

  private async run() {
    this.error = undefined;
    this.result = undefined;
    const call = this.describeCall();
    try {
      const url = await this.capturedUrl(
        this.method,
        this.target,
        this.buildQueryParams(),
        this.hostParams,
      );
      this.result = { call, url };
    } catch (err) {
      this.error = String(err);
    }
  }

  private async runScenario(index: number) {
    const scenario = SCENARIOS[index];
    let result: ScenarioResult;
    try {
      const actualUrl = await this.capturedUrl(
        scenario.method,
        scenario.target,
        scenario.params,
        scenario.hostParams ?? 'none',
      );
      result = { actualUrl, pass: actualUrl === scenario.expectedUrl };
    } catch (err) {
      result = { actualUrl: '', pass: false, error: String(err) };
    }
    this.scenarioResults = { ...this.scenarioResults, [index]: result };
  }

  private async runAllScenarios() {
    for (let index = 0; index < SCENARIOS.length; index += 1) {
      await this.runScenario(index);
    }
  }

  private updateRow(index: number, patch: Partial<ParamRow>) {
    this.rows = this.rows.map((row, i) =>
      i === index ? { ...row, ...patch } : row,
    );
  }

  private addRow() {
    this.rows = [...this.rows, { key: '', value: '', kind: 'string' }];
  }

  private removeRow(index: number) {
    this.rows = this.rows.filter((_row, i) => i !== index);
  }

  private renderParamsEditor() {
    const showKinds = this.paramsForm === 'record';
    return html`
      <fieldset>
        <legend>queryParams</legend>
        <label>
          Form:
          <select
            .value=${this.paramsForm}
            @change=${(e: Event) => {
              this.paramsForm = (e.target as HTMLSelectElement)
                .value as ParamsForm;
            }}
          >
            <option value="record">Record (values can be any type)</option>
            <option value="searchParams">
              URLSearchParams (a key can repeat)
            </option>
          </select>
        </label>
        ${
          showKinds
            ? ''
            : html`<p class="note">
                Every <code>URLSearchParams</code> value is a string, so the
                value type doesn't apply here.
              </p>`
        }

        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              ${showKinds ? html`<th>Value type</th>` : ''}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.rows.map(
              (row, index) => html`
                <tr>
                  <td>
                    <input
                      type="text"
                      aria-label="Param ${index + 1} key"
                      .value=${row.key}
                      @input=${(e: Event) =>
                        this.updateRow(index, {
                          key: (e.target as HTMLInputElement).value,
                        })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      aria-label="Param ${index + 1} value"
                      ?disabled=${
                        showKinds &&
                        (row.kind === 'undefined' || row.kind === 'null')
                      }
                      .value=${row.value}
                      @input=${(e: Event) =>
                        this.updateRow(index, {
                          value: (e.target as HTMLInputElement).value,
                        })}
                    />
                  </td>
                  ${
                    showKinds
                      ? html`
                          <td>
                            <select
                              aria-label="Param ${index + 1} value type"
                              .value=${row.kind}
                              @change=${(e: Event) =>
                                this.updateRow(index, {
                                  kind: (e.target as HTMLSelectElement)
                                    .value as ValueKind,
                                })}
                            >
                              <option value="string">string</option>
                              <option value="number">number</option>
                              <option value="boolean">boolean</option>
                              <option value="undefined">undefined</option>
                              <option value="null">null</option>
                            </select>
                          </td>
                        `
                      : ''
                  }
                  <td>
                    <button @click=${() => this.removeRow(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              `,
            )}
          </tbody>
        </table>
        <button @click=${this.addRow}>Add param</button>
      </fieldset>
    `;
  }

  private renderPlayground() {
    return html`
      <fieldset>
        <legend>Build a request</legend>
        <label>
          Method:
          <select
            .value=${this.method}
            @change=${(e: Event) => {
              this.method = (e.target as HTMLSelectElement).value as Method;
              this.target = DEFAULT_TARGETS[this.method];
              this.result = undefined;
              this.error = undefined;
            }}
          >
            <option value="fetchApiPathResponse">
              fetchApiPathResponse(path, options)
            </option>
            <option value="fetchApiResponse">
              fetchApiResponse(url, options)
            </option>
            <option value="fetch">fetch(request, options)</option>
          </select>
        </label>
        <label>
          ${this.method === 'fetchApiPathResponse' ? 'Path' : 'URL'}:
          <input
            type="text"
            size="60"
            .value=${this.target}
            @input=${(e: Event) => {
              this.target = (e.target as HTMLInputElement).value;
            }}
          />
        </label>
        <label>
          Host <code>queryParams</code>:
          <select
            .value=${this.hostParams}
            @change=${(e: Event) => {
              this.hostParams = (e.target as HTMLSelectElement)
                .value as HostParams;
            }}
          >
            <option value="none">None</option>
            <option value="always">{ reCache: '1' } on every request</option>
            <option value="scoped">
              Function, so only ${API_BASE_URL} urls get it
            </option>
          </select>
        </label>
        <p class="note">
          Handler-wide params, passed to the constructor. This is where a host
          puts the params it wants on every request it makes, such as
          <code>reCache=1</code>.
        </p>
      </fieldset>

      ${this.renderParamsEditor()}

      <button @click=${this.run}>Show url</button>
      ${this.error ? html`<p class="fail">${this.error}</p>` : ''}
      ${
        this.result
          ? html`
              <h3>Result</h3>
              <pre>${this.result.call}</pre>
              <p>Requests <code class="url">${this.result.url}</code></p>
            `
          : ''
      }
    `;
  }

  private renderScenarios() {
    return html`
      <h3>Scenarios</h3>
      <p>
        The cases the unit tests cover, run here against the real
        <code>FetchHandler</code>.
      </p>
      <button @click=${this.runAllScenarios}>Run all</button>
      <table>
        <thead>
          <tr>
            <th>Case</th>
            <th>Expected url</th>
            <th>Actual url</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          ${SCENARIOS.map((scenario, index) => {
            const result = this.scenarioResults[index];
            return html`
              <tr>
                <td>${scenario.label}</td>
                <td><code>${scenario.expectedUrl}</code></td>
                <td>
                  <code>${result?.error ?? result?.actualUrl ?? ''}</code>
                </td>
                <td class=${result ? (result.pass ? 'pass' : 'fail') : ''}>
                  ${
                    result
                      ? result.pass
                        ? '✅'
                        : '❌'
                      : html`<button @click=${() => this.runScenario(index)}>
                          Run
                        </button>`
                  }
                </td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }

  render() {
    return html`
      <h1>Query Params Demo</h1>
      <p>
        Shows the url <code>FetchHandler</code> would request for a given
        <code>queryParams</code> value. Nothing goes over the network: the
        handler is built with a capturing <code>fetchRetrier</code>, so what you
        see is the url the retrier was handed. <code>apiBaseUrl</code> is
        <code>${API_BASE_URL}</code>.
      </p>
      ${this.renderPlayground()} ${this.renderScenarios()}
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      padding: 20px;
      max-width: 1100px;
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
      margin-bottom: 8px;
    }

    th,
    td {
      border: 1px solid #ccc;
      padding: 6px 10px;
      text-align: left;
      vertical-align: top;
    }

    td code {
      word-break: break-all;
    }

    pre {
      background: #f5f5f5;
      padding: 10px;
      overflow-x: auto;
    }

    code.url {
      word-break: break-all;
      font-weight: bold;
    }

    .note {
      color: #555;
    }

    .pass {
      color: #0a7a0a;
    }

    .fail {
      color: #b00020;
    }
  `;
}
