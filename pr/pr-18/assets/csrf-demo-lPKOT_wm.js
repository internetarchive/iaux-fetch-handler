import{i as y,a as $,_ as a,t as w}from"./fetch-retrier-DQgSUyIF.js";import{b as r}from"../app-root.js";import{r as s}from"./state-iAArRRY0.js";import{F as T}from"./fetch-handler-C6dqLdOT.js";import{C as x}from"./capturing-fetch-retrier-BwzJCKns.js";function m(v){const e=[];return new Headers(v).forEach((o,n)=>e.push([n,o])),e}const p=[{label:"POST + includeCsrfToken: true → header attached",method:"POST",includeCsrfToken:!0,tokenValue:"demo-token-abc",expectHeader:!0,expectValue:"demo-token-abc"},{label:"PUT + includeCsrfToken: true → header attached",method:"PUT",includeCsrfToken:!0,tokenValue:"demo-token-abc",expectHeader:!0,expectValue:"demo-token-abc"},{label:"DELETE + includeCsrfToken: true → header attached",method:"DELETE",includeCsrfToken:!0,tokenValue:"demo-token-abc",expectHeader:!0,expectValue:"demo-token-abc"},{label:"POST without includeCsrfToken → NOT attached (opt-in default off)",method:"POST",includeCsrfToken:!1,tokenValue:"demo-token-abc",expectHeader:!1},{label:"GET + includeCsrfToken: true → NOT attached (GET never gets it)",method:"GET",includeCsrfToken:!0,tokenValue:"demo-token-abc",expectHeader:!1},{label:"Existing X-CSRF-Token header is preserved, not overwritten",method:"POST",includeCsrfToken:!0,existingHeaderValue:"manual-token",tokenValue:"auto-token",expectHeader:!0,expectValue:"manual-token"},{label:"Invalid/garbage token is attached as-is (FetchHandler doesn't validate — that's the server's job)",method:"POST",includeCsrfToken:!0,tokenValue:"garbage-not-a-real-token",expectHeader:!0,expectValue:"garbage-not-a-real-token"},{label:"getCsrfToken() throwing rejects the request",method:"POST",includeCsrfToken:!0,tokenThrows:!0,expectHeader:!1,expectThrows:!0},{label:"No getCsrfToken configured at all → never attaches",method:"POST",includeCsrfToken:!0,noTokenSource:!0,expectHeader:!1}];let i=class extends y{constructor(){super(...arguments),this.method="POST",this.includeCsrfToken=!0,this.tokenValue="demo-token-123",this.tokenThrows=!1,this.existingHeaderValue="",this.scenarioResults={},this.liveBaseUrl="https://archive.org",this.liveEndpointPath="/services/account/settings/",this.liveAction="verify-password",this.liveIdentifier="@abc",this.livePassword="abc",this.liveIncludeCsrfToken=!0,this.liveLoading=!1,this.liveTokenFetching=!1,this.liveCsrfToken=""}buildHandler(e){const o=new x;return{handler:new T({apiBaseUrl:"https://example.org",fetchRetrier:o,getCsrfToken:e.noTokenSource?void 0:async()=>{var t;if(e.tokenThrows)throw new Error("Simulated getCsrfToken() failure");return(t=e.tokenValue)!==null&&t!==void 0?t:""}}),retrier:o}}async sendManualRequest(){var e,o,n;this.manualError=void 0,this.manualResult=void 0;const{handler:t,retrier:l}=this.buildHandler({tokenValue:this.tokenValue,tokenThrows:this.tokenThrows}),c={};this.existingHeaderValue&&(c["X-CSRF-Token"]=this.existingHeaderValue);try{await t.fetchApiResponse("/demo/endpoint",{method:this.method,includeCredentials:!0,headers:c,includeCsrfToken:this.includeCsrfToken}),this.manualResult={url:l.lastUrl,method:(o=(e=l.lastInit)===null||e===void 0?void 0:e.method)!==null&&o!==void 0?o:this.method,headers:m((n=l.lastInit)===null||n===void 0?void 0:n.headers)}}catch(h){this.manualError=String(h)}}async runScenario(e){var o,n;const t=p[e],{handler:l,retrier:c}=this.buildHandler({tokenValue:t.tokenValue,tokenThrows:t.tokenThrows,noTokenSource:t.noTokenSource}),h={};t.existingHeaderValue&&(h["X-CSRF-Token"]=t.existingHeaderValue);let u=[],k,f=!1;try{await l.fetchApiResponse("/demo/endpoint",{method:t.method,includeCredentials:!0,headers:h,includeCsrfToken:t.includeCsrfToken}),u=m((o=c.lastInit)===null||o===void 0?void 0:o.headers)}catch(d){f=!0,k=String(d)}const g=u.some(([d])=>d.toLowerCase()==="x-csrf-token"),b=(n=u.find(([d])=>d.toLowerCase()==="x-csrf-token"))===null||n===void 0?void 0:n[1],C=!!t.expectThrows===f&&g===t.expectHeader&&(t.expectValue===void 0||b===t.expectValue);this.scenarioResults={...this.scenarioResults,[e]:{pass:C,actualHeaders:u,actualError:k}}}async runAllScenarios(){for(let e=0;e<p.length;e+=1)await this.runScenario(e)}async fetchRealCsrfToken(e){var o;const t=await(await fetch(`${e}/services/csrf-token`,{credentials:"include",headers:{Accept:"application/json"}})).json();if(!(t!=null&&t.success)||!(!((o=t==null?void 0:t.value)===null||o===void 0)&&o.token))throw new Error(`Failed to fetch CSRF token: ${JSON.stringify(t)}`);return t.value.token}async fetchLiveToken(){this.liveError=void 0,this.liveTokenFetching=!0;try{this.liveCsrfToken=await this.fetchRealCsrfToken(this.liveBaseUrl)}catch(e){this.liveError=String(e)}finally{this.liveTokenFetching=!1}}async sendLiveRequest(){this.liveError=void 0,this.liveResult=void 0,this.liveHeaders=void 0,this.liveLoading=!0;try{let e="";this.liveIncludeCsrfToken&&(this.liveCsrfToken||(this.liveCsrfToken=await this.fetchRealCsrfToken(this.liveBaseUrl)),e=this.liveCsrfToken);const o=new T({apiBaseUrl:this.liveBaseUrl,getCsrfToken:async()=>e}),n={action:this.liveAction,identifier:this.liveIdentifier,password:this.livePassword,"csrf-token":e};this.liveHeaders=[["Accept","application/json"],["Content-Type","application/json"],...this.liveIncludeCsrfToken?[["X-CSRF-Token",e]]:[]],this.liveResult=await o.fetchApiPathResponse(this.liveEndpointPath,{method:"POST",includeCredentials:!0,body:JSON.stringify(n),headers:{"Content-Type":"application/json"},includeCsrfToken:this.liveIncludeCsrfToken})}catch(e){this.liveError=String(e)}finally{this.liveLoading=!1}}render(){return r`
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
                ${p.map((e,o)=>{const n=this.scenarioResults[o];return r`
                    <tr>
                      <td>${e.label}</td>
                      <td>
                        <button @click=${()=>this.runScenario(o)}>
                          Run
                        </button>
                      </td>
                      <td>
                        ${n?r`
                                <span class=${n.pass?"pass":"fail"}>
                                  ${n.pass?"✅ PASS":"❌ FAIL"}
                                </span>
                                <br />
                                <small>
                                  ${n.actualError?`threw: ${n.actualError}`:n.actualHeaders.length?n.actualHeaders.map(([t,l])=>`${t}: ${l}`).join(", "):"(no headers)"}
                                </small>
                              `:r`<em>not run</em>`}
                      </td>
                    </tr>
                  `})}
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
                  @change=${e=>{this.method=e.target.value}}
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
                  @change=${e=>{this.includeCsrfToken=e.target.checked}}
                />
                includeCsrfToken
              </label>
              <label>
                Existing X-CSRF-Token header (blank = none):
                <input
                  type="text"
                  .value=${this.existingHeaderValue}
                  @input=${e=>{this.existingHeaderValue=e.target.value}}
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
                  @change=${e=>{this.tokenThrows=e.target.checked}}
                />
                simulate getCsrfToken() throwing (e.g. token endpoint down)
              </label>
              <label>
                Token value returned:
                <input
                  type="text"
                  .value=${this.tokenValue}
                  @input=${e=>{this.tokenValue=e.target.value}}
                  ?disabled=${this.tokenThrows}
                />
              </label>
            </fieldset>

            <button @click=${this.sendManualRequest}>Send</button>

            ${this.manualError?r`<pre class="error">Error: ${this.manualError}</pre>`:""}
            ${this.manualResult?r`
                    <h3>Resulting request</h3>
                    <p>
                      <strong>${this.manualResult.method}</strong> ${this.manualResult.url}
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th>Header</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.manualResult.headers.map(([e,o])=>r`<tr>
                              <td>${e}</td>
                              <td>${o}</td>
                            </tr>`)}
                      </tbody>
                    </table>
                    ${this.manualResult.headers.some(([e])=>e.toLowerCase()==="x-csrf-token")?r`<p class="pass">✅ X-CSRF-Token attached</p>`:r`<p class="skip">
                            ⏭️ No X-CSRF-Token header sent
                          </p>`}
                  `:""}
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
                  @input=${e=>{this.liveBaseUrl=e.target.value}}
                />
              </label>
              <label>
                Endpoint path:
                <input
                  type="text"
                  size="30"
                  .value=${this.liveEndpointPath}
                  @input=${e=>{this.liveEndpointPath=e.target.value}}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  .checked=${this.liveIncludeCsrfToken}
                  @change=${e=>{this.liveIncludeCsrfToken=e.target.checked}}
                />
                includeCsrfToken (uncheck to simulate sending without a token)
              </label>
              <label>
                Action:
                <input
                  type="text"
                  .value=${this.liveAction}
                  @input=${e=>{this.liveAction=e.target.value}}
                />
              </label>
              <label>
                Identifier:
                <input
                  type="text"
                  .value=${this.liveIdentifier}
                  @input=${e=>{this.liveIdentifier=e.target.value}}
                />
              </label>
              <label>
                Password:
                <input
                  type="text"
                  .value=${this.livePassword}
                  @input=${e=>{this.livePassword=e.target.value}}
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
                  @input=${e=>{this.liveCsrfToken=e.target.value}}
                  placeholder="fetched automatically, or edit to test a bad token"
                />
              </label>
              <button
                @click=${this.fetchLiveToken}
                ?disabled=${this.liveTokenFetching}
              >
                ${this.liveTokenFetching?"Fetching…":"Fetch token"}
              </button>
              <small>
                Auto-fetched from <code>/services/csrf-token</code> on Send if
                left blank. Edit it to send a bad/expired token and confirm the
                backend actually rejects it.
                ${this.liveIncludeCsrfToken?"":r`<br /><strong
                          >includeCsrfToken is unchecked — no token will be
                          sent.</strong
                        >`}
              </small>
            </fieldset>

            <button
              @click=${this.sendLiveRequest}
              ?disabled=${this.liveLoading}
            >
              ${this.liveLoading?"Sending…":"Send live request"}
            </button>

            ${this.liveError?r`<pre class="error">Error: ${this.liveError}</pre>`:""}
            ${this.liveHeaders?r`
                    <h3>Request headers sent</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Header</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.liveHeaders.map(([e,o])=>r`<tr>
                              <td>${e}</td>
                              <td>${o}</td>
                            </tr>`)}
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
                  `:""}
            ${this.liveResult!==void 0?r`
                    <h3>Response</h3>
                    <pre>${JSON.stringify(this.liveResult,null,2)}</pre>
                  `:""}
          </section>
        </div>
      </div>
    `}};i.styles=$`
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
  `;a([s()],i.prototype,"method",void 0);a([s()],i.prototype,"includeCsrfToken",void 0);a([s()],i.prototype,"tokenValue",void 0);a([s()],i.prototype,"tokenThrows",void 0);a([s()],i.prototype,"existingHeaderValue",void 0);a([s()],i.prototype,"manualResult",void 0);a([s()],i.prototype,"manualError",void 0);a([s()],i.prototype,"scenarioResults",void 0);a([s()],i.prototype,"liveBaseUrl",void 0);a([s()],i.prototype,"liveEndpointPath",void 0);a([s()],i.prototype,"liveAction",void 0);a([s()],i.prototype,"liveIdentifier",void 0);a([s()],i.prototype,"livePassword",void 0);a([s()],i.prototype,"liveIncludeCsrfToken",void 0);a([s()],i.prototype,"liveLoading",void 0);a([s()],i.prototype,"liveTokenFetching",void 0);a([s()],i.prototype,"liveCsrfToken",void 0);a([s()],i.prototype,"liveHeaders",void 0);a([s()],i.prototype,"liveResult",void 0);a([s()],i.prototype,"liveError",void 0);i=a([w("csrf-demo")],i);export{i as CsrfDemo};
