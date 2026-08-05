import{i as d,F as h,b as n,a as u,_ as o,t as p}from"./fetch-retrier-DsicMz2C.js";import{b as a}from"../app-root.js";import{r as i}from"./state-fAVG4Avp.js";const f={default:n.default,noRetry:n.noRetry};class m{constructor(t,s){this.failCount=t,this.onAttempt=s,this.callCount=0}install(){this.original=window.fetch.bind(window),window.fetch=async()=>{this.callCount+=1;const t=this.callCount<=this.failCount?503:200;return this.onAttempt(t),new Response(JSON.stringify({attempt:this.callCount,ok:t===200}),{status:t})}}uninstall(){this.original&&(window.fetch=this.original)}}let e=class extends d{constructor(){super(...arguments),this.configKey="default",this.failCount=2,this.loading=!1,this.log=[]}async sendRequest(){this.log=[],this.outcome=void 0,this.loading=!0;const t=performance.now(),s=new m(this.failCount,l=>{this.log=[...this.log,{attempt:this.log.length+1,status:l,timeSinceStartMs:Math.round(performance.now()-t)}]});s.install();try{const c=await new h({retryConfig:f[this.configKey]}).fetchRetry("/demo/flaky-endpoint");this.outcome={success:c.ok,totalMs:Math.round(performance.now()-t)}}finally{s.uninstall(),this.loading=!1}}render(){return a`
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
            @change=${t=>{this.configKey=t.target.value}}
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
            @input=${t=>{this.failCount=Number(t.target.value)}}
          />
        </label>
      </fieldset>

      <button @click=${this.sendRequest} ?disabled=${this.loading}>
        ${this.loading?"Sending…":"Send request"}
      </button>

      ${this.log.length?a`
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
                  ${this.log.map(t=>a`
                      <tr>
                        <td>${t.attempt}</td>
                        <td class=${t.status===200?"pass":"fail"}>
                          ${t.status}
                        </td>
                        <td>${t.timeSinceStartMs}ms</td>
                      </tr>
                    `)}
                </tbody>
              </table>
            `:""}
      ${this.outcome?a`
              <p class=${this.outcome.success?"pass":"fail"}>
                ${this.outcome.success?`✅ Succeeded after ${this.log.length} attempt(s)`:`❌ Gave up after ${this.log.length} attempt(s)`}
                — ${this.outcome.totalMs}ms total
              </p>
            `:""}
    `}};e.styles=u`
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
  `;o([i()],e.prototype,"configKey",void 0);o([i()],e.prototype,"failCount",void 0);o([i()],e.prototype,"loading",void 0);o([i()],e.prototype,"log",void 0);o([i()],e.prototype,"outcome",void 0);e=o([p("retry-demo")],e);export{e as RetryDemo};
