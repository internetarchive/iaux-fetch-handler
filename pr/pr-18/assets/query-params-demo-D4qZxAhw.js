import{i as y,a as v,_ as h,t as $}from"./fetch-retrier-DQgSUyIF.js";import{b as n}from"../app-root.js";import{r as c}from"./state-iAArRRY0.js";import{F as R}from"./fetch-handler-C6dqLdOT.js";import{C as P}from"./capturing-fetch-retrier-BwzJCKns.js";var u;const s="https://example.org",w={none:void 0,always:{reCache:"1"},scoped:l=>l.startsWith(s)?{reCache:"1"}:void 0},A={none:"",always:"{ reCache: '1' }",scoped:`url =>
    url.startsWith('${s}') ? { reCache: '1' } : undefined`};function m(l){const e=new URLSearchParams;return l.forEach(([t,a])=>e.append(t,a)),e}function q(l){switch(l.kind){case"number":return Number(l.value);case"boolean":return l.value.trim()==="true";case"undefined":return;case"null":return null;default:return l.value}}function k(l){switch(l.kind){case"number":return String(Number(l.value));case"boolean":return String(l.value.trim()==="true");case"undefined":return"undefined";case"null":return"null";default:return`'${l.value}'`}}function U(l){return/^[A-Za-z_$][\w$]*$/.test(l)?l:`'${l}'`}const f={fetchApiPathResponse:"/services/content-flags/",fetchApiResponse:`${s}/services/content-flags/`,fetch:`${s}/download/goody/page1.jpg?scale=2`},p=[{label:"Values are URL-encoded",method:"fetchApiPathResponse",target:"/search",params:{q:"hello world","a&b":"c=d"},expectedUrl:`${s}/search?q=hello+world&a%26b=c%3Dd`},{label:"undefined and null values are dropped",method:"fetchApiPathResponse",target:"/services/content-flags/",params:{identifier:"goody",mediatype:void 0,collection:null},expectedUrl:`${s}/services/content-flags/?identifier=goody`},{label:"Numbers and booleans are stringified",method:"fetchApiPathResponse",target:"/search",params:{page:2,debug:!0},expectedUrl:`${s}/search?page=2&debug=true`},{label:"Params already on the target are kept",method:"fetchApiPathResponse",target:"/search?q=cats",params:{rows:10},expectedUrl:`${s}/search?q=cats&rows=10`},{label:"A param of the same name is replaced, not repeated",method:"fetchApiPathResponse",target:"/search?q=cats",params:{q:"dogs"},expectedUrl:`${s}/search?q=dogs`},{label:"URLSearchParams repeats a key",method:"fetchApiPathResponse",target:"/services/content-flags/",params:m([["flag","spam"],["flag","violence"]]),expectedUrl:`${s}/services/content-flags/?flag=spam&flag=violence`},{label:"A repeated key replaces what the target had, it does not stack on it",method:"fetchApiPathResponse",target:"/search?flag=old",params:m([["flag","spam"],["flag","violence"]]),expectedUrl:`${s}/search?flag=spam&flag=violence`},{label:"A fragment stays at the end",method:"fetchApiPathResponse",target:"/details/goody#reviews",params:{q:"cats"},expectedUrl:`${s}/details/goody?q=cats#reviews`},{label:"A relative url stays relative instead of resolving against the page",method:"fetchApiResponse",target:"/local/api",params:{q:"cats"},expectedUrl:"/local/api?q=cats"},{label:"fetch() takes queryParams too",method:"fetch",target:`${s}/download/goody/page1.jpg?scale=2`,params:{reCache:"1"},expectedUrl:`${s}/download/goody/page1.jpg?scale=2&reCache=1`},{label:"A host param and a per-request param coexist",method:"fetchApiPathResponse",target:"/search",params:{q:"cats"},hostParams:"always",expectedUrl:`${s}/search?reCache=1&q=cats`},{label:"A host param reaches fetch() as well",method:"fetch",target:`${s}/download/goody/page1.jpg?scale=2`,hostParams:"always",expectedUrl:`${s}/download/goody/page1.jpg?scale=2&reCache=1`},{label:"A per-request param overrides the host param",method:"fetchApiPathResponse",target:"/search",params:{reCache:"0"},hostParams:"always",expectedUrl:`${s}/search?reCache=0`},{label:"A host param replaces one already on the url",method:"fetch",target:`${s}/search?reCache=0`,hostParams:"always",expectedUrl:`${s}/search?reCache=1`},{label:"A scoped host param is left off a url it does not match",method:"fetchApiResponse",target:"https://third-party.org/api",hostParams:"scoped",expectedUrl:"https://third-party.org/api"},{label:"A scoped host param is added to a url it does match",method:"fetchApiPathResponse",target:"/search",hostParams:"scoped",expectedUrl:`${s}/search?reCache=1`}];let i=u=class extends y{constructor(){super(...arguments),this.method="fetchApiPathResponse",this.target=f.fetchApiPathResponse,this.paramsForm="record",this.rows=[{key:"identifier",value:"goody",kind:"string"},{key:"mediatype",value:"",kind:"undefined"}],this.hostParams="none",this.asRequest=!1,this.scenarioResults={}}buildHandler(e){const t=new P;return{handler:new R({apiBaseUrl:s,fetchRetrier:t,queryParams:w[e]}),retrier:t}}static demoRequest(e){return new Request(e,{method:"POST",headers:{"X-Boop":"snoot"},body:"hello"})}async capture(e,t,a,o,r=!1){const{handler:d,retrier:g}=this.buildHandler(o);if(e==="fetch"){const b=r?u.demoRequest(t):t;await d.fetch(b,{queryParams:a})}else e==="fetchApiResponse"?await d.fetchApiResponse(t,{queryParams:a}):await d.fetchApiPathResponse(t,{queryParams:a});return g}activeRows(){return this.rows.filter(e=>e.key.trim()!=="")}buildQueryParams(){const e=this.activeRows();if(this.paramsForm==="searchParams")return m(e.map(a=>[a.key,a.value]));const t={};return e.forEach(a=>{t[a.key]=q(a)}),t}describeCall(){const e=this.activeRows(),t=this.paramsForm==="searchParams"?`new URLSearchParams([${e.map(r=>`['${r.key}', '${r.value}']`).join(", ")}])`:`{ ${e.map(r=>`${U(r.key)}: ${k(r)}`).join(", ")} }`,a=this.hostParams==="none"?"":`const fetchHandler = new FetchHandler({
  apiBaseUrl: '${s}',
  queryParams: ${A[this.hostParams]},
})

`,o=this.method==="fetch"&&this.asRequest?`new Request('${this.target}', {
    method: 'POST',
    headers: { 'X-Boop': 'snoot' },
    body: 'hello',
  })`:`'${this.target}'`;return`${a}fetchHandler.${this.method}(${o}, {
  queryParams: ${t},
})`}async run(){this.error=void 0,this.result=void 0;const e=this.describeCall();try{const t=await this.capture(this.method,this.target,this.buildQueryParams(),this.hostParams,this.asRequest),a=t.lastRequest?`${t.lastRequest.method} with X-Boop: ${t.lastRequest.headers.get("X-Boop")} and body ${JSON.stringify(await t.lastRequest.text())}`:void 0;this.result={call:e,url:t.lastUrl,sent:a}}catch(t){this.error=String(t)}}async runScenario(e){var t;const a=p[e];let o;try{const{lastUrl:r}=await this.capture(a.method,a.target,a.params,(t=a.hostParams)!==null&&t!==void 0?t:"none");o={actualUrl:r,pass:r===a.expectedUrl}}catch(r){o={actualUrl:"",pass:!1,error:String(r)}}this.scenarioResults={...this.scenarioResults,[e]:o}}async runAllScenarios(){for(let e=0;e<p.length;e+=1)await this.runScenario(e)}updateRow(e,t){this.rows=this.rows.map((a,o)=>o===e?{...a,...t}:a)}addRow(){this.rows=[...this.rows,{key:"",value:"",kind:"string"}]}removeRow(e){this.rows=this.rows.filter((t,a)=>a!==e)}renderParamsEditor(){const e=this.paramsForm==="record";return n`
      <fieldset>
        <legend>queryParams</legend>
        <label>
          Form:
          <select
            .value=${this.paramsForm}
            @change=${t=>{this.paramsForm=t.target.value}}
          >
            <option value="record">Record (values can be any type)</option>
            <option value="searchParams">
              URLSearchParams (a key can repeat)
            </option>
          </select>
        </label>
        ${e?"":n`<p class="note">
                Every <code>URLSearchParams</code> value is a string, so the
                value type doesn't apply here.
              </p>`}

        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              ${e?n`<th>Value type</th>`:""}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.rows.map((t,a)=>n`
                <tr>
                  <td>
                    <input
                      type="text"
                      aria-label="Param ${a+1} key"
                      .value=${t.key}
                      @input=${o=>this.updateRow(a,{key:o.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      aria-label="Param ${a+1} value"
                      ?disabled=${e&&(t.kind==="undefined"||t.kind==="null")}
                      .value=${t.value}
                      @input=${o=>this.updateRow(a,{value:o.target.value})}
                    />
                  </td>
                  ${e?n`
                          <td>
                            <select
                              aria-label="Param ${a+1} value type"
                              .value=${t.kind}
                              @change=${o=>this.updateRow(a,{kind:o.target.value})}
                            >
                              <option value="string">string</option>
                              <option value="number">number</option>
                              <option value="boolean">boolean</option>
                              <option value="undefined">undefined</option>
                              <option value="null">null</option>
                            </select>
                          </td>
                        `:""}
                  <td>
                    <button @click=${()=>this.removeRow(a)}>
                      Remove
                    </button>
                  </td>
                </tr>
              `)}
          </tbody>
        </table>
        <button @click=${this.addRow}>Add param</button>
      </fieldset>
    `}renderPlayground(){return n`
      <fieldset>
        <legend>Build a request</legend>
        <label>
          Method:
          <select
            .value=${this.method}
            @change=${e=>{this.method=e.target.value,this.target=f[this.method],this.result=void 0,this.error=void 0}}
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
          ${this.method==="fetchApiPathResponse"?"Path":"URL"}:
          <input
            type="text"
            size="60"
            .value=${this.target}
            @input=${e=>{this.target=e.target.value}}
          />
        </label>
        <label>
          Host <code>queryParams</code>:
          <select
            .value=${this.hostParams}
            @change=${e=>{this.hostParams=e.target.value}}
          >
            <option value="none">None</option>
            <option value="always">{ reCache: '1' } on every request</option>
            <option value="scoped">
              Function, so only ${s} urls get it
            </option>
          </select>
        </label>
        <p class="note">
          Handler-wide params, passed to the constructor. This is where a host
          puts the params it wants on every request it makes, such as
          <code>reCache=1</code>.
        </p>
        ${this.method==="fetch"?n`
                <label>
                  <input
                    type="checkbox"
                    .checked=${this.asRequest}
                    @change=${e=>{this.asRequest=e.target.checked}}
                  />
                  Pass a <code>Request</code> object instead of a url string
                </label>
                <p class="note">
                  Adding params to a <code>Request</code> means rebuilding it,
                  so the result below reports the method, header and body that
                  came out the other side.
                </p>
              `:""}
      </fieldset>

      ${this.renderParamsEditor()}

      <button @click=${this.run}>Show url</button>
      ${this.error?n`<p class="fail">${this.error}</p>`:""}
      ${this.result?n`
              <h3>Result</h3>
              <pre>${this.result.call}</pre>
              <p>Requests <code class="url">${this.result.url}</code></p>
              ${this.result.sent?n`<p>
                      Sent as a <code>Request</code>:
                      <code>${this.result.sent}</code>
                    </p>`:""}
            `:""}
    `}renderScenarios(){return n`
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
          ${p.map((e,t)=>{var a,o;const r=this.scenarioResults[t];return n`
              <tr>
                <td>${e.label}</td>
                <td><code>${e.expectedUrl}</code></td>
                <td>
                  <code>${(o=(a=r==null?void 0:r.error)!==null&&a!==void 0?a:r==null?void 0:r.actualUrl)!==null&&o!==void 0?o:""}</code>
                </td>
                <td class=${r?r.pass?"pass":"fail":""}>
                  ${r?r.pass?"✅":"❌":n`<button @click=${()=>this.runScenario(t)}>
                          Run
                        </button>`}
                </td>
              </tr>
            `})}
        </tbody>
      </table>
    `}render(){return n`
      <h1>Query Params Demo</h1>
      <p>
        Shows the url <code>FetchHandler</code> would request for a given
        <code>queryParams</code> value. Nothing goes over the network: the
        handler is built with a capturing <code>fetchRetrier</code>, so what you
        see is the url the retrier was handed. <code>apiBaseUrl</code> is
        <code>${s}</code>.
      </p>
      ${this.renderPlayground()} ${this.renderScenarios()}
    `}};i.styles=v`
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
  `;h([c()],i.prototype,"method",void 0);h([c()],i.prototype,"target",void 0);h([c()],i.prototype,"paramsForm",void 0);h([c()],i.prototype,"rows",void 0);h([c()],i.prototype,"hostParams",void 0);h([c()],i.prototype,"asRequest",void 0);h([c()],i.prototype,"result",void 0);h([c()],i.prototype,"error",void 0);h([c()],i.prototype,"scenarioResults",void 0);i=u=h([$("query-params-demo")],i);export{i as QueryParamsDemo};
