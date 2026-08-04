import{i,a as n,_ as o,n as e,t as s}from"./fetch-retrier-DsicMz2C.js";import{b as r}from"../app-root.js";import{F as p}from"./fetch-handler-DEMXdJoS.js";let t=class extends i{constructor(){super(),this.data=null,this.error="",this.loading=!1,this.fetchHandler=new p({apiBaseUrl:"https://archive.org"})}connectedCallback(){super.connectedCallback(),this.fetchData()}async fetchData(){this.loading=!0,this.error="";try{const a=await this.fetchHandler.fetchApiPathResponse("/metadata/goody");this.data=a}catch(a){this.error=`Error fetching data: ${a}`}finally{this.loading=!1}}render(){return r`
      <div class="container">
        <h1>Fetch Data</h1>
        ${this.loading?r`<p>Loading...</p>`:this.error?r`<p class="error">${this.error}</p>`:this.data?r`<pre>${JSON.stringify(this.data,null,2)}</pre>`:r`<p>No data available.</p>`}
        <button @click="${this.fetchData}">Retry</button>
      </div>
    `}};t.styles=n`
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    h1 {
      color: #333;
    }

    .error {
      color: red;
    }

    button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 5px;
    }

    button:hover {
      background-color: #0056b3;
    }
  `;o([e({type:Object})],t.prototype,"data",void 0);o([e({type:String})],t.prototype,"error",void 0);o([e({type:Boolean})],t.prototype,"loading",void 0);t=o([s("app-root")],t);export{t as AppRoot};
