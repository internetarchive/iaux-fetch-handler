import{i as f,a as g,_ as c,t as v}from"./fetch-retrier-DQgSUyIF.js";import{b as n}from"../app-root.js";import{r as h}from"./state-iAArRRY0.js";import{F as y}from"./fetch-handler-C6dqLdOT.js";import{C as b}from"./capturing-fetch-retrier-BBldue10.js";const r="https://example.org",$={none:void 0,always:{reCache:"1"},scoped:l=>l.startsWith(r)?{reCache:"1"}:void 0},P={none:"",always:"{ reCache: '1' }",scoped:`url =>
    url.startsWith('${r}') ? { reCache: '1' } : undefined`};function p(l){const e=new URLSearchParams;return l.forEach(([a,t])=>e.append(a,t)),e}function R(l){switch(l.kind){case"number":return Number(l.value);case"boolean":return l.value.trim()==="true";case"undefined":return;case"null":return null;default:return l.value}}function w(l){switch(l.kind){case"number":return String(Number(l.value));case"boolean":return String(l.value.trim()==="true");case"undefined":return"undefined";case"null":return"null";default:return`'${l.value}'`}}function A(l){return/^[A-Za-z_$][\w$]*$/.test(l)?l:`'${l}'`}const u={fetchApiPathResponse:"/services/content-flags/",fetchApiResponse:`${r}/services/content-flags/`,fetch:`${r}/download/goody/page1.jpg?scale=2`},d=[{label:"Values are URL-encoded",method:"fetchApiPathResponse",target:"/search",params:{q:"hello world","a&b":"c=d"},expectedUrl:`${r}/search?q=hello+world&a%26b=c%3Dd`},{label:"undefined and null values are dropped",method:"fetchApiPathResponse",target:"/services/content-flags/",params:{identifier:"goody",mediatype:void 0,collection:null},expectedUrl:`${r}/services/content-flags/?identifier=goody`},{label:"Numbers and booleans are stringified",method:"fetchApiPathResponse",target:"/search",params:{page:2,debug:!0},expectedUrl:`${r}/search?page=2&debug=true`},{label:"Params already on the target are kept",method:"fetchApiPathResponse",target:"/search?q=cats",params:{rows:10},expectedUrl:`${r}/search?q=cats&rows=10`},{label:"A param of the same name is replaced, not repeated",method:"fetchApiPathResponse",target:"/search?q=cats",params:{q:"dogs"},expectedUrl:`${r}/search?q=dogs`},{label:"URLSearchParams repeats a key",method:"fetchApiPathResponse",target:"/services/content-flags/",params:p([["flag","spam"],["flag","violence"]]),expectedUrl:`${r}/services/content-flags/?flag=spam&flag=violence`},{label:"A repeated key replaces what the target had, it does not stack on it",method:"fetchApiPathResponse",target:"/search?flag=old",params:p([["flag","spam"],["flag","violence"]]),expectedUrl:`${r}/search?flag=spam&flag=violence`},{label:"A fragment stays at the end",method:"fetchApiPathResponse",target:"/details/goody#reviews",params:{q:"cats"},expectedUrl:`${r}/details/goody?q=cats#reviews`},{label:"A relative url stays relative instead of resolving against the page",method:"fetchApiResponse",target:"/local/api",params:{q:"cats"},expectedUrl:"/local/api?q=cats"},{label:"fetch() takes queryParams too",method:"fetch",target:`${r}/download/goody/page1.jpg?scale=2`,params:{reCache:"1"},expectedUrl:`${r}/download/goody/page1.jpg?scale=2&reCache=1`},{label:"A host param and a per-request param coexist",method:"fetchApiPathResponse",target:"/search",params:{q:"cats"},hostParams:"always",expectedUrl:`${r}/search?reCache=1&q=cats`},{label:"A host param reaches fetch() as well",method:"fetch",target:`${r}/download/goody/page1.jpg?scale=2`,hostParams:"always",expectedUrl:`${r}/download/goody/page1.jpg?scale=2&reCache=1`},{label:"A per-request param overrides the host param",method:"fetchApiPathResponse",target:"/search",params:{reCache:"0"},hostParams:"always",expectedUrl:`${r}/search?reCache=0`},{label:"A host param replaces one already on the url",method:"fetch",target:`${r}/search?reCache=0`,hostParams:"always",expectedUrl:`${r}/search?reCache=1`},{label:"A scoped host param is left off a url it does not match",method:"fetchApiResponse",target:"https://third-party.org/api",hostParams:"scoped",expectedUrl:"https://third-party.org/api"},{label:"A scoped host param is added to a url it does match",method:"fetchApiPathResponse",target:"/search",hostParams:"scoped",expectedUrl:`${r}/search?reCache=1`}];let i=class extends f{constructor(){super(...arguments),this.method="fetchApiPathResponse",this.target=u.fetchApiPathResponse,this.paramsForm="record",this.rows=[{key:"identifier",value:"goody",kind:"string"},{key:"mediatype",value:"",kind:"undefined"}],this.hostParams="none",this.scenarioResults={}}buildHandler(e){const a=new b;return{handler:new y({apiBaseUrl:r,fetchRetrier:a,queryParams:$[e]}),retrier:a}}async capturedUrl(e,a,t,s){const{handler:o,retrier:m}=this.buildHandler(s);return e==="fetch"?await o.fetch(a,{queryParams:t}):e==="fetchApiResponse"?await o.fetchApiResponse(a,{queryParams:t}):await o.fetchApiPathResponse(a,{queryParams:t}),m.lastUrl}activeRows(){return this.rows.filter(e=>e.key.trim()!=="")}buildQueryParams(){const e=this.activeRows();if(this.paramsForm==="searchParams")return p(e.map(t=>[t.key,t.value]));const a={};return e.forEach(t=>{a[t.key]=R(t)}),a}describeCall(){const e=this.activeRows(),a=this.paramsForm==="searchParams"?`new URLSearchParams([${e.map(s=>`['${s.key}', '${s.value}']`).join(", ")}])`:`{ ${e.map(s=>`${A(s.key)}: ${w(s)}`).join(", ")} }`;return`${this.hostParams==="none"?"":`const fetchHandler = new FetchHandler({
  apiBaseUrl: '${r}',
  queryParams: ${P[this.hostParams]},
})

`}fetchHandler.${this.method}('${this.target}', {
  queryParams: ${a},
})`}async run(){this.error=void 0,this.result=void 0;const e=this.describeCall();try{const a=await this.capturedUrl(this.method,this.target,this.buildQueryParams(),this.hostParams);this.result={call:e,url:a}}catch(a){this.error=String(a)}}async runScenario(e){var a;const t=d[e];let s;try{const o=await this.capturedUrl(t.method,t.target,t.params,(a=t.hostParams)!==null&&a!==void 0?a:"none");s={actualUrl:o,pass:o===t.expectedUrl}}catch(o){s={actualUrl:"",pass:!1,error:String(o)}}this.scenarioResults={...this.scenarioResults,[e]:s}}async runAllScenarios(){for(let e=0;e<d.length;e+=1)await this.runScenario(e)}updateRow(e,a){this.rows=this.rows.map((t,s)=>s===e?{...t,...a}:t)}addRow(){this.rows=[...this.rows,{key:"",value:"",kind:"string"}]}removeRow(e){this.rows=this.rows.filter((a,t)=>t!==e)}renderParamsEditor(){const e=this.paramsForm==="record";return n`
      <fieldset>
        <legend>queryParams</legend>
        <label>
          Form:
          <select
            .value=${this.paramsForm}
            @change=${a=>{this.paramsForm=a.target.value}}
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
            ${this.rows.map((a,t)=>n`
                <tr>
                  <td>
                    <input
                      type="text"
                      aria-label="Param ${t+1} key"
                      .value=${a.key}
                      @input=${s=>this.updateRow(t,{key:s.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      aria-label="Param ${t+1} value"
                      ?disabled=${e&&(a.kind==="undefined"||a.kind==="null")}
                      .value=${a.value}
                      @input=${s=>this.updateRow(t,{value:s.target.value})}
                    />
                  </td>
                  ${e?n`
                          <td>
                            <select
                              aria-label="Param ${t+1} value type"
                              .value=${a.kind}
                              @change=${s=>this.updateRow(t,{kind:s.target.value})}
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
                    <button @click=${()=>this.removeRow(t)}>
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
            @change=${e=>{this.method=e.target.value,this.target=u[this.method],this.result=void 0,this.error=void 0}}
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
              Function, so only ${r} urls get it
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
      ${this.error?n`<p class="fail">${this.error}</p>`:""}
      ${this.result?n`
              <h3>Result</h3>
              <pre>${this.result.call}</pre>
              <p>Requests <code class="url">${this.result.url}</code></p>
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
          ${d.map((e,a)=>{var t,s;const o=this.scenarioResults[a];return n`
              <tr>
                <td>${e.label}</td>
                <td><code>${e.expectedUrl}</code></td>
                <td>
                  <code>${(s=(t=o==null?void 0:o.error)!==null&&t!==void 0?t:o==null?void 0:o.actualUrl)!==null&&s!==void 0?s:""}</code>
                </td>
                <td class=${o?o.pass?"pass":"fail":""}>
                  ${o?o.pass?"✅":"❌":n`<button @click=${()=>this.runScenario(a)}>
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
        <code>${r}</code>.
      </p>
      ${this.renderPlayground()} ${this.renderScenarios()}
    `}};i.styles=g`
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
  `;c([h()],i.prototype,"method",void 0);c([h()],i.prototype,"target",void 0);c([h()],i.prototype,"paramsForm",void 0);c([h()],i.prototype,"rows",void 0);c([h()],i.prototype,"hostParams",void 0);c([h()],i.prototype,"result",void 0);c([h()],i.prototype,"error",void 0);c([h()],i.prototype,"scenarioResults",void 0);i=c([v("query-params-demo")],i);export{i as QueryParamsDemo};
