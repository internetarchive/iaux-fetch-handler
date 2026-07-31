(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const O=globalThis,ae=n=>n,D=O.trustedTypes,le=D?D.createPolicy("lit-html",{createHTML:n=>n}):void 0,ke="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,Ce="?"+b,Ee=`<${Ce}>`,w=document,q=()=>w.createComment(""),F=n=>n===null||typeof n!="object"&&typeof n!="function",Y=Array.isArray,Re=n=>Y(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",j=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,he=/-->/g,ce=/>/g,_=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),de=/'/g,ue=/"/g,_e=/^(?:script|style|textarea|title)$/i,xe=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),f=xe(1),R=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),fe=new WeakMap,T=w.createTreeWalker(w,129);function Te(n,e){if(!Y(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return le!==void 0?le.createHTML(e):e}const Pe=(n,e)=>{const t=n.length-1,s=[];let r,i=e===2?"<svg>":e===3?"<math>":"",o=H;for(let a=0;a<t;a++){const l=n[a];let d,c,u=-1,y=0;for(;y<l.length&&(o.lastIndex=y,c=o.exec(l),c!==null);)y=o.lastIndex,o===H?c[1]==="!--"?o=he:c[1]!==void 0?o=ce:c[2]!==void 0?(_e.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=_):c[3]!==void 0&&(o=_):o===_?c[0]===">"?(o=r??H,u=-1):c[1]===void 0?u=-2:(u=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?_:c[3]==='"'?ue:de):o===ue||o===de?o=_:o===he||o===ce?o=H:(o=_,r=void 0);const $=o===_&&n[a+1].startsWith("/>")?" ":"";i+=o===H?l+Ee:u>=0?(s.push(d),l.slice(0,u)+ke+l.slice(u)+b+$):l+b+(u===-2?a:$)}return[Te(n,i+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};let J=class Ae{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let i=0,o=0;const a=e.length-1,l=this.parts,[d,c]=Pe(e,t);if(this.el=Ae.createElement(d,s),T.currentNode=this.el.content,t===2||t===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=T.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(ke)){const y=c[o++],$=r.getAttribute(u).split(b),m=/([.?@])?(.*)/.exec(y);l.push({type:1,index:i,name:m[2],strings:$,ctor:m[1]==="."?Oe:m[1]==="?"?Ue:m[1]==="@"?qe:V}),r.removeAttribute(u)}else u.startsWith(b)&&(l.push({type:6,index:i}),r.removeAttribute(u));if(_e.test(r.tagName)){const u=r.textContent.split(b),y=u.length-1;if(y>0){r.textContent=D?D.emptyScript:"";for(let $=0;$<y;$++)r.append(u[$],q()),T.nextNode(),l.push({type:2,index:++i});r.append(u[y],q())}}}else if(r.nodeType===8)if(r.data===Ce)l.push({type:2,index:i});else{let u=-1;for(;(u=r.data.indexOf(b,u+1))!==-1;)l.push({type:7,index:i}),u+=b.length-1}i++}}static createElement(e,t){const s=w.createElement("template");return s.innerHTML=e,s}};function x(n,e,t=n,s){var o,a;if(e===R)return e;let r=s!==void 0?(o=t._$Co)==null?void 0:o[s]:t._$Cl;const i=F(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==i&&((a=r==null?void 0:r._$AO)==null||a.call(r,!1),i===void 0?r=void 0:(r=new i(n),r._$AT(n,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=r:t._$Cl=r),r!==void 0&&(e=x(n,r._$AS(n,e.values),r,s)),e}class He{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??w).importNode(t,!0);T.currentNode=r;let i=T.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new M(i,i.nextSibling,this,e):l.type===1?d=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(d=new Fe(i,this,e)),this._$AV.push(d),l=s[++a]}o!==(l==null?void 0:l.index)&&(i=T.nextNode(),o++)}return T.currentNode=w,r}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class M{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=x(this,e,t),F(e)?e===g||e==null||e===""?(this._$AH!==g&&this._$AR(),this._$AH=g):e!==this._$AH&&e!==R&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Re(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==g&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){var i;const{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=J.createElement(Te(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===r)this._$AH.p(t);else{const o=new He(r,this),a=o.u(this.options);o.p(t),this.T(a),this._$AH=o}}_$AC(e){let t=fe.get(e.strings);return t===void 0&&fe.set(e.strings,t=new J(e)),t}k(e){Y(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,r=0;for(const i of e)r===t.length?t.push(s=new M(this.O(q()),this.O(q()),this,this.options)):s=t[r],s._$AI(i),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){const r=ae(e).nextSibling;ae(e).remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class V{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,i){this.type=1,this._$AH=g,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=g}_$AI(e,t=this,s,r){const i=this.strings;let o=!1;if(i===void 0)e=x(this,e,t,0),o=!F(e)||e!==this._$AH&&e!==R,o&&(this._$AH=e);else{const a=e;let l,d;for(e=i[0],l=0;l<i.length-1;l++)d=x(this,a[s+l],t,l),d===R&&(d=this._$AH[l]),o||(o=!F(d)||d!==this._$AH[l]),d===g?e=g:e!==g&&(e+=(d??"")+i[l+1]),this._$AH[l]=d}o&&!r&&this.j(e)}j(e){e===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Oe extends V{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===g?void 0:e}}class Ue extends V{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==g)}}class qe extends V{constructor(e,t,s,r,i){super(e,t,s,r,i),this.type=5}_$AI(e,t=this){if((e=x(this,e,t,0)??g)===R)return;const s=this._$AH,r=e===g&&s!==g||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==g&&(s===g||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Fe{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){x(this,e)}}const z=O.litHtmlPolyfillSupport;z==null||z(J,M),(O.litHtmlVersions??(O.litHtmlVersions=[])).push("3.3.3");const ee=(n,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const i=(t==null?void 0:t.renderBefore)??null;s._$litPart$=r=new M(e.insertBefore(q(),i),i,void 0,t??{})}return r._$AI(n),r};function h(n,e,t,s){var r=arguments.length,i=r<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,t):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,s);else for(var a=n.length-1;a>=0;a--)(o=n[a])&&(i=(r<3?o(i):r>3?o(e,t,i):o(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const L=globalThis,te=L.ShadowRoot&&(L.ShadyCSS===void 0||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,se=Symbol(),pe=new WeakMap;let Se=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(te&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=pe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&pe.set(t,e))}return e}toString(){return this.cssText}};const Ne=n=>new Se(typeof n=="string"?n:n+"",void 0,se),re=(n,...e)=>{const t=n.length===1?n[0]:e.reduce((s,r,i)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+n[i+1],n[0]);return new Se(t,n,se)},Me=(n,e)=>{if(te)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),r=L.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,n.appendChild(s)}},ve=te?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return Ne(t)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Le,defineProperty:De,getOwnPropertyDescriptor:Ie,getOwnPropertyNames:Ve,getOwnPropertySymbols:Be,getPrototypeOf:je}=Object,k=globalThis,ge=k.trustedTypes,ze=ge?ge.emptyScript:"",X=k.reactiveElementPolyfillSupport,U=(n,e)=>n,I={toAttribute(n,e){switch(e){case Boolean:n=n?ze:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},ie=(n,e)=>!Le(n,e),ye={attribute:!0,type:String,converter:I,reflect:!1,useDefault:!1,hasChanged:ie};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),k.litPropertyMetadata??(k.litPropertyMetadata=new WeakMap);class E extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ye){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&De(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){const{get:r,set:i}=Ie(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:r,set(o){const a=r==null?void 0:r.call(this);i==null||i.call(this,o),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ye}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;const e=je(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){const t=this.properties,s=[...Ve(t),...Be(t)];for(const r of s)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)t.unshift(ve(r))}else e!==void 0&&t.push(ve(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Me(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var i;const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const o=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:I).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){var i,o;const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const a=s.getPropertyOptions(r),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)==null?void 0:i.fromAttribute)!==void 0?a.converter:I;this._$Em=r;const d=l.fromAttribute(t,a.type);this[r]=d??((o=this._$Ej)==null?void 0:o.get(r))??d,this._$Em=null}}requestUpdate(e,t,s,r=!1,i){var o;if(e!==void 0){const a=this.constructor;if(r===!1&&(i=this[e]),s??(s=a.getPropertyOptions(e)),!((s.hasChanged??ie)(i,t)||s.useDefault&&s.reflect&&i===((o=this._$Ej)==null?void 0:o.get(e))&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:i},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),i!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[i,o]of r){const{wrapped:a}=o,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,o,l)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(r=>{var i;return(i=r.hostUpdate)==null?void 0:i.call(r)}),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}}E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[U("elementProperties")]=new Map,E[U("finalized")]=new Map,X==null||X({ReactiveElement:E}),(k.reactiveElementVersions??(k.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const A=globalThis;class S extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ee(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return R}}var be;S._$litElement$=!0,S.finalized=!0,(be=A.litElementHydrateSupport)==null||be.call(A,{LitElement:S});const G=A.litElementPolyfillSupport;G==null||G({LitElement:S});(A.litElementVersions??(A.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ne=n=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(n,e)}):customElements.define(n,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xe={attribute:!0,type:String,converter:I,reflect:!1,hasChanged:ie},Ge=(n=Xe,e,t)=>{const{kind:s,metadata:r}=t;let i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),s==="setter"&&((n=Object.create(n)).wrapped=!0),i.set(t.name,n),s==="accessor"){const{name:o}=t;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,l,n,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,n,a),a}}}if(s==="setter"){const{name:o}=t;return function(a){const l=this[o];e.call(this,a),this.requestUpdate(o,l,n,!0,a)}}throw Error("Unsupported decorator location: "+s)};function B(n){return(e,t)=>typeof t=="object"?Ge(n,e,t):((s,r,i)=>{const o=r.hasOwnProperty(i);return r.constructor.createProperty(i,s),o?Object.getOwnPropertyDescriptor(r,i):void 0})(n,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function p(n){return B({...n,state:!0,attribute:!1})}function $e(n){return new Promise(e=>setTimeout(e,n))}class W{constructor(e){this.maxRetries=2,this.transientStatusCodes=new Set([408,429,500,502,503,504,522]),(e==null?void 0:e.maxRetries)!==void 0&&(this.maxRetries=e.maxRetries),(e==null?void 0:e.transientStatusCodes)!==void 0&&(this.transientStatusCodes=e.transientStatusCodes)}shouldRetry(e,t){return e===null||t>this.maxRetries?!1:this.transientStatusCodes.has(e.status)}retryDelay(e,t){const s=t==null?void 0:t.headers.get("Retry-After");if(s){const r=parseInt(s,10);if(!isNaN(r))return r*1e3}return Math.min(500*2**e,1e4)}}W.shared=new W;class Z{shouldRetry(){return!1}retryDelay(){return null}}Z.shared=new Z;class N{}N.default=W.shared;N.noRetry=Z.shared;const oe=n=>{if(n)return"requestInit"in n||"retryConfig"in n||"requireCsrfToken"in n?n:{requestInit:n}};class we{constructor(e){this.retryConfig=N.default,this.eventCategory="offshootFetchRetry",e!=null&&e.analyticsHandler&&(this.analyticsHandler=e.analyticsHandler),e!=null&&e.retryConfig&&(this.retryConfig=e.retryConfig)}async fetchRetry(e,t){const s=oe(t);return await this.doFetchRetry(e,0,s)}async doFetchRetry(e,t,s){var r,i;const o=typeof e=="string"?e:e.url;try{const a=await fetch(e,s==null?void 0:s.requestInit);if(a.ok)return a;a.status>=400&&a.status<600&&this.log4xx5xxResponse(a);const l=(r=s==null?void 0:s.retryConfig)!==null&&r!==void 0?r:this.retryConfig;if(l.shouldRetry(a,t)){const c=l.retryDelay(t,a);if(c!==null)return await $e(c),this.logRetryEvent(o,t,a.statusText,a.status),this.doFetchRetry(e,t+1,s)}return this.logFailureEvent(o,a.status),a}catch(a){if(this.isContentBlockerError(a))throw this.logContentBlockingEvent(o,a),a;const l=(i=s==null?void 0:s.retryConfig)!==null&&i!==void 0?i:this.retryConfig;if(l.shouldRetry(null,t)){const c=l.retryDelay(t);if(c!==null)return await $e(c),this.logRetryEvent(o,t,a,a),this.doFetchRetry(e,t+1,s)}throw this.logFailureEvent(o,a),a}}isContentBlockerError(e){return e instanceof TypeError?e.message.toLowerCase().includes("content blocker"):!1}logRetryEvent(e,t,s,r){var i;(i=this.analyticsHandler)===null||i===void 0||i.sendEvent({category:this.eventCategory,action:"retryingFetch",label:`retryNumber: ${t}, code: ${r}, status: ${s}, url: ${e}`})}logFailureEvent(e,t){var s;(s=this.analyticsHandler)===null||s===void 0||s.sendEvent({category:this.eventCategory,action:"fetchFailed",label:`error: ${t}, url: ${e}`})}log4xx5xxResponse(e){var t;const s=e.status;(t=this.analyticsHandler)===null||t===void 0||t.sendEvent({category:this.eventCategory,action:`status${s}Response`,label:`url: ${e.url}`})}logContentBlockingEvent(e,t){var s;(s=this.analyticsHandler)===null||s===void 0||s.sendEvent({category:this.eventCategory,action:"contentBlockerDetectedNotRetrying",label:`error: ${t}, url: ${e}`})}}const Ke=new Set(["POST","PUT","DELETE","PATCH"]);class Q{constructor(e){this.apiBaseUrl="",this.fetchRetrier=new we,e!=null&&e.apiBaseUrl?this.apiBaseUrl=e.apiBaseUrl:e!=null&&e.iaApiBaseUrl&&(this.apiBaseUrl=e.iaApiBaseUrl),e!=null&&e.fetchRetrier&&(this.fetchRetrier=e.fetchRetrier),e!=null&&e.searchParams?this.searchParams=e.searchParams:this.searchParams=window.location.search,e!=null&&e.getCsrfToken&&(this.getCsrfToken=e.getCsrfToken)}async fetch(e,t){let s=e;if(new URLSearchParams(this.searchParams).get("reCache")==="1"){const o=typeof e=="string"?e:e.url;s=this.addSearchParams(o,{reCache:"1"})}const i=await this.withCsrfToken(s,t);return this.fetchRetrier.fetchRetry(s,i)}async fetchApiResponse(e,t){const s={};t!=null&&t.includeCredentials&&(s.credentials="include"),t!=null&&t.method&&(s.method=t.method),t!=null&&t.body&&(s.body=t.body);const r=new Headers({Accept:"application/json"});return t!=null&&t.headers&&new Headers(t.headers).forEach((a,l)=>{r.set(l,a)}),s.headers=r,await(await this.fetch(e,{requestInit:s,retryConfig:t==null?void 0:t.retryConfig,requireCsrfToken:t==null?void 0:t.requireCsrfToken})).json()}async fetchApiPathResponse(e,t){const s=`${this.apiBaseUrl}${e}`;return this.fetchApiResponse(s,t)}async fetchIAApiResponse(e,t){return this.fetchApiPathResponse(e,t)}async withCsrfToken(e,t){var s,r,i,o;if(!this.getCsrfToken)return t;const a=(s=oe(t))!==null&&s!==void 0?s:{};if(!a.requireCsrfToken)return t;const l=(r=a.requestInit)!==null&&r!==void 0?r:{},d=((o=(i=l.method)!==null&&i!==void 0?i:typeof e!="string"?e.method:void 0)!==null&&o!==void 0?o:"GET").toUpperCase();if(!Ke.has(d))return t;const c=new Headers(l.headers);return c.has("X-CSRF-Token")?t:(c.set("X-CSRF-Token",await this.getCsrfToken()),{...a,requestInit:{...l,headers:c}})}addSearchParams(e,t){const s=new URL(e,window.location.href);for(const[r,i]of Object.entries(t))s.searchParams.set(r,i);return s.href}}let P=class extends S{constructor(){super(),this.data=null,this.error="",this.loading=!1,this.fetchHandler=new Q({apiBaseUrl:"https://archive.org"})}connectedCallback(){super.connectedCallback(),this.fetchData()}async fetchData(){this.loading=!0,this.error="";try{const e=await this.fetchHandler.fetchApiPathResponse("/metadata/goody");this.data=e}catch(e){this.error=`Error fetching data: ${e}`}finally{this.loading=!1}}render(){return f`
      <div class="container">
        <h1>Fetch Data</h1>
        ${this.loading?f`<p>Loading...</p>`:this.error?f`<p class="error">${this.error}</p>`:this.data?f`<pre>${JSON.stringify(this.data,null,2)}</pre>`:f`<p>No data available.</p>`}
        <button @click="${this.fetchData}">Retry</button>
      </div>
    `}};P.styles=re`
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
  `;h([B({type:Object})],P.prototype,"data",void 0);h([B({type:String})],P.prototype,"error",void 0);h([B({type:Boolean})],P.prototype,"loading",void 0);P=h([ne("app-root")],P);const Je={default:N.default,noRetry:N.noRetry};class We{constructor(e,t){this.failCount=e,this.onAttempt=t,this.callCount=0}install(){this.original=window.fetch.bind(window),window.fetch=async()=>{this.callCount+=1;const e=this.callCount<=this.failCount?503:200;return this.onAttempt(e),new Response(JSON.stringify({attempt:this.callCount,ok:e===200}),{status:e})}}uninstall(){this.original&&(window.fetch=this.original)}}let C=class extends S{constructor(){super(...arguments),this.configKey="default",this.failCount=2,this.loading=!1,this.log=[]}async sendRequest(){this.log=[],this.outcome=void 0,this.loading=!0;const e=performance.now(),t=new We(this.failCount,s=>{this.log=[...this.log,{attempt:this.log.length+1,status:s,timeSinceStartMs:Math.round(performance.now()-e)}]});t.install();try{const r=await new we({retryConfig:Je[this.configKey]}).fetchRetry("/demo/flaky-endpoint");this.outcome={success:r.ok,totalMs:Math.round(performance.now()-e)}}finally{t.uninstall(),this.loading=!1}}render(){return f`
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
            @change=${e=>{this.configKey=e.target.value}}
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
            @input=${e=>{this.failCount=Number(e.target.value)}}
          />
        </label>
      </fieldset>

      <button @click=${this.sendRequest} ?disabled=${this.loading}>
        ${this.loading?"Sending…":"Send request"}
      </button>

      ${this.log.length?f`
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
                ${this.log.map(e=>f`
                    <tr>
                      <td>${e.attempt}</td>
                      <td class=${e.status===200?"pass":"fail"}>
                        ${e.status}
                      </td>
                      <td>${e.timeSinceStartMs}ms</td>
                    </tr>
                  `)}
              </tbody>
            </table>
          `:""}
      ${this.outcome?f`
            <p class=${this.outcome.success?"pass":"fail"}>
              ${this.outcome.success?`✅ Succeeded after ${this.log.length} attempt(s)`:`❌ Gave up after ${this.log.length} attempt(s)`}
              — ${this.outcome.totalMs}ms total
            </p>
          `:""}
    `}};C.styles=re`
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
  `;h([p()],C.prototype,"configKey",void 0);h([p()],C.prototype,"failCount",void 0);h([p()],C.prototype,"loading",void 0);h([p()],C.prototype,"log",void 0);h([p()],C.prototype,"outcome",void 0);C=h([ne("retry-demo")],C);class Ze{constructor(){this.lastUrl=""}async fetchRetry(e,t){const s=oe(t);return this.lastUrl=typeof e=="string"?e:e.url,this.lastInit=s==null?void 0:s.requestInit,new Response(JSON.stringify({demo:!0}),{status:200})}}function me(n){const e=[];return new Headers(n).forEach((t,s)=>e.push([s,t])),e}const K=[{label:"POST + requireCsrfToken: true → header attached",method:"POST",requireCsrfToken:!0,tokenValue:"demo-token-abc",expectHeader:!0,expectValue:"demo-token-abc"},{label:"PUT + requireCsrfToken: true → header attached",method:"PUT",requireCsrfToken:!0,tokenValue:"demo-token-abc",expectHeader:!0,expectValue:"demo-token-abc"},{label:"DELETE + requireCsrfToken: true → header attached",method:"DELETE",requireCsrfToken:!0,tokenValue:"demo-token-abc",expectHeader:!0,expectValue:"demo-token-abc"},{label:"POST without requireCsrfToken → NOT attached (opt-in default off)",method:"POST",requireCsrfToken:!1,tokenValue:"demo-token-abc",expectHeader:!1},{label:"GET + requireCsrfToken: true → NOT attached (GET never gets it)",method:"GET",requireCsrfToken:!0,tokenValue:"demo-token-abc",expectHeader:!1},{label:"Existing X-CSRF-Token header is preserved, not overwritten",method:"POST",requireCsrfToken:!0,existingHeaderValue:"manual-token",tokenValue:"auto-token",expectHeader:!0,expectValue:"manual-token"},{label:"Invalid/garbage token is attached as-is (FetchHandler doesn't validate — that's the server's job)",method:"POST",requireCsrfToken:!0,tokenValue:"garbage-not-a-real-token",expectHeader:!0,expectValue:"garbage-not-a-real-token"},{label:"getCsrfToken() throwing rejects the request",method:"POST",requireCsrfToken:!0,tokenThrows:!0,expectHeader:!1,expectThrows:!0},{label:"No getCsrfToken configured at all → never attaches",method:"POST",requireCsrfToken:!0,noTokenSource:!0,expectHeader:!1}];let v=class extends S{constructor(){super(...arguments),this.method="POST",this.requireCsrfToken=!0,this.tokenValue="demo-token-123",this.tokenThrows=!1,this.existingHeaderValue="",this.scenarioResults={},this.liveBaseUrl="https://archive.org",this.liveEndpointPath="/services/account/settings/",this.liveAction="verify-password",this.liveIdentifier="@abc",this.livePassword="abc",this.liveRequireCsrfToken=!0,this.liveLoading=!1,this.liveTokenFetching=!1,this.liveCsrfToken=""}buildHandler(e){const t=new Ze;return{handler:new Q({apiBaseUrl:"https://example.org",fetchRetrier:t,getCsrfToken:e.noTokenSource?void 0:async()=>{var r;if(e.tokenThrows)throw new Error("Simulated getCsrfToken() failure");return(r=e.tokenValue)!==null&&r!==void 0?r:""}}),retrier:t}}async sendManualRequest(){var e,t,s;this.manualError=void 0,this.manualResult=void 0;const{handler:r,retrier:i}=this.buildHandler({tokenValue:this.tokenValue,tokenThrows:this.tokenThrows}),o={};this.existingHeaderValue&&(o["X-CSRF-Token"]=this.existingHeaderValue);try{await r.fetchApiResponse("/demo/endpoint",{method:this.method,includeCredentials:!0,headers:o,requireCsrfToken:this.requireCsrfToken}),this.manualResult={url:i.lastUrl,method:(t=(e=i.lastInit)===null||e===void 0?void 0:e.method)!==null&&t!==void 0?t:this.method,headers:me((s=i.lastInit)===null||s===void 0?void 0:s.headers)}}catch(a){this.manualError=String(a)}}async runScenario(e){var t,s;const r=K[e],{handler:i,retrier:o}=this.buildHandler({tokenValue:r.tokenValue,tokenThrows:r.tokenThrows,noTokenSource:r.noTokenSource}),a={};r.existingHeaderValue&&(a["X-CSRF-Token"]=r.existingHeaderValue);let l=[],d,c=!1;try{await i.fetchApiResponse("/demo/endpoint",{method:r.method,includeCredentials:!0,headers:a,requireCsrfToken:r.requireCsrfToken}),l=me((t=o.lastInit)===null||t===void 0?void 0:t.headers)}catch(m){c=!0,d=String(m)}const u=l.some(([m])=>m.toLowerCase()==="x-csrf-token"),y=(s=l.find(([m])=>m.toLowerCase()==="x-csrf-token"))===null||s===void 0?void 0:s[1],$=!!r.expectThrows===c&&u===r.expectHeader&&(r.expectValue===void 0||y===r.expectValue);this.scenarioResults={...this.scenarioResults,[e]:{pass:$,actualHeaders:l,actualError:d}}}async runAllScenarios(){for(let e=0;e<K.length;e+=1)await this.runScenario(e)}async fetchRealCsrfToken(e){var t;const r=await(await fetch(`${e}/services/csrf-token`,{credentials:"include",headers:{Accept:"application/json"}})).json();if(!(r!=null&&r.success)||!(!((t=r==null?void 0:r.value)===null||t===void 0)&&t.token))throw new Error(`Failed to fetch CSRF token: ${JSON.stringify(r)}`);return r.value.token}async fetchLiveToken(){this.liveError=void 0,this.liveTokenFetching=!0;try{this.liveCsrfToken=await this.fetchRealCsrfToken(this.liveBaseUrl)}catch(e){this.liveError=String(e)}finally{this.liveTokenFetching=!1}}async sendLiveRequest(){this.liveError=void 0,this.liveResult=void 0,this.liveHeaders=void 0,this.liveLoading=!0;try{let e="";this.liveRequireCsrfToken&&(this.liveCsrfToken||(this.liveCsrfToken=await this.fetchRealCsrfToken(this.liveBaseUrl)),e=this.liveCsrfToken);const t=new Q({apiBaseUrl:this.liveBaseUrl,getCsrfToken:async()=>e}),s={action:this.liveAction,identifier:this.liveIdentifier,password:this.livePassword,"csrf-token":e};this.liveHeaders=[["Accept","application/json"],["Content-Type","application/json"],...this.liveRequireCsrfToken?[["X-CSRF-Token",e]]:[]],this.liveResult=await t.fetchApiPathResponse(this.liveEndpointPath,{method:"POST",includeCredentials:!0,body:JSON.stringify(s),headers:{"Content-Type":"application/json"},requireCsrfToken:this.liveRequireCsrfToken})}catch(e){this.liveError=String(e)}finally{this.liveLoading=!1}}render(){return f`
      <h1>FetchHandler CSRF Demo</h1>
      <p>
        Exercises the CSRF auto-attach logic (<code>getCsrfToken</code> /
        <code>requireCsrfToken</code>) against a captured request instead of a
        real network call, so you can see exactly what FetchHandler would send
        for a given scenario.
      </p>

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
            ${K.map((e,t)=>{const s=this.scenarioResults[t];return f`
                <tr>
                  <td>${e.label}</td>
                  <td>
                    <button @click=${()=>this.runScenario(t)}>Run</button>
                  </td>
                  <td>
                    ${s?f`
                          <span class=${s.pass?"pass":"fail"}>
                            ${s.pass?"✅ PASS":"❌ FAIL"}
                          </span>
                          <br />
                          <small>
                            ${s.actualError?`threw: ${s.actualError}`:s.actualHeaders.length?s.actualHeaders.map(([r,i])=>`${r}: ${i}`).join(", "):"(no headers)"}
                          </small>
                        `:f`<em>not run</em>`}
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
              .checked=${this.requireCsrfToken}
              @change=${e=>{this.requireCsrfToken=e.target.checked}}
            />
            requireCsrfToken
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

        ${this.manualError?f`<pre class="error">Error: ${this.manualError}</pre>`:""}
        ${this.manualResult?f`
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
                  ${this.manualResult.headers.map(([e,t])=>f`<tr>
                        <td>${e}</td>
                        <td>${t}</td>
                      </tr>`)}
                </tbody>
              </table>
              ${this.manualResult.headers.some(([e])=>e.toLowerCase()==="x-csrf-token")?f`<p class="pass">✅ X-CSRF-Token attached</p>`:f`<p class="skip">⏭️ No X-CSRF-Token header sent</p>`}
            `:""}
      </section>

      <section>
        <h2>Live request (real network call)</h2>
        <p>
          Fires an actual request at a real backend — fetches a genuine signed
          CSRF token from that host's
          <code>/services/csrf-token</code>, then POSTs to the account settings
          service (matching <code>ia-verification.ts</code>'s
          <code>verifyIAPassword()</code> call) with
          <code>requireCsrfToken: true</code>. Requires you to already be logged
          in to the target host in this browser (session cookie).
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
              .checked=${this.liveRequireCsrfToken}
              @change=${e=>{this.liveRequireCsrfToken=e.target.checked}}
            />
            requireCsrfToken (uncheck to simulate sending without a token)
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

        <fieldset ?disabled=${!this.liveRequireCsrfToken}>
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
            Auto-fetched from <code>/services/csrf-token</code> on Send if left
            blank. Edit it to send a bad/expired token and confirm the backend
            actually rejects it.
            ${this.liveRequireCsrfToken?"":f`<br /><strong
                    >requireCsrfToken is unchecked — no token will be
                    sent.</strong
                  >`}
          </small>
        </fieldset>

        <button @click=${this.sendLiveRequest} ?disabled=${this.liveLoading}>
          ${this.liveLoading?"Sending…":"Send live request"}
        </button>

        ${this.liveError?f`<pre class="error">Error: ${this.liveError}</pre>`:""}
        ${this.liveHeaders?f`
              <h3>Request headers sent</h3>
              <table>
                <thead>
                  <tr>
                    <th>Header</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.liveHeaders.map(([e,t])=>f`<tr>
                        <td>${e}</td>
                        <td>${t}</td>
                      </tr>`)}
                </tbody>
              </table>
              <p>
                <small>
                  Value came from the CSRF Token field above (auto-fetched from
                  <code>${this.liveBaseUrl}/services/csrf-token</code>
                  unless you edited it).
                </small>
              </p>
            `:""}
        ${this.liveResult!==void 0?f`
              <h3>Response</h3>
              <pre>${JSON.stringify(this.liveResult,null,2)}</pre>
            `:""}
      </section>
    `}};v.styles=re`
    :host {
      display: block;
      font-family: sans-serif;
      padding: 20px;
      max-width: 900px;
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
  `;h([p()],v.prototype,"method",void 0);h([p()],v.prototype,"requireCsrfToken",void 0);h([p()],v.prototype,"tokenValue",void 0);h([p()],v.prototype,"tokenThrows",void 0);h([p()],v.prototype,"existingHeaderValue",void 0);h([p()],v.prototype,"manualResult",void 0);h([p()],v.prototype,"manualError",void 0);h([p()],v.prototype,"scenarioResults",void 0);h([p()],v.prototype,"liveBaseUrl",void 0);h([p()],v.prototype,"liveEndpointPath",void 0);h([p()],v.prototype,"liveAction",void 0);h([p()],v.prototype,"liveIdentifier",void 0);h([p()],v.prototype,"livePassword",void 0);h([p()],v.prototype,"liveRequireCsrfToken",void 0);h([p()],v.prototype,"liveLoading",void 0);h([p()],v.prototype,"liveTokenFetching",void 0);h([p()],v.prototype,"liveCsrfToken",void 0);h([p()],v.prototype,"liveHeaders",void 0);h([p()],v.prototype,"liveResult",void 0);h([p()],v.prototype,"liveError",void 0);v=h([ne("csrf-demo")],v);ee(f`<app-root></app-root>`,document.querySelector("#fetch-demo"));ee(f`<csrf-demo></csrf-demo>`,document.querySelector("#csrf-demo"));
