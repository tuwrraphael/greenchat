!function(e){var t={};function n(i){if(t[i])return t[i].exports;var s=t[i]={i:i,l:!1,exports:{}};return e[i].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(i,s,function(t){return e[t]}.bind(null,s));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t){e.exports="<div> <h1> Welcome to greenchat! </h1> <p>Your device is being prepared, please hold on.</p> </div>"},function(e,t){e.exports="<h1>Greenchat Home</h1> <nav> <a href=link-device>Link Device</a> </nav> <h2>List of your notes</h2> <ol id=notes-list> </ol> <div> <p>Add a note</p> <div> <input type=text id=note-content /> </div> <div> <button type=button id=addNoteBtn>Add Note</button> </div> </div>"},function(e,t){e.exports="<h1>Link another of your devices to this account</h1> <div id=process-start-pane> <p>On the first device generate device invite code: <button type=button id=generate>Start</button></p> <p> On the second device paste the invite code: </p><div> <input type=text id=pasted-code /> <button id=redeem-code>redeem code</button> </div> <p></p> </div> <div id=invite-code-pane> Invite-Code: <span id=inv-code></span> </div>"},function(e,t,n){"use strict";n.r(t);class i{constructor(e,t){this.routeResolver=e,this.routeRenderer=t,this.lastRoute=null,this.popStateListener=this.handlePopState.bind(this)}handlePopState(e){this.doRouting(window.location.pathname)}run(){let e=document.querySelector("base");this.basePrefix=e.getAttribute("href"),this.baseHref=e.href,window.addEventListener("popstate",this.popStateListener),this.doRouting(window.location.pathname)}destroy(){window.removeEventListener("popstate",this.popStateListener)}doRouting(e){let t=this.getRoute(e),n=this.routeResolver.resolve(this.lastRoute,t,this);return!!n&&(this.routeRenderer.render(n),this.lastRoute=t,!0)}getRoute(e){let t=e===this.baseHref,n=e.substr(0,this.basePrefix.length)===this.basePrefix;return t?"/":n?e.substring(this.basePrefix.length):e}navigate(e,t){let n=new URL(e,this.baseHref);this.doRouting(n.pathname)&&window.history.pushState({},t||document.title,n.href)}}class s{constructor(){this.currentComponent=null}render(e){e&&(this.currentComponent&&document.body.removeChild(this.currentComponent),document.body.appendChild(e),this.currentComponent=e)}}const o=(e,t)=>t.some(t=>e instanceof t);let r,a;const c=new WeakMap,d=new WeakMap,l=new WeakMap,h=new WeakMap,u=new WeakMap;let p={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return d.get(e);if("objectStoreNames"===t)return e.objectStoreNames||l.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return f(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function g(e){p=e(p)}function y(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(a||(a=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(w(this),t),f(c.get(this))}:function(...t){return f(e.apply(w(this),t))}:function(t,...n){const i=e.call(w(this),t,...n);return l.set(i,t.sort?t.sort():[t]),f(i)}}function v(e){return"function"==typeof e?y(e):(e instanceof IDBTransaction&&function(e){if(d.has(e))return;const t=new Promise((t,n)=>{const i=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",o),e.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{n(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",s),e.addEventListener("error",o),e.addEventListener("abort",o)});d.set(e,t)}(e),o(e,r||(r=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]))?new Proxy(e,p):e)}function f(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const i=()=>{e.removeEventListener("success",s),e.removeEventListener("error",o)},s=()=>{t(f(e.result)),i()},o=()=>{n(e.error),i()};e.addEventListener("success",s),e.addEventListener("error",o)});return t.then(t=>{t instanceof IDBCursor&&c.set(t,e)}).catch(()=>{}),u.set(t,e),t}(e);if(h.has(e))return h.get(e);const t=v(e);return t!==e&&(h.set(e,t),u.set(t,e)),t}const w=e=>u.get(e);const b=["get","getKey","getAll","getAllKeys","count"],C=["put","add","delete","clear"],L=new Map;function S(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(L.get(t))return L.get(t);const n=t.replace(/FromIndex$/,""),i=t!==n,s=C.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!s&&!b.includes(n))return;const o=async function(e,...t){const o=this.transaction(e,s?"readwrite":"readonly");let r=o.store;i&&(r=r.index(t.shift()));const a=r[n](...t);return s&&await o.done,a};return L.set(t,o),o}g(e=>({...e,get:(t,n,i)=>S(t,n)||e.get(t,n,i),has:(t,n)=>!!S(t,n)||e.has(t,n)}));const m=["continue","continuePrimaryKey","advance"],I={},k=new WeakMap,A=new WeakMap,D={get(e,t){if(!m.includes(t))return e[t];let n=I[t];return n||(n=I[t]=function(...e){k.set(this,A.get(this)[t](...e))}),n}};async function*O(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,D);for(A.set(n,t),u.set(n,w(t));t;)yield n,t=await(k.get(n)||t.continue()),k.delete(n)}function E(e,t){return t===Symbol.asyncIterator&&o(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===t&&o(e,[IDBIndex,IDBObjectStore])}g(e=>({...e,get:(t,n,i)=>E(t,n)?O:e.get(t,n,i),has:(t,n)=>E(t,n)||e.has(t,n)}));class x{constructor(e,t,n,i,s,o){this.content=e,this.hash=t,this.previous=n,this.signature=i,this.timestamp=s,this.sequence=o}}class P{async getAppendOnlyLog(e){let t=await this.db.get("AppendOnlyLogs",e);return{logId:e,privateKey:t.privateKey,publicKey:t.publicKey,sequence:t.sequence}}async getLastMessage(e){let t=await this.db.get("AppendOnlyLogs",e);if(null==t.last)return null;let n=await this.db.get("AppendOnlyLogMessages",t.last);return new x(n.content,n.hash,n.previous,n.signature,n.timestamp,n.sequence)}async storeMessages(e,t){let n=await this.db.get("AppendOnlyLogs",e);const i=this.db.transaction("AppendOnlyLogMessages","readwrite");let{last:s}=n,o=null;for(let n of t){let t={...n,logId:e,previous:s};await i.store.add(t),s=t.hash,o=t.sequence}return await i.done,n.last=s,n.sequence=o,await this.db.put("AppendOnlyLogs",n),!0}async initialize(){this.db=await function(e,t,{blocked:n,upgrade:i,blocking:s,terminated:o}={}){const r=indexedDB.open(e,t),a=f(r);return i&&r.addEventListener("upgradeneeded",e=>{i(f(r.result),e.oldVersion,e.newVersion,f(r.transaction))}),n&&r.addEventListener("blocked",()=>n()),a.then(e=>{o&&e.addEventListener("close",()=>o()),s&&e.addEventListener("versionchange",()=>s())}).catch(()=>{}),a}("greenchat-dbv2",2,{upgrade(e,t,n){[1,2].indexOf(t)>-1&&[2,3].indexOf(n)>-1&&(e.deleteObjectStore("AppendOnlyLogMessages"),e.deleteObjectStore("AppendOnlyLogs")),e.createObjectStore("AppendOnlyLogMessages",{keyPath:["logId","hash"]}).createIndex("logId","logId"),e.createObjectStore("AppendOnlyLogs",{keyPath:"id"})}})}async hasAppendOnlyLog(e){return!!await this.db.get("AppendOnlyLogs",e)}async createAppendOnlyLog(e,t,n){await this.db.add("AppendOnlyLogs",{id:e,privateKey:n,publicKey:t,sequence:0,last:null})}async addMessage(e,t){let n=await this.db.get("AppendOnlyLogs",e),i={...t,logId:e};await this.db.add("AppendOnlyLogMessages",i),n.last=i.hash,n.sequence=i.sequence,await this.db.put("AppendOnlyLogs",n)}async*getAll(e){const t=this.db.transaction("AppendOnlyLogMessages").store.index("logId");for await(const n of t.iterate(e)){let e=n.value;yield new x(e.content,e.hash,e.previous,e.signature,e.timestamp,e.sequence)}}}var M=n(0),T=n.n(M);class q extends HTMLElement{constructor(){super(),this.innerHTML=T.a}connectedCallback(){}}customElements.define("app-first-time-init",q);var B=n(1),R=n.n(B);class N extends HTMLElement{constructor(){super(),this.innerHTML=R.a}addServices(e){this.store=e.store,this.notesActionCreator=e.notesActionCreator,this.routingActionCreator=e.routingActionCreator}connectedCallback(){this.list=this.querySelector("#notes-list"),this.noteContent=this.querySelector("#note-content"),this.querySelector("#addNoteBtn").addEventListener("click",()=>{this.notesActionCreator.takeNote(this.noteContent.value),this.noteContent.value=""}),this.querySelectorAll("a").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),this.routingActionCreator.navigate(e.getAttribute("href"))})}),this.subscription=this.store.subscribe("notes",e=>this.applyStoreState(e)),this.applyStoreState(this.store.state)}applyStoreState(e){this.list.innerHTML="";for(let t of e.notes.notes){let e=document.createElement("li");e.innerText=t,this.list.appendChild(e)}}disconnectedCallback(){this.subscription()}}customElements.define("app-home",N);var j,H,K,_,z,U=n(2),W=n.n(U);!function(e){e[e.Started=0]="Started",e[e.Succeeded=1]="Succeeded",e[e.Error=2]="Error",e[e.Uninitialized=3]="Uninitialized"}(j||(j={}));class J extends HTMLElement{constructor(){super(),this.innerHTML=W.a}addServices(e){this.store=e.store,this.deviceLinkActionCreator=e.deviceLinkActionCreator}connectedCallback(){this.invitePane=this.querySelector("#invite-code-pane"),this.processStartPane=this.querySelector("#process-start-pane"),this.generateButton=this.querySelector("#generate"),this.pasteButton=this.querySelector("#redeem-code"),this.invCode=this.querySelector("#inv-code"),this.pastedCode=this.querySelector("#pasted-code"),this.invitePane.style.display="none",this.generateButton.addEventListener("click",async()=>{await this.deviceLinkActionCreator.startDeviceLinking()}),this.pasteButton.addEventListener("click",async()=>{await this.deviceLinkActionCreator.linkDevice(this.pastedCode.value)}),this.subscription=this.store.subscribe("deviceLink",e=>this.applyStoreState(e)),this.applyStoreState(this.store.state)}applyStoreState(e){this.invitePane.style.display=e.deviceLink.inviteCode?"block":"none",this.invCode.innerText=e.deviceLink.inviteCode,this.processStartPane.style.display=e.deviceLink.deviceLinkStatus==j.Uninitialized?"block":"none"}disconnectedCallback(){this.subscription()}}customElements.define("app-link-device",J),function(e){e.FirstTimeInit="first-time-init",e.LinkDevice="link-device",e.Home=""}(H||(H={}));class F{setServiceLocator(e){this.serviceLocator=e}resolve(e,t,n){switch(t){case H.FirstTimeInit:return new q;case H.LinkDevice:{let e=new J;return e.addServices(this.serviceLocator),e}default:let e=new N;return e.addServices(this.serviceLocator),e}}}class V extends class{constructor(e){this.subscriptions=[],this.reducerSubscriptions=[],this.state=e()}subscribe(e,t){let n={area:e,call:t};return this.subscriptions.push(n),()=>{this.subscriptions.splice(this.subscriptions.indexOf(n),1)}}addReducer(e,t){this.reducerSubscriptions.push({area:e,reducer:t})}dispatch(e){let t=[];for(let n of this.reducerSubscriptions){let i;i=n.area?e=>{this.state[n.area]=e(this.state[n.area]),t.push(n.area)}:e=>{this.state=e(this.state),t.push("")},n.reducer.onDispatch(e,i)}if(t.length)for(let e of this.subscriptions)(!e.area||t.indexOf(e.area)>-1)&&e.call(this.state)}}{}!function(e){e.PublicKey="PublicKey",e.Note="Note"}(K||(K={})),function(e){e.TakeNote="TakeNote"}(_||(_={}));class ${constructor(e){this.content=e,this.type=_.TakeNote}}class G{constructor(e,t,n){this.store=e,this.localAppendOnlyLogService=t,this.messageEncoder=n}async takeNote(e){let t=await this.localAppendOnlyLogService.get("local");await t.addMessage(this.messageEncoder.encodeNote(e)),this.store.dispatch(new $(e))}}class Y{constructor(e,t,n){this.store=e,this.localAppendOnlyLogService=t,this.routingActionCreator=n}async initializeApplication(){if(await this.localAppendOnlyLogService.appendOnlyLogCreated("local")){let e=await this.localAppendOnlyLogService.get("local");for await(let t of e.getAll()){let e=JSON.parse((new TextDecoder).decode(new Uint8Array(t.content).subarray(2)));e.type==K.Note&&this.store.dispatch(new $(e.content))}}else this.routingActionCreator.navigateFirstTimeInit(),await this.localAppendOnlyLogService.create("local"),this.routingActionCreator.navigateHome()}}function Q(e){let t=new Uint8Array(e),n=t.byteLength;return window.btoa(String.fromCharCode.apply(null,t.subarray(0,n))).replace(/\=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}class X{constructor(e,t,n,i,s){this.signingKey=e,this.logId=t,this.sequence=n,this.persistence=i,this.messageEncoder=s}async addMessage(e){let t=this.sequence+1,n=await this.createLogMessage(e,await this.getPreviousHash(),t);await this.persistence.storeMessages(this.logId,[n]),this.sequence=t}async getPreviousHash(){if(0==this.sequence)return"initial";return(await this.persistence.getLastMessage(this.logId)).hash}async createLogMessage(e,t,n){let i=+new Date,s=await async function(e,t,n){let i=(new TextEncoder).encode(`${n}.${e}`),s=new Uint8Array(t),o=new Uint8Array(i.length+s.length);return o.set(i),o.set(s,i.length),{encodedContent:i,digest:await crypto.subtle.digest("SHA-256",i)}}(t,e,i),o=await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},this.signingKey,s.encodedContent);return new x(e,Q(s.digest),t,Q(o),i,n)}getAll(){return this.persistence.getAll(this.logId)}}class Z{constructor(e,t){this.persistence=e,this.messageEncoder=t}async appendOnlyLogCreated(e){return await this.persistence.hasAppendOnlyLog(e)}async create(e){let t=await crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},!1,["sign","verify"]);await this.persistence.createAppendOnlyLog(e,t.publicKey,t.privateKey);let n=new X(t.privateKey,"local",0,this.persistence,this.messageEncoder);await n.addMessage(this.messageEncoder.encodePublicKeyMessage(t.publicKey))}async get(e){let t=await this.persistence.getAppendOnlyLog(e);return new X(t.privateKey,e,t.sequence,this.persistence,this.messageEncoder)}}!function(e){e[e.Public=1]="Public"}(z||(z={}));class ee{encodePublicKeyMessage(e){let t={publicKey:e,type:K.PublicKey},n=(new TextEncoder).encode(JSON.stringify(t)),i=new Uint8Array(n.length+2);return new DataView(i.buffer).setInt32(0,z.Public,!0),i.set(n,2),i.buffer}encodeNote(e){let t={content:e,type:K.Note},n=(new TextEncoder).encode(JSON.stringify(t)),i=new Uint8Array(n.length+2);return new DataView(i.buffer).setInt32(0,z.Public,!0),i.set(n,2),i.buffer}}class te{constructor(e){this.router=e}navigateFirstTimeInit(){this.router.navigate(H.FirstTimeInit,null)}navigateHome(){this.router.navigate(H.Home,null)}navigate(e){this.router.navigate(e,null)}}class ne{onDispatch(e,t){switch(e.type){case _.TakeNote:t(t=>{let n=t.notes||[];return n.push(e.content),{...t,notes:n}})}}}class ie{constructor(e,t,n,i){this.store=e,this.notesActionCreator=t,this.deviceLinkActionCreator=n,this.routingActionCreator=i}}function se(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16))}const oe={iceServers:[{urls:["turn:turn.greenchat.me:443"],username:"raphael",credential:"@123@test@"}]};class re extends EventTarget{constructor(e,t){super(),this.connectionId=e,this.signallingClient=t}addIceCandidate(e){this.rtcConnection.addIceCandidate(e)}setAnswer(e){this.rtcConnection.setRemoteDescription(e)}acknowledgeInit(){this.resolveInit()}setOffer(e){this.resolveConnectionRequest(e)}rejectConenctionRequest(e){this.rejectConnectionRequest(e)}onDataChannelOpen(e){this.dispatchEvent(new Event("datachannelopen",{channel:e}))}initiateChannel(e){this.rtcConnection=new RTCPeerConnection({...oe});let t=this.rtcConnection.createDataChannel("sendChannel");return t.onopen=()=>this.onDataChannelOpen(t),this.rtcConnection.onicecandidate=({candidate:e})=>{e&&this.signallingClient.publishIceCandidate(this.connectionId,e)},this.rtcConnection.createOffer().then(t=>{this.signallingClient.initiateConnection(this.connectionId,e,t),this.rtcConnection.setLocalDescription(t)}),new Promise((e,t)=>{let n=!1;this.resolveInit=()=>{n=!0,e()},setTimeout(()=>{n||(t("Timeout"),this.rtcConnection.close())},2e3)})}openChannel(){return this.rtcConnection=new RTCPeerConnection({...oe}),this.rtcConnection.onicecandidate=({candidate:e})=>{e&&this.signallingClient.publishIceCandidate(this.connectionId,e)},this.rtcConnection.ondatachannel=e=>{let t=e.channel;t.onopen=()=>{this.onDataChannelOpen(t)}},this.signallingClient.requestConnection(this.connectionId),new Promise((e,t)=>{let n=!1;this.resolveConnectionRequest=t=>{this.rtcConnection.setRemoteDescription(t).then(()=>{this.rtcConnection.createAnswer().then(t=>{this.rtcConnection.setLocalDescription(t),this.signallingClient.sendAnswer(this.connectionId,t),n=!0,e()})})},this.rejectConenctionRequest=e=>{n=!0,t(e),this.rtcConnection.close()},setTimeout(()=>{n||(t("Timeout"),this.rtcConnection.close())},1e4)})}}class ae extends EventTarget{constructor(){super(),this.localId=se(),this.handlers=[]}connect(){let e=this,t=this.socket=new WebSocket("wss://hub.greenchat.me");t.onopen=function(){t.send(JSON.stringify({type:"connected",id:e.localId})),this.dispatchEvent(new Event("connected"))},t.onerror=function(e){console.log("WebSocket Error "+e),t.close()},t.onclose=function(t){console.log("Socket is closed. Reconnect will be attempted in 1 second.",t.reason),this.dispatchEvent(new Event("disconnected")),setTimeout((function(){e.connect()}),1e3)},t.onmessage=function(t){let n=JSON.parse(t.data);switch(n.type){case"connection_initialized":e.handlers.find(e=>e.connectionId===n.connectionId).acknowledgeInit();break;case"connection_offer":e.handlers.find(e=>e.connectionId===n.connectionId).setOffer(n.offer);break;case"connection_accepted":e.handlers.find(e=>e.connectionId===n.connectionId).setAnswer(n.answer);break;case"connection_not_found":e.handlers.find(e=>e.connectionId===n.connectionId).rejectConenctionRequest("Not found");break;case"new_ice_candidate":e.handlers.find(e=>e.connectionId===n.connectionId).addIceCandidate(n.candidate)}}}async initializeDeviceLinkChannel(e){let t=new re(se(),this);return this.handlers.push(t),await t.initiateChannel(e),{connectionHandler:t}}async openDeviceLinkChannel(e){let t=new re(e,this);return this.handlers.push(t),await t.openChannel(),{connectionHandler:t}}requestConnection(e){this.socket.send(JSON.stringify({type:"request_connection",connectionId:e}))}sendAnswer(e,t){this.socket.send(JSON.stringify({type:"accept_connection",connectionId:e,answer:t}))}initiateConnection(e,t,n){this.socket.send(JSON.stringify({type:"initialize_connection",connectionId:e,timeout:t,offer:n}))}publishIceCandidate(e,t){this.socket.send(JSON.stringify({type:"new_ice_candidate",candidate:t,id:this.localId,connectionId:e}))}}var ce,de;!function(e){e.SignallingConnectionChanged="SignallingConnectionChanged"}(ce||(ce={}));class le{constructor(e){this.connected=e,this.type=ce.SignallingConnectionChanged}}class he{constructor(e,t){this.store=e,this.signallingClient=t,this.signallingClient.addEventListener("connected",()=>{this.store.dispatch(new le(!0))}),this.signallingClient.addEventListener("disconnected",()=>{this.store.dispatch(new le(!1))})}startSignalling(){this.signallingClient.connect()}}class ue{onDispatch(e,t){switch(e.type){case ce.SignallingConnectionChanged:t(t=>({...t,signallingConnected:e.connected}))}}}!function(e){e.DeviceLinkChannelInitialized="DeviceLinkChannelInitialized",e.DeviceLinkStatusChanged="DeviceLinkStatusChanged"}(de||(de={}));class pe{constructor(e){this.connectionId=e,this.type=de.DeviceLinkChannelInitialized}}class ge{constructor(e){this.status=e,this.type=de.DeviceLinkStatusChanged}}class ye{constructor(e,t){this.store=e,this.signallingClient=t}async startDeviceLinking(){let e=await this.signallingClient.initializeDeviceLinkChannel(12e4);e.connectionHandler.addEventListener("datachannelopen",e=>{console.log("connected")}),this.store.dispatch(new pe(e.connectionHandler.connectionId))}async linkDevice(e){try{(await this.signallingClient.openDeviceLinkChannel(e)).connectionHandler.addEventListener("datachannelopen",e=>{console.log("connected")})}catch(e){this.store.dispatch(new ge(j.Error))}}}class ve{onDispatch(e,t){switch(e.type){case de.DeviceLinkChannelInitialized:t(t=>({...t,inviteCode:e.connectionId,deviceLinkStatus:j.Started}));break;case de.DeviceLinkStatusChanged:t(t=>({...t,deviceLinkStatus:e.status}))}}}(async function(){const e=new P,t=new ae,n=new F,o=new i(n,new s),r=new V(()=>({signallingConnected:!1,notes:{notes:[]},deviceLink:{deviceLinkStatus:j.Uninitialized,inviteCode:null}}));r.addReducer("notes",new ne),r.addReducer(null,new ue),r.addReducer("deviceLink",new ve);const a=new ee,c=new Z(e,a),d=new te(o),l=new Y(r,c,d),h=new G(r,c,a),u=new he(r,t),p=new ye(r,t),g=new ie(r,h,p,d);n.setServiceLocator(g),await e.initialize(),o.run(),await l.initializeApplication(),u.startSignalling()})().catch(e=>console.error(e))}]);
//# sourceMappingURL=f6bc3f449965082b8a0a.bundle.js.map