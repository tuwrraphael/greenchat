!function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t){e.exports="<div> <h1> Welcome to greenchat! </h1> <p>Your device is being prepared, please hold on.</p> </div>"},function(e,t){e.exports="<h1>Greenchat Home</h1> <nav> <a href=link-device>Link Device</a> </nav> <h2>List of your notes</h2> <ol id=notes-list> </ol> <div> <p>Add a note</p> <div> <input type=text id=note-content /> </div> <div> <button type=button id=addNoteBtn>Add Note</button> </div> </div>"},function(e,t){e.exports="<h1>Link another of your devices to this account</h1> <div id=process-start-pane> <p>On the first device generate device invite code: <button type=button id=generate>Start</button></p> <p> On the second device paste the invite code: </p><div> <input type=text id=pasted-code /> <button id=redeem-code>redeem code</button> </div> <p></p> </div> <div id=invite-code-pane> Invite-Code: <span id=inv-code></span> </div>"},function(e,t,n){"use strict";n.r(t);class i{constructor(e,t){this.routeResolver=e,this.routeRenderer=t,this.lastRoute=null,this.popStateListener=this.handlePopState.bind(this)}handlePopState(e){this.doRouting(window.location.pathname)}run(){let e=document.querySelector("base");this.basePrefix=e.getAttribute("href"),this.baseHref=e.href,window.addEventListener("popstate",this.popStateListener),this.doRouting(window.location.pathname)}destroy(){window.removeEventListener("popstate",this.popStateListener)}doRouting(e){let t=this.getRoute(e),n=this.routeResolver.resolve(this.lastRoute,t,this);return!!n&&(this.routeRenderer.render(n),this.lastRoute=t,!0)}getRoute(e){let t=e===this.baseHref,n=e.substr(0,this.basePrefix.length)===this.basePrefix;return t?"/":n?e.substring(this.basePrefix.length):e}navigate(e,t){let n=new URL(e,this.baseHref);this.doRouting(n.pathname)&&window.history.pushState({},t||document.title,n.href)}}class o{constructor(){this.currentComponent=null}render(e){e&&(this.currentComponent&&document.body.removeChild(this.currentComponent),document.body.appendChild(e),this.currentComponent=e)}}const s=(e,t)=>t.some(t=>e instanceof t);let r,c;const a=new WeakMap,d=new WeakMap,l=new WeakMap,u=new WeakMap,h=new WeakMap;let p={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return d.get(e);if("objectStoreNames"===t)return e.objectStoreNames||l.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return g(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function f(e){p=e(p)}function v(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(c||(c=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(w(this),t),g(a.get(this))}:function(...t){return g(e.apply(w(this),t))}:function(t,...n){const i=e.call(w(this),t,...n);return l.set(i,t.sort?t.sort():[t]),g(i)}}function y(e){return"function"==typeof e?v(e):(e instanceof IDBTransaction&&function(e){if(d.has(e))return;const t=new Promise((t,n)=>{const i=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{t(),i()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)});d.set(e,t)}(e),s(e,r||(r=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]))?new Proxy(e,p):e)}function g(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const i=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{t(g(e.result)),i()},s=()=>{n(e.error),i()};e.addEventListener("success",o),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&a.set(t,e)}).catch(()=>{}),h.set(t,e),t}(e);if(u.has(e))return u.get(e);const t=y(e);return t!==e&&(u.set(e,t),h.set(t,e)),t}const w=e=>h.get(e);const b=["get","getKey","getAll","getAllKeys","count"],C=["put","add","delete","clear"],m=new Map;function L(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(m.get(t))return m.get(t);const n=t.replace(/FromIndex$/,""),i=t!==n,o=C.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!o&&!b.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,o?"readwrite":"readonly");let r=s.store;i&&(r=r.index(t.shift()));const c=r[n](...t);return o&&await s.done,c};return m.set(t,s),s}f(e=>({...e,get:(t,n,i)=>L(t,n)||e.get(t,n,i),has:(t,n)=>!!L(t,n)||e.has(t,n)}));const S=["continue","continuePrimaryKey","advance"],I={},k=new WeakMap,O=new WeakMap,A={get(e,t){if(!S.includes(t))return e[t];let n=I[t];return n||(n=I[t]=function(...e){k.set(this,O.get(this)[t](...e))}),n}};async function*D(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,A);for(O.set(n,t),h.set(n,w(t));t;)yield n,t=await(k.get(n)||t.continue()),k.delete(n)}function x(e,t){return t===Symbol.asyncIterator&&s(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===t&&s(e,[IDBIndex,IDBObjectStore])}f(e=>({...e,get:(t,n,i)=>x(t,n)?D:e.get(t,n,i),has:(t,n)=>x(t,n)||e.has(t,n)}));class E{constructor(e,t,n,i,o,s){this.content=e,this.hash=t,this.last=n,this.signature=i,this.timestamp=o,this.sequence=s}}function P(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16))}var R=function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}a((i=i.apply(e,t||[])).next())}))},T=function(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,n=e[Symbol.asyncIterator];return n?n.call(e):(e="function"==typeof __values?__values(e):e[Symbol.iterator](),t={},i("next"),i("throw"),i("return"),t[Symbol.asyncIterator]=function(){return this},t);function i(n){t[n]=e[n]&&function(t){return new Promise((function(i,o){(function(e,t,n,i){Promise.resolve(i).then((function(t){e({value:t,done:n})}),t)})(i,o,(t=e[n](t)).done,t.value)}))}}},j=function(e){return this instanceof j?(this.v=e,this):new j(e)},M=function(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i,o=n.apply(e,t||[]),s=[];return i={},r("next"),r("throw"),r("return"),i[Symbol.asyncIterator]=function(){return this},i;function r(e){o[e]&&(i[e]=function(t){return new Promise((function(n,i){s.push([e,t,n,i])>1||c(e,t)}))})}function c(e,t){try{(n=o[e](t)).value instanceof j?Promise.resolve(n.value.v).then(a,d):l(s[0][2],n)}catch(e){l(s[0][3],e)}var n}function a(e){c("next",e)}function d(e){c("throw",e)}function l(e,t){e(t),s.shift(),s.length&&c(s[0][0],s[0][1])}};class q{getAppendOnlyLog(e){return R(this,void 0,void 0,(function*(){let t=yield this.db.get("AppendOnlyLogs",e);return{logId:e,privateKey:t.privateKey,publicKey:t.publicKey,sequence:t.sequence}}))}getLastMessage(e){return R(this,void 0,void 0,(function*(){let t=yield this.db.get("AppendOnlyLogs",e);if(null==t.top)return null;let n=yield this.db.get("AppendOnlyLogMessages",t.top);return new E(n.content,n.hash,n.last,n.signature,n.timestamp,n.sequence)}))}storeMessages(e,t){return R(this,void 0,void 0,(function*(){let n=yield this.db.get("AppendOnlyLogs",e);const i=this.db.transaction("AppendOnlyLogMessages","readwrite");let{top:o}=n,s=null;for(let n of t){let t=Object.assign(Object.assign({},n),{logId:e,id:P(),before:o});yield i.store.add(t),o=t.id,s=t.sequence}return yield i.done,n.top=o,n.sequence=s,yield this.db.put("AppendOnlyLogs",n),!0}))}initialize(){return R(this,void 0,void 0,(function*(){this.db=yield function(e,t,{blocked:n,upgrade:i,blocking:o,terminated:s}={}){const r=indexedDB.open(e,t),c=g(r);return i&&r.addEventListener("upgradeneeded",e=>{i(g(r.result),e.oldVersion,e.newVersion,g(r.transaction))}),n&&r.addEventListener("blocked",()=>n()),c.then(e=>{s&&e.addEventListener("close",()=>s()),o&&e.addEventListener("versionchange",()=>o())}).catch(()=>{}),c}("greenchat-dbv2",1,{upgrade(e){e.createObjectStore("AppendOnlyLogMessages",{keyPath:"id"}).createIndex("logId","logId"),e.createObjectStore("AppendOnlyLogs",{keyPath:"id"})}})}))}hasAppendOnlyLog(e){return R(this,void 0,void 0,(function*(){return!!(yield this.db.get("AppendOnlyLogs",e))}))}createAppendOnlyLog(e,t,n){return R(this,void 0,void 0,(function*(){yield this.db.add("AppendOnlyLogs",{id:e,privateKey:n,publicKey:t,sequence:0,top:null})}))}addMessage(e,t){return R(this,void 0,void 0,(function*(){let n=yield this.db.get("AppendOnlyLogs",e),i=Object.assign(Object.assign({},t),{logId:e,id:P(),before:n.top});yield this.db.add("AppendOnlyLogMessages",i),n.top=i.id,n.sequence=i.sequence,yield this.db.put("AppendOnlyLogs",n)}))}getAll(e){return M(this,arguments,(function*(){var t,n;const i=this.db.transaction("AppendOnlyLogMessages").store.index("logId");try{for(var o,s=T(i.iterate(e));!(o=yield j(s.next())).done;){let e=o.value.value;yield yield j(new E(e.content,e.hash,e.last,e.signature,e.timestamp,e.sequence))}}catch(e){t={error:e}}finally{try{o&&!o.done&&(n=s.return)&&(yield j(n.call(s)))}finally{if(t)throw t.error}}}))}}var B=n(0),N=n.n(B);class _ extends HTMLElement{constructor(){super();const e=this.attachShadow({mode:"open"});let t=document.createElement("div");t.innerHTML=N.a,e.appendChild(t)}connectedCallback(){}}customElements.define("app-first-time-init",_);var K=n(1),H=n.n(K);class z extends HTMLElement{constructor(){super();const e=this.attachShadow({mode:"open"});let t=document.createElement("div");t.innerHTML=H.a,e.appendChild(t)}addServices(e){this.store=e.store,this.notesActionCreator=e.notesActionCreator,this.routingActionCreator=e.routingActionCreator}connectedCallback(){this.list=this.shadowRoot.querySelector("#notes-list"),this.noteContent=this.shadowRoot.querySelector("#note-content"),this.shadowRoot.querySelector("#addNoteBtn").addEventListener("click",()=>{this.notesActionCreator.takeNote(this.noteContent.value),this.noteContent.value=""}),this.shadowRoot.querySelectorAll("a").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),this.routingActionCreator.navigate(e.getAttribute("href"))})}),this.subscription=this.store.subscribe("notes",e=>{this.list.innerHTML="";for(let t of e.notes.notes){let e=document.createElement("li");e.innerText=t,this.list.appendChild(e)}})}disconnectedCallback(){this.subscription()}}customElements.define("app-home",z);var U,W=n(2),J=n.n(W);!function(e){e[e.Started=0]="Started",e[e.Succeeded=1]="Succeeded",e[e.Error=2]="Error",e[e.Uninitialized=3]="Uninitialized"}(U||(U={}));var F,V,$=function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}a((i=i.apply(e,t||[])).next())}))};class G extends HTMLElement{constructor(){super();const e=this.attachShadow({mode:"open"});let t=document.createElement("div");t.innerHTML=J.a,e.appendChild(t)}addServices(e){this.store=e.store,this.deviceLinkActionCreator=e.deviceLinkActionCreator}connectedCallback(){this.invitePane=this.shadowRoot.querySelector("#invite-code-pane"),this.processStartPane=this.shadowRoot.querySelector("#process-start-pane"),this.generateButton=this.shadowRoot.querySelector("#generate"),this.pasteButton=this.shadowRoot.querySelector("#redeem-code"),this.invCode=this.shadowRoot.querySelector("#inv-code"),this.pastedCode=this.shadowRoot.querySelector("#pasted-code"),this.invitePane.style.display="none",this.generateButton.addEventListener("click",()=>$(this,void 0,void 0,(function*(){yield this.deviceLinkActionCreator.startDeviceLinking()}))),this.pasteButton.addEventListener("click",()=>$(this,void 0,void 0,(function*(){yield this.deviceLinkActionCreator.linkDevice(this.pastedCode.value)}))),this.subscription=this.store.subscribe("deviceLink",e=>{this.invitePane.style.display=e.deviceLink.inviteCode?"block":"none",this.invCode.innerText=e.deviceLink.inviteCode,this.processStartPane.style.display=e.deviceLink.deviceLinkStatus==U.Uninitialized?"block":"none"})}disconnectedCallback(){this.subscription()}}customElements.define("app-link-device",G),function(e){e.FirstTimeInit="first-time-init",e.LinkDevice="link-device",e.Home=""}(F||(F={}));class Y{setServiceLocator(e){this.serviceLocator=e}resolve(e,t,n){switch(t){case F.FirstTimeInit:return new _;case F.LinkDevice:{let e=new G;return e.addServices(this.serviceLocator),e}default:let e=new z;return e.addServices(this.serviceLocator),e}}}class Q{constructor(e){this.subscriptions=[],this.reducerSubscriptions=[],this.state=e()}subscribe(e,t){let n={area:e,call:t};return this.subscriptions.push(n),()=>{this.subscriptions.splice(this.subscriptions.indexOf(n),1)}}addReducer(e,t){this.reducerSubscriptions.push({area:e,reducer:t})}dispatch(e){let t=[];for(let n of this.reducerSubscriptions){let i;i=n.area?e=>{this.state[n.area]=e(this.state[n.area]),t.push(n.area)}:e=>{this.state=e(this.state),t.push("")},n.reducer.onDispatch(e,i)}if(t.length)for(let e of this.subscriptions)(!e.area||t.indexOf(e.area)>-1)&&e.call(this.state)}}!function(e){e.PublicKey="PublicKey",e.Note="Note"}(V||(V={}));var X,Z=function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}a((i=i.apply(e,t||[])).next())}))};!function(e){e.TakeNote="TakeNote"}(X||(X={}));class ee{constructor(e){this.content=e,this.type=X.TakeNote}}class te{constructor(e,t,n){this.store=e,this.localAppendOnlyLogService=t,this.messageEncoder=n}takeNote(e){return Z(this,void 0,void 0,(function*(){let t=yield this.localAppendOnlyLogService.get("local");yield t.addMessage(this.messageEncoder.encodeNote(e)),this.store.dispatch(new ee(e))}))}}var ne=function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}a((i=i.apply(e,t||[])).next())}))},ie=function(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,n=e[Symbol.asyncIterator];return n?n.call(e):(e="function"==typeof __values?__values(e):e[Symbol.iterator](),t={},i("next"),i("throw"),i("return"),t[Symbol.asyncIterator]=function(){return this},t);function i(n){t[n]=e[n]&&function(t){return new Promise((function(i,o){(function(e,t,n,i){Promise.resolve(i).then((function(t){e({value:t,done:n})}),t)})(i,o,(t=e[n](t)).done,t.value)}))}}};class oe{constructor(e,t,n){this.store=e,this.localAppendOnlyLogService=t,this.routingActionCreator=n}initializeApplication(){var e,t;return ne(this,void 0,void 0,(function*(){if(yield this.localAppendOnlyLogService.appendOnlyLogCreated("local")){let o=yield this.localAppendOnlyLogService.get("local");try{for(var n,i=ie(o.getAll());!(n=yield i.next()).done;){let e=n.value,t=JSON.parse((new TextDecoder).decode(new Uint8Array(e.content).subarray(2)));t.type==V.Note&&this.store.dispatch(new ee(t.content))}}catch(t){e={error:t}}finally{try{n&&!n.done&&(t=i.return)&&(yield t.call(i))}finally{if(e)throw e.error}}}else this.routingActionCreator.navigateFirstTimeInit(),yield this.localAppendOnlyLogService.create("local"),this.routingActionCreator.navigateHome()}))}}function se(e){let t=new Uint8Array(e),n=t.byteLength;return window.btoa(String.fromCharCode.apply(null,t.subarray(0,n))).replace(/\=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}var re=function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}a((i=i.apply(e,t||[])).next())}))};var ce=function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}a((i=i.apply(e,t||[])).next())}))};class ae{constructor(e,t,n,i){this.signingKey=e,this.logId=t,this.sequence=n,this.persistence=i}addMessage(e){return ce(this,void 0,void 0,(function*(){let t;if(0==this.sequence)t="initial";else{t=(yield this.persistence.getLastMessage(this.logId)).hash}let n=this.sequence+1,i=yield this.createLogMessage(e,t,n);yield this.persistence.storeMessages(this.logId,[i]),this.sequence=n}))}createLogMessage(e,t,n){return ce(this,void 0,void 0,(function*(){let i=+new Date,o=yield function(e,t,n){return re(this,void 0,void 0,(function*(){let i=(new TextEncoder).encode(`${n}.${e}`),o=new Uint8Array(t),s=new Uint8Array(i.length+o.length);return s.set(i),s.set(o,i.length),{encodedContent:i,digest:yield crypto.subtle.digest("SHA-256",i)}}))}(t,e,i),s=yield crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},this.signingKey,o.encodedContent);return new E(e,se(o.digest),t,se(s),i,n)}))}getAll(){return this.persistence.getAll(this.logId)}}var de,le=function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}a((i=i.apply(e,t||[])).next())}))};class ue{constructor(e,t){this.persistence=e,this.messageFactory=t}appendOnlyLogCreated(e){return le(this,void 0,void 0,(function*(){return yield this.persistence.hasAppendOnlyLog(e)}))}create(e){return le(this,void 0,void 0,(function*(){let t=yield crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},!1,["sign","verify"]);yield this.persistence.createAppendOnlyLog(e,t.publicKey,t.privateKey);let n=new ae(t.privateKey,"local",0,this.persistence);yield n.addMessage(this.messageFactory.encodePublicKeyMessage(t.publicKey))}))}get(e){return le(this,void 0,void 0,(function*(){let t=yield this.persistence.getAppendOnlyLog(e);return new ae(t.privateKey,e,t.sequence,this.persistence)}))}}!function(e){e[e.Public=1]="Public"}(de||(de={}));class he{encodePublicKeyMessage(e){let t={publicKey:e,type:V.PublicKey},n=(new TextEncoder).encode(JSON.stringify(t)),i=new Uint8Array(n.length+2);return new DataView(i.buffer).setInt32(0,de.Public,!0),i.set(n,2),i.buffer}encodeNote(e){let t={content:e,type:V.Note},n=(new TextEncoder).encode(JSON.stringify(t)),i=new Uint8Array(n.length+2);return new DataView(i.buffer).setInt32(0,de.Public,!0),i.set(n,2),i.buffer}}class pe{constructor(e){this.router=e}navigateFirstTimeInit(){this.router.navigate(F.FirstTimeInit,null)}navigateHome(){this.router.navigate(F.Home,null)}navigate(e){this.router.navigate(e,null)}}class fe{onDispatch(e,t){switch(e.type){case X.TakeNote:t(t=>{let n=t.notes||[];return n.push(e.content),Object.assign(Object.assign({},t),{notes:n})})}}}class ve{constructor(e,t,n,i){this.store=e,this.notesActionCreator=t,this.deviceLinkActionCreator=n,this.routingActionCreator=i}}const ye={iceServers:[{urls:["turn:turn.greenchat.me:443"],username:"raphael",credential:"@123@test@"}]};class ge extends EventTarget{constructor(e,t){super(),this.connectionId=e,this.signallingClient=t}addIceCandidate(e){this.rtcConnection.addIceCandidate(e)}setAnswer(e){this.rtcConnection.setRemoteDescription(e)}acknowledgeInit(){this.resolveInit()}setOffer(e){this.resolveConnectionRequest(e)}rejectConenctionRequest(e){this.rejectConnectionRequest(e)}onDataChannelOpen(e){this.dispatchEvent(new Event("datachannelopen",{channel:e}))}initiateChannel(e){this.rtcConnection=new RTCPeerConnection(Object.assign({},ye));let t=this.rtcConnection.createDataChannel("sendChannel");return t.onopen=()=>this.onDataChannelOpen(t),this.rtcConnection.onicecandidate=({candidate:e})=>{e&&this.signallingClient.publishIceCandidate(this.connectionId,e)},this.rtcConnection.createOffer().then(t=>{this.signallingClient.initiateConnection(this.connectionId,e,t),this.rtcConnection.setLocalDescription(t)}),new Promise((e,t)=>{let n=!1;this.resolveInit=()=>{n=!0,e()},setTimeout(()=>{n||(t("Timeout"),this.rtcConnection.close())},2e3)})}openChannel(){return this.rtcConnection=new RTCPeerConnection(Object.assign({},ye)),this.rtcConnection.onicecandidate=({candidate:e})=>{e&&this.signallingClient.publishIceCandidate(this.connectionId,e)},this.rtcConnection.ondatachannel=e=>{let t=e.channel;t.onopen=()=>{this.onDataChannelOpen(t)}},this.signallingClient.requestConnection(this.connectionId),new Promise((e,t)=>{let n=!1;this.resolveConnectionRequest=t=>{this.rtcConnection.setRemoteDescription(t).then(()=>{this.rtcConnection.createAnswer().then(t=>{this.rtcConnection.setLocalDescription(t),this.signallingClient.sendAnswer(this.connectionId,t),n=!0,e()})})},this.rejectConenctionRequest=e=>{n=!0,t(e),this.rtcConnection.close()},setTimeout(()=>{n||(t("Timeout"),this.rtcConnection.close())},1e4)})}}var we,be=function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}a((i=i.apply(e,t||[])).next())}))};class Ce extends EventTarget{constructor(){super(),this.localId=P(),this.handlers=[]}connect(){let e=this,t=this.socket=new WebSocket("ws://localhost:33713");t.onopen=function(){t.send(JSON.stringify({type:"connected",id:e.localId})),this.dispatchEvent(new Event("connected"))},t.onerror=function(e){console.log("WebSocket Error "+e),t.close()},t.onclose=function(t){console.log("Socket is closed. Reconnect will be attempted in 1 second.",t.reason),this.dispatchEvent(new Event("disconnected")),setTimeout((function(){e.connect()}),1e3)},t.onmessage=function(t){let n=JSON.parse(t.data);switch(n.type){case"connection_initialized":e.handlers.find(e=>e.connectionId===n.connectionId).acknowledgeInit();break;case"connection_offer":e.handlers.find(e=>e.connectionId===n.connectionId).setOffer(n.offer);break;case"connection_accepted":e.handlers.find(e=>e.connectionId===n.connectionId).setAnswer(n.answer);break;case"connection_not_found":e.handlers.find(e=>e.connectionId===n.connectionId).rejectConenctionRequest("Not found");break;case"new_ice_candidate":e.handlers.find(e=>e.connectionId===n.connectionId).addIceCandidate(n.candidate)}}}initializeDeviceLinkChannel(e){return be(this,void 0,void 0,(function*(){let t=new ge(P(),this);return this.handlers.push(t),yield t.initiateChannel(e),{connectionHandler:t}}))}openDeviceLinkChannel(e){return be(this,void 0,void 0,(function*(){let t=new ge(e,this);return this.handlers.push(t),yield t.openChannel(),{connectionHandler:t}}))}requestConnection(e){this.socket.send(JSON.stringify({type:"request_connection",connectionId:e}))}sendAnswer(e,t){this.socket.send(JSON.stringify({type:"accept_connection",connectionId:e,answer:t}))}initiateConnection(e,t,n){this.socket.send(JSON.stringify({type:"initialize_connection",connectionId:e,timeout:t,offer:n}))}publishIceCandidate(e,t){this.socket.send(JSON.stringify({type:"new_ice_candidate",candidate:t,id:this.localId,connectionId:e}))}}!function(e){e.SignallingConnectionChanged="SignallingConnectionChanged"}(we||(we={}));class me{constructor(e){this.connected=e,this.type=we.SignallingConnectionChanged}}class Le{constructor(e,t){this.store=e,this.signallingClient=t,this.signallingClient.addEventListener("connected",()=>{this.store.dispatch(new me(!0))}),this.signallingClient.addEventListener("disconnected",()=>{this.store.dispatch(new me(!1))})}startSignalling(){this.signallingClient.connect()}}class Se{onDispatch(e,t){switch(e.type){case we.SignallingConnectionChanged:t(t=>Object.assign(Object.assign({},t),{signallingConnected:e.connected}))}}}var Ie,ke=function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}a((i=i.apply(e,t||[])).next())}))};!function(e){e.DeviceLinkChannelInitialized="DeviceLinkChannelInitialized",e.DeviceLinkStatusChanged="DeviceLinkStatusChanged"}(Ie||(Ie={}));class Oe{constructor(e){this.connectionId=e,this.type=Ie.DeviceLinkChannelInitialized}}class Ae{constructor(e){this.status=e,this.type=Ie.DeviceLinkStatusChanged}}class De{constructor(e,t){this.store=e,this.signallingClient=t}startDeviceLinking(){return ke(this,void 0,void 0,(function*(){let e=yield this.signallingClient.initializeDeviceLinkChannel(12e4);e.connectionHandler.addEventListener("datachannelopen",e=>{console.log("connected")}),this.store.dispatch(new Oe(e.connectionHandler.connectionId))}))}linkDevice(e){return ke(this,void 0,void 0,(function*(){try{(yield this.signallingClient.openDeviceLinkChannel(e)).connectionHandler.addEventListener("datachannelopen",e=>{console.log("connected")})}catch(e){this.store.dispatch(new Ae(U.Error))}}))}}class xe{onDispatch(e,t){switch(e.type){case Ie.DeviceLinkChannelInitialized:t(t=>Object.assign(Object.assign({},t),{inviteCode:e.connectionId,deviceLinkStatus:U.Started}));break;case Ie.DeviceLinkStatusChanged:t(t=>Object.assign(Object.assign({},t),{deviceLinkStatus:e.status}))}}}var Ee=function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{a(i.next(e))}catch(e){s(e)}}function c(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,c)}a((i=i.apply(e,t||[])).next())}))};(function(){return Ee(this,void 0,void 0,(function*(){const e=new q,t=new Ce,n=new Y,s=new i(n,new o),r=new Q(()=>({signallingConnected:!1,notes:{notes:[]},deviceLink:{deviceLinkStatus:U.Uninitialized,inviteCode:null}}));r.addReducer("notes",new fe),r.addReducer(null,new Se),r.addReducer("deviceLink",new xe);const c=new he,a=new ue(e,c),d=new pe(s),l=new oe(r,a,d),u=new te(r,a,c),h=new Le(r,t),p=new De(r,t),f=new ve(r,u,p,d);n.setServiceLocator(f),yield e.initialize(),s.run(),yield l.initializeApplication(),h.startSignalling()}))})().catch(e=>console.error(e))}]);
//# sourceMappingURL=a312be8b2e3ceb8d3e45.bundle.js.map