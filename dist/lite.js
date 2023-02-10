(()=>{function v(f={}){return{runtimeParams:{...E,...f.runtimeParams||{}},compilerParams:{...A,...f.compilerParams||{}},parserParams:{...O,...f.parserParams||{}}}}var O={ecmaVersion:"2020",allowReturnOutsideFunction:!0,allowAwaitOutsideFunction:!0,allowSuperOutsideMethod:!0,preserveParens:!1,locations:!1},A={globalsNoObserve:["globalThis","arguments","console"],originalSource:!0,globalsOnlyPaths:!1,locations:!1,compact:2},E={apiVersion:1};function I(f,r=!1){let e=f.split(/\n/g);if(e.length>1){for(;!e[0].trim().length;)e.shift();let t=e[r?1:0].split(/[^\s]/)[0].length;if(t)return e.map((i,n)=>{let s=i.substring(0,t);return s.trim().length?s.trim()==="}"&&n===e.length-1?"}":i:i.substring(t)}).join(`
`)}return f}var g=(f,r)=>f instanceof Promise?f.then(r):r(f);var P=new Map;function F(f,r,e=void 0){let t=P.get(f);if(arguments.length>2){t||(t=new Map,P.set(f,t)),t.set(r,e);return}return t&&t.get(r)}var S=class{constructor(r,e,t,i={},n=null,s=null){this.ownerContract=r,this.graph=e,this.callee=t,this.params=r?i:{...i,isSubscriptFunction:!0},this.exits=s||new Map,this.$thread=n||{entries:new Map,sequence:[],ownerContract:this},this.subContracts=new Map,this.observers=[],this.contract=function(o,c,u=null,h=null){if(!this.graph.subContracts[o])throw new Error(`[${this.graph.type}:${this.graph.lineage}]: Graph not found for child contract ${o}.`);let a=this.graph.subContracts[o],l={...this.params,isIterationContract:arguments.length===3,iterationId:arguments.length===3&&c,isFunctionContract:arguments.length===4,functionType:arguments.length===4&&c,isSubscriptFunction:arguments.length===4&&u,functionScope:this.params.isFunctionContract&&this.graph.lineage||this.params.functionScope};if(l.isIterationContract){let w=u,m=new S(this,a,w,l,this.$thread,this.exits),b=this.subContracts.get(o);return b||(b=new Map,this.subContracts.set(o,b)),b.has(l.iterationId)&&b.get(l.iterationId).dispose(),b.set(l.iterationId,m),m.call()}let p,y,d;if(this.subContracts.has(o)&&this.subContracts.get(o).dispose(),l.isFunctionContract){p=h;let w=()=>new S(this,a,p,l);if(l.functionType!=="FunctionDeclaration")d=this.createFunction(w);else{let m=w();l.apiVersion>1?(d=function(...b){let C=m.call(this,...b);return C=g(C,j=>[C,m.thread.bind(m),m]),m=w(),C},d.target=m):d=m}}else p=c,y=new S(this,a,p,l,this.$thread,this.exits),this.subContracts.set(o,y),d=y.call();return d}.bind(this),this.contract.memo=Object.create(null),this.ownerContract&&!["FunctionDeclaration","FunctionExpression"].includes(this.graph.type)&&(this.contract.args=this.ownerContract.contract.args),this.contract.exiting=function(o,c){if(!arguments.length)return this.exits.size;let u=this.exits.get(o)===c;return u&&this.exits.clear(),u}.bind(this),this.contract.exit=function(o,c){this.exits.set(o,c)}.bind(this),this.contract.functions=new Map,this.contract.functions.declaration=(o,c)=>{this.contract.functions.set(o,c),this.applyReflection(o,typeof c=="function"?c.target:c)}}fire(r,e,t){if(!this.ownerContract)return;let i=this.ownerContract.fire(r,e,t);return this.observers.forEach(n=>{n.contractUrl===r&&n.callback(e,t)}),i}observe(r,e){!this.params.isFunctionContract||this.observers.push({contractUrl:r,callback:e})}call(r,...e){if(this.disposed)throw new Error(`[${this.graph.type}:${this.graph.lineage}]: Instance not runable after having been disposed.`);this.ownerContract||(this.contract.args=e,Object.defineProperty(this.contract.args,Symbol.toStringTag,{value:"Arguments"}));let t=this.callee.call(r,this.contract,...e);if(this.graph.$sideEffects)for(let i in this.graph.effects)for(let n of this.graph.effects[i].refs)this.buildThread([],n,[],0,!0);return g(t,()=>{if(!this.ownerContract||this.params.isFunctionContract){let i=this.exits.get("return");if(this.exits.clear(),i!==void 0)return i}return t})}iterate(r=[]){if(this.disposed)return!1;if(!["ForOfStatement","ForInStatement"].includes(this.graph.type)||this.subContracts.size!==1)throw new Error(`Contract ${this.graph.lineage} is not an iterator.`);let[[,e]]=this.subContracts,t;if(!r.length||r.includes("length")&&this.graph.type==="ForOfStatement")for(let[,i]of e)t=g(t,()=>i.call());else for(let i of r){let n=e.get(i)||e.get(parseInt(i));!n||(t=g(t,()=>n.call()))}return t}thread(...r){if(this.disposed)return!1;this.$thread.active=!0;for(let e in this.graph.effects)for(let t of this.graph.effects[e].refs)for(let i of r){let[n,s,o]=this.matchRefs(i,t);!n||this.buildThread(i,t,o,s)}return this.runThread()}runThread(){let r=(n,s)=>{if(["ForOfStatement","ForInStatement"].includes(n.graph.type)&&s.every(o=>o.executionPlan.isIterationContractTarget)){let o=s.map(c=>c.executionPlan.iterationTarget);return this.fire(n.graph.lineage,"iterating",s),n.iterate(o)}return this.fire(n.graph.lineage,"executing",s),n.call()},e,t,i;for(;(t=this.$thread.sequence.shift())&&(i=[...this.$thread.entries.get(t)])&&this.$thread.entries.delete(t);)e=g(e,()=>{if(t.disposed||!t.filterRefs(i).length)return;this.$thread.current=t;let n=r(t,i);return g(n,()=>{for(let s of i)[].concat(s.executionPlan.assigneeRef||s.executionPlan.assigneeRefs||[]).forEach(o=>{t.buildThread([],o,[],0)})}),n});return g(e,()=>{let n=this.exits.get("return");return this.exits.clear(),this.$thread.current=null,this.$thread.active=!1,n})}buildThread(r,e,t,i=0,n=!1){let s=i>0;if(this.ownerContract){if(!this.compute(t)||e.condition!==void 0&&!this.assert(e.condition))return}else s||(s=t.length||e.condition!==void 0);let o=n?e.$subscriptions:e.subscriptions;Object.keys(o).forEach(c=>{let[u,h]=c.split(":"),a=p=>{!p||p.selectRefs(h,o[c],s?r:null)},l=this.locate(u);Array.isArray(l)?l.forEach(a):a(l)})}selectRefs(r,e,t=null){let i=this.$thread,n=this.graph.signals[r],s=(c,u)=>c.graph.lineage.localeCompare(u.graph.lineage,void 0,{numeric:!0}),o=(c,u=[],h={})=>{if(!i.active||i.current&&s(this,i.current)<0)return;let a=i.entries.get(this);if(a||(a=new Set,i.entries.set(this,a),i.sequence.push(this),i.sequence.sort(s)),a.add({...c,computes:u,executionPlan:h}),!h.assigneeRef&&["VariableDeclaration","AssignmentExpression"].includes(this.graph.type)){h.assigneeRefs=[];for(let l in this.graph.effects)h.assigneeRefs.push(...this.graph.effects[l].refs)}};for(let c of e){let u=n.refs[c];if(!t){o(u);continue}let[h,a,l]=this.matchRefs(t,u);if(!h)continue;if(a<=0){o(u,l);continue}let p=t.slice(-a),y="assignee"in n?this.graph.effects[n.assignee]:null;if(y){y.refs.forEach(d=>{if(d.depth.length){let[w,m,b]=this.matchRefs(p,d.depth),C=l.concat(b);if(w&&m>0){let j=d.path.concat(p.slice(-m));this.buildThread(j,d,C,m)}else w&&o(u,C,{assigneeRef:d})}else{let w=d.path.concat(p);this.buildThread(w,d,l,a)}});continue}if(a===1&&this.graph.type==="ForOfStatement"){o(u,l,{isIterationContractTarget:!0,iterationTarget:p[0]});continue}if(a===1&&this.graph.type==="ForInStatement"){o(u,l,{isIterationContractTarget:!0,iterationTarget:p[0]});continue}}}filterRefs(r){return r.filter(e=>{if(!!this.compute(e.computes)&&!(e.condition!==void 0&&!this.assert(e.condition)))return!0})}matchRefs(r,e){let t,i,n,s;Array.isArray(r)?(t=r,i=r.dotSafe?r.join("."):void 0):(t=r.path,i=r.$path),Array.isArray(e)?(n=e,s=e.dotSafe?e.join("."):void 0):(n=e.path,s=e.$path);let o=t.length-n.length;if(o>0&&([t,n,i,s]=[n,t,s,i]),i&&s)return[`${s}.`.startsWith(`${i}.`),o,[]];let c=[],u=a=>typeof a=="object"?a.name:a,h=(a,l)=>{if(!a||!l)return!1;let p=typeof a=="object"&&"memoId"in a,y=typeof l=="object"&&"memoId"in l;return p||y?(c.push(d=>(p?d[a.memoId]:u(a))===(y?d[l.memoId]:u(l))),!0):u(a)===u(l)};return[t.reduce((a,l,p)=>a&&h(l,n[p]),!0),o,c]}locate(r){let e=this.graph.lineage+"/",t=r+"/";if(t===e)return this;if(t.startsWith(e)){let i=r.slice(e.length).split("/"),n=this.subContracts.get(parseInt(i.shift()));if(i.length){if(n instanceof Map)return Array.from(n).reduce((s,[o,c])=>s.concat(c.locate(r)),[]);if(n)return n.locate(r)}return n}if(this.ownerContract)return this.ownerContract.locate(r)}compute(r){return!r.some(e=>e(this.contract.memo)===!1)}assert(r){if(typeof r=="string"&&r.includes(":")){let[i,n]=r.split(":");return this.locate(i).assert(n)}let e=this.graph.conditions[r],t=this.contract.memo;return typeof e.parent<"u"&&!this.assert(e.parent)?!1:typeof e.switch<"u"?e.cases.some(i=>t[i]===t[e.switch]):typeof e.whenNot<"u"?!t[e.whenNot]:typeof e.when<"u"?t[e.when]:!0}dispose(){this.params.isFunctionContract||(this.subContracts.forEach((r,e)=>{r instanceof Map?(r.forEach(t=>t.dispose()),r.clear()):r.dispose()}),this.subContracts.clear(),delete this.ownerContract,delete this.callee,delete this.params,delete this.contract.memo,this.disposed=!0)}createFunction(r,e=void 0){let t=r(),i=function(s,...o){let c=s.call(this===void 0?e:this,...o);return s.params.isSubscriptFunction&&s.params.apiVersion>1&&(c=g(c,u=>[u,s.thread.bind(s),s]),t=r(t)),c},n=t instanceof Promise||t.callee instanceof async function(){}.constructor?async function(){return g(t,s=>i.call(this,s,...arguments))}:function(){return i.call(this,t,...arguments)};return g(t,s=>{this.applyReflection(n,s)}),F(n,"properties",g(t,s=>{let o={type:s.params.functionType||"Program",isSubscriptFunction:s.params.isSubscriptFunction,sideEffects:s.graph.sideEffects||!1};if(s.params.isSubscriptFunction){o.dependencies=[];for(let[c,u]of Object.entries(s.graph.effects))o.dependencies.push(...u.refs.map(h=>h.path.map(a=>a.name)))}return o})),n}applyReflection(r,e){Object.defineProperty(e.callee,"length",{configurable:!0,value:e.callee.length-1});let t=e.callee.toString();Object.defineProperty(e.callee,"toString",{configurable:!0,value:(n=!1)=>!n&&e.graph.originalSource?e.graph.originalSource:t});let i={name:e.callee.name,length:e.callee.length,toString:e.callee.toString};e.params.isSubscriptFunction&&(e.params.apiVersion>1||(i={...i,thread:e.thread.bind(e),dispose:e.dispose.bind(e),runtime:e})),Object.keys(i).forEach(n=>{Object.defineProperty(r,n,{configurable:!0,value:i[n]})})}};var x=class extends S{static create(r,e=[],t={}){let n=t.async||r.graph.hoistedAwaitKeyword?Object.getPrototypeOf(async function(){}).constructor:Function,s=t.compileFunction?t.compileFunction(r.source,[r.identifier+""].concat(e)):new n(r.identifier+"",...e,r.source);return new this(null,r.graph,s,t)}static createFunction(r,e,t=[],i={},n,s=null){i={...i,functionType:"Constructor"},e instanceof Promise&&(i={...i,async:!0});let o=h=>h?new this(null,h.graph,h.callee,i):g(e,a=>c(this.create(a,t,i))),c=h=>{if(h.graph.originalSource&&!h.graph.originalSourceModified){let a=`${i.async||h.graph.hoistedAwaitKeyword?"async ":""}function ${r||"anonymous"}`,l=h.graph.originalSource.split(/\n/g).map(p=>`    ${p}`).join(`
`);h.graph.originalSource=`${a}(${t.join(", ")}) {
${l}
}`,h.graph.originalSourceModified=!0}return r&&Object.defineProperty(h.callee,"name",{configurable:!0,value:r}),h},u=this.prototype.createFunction(o,n);return F(u,"locations",g(e,h=>({locations:h.locations}))),u}};function $(...f){if(typeof window!="object")throw new Error("No window in context.");let r=v(typeof f[f.length-1]=="object"?f.pop():{}),e=I(f.pop()||""),t=f,i=n=>x.createFunction(void 0,n,t,r.runtimeParams,this,e);if(window.wq?.SubscriptCompiler&&!r.runtimeParams.async){let{parse:n,compile:s}=window.wq.SubscriptCompiler,o=n(e,r.parserParams);return i(s(o,r.compilerParams))}if(!window.wq?.SubscriptCompilerWorker){let o=`
        importScripts( '${document.querySelector('meta[name="subscript-compiler-url"]')?.content||"https://unpkg.com/@webqit/subscript/dist/compiler.js"}' );
        const { parse, compile } = self.wq.SubscriptCompiler;
        self.onmessage = e => {
            const { source, params } = e.data;
            const ast = parse( source, params.parserParams );
            const compilation = compile( ast, params.compilerParams );
            compilation.identifier = compilation.identifier.toString();
            e.ports[ 0 ]?.postMessage( compilation );
        };`;window.wq=window.wq||{},window.wq.SubscriptCompilerWorker=new Worker(`data:text/javascript;base64,${btoa(o)}`)}return i(new Promise(n=>{let s=new MessageChannel;wq.SubscriptCompilerWorker.postMessage({source:e,params:r},[s.port2]),s.port1.onmessage=o=>n(o.data)}))}Object.defineProperty($,"inspect",{value:F});self.wq||(self.wq={});self.wq.SubscriptFunction=$;})();
//# sourceMappingURL=lite.js.map
