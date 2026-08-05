import{i as f,a as g,_ as c,t as b}from"./fetch-retrier-DsicMz2C.js";import{b as i}from"../app-root.js";import{r as d}from"./state-fAVG4Avp.js";import{F as v}from"./fetch-handler-DEMXdJoS.js";import{C as y}from"./capturing-fetch-retrier-x1FyT7Jf.js";const s="https://example.org";function p(o){const e=new URLSearchParams;return o.forEach(([a,t])=>e.append(a,t)),e}function $(o){switch(o.kind){case"number":return Number(o.value);case"boolean":return o.value.trim()==="true";case"undefined":return;case"null":return null;default:return o.value}}function R(o){switch(o.kind){case"number":return String(Number(o.value));case"boolean":return String(o.value.trim()==="true");case"undefined":return"undefined";case"null":return"null";default:return`'${o.value}'`}}function w(o){return/^[A-Za-z_$][\w$]*$/.test(o)?o:`'${o}'`}const u={fetchApiPathResponse:"/services/content-flags/",fetchApiResponse:`${s}/services/content-flags/`,fetch:`${s}/download/goody/page1.jpg?scale=2`},h=[{label:"Values are URL-encoded",method:"fetchApiPathResponse",target:"/search",params:{q:"hello world","a&b":"c=d"},expectedUrl:`${s}/search?q=hello+world&a%26b=c%3Dd`},{label:"undefined and null values are dropped",method:"fetchApiPathResponse",target:"/services/content-flags/",params:{identifier:"goody",mediatype:void 0,collection:null},expectedUrl:`${s}/services/content-flags/?identifier=goody`},{label:"Numbers and booleans are stringified",method:"fetchApiPathResponse",target:"/search",params:{page:2,debug:!0},expectedUrl:`${s}/search?page=2&debug=true`},{label:"Params already on the target are kept",method:"fetchApiPathResponse",target:"/search?q=cats",params:{rows:10},expectedUrl:`${s}/search?q=cats&rows=10`},{label:"A param of the same name is replaced, not repeated",method:"fetchApiPathResponse",target:"/search?q=cats",params:{q:"dogs"},expectedUrl:`${s}/search?q=dogs`},{label:"URLSearchParams repeats a key",method:"fetchApiPathResponse",target:"/services/content-flags/",params:p([["flag","spam"],["flag","violence"]]),expectedUrl:`${s}/services/content-flags/?flag=spam&flag=violence`},{label:"A repeated key replaces what the target had, it does not stack on it",method:"fetchApiPathResponse",target:"/search?flag=old",params:p([["flag","spam"],["flag","violence"]]),expectedUrl:`${s}/search?flag=spam&flag=violence`},{label:"A fragment stays at the end",method:"fetchApiPathResponse",target:"/details/goody#reviews",params:{q:"cats"},expectedUrl:`${s}/details/goody?q=cats#reviews`},{label:"A relative url stays relative instead of resolving against the page",method:"fetchApiResponse",target:"/local/api",params:{q:"cats"},expectedUrl:"/local/api?q=cats"},{label:"queryParams and reCache=1 coexist",method:"fetchApiPathResponse",target:"/search",params:{q:"cats"},reCache:!0,expectedUrl:`${s}/search?q=cats&reCache=1`},{label:"fetch() takes no queryParams, so the url goes in as typed",method:"fetch",target:`${s}/download/goody/page1.jpg?scale=2`,expectedUrl:`${s}/download/goody/page1.jpg?scale=2`},{label:"fetch() still merges reCache=1 into a url you built yourself",method:"fetch",target:`${s}/download/goody/page1.jpg?scale=2`,reCache:!0,expectedUrl:`${s}/download/goody/page1.jpg?scale=2&reCache=1`}];let n=class extends f{constructor(){super(...arguments),this.method="fetchApiPathResponse",this.target=u.fetchApiPathResponse,this.paramsForm="record",this.rows=[{key:"identifier",value:"goody",kind:"string"},{key:"mediatype",value:"",kind:"undefined"}],this.reCache=!1,this.scenarioResults={}}buildHandler(e){const a=new y;return{handler:new v({apiBaseUrl:s,fetchRetrier:a,searchParams:e?"reCache=1":"reCache=0"}),retrier:a}}async capturedUrl(e,a,t,r){const{handler:l,retrier:m}=this.buildHandler(r);return e==="fetch"?await l.fetch(a):e==="fetchApiResponse"?await l.fetchApiResponse(a,{queryParams:t}):await l.fetchApiPathResponse(a,{queryParams:t}),m.lastUrl}activeRows(){return this.rows.filter(e=>e.key.trim()!=="")}buildQueryParams(){const e=this.activeRows();if(this.paramsForm==="searchParams")return p(e.map(t=>[t.key,t.value]));const a={};return e.forEach(t=>{a[t.key]=$(t)}),a}describeCall(){if(this.method==="fetch")return`fetchHandler.fetch('${this.target}')`;const e=this.activeRows(),a=this.paramsForm==="searchParams"?`new URLSearchParams([${e.map(t=>`['${t.key}', '${t.value}']`).join(", ")}])`:`{ ${e.map(t=>`${w(t.key)}: ${R(t)}`).join(", ")} }`;return`fetchHandler.${this.method}('${this.target}', {
  queryParams: ${a},
})`}async run(){this.error=void 0,this.result=void 0;const e=this.describeCall();try{const a=await this.capturedUrl(this.method,this.target,this.method==="fetch"?void 0:this.buildQueryParams(),this.reCache);this.result={call:e,url:a}}catch(a){this.error=String(a)}}async runScenario(e){const a=h[e];let t;try{const r=await this.capturedUrl(a.method,a.target,a.params,!!a.reCache);t={actualUrl:r,pass:r===a.expectedUrl}}catch(r){t={actualUrl:"",pass:!1,error:String(r)}}this.scenarioResults={...this.scenarioResults,[e]:t}}async runAllScenarios(){for(let e=0;e<h.length;e+=1)await this.runScenario(e)}updateRow(e,a){this.rows=this.rows.map((t,r)=>r===e?{...t,...a}:t)}addRow(){this.rows=[...this.rows,{key:"",value:"",kind:"string"}]}removeRow(e){this.rows=this.rows.filter((a,t)=>t!==e)}renderFetchNote(){return i`
      <p class="note">
        <code>fetch()</code> takes <code>RequestInit | FetchOptions</code>, and
        neither of those carries <code>queryParams</code>, so put them on the
        url you pass in. <code>reCache=1</code> still gets merged. A helper for
        building that url is
        <a
          href="https://webarchive.jira.com/browse/WEBDEV-8858"
          target="_blank"
          rel="noopener"
          >WEBDEV-8858</a
        >.
      </p>
    `}renderParamsEditor(){const e=this.paramsForm==="record";return i`
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
        ${e?"":i`<p class="note">
                Every <code>URLSearchParams</code> value is a string, so the
                value type doesn't apply here.
              </p>`}

        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              ${e?i`<th>Value type</th>`:""}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.rows.map((a,t)=>i`
                <tr>
                  <td>
                    <input
                      type="text"
                      aria-label="Param ${t+1} key"
                      .value=${a.key}
                      @input=${r=>this.updateRow(t,{key:r.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      aria-label="Param ${t+1} value"
                      ?disabled=${e&&(a.kind==="undefined"||a.kind==="null")}
                      .value=${a.value}
                      @input=${r=>this.updateRow(t,{value:r.target.value})}
                    />
                  </td>
                  ${e?i`
                          <td>
                            <select
                              aria-label="Param ${t+1} value type"
                              .value=${a.kind}
                              @change=${r=>this.updateRow(t,{kind:r.target.value})}
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
    `}renderPlayground(){return i`
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
          <input
            type="checkbox"
            .checked=${this.reCache}
            @change=${e=>{this.reCache=e.target.checked}}
          />
          Page url has <code>reCache=1</code>
        </label>
      </fieldset>

      ${this.method==="fetch"?this.renderFetchNote():this.renderParamsEditor()}

      <button @click=${this.run}>Show url</button>
      ${this.error?i`<p class="fail">${this.error}</p>`:""}
      ${this.result?i`
              <h3>Result</h3>
              <pre>${this.result.call}</pre>
              <p>Requests <code class="url">${this.result.url}</code></p>
            `:""}
    `}renderScenarios(){return i`
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
          ${h.map((e,a)=>{var t,r;const l=this.scenarioResults[a];return i`
              <tr>
                <td>${e.label}</td>
                <td><code>${e.expectedUrl}</code></td>
                <td>
                  <code>${(r=(t=l==null?void 0:l.error)!==null&&t!==void 0?t:l==null?void 0:l.actualUrl)!==null&&r!==void 0?r:""}</code>
                </td>
                <td class=${l?l.pass?"pass":"fail":""}>
                  ${l?l.pass?"✅":"❌":i`<button @click=${()=>this.runScenario(a)}>
                          Run
                        </button>`}
                </td>
              </tr>
            `})}
        </tbody>
      </table>
    `}render(){return i`
      <h1>Query Params Demo</h1>
      <p>
        Shows the url <code>FetchHandler</code> would request for a given
        <code>queryParams</code> value. Nothing goes over the network: the
        handler is built with a capturing <code>fetchRetrier</code>, so what you
        see is the url the retrier was handed. <code>apiBaseUrl</code> is
        <code>${s}</code>.
      </p>
      ${this.renderPlayground()} ${this.renderScenarios()}
    `}};n.styles=g`
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
  `;c([d()],n.prototype,"method",void 0);c([d()],n.prototype,"target",void 0);c([d()],n.prototype,"paramsForm",void 0);c([d()],n.prototype,"rows",void 0);c([d()],n.prototype,"reCache",void 0);c([d()],n.prototype,"result",void 0);c([d()],n.prototype,"error",void 0);c([d()],n.prototype,"scenarioResults",void 0);n=c([b("query-params-demo")],n);export{n as QueryParamsDemo};
