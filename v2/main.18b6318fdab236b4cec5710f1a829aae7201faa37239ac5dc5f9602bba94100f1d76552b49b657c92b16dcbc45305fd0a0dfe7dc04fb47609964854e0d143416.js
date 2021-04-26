/*! lazysizes - v5.3.0 */

!function(e){var t=function(u,D,f){"use strict";var k,H;if(function(){var e;var t={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",fastLoadedClass:"ls-is-cached",iframeLoadMode:0,srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:true,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:true,ricTimeout:0,throttleDelay:125};H=u.lazySizesConfig||u.lazysizesConfig||{};for(e in t){if(!(e in H)){H[e]=t[e]}}}(),!D||!D.getElementsByClassName){return{init:function(){},cfg:H,noSupport:true}}var O=D.documentElement,i=u.HTMLPictureElement,P="addEventListener",$="getAttribute",q=u[P].bind(u),I=u.setTimeout,U=u.requestAnimationFrame||I,o=u.requestIdleCallback,j=/^picture$/i,r=["load","error","lazyincluded","_lazyloaded"],a={},G=Array.prototype.forEach,J=function(e,t){if(!a[t]){a[t]=new RegExp("(\\s|^)"+t+"(\\s|$)")}return a[t].test(e[$]("class")||"")&&a[t]},K=function(e,t){if(!J(e,t)){e.setAttribute("class",(e[$]("class")||"").trim()+" "+t)}},Q=function(e,t){var a;if(a=J(e,t)){e.setAttribute("class",(e[$]("class")||"").replace(a," "))}},V=function(t,a,e){var i=e?P:"removeEventListener";if(e){V(t,a)}r.forEach(function(e){t[i](e,a)})},X=function(e,t,a,i,r){var n=D.createEvent("Event");if(!a){a={}}a.instance=k;n.initEvent(t,!i,!r);n.detail=a;e.dispatchEvent(n);return n},Y=function(e,t){var a;if(!i&&(a=u.picturefill||H.pf)){if(t&&t.src&&!e[$]("srcset")){e.setAttribute("srcset",t.src)}a({reevaluate:true,elements:[e]})}else if(t&&t.src){e.src=t.src}},Z=function(e,t){return(getComputedStyle(e,null)||{})[t]},s=function(e,t,a){a=a||e.offsetWidth;while(a<H.minSize&&t&&!e._lazysizesWidth){a=t.offsetWidth;t=t.parentNode}return a},ee=function(){var a,i;var t=[];var r=[];var n=t;var s=function(){var e=n;n=t.length?r:t;a=true;i=false;while(e.length){e.shift()()}a=false};var e=function(e,t){if(a&&!t){e.apply(this,arguments)}else{n.push(e);if(!i){i=true;(D.hidden?I:U)(s)}}};e._lsFlush=s;return e}(),te=function(a,e){return e?function(){ee(a)}:function(){var e=this;var t=arguments;ee(function(){a.apply(e,t)})}},ae=function(e){var a;var i=0;var r=H.throttleDelay;var n=H.ricTimeout;var t=function(){a=false;i=f.now();e()};var s=o&&n>49?function(){o(t,{timeout:n});if(n!==H.ricTimeout){n=H.ricTimeout}}:te(function(){I(t)},true);return function(e){var t;if(e=e===true){n=33}if(a){return}a=true;t=r-(f.now()-i);if(t<0){t=0}if(e||t<9){s()}else{I(s,t)}}},ie=function(e){var t,a;var i=99;var r=function(){t=null;e()};var n=function(){var e=f.now()-a;if(e<i){I(n,i-e)}else{(o||r)(r)}};return function(){a=f.now();if(!t){t=I(n,i)}}},e=function(){var v,m,c,h,e;var y,z,g,p,C,b,A;var n=/^img$/i;var d=/^iframe$/i;var E="onscroll"in u&&!/(gle|ing)bot/.test(navigator.userAgent);var _=0;var w=0;var M=0;var N=-1;var L=function(e){M--;if(!e||M<0||!e.target){M=0}};var x=function(e){if(A==null){A=Z(D.body,"visibility")=="hidden"}return A||!(Z(e.parentNode,"visibility")=="hidden"&&Z(e,"visibility")=="hidden")};var W=function(e,t){var a;var i=e;var r=x(e);g-=t;b+=t;p-=t;C+=t;while(r&&(i=i.offsetParent)&&i!=D.body&&i!=O){r=(Z(i,"opacity")||1)>0;if(r&&Z(i,"overflow")!="visible"){a=i.getBoundingClientRect();r=C>a.left&&p<a.right&&b>a.top-1&&g<a.bottom+1}}return r};var t=function(){var e,t,a,i,r,n,s,o,l,u,f,c;var d=k.elements;if((h=H.loadMode)&&M<8&&(e=d.length)){t=0;N++;for(;t<e;t++){if(!d[t]||d[t]._lazyRace){continue}if(!E||k.prematureUnveil&&k.prematureUnveil(d[t])){R(d[t]);continue}if(!(o=d[t][$]("data-expand"))||!(n=o*1)){n=w}if(!u){u=!H.expand||H.expand<1?O.clientHeight>500&&O.clientWidth>500?500:370:H.expand;k._defEx=u;f=u*H.expFactor;c=H.hFac;A=null;if(w<f&&M<1&&N>2&&h>2&&!D.hidden){w=f;N=0}else if(h>1&&N>1&&M<6){w=u}else{w=_}}if(l!==n){y=innerWidth+n*c;z=innerHeight+n;s=n*-1;l=n}a=d[t].getBoundingClientRect();if((b=a.bottom)>=s&&(g=a.top)<=z&&(C=a.right)>=s*c&&(p=a.left)<=y&&(b||C||p||g)&&(H.loadHidden||x(d[t]))&&(m&&M<3&&!o&&(h<3||N<4)||W(d[t],n))){R(d[t]);r=true;if(M>9){break}}else if(!r&&m&&!i&&M<4&&N<4&&h>2&&(v[0]||H.preloadAfterLoad)&&(v[0]||!o&&(b||C||p||g||d[t][$](H.sizesAttr)!="auto"))){i=v[0]||d[t]}}if(i&&!r){R(i)}}};var a=ae(t);var S=function(e){var t=e.target;if(t._lazyCache){delete t._lazyCache;return}L(e);K(t,H.loadedClass);Q(t,H.loadingClass);V(t,B);X(t,"lazyloaded")};var i=te(S);var B=function(e){i({target:e.target})};var T=function(e,t){var a=e.getAttribute("data-load-mode")||H.iframeLoadMode;if(a==0){e.contentWindow.location.replace(t)}else if(a==1){e.src=t}};var F=function(e){var t;var a=e[$](H.srcsetAttr);if(t=H.customMedia[e[$]("data-media")||e[$]("media")]){e.setAttribute("media",t)}if(a){e.setAttribute("srcset",a)}};var s=te(function(t,e,a,i,r){var n,s,o,l,u,f;if(!(u=X(t,"lazybeforeunveil",e)).defaultPrevented){if(i){if(a){K(t,H.autosizesClass)}else{t.setAttribute("sizes",i)}}s=t[$](H.srcsetAttr);n=t[$](H.srcAttr);if(r){o=t.parentNode;l=o&&j.test(o.nodeName||"")}f=e.firesLoad||"src"in t&&(s||n||l);u={target:t};K(t,H.loadingClass);if(f){clearTimeout(c);c=I(L,2500);V(t,B,true)}if(l){G.call(o.getElementsByTagName("source"),F)}if(s){t.setAttribute("srcset",s)}else if(n&&!l){if(d.test(t.nodeName)){T(t,n)}else{t.src=n}}if(r&&(s||l)){Y(t,{src:n})}}if(t._lazyRace){delete t._lazyRace}Q(t,H.lazyClass);ee(function(){var e=t.complete&&t.naturalWidth>1;if(!f||e){if(e){K(t,H.fastLoadedClass)}S(u);t._lazyCache=true;I(function(){if("_lazyCache"in t){delete t._lazyCache}},9)}if(t.loading=="lazy"){M--}},true)});var R=function(e){if(e._lazyRace){return}var t;var a=n.test(e.nodeName);var i=a&&(e[$](H.sizesAttr)||e[$]("sizes"));var r=i=="auto";if((r||!m)&&a&&(e[$]("src")||e.srcset)&&!e.complete&&!J(e,H.errorClass)&&J(e,H.lazyClass)){return}t=X(e,"lazyunveilread").detail;if(r){re.updateElem(e,true,e.offsetWidth)}e._lazyRace=true;M++;s(e,t,r,i,a)};var r=ie(function(){H.loadMode=3;a()});var o=function(){if(H.loadMode==3){H.loadMode=2}r()};var l=function(){if(m){return}if(f.now()-e<999){I(l,999);return}m=true;H.loadMode=3;a();q("scroll",o,true)};return{_:function(){e=f.now();k.elements=D.getElementsByClassName(H.lazyClass);v=D.getElementsByClassName(H.lazyClass+" "+H.preloadClass);q("scroll",a,true);q("resize",a,true);q("pageshow",function(e){if(e.persisted){var t=D.querySelectorAll("."+H.loadingClass);if(t.length&&t.forEach){U(function(){t.forEach(function(e){if(e.complete){R(e)}})})}}});if(u.MutationObserver){new MutationObserver(a).observe(O,{childList:true,subtree:true,attributes:true})}else{O[P]("DOMNodeInserted",a,true);O[P]("DOMAttrModified",a,true);setInterval(a,999)}q("hashchange",a,true);["focus","mouseover","click","load","transitionend","animationend"].forEach(function(e){D[P](e,a,true)});if(/d$|^c/.test(D.readyState)){l()}else{q("load",l);D[P]("DOMContentLoaded",a);I(l,2e4)}if(k.elements.length){t();ee._lsFlush()}else{a()}},checkElems:a,unveil:R,_aLSL:o}}(),re=function(){var a;var n=te(function(e,t,a,i){var r,n,s;e._lazysizesWidth=i;i+="px";e.setAttribute("sizes",i);if(j.test(t.nodeName||"")){r=t.getElementsByTagName("source");for(n=0,s=r.length;n<s;n++){r[n].setAttribute("sizes",i)}}if(!a.detail.dataAttr){Y(e,a.detail)}});var i=function(e,t,a){var i;var r=e.parentNode;if(r){a=s(e,r,a);i=X(e,"lazybeforesizes",{width:a,dataAttr:!!t});if(!i.defaultPrevented){a=i.detail.width;if(a&&a!==e._lazysizesWidth){n(e,r,i,a)}}}};var e=function(){var e;var t=a.length;if(t){e=0;for(;e<t;e++){i(a[e])}}};var t=ie(e);return{_:function(){a=D.getElementsByClassName(H.autosizesClass);q("resize",t)},checkElems:t,updateElem:i}}(),t=function(){if(!t.i&&D.getElementsByClassName){t.i=true;re._();e._()}};return I(function(){H.init&&t()}),k={cfg:H,autoSizer:re,loader:e,init:t,uP:Y,aC:K,rC:Q,hC:J,fire:X,gW:s,rAF:ee}}(e,e.document,Date);e.lazySizes=t,"object"==typeof module&&module.exports&&(module.exports=t)}("undefined"!=typeof window?window:{});
;
/*! jQuery v3.5.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(C,e){"use strict";var t=[],r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply([],e)},u=t.push,i=t.indexOf,n={},o=n.toString,v=n.hasOwnProperty,a=v.toString,l=a.call(Object),y={},m=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType},x=function(e){return null!=e&&e===e.window},E=C.document,c={type:!0,src:!0,nonce:!0,noModule:!0};function b(e,t,n){var r,i,o=(n=n||E).createElement("script");if(o.text=e,t)for(r in c)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o)}function w(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[o.call(e)]||"object":typeof e}var f="3.5.1",S=function(e,t){return new S.fn.init(e,t)};function p(e){var t=!!e&&"length"in e&&e.length,n=w(e);return!m(e)&&!x(e)&&("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e)}S.fn=S.prototype={jquery:f,constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)},map:function(n){return this.pushStack(S.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return this.pushStack(s.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(S.grep(this,function(e,t){return(t+1)%2}))},odd:function(){return this.pushStack(S.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(0<=n&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:u,sort:t.sort,splice:t.splice},S.extend=S.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||m(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(S.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||S.isPlainObject(n)?n:{},i=!1,a[t]=S.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},S.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==o.call(e))&&(!(t=r(e))||"function"==typeof(n=v.call(t,"constructor")&&t.constructor)&&a.call(n)===l)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t,n){b(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,r=0;if(p(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},makeArray:function(e,t){var n=t||[];return null!=e&&(p(Object(e))?S.merge(n,"string"==typeof e?[e]:e):u.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:i.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,i,o=0,a=[];if(p(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&a.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&a.push(i);return g(a)},guid:1,support:y}),"function"==typeof Symbol&&(S.fn[Symbol.iterator]=t[Symbol.iterator]),S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){n["[object "+t+"]"]=t.toLowerCase()});var d=function(n){var e,d,b,o,i,h,f,g,w,u,l,T,C,a,E,v,s,c,y,S="sizzle"+1*new Date,p=n.document,k=0,r=0,m=ue(),x=ue(),A=ue(),N=ue(),D=function(e,t){return e===t&&(l=!0),0},j={}.hasOwnProperty,t=[],q=t.pop,L=t.push,H=t.push,O=t.slice,P=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",I="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",W="\\["+M+"*("+I+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+I+"))|)"+M+"*\\]",F=":("+I+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+W+")*)|.*)\\)|)",B=new RegExp(M+"+","g"),$=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=new RegExp("^"+M+"*,"+M+"*"),z=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp(M+"|>"),X=new RegExp(F),V=new RegExp("^"+I+"$"),G={ID:new RegExp("^#("+I+")"),CLASS:new RegExp("^\\.("+I+")"),TAG:new RegExp("^("+I+"|[*])"),ATTR:new RegExp("^"+W),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+R+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/HTML$/i,Q=/^(?:input|select|textarea|button)$/i,J=/^h\d$/i,K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){T()},ae=be(function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{H.apply(t=O.call(p.childNodes),p.childNodes),t[p.childNodes.length].nodeType}catch(e){H={apply:t.length?function(e,t){L.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function se(t,e,n,r){var i,o,a,s,u,l,c,f=e&&e.ownerDocument,p=e?e.nodeType:9;if(n=n||[],"string"!=typeof t||!t||1!==p&&9!==p&&11!==p)return n;if(!r&&(T(e),e=e||C,E)){if(11!==p&&(u=Z.exec(t)))if(i=u[1]){if(9===p){if(!(a=e.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(f&&(a=f.getElementById(i))&&y(e,a)&&a.id===i)return n.push(a),n}else{if(u[2])return H.apply(n,e.getElementsByTagName(t)),n;if((i=u[3])&&d.getElementsByClassName&&e.getElementsByClassName)return H.apply(n,e.getElementsByClassName(i)),n}if(d.qsa&&!N[t+" "]&&(!v||!v.test(t))&&(1!==p||"object"!==e.nodeName.toLowerCase())){if(c=t,f=e,1===p&&(U.test(t)||z.test(t))){(f=ee.test(t)&&ye(e.parentNode)||e)===e&&d.scope||((s=e.getAttribute("id"))?s=s.replace(re,ie):e.setAttribute("id",s=S)),o=(l=h(t)).length;while(o--)l[o]=(s?"#"+s:":scope")+" "+xe(l[o]);c=l.join(",")}try{return H.apply(n,f.querySelectorAll(c)),n}catch(e){N(t,!0)}finally{s===S&&e.removeAttribute("id")}}}return g(t.replace($,"$1"),e,n,r)}function ue(){var r=[];return function e(t,n){return r.push(t+" ")>b.cacheLength&&delete e[r.shift()],e[t+" "]=n}}function le(e){return e[S]=!0,e}function ce(e){var t=C.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function fe(e,t){var n=e.split("|"),r=n.length;while(r--)b.attrHandle[n[r]]=t}function pe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function de(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}function he(n){return function(e){var t=e.nodeName.toLowerCase();return("input"===t||"button"===t)&&e.type===n}}function ge(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&ae(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function ve(a){return le(function(o){return o=+o,le(function(e,t){var n,r=a([],e.length,o),i=r.length;while(i--)e[n=r[i]]&&(e[n]=!(t[n]=e[n]))})})}function ye(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}for(e in d=se.support={},i=se.isXML=function(e){var t=e.namespaceURI,n=(e.ownerDocument||e).documentElement;return!Y.test(t||n&&n.nodeName||"HTML")},T=se.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:p;return r!=C&&9===r.nodeType&&r.documentElement&&(a=(C=r).documentElement,E=!i(C),p!=C&&(n=C.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",oe,!1):n.attachEvent&&n.attachEvent("onunload",oe)),d.scope=ce(function(e){return a.appendChild(e).appendChild(C.createElement("div")),"undefined"!=typeof e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),d.attributes=ce(function(e){return e.className="i",!e.getAttribute("className")}),d.getElementsByTagName=ce(function(e){return e.appendChild(C.createComment("")),!e.getElementsByTagName("*").length}),d.getElementsByClassName=K.test(C.getElementsByClassName),d.getById=ce(function(e){return a.appendChild(e).id=S,!C.getElementsByName||!C.getElementsByName(S).length}),d.getById?(b.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n=t.getElementById(e);return n?[n]:[]}}):(b.filter.ID=function(e){var n=e.replace(te,ne);return function(e){var t="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return t&&t.value===n}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),b.find.TAG=d.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):d.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},b.find.CLASS=d.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&E)return t.getElementsByClassName(e)},s=[],v=[],(d.qsa=K.test(C.querySelectorAll))&&(ce(function(e){var t;a.appendChild(e).innerHTML="<a id='"+S+"'></a><select id='"+S+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&v.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||v.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll("[id~="+S+"-]").length||v.push("~="),(t=C.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||v.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||v.push(":checked"),e.querySelectorAll("a#"+S+"+*").length||v.push(".#.+[+~]"),e.querySelectorAll("\\\f"),v.push("[\\r\\n\\f]")}),ce(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=C.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&v.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&v.push(":enabled",":disabled"),a.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&v.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),v.push(",.*:")})),(d.matchesSelector=K.test(c=a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.msMatchesSelector))&&ce(function(e){d.disconnectedMatch=c.call(e,"*"),c.call(e,"[s!='']:x"),s.push("!=",F)}),v=v.length&&new RegExp(v.join("|")),s=s.length&&new RegExp(s.join("|")),t=K.test(a.compareDocumentPosition),y=t||K.test(a.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return l=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!d.sortDetached&&t.compareDocumentPosition(e)===n?e==C||e.ownerDocument==p&&y(p,e)?-1:t==C||t.ownerDocument==p&&y(p,t)?1:u?P(u,e)-P(u,t):0:4&n?-1:1)}:function(e,t){if(e===t)return l=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e==C?-1:t==C?1:i?-1:o?1:u?P(u,e)-P(u,t):0;if(i===o)return pe(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?pe(a[r],s[r]):a[r]==p?-1:s[r]==p?1:0}),C},se.matches=function(e,t){return se(e,null,null,t)},se.matchesSelector=function(e,t){if(T(e),d.matchesSelector&&E&&!N[t+" "]&&(!s||!s.test(t))&&(!v||!v.test(t)))try{var n=c.call(e,t);if(n||d.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){N(t,!0)}return 0<se(t,C,null,[e]).length},se.contains=function(e,t){return(e.ownerDocument||e)!=C&&T(e),y(e,t)},se.attr=function(e,t){(e.ownerDocument||e)!=C&&T(e);var n=b.attrHandle[t.toLowerCase()],r=n&&j.call(b.attrHandle,t.toLowerCase())?n(e,t,!E):void 0;return void 0!==r?r:d.attributes||!E?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},se.escape=function(e){return(e+"").replace(re,ie)},se.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},se.uniqueSort=function(e){var t,n=[],r=0,i=0;if(l=!d.detectDuplicates,u=!d.sortStable&&e.slice(0),e.sort(D),l){while(t=e[i++])t===e[i]&&(r=n.push(i));while(r--)e.splice(n[r],1)}return u=null,e},o=se.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else while(t=e[r++])n+=o(t);return n},(b=se.selectors={cacheLength:50,createPseudo:le,match:G,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||se.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&se.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return G.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=h(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=m[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&m(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(n,r,i){return function(e){var t=se.attr(e,n);return null==t?"!="===r:!r||(t+="","="===r?t===i:"!="===r?t!==i:"^="===r?i&&0===t.indexOf(i):"*="===r?i&&-1<t.indexOf(i):"$="===r?i&&t.slice(-i.length)===i:"~="===r?-1<(" "+t.replace(B," ")+" ").indexOf(i):"|="===r&&(t===i||t.slice(0,i.length+1)===i+"-"))}},CHILD:function(h,e,t,g,v){var y="nth"!==h.slice(0,3),m="last"!==h.slice(-4),x="of-type"===e;return 1===g&&0===v?function(e){return!!e.parentNode}:function(e,t,n){var r,i,o,a,s,u,l=y!==m?"nextSibling":"previousSibling",c=e.parentNode,f=x&&e.nodeName.toLowerCase(),p=!n&&!x,d=!1;if(c){if(y){while(l){a=e;while(a=a[l])if(x?a.nodeName.toLowerCase()===f:1===a.nodeType)return!1;u=l="only"===h&&!u&&"nextSibling"}return!0}if(u=[m?c.firstChild:c.lastChild],m&&p){d=(s=(r=(i=(o=(a=c)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1])&&r[2],a=s&&c.childNodes[s];while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if(1===a.nodeType&&++d&&a===e){i[h]=[k,s,d];break}}else if(p&&(d=s=(r=(i=(o=(a=e)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1]),!1===d)while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if((x?a.nodeName.toLowerCase()===f:1===a.nodeType)&&++d&&(p&&((i=(o=a[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]=[k,d]),a===e))break;return(d-=v)===g||d%g==0&&0<=d/g}}},PSEUDO:function(e,o){var t,a=b.pseudos[e]||b.setFilters[e.toLowerCase()]||se.error("unsupported pseudo: "+e);return a[S]?a(o):1<a.length?(t=[e,e,"",o],b.setFilters.hasOwnProperty(e.toLowerCase())?le(function(e,t){var n,r=a(e,o),i=r.length;while(i--)e[n=P(e,r[i])]=!(t[n]=r[i])}):function(e){return a(e,0,t)}):a}},pseudos:{not:le(function(e){var r=[],i=[],s=f(e.replace($,"$1"));return s[S]?le(function(e,t,n,r){var i,o=s(e,null,r,[]),a=e.length;while(a--)(i=o[a])&&(e[a]=!(t[a]=i))}):function(e,t,n){return r[0]=e,s(r,null,n,i),r[0]=null,!i.pop()}}),has:le(function(t){return function(e){return 0<se(t,e).length}}),contains:le(function(t){return t=t.replace(te,ne),function(e){return-1<(e.textContent||o(e)).indexOf(t)}}),lang:le(function(n){return V.test(n||"")||se.error("unsupported lang: "+n),n=n.replace(te,ne).toLowerCase(),function(e){var t;do{if(t=E?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(t=t.toLowerCase())===n||0===t.indexOf(n+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var t=n.location&&n.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===a},focus:function(e){return e===C.activeElement&&(!C.hasFocus||C.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:ge(!1),disabled:ge(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!b.pseudos.empty(e)},header:function(e){return J.test(e.nodeName)},input:function(e){return Q.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:ve(function(){return[0]}),last:ve(function(e,t){return[t-1]}),eq:ve(function(e,t,n){return[n<0?n+t:n]}),even:ve(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:ve(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:ve(function(e,t,n){for(var r=n<0?n+t:t<n?t:n;0<=--r;)e.push(r);return e}),gt:ve(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=b.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[e]=de(e);for(e in{submit:!0,reset:!0})b.pseudos[e]=he(e);function me(){}function xe(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function be(s,e,t){var u=e.dir,l=e.next,c=l||u,f=t&&"parentNode"===c,p=r++;return e.first?function(e,t,n){while(e=e[u])if(1===e.nodeType||f)return s(e,t,n);return!1}:function(e,t,n){var r,i,o,a=[k,p];if(n){while(e=e[u])if((1===e.nodeType||f)&&s(e,t,n))return!0}else while(e=e[u])if(1===e.nodeType||f)if(i=(o=e[S]||(e[S]={}))[e.uniqueID]||(o[e.uniqueID]={}),l&&l===e.nodeName.toLowerCase())e=e[u]||e;else{if((r=i[c])&&r[0]===k&&r[1]===p)return a[2]=r[2];if((i[c]=a)[2]=s(e,t,n))return!0}return!1}}function we(i){return 1<i.length?function(e,t,n){var r=i.length;while(r--)if(!i[r](e,t,n))return!1;return!0}:i[0]}function Te(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Ce(d,h,g,v,y,e){return v&&!v[S]&&(v=Ce(v)),y&&!y[S]&&(y=Ce(y,e)),le(function(e,t,n,r){var i,o,a,s=[],u=[],l=t.length,c=e||function(e,t,n){for(var r=0,i=t.length;r<i;r++)se(e,t[r],n);return n}(h||"*",n.nodeType?[n]:n,[]),f=!d||!e&&h?c:Te(c,s,d,n,r),p=g?y||(e?d:l||v)?[]:t:f;if(g&&g(f,p,n,r),v){i=Te(p,u),v(i,[],n,r),o=i.length;while(o--)(a=i[o])&&(p[u[o]]=!(f[u[o]]=a))}if(e){if(y||d){if(y){i=[],o=p.length;while(o--)(a=p[o])&&i.push(f[o]=a);y(null,p=[],i,r)}o=p.length;while(o--)(a=p[o])&&-1<(i=y?P(e,a):s[o])&&(e[i]=!(t[i]=a))}}else p=Te(p===t?p.splice(l,p.length):p),y?y(null,t,p,r):H.apply(t,p)})}function Ee(e){for(var i,t,n,r=e.length,o=b.relative[e[0].type],a=o||b.relative[" "],s=o?1:0,u=be(function(e){return e===i},a,!0),l=be(function(e){return-1<P(i,e)},a,!0),c=[function(e,t,n){var r=!o&&(n||t!==w)||((i=t).nodeType?u(e,t,n):l(e,t,n));return i=null,r}];s<r;s++)if(t=b.relative[e[s].type])c=[be(we(c),t)];else{if((t=b.filter[e[s].type].apply(null,e[s].matches))[S]){for(n=++s;n<r;n++)if(b.relative[e[n].type])break;return Ce(1<s&&we(c),1<s&&xe(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace($,"$1"),t,s<n&&Ee(e.slice(s,n)),n<r&&Ee(e=e.slice(n)),n<r&&xe(e))}c.push(t)}return we(c)}return me.prototype=b.filters=b.pseudos,b.setFilters=new me,h=se.tokenize=function(e,t){var n,r,i,o,a,s,u,l=x[e+" "];if(l)return t?0:l.slice(0);a=e,s=[],u=b.preFilter;while(a){for(o in n&&!(r=_.exec(a))||(r&&(a=a.slice(r[0].length)||a),s.push(i=[])),n=!1,(r=z.exec(a))&&(n=r.shift(),i.push({value:n,type:r[0].replace($," ")}),a=a.slice(n.length)),b.filter)!(r=G[o].exec(a))||u[o]&&!(r=u[o](r))||(n=r.shift(),i.push({value:n,type:o,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?se.error(e):x(e,s).slice(0)},f=se.compile=function(e,t){var n,v,y,m,x,r,i=[],o=[],a=A[e+" "];if(!a){t||(t=h(e)),n=t.length;while(n--)(a=Ee(t[n]))[S]?i.push(a):o.push(a);(a=A(e,(v=o,m=0<(y=i).length,x=0<v.length,r=function(e,t,n,r,i){var o,a,s,u=0,l="0",c=e&&[],f=[],p=w,d=e||x&&b.find.TAG("*",i),h=k+=null==p?1:Math.random()||.1,g=d.length;for(i&&(w=t==C||t||i);l!==g&&null!=(o=d[l]);l++){if(x&&o){a=0,t||o.ownerDocument==C||(T(o),n=!E);while(s=v[a++])if(s(o,t||C,n)){r.push(o);break}i&&(k=h)}m&&((o=!s&&o)&&u--,e&&c.push(o))}if(u+=l,m&&l!==u){a=0;while(s=y[a++])s(c,f,t,n);if(e){if(0<u)while(l--)c[l]||f[l]||(f[l]=q.call(r));f=Te(f)}H.apply(r,f),i&&!e&&0<f.length&&1<u+y.length&&se.uniqueSort(r)}return i&&(k=h,w=p),c},m?le(r):r))).selector=e}return a},g=se.select=function(e,t,n,r){var i,o,a,s,u,l="function"==typeof e&&e,c=!r&&h(e=l.selector||e);if(n=n||[],1===c.length){if(2<(o=c[0]=c[0].slice(0)).length&&"ID"===(a=o[0]).type&&9===t.nodeType&&E&&b.relative[o[1].type]){if(!(t=(b.find.ID(a.matches[0].replace(te,ne),t)||[])[0]))return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}i=G.needsContext.test(e)?0:o.length;while(i--){if(a=o[i],b.relative[s=a.type])break;if((u=b.find[s])&&(r=u(a.matches[0].replace(te,ne),ee.test(o[0].type)&&ye(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&xe(o)))return H.apply(n,r),n;break}}}return(l||f(e,c))(r,t,!E,n,!t||ee.test(e)&&ye(t.parentNode)||t),n},d.sortStable=S.split("").sort(D).join("")===S,d.detectDuplicates=!!l,T(),d.sortDetached=ce(function(e){return 1&e.compareDocumentPosition(C.createElement("fieldset"))}),ce(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),d.attributes&&ce(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ce(function(e){return null==e.getAttribute("disabled")})||fe(R,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),se}(C);S.find=d,S.expr=d.selectors,S.expr[":"]=S.expr.pseudos,S.uniqueSort=S.unique=d.uniqueSort,S.text=d.getText,S.isXMLDoc=d.isXML,S.contains=d.contains,S.escapeSelector=d.escape;var h=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&S(e).is(n))break;r.push(e)}return r},T=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},k=S.expr.match.needsContext;function A(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var N=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function D(e,n,r){return m(n)?S.grep(e,function(e,t){return!!n.call(e,t,e)!==r}):n.nodeType?S.grep(e,function(e){return e===n!==r}):"string"!=typeof n?S.grep(e,function(e){return-1<i.call(n,e)!==r}):S.filter(n,e,r)}S.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?S.find.matchesSelector(r,e)?[r]:[]:S.find.matches(e,S.grep(t,function(e){return 1===e.nodeType}))},S.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(S(e).filter(function(){for(t=0;t<r;t++)if(S.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)S.find(e,i[t],n);return 1<r?S.uniqueSort(n):n},filter:function(e){return this.pushStack(D(this,e||[],!1))},not:function(e){return this.pushStack(D(this,e||[],!0))},is:function(e){return!!D(this,"string"==typeof e&&k.test(e)?S(e):e||[],!1).length}});var j,q=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(S.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||j,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&3<=e.length?[null,e,null]:q.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof S?t[0]:t,S.merge(this,S.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:E,!0)),N.test(r[1])&&S.isPlainObject(t))for(r in t)m(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(i=E.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):m(e)?void 0!==n.ready?n.ready(e):e(S):S.makeArray(e,this)}).prototype=S.fn,j=S(E);var L=/^(?:parents|prev(?:Until|All))/,H={children:!0,contents:!0,next:!0,prev:!0};function O(e,t){while((e=e[t])&&1!==e.nodeType);return e}S.fn.extend({has:function(e){var t=S(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(S.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&S(e);if(!k.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?-1<a.index(n):1===n.nodeType&&S.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(1<o.length?S.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?i.call(S(e),this[0]):i.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(S.uniqueSort(S.merge(this.get(),S(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),S.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return h(e,"parentNode")},parentsUntil:function(e,t,n){return h(e,"parentNode",n)},next:function(e){return O(e,"nextSibling")},prev:function(e){return O(e,"previousSibling")},nextAll:function(e){return h(e,"nextSibling")},prevAll:function(e){return h(e,"previousSibling")},nextUntil:function(e,t,n){return h(e,"nextSibling",n)},prevUntil:function(e,t,n){return h(e,"previousSibling",n)},siblings:function(e){return T((e.parentNode||{}).firstChild,e)},children:function(e){return T(e.firstChild)},contents:function(e){return null!=e.contentDocument&&r(e.contentDocument)?e.contentDocument:(A(e,"template")&&(e=e.content||e),S.merge([],e.childNodes))}},function(r,i){S.fn[r]=function(e,t){var n=S.map(this,i,e);return"Until"!==r.slice(-5)&&(t=e),t&&"string"==typeof t&&(n=S.filter(t,n)),1<this.length&&(H[r]||S.uniqueSort(n),L.test(r)&&n.reverse()),this.pushStack(n)}});var P=/[^\x20\t\r\n\f]+/g;function R(e){return e}function M(e){throw e}function I(e,t,n,r){var i;try{e&&m(i=e.promise)?i.call(e).done(t).fail(n):e&&m(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}S.Callbacks=function(r){var e,n;r="string"==typeof r?(e=r,n={},S.each(e.match(P)||[],function(e,t){n[t]=!0}),n):S.extend({},r);var i,t,o,a,s=[],u=[],l=-1,c=function(){for(a=a||r.once,o=i=!0;u.length;l=-1){t=u.shift();while(++l<s.length)!1===s[l].apply(t[0],t[1])&&r.stopOnFalse&&(l=s.length,t=!1)}r.memory||(t=!1),i=!1,a&&(s=t?[]:"")},f={add:function(){return s&&(t&&!i&&(l=s.length-1,u.push(t)),function n(e){S.each(e,function(e,t){m(t)?r.unique&&f.has(t)||s.push(t):t&&t.length&&"string"!==w(t)&&n(t)})}(arguments),t&&!i&&c()),this},remove:function(){return S.each(arguments,function(e,t){var n;while(-1<(n=S.inArray(t,s,n)))s.splice(n,1),n<=l&&l--}),this},has:function(e){return e?-1<S.inArray(e,s):0<s.length},empty:function(){return s&&(s=[]),this},disable:function(){return a=u=[],s=t="",this},disabled:function(){return!s},lock:function(){return a=u=[],t||i||(s=t=""),this},locked:function(){return!!a},fireWith:function(e,t){return a||(t=[e,(t=t||[]).slice?t.slice():t],u.push(t),i||c()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!o}};return f},S.extend({Deferred:function(e){var o=[["notify","progress",S.Callbacks("memory"),S.Callbacks("memory"),2],["resolve","done",S.Callbacks("once memory"),S.Callbacks("once memory"),0,"resolved"],["reject","fail",S.Callbacks("once memory"),S.Callbacks("once memory"),1,"rejected"]],i="pending",a={state:function(){return i},always:function(){return s.done(arguments).fail(arguments),this},"catch":function(e){return a.then(null,e)},pipe:function(){var i=arguments;return S.Deferred(function(r){S.each(o,function(e,t){var n=m(i[t[4]])&&i[t[4]];s[t[1]](function(){var e=n&&n.apply(this,arguments);e&&m(e.promise)?e.promise().progress(r.notify).done(r.resolve).fail(r.reject):r[t[0]+"With"](this,n?[e]:arguments)})}),i=null}).promise()},then:function(t,n,r){var u=0;function l(i,o,a,s){return function(){var n=this,r=arguments,e=function(){var e,t;if(!(i<u)){if((e=a.apply(n,r))===o.promise())throw new TypeError("Thenable self-resolution");t=e&&("object"==typeof e||"function"==typeof e)&&e.then,m(t)?s?t.call(e,l(u,o,R,s),l(u,o,M,s)):(u++,t.call(e,l(u,o,R,s),l(u,o,M,s),l(u,o,R,o.notifyWith))):(a!==R&&(n=void 0,r=[e]),(s||o.resolveWith)(n,r))}},t=s?e:function(){try{e()}catch(e){S.Deferred.exceptionHook&&S.Deferred.exceptionHook(e,t.stackTrace),u<=i+1&&(a!==M&&(n=void 0,r=[e]),o.rejectWith(n,r))}};i?t():(S.Deferred.getStackHook&&(t.stackTrace=S.Deferred.getStackHook()),C.setTimeout(t))}}return S.Deferred(function(e){o[0][3].add(l(0,e,m(r)?r:R,e.notifyWith)),o[1][3].add(l(0,e,m(t)?t:R)),o[2][3].add(l(0,e,m(n)?n:M))}).promise()},promise:function(e){return null!=e?S.extend(e,a):a}},s={};return S.each(o,function(e,t){var n=t[2],r=t[5];a[t[1]]=n.add,r&&n.add(function(){i=r},o[3-e][2].disable,o[3-e][3].disable,o[0][2].lock,o[0][3].lock),n.add(t[3].fire),s[t[0]]=function(){return s[t[0]+"With"](this===s?void 0:this,arguments),this},s[t[0]+"With"]=n.fireWith}),a.promise(s),e&&e.call(s,s),s},when:function(e){var n=arguments.length,t=n,r=Array(t),i=s.call(arguments),o=S.Deferred(),a=function(t){return function(e){r[t]=this,i[t]=1<arguments.length?s.call(arguments):e,--n||o.resolveWith(r,i)}};if(n<=1&&(I(e,o.done(a(t)).resolve,o.reject,!n),"pending"===o.state()||m(i[t]&&i[t].then)))return o.then();while(t--)I(i[t],a(t),o.reject);return o.promise()}});var W=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;S.Deferred.exceptionHook=function(e,t){C.console&&C.console.warn&&e&&W.test(e.name)&&C.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},S.readyException=function(e){C.setTimeout(function(){throw e})};var F=S.Deferred();function B(){E.removeEventListener("DOMContentLoaded",B),C.removeEventListener("load",B),S.ready()}S.fn.ready=function(e){return F.then(e)["catch"](function(e){S.readyException(e)}),this},S.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--S.readyWait:S.isReady)||(S.isReady=!0)!==e&&0<--S.readyWait||F.resolveWith(E,[S])}}),S.ready.then=F.then,"complete"===E.readyState||"loading"!==E.readyState&&!E.documentElement.doScroll?C.setTimeout(S.ready):(E.addEventListener("DOMContentLoaded",B),C.addEventListener("load",B));var $=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===w(n))for(s in i=!0,n)$(e,t,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,m(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(S(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},_=/^-ms-/,z=/-([a-z])/g;function U(e,t){return t.toUpperCase()}function X(e){return e.replace(_,"ms-").replace(z,U)}var V=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function G(){this.expando=S.expando+G.uid++}G.uid=1,G.prototype={cache:function(e){var t=e[this.expando];return t||(t={},V(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[X(t)]=n;else for(r in t)i[X(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][X(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(X):(t=X(t))in r?[t]:t.match(P)||[]).length;while(n--)delete r[t[n]]}(void 0===t||S.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!S.isEmptyObject(t)}};var Y=new G,Q=new G,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,K=/[A-Z]/g;function Z(e,t,n){var r,i;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(K,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===(i=n)||"false"!==i&&("null"===i?null:i===+i+""?+i:J.test(i)?JSON.parse(i):i)}catch(e){}Q.set(e,t,n)}else n=void 0;return n}S.extend({hasData:function(e){return Q.hasData(e)||Y.hasData(e)},data:function(e,t,n){return Q.access(e,t,n)},removeData:function(e,t){Q.remove(e,t)},_data:function(e,t,n){return Y.access(e,t,n)},_removeData:function(e,t){Y.remove(e,t)}}),S.fn.extend({data:function(n,e){var t,r,i,o=this[0],a=o&&o.attributes;if(void 0===n){if(this.length&&(i=Q.get(o),1===o.nodeType&&!Y.get(o,"hasDataAttrs"))){t=a.length;while(t--)a[t]&&0===(r=a[t].name).indexOf("data-")&&(r=X(r.slice(5)),Z(o,r,i[r]));Y.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof n?this.each(function(){Q.set(this,n)}):$(this,function(e){var t;if(o&&void 0===e)return void 0!==(t=Q.get(o,n))?t:void 0!==(t=Z(o,n))?t:void 0;this.each(function(){Q.set(this,n,e)})},null,e,1<arguments.length,null,!0)},removeData:function(e){return this.each(function(){Q.remove(this,e)})}}),S.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Y.get(e,t),n&&(!r||Array.isArray(n)?r=Y.access(e,t,S.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=S.queue(e,t),r=n.length,i=n.shift(),o=S._queueHooks(e,t);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,function(){S.dequeue(e,t)},o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return Y.get(e,n)||Y.access(e,n,{empty:S.Callbacks("once memory").add(function(){Y.remove(e,[t+"queue",n])})})}}),S.fn.extend({queue:function(t,n){var e=2;return"string"!=typeof t&&(n=t,t="fx",e--),arguments.length<e?S.queue(this[0],t):void 0===n?this:this.each(function(){var e=S.queue(this,t,n);S._queueHooks(this,t),"fx"===t&&"inprogress"!==e[0]&&S.dequeue(this,t)})},dequeue:function(e){return this.each(function(){S.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=S.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=Y.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var ee=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,te=new RegExp("^(?:([+-])=|)("+ee+")([a-z%]*)$","i"),ne=["Top","Right","Bottom","Left"],re=E.documentElement,ie=function(e){return S.contains(e.ownerDocument,e)},oe={composed:!0};re.getRootNode&&(ie=function(e){return S.contains(e.ownerDocument,e)||e.getRootNode(oe)===e.ownerDocument});var ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&ie(e)&&"none"===S.css(e,"display")};function se(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return S.css(e,t,"")},u=s(),l=n&&n[3]||(S.cssNumber[t]?"":"px"),c=e.nodeType&&(S.cssNumber[t]||"px"!==l&&+u)&&te.exec(S.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)S.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,S.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var ue={};function le(e,t){for(var n,r,i,o,a,s,u,l=[],c=0,f=e.length;c<f;c++)(r=e[c]).style&&(n=r.style.display,t?("none"===n&&(l[c]=Y.get(r,"display")||null,l[c]||(r.style.display="")),""===r.style.display&&ae(r)&&(l[c]=(u=a=o=void 0,a=(i=r).ownerDocument,s=i.nodeName,(u=ue[s])||(o=a.body.appendChild(a.createElement(s)),u=S.css(o,"display"),o.parentNode.removeChild(o),"none"===u&&(u="block"),ue[s]=u)))):"none"!==n&&(l[c]="none",Y.set(r,"display",n)));for(c=0;c<f;c++)null!=l[c]&&(e[c].style.display=l[c]);return e}S.fn.extend({show:function(){return le(this,!0)},hide:function(){return le(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?S(this).show():S(this).hide()})}});var ce,fe,pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,he=/^$|^module$|\/(?:java|ecma)script/i;ce=E.createDocumentFragment().appendChild(E.createElement("div")),(fe=E.createElement("input")).setAttribute("type","radio"),fe.setAttribute("checked","checked"),fe.setAttribute("name","t"),ce.appendChild(fe),y.checkClone=ce.cloneNode(!0).cloneNode(!0).lastChild.checked,ce.innerHTML="<textarea>x</textarea>",y.noCloneChecked=!!ce.cloneNode(!0).lastChild.defaultValue,ce.innerHTML="<option></option>",y.option=!!ce.lastChild;var ge={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function ve(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&A(e,t)?S.merge([e],n):n}function ye(e,t){for(var n=0,r=e.length;n<r;n++)Y.set(e[n],"globalEval",!t||Y.get(t[n],"globalEval"))}ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td,y.option||(ge.optgroup=ge.option=[1,"<select multiple='multiple'>","</select>"]);var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===w(o))S.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+S.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;S.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&-1<S.inArray(o,r))i&&i.push(o);else if(l=ie(o),a=ve(f.appendChild(o),"script"),l&&ye(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}var be=/^key/,we=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Te=/^([^.]*)(?:\.(.+)|)/;function Ce(){return!0}function Ee(){return!1}function Se(e,t){return e===function(){try{return E.activeElement}catch(e){}}()==("focus"===t)}function ke(e,t,n,r,i,o){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(r=r||n,n=void 0),t)ke(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=Ee;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return S().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=S.guid++)),e.each(function(){S.event.add(this,t,i,r,n)})}function Ae(e,i,o){o?(Y.set(e,i,!1),S.event.add(e,i,{namespace:!1,handler:function(e){var t,n,r=Y.get(this,i);if(1&e.isTrigger&&this[i]){if(r.length)(S.event.special[i]||{}).delegateType&&e.stopPropagation();else if(r=s.call(arguments),Y.set(this,i,r),t=o(this,i),this[i](),r!==(n=Y.get(this,i))||t?Y.set(this,i,!1):n={},r!==n)return e.stopImmediatePropagation(),e.preventDefault(),n.value}else r.length&&(Y.set(this,i,{value:S.event.trigger(S.extend(r[0],S.Event.prototype),r.slice(1),this)}),e.stopImmediatePropagation())}})):void 0===Y.get(e,i)&&S.event.add(e,i,Ce)}S.event={global:{},add:function(t,e,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.get(t);if(V(t)){n.handler&&(n=(o=n).handler,i=o.selector),i&&S.find.matchesSelector(re,i),n.guid||(n.guid=S.guid++),(u=v.events)||(u=v.events=Object.create(null)),(a=v.handle)||(a=v.handle=function(e){return"undefined"!=typeof S&&S.event.triggered!==e.type?S.event.dispatch.apply(t,arguments):void 0}),l=(e=(e||"").match(P)||[""]).length;while(l--)d=g=(s=Te.exec(e[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=S.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=S.event.special[d]||{},c=S.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&S.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(t,r,h,a)||t.addEventListener&&t.addEventListener(d,a)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),S.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.hasData(e)&&Y.get(e);if(v&&(u=v.events)){l=(t=(t||"").match(P)||[""]).length;while(l--)if(d=g=(s=Te.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d){f=S.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||S.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)S.event.remove(e,d+t[l],n,r,!0);S.isEmptyObject(u)&&Y.remove(e,"handle events")}},dispatch:function(e){var t,n,r,i,o,a,s=new Array(arguments.length),u=S.event.fix(e),l=(Y.get(this,"events")||Object.create(null))[u.type]||[],c=S.event.special[u.type]||{};for(s[0]=u,t=1;t<arguments.length;t++)s[t]=arguments[t];if(u.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,u)){a=S.event.handlers.call(this,u,l),t=0;while((i=a[t++])&&!u.isPropagationStopped()){u.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!u.isImmediatePropagationStopped())u.rnamespace&&!1!==o.namespace&&!u.rnamespace.test(o.namespace)||(u.handleObj=o,u.data=o.data,void 0!==(r=((S.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(u.result=r)&&(u.preventDefault(),u.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,u),u.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&1<=e.button))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?-1<S(i,this).index(l):S.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(t,e){Object.defineProperty(S.Event.prototype,t,{enumerable:!0,configurable:!0,get:m(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(e){return e[S.expando]?e:new S.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Ae(t,"click",Ce),!1},trigger:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Ae(t,"click"),!0},_default:function(e){var t=e.target;return pe.test(t.type)&&t.click&&A(t,"input")&&Y.get(t,"click")||A(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},S.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},S.Event=function(e,t){if(!(this instanceof S.Event))return new S.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ce:Ee,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&S.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[S.expando]=!0},S.Event.prototype={constructor:S.Event,isDefaultPrevented:Ee,isPropagationStopped:Ee,isImmediatePropagationStopped:Ee,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ce,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ce,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ce,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},S.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&be.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&we.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},S.event.addProp),S.each({focus:"focusin",blur:"focusout"},function(e,t){S.event.special[e]={setup:function(){return Ae(this,e,Se),!1},trigger:function(){return Ae(this,e),!0},delegateType:t}}),S.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,i){S.event.special[e]={delegateType:i,bindType:i,handle:function(e){var t,n=e.relatedTarget,r=e.handleObj;return n&&(n===this||S.contains(this,n))||(e.type=r.origType,t=r.handler.apply(this,arguments),e.type=i),t}}}),S.fn.extend({on:function(e,t,n,r){return ke(this,e,t,n,r)},one:function(e,t,n,r){return ke(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,S(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Ee),this.each(function(){S.event.remove(this,e,n,t)})}});var Ne=/<script|<style|<link/i,De=/checked\s*(?:[^=]|=\s*.checked.)/i,je=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function qe(e,t){return A(e,"table")&&A(11!==t.nodeType?t:t.firstChild,"tr")&&S(e).children("tbody")[0]||e}function Le(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function He(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Oe(e,t){var n,r,i,o,a,s;if(1===t.nodeType){if(Y.hasData(e)&&(s=Y.get(e).events))for(i in Y.remove(t,"handle events"),s)for(n=0,r=s[i].length;n<r;n++)S.event.add(t,i,s[i][n]);Q.hasData(e)&&(o=Q.access(e),a=S.extend({},o),Q.set(t,a))}}function Pe(n,r,i,o){r=g(r);var e,t,a,s,u,l,c=0,f=n.length,p=f-1,d=r[0],h=m(d);if(h||1<f&&"string"==typeof d&&!y.checkClone&&De.test(d))return n.each(function(e){var t=n.eq(e);h&&(r[0]=d.call(this,e,t.html())),Pe(t,r,i,o)});if(f&&(t=(e=xe(r,n[0].ownerDocument,!1,n,o)).firstChild,1===e.childNodes.length&&(e=t),t||o)){for(s=(a=S.map(ve(e,"script"),Le)).length;c<f;c++)u=e,c!==p&&(u=S.clone(u,!0,!0),s&&S.merge(a,ve(u,"script"))),i.call(n[c],u,c);if(s)for(l=a[a.length-1].ownerDocument,S.map(a,He),c=0;c<s;c++)u=a[c],he.test(u.type||"")&&!Y.access(u,"globalEval")&&S.contains(l,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?S._evalUrl&&!u.noModule&&S._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")},l):b(u.textContent.replace(je,""),u,l))}return n}function Re(e,t,n){for(var r,i=t?S.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||S.cleanData(ve(r)),r.parentNode&&(n&&ie(r)&&ye(ve(r,"script")),r.parentNode.removeChild(r));return e}S.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,i,o,a,s,u,l,c=e.cloneNode(!0),f=ie(e);if(!(y.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||S.isXMLDoc(e)))for(a=ve(c),r=0,i=(o=ve(e)).length;r<i;r++)s=o[r],u=a[r],void 0,"input"===(l=u.nodeName.toLowerCase())&&pe.test(s.type)?u.checked=s.checked:"input"!==l&&"textarea"!==l||(u.defaultValue=s.defaultValue);if(t)if(n)for(o=o||ve(e),a=a||ve(c),r=0,i=o.length;r<i;r++)Oe(o[r],a[r]);else Oe(e,c);return 0<(a=ve(c,"script")).length&&ye(a,!f&&ve(e,"script")),c},cleanData:function(e){for(var t,n,r,i=S.event.special,o=0;void 0!==(n=e[o]);o++)if(V(n)){if(t=n[Y.expando]){if(t.events)for(r in t.events)i[r]?S.event.remove(n,r):S.removeEvent(n,r,t.handle);n[Y.expando]=void 0}n[Q.expando]&&(n[Q.expando]=void 0)}}}),S.fn.extend({detach:function(e){return Re(this,e,!0)},remove:function(e){return Re(this,e)},text:function(e){return $(this,function(e){return void 0===e?S.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Pe(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||qe(this,e).appendChild(e)})},prepend:function(){return Pe(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=qe(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Pe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Pe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(S.cleanData(ve(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return S.clone(this,e,t)})},html:function(e){return $(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ne.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=S.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(S.cleanData(ve(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var n=[];return Pe(this,arguments,function(e){var t=this.parentNode;S.inArray(this,n)<0&&(S.cleanData(ve(this)),t&&t.replaceChild(e,this))},n)}}),S.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,a){S.fn[e]=function(e){for(var t,n=[],r=S(e),i=r.length-1,o=0;o<=i;o++)t=o===i?this:this.clone(!0),S(r[o])[a](t),u.apply(n,t.get());return this.pushStack(n)}});var Me=new RegExp("^("+ee+")(?!px)[a-z%]+$","i"),Ie=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=C),t.getComputedStyle(e)},We=function(e,t,n){var r,i,o={};for(i in t)o[i]=e.style[i],e.style[i]=t[i];for(i in r=n.call(e),t)e.style[i]=o[i];return r},Fe=new RegExp(ne.join("|"),"i");function Be(e,t,n){var r,i,o,a,s=e.style;return(n=n||Ie(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||ie(e)||(a=S.style(e,t)),!y.pixelBoxStyles()&&Me.test(a)&&Fe.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function $e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(l){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",l.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",re.appendChild(u).appendChild(l);var e=C.getComputedStyle(l);n="1%"!==e.top,s=12===t(e.marginLeft),l.style.right="60%",o=36===t(e.right),r=36===t(e.width),l.style.position="absolute",i=12===t(l.offsetWidth/3),re.removeChild(u),l=null}}function t(e){return Math.round(parseFloat(e))}var n,r,i,o,a,s,u=E.createElement("div"),l=E.createElement("div");l.style&&(l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",y.clearCloneStyle="content-box"===l.style.backgroundClip,S.extend(y,{boxSizingReliable:function(){return e(),r},pixelBoxStyles:function(){return e(),o},pixelPosition:function(){return e(),n},reliableMarginLeft:function(){return e(),s},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,n,r;return null==a&&(e=E.createElement("table"),t=E.createElement("tr"),n=E.createElement("div"),e.style.cssText="position:absolute;left:-11111px",t.style.height="1px",n.style.height="9px",re.appendChild(e).appendChild(t).appendChild(n),r=C.getComputedStyle(t),a=3<parseInt(r.height),re.removeChild(e)),a}}))}();var _e=["Webkit","Moz","ms"],ze=E.createElement("div").style,Ue={};function Xe(e){var t=S.cssProps[e]||Ue[e];return t||(e in ze?e:Ue[e]=function(e){var t=e[0].toUpperCase()+e.slice(1),n=_e.length;while(n--)if((e=_e[n]+t)in ze)return e}(e)||e)}var Ve=/^(none|table(?!-c[ea]).+)/,Ge=/^--/,Ye={position:"absolute",visibility:"hidden",display:"block"},Qe={letterSpacing:"0",fontWeight:"400"};function Je(e,t,n){var r=te.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ke(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=S.css(e,n+ne[a],!0,i)),r?("content"===n&&(u-=S.css(e,"padding"+ne[a],!0,i)),"margin"!==n&&(u-=S.css(e,"border"+ne[a]+"Width",!0,i))):(u+=S.css(e,"padding"+ne[a],!0,i),"padding"!==n?u+=S.css(e,"border"+ne[a]+"Width",!0,i):s+=S.css(e,"border"+ne[a]+"Width",!0,i));return!r&&0<=o&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))||0),u}function Ze(e,t,n){var r=Ie(e),i=(!y.boxSizingReliable()||n)&&"border-box"===S.css(e,"boxSizing",!1,r),o=i,a=Be(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(Me.test(a)){if(!n)return a;a="auto"}return(!y.boxSizingReliable()&&i||!y.reliableTrDimensions()&&A(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===S.css(e,"display",!1,r))&&e.getClientRects().length&&(i="border-box"===S.css(e,"boxSizing",!1,r),(o=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+Ke(e,t,n||(i?"border":"content"),o,r,a)+"px"}function et(e,t,n,r,i){return new et.prototype.init(e,t,n,r,i)}S.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Be(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=X(t),u=Ge.test(t),l=e.style;if(u||(t=Xe(s)),a=S.cssHooks[t]||S.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"===(o=typeof n)&&(i=te.exec(n))&&i[1]&&(n=se(e,t,i),o="number"),null!=n&&n==n&&("number"!==o||u||(n+=i&&i[3]||(S.cssNumber[s]?"":"px")),y.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=X(t);return Ge.test(t)||(t=Xe(s)),(a=S.cssHooks[t]||S.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Be(e,t,r)),"normal"===i&&t in Qe&&(i=Qe[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),S.each(["height","width"],function(e,u){S.cssHooks[u]={get:function(e,t,n){if(t)return!Ve.test(S.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?Ze(e,u,n):We(e,Ye,function(){return Ze(e,u,n)})},set:function(e,t,n){var r,i=Ie(e),o=!y.scrollboxSize()&&"absolute"===i.position,a=(o||n)&&"border-box"===S.css(e,"boxSizing",!1,i),s=n?Ke(e,u,n,a,i):0;return a&&o&&(s-=Math.ceil(e["offset"+u[0].toUpperCase()+u.slice(1)]-parseFloat(i[u])-Ke(e,u,"border",!1,i)-.5)),s&&(r=te.exec(t))&&"px"!==(r[3]||"px")&&(e.style[u]=t,t=S.css(e,u)),Je(0,t,s)}}}),S.cssHooks.marginLeft=$e(y.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Be(e,"marginLeft"))||e.getBoundingClientRect().left-We(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),S.each({margin:"",padding:"",border:"Width"},function(i,o){S.cssHooks[i+o]={expand:function(e){for(var t=0,n={},r="string"==typeof e?e.split(" "):[e];t<4;t++)n[i+ne[t]+o]=r[t]||r[t-2]||r[0];return n}},"margin"!==i&&(S.cssHooks[i+o].set=Je)}),S.fn.extend({css:function(e,t){return $(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=Ie(e),i=t.length;a<i;a++)o[t[a]]=S.css(e,t[a],!1,r);return o}return void 0!==n?S.style(e,t,n):S.css(e,t)},e,t,1<arguments.length)}}),((S.Tween=et).prototype={constructor:et,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||S.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(S.cssNumber[n]?"":"px")},cur:function(){var e=et.propHooks[this.prop];return e&&e.get?e.get(this):et.propHooks._default.get(this)},run:function(e){var t,n=et.propHooks[this.prop];return this.options.duration?this.pos=t=S.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):et.propHooks._default.set(this),this}}).init.prototype=et.prototype,(et.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=S.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){S.fx.step[e.prop]?S.fx.step[e.prop](e):1!==e.elem.nodeType||!S.cssHooks[e.prop]&&null==e.elem.style[Xe(e.prop)]?e.elem[e.prop]=e.now:S.style(e.elem,e.prop,e.now+e.unit)}}}).scrollTop=et.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},S.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},S.fx=et.prototype.init,S.fx.step={};var tt,nt,rt,it,ot=/^(?:toggle|show|hide)$/,at=/queueHooks$/;function st(){nt&&(!1===E.hidden&&C.requestAnimationFrame?C.requestAnimationFrame(st):C.setTimeout(st,S.fx.interval),S.fx.tick())}function ut(){return C.setTimeout(function(){tt=void 0}),tt=Date.now()}function lt(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=ne[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function ct(e,t,n){for(var r,i=(ft.tweeners[t]||[]).concat(ft.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ft(o,e,t){var n,a,r=0,i=ft.prefilters.length,s=S.Deferred().always(function(){delete u.elem}),u=function(){if(a)return!1;for(var e=tt||ut(),t=Math.max(0,l.startTime+l.duration-e),n=1-(t/l.duration||0),r=0,i=l.tweens.length;r<i;r++)l.tweens[r].run(n);return s.notifyWith(o,[l,n,t]),n<1&&i?t:(i||s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l]),!1)},l=s.promise({elem:o,props:S.extend({},e),opts:S.extend(!0,{specialEasing:{},easing:S.easing._default},t),originalProperties:e,originalOptions:t,startTime:tt||ut(),duration:t.duration,tweens:[],createTween:function(e,t){var n=S.Tween(o,l.opts,e,t,l.opts.specialEasing[e]||l.opts.easing);return l.tweens.push(n),n},stop:function(e){var t=0,n=e?l.tweens.length:0;if(a)return this;for(a=!0;t<n;t++)l.tweens[t].run(1);return e?(s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l,e])):s.rejectWith(o,[l,e]),this}}),c=l.props;for(!function(e,t){var n,r,i,o,a;for(n in e)if(i=t[r=X(n)],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=S.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete e[r],o)n in e||(e[n]=o[n],t[n]=i);else t[r]=i}(c,l.opts.specialEasing);r<i;r++)if(n=ft.prefilters[r].call(l,o,c,l.opts))return m(n.stop)&&(S._queueHooks(l.elem,l.opts.queue).stop=n.stop.bind(n)),n;return S.map(c,ct,l),m(l.opts.start)&&l.opts.start.call(o,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),S.fx.timer(S.extend(u,{elem:o,anim:l,queue:l.opts.queue})),l}S.Animation=S.extend(ft,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return se(n.elem,e,te.exec(t),n),n}]},tweener:function(e,t){m(e)?(t=e,e=["*"]):e=e.match(P);for(var n,r=0,i=e.length;r<i;r++)n=e[r],ft.tweeners[n]=ft.tweeners[n]||[],ft.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),v=Y.get(e,"fxshow");for(r in n.queue||(null==(a=S._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,S.queue(e,"fx").length||a.empty.fire()})})),t)if(i=t[r],ot.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0}d[r]=v&&v[r]||S.style(e,r)}if((u=!S.isEmptyObject(t))||!S.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=v&&v.display)&&(l=Y.get(e,"display")),"none"===(c=S.css(e,"display"))&&(l?c=l:(le([e],!0),l=e.style.display||l,c=S.css(e,"display"),le([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===S.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1,d)u||(v?"hidden"in v&&(g=v.hidden):v=Y.access(e,"fxshow",{display:l}),o&&(v.hidden=!g),g&&le([e],!0),p.done(function(){for(r in g||le([e]),Y.remove(e,"fxshow"),d)S.style(e,r,d[r])})),u=ct(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0))}],prefilter:function(e,t){t?ft.prefilters.unshift(e):ft.prefilters.push(e)}}),S.speed=function(e,t,n){var r=e&&"object"==typeof e?S.extend({},e):{complete:n||!n&&t||m(e)&&e,duration:e,easing:n&&t||t&&!m(t)&&t};return S.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in S.fx.speeds?r.duration=S.fx.speeds[r.duration]:r.duration=S.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){m(r.old)&&r.old.call(this),r.queue&&S.dequeue(this,r.queue)},r},S.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(t,e,n,r){var i=S.isEmptyObject(t),o=S.speed(e,n,r),a=function(){var e=ft(this,S.extend({},t),o);(i||Y.get(this,"finish"))&&e.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(i,e,o){var a=function(e){var t=e.stop;delete e.stop,t(o)};return"string"!=typeof i&&(o=e,e=i,i=void 0),e&&this.queue(i||"fx",[]),this.each(function(){var e=!0,t=null!=i&&i+"queueHooks",n=S.timers,r=Y.get(this);if(t)r[t]&&r[t].stop&&a(r[t]);else for(t in r)r[t]&&r[t].stop&&at.test(t)&&a(r[t]);for(t=n.length;t--;)n[t].elem!==this||null!=i&&n[t].queue!==i||(n[t].anim.stop(o),e=!1,n.splice(t,1));!e&&o||S.dequeue(this,i)})},finish:function(a){return!1!==a&&(a=a||"fx"),this.each(function(){var e,t=Y.get(this),n=t[a+"queue"],r=t[a+"queueHooks"],i=S.timers,o=n?n.length:0;for(t.finish=!0,S.queue(this,a,[]),r&&r.stop&&r.stop.call(this,!0),e=i.length;e--;)i[e].elem===this&&i[e].queue===a&&(i[e].anim.stop(!0),i.splice(e,1));for(e=0;e<o;e++)n[e]&&n[e].finish&&n[e].finish.call(this);delete t.finish})}}),S.each(["toggle","show","hide"],function(e,r){var i=S.fn[r];S.fn[r]=function(e,t,n){return null==e||"boolean"==typeof e?i.apply(this,arguments):this.animate(lt(r,!0),e,t,n)}}),S.each({slideDown:lt("show"),slideUp:lt("hide"),slideToggle:lt("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,r){S.fn[e]=function(e,t,n){return this.animate(r,e,t,n)}}),S.timers=[],S.fx.tick=function(){var e,t=0,n=S.timers;for(tt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||S.fx.stop(),tt=void 0},S.fx.timer=function(e){S.timers.push(e),S.fx.start()},S.fx.interval=13,S.fx.start=function(){nt||(nt=!0,st())},S.fx.stop=function(){nt=null},S.fx.speeds={slow:600,fast:200,_default:400},S.fn.delay=function(r,e){return r=S.fx&&S.fx.speeds[r]||r,e=e||"fx",this.queue(e,function(e,t){var n=C.setTimeout(e,r);t.stop=function(){C.clearTimeout(n)}})},rt=E.createElement("input"),it=E.createElement("select").appendChild(E.createElement("option")),rt.type="checkbox",y.checkOn=""!==rt.value,y.optSelected=it.selected,(rt=E.createElement("input")).value="t",rt.type="radio",y.radioValue="t"===rt.value;var pt,dt=S.expr.attrHandle;S.fn.extend({attr:function(e,t){return $(this,S.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){S.removeAttr(this,e)})}}),S.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?S.prop(e,t,n):(1===o&&S.isXMLDoc(e)||(i=S.attrHooks[t.toLowerCase()]||(S.expr.match.bool.test(t)?pt:void 0)),void 0!==n?null===n?void S.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=S.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!y.radioValue&&"radio"===t&&A(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(P);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),pt={set:function(e,t,n){return!1===t?S.removeAttr(e,n):e.setAttribute(n,n),n}},S.each(S.expr.match.bool.source.match(/\w+/g),function(e,t){var a=dt[t]||S.find.attr;dt[t]=function(e,t,n){var r,i,o=t.toLowerCase();return n||(i=dt[o],dt[o]=r,r=null!=a(e,t,n)?o:null,dt[o]=i),r}});var ht=/^(?:input|select|textarea|button)$/i,gt=/^(?:a|area)$/i;function vt(e){return(e.match(P)||[]).join(" ")}function yt(e){return e.getAttribute&&e.getAttribute("class")||""}function mt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(P)||[]}S.fn.extend({prop:function(e,t){return $(this,S.prop,e,t,1<arguments.length)},removeProp:function(e){return this.each(function(){delete this[S.propFix[e]||e]})}}),S.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&S.isXMLDoc(e)||(t=S.propFix[t]||t,i=S.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=S.find.attr(e,"tabindex");return t?parseInt(t,10):ht.test(e.nodeName)||gt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),y.optSelected||(S.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),S.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){S.propFix[this.toLowerCase()]=this}),S.fn.extend({addClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).addClass(t.call(this,e,yt(this)))});if((e=mt(t)).length)while(n=this[u++])if(i=yt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=e[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},removeClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).removeClass(t.call(this,e,yt(this)))});if(!arguments.length)return this.attr("class","");if((e=mt(t)).length)while(n=this[u++])if(i=yt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=e[a++])while(-1<r.indexOf(" "+o+" "))r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(i,t){var o=typeof i,a="string"===o||Array.isArray(i);return"boolean"==typeof t&&a?t?this.addClass(i):this.removeClass(i):m(i)?this.each(function(e){S(this).toggleClass(i.call(this,e,yt(this),t),t)}):this.each(function(){var e,t,n,r;if(a){t=0,n=S(this),r=mt(i);while(e=r[t++])n.hasClass(e)?n.removeClass(e):n.addClass(e)}else void 0!==i&&"boolean"!==o||((e=yt(this))&&Y.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===i?"":Y.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&-1<(" "+vt(yt(n))+" ").indexOf(t))return!0;return!1}});var xt=/\r/g;S.fn.extend({val:function(n){var r,e,i,t=this[0];return arguments.length?(i=m(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,S(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=S.map(t,function(e){return null==e?"":e+""})),(r=S.valHooks[this.type]||S.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t))})):t?(r=S.valHooks[t.type]||S.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(xt,""):null==e?"":e:void 0}}),S.extend({valHooks:{option:{get:function(e){var t=S.find.attr(e,"value");return null!=t?t:vt(S.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!A(n.parentNode,"optgroup"))){if(t=S(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=S.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=-1<S.inArray(S.valHooks.option.get(r),o))&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),S.each(["radio","checkbox"],function(){S.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=-1<S.inArray(S(e).val(),t)}},y.checkOn||(S.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),y.focusin="onfocusin"in C;var bt=/^(?:focusinfocus|focusoutblur)$/,wt=function(e){e.stopPropagation()};S.extend(S.event,{trigger:function(e,t,n,r){var i,o,a,s,u,l,c,f,p=[n||E],d=v.call(e,"type")?e.type:e,h=v.call(e,"namespace")?e.namespace.split("."):[];if(o=f=a=n=n||E,3!==n.nodeType&&8!==n.nodeType&&!bt.test(d+S.event.triggered)&&(-1<d.indexOf(".")&&(d=(h=d.split(".")).shift(),h.sort()),u=d.indexOf(":")<0&&"on"+d,(e=e[S.expando]?e:new S.Event(d,"object"==typeof e&&e)).isTrigger=r?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:S.makeArray(t,[e]),c=S.event.special[d]||{},r||!c.trigger||!1!==c.trigger.apply(n,t))){if(!r&&!c.noBubble&&!x(n)){for(s=c.delegateType||d,bt.test(s+d)||(o=o.parentNode);o;o=o.parentNode)p.push(o),a=o;a===(n.ownerDocument||E)&&p.push(a.defaultView||a.parentWindow||C)}i=0;while((o=p[i++])&&!e.isPropagationStopped())f=o,e.type=1<i?s:c.bindType||d,(l=(Y.get(o,"events")||Object.create(null))[e.type]&&Y.get(o,"handle"))&&l.apply(o,t),(l=u&&o[u])&&l.apply&&V(o)&&(e.result=l.apply(o,t),!1===e.result&&e.preventDefault());return e.type=d,r||e.isDefaultPrevented()||c._default&&!1!==c._default.apply(p.pop(),t)||!V(n)||u&&m(n[d])&&!x(n)&&((a=n[u])&&(n[u]=null),S.event.triggered=d,e.isPropagationStopped()&&f.addEventListener(d,wt),n[d](),e.isPropagationStopped()&&f.removeEventListener(d,wt),S.event.triggered=void 0,a&&(n[u]=a)),e.result}},simulate:function(e,t,n){var r=S.extend(new S.Event,n,{type:e,isSimulated:!0});S.event.trigger(r,null,t)}}),S.fn.extend({trigger:function(e,t){return this.each(function(){S.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return S.event.trigger(e,t,n,!0)}}),y.focusin||S.each({focus:"focusin",blur:"focusout"},function(n,r){var i=function(e){S.event.simulate(r,e.target,S.event.fix(e))};S.event.special[r]={setup:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r);t||e.addEventListener(n,i,!0),Y.access(e,r,(t||0)+1)},teardown:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r)-1;t?Y.access(e,r,t):(e.removeEventListener(n,i,!0),Y.remove(e,r))}}});var Tt=C.location,Ct={guid:Date.now()},Et=/\?/;S.parseXML=function(e){var t;if(!e||"string"!=typeof e)return null;try{t=(new C.DOMParser).parseFromString(e,"text/xml")}catch(e){t=void 0}return t&&!t.getElementsByTagName("parsererror").length||S.error("Invalid XML: "+e),t};var St=/\[\]$/,kt=/\r?\n/g,At=/^(?:submit|button|image|reset|file)$/i,Nt=/^(?:input|select|textarea|keygen)/i;function Dt(n,e,r,i){var t;if(Array.isArray(e))S.each(e,function(e,t){r||St.test(n)?i(n,t):Dt(n+"["+("object"==typeof t&&null!=t?e:"")+"]",t,r,i)});else if(r||"object"!==w(e))i(n,e);else for(t in e)Dt(n+"["+t+"]",e[t],r,i)}S.param=function(e,t){var n,r=[],i=function(e,t){var n=m(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!S.isPlainObject(e))S.each(e,function(){i(this.name,this.value)});else for(n in e)Dt(n,e[n],t,i);return r.join("&")},S.fn.extend({serialize:function(){return S.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=S.prop(this,"elements");return e?S.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!S(this).is(":disabled")&&Nt.test(this.nodeName)&&!At.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=S(this).val();return null==n?null:Array.isArray(n)?S.map(n,function(e){return{name:t.name,value:e.replace(kt,"\r\n")}}):{name:t.name,value:n.replace(kt,"\r\n")}}).get()}});var jt=/%20/g,qt=/#.*$/,Lt=/([?&])_=[^&]*/,Ht=/^(.*?):[ \t]*([^\r\n]*)$/gm,Ot=/^(?:GET|HEAD)$/,Pt=/^\/\//,Rt={},Mt={},It="*/".concat("*"),Wt=E.createElement("a");function Ft(o){return function(e,t){"string"!=typeof e&&(t=e,e="*");var n,r=0,i=e.toLowerCase().match(P)||[];if(m(t))while(n=i[r++])"+"===n[0]?(n=n.slice(1)||"*",(o[n]=o[n]||[]).unshift(t)):(o[n]=o[n]||[]).push(t)}}function Bt(t,i,o,a){var s={},u=t===Mt;function l(e){var r;return s[e]=!0,S.each(t[e]||[],function(e,t){var n=t(i,o,a);return"string"!=typeof n||u||s[n]?u?!(r=n):void 0:(i.dataTypes.unshift(n),l(n),!1)}),r}return l(i.dataTypes[0])||!s["*"]&&l("*")}function $t(e,t){var n,r,i=S.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&S.extend(!0,e,r),e}Wt.href=Tt.href,S.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Tt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Tt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":It,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":S.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?$t($t(e,S.ajaxSettings),t):$t(S.ajaxSettings,e)},ajaxPrefilter:Ft(Rt),ajaxTransport:Ft(Mt),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var c,f,p,n,d,r,h,g,i,o,v=S.ajaxSetup({},t),y=v.context||v,m=v.context&&(y.nodeType||y.jquery)?S(y):S.event,x=S.Deferred(),b=S.Callbacks("once memory"),w=v.statusCode||{},a={},s={},u="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(h){if(!n){n={};while(t=Ht.exec(p))n[t[1].toLowerCase()+" "]=(n[t[1].toLowerCase()+" "]||[]).concat(t[2])}t=n[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return h?p:null},setRequestHeader:function(e,t){return null==h&&(e=s[e.toLowerCase()]=s[e.toLowerCase()]||e,a[e]=t),this},overrideMimeType:function(e){return null==h&&(v.mimeType=e),this},statusCode:function(e){var t;if(e)if(h)T.always(e[T.status]);else for(t in e)w[t]=[w[t],e[t]];return this},abort:function(e){var t=e||u;return c&&c.abort(t),l(0,t),this}};if(x.promise(T),v.url=((e||v.url||Tt.href)+"").replace(Pt,Tt.protocol+"//"),v.type=t.method||t.type||v.method||v.type,v.dataTypes=(v.dataType||"*").toLowerCase().match(P)||[""],null==v.crossDomain){r=E.createElement("a");try{r.href=v.url,r.href=r.href,v.crossDomain=Wt.protocol+"//"+Wt.host!=r.protocol+"//"+r.host}catch(e){v.crossDomain=!0}}if(v.data&&v.processData&&"string"!=typeof v.data&&(v.data=S.param(v.data,v.traditional)),Bt(Rt,v,t,T),h)return T;for(i in(g=S.event&&v.global)&&0==S.active++&&S.event.trigger("ajaxStart"),v.type=v.type.toUpperCase(),v.hasContent=!Ot.test(v.type),f=v.url.replace(qt,""),v.hasContent?v.data&&v.processData&&0===(v.contentType||"").indexOf("application/x-www-form-urlencoded")&&(v.data=v.data.replace(jt,"+")):(o=v.url.slice(f.length),v.data&&(v.processData||"string"==typeof v.data)&&(f+=(Et.test(f)?"&":"?")+v.data,delete v.data),!1===v.cache&&(f=f.replace(Lt,"$1"),o=(Et.test(f)?"&":"?")+"_="+Ct.guid+++o),v.url=f+o),v.ifModified&&(S.lastModified[f]&&T.setRequestHeader("If-Modified-Since",S.lastModified[f]),S.etag[f]&&T.setRequestHeader("If-None-Match",S.etag[f])),(v.data&&v.hasContent&&!1!==v.contentType||t.contentType)&&T.setRequestHeader("Content-Type",v.contentType),T.setRequestHeader("Accept",v.dataTypes[0]&&v.accepts[v.dataTypes[0]]?v.accepts[v.dataTypes[0]]+("*"!==v.dataTypes[0]?", "+It+"; q=0.01":""):v.accepts["*"]),v.headers)T.setRequestHeader(i,v.headers[i]);if(v.beforeSend&&(!1===v.beforeSend.call(y,T,v)||h))return T.abort();if(u="abort",b.add(v.complete),T.done(v.success),T.fail(v.error),c=Bt(Mt,v,t,T)){if(T.readyState=1,g&&m.trigger("ajaxSend",[T,v]),h)return T;v.async&&0<v.timeout&&(d=C.setTimeout(function(){T.abort("timeout")},v.timeout));try{h=!1,c.send(a,l)}catch(e){if(h)throw e;l(-1,e)}}else l(-1,"No Transport");function l(e,t,n,r){var i,o,a,s,u,l=t;h||(h=!0,d&&C.clearTimeout(d),c=void 0,p=r||"",T.readyState=0<e?4:0,i=200<=e&&e<300||304===e,n&&(s=function(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}(v,T,n)),!i&&-1<S.inArray("script",v.dataTypes)&&(v.converters["text script"]=function(){}),s=function(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}(v,s,T,i),i?(v.ifModified&&((u=T.getResponseHeader("Last-Modified"))&&(S.lastModified[f]=u),(u=T.getResponseHeader("etag"))&&(S.etag[f]=u)),204===e||"HEAD"===v.type?l="nocontent":304===e?l="notmodified":(l=s.state,o=s.data,i=!(a=s.error))):(a=l,!e&&l||(l="error",e<0&&(e=0))),T.status=e,T.statusText=(t||l)+"",i?x.resolveWith(y,[o,l,T]):x.rejectWith(y,[T,l,a]),T.statusCode(w),w=void 0,g&&m.trigger(i?"ajaxSuccess":"ajaxError",[T,v,i?o:a]),b.fireWith(y,[T,l]),g&&(m.trigger("ajaxComplete",[T,v]),--S.active||S.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return S.get(e,t,n,"json")},getScript:function(e,t){return S.get(e,void 0,t,"script")}}),S.each(["get","post"],function(e,i){S[i]=function(e,t,n,r){return m(t)&&(r=r||n,n=t,t=void 0),S.ajax(S.extend({url:e,type:i,dataType:r,data:t,success:n},S.isPlainObject(e)&&e))}}),S.ajaxPrefilter(function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"")}),S._evalUrl=function(e,t,n){return S.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){S.globalEval(e,t,n)}})},S.fn.extend({wrapAll:function(e){var t;return this[0]&&(m(e)&&(e=e.call(this[0])),t=S(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(n){return m(n)?this.each(function(e){S(this).wrapInner(n.call(this,e))}):this.each(function(){var e=S(this),t=e.contents();t.length?t.wrapAll(n):e.append(n)})},wrap:function(t){var n=m(t);return this.each(function(e){S(this).wrapAll(n?t.call(this,e):t)})},unwrap:function(e){return this.parent(e).not("body").each(function(){S(this).replaceWith(this.childNodes)}),this}}),S.expr.pseudos.hidden=function(e){return!S.expr.pseudos.visible(e)},S.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},S.ajaxSettings.xhr=function(){try{return new C.XMLHttpRequest}catch(e){}};var _t={0:200,1223:204},zt=S.ajaxSettings.xhr();y.cors=!!zt&&"withCredentials"in zt,y.ajax=zt=!!zt,S.ajaxTransport(function(i){var o,a;if(y.cors||zt&&!i.crossDomain)return{send:function(e,t){var n,r=i.xhr();if(r.open(i.type,i.url,i.async,i.username,i.password),i.xhrFields)for(n in i.xhrFields)r[n]=i.xhrFields[n];for(n in i.mimeType&&r.overrideMimeType&&r.overrideMimeType(i.mimeType),i.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest"),e)r.setRequestHeader(n,e[n]);o=function(e){return function(){o&&(o=a=r.onload=r.onerror=r.onabort=r.ontimeout=r.onreadystatechange=null,"abort"===e?r.abort():"error"===e?"number"!=typeof r.status?t(0,"error"):t(r.status,r.statusText):t(_t[r.status]||r.status,r.statusText,"text"!==(r.responseType||"text")||"string"!=typeof r.responseText?{binary:r.response}:{text:r.responseText},r.getAllResponseHeaders()))}},r.onload=o(),a=r.onerror=r.ontimeout=o("error"),void 0!==r.onabort?r.onabort=a:r.onreadystatechange=function(){4===r.readyState&&C.setTimeout(function(){o&&a()})},o=o("abort");try{r.send(i.hasContent&&i.data||null)}catch(e){if(o)throw e}},abort:function(){o&&o()}}}),S.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),S.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return S.globalEval(e),e}}}),S.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),S.ajaxTransport("script",function(n){var r,i;if(n.crossDomain||n.scriptAttrs)return{send:function(e,t){r=S("<script>").attr(n.scriptAttrs||{}).prop({charset:n.scriptCharset,src:n.url}).on("load error",i=function(e){r.remove(),i=null,e&&t("error"===e.type?404:200,e.type)}),E.head.appendChild(r[0])},abort:function(){i&&i()}}});var Ut,Xt=[],Vt=/(=)\?(?=&|$)|\?\?/;S.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Xt.pop()||S.expando+"_"+Ct.guid++;return this[e]=!0,e}}),S.ajaxPrefilter("json jsonp",function(e,t,n){var r,i,o,a=!1!==e.jsonp&&(Vt.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Vt.test(e.data)&&"data");if(a||"jsonp"===e.dataTypes[0])return r=e.jsonpCallback=m(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Vt,"$1"+r):!1!==e.jsonp&&(e.url+=(Et.test(e.url)?"&":"?")+e.jsonp+"="+r),e.converters["script json"]=function(){return o||S.error(r+" was not called"),o[0]},e.dataTypes[0]="json",i=C[r],C[r]=function(){o=arguments},n.always(function(){void 0===i?S(C).removeProp(r):C[r]=i,e[r]&&(e.jsonpCallback=t.jsonpCallback,Xt.push(r)),o&&m(i)&&i(o[0]),o=i=void 0}),"script"}),y.createHTMLDocument=((Ut=E.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===Ut.childNodes.length),S.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(y.createHTMLDocument?((r=(t=E.implementation.createHTMLDocument("")).createElement("base")).href=E.location.href,t.head.appendChild(r)):t=E),o=!n&&[],(i=N.exec(e))?[t.createElement(i[1])]:(i=xe([e],t,o),o&&o.length&&S(o).remove(),S.merge([],i.childNodes)));var r,i,o},S.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return-1<s&&(r=vt(e.slice(s)),e=e.slice(0,s)),m(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),0<a.length&&S.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?S("<div>").append(S.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},S.expr.pseudos.animated=function(t){return S.grep(S.timers,function(e){return t===e.elem}).length},S.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l=S.css(e,"position"),c=S(e),f={};"static"===l&&(e.style.position="relative"),s=c.offset(),o=S.css(e,"top"),u=S.css(e,"left"),("absolute"===l||"fixed"===l)&&-1<(o+u).indexOf("auto")?(a=(r=c.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),m(t)&&(t=t.call(e,n,S.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+i),"using"in t?t.using.call(e,f):("number"==typeof f.top&&(f.top+="px"),"number"==typeof f.left&&(f.left+="px"),c.css(f))}},S.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){S.offset.setOffset(this,t,e)});var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===S.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===S.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=S(e).offset()).top+=S.css(e,"borderTopWidth",!0),i.left+=S.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-S.css(r,"marginTop",!0),left:t.left-i.left-S.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===S.css(e,"position"))e=e.offsetParent;return e||re})}}),S.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,i){var o="pageYOffset"===i;S.fn[t]=function(e){return $(this,function(e,t,n){var r;if(x(e)?r=e:9===e.nodeType&&(r=e.defaultView),void 0===n)return r?r[i]:e[t];r?r.scrollTo(o?r.pageXOffset:n,o?n:r.pageYOffset):e[t]=n},t,e,arguments.length)}}),S.each(["top","left"],function(e,n){S.cssHooks[n]=$e(y.pixelPosition,function(e,t){if(t)return t=Be(e,n),Me.test(t)?S(e).position()[n]+"px":t})}),S.each({Height:"height",Width:"width"},function(a,s){S.each({padding:"inner"+a,content:s,"":"outer"+a},function(r,o){S.fn[o]=function(e,t){var n=arguments.length&&(r||"boolean"!=typeof e),i=r||(!0===e||!0===t?"margin":"border");return $(this,function(e,t,n){var r;return x(e)?0===o.indexOf("outer")?e["inner"+a]:e.document.documentElement["client"+a]:9===e.nodeType?(r=e.documentElement,Math.max(e.body["scroll"+a],r["scroll"+a],e.body["offset"+a],r["offset"+a],r["client"+a])):void 0===n?S.css(e,t,i):S.style(e,t,n,i)},s,n?e:void 0,n)}})}),S.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){S.fn[t]=function(e){return this.on(t,e)}}),S.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,n){S.fn[n]=function(e,t){return 0<arguments.length?this.on(n,null,e,t):this.trigger(n)}});var Gt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;S.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),m(e))return r=s.call(arguments,2),(i=function(){return e.apply(t||this,r.concat(s.call(arguments)))}).guid=e.guid=e.guid||S.guid++,i},S.holdReady=function(e){e?S.readyWait++:S.ready(!0)},S.isArray=Array.isArray,S.parseJSON=JSON.parse,S.nodeName=A,S.isFunction=m,S.isWindow=x,S.camelCase=X,S.type=w,S.now=Date.now,S.isNumeric=function(e){var t=S.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},S.trim=function(e){return null==e?"":(e+"").replace(Gt,"")},"function"==typeof define&&define.amd&&define("jquery",[],function(){return S});var Yt=C.jQuery,Qt=C.$;return S.noConflict=function(e){return C.$===S&&(C.$=Qt),e&&C.jQuery===S&&(C.jQuery=Yt),S},"undefined"==typeof e&&(C.jQuery=C.$=S),S});
;
/*!
 * justifiedGallery - v3.8.1
 * http://miromannino.github.io/Justified-Gallery/
 * Copyright (c) 2020 Miro Mannino
 * Licensed under the MIT license.
 */

!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=function(t,i){return void 0===i&&(i="undefined"!=typeof window?require("jquery"):require("jquery")(t)),e(i),i}:e(jQuery)}(function(l){var r=function(t,i){this.settings=i,this.checkSettings(),this.imgAnalyzerTimeout=null,this.entries=null,this.buildingRow={entriesBuff:[],width:0,height:0,aspectRatio:0},this.lastFetchedEntry=null,this.lastAnalyzedIndex=-1,this.yield={every:2,flushed:0},this.border=0<=i.border?i.border:i.margins,this.maxRowHeight=this.retrieveMaxRowHeight(),this.suffixRanges=this.retrieveSuffixRanges(),this.offY=this.border,this.rows=0,this.spinner={phase:0,timeSlot:150,$el:l('<div class="jg-spinner"><span></span><span></span><span></span></div>'),intervalId:null},this.scrollBarOn=!1,this.checkWidthIntervalId=null,this.galleryWidth=t.width(),this.$gallery=t};r.prototype.getSuffix=function(t,i){var e,s;for(e=i<t?t:i,s=0;s<this.suffixRanges.length;s++)if(e<=this.suffixRanges[s])return this.settings.sizeRangeSuffixes[this.suffixRanges[s]];return this.settings.sizeRangeSuffixes[this.suffixRanges[s-1]]},r.prototype.removeSuffix=function(t,i){return t.substring(0,t.length-i.length)},r.prototype.endsWith=function(t,i){return-1!==t.indexOf(i,t.length-i.length)},r.prototype.getUsedSuffix=function(t){for(var i in this.settings.sizeRangeSuffixes)if(this.settings.sizeRangeSuffixes.hasOwnProperty(i)){if(0===this.settings.sizeRangeSuffixes[i].length)continue;if(this.endsWith(t,this.settings.sizeRangeSuffixes[i]))return this.settings.sizeRangeSuffixes[i]}return""},r.prototype.newSrc=function(t,i,e,s){var n;if(this.settings.thumbnailPath)n=this.settings.thumbnailPath(t,i,e,s);else{var r=t.match(this.settings.extension),o=null!==r?r[0]:"";n=t.replace(this.settings.extension,""),n=this.removeSuffix(n,this.getUsedSuffix(n)),n+=this.getSuffix(i,e)+o}return n},r.prototype.showImg=function(t,i){this.settings.cssAnimation?(t.addClass("jg-entry-visible"),i&&i()):(t.stop().fadeTo(this.settings.imagesAnimationDuration,1,i),t.find(this.settings.imgSelector).stop().fadeTo(this.settings.imagesAnimationDuration,1,i))},r.prototype.extractImgSrcFromImage=function(t){var i=t.data("safe-src"),e="data-safe-src";return void 0===i&&(i=t.attr("src"),e="src"),t.data("jg.originalSrc",i),t.data("jg.src",i),t.data("jg.originalSrcLoc",e),i},r.prototype.imgFromEntry=function(t){var i=t.find(this.settings.imgSelector);return 0===i.length?null:i},r.prototype.captionFromEntry=function(t){var i=t.find("> .jg-caption");return 0===i.length?null:i},r.prototype.displayEntry=function(t,i,e,s,n,r){t.width(s),t.height(r),t.css("top",e),t.css("left",i);var o=this.imgFromEntry(t);if(null!==o){o.css("width",s),o.css("height",n),o.css("margin-left",-s/2),o.css("margin-top",-n/2);var a=o.data("jg.src");if(a){a=this.newSrc(a,s,n,o[0]),o.one("error",function(){this.resetImgSrc(o)});var h=function(){o.attr("src",a)};"skipped"===t.data("jg.loaded")&&a?this.onImageEvent(a,function(){this.showImg(t,h),t.data("jg.loaded",!0)}.bind(this)):this.showImg(t,h)}}else this.showImg(t);this.displayEntryCaption(t)},r.prototype.displayEntryCaption=function(t){var i=this.imgFromEntry(t);if(null!==i&&this.settings.captions){var e=this.captionFromEntry(t);if(null===e){var s=i.attr("alt");this.isValidCaption(s)||(s=t.attr("title")),this.isValidCaption(s)&&(e=l('<div class="jg-caption">'+s+"</div>"),t.append(e),t.data("jg.createdCaption",!0))}null!==e&&(this.settings.cssAnimation||e.stop().fadeTo(0,this.settings.captionSettings.nonVisibleOpacity),this.addCaptionEventsHandlers(t))}else this.removeCaptionEventsHandlers(t)},r.prototype.isValidCaption=function(t){return void 0!==t&&0<t.length},r.prototype.onEntryMouseEnterForCaption=function(t){var i=this.captionFromEntry(l(t.currentTarget));this.settings.cssAnimation?i.addClass("jg-caption-visible").removeClass("jg-caption-hidden"):i.stop().fadeTo(this.settings.captionSettings.animationDuration,this.settings.captionSettings.visibleOpacity)},r.prototype.onEntryMouseLeaveForCaption=function(t){var i=this.captionFromEntry(l(t.currentTarget));this.settings.cssAnimation?i.removeClass("jg-caption-visible").removeClass("jg-caption-hidden"):i.stop().fadeTo(this.settings.captionSettings.animationDuration,this.settings.captionSettings.nonVisibleOpacity)},r.prototype.addCaptionEventsHandlers=function(t){var i=t.data("jg.captionMouseEvents");void 0===i&&(i={mouseenter:l.proxy(this.onEntryMouseEnterForCaption,this),mouseleave:l.proxy(this.onEntryMouseLeaveForCaption,this)},t.on("mouseenter",void 0,void 0,i.mouseenter),t.on("mouseleave",void 0,void 0,i.mouseleave),t.data("jg.captionMouseEvents",i))},r.prototype.removeCaptionEventsHandlers=function(t){var i=t.data("jg.captionMouseEvents");void 0!==i&&(t.off("mouseenter",void 0,i.mouseenter),t.off("mouseleave",void 0,i.mouseleave),t.removeData("jg.captionMouseEvents"))},r.prototype.clearBuildingRow=function(){this.buildingRow.entriesBuff=[],this.buildingRow.aspectRatio=0,this.buildingRow.width=0},r.prototype.prepareBuildingRow=function(t,i){var e,s,n,r,o,a=!0,h=0,g=this.galleryWidth-2*this.border-(this.buildingRow.entriesBuff.length-1)*this.settings.margins,l=g/this.buildingRow.aspectRatio,u=this.settings.rowHeight,d=this.buildingRow.width/g>this.settings.justifyThreshold;if(i||t&&"hide"===this.settings.lastRow&&!d){for(e=0;e<this.buildingRow.entriesBuff.length;e++)s=this.buildingRow.entriesBuff[e],this.settings.cssAnimation?s.removeClass("jg-entry-visible"):(s.stop().fadeTo(0,.1),s.find("> img, > a > img").fadeTo(0,0));return-1}for(t&&!d&&"justify"!==this.settings.lastRow&&"hide"!==this.settings.lastRow&&(a=!1,0<this.rows&&(a=(u=(this.offY-this.border-this.settings.margins*this.rows)/this.rows)*this.buildingRow.aspectRatio/g>this.settings.justifyThreshold)),e=0;e<this.buildingRow.entriesBuff.length;e++)n=(s=this.buildingRow.entriesBuff[e]).data("jg.width")/s.data("jg.height"),o=a?(r=e===this.buildingRow.entriesBuff.length-1?g:l*n,l):(r=u*n,u),g-=Math.round(r),s.data("jg.jwidth",Math.round(r)),s.data("jg.jheight",Math.ceil(o)),(0===e||o<h)&&(h=o);return this.buildingRow.height=h,a},r.prototype.flushRow=function(t,i){var e,s,n,r=this.settings,o=this.border;if(s=this.prepareBuildingRow(t,i),i||t&&"hide"===r.lastRow&&-1===s)this.clearBuildingRow();else{if(this.maxRowHeight&&this.maxRowHeight<this.buildingRow.height&&(this.buildingRow.height=this.maxRowHeight),t&&("center"===r.lastRow||"right"===r.lastRow)){var a=this.galleryWidth-2*this.border-(this.buildingRow.entriesBuff.length-1)*r.margins;for(n=0;n<this.buildingRow.entriesBuff.length;n++)a-=(e=this.buildingRow.entriesBuff[n]).data("jg.jwidth");"center"===r.lastRow?o+=Math.round(a/2):"right"===r.lastRow&&(o+=a)}var h=this.buildingRow.entriesBuff.length-1;for(n=0;n<=h;n++)e=this.buildingRow.entriesBuff[this.settings.rtl?h-n:n],this.displayEntry(e,o,this.offY,e.data("jg.jwidth"),e.data("jg.jheight"),this.buildingRow.height),o+=e.data("jg.jwidth")+r.margins;this.galleryHeightToSet=this.offY+this.buildingRow.height+this.border,this.setGalleryTempHeight(this.galleryHeightToSet+this.getSpinnerHeight()),(!t||this.buildingRow.height<=r.rowHeight&&s)&&(this.offY+=this.buildingRow.height+r.margins,this.rows+=1,this.clearBuildingRow(),this.settings.triggerEvent.call(this,"jg.rowflush"))}};var i=0;r.prototype.rememberGalleryHeight=function(){i=this.$gallery.height(),this.$gallery.height(i)},r.prototype.setGalleryTempHeight=function(t){i=Math.max(t,i),this.$gallery.height(i)},r.prototype.setGalleryFinalHeight=function(t){i=t,this.$gallery.height(t)},r.prototype.checkWidth=function(){this.checkWidthIntervalId=setInterval(l.proxy(function(){if(this.$gallery.is(":visible")){var t=parseFloat(this.$gallery.width());Math.abs(t-this.galleryWidth)>this.settings.refreshSensitivity&&(this.galleryWidth=t,this.rewind(),this.rememberGalleryHeight(),this.startImgAnalyzer(!0))}},this),this.settings.refreshTime)},r.prototype.isSpinnerActive=function(){return null!==this.spinner.intervalId},r.prototype.getSpinnerHeight=function(){return this.spinner.$el.innerHeight()},r.prototype.stopLoadingSpinnerAnimation=function(){clearInterval(this.spinner.intervalId),this.spinner.intervalId=null,this.setGalleryTempHeight(this.$gallery.height()-this.getSpinnerHeight()),this.spinner.$el.detach()},r.prototype.startLoadingSpinnerAnimation=function(){var t=this.spinner,i=t.$el.find("span");clearInterval(t.intervalId),this.$gallery.append(t.$el),this.setGalleryTempHeight(this.offY+this.buildingRow.height+this.getSpinnerHeight()),t.intervalId=setInterval(function(){t.phase<i.length?i.eq(t.phase).fadeTo(t.timeSlot,1):i.eq(t.phase-i.length).fadeTo(t.timeSlot,0),t.phase=(t.phase+1)%(2*i.length)},t.timeSlot)},r.prototype.rewind=function(){this.lastFetchedEntry=null,this.lastAnalyzedIndex=-1,this.offY=this.border,this.rows=0,this.clearBuildingRow()},r.prototype.getSelectorWithoutSpinner=function(){return this.settings.selector+", div:not(.jg-spinner)"},r.prototype.getAllEntries=function(){var t=this.getSelectorWithoutSpinner();return this.$gallery.children(t).toArray()},r.prototype.updateEntries=function(t){var i;if(t&&null!=this.lastFetchedEntry){var e=this.getSelectorWithoutSpinner();i=l(this.lastFetchedEntry).nextAll(e).toArray()}else this.entries=[],i=this.getAllEntries();return 0<i.length&&(l.isFunction(this.settings.sort)?i=this.sortArray(i):this.settings.randomize&&(i=this.shuffleArray(i)),this.lastFetchedEntry=i[i.length-1],this.settings.filter?i=this.filterArray(i):this.resetFilters(i)),this.entries=this.entries.concat(i),!0},r.prototype.insertToGallery=function(t){var i=this;l.each(t,function(){l(this).appendTo(i.$gallery)})},r.prototype.shuffleArray=function(t){var i,e,s;for(i=t.length-1;0<i;i--)e=Math.floor(Math.random()*(i+1)),s=t[i],t[i]=t[e],t[e]=s;return this.insertToGallery(t),t},r.prototype.sortArray=function(t){return t.sort(this.settings.sort),this.insertToGallery(t),t},r.prototype.resetFilters=function(t){for(var i=0;i<t.length;i++)l(t[i]).removeClass("jg-filtered")},r.prototype.filterArray=function(t){var e=this.settings;if("string"===l.type(e.filter))return t.filter(function(t){var i=l(t);return i.is(e.filter)?(i.removeClass("jg-filtered"),!0):(i.addClass("jg-filtered").removeClass("jg-visible"),!1)});if(l.isFunction(e.filter)){for(var i=t.filter(e.filter),s=0;s<t.length;s++)-1===i.indexOf(t[s])?l(t[s]).addClass("jg-filtered").removeClass("jg-visible"):l(t[s]).removeClass("jg-filtered");return i}},r.prototype.resetImgSrc=function(t){"src"===t.data("jg.originalSrcLoc")?t.attr("src",t.data("jg.originalSrc")):t.attr("src","")},r.prototype.destroy=function(){clearInterval(this.checkWidthIntervalId),this.stopImgAnalyzerStarter(),l.each(this.getAllEntries(),l.proxy(function(t,i){var e=l(i);e.css("width",""),e.css("height",""),e.css("top",""),e.css("left",""),e.data("jg.loaded",void 0),e.removeClass("jg-entry jg-filtered jg-entry-visible");var s=this.imgFromEntry(e);s&&(s.css("width",""),s.css("height",""),s.css("margin-left",""),s.css("margin-top",""),this.resetImgSrc(s),s.data("jg.originalSrc",void 0),s.data("jg.originalSrcLoc",void 0),s.data("jg.src",void 0)),this.removeCaptionEventsHandlers(e);var n=this.captionFromEntry(e);e.data("jg.createdCaption")?(e.data("jg.createdCaption",void 0),null!==n&&n.remove()):null!==n&&n.fadeTo(0,1)},this)),this.$gallery.css("height",""),this.$gallery.removeClass("justified-gallery"),this.$gallery.data("jg.controller",void 0),this.settings.triggerEvent.call(this,"jg.destroy")},r.prototype.analyzeImages=function(t){for(var i=this.lastAnalyzedIndex+1;i<this.entries.length;i++){var e=l(this.entries[i]);if(!0===e.data("jg.loaded")||"skipped"===e.data("jg.loaded")){var s=this.galleryWidth-2*this.border-(this.buildingRow.entriesBuff.length-1)*this.settings.margins,n=e.data("jg.width")/e.data("jg.height");if(this.buildingRow.entriesBuff.push(e),this.buildingRow.aspectRatio+=n,this.buildingRow.width+=n*this.settings.rowHeight,this.lastAnalyzedIndex=i,s/(this.buildingRow.aspectRatio+n)<this.settings.rowHeight&&(this.flushRow(!1,0<this.settings.maxRowsCount&&this.rows===this.settings.maxRowsCount),++this.yield.flushed>=this.yield.every))return void this.startImgAnalyzer(t)}else if("error"!==e.data("jg.loaded"))return}0<this.buildingRow.entriesBuff.length&&this.flushRow(!0,0<this.settings.maxRowsCount&&this.rows===this.settings.maxRowsCount),this.isSpinnerActive()&&this.stopLoadingSpinnerAnimation(),this.stopImgAnalyzerStarter(),this.setGalleryFinalHeight(this.galleryHeightToSet),this.settings.triggerEvent.call(this,t?"jg.resize":"jg.complete")},r.prototype.stopImgAnalyzerStarter=function(){this.yield.flushed=0,null!==this.imgAnalyzerTimeout&&(clearTimeout(this.imgAnalyzerTimeout),this.imgAnalyzerTimeout=null)},r.prototype.startImgAnalyzer=function(t){var i=this;this.stopImgAnalyzerStarter(),this.imgAnalyzerTimeout=setTimeout(function(){i.analyzeImages(t)},.001)},r.prototype.onImageEvent=function(t,i,e){if(i||e){var s=new Image,n=l(s);i&&n.one("load",function(){n.off("load error"),i(s)}),e&&n.one("error",function(){n.off("load error"),e(s)}),s.src=t}},r.prototype.init=function(){var a=!1,h=!1,g=this;l.each(this.entries,function(t,i){var e=l(i),s=g.imgFromEntry(e);if(e.addClass("jg-entry"),!0!==e.data("jg.loaded")&&"skipped"!==e.data("jg.loaded"))if(null!==g.settings.rel&&e.attr("rel",g.settings.rel),null!==g.settings.target&&e.attr("target",g.settings.target),null!==s){var n=g.extractImgSrcFromImage(s);if(!1===g.settings.waitThumbnailsLoad||!n){var r=parseFloat(s.attr("width")),o=parseFloat(s.attr("height"));if("svg"===s.prop("tagName")&&(r=parseFloat(s[0].getBBox().width),o=parseFloat(s[0].getBBox().height)),!isNaN(r)&&!isNaN(o))return e.data("jg.width",r),e.data("jg.height",o),e.data("jg.loaded","skipped"),h=!0,g.startImgAnalyzer(!1),!0}e.data("jg.loaded",!1),a=!0,g.isSpinnerActive()||g.startLoadingSpinnerAnimation(),g.onImageEvent(n,function(t){e.data("jg.width",t.width),e.data("jg.height",t.height),e.data("jg.loaded",!0),g.startImgAnalyzer(!1)},function(){e.data("jg.loaded","error"),g.startImgAnalyzer(!1)})}else e.data("jg.loaded",!0),e.data("jg.width",e.width()|parseFloat(e.css("width"))|1),e.data("jg.height",e.height()|parseFloat(e.css("height"))|1)}),a||h||this.startImgAnalyzer(!1),this.checkWidth()},r.prototype.checkOrConvertNumber=function(t,i){if("string"===l.type(t[i])&&(t[i]=parseFloat(t[i])),"number"!==l.type(t[i]))throw i+" must be a number";if(isNaN(t[i]))throw"invalid number for "+i},r.prototype.checkSizeRangesSuffixes=function(){if("object"!==l.type(this.settings.sizeRangeSuffixes))throw"sizeRangeSuffixes must be defined and must be an object";var t=[];for(var i in this.settings.sizeRangeSuffixes)this.settings.sizeRangeSuffixes.hasOwnProperty(i)&&t.push(i);for(var e={0:""},s=0;s<t.length;s++)if("string"===l.type(t[s]))try{e[parseInt(t[s].replace(/^[a-z]+/,""),10)]=this.settings.sizeRangeSuffixes[t[s]]}catch(t){throw"sizeRangeSuffixes keys must contains correct numbers ("+t+")"}else e[t[s]]=this.settings.sizeRangeSuffixes[t[s]];this.settings.sizeRangeSuffixes=e},r.prototype.retrieveMaxRowHeight=function(){var t=null,i=this.settings.rowHeight;if("string"===l.type(this.settings.maxRowHeight))t=this.settings.maxRowHeight.match(/^[0-9]+%$/)?i*parseFloat(this.settings.maxRowHeight.match(/^([0-9]+)%$/)[1])/100:parseFloat(this.settings.maxRowHeight);else{if("number"!==l.type(this.settings.maxRowHeight)){if(!1===this.settings.maxRowHeight||null==this.settings.maxRowHeight)return null;throw"maxRowHeight must be a number or a percentage"}t=this.settings.maxRowHeight}if(isNaN(t))throw"invalid number for maxRowHeight";return t<i&&(t=i),t},r.prototype.checkSettings=function(){this.checkSizeRangesSuffixes(),this.checkOrConvertNumber(this.settings,"rowHeight"),this.checkOrConvertNumber(this.settings,"margins"),this.checkOrConvertNumber(this.settings,"border"),this.checkOrConvertNumber(this.settings,"maxRowsCount");var t=["justify","nojustify","left","center","right","hide"];if(-1===t.indexOf(this.settings.lastRow))throw"lastRow must be one of: "+t.join(", ");if(this.checkOrConvertNumber(this.settings,"justifyThreshold"),this.settings.justifyThreshold<0||1<this.settings.justifyThreshold)throw"justifyThreshold must be in the interval [0,1]";if("boolean"!==l.type(this.settings.cssAnimation))throw"cssAnimation must be a boolean";if("boolean"!==l.type(this.settings.captions))throw"captions must be a boolean";if(this.checkOrConvertNumber(this.settings.captionSettings,"animationDuration"),this.checkOrConvertNumber(this.settings.captionSettings,"visibleOpacity"),this.settings.captionSettings.visibleOpacity<0||1<this.settings.captionSettings.visibleOpacity)throw"captionSettings.visibleOpacity must be in the interval [0, 1]";if(this.checkOrConvertNumber(this.settings.captionSettings,"nonVisibleOpacity"),this.settings.captionSettings.nonVisibleOpacity<0||1<this.settings.captionSettings.nonVisibleOpacity)throw"captionSettings.nonVisibleOpacity must be in the interval [0, 1]";if(this.checkOrConvertNumber(this.settings,"imagesAnimationDuration"),this.checkOrConvertNumber(this.settings,"refreshTime"),this.checkOrConvertNumber(this.settings,"refreshSensitivity"),"boolean"!==l.type(this.settings.randomize))throw"randomize must be a boolean";if("string"!==l.type(this.settings.selector))throw"selector must be a string";if(!1!==this.settings.sort&&!l.isFunction(this.settings.sort))throw"sort must be false or a comparison function";if(!1!==this.settings.filter&&!l.isFunction(this.settings.filter)&&"string"!==l.type(this.settings.filter))throw"filter must be false, a string or a filter function"},r.prototype.retrieveSuffixRanges=function(){var t=[];for(var i in this.settings.sizeRangeSuffixes)this.settings.sizeRangeSuffixes.hasOwnProperty(i)&&t.push(parseInt(i,10));return t.sort(function(t,i){return i<t?1:t<i?-1:0}),t},r.prototype.updateSettings=function(t){this.settings=l.extend({},this.settings,t),this.checkSettings(),this.border=0<=this.settings.border?this.settings.border:this.settings.margins,this.maxRowHeight=this.retrieveMaxRowHeight(),this.suffixRanges=this.retrieveSuffixRanges()},r.prototype.defaults={sizeRangeSuffixes:{},thumbnailPath:void 0,rowHeight:120,maxRowHeight:!1,maxRowsCount:0,margins:1,border:-1,lastRow:"nojustify",justifyThreshold:.9,waitThumbnailsLoad:!0,captions:!0,cssAnimation:!0,imagesAnimationDuration:500,captionSettings:{animationDuration:500,visibleOpacity:.7,nonVisibleOpacity:0},rel:null,target:null,extension:/\.[^.\\/]+$/,refreshTime:200,refreshSensitivity:0,randomize:!1,rtl:!1,sort:!1,filter:!1,selector:"a",imgSelector:"> img, > a > img, > svg, > a > svg",triggerEvent:function(t){this.$gallery.trigger(t)}},l.fn.justifiedGallery=function(n){return this.each(function(t,i){var e=l(i);e.addClass("justified-gallery");var s=e.data("jg.controller");if(void 0===s){if(null!=n&&"object"!==l.type(n)){if("destroy"===n)return;throw"The argument must be an object"}s=new r(e,l.extend({},r.prototype.defaults,n)),e.data("jg.controller",s)}else if("norewind"===n);else{if("destroy"===n)return void s.destroy();s.updateSettings(n),s.rewind()}s.updateEntries("norewind"===n)&&s.init()})}});
;
/*!
  * Bootstrap v5.0.0-beta1 (https://getbootstrap.com/)
  * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("@popperjs/core")):"function"==typeof define&&define.amd?define(["@popperjs/core"],e):(t="undefined"!=typeof globalThis?globalThis:t||self).bootstrap=e(t.Popper)}(this,(function(t){"use strict";function e(t){if(t&&t.__esModule)return t;var e=Object.create(null);return t&&Object.keys(t).forEach((function(n){if("default"!==n){var i=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,i.get?i:{enumerable:!0,get:function(){return t[n]}})}})),e.default=t,Object.freeze(e)}var n=e(t);function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function o(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}function s(){return(s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t}).apply(this,arguments)}function r(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e}var a,l,c=function(t){do{t+=Math.floor(1e6*Math.random())}while(document.getElementById(t));return t},u=function(t){var e=t.getAttribute("data-bs-target");if(!e||"#"===e){var n=t.getAttribute("href");e=n&&"#"!==n?n.trim():null}return e},d=function(t){var e=u(t);return e&&document.querySelector(e)?e:null},f=function(t){var e=u(t);return e?document.querySelector(e):null},h=function(t){if(!t)return 0;var e=window.getComputedStyle(t),n=e.transitionDuration,i=e.transitionDelay,o=Number.parseFloat(n),s=Number.parseFloat(i);return o||s?(n=n.split(",")[0],i=i.split(",")[0],1e3*(Number.parseFloat(n)+Number.parseFloat(i))):0},p=function(t){t.dispatchEvent(new Event("transitionend"))},g=function(t){return(t[0]||t).nodeType},m=function(t,e){var n=!1,i=e+5;t.addEventListener("transitionend",(function e(){n=!0,t.removeEventListener("transitionend",e)})),setTimeout((function(){n||p(t)}),i)},_=function(t,e,n){Object.keys(n).forEach((function(i){var o,s=n[i],r=e[i],a=r&&g(r)?"element":null==(o=r)?""+o:{}.toString.call(o).match(/\s([a-z]+)/i)[1].toLowerCase();if(!new RegExp(s).test(a))throw new Error(t.toUpperCase()+': Option "'+i+'" provided type "'+a+'" but expected type "'+s+'".')}))},v=function(t){if(!t)return!1;if(t.style&&t.parentNode&&t.parentNode.style){var e=getComputedStyle(t),n=getComputedStyle(t.parentNode);return"none"!==e.display&&"none"!==n.display&&"hidden"!==e.visibility}return!1},b=function(){return function(){}},y=function(t){return t.offsetHeight},w=function(){var t=window.jQuery;return t&&!document.body.hasAttribute("data-bs-no-jquery")?t:null},E=function(t){"loading"===document.readyState?document.addEventListener("DOMContentLoaded",t):t()},T="rtl"===document.documentElement.dir,k=(a={},l=1,{set:function(t,e,n){void 0===t.bsKey&&(t.bsKey={key:e,id:l},l++),a[t.bsKey.id]=n},get:function(t,e){if(!t||void 0===t.bsKey)return null;var n=t.bsKey;return n.key===e?a[n.id]:null},delete:function(t,e){if(void 0!==t.bsKey){var n=t.bsKey;n.key===e&&(delete a[n.id],delete t.bsKey)}}}),A=function(t,e,n){k.set(t,e,n)},L=function(t,e){return k.get(t,e)},C=function(t,e){k.delete(t,e)},D=/[^.]*(?=\..*)\.|.*/,S=/\..*/,N=/::\d+$/,O={},I=1,j={mouseenter:"mouseover",mouseleave:"mouseout"},P=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function x(t,e){return e&&e+"::"+I++||t.uidEvent||I++}function H(t){var e=x(t);return t.uidEvent=e,O[e]=O[e]||{},O[e]}function B(t,e,n){void 0===n&&(n=null);for(var i=Object.keys(t),o=0,s=i.length;o<s;o++){var r=t[i[o]];if(r.originalHandler===e&&r.delegationSelector===n)return r}return null}function M(t,e,n){var i="string"==typeof e,o=i?n:e,s=t.replace(S,""),r=j[s];return r&&(s=r),P.has(s)||(s=t),[i,o,s]}function R(t,e,n,i,o){if("string"==typeof e&&t){n||(n=i,i=null);var s=M(e,n,i),r=s[0],a=s[1],l=s[2],c=H(t),u=c[l]||(c[l]={}),d=B(u,a,r?n:null);if(d)d.oneOff=d.oneOff&&o;else{var f=x(a,e.replace(D,"")),h=r?function(t,e,n){return function i(o){for(var s=t.querySelectorAll(e),r=o.target;r&&r!==this;r=r.parentNode)for(var a=s.length;a--;)if(s[a]===r)return o.delegateTarget=r,i.oneOff&&Q.off(t,o.type,n),n.apply(r,[o]);return null}}(t,n,i):function(t,e){return function n(i){return i.delegateTarget=t,n.oneOff&&Q.off(t,i.type,e),e.apply(t,[i])}}(t,n);h.delegationSelector=r?n:null,h.originalHandler=a,h.oneOff=o,h.uidEvent=f,u[f]=h,t.addEventListener(l,h,r)}}}function K(t,e,n,i,o){var s=B(e[n],i,o);s&&(t.removeEventListener(n,s,Boolean(o)),delete e[n][s.uidEvent])}var Q={on:function(t,e,n,i){R(t,e,n,i,!1)},one:function(t,e,n,i){R(t,e,n,i,!0)},off:function(t,e,n,i){if("string"==typeof e&&t){var o=M(e,n,i),s=o[0],r=o[1],a=o[2],l=a!==e,c=H(t),u=e.startsWith(".");if(void 0===r){u&&Object.keys(c).forEach((function(n){!function(t,e,n,i){var o=e[n]||{};Object.keys(o).forEach((function(s){if(s.includes(i)){var r=o[s];K(t,e,n,r.originalHandler,r.delegationSelector)}}))}(t,c,n,e.slice(1))}));var d=c[a]||{};Object.keys(d).forEach((function(n){var i=n.replace(N,"");if(!l||e.includes(i)){var o=d[n];K(t,c,a,o.originalHandler,o.delegationSelector)}}))}else{if(!c||!c[a])return;K(t,c,a,r,s?n:null)}}},trigger:function(t,e,n){if("string"!=typeof e||!t)return null;var i,o=w(),s=e.replace(S,""),r=e!==s,a=P.has(s),l=!0,c=!0,u=!1,d=null;return r&&o&&(i=o.Event(e,n),o(t).trigger(i),l=!i.isPropagationStopped(),c=!i.isImmediatePropagationStopped(),u=i.isDefaultPrevented()),a?(d=document.createEvent("HTMLEvents")).initEvent(s,l,!0):d=new CustomEvent(e,{bubbles:l,cancelable:!0}),void 0!==n&&Object.keys(n).forEach((function(t){Object.defineProperty(d,t,{get:function(){return n[t]}})})),u&&d.preventDefault(),c&&t.dispatchEvent(d),d.defaultPrevented&&void 0!==i&&i.preventDefault(),d}},U=function(){function t(t){t&&(this._element=t,A(t,this.constructor.DATA_KEY,this))}return t.prototype.dispose=function(){C(this._element,this.constructor.DATA_KEY),this._element=null},t.getInstance=function(t){return L(t,this.DATA_KEY)},o(t,null,[{key:"VERSION",get:function(){return"5.0.0-beta1"}}]),t}(),W="alert",F=function(t){function e(){return t.apply(this,arguments)||this}r(e,t);var n=e.prototype;return n.close=function(t){var e=t?this._getRootElement(t):this._element,n=this._triggerCloseEvent(e);null===n||n.defaultPrevented||this._removeElement(e)},n._getRootElement=function(t){return f(t)||t.closest(".alert")},n._triggerCloseEvent=function(t){return Q.trigger(t,"close.bs.alert")},n._removeElement=function(t){var e=this;if(t.classList.remove("show"),t.classList.contains("fade")){var n=h(t);Q.one(t,"transitionend",(function(){return e._destroyElement(t)})),m(t,n)}else this._destroyElement(t)},n._destroyElement=function(t){t.parentNode&&t.parentNode.removeChild(t),Q.trigger(t,"closed.bs.alert")},e.jQueryInterface=function(t){return this.each((function(){var n=L(this,"bs.alert");n||(n=new e(this)),"close"===t&&n[t](this)}))},e.handleDismiss=function(t){return function(e){e&&e.preventDefault(),t.close(this)}},o(e,null,[{key:"DATA_KEY",get:function(){return"bs.alert"}}]),e}(U);Q.on(document,"click.bs.alert.data-api",'[data-bs-dismiss="alert"]',F.handleDismiss(new F)),E((function(){var t=w();if(t){var e=t.fn[W];t.fn[W]=F.jQueryInterface,t.fn[W].Constructor=F,t.fn[W].noConflict=function(){return t.fn[W]=e,F.jQueryInterface}}}));var Y=function(t){function e(){return t.apply(this,arguments)||this}return r(e,t),e.prototype.toggle=function(){this._element.setAttribute("aria-pressed",this._element.classList.toggle("active"))},e.jQueryInterface=function(t){return this.each((function(){var n=L(this,"bs.button");n||(n=new e(this)),"toggle"===t&&n[t]()}))},o(e,null,[{key:"DATA_KEY",get:function(){return"bs.button"}}]),e}(U);function z(t){return"true"===t||"false"!==t&&(t===Number(t).toString()?Number(t):""===t||"null"===t?null:t)}function X(t){return t.replace(/[A-Z]/g,(function(t){return"-"+t.toLowerCase()}))}Q.on(document,"click.bs.button.data-api",'[data-bs-toggle="button"]',(function(t){t.preventDefault();var e=t.target.closest('[data-bs-toggle="button"]'),n=L(e,"bs.button");n||(n=new Y(e)),n.toggle()})),E((function(){var t=w();if(t){var e=t.fn.button;t.fn.button=Y.jQueryInterface,t.fn.button.Constructor=Y,t.fn.button.noConflict=function(){return t.fn.button=e,Y.jQueryInterface}}}));var q={setDataAttribute:function(t,e,n){t.setAttribute("data-bs-"+X(e),n)},removeDataAttribute:function(t,e){t.removeAttribute("data-bs-"+X(e))},getDataAttributes:function(t){if(!t)return{};var e={};return Object.keys(t.dataset).filter((function(t){return t.startsWith("bs")})).forEach((function(n){var i=n.replace(/^bs/,"");i=i.charAt(0).toLowerCase()+i.slice(1,i.length),e[i]=z(t.dataset[n])})),e},getDataAttribute:function(t,e){return z(t.getAttribute("data-bs-"+X(e)))},offset:function(t){var e=t.getBoundingClientRect();return{top:e.top+document.body.scrollTop,left:e.left+document.body.scrollLeft}},position:function(t){return{top:t.offsetTop,left:t.offsetLeft}}},V={matches:function(t,e){return t.matches(e)},find:function(t,e){var n;return void 0===e&&(e=document.documentElement),(n=[]).concat.apply(n,Element.prototype.querySelectorAll.call(e,t))},findOne:function(t,e){return void 0===e&&(e=document.documentElement),Element.prototype.querySelector.call(e,t)},children:function(t,e){var n,i=(n=[]).concat.apply(n,t.children);return i.filter((function(t){return t.matches(e)}))},parents:function(t,e){for(var n=[],i=t.parentNode;i&&i.nodeType===Node.ELEMENT_NODE&&3!==i.nodeType;)this.matches(i,e)&&n.push(i),i=i.parentNode;return n},prev:function(t,e){for(var n=t.previousElementSibling;n;){if(n.matches(e))return[n];n=n.previousElementSibling}return[]},next:function(t,e){for(var n=t.nextElementSibling;n;){if(this.matches(n,e))return[n];n=n.nextElementSibling}return[]}},$="carousel",G=".bs.carousel",Z={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0,touch:!0},J={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean",touch:"boolean"},tt={TOUCH:"touch",PEN:"pen"},et=function(t){function e(e,n){var i;return(i=t.call(this,e)||this)._items=null,i._interval=null,i._activeElement=null,i._isPaused=!1,i._isSliding=!1,i.touchTimeout=null,i.touchStartX=0,i.touchDeltaX=0,i._config=i._getConfig(n),i._indicatorsElement=V.findOne(".carousel-indicators",i._element),i._touchSupported="ontouchstart"in document.documentElement||navigator.maxTouchPoints>0,i._pointerEvent=Boolean(window.PointerEvent),i._addEventListeners(),i}r(e,t);var n=e.prototype;return n.next=function(){this._isSliding||this._slide("next")},n.nextWhenVisible=function(){!document.hidden&&v(this._element)&&this.next()},n.prev=function(){this._isSliding||this._slide("prev")},n.pause=function(t){t||(this._isPaused=!0),V.findOne(".carousel-item-next, .carousel-item-prev",this._element)&&(p(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null},n.cycle=function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config&&this._config.interval&&!this._isPaused&&(this._updateInterval(),this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))},n.to=function(t){var e=this;this._activeElement=V.findOne(".active.carousel-item",this._element);var n=this._getItemIndex(this._activeElement);if(!(t>this._items.length-1||t<0))if(this._isSliding)Q.one(this._element,"slid.bs.carousel",(function(){return e.to(t)}));else{if(n===t)return this.pause(),void this.cycle();var i=t>n?"next":"prev";this._slide(i,this._items[t])}},n.dispose=function(){t.prototype.dispose.call(this),Q.off(this._element,G),this._items=null,this._config=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null},n._getConfig=function(t){return t=s({},Z,t),_($,t,J),t},n._handleSwipe=function(){var t=Math.abs(this.touchDeltaX);if(!(t<=40)){var e=t/this.touchDeltaX;this.touchDeltaX=0,e>0&&this.prev(),e<0&&this.next()}},n._addEventListeners=function(){var t=this;this._config.keyboard&&Q.on(this._element,"keydown.bs.carousel",(function(e){return t._keydown(e)})),"hover"===this._config.pause&&(Q.on(this._element,"mouseenter.bs.carousel",(function(e){return t.pause(e)})),Q.on(this._element,"mouseleave.bs.carousel",(function(e){return t.cycle(e)}))),this._config.touch&&this._touchSupported&&this._addTouchEventListeners()},n._addTouchEventListeners=function(){var t=this,e=function(e){t._pointerEvent&&tt[e.pointerType.toUpperCase()]?t.touchStartX=e.clientX:t._pointerEvent||(t.touchStartX=e.touches[0].clientX)},n=function(e){t._pointerEvent&&tt[e.pointerType.toUpperCase()]&&(t.touchDeltaX=e.clientX-t.touchStartX),t._handleSwipe(),"hover"===t._config.pause&&(t.pause(),t.touchTimeout&&clearTimeout(t.touchTimeout),t.touchTimeout=setTimeout((function(e){return t.cycle(e)}),500+t._config.interval))};V.find(".carousel-item img",this._element).forEach((function(t){Q.on(t,"dragstart.bs.carousel",(function(t){return t.preventDefault()}))})),this._pointerEvent?(Q.on(this._element,"pointerdown.bs.carousel",(function(t){return e(t)})),Q.on(this._element,"pointerup.bs.carousel",(function(t){return n(t)})),this._element.classList.add("pointer-event")):(Q.on(this._element,"touchstart.bs.carousel",(function(t){return e(t)})),Q.on(this._element,"touchmove.bs.carousel",(function(e){return function(e){e.touches&&e.touches.length>1?t.touchDeltaX=0:t.touchDeltaX=e.touches[0].clientX-t.touchStartX}(e)})),Q.on(this._element,"touchend.bs.carousel",(function(t){return n(t)})))},n._keydown=function(t){if(!/input|textarea/i.test(t.target.tagName))switch(t.key){case"ArrowLeft":t.preventDefault(),this.prev();break;case"ArrowRight":t.preventDefault(),this.next()}},n._getItemIndex=function(t){return this._items=t&&t.parentNode?V.find(".carousel-item",t.parentNode):[],this._items.indexOf(t)},n._getItemByDirection=function(t,e){var n="next"===t,i="prev"===t,o=this._getItemIndex(e),s=this._items.length-1;if((i&&0===o||n&&o===s)&&!this._config.wrap)return e;var r=(o+("prev"===t?-1:1))%this._items.length;return-1===r?this._items[this._items.length-1]:this._items[r]},n._triggerSlideEvent=function(t,e){var n=this._getItemIndex(t),i=this._getItemIndex(V.findOne(".active.carousel-item",this._element));return Q.trigger(this._element,"slide.bs.carousel",{relatedTarget:t,direction:e,from:i,to:n})},n._setActiveIndicatorElement=function(t){if(this._indicatorsElement){for(var e=V.find(".active",this._indicatorsElement),n=0;n<e.length;n++)e[n].classList.remove("active");var i=this._indicatorsElement.children[this._getItemIndex(t)];i&&i.classList.add("active")}},n._updateInterval=function(){var t=this._activeElement||V.findOne(".active.carousel-item",this._element);if(t){var e=Number.parseInt(t.getAttribute("data-bs-interval"),10);e?(this._config.defaultInterval=this._config.defaultInterval||this._config.interval,this._config.interval=e):this._config.interval=this._config.defaultInterval||this._config.interval}},n._slide=function(t,e){var n,i,o,s=this,r=V.findOne(".active.carousel-item",this._element),a=this._getItemIndex(r),l=e||r&&this._getItemByDirection(t,r),c=this._getItemIndex(l),u=Boolean(this._interval);if("next"===t?(n="carousel-item-start",i="carousel-item-next",o="left"):(n="carousel-item-end",i="carousel-item-prev",o="right"),l&&l.classList.contains("active"))this._isSliding=!1;else if(!this._triggerSlideEvent(l,o).defaultPrevented&&r&&l){if(this._isSliding=!0,u&&this.pause(),this._setActiveIndicatorElement(l),this._activeElement=l,this._element.classList.contains("slide")){l.classList.add(i),y(l),r.classList.add(n),l.classList.add(n);var d=h(r);Q.one(r,"transitionend",(function(){l.classList.remove(n,i),l.classList.add("active"),r.classList.remove("active",i,n),s._isSliding=!1,setTimeout((function(){Q.trigger(s._element,"slid.bs.carousel",{relatedTarget:l,direction:o,from:a,to:c})}),0)})),m(r,d)}else r.classList.remove("active"),l.classList.add("active"),this._isSliding=!1,Q.trigger(this._element,"slid.bs.carousel",{relatedTarget:l,direction:o,from:a,to:c});u&&this.cycle()}},e.carouselInterface=function(t,n){var i=L(t,"bs.carousel"),o=s({},Z,q.getDataAttributes(t));"object"==typeof n&&(o=s({},o,n));var r="string"==typeof n?n:o.slide;if(i||(i=new e(t,o)),"number"==typeof n)i.to(n);else if("string"==typeof r){if(void 0===i[r])throw new TypeError('No method named "'+r+'"');i[r]()}else o.interval&&o.ride&&(i.pause(),i.cycle())},e.jQueryInterface=function(t){return this.each((function(){e.carouselInterface(this,t)}))},e.dataApiClickHandler=function(t){var n=f(this);if(n&&n.classList.contains("carousel")){var i=s({},q.getDataAttributes(n),q.getDataAttributes(this)),o=this.getAttribute("data-bs-slide-to");o&&(i.interval=!1),e.carouselInterface(n,i),o&&L(n,"bs.carousel").to(o),t.preventDefault()}},o(e,null,[{key:"Default",get:function(){return Z}},{key:"DATA_KEY",get:function(){return"bs.carousel"}}]),e}(U);Q.on(document,"click.bs.carousel.data-api","[data-bs-slide], [data-bs-slide-to]",et.dataApiClickHandler),Q.on(window,"load.bs.carousel.data-api",(function(){for(var t=V.find('[data-bs-ride="carousel"]'),e=0,n=t.length;e<n;e++)et.carouselInterface(t[e],L(t[e],"bs.carousel"))})),E((function(){var t=w();if(t){var e=t.fn[$];t.fn[$]=et.jQueryInterface,t.fn[$].Constructor=et,t.fn[$].noConflict=function(){return t.fn[$]=e,et.jQueryInterface}}}));var nt="collapse",it={toggle:!0,parent:""},ot={toggle:"boolean",parent:"(string|element)"},st=function(t){function e(e,n){var i;(i=t.call(this,e)||this)._isTransitioning=!1,i._config=i._getConfig(n),i._triggerArray=V.find('[data-bs-toggle="collapse"][href="#'+e.id+'"],[data-bs-toggle="collapse"][data-bs-target="#'+e.id+'"]');for(var o=V.find('[data-bs-toggle="collapse"]'),s=0,r=o.length;s<r;s++){var a=o[s],l=d(a),c=V.find(l).filter((function(t){return t===e}));null!==l&&c.length&&(i._selector=l,i._triggerArray.push(a))}return i._parent=i._config.parent?i._getParent():null,i._config.parent||i._addAriaAndCollapsedClass(i._element,i._triggerArray),i._config.toggle&&i.toggle(),i}r(e,t);var n=e.prototype;return n.toggle=function(){this._element.classList.contains("show")?this.hide():this.show()},n.show=function(){var t=this;if(!this._isTransitioning&&!this._element.classList.contains("show")){var n,i;this._parent&&0===(n=V.find(".show, .collapsing",this._parent).filter((function(e){return"string"==typeof t._config.parent?e.getAttribute("data-bs-parent")===t._config.parent:e.classList.contains("collapse")}))).length&&(n=null);var o=V.findOne(this._selector);if(n){var s=n.find((function(t){return o!==t}));if((i=s?L(s,"bs.collapse"):null)&&i._isTransitioning)return}if(!Q.trigger(this._element,"show.bs.collapse").defaultPrevented){n&&n.forEach((function(t){o!==t&&e.collapseInterface(t,"hide"),i||A(t,"bs.collapse",null)}));var r=this._getDimension();this._element.classList.remove("collapse"),this._element.classList.add("collapsing"),this._element.style[r]=0,this._triggerArray.length&&this._triggerArray.forEach((function(t){t.classList.remove("collapsed"),t.setAttribute("aria-expanded",!0)})),this.setTransitioning(!0);var a="scroll"+(r[0].toUpperCase()+r.slice(1)),l=h(this._element);Q.one(this._element,"transitionend",(function(){t._element.classList.remove("collapsing"),t._element.classList.add("collapse","show"),t._element.style[r]="",t.setTransitioning(!1),Q.trigger(t._element,"shown.bs.collapse")})),m(this._element,l),this._element.style[r]=this._element[a]+"px"}}},n.hide=function(){var t=this;if(!this._isTransitioning&&this._element.classList.contains("show")&&!Q.trigger(this._element,"hide.bs.collapse").defaultPrevented){var e=this._getDimension();this._element.style[e]=this._element.getBoundingClientRect()[e]+"px",y(this._element),this._element.classList.add("collapsing"),this._element.classList.remove("collapse","show");var n=this._triggerArray.length;if(n>0)for(var i=0;i<n;i++){var o=this._triggerArray[i],s=f(o);s&&!s.classList.contains("show")&&(o.classList.add("collapsed"),o.setAttribute("aria-expanded",!1))}this.setTransitioning(!0);this._element.style[e]="";var r=h(this._element);Q.one(this._element,"transitionend",(function(){t.setTransitioning(!1),t._element.classList.remove("collapsing"),t._element.classList.add("collapse"),Q.trigger(t._element,"hidden.bs.collapse")})),m(this._element,r)}},n.setTransitioning=function(t){this._isTransitioning=t},n.dispose=function(){t.prototype.dispose.call(this),this._config=null,this._parent=null,this._triggerArray=null,this._isTransitioning=null},n._getConfig=function(t){return(t=s({},it,t)).toggle=Boolean(t.toggle),_(nt,t,ot),t},n._getDimension=function(){return this._element.classList.contains("width")?"width":"height"},n._getParent=function(){var t=this,e=this._config.parent;g(e)?void 0===e.jquery&&void 0===e[0]||(e=e[0]):e=V.findOne(e);var n='[data-bs-toggle="collapse"][data-bs-parent="'+e+'"]';return V.find(n,e).forEach((function(e){var n=f(e);t._addAriaAndCollapsedClass(n,[e])})),e},n._addAriaAndCollapsedClass=function(t,e){if(t&&e.length){var n=t.classList.contains("show");e.forEach((function(t){n?t.classList.remove("collapsed"):t.classList.add("collapsed"),t.setAttribute("aria-expanded",n)}))}},e.collapseInterface=function(t,n){var i=L(t,"bs.collapse"),o=s({},it,q.getDataAttributes(t),"object"==typeof n&&n?n:{});if(!i&&o.toggle&&"string"==typeof n&&/show|hide/.test(n)&&(o.toggle=!1),i||(i=new e(t,o)),"string"==typeof n){if(void 0===i[n])throw new TypeError('No method named "'+n+'"');i[n]()}},e.jQueryInterface=function(t){return this.each((function(){e.collapseInterface(this,t)}))},o(e,null,[{key:"Default",get:function(){return it}},{key:"DATA_KEY",get:function(){return"bs.collapse"}}]),e}(U);Q.on(document,"click.bs.collapse.data-api",'[data-bs-toggle="collapse"]',(function(t){"A"===t.target.tagName&&t.preventDefault();var e=q.getDataAttributes(this),n=d(this);V.find(n).forEach((function(t){var n,i=L(t,"bs.collapse");i?(null===i._parent&&"string"==typeof e.parent&&(i._config.parent=e.parent,i._parent=i._getParent()),n="toggle"):n=e,st.collapseInterface(t,n)}))})),E((function(){var t=w();if(t){var e=t.fn[nt];t.fn[nt]=st.jQueryInterface,t.fn[nt].Constructor=st,t.fn[nt].noConflict=function(){return t.fn[nt]=e,st.jQueryInterface}}}));var rt="dropdown",at=new RegExp("ArrowUp|ArrowDown|Escape"),lt=T?"top-end":"top-start",ct=T?"top-start":"top-end",ut=T?"bottom-end":"bottom-start",dt=T?"bottom-start":"bottom-end",ft=T?"left-start":"right-start",ht=T?"right-start":"left-start",pt={offset:0,flip:!0,boundary:"clippingParents",reference:"toggle",display:"dynamic",popperConfig:null},gt={offset:"(number|string|function)",flip:"boolean",boundary:"(string|element)",reference:"(string|element)",display:"string",popperConfig:"(null|object)"},mt=function(e){function i(t,n){var i;return(i=e.call(this,t)||this)._popper=null,i._config=i._getConfig(n),i._menu=i._getMenuElement(),i._inNavbar=i._detectNavbar(),i._addEventListeners(),i}r(i,e);var a=i.prototype;return a.toggle=function(){if(!this._element.disabled&&!this._element.classList.contains("disabled")){var t=this._element.classList.contains("show");i.clearMenus(),t||this.show()}},a.show=function(){if(!(this._element.disabled||this._element.classList.contains("disabled")||this._menu.classList.contains("show"))){var e=i.getParentFromElement(this._element),o={relatedTarget:this._element};if(!Q.trigger(this._element,"show.bs.dropdown",o).defaultPrevented){if(!this._inNavbar){if(void 0===n)throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");var s=this._element;"parent"===this._config.reference?s=e:g(this._config.reference)&&(s=this._config.reference,void 0!==this._config.reference.jquery&&(s=this._config.reference[0])),this._popper=t.createPopper(s,this._menu,this._getPopperConfig())}var r;if("ontouchstart"in document.documentElement&&!e.closest(".navbar-nav"))(r=[]).concat.apply(r,document.body.children).forEach((function(t){return Q.on(t,"mouseover",null,(function(){}))}));this._element.focus(),this._element.setAttribute("aria-expanded",!0),this._menu.classList.toggle("show"),this._element.classList.toggle("show"),Q.trigger(e,"shown.bs.dropdown",o)}}},a.hide=function(){if(!this._element.disabled&&!this._element.classList.contains("disabled")&&this._menu.classList.contains("show")){var t=i.getParentFromElement(this._element),e={relatedTarget:this._element};Q.trigger(t,"hide.bs.dropdown",e).defaultPrevented||(this._popper&&this._popper.destroy(),this._menu.classList.toggle("show"),this._element.classList.toggle("show"),Q.trigger(t,"hidden.bs.dropdown",e))}},a.dispose=function(){e.prototype.dispose.call(this),Q.off(this._element,".bs.dropdown"),this._menu=null,this._popper&&(this._popper.destroy(),this._popper=null)},a.update=function(){this._inNavbar=this._detectNavbar(),this._popper&&this._popper.update()},a._addEventListeners=function(){var t=this;Q.on(this._element,"click.bs.dropdown",(function(e){e.preventDefault(),e.stopPropagation(),t.toggle()}))},a._getConfig=function(t){return t=s({},this.constructor.Default,q.getDataAttributes(this._element),t),_(rt,t,this.constructor.DefaultType),t},a._getMenuElement=function(){return V.next(this._element,".dropdown-menu")[0]},a._getPlacement=function(){var t=this._element.parentNode;if(t.classList.contains("dropend"))return ft;if(t.classList.contains("dropstart"))return ht;var e="end"===getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();return t.classList.contains("dropup")?e?ct:lt:e?dt:ut},a._detectNavbar=function(){return null!==this._element.closest(".navbar")},a._getPopperConfig=function(){var t={placement:this._getPlacement(),modifiers:[{name:"preventOverflow",options:{altBoundary:this._config.flip,rootBoundary:this._config.boundary}}]};return"static"===this._config.display&&(t.modifiers=[{name:"applyStyles",enabled:!1}]),s({},t,this._config.popperConfig)},i.dropdownInterface=function(t,e){var n=L(t,"bs.dropdown");if(n||(n=new i(t,"object"==typeof e?e:null)),"string"==typeof e){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]()}},i.jQueryInterface=function(t){return this.each((function(){i.dropdownInterface(this,t)}))},i.clearMenus=function(t){if(!t||2!==t.button&&("keyup"!==t.type||"Tab"===t.key))for(var e=V.find('[data-bs-toggle="dropdown"]'),n=0,o=e.length;n<o;n++){var s=i.getParentFromElement(e[n]),r=L(e[n],"bs.dropdown"),a={relatedTarget:e[n]};if(t&&"click"===t.type&&(a.clickEvent=t),r){var l=r._menu;if(e[n].classList.contains("show"))if(!(t&&("click"===t.type&&/input|textarea/i.test(t.target.tagName)||"keyup"===t.type&&"Tab"===t.key)&&l.contains(t.target)))if(!Q.trigger(s,"hide.bs.dropdown",a).defaultPrevented){var c;if("ontouchstart"in document.documentElement)(c=[]).concat.apply(c,document.body.children).forEach((function(t){return Q.off(t,"mouseover",null,(function(){}))}));e[n].setAttribute("aria-expanded","false"),r._popper&&r._popper.destroy(),l.classList.remove("show"),e[n].classList.remove("show"),Q.trigger(s,"hidden.bs.dropdown",a)}}}},i.getParentFromElement=function(t){return f(t)||t.parentNode},i.dataApiKeydownHandler=function(t){if(!(/input|textarea/i.test(t.target.tagName)?"Space"===t.key||"Escape"!==t.key&&("ArrowDown"!==t.key&&"ArrowUp"!==t.key||t.target.closest(".dropdown-menu")):!at.test(t.key))&&(t.preventDefault(),t.stopPropagation(),!this.disabled&&!this.classList.contains("disabled"))){var e=i.getParentFromElement(this),n=this.classList.contains("show");if("Escape"===t.key)return(this.matches('[data-bs-toggle="dropdown"]')?this:V.prev(this,'[data-bs-toggle="dropdown"]')[0]).focus(),void i.clearMenus();if(n&&"Space"!==t.key){var o=V.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",e).filter(v);if(o.length){var s=o.indexOf(t.target);"ArrowUp"===t.key&&s>0&&s--,"ArrowDown"===t.key&&s<o.length-1&&s++,o[s=-1===s?0:s].focus()}}else i.clearMenus()}},o(i,null,[{key:"Default",get:function(){return pt}},{key:"DefaultType",get:function(){return gt}},{key:"DATA_KEY",get:function(){return"bs.dropdown"}}]),i}(U);Q.on(document,"keydown.bs.dropdown.data-api",'[data-bs-toggle="dropdown"]',mt.dataApiKeydownHandler),Q.on(document,"keydown.bs.dropdown.data-api",".dropdown-menu",mt.dataApiKeydownHandler),Q.on(document,"click.bs.dropdown.data-api",mt.clearMenus),Q.on(document,"keyup.bs.dropdown.data-api",mt.clearMenus),Q.on(document,"click.bs.dropdown.data-api",'[data-bs-toggle="dropdown"]',(function(t){t.preventDefault(),t.stopPropagation(),mt.dropdownInterface(this,"toggle")})),Q.on(document,"click.bs.dropdown.data-api",".dropdown form",(function(t){return t.stopPropagation()})),E((function(){var t=w();if(t){var e=t.fn[rt];t.fn[rt]=mt.jQueryInterface,t.fn[rt].Constructor=mt,t.fn[rt].noConflict=function(){return t.fn[rt]=e,mt.jQueryInterface}}}));var _t={backdrop:!0,keyboard:!0,focus:!0},vt={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean"},bt=function(t){function e(e,n){var i;return(i=t.call(this,e)||this)._config=i._getConfig(n),i._dialog=V.findOne(".modal-dialog",e),i._backdrop=null,i._isShown=!1,i._isBodyOverflowing=!1,i._ignoreBackdropClick=!1,i._isTransitioning=!1,i._scrollbarWidth=0,i}r(e,t);var n=e.prototype;return n.toggle=function(t){return this._isShown?this.hide():this.show(t)},n.show=function(t){var e=this;if(!this._isShown&&!this._isTransitioning){this._element.classList.contains("fade")&&(this._isTransitioning=!0);var n=Q.trigger(this._element,"show.bs.modal",{relatedTarget:t});this._isShown||n.defaultPrevented||(this._isShown=!0,this._checkScrollbar(),this._setScrollbar(),this._adjustDialog(),this._setEscapeEvent(),this._setResizeEvent(),Q.on(this._element,"click.dismiss.bs.modal",'[data-bs-dismiss="modal"]',(function(t){return e.hide(t)})),Q.on(this._dialog,"mousedown.dismiss.bs.modal",(function(){Q.one(e._element,"mouseup.dismiss.bs.modal",(function(t){t.target===e._element&&(e._ignoreBackdropClick=!0)}))})),this._showBackdrop((function(){return e._showElement(t)})))}},n.hide=function(t){var e=this;if((t&&t.preventDefault(),this._isShown&&!this._isTransitioning)&&!Q.trigger(this._element,"hide.bs.modal").defaultPrevented){this._isShown=!1;var n=this._element.classList.contains("fade");if(n&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),Q.off(document,"focusin.bs.modal"),this._element.classList.remove("show"),Q.off(this._element,"click.dismiss.bs.modal"),Q.off(this._dialog,"mousedown.dismiss.bs.modal"),n){var i=h(this._element);Q.one(this._element,"transitionend",(function(t){return e._hideModal(t)})),m(this._element,i)}else this._hideModal()}},n.dispose=function(){[window,this._element,this._dialog].forEach((function(t){return Q.off(t,".bs.modal")})),t.prototype.dispose.call(this),Q.off(document,"focusin.bs.modal"),this._config=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._isTransitioning=null,this._scrollbarWidth=null},n.handleUpdate=function(){this._adjustDialog()},n._getConfig=function(t){return t=s({},_t,t),_("modal",t,vt),t},n._showElement=function(t){var e=this,n=this._element.classList.contains("fade"),i=V.findOne(".modal-body",this._dialog);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.scrollTop=0,i&&(i.scrollTop=0),n&&y(this._element),this._element.classList.add("show"),this._config.focus&&this._enforceFocus();var o=function(){e._config.focus&&e._element.focus(),e._isTransitioning=!1,Q.trigger(e._element,"shown.bs.modal",{relatedTarget:t})};if(n){var s=h(this._dialog);Q.one(this._dialog,"transitionend",o),m(this._dialog,s)}else o()},n._enforceFocus=function(){var t=this;Q.off(document,"focusin.bs.modal"),Q.on(document,"focusin.bs.modal",(function(e){document===e.target||t._element===e.target||t._element.contains(e.target)||t._element.focus()}))},n._setEscapeEvent=function(){var t=this;this._isShown?Q.on(this._element,"keydown.dismiss.bs.modal",(function(e){t._config.keyboard&&"Escape"===e.key?(e.preventDefault(),t.hide()):t._config.keyboard||"Escape"!==e.key||t._triggerBackdropTransition()})):Q.off(this._element,"keydown.dismiss.bs.modal")},n._setResizeEvent=function(){var t=this;this._isShown?Q.on(window,"resize.bs.modal",(function(){return t._adjustDialog()})):Q.off(window,"resize.bs.modal")},n._hideModal=function(){var t=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._showBackdrop((function(){document.body.classList.remove("modal-open"),t._resetAdjustments(),t._resetScrollbar(),Q.trigger(t._element,"hidden.bs.modal")}))},n._removeBackdrop=function(){this._backdrop.parentNode.removeChild(this._backdrop),this._backdrop=null},n._showBackdrop=function(t){var e=this,n=this._element.classList.contains("fade")?"fade":"";if(this._isShown&&this._config.backdrop){if(this._backdrop=document.createElement("div"),this._backdrop.className="modal-backdrop",n&&this._backdrop.classList.add(n),document.body.appendChild(this._backdrop),Q.on(this._element,"click.dismiss.bs.modal",(function(t){e._ignoreBackdropClick?e._ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"===e._config.backdrop?e._triggerBackdropTransition():e.hide())})),n&&y(this._backdrop),this._backdrop.classList.add("show"),!n)return void t();var i=h(this._backdrop);Q.one(this._backdrop,"transitionend",t),m(this._backdrop,i)}else if(!this._isShown&&this._backdrop){this._backdrop.classList.remove("show");var o=function(){e._removeBackdrop(),t()};if(this._element.classList.contains("fade")){var s=h(this._backdrop);Q.one(this._backdrop,"transitionend",o),m(this._backdrop,s)}else o()}else t()},n._triggerBackdropTransition=function(){var t=this;if(!Q.trigger(this._element,"hidePrevented.bs.modal").defaultPrevented){var e=this._element.scrollHeight>document.documentElement.clientHeight;e||(this._element.style.overflowY="hidden"),this._element.classList.add("modal-static");var n=h(this._dialog);Q.off(this._element,"transitionend"),Q.one(this._element,"transitionend",(function(){t._element.classList.remove("modal-static"),e||(Q.one(t._element,"transitionend",(function(){t._element.style.overflowY=""})),m(t._element,n))})),m(this._element,n),this._element.focus()}},n._adjustDialog=function(){var t=this._element.scrollHeight>document.documentElement.clientHeight;(!this._isBodyOverflowing&&t&&!T||this._isBodyOverflowing&&!t&&T)&&(this._element.style.paddingLeft=this._scrollbarWidth+"px"),(this._isBodyOverflowing&&!t&&!T||!this._isBodyOverflowing&&t&&T)&&(this._element.style.paddingRight=this._scrollbarWidth+"px")},n._resetAdjustments=function(){this._element.style.paddingLeft="",this._element.style.paddingRight=""},n._checkScrollbar=function(){var t=document.body.getBoundingClientRect();this._isBodyOverflowing=Math.round(t.left+t.right)<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth()},n._setScrollbar=function(){var t=this;if(this._isBodyOverflowing){V.find(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top").forEach((function(e){var n=e.style.paddingRight,i=window.getComputedStyle(e)["padding-right"];q.setDataAttribute(e,"padding-right",n),e.style.paddingRight=Number.parseFloat(i)+t._scrollbarWidth+"px"})),V.find(".sticky-top").forEach((function(e){var n=e.style.marginRight,i=window.getComputedStyle(e)["margin-right"];q.setDataAttribute(e,"margin-right",n),e.style.marginRight=Number.parseFloat(i)-t._scrollbarWidth+"px"}));var e=document.body.style.paddingRight,n=window.getComputedStyle(document.body)["padding-right"];q.setDataAttribute(document.body,"padding-right",e),document.body.style.paddingRight=Number.parseFloat(n)+this._scrollbarWidth+"px"}document.body.classList.add("modal-open")},n._resetScrollbar=function(){V.find(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top").forEach((function(t){var e=q.getDataAttribute(t,"padding-right");void 0!==e&&(q.removeDataAttribute(t,"padding-right"),t.style.paddingRight=e)})),V.find(".sticky-top").forEach((function(t){var e=q.getDataAttribute(t,"margin-right");void 0!==e&&(q.removeDataAttribute(t,"margin-right"),t.style.marginRight=e)}));var t=q.getDataAttribute(document.body,"padding-right");void 0===t?document.body.style.paddingRight="":(q.removeDataAttribute(document.body,"padding-right"),document.body.style.paddingRight=t)},n._getScrollbarWidth=function(){var t=document.createElement("div");t.className="modal-scrollbar-measure",document.body.appendChild(t);var e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e},e.jQueryInterface=function(t,n){return this.each((function(){var i=L(this,"bs.modal"),o=s({},_t,q.getDataAttributes(this),"object"==typeof t&&t?t:{});if(i||(i=new e(this,o)),"string"==typeof t){if(void 0===i[t])throw new TypeError('No method named "'+t+'"');i[t](n)}}))},o(e,null,[{key:"Default",get:function(){return _t}},{key:"DATA_KEY",get:function(){return"bs.modal"}}]),e}(U);Q.on(document,"click.bs.modal.data-api",'[data-bs-toggle="modal"]',(function(t){var e=this,n=f(this);"A"!==this.tagName&&"AREA"!==this.tagName||t.preventDefault(),Q.one(n,"show.bs.modal",(function(t){t.defaultPrevented||Q.one(n,"hidden.bs.modal",(function(){v(e)&&e.focus()}))}));var i=L(n,"bs.modal");if(!i){var o=s({},q.getDataAttributes(n),q.getDataAttributes(this));i=new bt(n,o)}i.show(this)})),E((function(){var t=w();if(t){var e=t.fn.modal;t.fn.modal=bt.jQueryInterface,t.fn.modal.Constructor=bt,t.fn.modal.noConflict=function(){return t.fn.modal=e,bt.jQueryInterface}}}));var yt=new Set(["background","cite","href","itemtype","longdesc","poster","src","xlink:href"]),wt=/^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/gi,Et=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i,Tt={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]};function kt(t,e,n){var i;if(!t.length)return t;if(n&&"function"==typeof n)return n(t);for(var o=(new window.DOMParser).parseFromString(t,"text/html"),s=Object.keys(e),r=(i=[]).concat.apply(i,o.body.querySelectorAll("*")),a=function(t,n){var i,o=r[t],a=o.nodeName.toLowerCase();if(!s.includes(a))return o.parentNode.removeChild(o),"continue";var l=(i=[]).concat.apply(i,o.attributes),c=[].concat(e["*"]||[],e[a]||[]);l.forEach((function(t){(function(t,e){var n=t.nodeName.toLowerCase();if(e.includes(n))return!yt.has(n)||Boolean(t.nodeValue.match(wt)||t.nodeValue.match(Et));for(var i=e.filter((function(t){return t instanceof RegExp})),o=0,s=i.length;o<s;o++)if(n.match(i[o]))return!0;return!1})(t,c)||o.removeAttribute(t.nodeName)}))},l=0,c=r.length;l<c;l++)a(l);return o.body.innerHTML}var At="tooltip",Lt=new RegExp("(^|\\s)bs-tooltip\\S+","g"),Ct=new Set(["sanitize","allowList","sanitizeFn"]),Dt={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",container:"(string|element|boolean)",fallbackPlacements:"(null|array)",boundary:"(string|element)",customClass:"(string|function)",sanitize:"boolean",sanitizeFn:"(null|function)",allowList:"object",popperConfig:"(null|object)"},St={AUTO:"auto",TOP:"top",RIGHT:T?"left":"right",BOTTOM:"bottom",LEFT:T?"right":"left"},Nt={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",container:!1,fallbackPlacements:null,boundary:"clippingParents",customClass:"",sanitize:!0,sanitizeFn:null,allowList:Tt,popperConfig:null},Ot={HIDE:"hide.bs.tooltip",HIDDEN:"hidden.bs.tooltip",SHOW:"show.bs.tooltip",SHOWN:"shown.bs.tooltip",INSERTED:"inserted.bs.tooltip",CLICK:"click.bs.tooltip",FOCUSIN:"focusin.bs.tooltip",FOCUSOUT:"focusout.bs.tooltip",MOUSEENTER:"mouseenter.bs.tooltip",MOUSELEAVE:"mouseleave.bs.tooltip"},It=function(e){function i(t,i){var o;if(void 0===n)throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");return(o=e.call(this,t)||this)._isEnabled=!0,o._timeout=0,o._hoverState="",o._activeTrigger={},o._popper=null,o.config=o._getConfig(i),o.tip=null,o._setListeners(),o}r(i,e);var a=i.prototype;return a.enable=function(){this._isEnabled=!0},a.disable=function(){this._isEnabled=!1},a.toggleEnabled=function(){this._isEnabled=!this._isEnabled},a.toggle=function(t){if(this._isEnabled)if(t){var e=this.constructor.DATA_KEY,n=L(t.delegateTarget,e);n||(n=new this.constructor(t.delegateTarget,this._getDelegateConfig()),A(t.delegateTarget,e,n)),n._activeTrigger.click=!n._activeTrigger.click,n._isWithActiveTrigger()?n._enter(null,n):n._leave(null,n)}else{if(this.getTipElement().classList.contains("show"))return void this._leave(null,this);this._enter(null,this)}},a.dispose=function(){clearTimeout(this._timeout),Q.off(this._element,this.constructor.EVENT_KEY),Q.off(this._element.closest(".modal"),"hide.bs.modal",this._hideModalHandler),this.tip&&this.tip.parentNode.removeChild(this.tip),this._isEnabled=null,this._timeout=null,this._hoverState=null,this._activeTrigger=null,this._popper&&this._popper.destroy(),this._popper=null,this.config=null,this.tip=null,e.prototype.dispose.call(this)},a.show=function(){var e=this;if("none"===this._element.style.display)throw new Error("Please use show on visible elements");if(this.isWithContent()&&this._isEnabled){var n=Q.trigger(this._element,this.constructor.Event.SHOW),i=function t(e){if(!document.documentElement.attachShadow)return null;if("function"==typeof e.getRootNode){var n=e.getRootNode();return n instanceof ShadowRoot?n:null}return e instanceof ShadowRoot?e:e.parentNode?t(e.parentNode):null}(this._element),o=null===i?this._element.ownerDocument.documentElement.contains(this._element):i.contains(this._element);if(n.defaultPrevented||!o)return;var s=this.getTipElement(),r=c(this.constructor.NAME);s.setAttribute("id",r),this._element.setAttribute("aria-describedby",r),this.setContent(),this.config.animation&&s.classList.add("fade");var a="function"==typeof this.config.placement?this.config.placement.call(this,s,this._element):this.config.placement,l=this._getAttachment(a);this._addAttachmentClass(l);var u=this._getContainer();A(s,this.constructor.DATA_KEY,this),this._element.ownerDocument.documentElement.contains(this.tip)||u.appendChild(s),Q.trigger(this._element,this.constructor.Event.INSERTED),this._popper=t.createPopper(this._element,s,this._getPopperConfig(l)),s.classList.add("show");var d,f,p="function"==typeof this.config.customClass?this.config.customClass():this.config.customClass;if(p)(d=s.classList).add.apply(d,p.split(" "));if("ontouchstart"in document.documentElement)(f=[]).concat.apply(f,document.body.children).forEach((function(t){Q.on(t,"mouseover",(function(){}))}));var g=function(){var t=e._hoverState;e._hoverState=null,Q.trigger(e._element,e.constructor.Event.SHOWN),"out"===t&&e._leave(null,e)};if(this.tip.classList.contains("fade")){var _=h(this.tip);Q.one(this.tip,"transitionend",g),m(this.tip,_)}else g()}},a.hide=function(){var t=this;if(this._popper){var e=this.getTipElement(),n=function(){"show"!==t._hoverState&&e.parentNode&&e.parentNode.removeChild(e),t._cleanTipClass(),t._element.removeAttribute("aria-describedby"),Q.trigger(t._element,t.constructor.Event.HIDDEN),t._popper&&(t._popper.destroy(),t._popper=null)};if(!Q.trigger(this._element,this.constructor.Event.HIDE).defaultPrevented){var i;if(e.classList.remove("show"),"ontouchstart"in document.documentElement)(i=[]).concat.apply(i,document.body.children).forEach((function(t){return Q.off(t,"mouseover",b)}));if(this._activeTrigger.click=!1,this._activeTrigger.focus=!1,this._activeTrigger.hover=!1,this.tip.classList.contains("fade")){var o=h(e);Q.one(e,"transitionend",n),m(e,o)}else n();this._hoverState=""}}},a.update=function(){null!==this._popper&&this._popper.update()},a.isWithContent=function(){return Boolean(this.getTitle())},a.getTipElement=function(){if(this.tip)return this.tip;var t=document.createElement("div");return t.innerHTML=this.config.template,this.tip=t.children[0],this.tip},a.setContent=function(){var t=this.getTipElement();this.setElementContent(V.findOne(".tooltip-inner",t),this.getTitle()),t.classList.remove("fade","show")},a.setElementContent=function(t,e){if(null!==t)return"object"==typeof e&&g(e)?(e.jquery&&(e=e[0]),void(this.config.html?e.parentNode!==t&&(t.innerHTML="",t.appendChild(e)):t.textContent=e.textContent)):void(this.config.html?(this.config.sanitize&&(e=kt(e,this.config.allowList,this.config.sanitizeFn)),t.innerHTML=e):t.textContent=e)},a.getTitle=function(){var t=this._element.getAttribute("data-bs-original-title");return t||(t="function"==typeof this.config.title?this.config.title.call(this._element):this.config.title),t},a.updateAttachment=function(t){return"right"===t?"end":"left"===t?"start":t},a._getPopperConfig=function(t){var e=this,n={name:"flip",options:{altBoundary:!0}};return this.config.fallbackPlacements&&(n.options.fallbackPlacements=this.config.fallbackPlacements),s({},{placement:t,modifiers:[n,{name:"preventOverflow",options:{rootBoundary:this.config.boundary}},{name:"arrow",options:{element:"."+this.constructor.NAME+"-arrow"}},{name:"onChange",enabled:!0,phase:"afterWrite",fn:function(t){return e._handlePopperPlacementChange(t)}}],onFirstUpdate:function(t){t.options.placement!==t.placement&&e._handlePopperPlacementChange(t)}},this.config.popperConfig)},a._addAttachmentClass=function(t){this.getTipElement().classList.add("bs-tooltip-"+this.updateAttachment(t))},a._getContainer=function(){return!1===this.config.container?document.body:g(this.config.container)?this.config.container:V.findOne(this.config.container)},a._getAttachment=function(t){return St[t.toUpperCase()]},a._setListeners=function(){var t=this;this.config.trigger.split(" ").forEach((function(e){if("click"===e)Q.on(t._element,t.constructor.Event.CLICK,t.config.selector,(function(e){return t.toggle(e)}));else if("manual"!==e){var n="hover"===e?t.constructor.Event.MOUSEENTER:t.constructor.Event.FOCUSIN,i="hover"===e?t.constructor.Event.MOUSELEAVE:t.constructor.Event.FOCUSOUT;Q.on(t._element,n,t.config.selector,(function(e){return t._enter(e)})),Q.on(t._element,i,t.config.selector,(function(e){return t._leave(e)}))}})),this._hideModalHandler=function(){t._element&&t.hide()},Q.on(this._element.closest(".modal"),"hide.bs.modal",this._hideModalHandler),this.config.selector?this.config=s({},this.config,{trigger:"manual",selector:""}):this._fixTitle()},a._fixTitle=function(){var t=this._element.getAttribute("title"),e=typeof this._element.getAttribute("data-bs-original-title");(t||"string"!==e)&&(this._element.setAttribute("data-bs-original-title",t||""),!t||this._element.getAttribute("aria-label")||this._element.textContent||this._element.setAttribute("aria-label",t),this._element.setAttribute("title",""))},a._enter=function(t,e){var n=this.constructor.DATA_KEY;(e=e||L(t.delegateTarget,n))||(e=new this.constructor(t.delegateTarget,this._getDelegateConfig()),A(t.delegateTarget,n,e)),t&&(e._activeTrigger["focusin"===t.type?"focus":"hover"]=!0),e.getTipElement().classList.contains("show")||"show"===e._hoverState?e._hoverState="show":(clearTimeout(e._timeout),e._hoverState="show",e.config.delay&&e.config.delay.show?e._timeout=setTimeout((function(){"show"===e._hoverState&&e.show()}),e.config.delay.show):e.show())},a._leave=function(t,e){var n=this.constructor.DATA_KEY;(e=e||L(t.delegateTarget,n))||(e=new this.constructor(t.delegateTarget,this._getDelegateConfig()),A(t.delegateTarget,n,e)),t&&(e._activeTrigger["focusout"===t.type?"focus":"hover"]=!1),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState="out",e.config.delay&&e.config.delay.hide?e._timeout=setTimeout((function(){"out"===e._hoverState&&e.hide()}),e.config.delay.hide):e.hide())},a._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1},a._getConfig=function(t){var e=q.getDataAttributes(this._element);return Object.keys(e).forEach((function(t){Ct.has(t)&&delete e[t]})),t&&"object"==typeof t.container&&t.container.jquery&&(t.container=t.container[0]),"number"==typeof(t=s({},this.constructor.Default,e,"object"==typeof t&&t?t:{})).delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),_(At,t,this.constructor.DefaultType),t.sanitize&&(t.template=kt(t.template,t.allowList,t.sanitizeFn)),t},a._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},a._cleanTipClass=function(){var t=this.getTipElement(),e=t.getAttribute("class").match(Lt);null!==e&&e.length>0&&e.map((function(t){return t.trim()})).forEach((function(e){return t.classList.remove(e)}))},a._handlePopperPlacementChange=function(t){var e=t.state;e&&(this.tip=e.elements.popper,this._cleanTipClass(),this._addAttachmentClass(this._getAttachment(e.placement)))},i.jQueryInterface=function(t){return this.each((function(){var e=L(this,"bs.tooltip"),n="object"==typeof t&&t;if((e||!/dispose|hide/.test(t))&&(e||(e=new i(this,n)),"string"==typeof t)){if(void 0===e[t])throw new TypeError('No method named "'+t+'"');e[t]()}}))},o(i,null,[{key:"Default",get:function(){return Nt}},{key:"NAME",get:function(){return At}},{key:"DATA_KEY",get:function(){return"bs.tooltip"}},{key:"Event",get:function(){return Ot}},{key:"EVENT_KEY",get:function(){return".bs.tooltip"}},{key:"DefaultType",get:function(){return Dt}}]),i}(U);E((function(){var t=w();if(t){var e=t.fn[At];t.fn[At]=It.jQueryInterface,t.fn[At].Constructor=It,t.fn[At].noConflict=function(){return t.fn[At]=e,It.jQueryInterface}}}));var jt="popover",Pt=new RegExp("(^|\\s)bs-popover\\S+","g"),xt=s({},It.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),Ht=s({},It.DefaultType,{content:"(string|element|function)"}),Bt={HIDE:"hide.bs.popover",HIDDEN:"hidden.bs.popover",SHOW:"show.bs.popover",SHOWN:"shown.bs.popover",INSERTED:"inserted.bs.popover",CLICK:"click.bs.popover",FOCUSIN:"focusin.bs.popover",FOCUSOUT:"focusout.bs.popover",MOUSEENTER:"mouseenter.bs.popover",MOUSELEAVE:"mouseleave.bs.popover"},Mt=function(t){function e(){return t.apply(this,arguments)||this}r(e,t);var n=e.prototype;return n.isWithContent=function(){return this.getTitle()||this._getContent()},n.setContent=function(){var t=this.getTipElement();this.setElementContent(V.findOne(".popover-header",t),this.getTitle());var e=this._getContent();"function"==typeof e&&(e=e.call(this._element)),this.setElementContent(V.findOne(".popover-body",t),e),t.classList.remove("fade","show")},n._addAttachmentClass=function(t){this.getTipElement().classList.add("bs-popover-"+this.updateAttachment(t))},n._getContent=function(){return this._element.getAttribute("data-bs-content")||this.config.content},n._cleanTipClass=function(){var t=this.getTipElement(),e=t.getAttribute("class").match(Pt);null!==e&&e.length>0&&e.map((function(t){return t.trim()})).forEach((function(e){return t.classList.remove(e)}))},e.jQueryInterface=function(t){return this.each((function(){var n=L(this,"bs.popover"),i="object"==typeof t?t:null;if((n||!/dispose|hide/.test(t))&&(n||(n=new e(this,i),A(this,"bs.popover",n)),"string"==typeof t)){if(void 0===n[t])throw new TypeError('No method named "'+t+'"');n[t]()}}))},o(e,null,[{key:"Default",get:function(){return xt}},{key:"NAME",get:function(){return jt}},{key:"DATA_KEY",get:function(){return"bs.popover"}},{key:"Event",get:function(){return Bt}},{key:"EVENT_KEY",get:function(){return".bs.popover"}},{key:"DefaultType",get:function(){return Ht}}]),e}(It);E((function(){var t=w();if(t){var e=t.fn[jt];t.fn[jt]=Mt.jQueryInterface,t.fn[jt].Constructor=Mt,t.fn[jt].noConflict=function(){return t.fn[jt]=e,Mt.jQueryInterface}}}));var Rt="scrollspy",Kt={offset:10,method:"auto",target:""},Qt={offset:"number",method:"string",target:"(string|element)"},Ut=function(t){function e(e,n){var i;return(i=t.call(this,e)||this)._scrollElement="BODY"===e.tagName?window:e,i._config=i._getConfig(n),i._selector=i._config.target+" .nav-link, "+i._config.target+" .list-group-item, "+i._config.target+" .dropdown-item",i._offsets=[],i._targets=[],i._activeTarget=null,i._scrollHeight=0,Q.on(i._scrollElement,"scroll.bs.scrollspy",(function(t){return i._process(t)})),i.refresh(),i._process(),i}r(e,t);var n=e.prototype;return n.refresh=function(){var t=this,e=this._scrollElement===this._scrollElement.window?"offset":"position",n="auto"===this._config.method?e:this._config.method,i="position"===n?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),V.find(this._selector).map((function(t){var e=d(t),o=e?V.findOne(e):null;if(o){var s=o.getBoundingClientRect();if(s.width||s.height)return[q[n](o).top+i,e]}return null})).filter((function(t){return t})).sort((function(t,e){return t[0]-e[0]})).forEach((function(e){t._offsets.push(e[0]),t._targets.push(e[1])}))},n.dispose=function(){t.prototype.dispose.call(this),Q.off(this._scrollElement,".bs.scrollspy"),this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null},n._getConfig=function(t){if("string"!=typeof(t=s({},Kt,"object"==typeof t&&t?t:{})).target&&g(t.target)){var e=t.target.id;e||(e=c(Rt),t.target.id=e),t.target="#"+e}return _(Rt,t,Qt),t},n._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},n._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},n._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},n._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),t>=n){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i)}else{if(this._activeTarget&&t<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,void this._clear();for(var o=this._offsets.length;o--;){this._activeTarget!==this._targets[o]&&t>=this._offsets[o]&&(void 0===this._offsets[o+1]||t<this._offsets[o+1])&&this._activate(this._targets[o])}}},n._activate=function(t){this._activeTarget=t,this._clear();var e=this._selector.split(",").map((function(e){return e+'[data-bs-target="'+t+'"],'+e+'[href="'+t+'"]'})),n=V.findOne(e.join(","));n.classList.contains("dropdown-item")?(V.findOne(".dropdown-toggle",n.closest(".dropdown")).classList.add("active"),n.classList.add("active")):(n.classList.add("active"),V.parents(n,".nav, .list-group").forEach((function(t){V.prev(t,".nav-link, .list-group-item").forEach((function(t){return t.classList.add("active")})),V.prev(t,".nav-item").forEach((function(t){V.children(t,".nav-link").forEach((function(t){return t.classList.add("active")}))}))}))),Q.trigger(this._scrollElement,"activate.bs.scrollspy",{relatedTarget:t})},n._clear=function(){V.find(this._selector).filter((function(t){return t.classList.contains("active")})).forEach((function(t){return t.classList.remove("active")}))},e.jQueryInterface=function(t){return this.each((function(){var n=L(this,"bs.scrollspy");if(n||(n=new e(this,"object"==typeof t&&t)),"string"==typeof t){if(void 0===n[t])throw new TypeError('No method named "'+t+'"');n[t]()}}))},o(e,null,[{key:"Default",get:function(){return Kt}},{key:"DATA_KEY",get:function(){return"bs.scrollspy"}}]),e}(U);Q.on(window,"load.bs.scrollspy.data-api",(function(){V.find('[data-bs-spy="scroll"]').forEach((function(t){return new Ut(t,q.getDataAttributes(t))}))})),E((function(){var t=w();if(t){var e=t.fn[Rt];t.fn[Rt]=Ut.jQueryInterface,t.fn[Rt].Constructor=Ut,t.fn[Rt].noConflict=function(){return t.fn[Rt]=e,Ut.jQueryInterface}}}));var Wt=function(t){function e(){return t.apply(this,arguments)||this}r(e,t);var n=e.prototype;return n.show=function(){var t=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&this._element.classList.contains("active")||this._element.classList.contains("disabled"))){var e,n=f(this._element),i=this._element.closest(".nav, .list-group");if(i){var o="UL"===i.nodeName||"OL"===i.nodeName?":scope > li > .active":".active";e=(e=V.find(o,i))[e.length-1]}var s=null;if(e&&(s=Q.trigger(e,"hide.bs.tab",{relatedTarget:this._element})),!(Q.trigger(this._element,"show.bs.tab",{relatedTarget:e}).defaultPrevented||null!==s&&s.defaultPrevented)){this._activate(this._element,i);var r=function(){Q.trigger(e,"hidden.bs.tab",{relatedTarget:t._element}),Q.trigger(t._element,"shown.bs.tab",{relatedTarget:e})};n?this._activate(n,n.parentNode,r):r()}}},n._activate=function(t,e,n){var i=this,o=(!e||"UL"!==e.nodeName&&"OL"!==e.nodeName?V.children(e,".active"):V.find(":scope > li > .active",e))[0],s=n&&o&&o.classList.contains("fade"),r=function(){return i._transitionComplete(t,o,n)};if(o&&s){var a=h(o);o.classList.remove("show"),Q.one(o,"transitionend",r),m(o,a)}else r()},n._transitionComplete=function(t,e,n){if(e){e.classList.remove("active");var i=V.findOne(":scope > .dropdown-menu .active",e.parentNode);i&&i.classList.remove("active"),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!1)}(t.classList.add("active"),"tab"===t.getAttribute("role")&&t.setAttribute("aria-selected",!0),y(t),t.classList.contains("fade")&&t.classList.add("show"),t.parentNode&&t.parentNode.classList.contains("dropdown-menu"))&&(t.closest(".dropdown")&&V.find(".dropdown-toggle").forEach((function(t){return t.classList.add("active")})),t.setAttribute("aria-expanded",!0));n&&n()},e.jQueryInterface=function(t){return this.each((function(){var n=L(this,"bs.tab")||new e(this);if("string"==typeof t){if(void 0===n[t])throw new TypeError('No method named "'+t+'"');n[t]()}}))},o(e,null,[{key:"DATA_KEY",get:function(){return"bs.tab"}}]),e}(U);Q.on(document,"click.bs.tab.data-api",'[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',(function(t){t.preventDefault(),(L(this,"bs.tab")||new Wt(this)).show()})),E((function(){var t=w();if(t){var e=t.fn.tab;t.fn.tab=Wt.jQueryInterface,t.fn.tab.Constructor=Wt,t.fn.tab.noConflict=function(){return t.fn.tab=e,Wt.jQueryInterface}}}));var Ft={animation:"boolean",autohide:"boolean",delay:"number"},Yt={animation:!0,autohide:!0,delay:5e3},zt=function(t){function e(e,n){var i;return(i=t.call(this,e)||this)._config=i._getConfig(n),i._timeout=null,i._setListeners(),i}r(e,t);var n=e.prototype;return n.show=function(){var t=this;if(!Q.trigger(this._element,"show.bs.toast").defaultPrevented){this._clearTimeout(),this._config.animation&&this._element.classList.add("fade");var e=function(){t._element.classList.remove("showing"),t._element.classList.add("show"),Q.trigger(t._element,"shown.bs.toast"),t._config.autohide&&(t._timeout=setTimeout((function(){t.hide()}),t._config.delay))};if(this._element.classList.remove("hide"),y(this._element),this._element.classList.add("showing"),this._config.animation){var n=h(this._element);Q.one(this._element,"transitionend",e),m(this._element,n)}else e()}},n.hide=function(){var t=this;if(this._element.classList.contains("show")&&!Q.trigger(this._element,"hide.bs.toast").defaultPrevented){var e=function(){t._element.classList.add("hide"),Q.trigger(t._element,"hidden.bs.toast")};if(this._element.classList.remove("show"),this._config.animation){var n=h(this._element);Q.one(this._element,"transitionend",e),m(this._element,n)}else e()}},n.dispose=function(){this._clearTimeout(),this._element.classList.contains("show")&&this._element.classList.remove("show"),Q.off(this._element,"click.dismiss.bs.toast"),t.prototype.dispose.call(this),this._config=null},n._getConfig=function(t){return t=s({},Yt,q.getDataAttributes(this._element),"object"==typeof t&&t?t:{}),_("toast",t,this.constructor.DefaultType),t},n._setListeners=function(){var t=this;Q.on(this._element,"click.dismiss.bs.toast",'[data-bs-dismiss="toast"]',(function(){return t.hide()}))},n._clearTimeout=function(){clearTimeout(this._timeout),this._timeout=null},e.jQueryInterface=function(t){return this.each((function(){var n=L(this,"bs.toast");if(n||(n=new e(this,"object"==typeof t&&t)),"string"==typeof t){if(void 0===n[t])throw new TypeError('No method named "'+t+'"');n[t](this)}}))},o(e,null,[{key:"DefaultType",get:function(){return Ft}},{key:"Default",get:function(){return Yt}},{key:"DATA_KEY",get:function(){return"bs.toast"}}]),e}(U);return E((function(){var t=w();if(t){var e=t.fn.toast;t.fn.toast=zt.jQueryInterface,t.fn.toast.Constructor=zt,t.fn.toast.noConflict=function(){return t.fn.toast=e,zt.jQueryInterface}}})),{Alert:F,Button:Y,Carousel:et,Collapse:st,Dropdown:mt,Modal:bt,Popover:Mt,ScrollSpy:Ut,Tab:Wt,Toast:zt,Tooltip:It}}));
//# sourceMappingURL=bootstrap.min.js.map
;
"use strict";/*!instant.page v5.1.0 - (C) 2019-2020 Alexandre Dieulot - https://instant.page/license*/var mouseoverTimer;var lastTouchTimestamp;var prefetches=new Set();var prefetchElement=document.createElement('link');var isSupported=prefetchElement.relList&&prefetchElement.relList.supports&&prefetchElement.relList.supports('prefetch')&&window.IntersectionObserver&&'isIntersecting'in IntersectionObserverEntry.prototype;var allowQueryString=('instantAllowQueryString'in document.body.dataset);var allowExternalLinks=('instantAllowExternalLinks'in document.body.dataset);var useWhitelist=('instantWhitelist'in document.body.dataset);var mousedownShortcut=('instantMousedownShortcut'in document.body.dataset);var DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION=1111;var delayOnHover=65;var useMousedown=false;var useMousedownOnly=false;var useViewport=false;if('instantIntensity'in document.body.dataset){var intensity=document.body.dataset.instantIntensity;if(intensity.substr(0,'mousedown'.length)=='mousedown'){useMousedown=true;if(intensity=='mousedown-only'){useMousedownOnly=true;}}else if(intensity.substr(0,'viewport'.length)=='viewport'){if(!(navigator.connection&&(navigator.connection.saveData||navigator.connection.effectiveType&&navigator.connection.effectiveType.includes('2g')))){if(intensity=="viewport"){if(document.documentElement.clientWidth*document.documentElement.clientHeight<450000){useViewport=true;}}else if(intensity=="viewport-all"){useViewport=true;}}}else{var milliseconds=parseInt(intensity);if(!isNaN(milliseconds)){delayOnHover=milliseconds;}}}
if(isSupported){var eventListenersOptions={capture:true,passive:true};if(!useMousedownOnly){document.addEventListener('touchstart',touchstartListener,eventListenersOptions);}
if(!useMousedown){document.addEventListener('mouseover',mouseoverListener,eventListenersOptions);}else if(!mousedownShortcut){document.addEventListener('mousedown',mousedownListener,eventListenersOptions);}
if(mousedownShortcut){document.addEventListener('mousedown',mousedownShortcutListener,eventListenersOptions);}
if(useViewport){var triggeringFunction;if(window.requestIdleCallback){triggeringFunction=function triggeringFunction(callback){requestIdleCallback(callback,{timeout:1500});};}else{triggeringFunction=function triggeringFunction(callback){callback();};}
triggeringFunction(function(){var intersectionObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){var linkElement=entry.target;intersectionObserver.unobserve(linkElement);preload(linkElement.href);}});});document.querySelectorAll('a').forEach(function(linkElement){if(isPreloadable(linkElement)){intersectionObserver.observe(linkElement);}});});}}
function touchstartListener(event){lastTouchTimestamp=performance.now();var linkElement=event.target.closest('a');if(!isPreloadable(linkElement)){return;}
preload(linkElement.href);}
function mouseoverListener(event){if(performance.now()-lastTouchTimestamp<DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION){return;}
var linkElement=event.target.closest('a');if(!isPreloadable(linkElement)){return;}
linkElement.addEventListener('mouseout',mouseoutListener,{passive:true});mouseoverTimer=setTimeout(function(){preload(linkElement.href);mouseoverTimer=undefined;},delayOnHover);}
function mousedownListener(event){var linkElement=event.target.closest('a');if(!isPreloadable(linkElement)){return;}
preload(linkElement.href);}
function mouseoutListener(event){if(event.relatedTarget&&event.target.closest('a')==event.relatedTarget.closest('a')){return;}
if(mouseoverTimer){clearTimeout(mouseoverTimer);mouseoverTimer=undefined;}}
function mousedownShortcutListener(event){if(performance.now()-lastTouchTimestamp<DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION){return;}
var linkElement=event.target.closest('a');if(event.which>1||event.metaKey||event.ctrlKey){return;}
if(!linkElement){return;}
linkElement.addEventListener('click',function(event){if(event.detail==1337){return;}
event.preventDefault();},{capture:true,passive:false,once:true});var customEvent=new MouseEvent('click',{view:window,bubbles:true,cancelable:false,detail:1337});linkElement.dispatchEvent(customEvent);}
function isPreloadable(linkElement){if(!linkElement||!linkElement.href){return;}
if(useWhitelist&&!('instant'in linkElement.dataset)){return;}
if(!allowExternalLinks&&linkElement.origin!=location.origin&&!('instant'in linkElement.dataset)){return;}
if(!['http:','https:'].includes(linkElement.protocol)){return;}
if(linkElement.protocol=='http:'&&location.protocol=='https:'){return;}
if(!allowQueryString&&linkElement.search&&!('instant'in linkElement.dataset)){return;}
if(linkElement.hash&&linkElement.pathname+linkElement.search==location.pathname+location.search){return;}
if('noInstant'in linkElement.dataset){return;}
return true;}
function preload(url){if(prefetches.has(url)){return;}
var prefetcher=document.createElement('link');prefetcher.rel='prefetch';prefetcher.href=url;document.head.appendChild(prefetcher);prefetches.add(url);}
;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lightGallery = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    (function () {
        if (typeof window.CustomEvent === 'function')
            return false;
        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: null };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        window.CustomEvent = CustomEvent;
    })();
    (function () {
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.msMatchesSelector ||
                    Element.prototype.webkitMatchesSelector;
        }
    })();
    var lgQuery = /** @class */ (function () {
        function lgQuery(selector) {
            this.cssVenderPrefixes = [
                'TransitionDuration',
                'TransitionTimingFunction',
                'Transform',
                'Transition',
            ];
            this.selector = this._getSelector(selector);
            this.firstElement = this._getFirstEl();
            return this;
        }
        lgQuery.generateUUID = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };
        lgQuery.prototype._getSelector = function (selector, context) {
            if (context === void 0) { context = document; }
            if (typeof selector !== 'string') {
                return selector;
            }
            context = context || document;
            var fl = selector.substring(0, 1);
            if (fl === '#') {
                return context.querySelector(selector);
            }
            else {
                return context.querySelectorAll(selector);
            }
        };
        lgQuery.prototype._each = function (func) {
            if (!this.selector) {
                return this;
            }
            if (this.selector.length !== undefined) {
                [].forEach.call(this.selector, func);
            }
            else {
                func(this.selector, 0);
            }
            return this;
        };
        lgQuery.prototype._setCssVendorPrefix = function (el, cssProperty, value) {
            // prettier-ignore
            var property = cssProperty.replace(/-([a-z])/gi, function (s, group1) {
                return group1.toUpperCase();
            });
            if (this.cssVenderPrefixes.indexOf(property) !== -1) {
                el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
                el.style['webkit' + property] = value;
                el.style['moz' + property] = value;
                el.style['ms' + property] = value;
                el.style['o' + property] = value;
            }
            else {
                el.style[property] = value;
            }
        };
        lgQuery.prototype._getFirstEl = function () {
            if (this.selector && this.selector.length !== undefined) {
                return this.selector[0];
            }
            else {
                return this.selector;
            }
        };
        lgQuery.prototype.isEventMatched = function (event, eventName) {
            var eventNamespace = eventName.split('.');
            return event
                .split('.')
                .filter(function (e) { return e; })
                .every(function (e) {
                return eventNamespace.indexOf(e) !== -1;
            });
        };
        lgQuery.prototype.attr = function (attr, value) {
            if (value === undefined) {
                if (!this.firstElement) {
                    return '';
                }
                return this.firstElement.getAttribute(attr);
            }
            this._each(function (el) {
                el.setAttribute(attr, value);
            });
            return this;
        };
        lgQuery.prototype.find = function (selector) {
            return $LG(this._getSelector(selector, this.selector));
        };
        lgQuery.prototype.first = function () {
            if (this.selector && this.selector.length !== undefined) {
                return $LG(this.selector[0]);
            }
            else {
                return $LG(this.selector);
            }
        };
        lgQuery.prototype.eq = function (index) {
            return $LG(this.selector[index]);
        };
        lgQuery.prototype.parent = function () {
            return $LG(this.selector.parentElement);
        };
        lgQuery.prototype.get = function () {
            return this._getFirstEl();
        };
        lgQuery.prototype.removeAttr = function (attributes) {
            var attrs = attributes.split(' ');
            this._each(function (el) {
                attrs.forEach(function (attr) { return el.removeAttribute(attr); });
            });
            return this;
        };
        lgQuery.prototype.wrap = function (className) {
            if (!this.firstElement) {
                return this;
            }
            var wrapper = document.createElement('div');
            wrapper.className = className;
            this.firstElement.parentNode.insertBefore(wrapper, this.firstElement);
            this.firstElement.parentNode.removeChild(this.firstElement);
            wrapper.appendChild(this.firstElement);
            return this;
        };
        lgQuery.prototype.addClass = function (classNames) {
            if (classNames === void 0) { classNames = ''; }
            this._each(function (el) {
                // IE doesn't support multiple arguments
                classNames.split(' ').forEach(function (className) {
                    el.classList.add(className);
                });
            });
            return this;
        };
        lgQuery.prototype.removeClass = function (classNames) {
            this._each(function (el) {
                // IE doesn't support multiple arguments
                classNames.split(' ').forEach(function (className) {
                    el.classList.remove(className);
                });
            });
            return this;
        };
        lgQuery.prototype.hasClass = function (className) {
            if (!this.firstElement) {
                return false;
            }
            return this.firstElement.classList.contains(className);
        };
        lgQuery.prototype.hasAttribute = function (attribute) {
            if (!this.firstElement) {
                return false;
            }
            return this.firstElement.hasAttribute(attribute);
        };
        lgQuery.prototype.toggleClass = function (className) {
            if (!this.firstElement) {
                return this;
            }
            if (this.hasClass(className)) {
                this.removeClass(className);
            }
            else {
                this.addClass(className);
            }
            return this;
        };
        lgQuery.prototype.css = function (property, value) {
            var _this = this;
            this._each(function (el) {
                _this._setCssVendorPrefix(el, property, value);
            });
            return this;
        };
        // Need to pass separate namespaces for separate elements
        lgQuery.prototype.on = function (events, listener) {
            var _this = this;
            if (!this.selector) {
                return this;
            }
            events.split(' ').forEach(function (event) {
                if (!Array.isArray(lgQuery.eventListeners[event])) {
                    lgQuery.eventListeners[event] = [];
                }
                lgQuery.eventListeners[event].push(listener);
                _this.selector.addEventListener(event.split('.')[0], listener);
            });
            return this;
        };
        // @todo - test this
        lgQuery.prototype.once = function (event, listener) {
            var _this = this;
            this.on(event, function () {
                _this.off(event);
                listener(event);
            });
            return this;
        };
        lgQuery.prototype.off = function (event) {
            var _this = this;
            if (!this.selector) {
                return this;
            }
            Object.keys(lgQuery.eventListeners).forEach(function (eventName) {
                if (_this.isEventMatched(event, eventName)) {
                    lgQuery.eventListeners[eventName].forEach(function (listener) {
                        _this.selector.removeEventListener(eventName.split('.')[0], listener);
                    });
                    lgQuery.eventListeners[eventName] = [];
                }
            });
            return this;
        };
        lgQuery.prototype.trigger = function (event, detail) {
            if (!this.firstElement) {
                return this;
            }
            var customEvent = new CustomEvent(event.split('.')[0], {
                detail: detail || null,
            });
            this.firstElement.dispatchEvent(customEvent);
            return this;
        };
        // Does not support IE
        lgQuery.prototype.load = function (url) {
            var _this = this;
            fetch(url).then(function (res) {
                _this.selector.innerHTML = res;
            });
            return this;
        };
        lgQuery.prototype.html = function (html) {
            if (html === undefined) {
                if (!this.firstElement) {
                    return '';
                }
                return this.firstElement.innerHTML;
            }
            this._each(function (el) {
                el.innerHTML = html;
            });
            return this;
        };
        lgQuery.prototype.append = function (html) {
            this._each(function (el) {
                if (typeof html === 'string') {
                    el.insertAdjacentHTML('beforeend', html);
                }
                else {
                    el.appendChild(html);
                }
            });
            return this;
        };
        lgQuery.prototype.prepend = function (html) {
            this._each(function (el) {
                el.insertAdjacentHTML('afterbegin', html);
            });
            return this;
        };
        lgQuery.prototype.remove = function () {
            this._each(function (el) {
                el.parentNode.removeChild(el);
            });
            return this;
        };
        lgQuery.prototype.empty = function () {
            this._each(function (el) {
                el.innerHTML = '';
            });
            return this;
        };
        lgQuery.prototype.scrollTop = function (scrollTop) {
            if (scrollTop !== undefined) {
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                return this;
            }
            else {
                return (window.pageYOffset ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    0);
            }
        };
        lgQuery.prototype.scrollLeft = function (scrollLeft) {
            if (scrollLeft !== undefined) {
                document.body.scrollLeft = scrollLeft;
                document.documentElement.scrollLeft = scrollLeft;
                return this;
            }
            else {
                return (window.pageXOffset ||
                    document.documentElement.scrollLeft ||
                    document.body.scrollLeft ||
                    0);
            }
        };
        lgQuery.prototype.offset = function () {
            if (!this.firstElement) {
                return {
                    left: 0,
                    top: 0,
                };
            }
            var rect = this.firstElement.getBoundingClientRect();
            var bodyMarginLeft = $LG('body').style().marginLeft;
            // Minus body margin - https://stackoverflow.com/questions/30711548/is-getboundingclientrect-left-returning-a-wrong-value
            return {
                left: rect.left - parseFloat(bodyMarginLeft) + this.scrollLeft(),
                top: rect.top + this.scrollTop(),
            };
        };
        lgQuery.prototype.style = function () {
            if (!this.firstElement) {
                return {};
            }
            return (this.firstElement.currentStyle ||
                window.getComputedStyle(this.firstElement));
        };
        // Width without padding and border even if box-sizing is used.
        lgQuery.prototype.width = function () {
            var style = this.style();
            return (this.firstElement.clientWidth -
                parseFloat(style.paddingLeft) -
                parseFloat(style.paddingRight));
        };
        // Height without padding and border even if box-sizing is used.
        lgQuery.prototype.height = function () {
            var style = this.style();
            return (this.firstElement.clientHeight -
                parseFloat(style.paddingTop) -
                parseFloat(style.paddingBottom));
        };
        lgQuery.eventListeners = {};
        return lgQuery;
    }());
    function $LG(selector) {
        return new lgQuery(selector);
    }

    var defaultDynamicOptions = [
        'src',
        'sources',
        'subHtml',
        'subHtmlUrl',
        'html',
        'video',
        'poster',
        'slideName',
        'responsive',
        'srcset',
        'sizes',
        'iframe',
        'downloadUrl',
        'width',
        'facebookShareUrl',
        'tweetText',
        'iframeTitle',
        'twitterShareUrl',
        'pinterestShareUrl',
        'pinterestText',
        'fbHtml',
        'disqusIdentifier',
        'disqusUrl',
    ];
    // Convert html data-attribute to camalcase
    function convertToData(attr) {
        // FInd a way for lgsize
        if (attr === 'href') {
            return 'src';
        }
        attr = attr.replace('data-', '');
        attr = attr.charAt(0).toLowerCase() + attr.slice(1);
        attr = attr.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        return attr;
    }
    var utils = {
        /**
         * get possible width and height from the lgSize attribute. Used for ZoomFromOrigin option
         */
        getSize: function (el, container, spacing, defaultLgSize) {
            if (spacing === void 0) { spacing = 0; }
            var LGel = $LG(el);
            var lgSize = LGel.attr('data-lg-size') || defaultLgSize;
            if (!lgSize) {
                return;
            }
            var isResponsiveSizes = lgSize.split(',');
            // if at-least two viewport sizes are available
            if (isResponsiveSizes[1]) {
                var wWidth = window.innerWidth;
                for (var i = 0; i < isResponsiveSizes.length; i++) {
                    var size_1 = isResponsiveSizes[i];
                    var responsiveWidth = parseInt(size_1.split('-')[2], 10);
                    if (responsiveWidth > wWidth) {
                        lgSize = size_1;
                        break;
                    }
                    // take last item as last option
                    if (i === isResponsiveSizes.length - 1) {
                        lgSize = size_1;
                    }
                }
            }
            var size = lgSize.split('-');
            var width = parseInt(size[0], 10);
            var height = parseInt(size[1], 10);
            var cWidth = container.width();
            var cHeight = container.height() - spacing;
            var maxWidth = Math.min(cWidth, width);
            var maxHeight = Math.min(cHeight, height);
            var ratio = Math.min(maxWidth / width, maxHeight / height);
            return { width: width * ratio, height: height * ratio };
        },
        /**
         * @desc Get transform value based on the imageSize. Used for ZoomFromOrigin option
         * @param {jQuery Element}
         * @returns {String} Transform CSS string
         */
        getTransform: function (el, container, top, bottom, imageSize) {
            if (!imageSize) {
                return;
            }
            var LGel = $LG(el).find('img').first();
            var containerRect = container.get().getBoundingClientRect();
            var wWidth = containerRect.width;
            // using innerWidth to include mobile safari bottom bar
            var wHeight = container.height() - (top + bottom);
            var elWidth = LGel.width();
            var elHeight = LGel.height();
            var elStyle = LGel.style();
            var x = (wWidth - elWidth) / 2 -
                LGel.offset().left +
                (parseFloat(elStyle.paddingLeft) || 0) +
                (parseFloat(elStyle.borderLeft) || 0) +
                $LG(window).scrollLeft() +
                containerRect.left;
            var y = (wHeight - elHeight) / 2 -
                LGel.offset().top +
                (parseFloat(elStyle.paddingTop) || 0) +
                (parseFloat(elStyle.borderTop) || 0) +
                $LG(window).scrollTop() +
                top;
            var scX = elWidth / imageSize.width;
            var scY = elHeight / imageSize.height;
            var transform = 'translate3d(' +
                (x *= -1) +
                'px, ' +
                (y *= -1) +
                'px, 0) scale3d(' +
                scX +
                ', ' +
                scY +
                ', 1)';
            return transform;
        },
        getIframeMarkup: function (src, iframeWidth, iframeHeight, iframeTitle) {
            var title = iframeTitle ? 'title="' + iframeTitle + '"' : '';
            return "<div class=\"lg-video-cont lg-has-iframe\" style=\"width:" + iframeWidth + "; height: " + iframeHeight + "\">\n                    <iframe class=\"lg-object\" frameborder=\"0\" " + title + " src=\"" + src + "\"  allowfullscreen=\"true\"></iframe>\n                </div>";
        },
        getImgMarkup: function (index, src, altAttr, srcset, sizes, sources) {
            var srcsetAttr = srcset ? "srcset=" + srcset : '';
            var sizesAttr = sizes ? "sizes=" + sizes : '';
            var imgMarkup = "<img " + altAttr + " " + srcsetAttr + "  " + sizesAttr + " class=\"lg-object lg-image\" data-index=\"" + index + "\" src=\"" + src + "\" />";
            var sourceTag = '';
            if (sources) {
                var sourceObj = typeof sources === 'string' ? JSON.parse(sources) : sources;
                sourceTag = sourceObj.map(function (source) {
                    var attrs = '';
                    Object.keys(source).forEach(function (key) {
                        // Do not remove the first space as it is required to separate the attributes
                        attrs += " " + key + "=\"" + source[key] + "\"";
                    });
                    return "<source " + attrs + "></source>";
                });
            }
            return "" + sourceTag + imgMarkup;
        },
        // Get src from responsive src
        getResponsiveSrc: function (srcItms) {
            var rsWidth = [];
            var rsSrc = [];
            var src = '';
            for (var i = 0; i < srcItms.length; i++) {
                var _src = srcItms[i].split(' ');
                // Manage empty space
                if (_src[0] === '') {
                    _src.splice(0, 1);
                }
                rsSrc.push(_src[0]);
                rsWidth.push(_src[1]);
            }
            var wWidth = window.innerWidth;
            for (var j = 0; j < rsWidth.length; j++) {
                if (parseInt(rsWidth[j], 10) > wWidth) {
                    src = rsSrc[j];
                    break;
                }
            }
            return src;
        },
        isImageLoaded: function (img) {
            if (!img)
                return false;
            // During the onload event, IE correctly identifies any images that
            // weren’t downloaded as not complete. Others should too. Gecko-based
            // browsers act like NS4 in that they report this incorrectly.
            if (!img.complete) {
                return false;
            }
            // However, they do have two very useful properties: naturalWidth and
            // naturalHeight. These give the true size of the image. If it failed
            // to load, either of these should be zero.
            if (img.naturalWidth === 0) {
                return false;
            }
            // No other way of checking: assume it’s ok.
            return true;
        },
        getVideoPosterMarkup: function (_poster, dummyImg, videoContStyle, _isVideo) {
            var videoClass = '';
            if (_isVideo && _isVideo.youtube) {
                videoClass = 'lg-has-youtube';
            }
            else if (_isVideo && _isVideo.vimeo) {
                videoClass = 'lg-has-vimeo';
            }
            else {
                videoClass = 'lg-has-html5';
            }
            return "<div class=\"lg-video-cont " + videoClass + "\" style=\"" + videoContStyle + "\">\n                <div class=\"lg-video-play-button\">\n                <svg\n                    viewBox=\"0 0 20 20\"\n                    preserveAspectRatio=\"xMidYMid\"\n                    focusable=\"false\"\n                    aria-labelledby=\"Play video\"\n                    role=\"img\"\n                    class=\"lg-video-play-icon\"\n                >\n                    <title>Play video</title>\n                    <polygon class=\"lg-video-play-icon-inner\" points=\"1,0 20,10 1,20\"></polygon>\n                </svg>\n                <svg class=\"lg-video-play-icon-bg\" viewBox=\"0 0 50 50\" focusable=\"false\">\n                    <circle cx=\"50%\" cy=\"50%\" r=\"20\"></circle></svg>\n                <svg class=\"lg-video-play-icon-circle\" viewBox=\"0 0 50 50\" focusable=\"false\">\n                    <circle cx=\"50%\" cy=\"50%\" r=\"20\"></circle>\n                </svg>\n            </div>\n            " + (dummyImg || '') + "\n            <img class=\"lg-object lg-video-poster\" src=\"" + _poster + "\" />\n        </div>";
        },
        /**
         * @desc Create dynamic elements array from gallery items when dynamic option is false
         * It helps to avoid frequent DOM interaction
         * and avoid multiple checks for dynamic elments
         *
         * @returns {Array} dynamicEl
         */
        getDynamicOptions: function (items, extraProps, getCaptionFromTitleOrAlt, exThumbImage) {
            var dynamicElements = [];
            var availableDynamicOptions = __spreadArrays(defaultDynamicOptions, extraProps);
            [].forEach.call(items, function (item) {
                var dynamicEl = {};
                for (var i = 0; i < item.attributes.length; i++) {
                    var attr = item.attributes[i];
                    if (attr.specified) {
                        var dynamicAttr = convertToData(attr.name);
                        var label = '';
                        if (availableDynamicOptions.indexOf(dynamicAttr) > -1) {
                            label = dynamicAttr;
                        }
                        if (label) {
                            dynamicEl[label] = attr.value;
                        }
                    }
                }
                var currentItem = $LG(item);
                var alt = currentItem.find('img').first().attr('alt');
                var title = currentItem.attr('title');
                var thumb = exThumbImage
                    ? currentItem.attr(exThumbImage)
                    : currentItem.find('img').first().attr('src');
                dynamicEl.thumb = thumb;
                if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) {
                    dynamicEl.subHtml = title || alt || '';
                }
                dynamicEl.alt = alt || title || '';
                dynamicElements.push(dynamicEl);
            });
            return dynamicElements;
        },
        isMobile: function () {
            var isMobile = false;
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                    isMobile = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return isMobile;
        },
    };

    var lightGallerySettings = {
        mode: 'lg-slide',
        easing: 'ease',
        speed: 400,
        height: '100%',
        width: '100%',
        addClass: '',
        startClass: 'lg-start-zoom',
        backdropDuration: 300,
        container: document.body,
        startAnimationDuration: 400,
        zoomFromOrigin: true,
        hideBarsDelay: 0,
        showBarsAfter: 10000,
        slideDelay: 0,
        supportLegacyBrowser: true,
        allowMediaOverlap: false,
        videoMaxSize: '1280-720',
        defaultCaptionHeight: 0,
        ariaLabelledby: '',
        ariaDescribedby: '',
        closable: true,
        swipeToClose: true,
        closeOnTap: true,
        showCloseIcon: true,
        showMaximizeIcon: false,
        loop: true,
        escKey: true,
        keyPress: true,
        controls: true,
        slideEndAnimation: true,
        hideControlOnEnd: false,
        mousewheel: false,
        getCaptionFromTitleOrAlt: true,
        appendSubHtmlTo: '.lg-sub-html',
        subHtmlSelectorRelative: false,
        preload: 2,
        numberOfSlideItemsInDom: 10,
        showAfterLoad: true,
        selector: '',
        selectWithin: '',
        nextHtml: '',
        prevHtml: '',
        index: 0,
        iframeWidth: '100%',
        iframeHeight: '100%',
        download: true,
        counter: true,
        appendCounterTo: '.lg-toolbar',
        swipeThreshold: 50,
        enableSwipe: true,
        enableDrag: true,
        dynamic: false,
        dynamicEl: [],
        extraProps: [],
        galleryId: '1',
        customSlideName: false,
        exThumbImage: '',
        isMobile: undefined,
        mobileSettings: {
            controls: false,
            showCloseIcon: false,
            download: false,
        },
        plugins: [],
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
    };

    // @ref - https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
    // @ref - https://2ality.com/2017/04/setting-up-multi-platform-packages.html
    // Unique id for each gallery
    var lgId = 0;
    var LightGallery = /** @class */ (function () {
        function LightGallery(element, options) {
            if (options === void 0) { options = {}; }
            this.lgOpened = false;
            this.index = 0;
            // lightGallery modules
            this.plugins = [];
            // false when lightGallery load first slide content;
            this.lGalleryOn = false;
            // True when a slide animation is in progress
            this.lgBusy = false;
            this.currentItemsInDom = [];
            // Scroll top value before lightGallery is opened
            this.prevScrollTop = 0;
            this.isDummyImageRemoved = false;
            this.mediaContainerPosition = {
                top: 0,
                bottom: 0,
            };
            lgId++;
            this.lgId = lgId;
            this.el = element;
            this.LGel = $LG(element);
            // lightGallery settings
            this.settings = __assign(__assign({}, lightGallerySettings), options);
            if (this.settings.isMobile &&
                typeof this.settings.isMobile === 'function'
                ? this.settings.isMobile()
                : utils.isMobile()) {
                var mobileSettings = __assign(__assign({}, this.settings.mobileSettings), options.mobileSettings);
                this.settings = __assign(__assign({}, this.settings), mobileSettings);
            }
            // When using dynamic mode, ensure dynamicEl is an array
            if (this.settings.dynamic &&
                this.settings.dynamicEl !== undefined &&
                !Array.isArray(this.settings.dynamicEl)) {
                throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
            }
            if (this.settings.slideEndAnimation) {
                this.settings.hideControlOnEnd = false;
            }
            if (!this.settings.closable) {
                this.settings.swipeToClose = false;
            }
            // Need to disable zoomFromOrigin if gallery is opened from url (Hash plugin)
            // And reset it on close to get the correct value next time
            this.zoomFromOrigin = this.settings.zoomFromOrigin;
            // Gallery items
            this.galleryItems = this.getItems();
            // At the moment, Zoom from image doesn't support dynamic options
            // @todo add zoomFromOrigin support for dynamic images
            if (this.settings.dynamic) {
                this.zoomFromOrigin = false;
            }
            // settings.preload should not be grater than $item.length
            this.settings.preload = Math.min(this.settings.preload, this.galleryItems.length);
            this.init();
            return this;
        }
        LightGallery.prototype.init = function () {
            var _this = this;
            this.addSlideVideoInfo(this.galleryItems);
            var fromHash = this.buildFromHash();
            if (!fromHash) {
                this.buildStructure();
            }
            this.LGel.trigger(lGEvents.init, {
                instance: this,
            });
            if (this.settings.keyPress) {
                this.keyPress();
            }
            setTimeout(function () {
                _this.enableDrag();
                _this.enableSwipe();
            }, 50);
            if (this.galleryItems.length > 1) {
                this.arrow();
                if (this.settings.mousewheel) {
                    this.mousewheel();
                }
            }
            if (!this.settings.dynamic) {
                var _loop_1 = function (index) {
                    var element = this_1.items[index];
                    var $element = $LG(element);
                    // Using different namespace for click because click event should not unbind if selector is same object('this')
                    // @todo manage all event listners - should have namespace that represent element
                    var uuid = lgQuery.generateUUID();
                    $element
                        .attr('data-lg-id', uuid)
                        .on("click.lgcustom-item-" + uuid, function (e) {
                        e.preventDefault();
                        var currentItemIndex = _this.settings.index || index;
                        _this.openGallery(currentItemIndex, element);
                    });
                };
                var this_1 = this;
                // Using for loop instead of using bubbling as the items can be any html element.
                for (var index = 0; index < this.items.length; index++) {
                    _loop_1(index);
                }
            }
        };
        /**
         * Module constructor
         * Modules are build incrementally.
         * Gallery should be opened only once all the modules are initialized.
         * use moduleBuildTimeout to make sure this
         */
        LightGallery.prototype.buildModules = function () {
            var _this = this;
            var numberOfModules = 0;
            this.settings.plugins.forEach(function (plugin) {
                numberOfModules++;
                (function (num) {
                    setTimeout(function () {
                        _this.plugins.push(new plugin(_this, $LG));
                    }, 10 * num);
                })(numberOfModules);
            });
            return numberOfModules * 10;
        };
        LightGallery.prototype.getSlideItem = function (index) {
            return $LG(this.getSlideItemId(index));
        };
        LightGallery.prototype.getSlideItemId = function (index) {
            return "#lg-item-" + this.lgId + "-" + index;
        };
        LightGallery.prototype.getIdName = function (id) {
            return id + "-" + this.lgId;
        };
        LightGallery.prototype.getElementById = function (id) {
            return $LG("#" + this.getIdName(id));
        };
        LightGallery.prototype.buildStructure = function () {
            var _this = this;
            var container = this.$container && this.$container.get();
            if (container) {
                return 0;
            }
            var controls = '';
            var subHtmlCont = '';
            // Create controls
            if (this.settings.controls && this.galleryItems.length > 1) {
                controls = "<button type=\"button\" id=\"" + this.getIdName('lg-prev') + "\" aria-label=\"Previous slide\" class=\"lg-prev lg-icon\"> " + this.settings.prevHtml + " </button>\n                <button type=\"button\" id=\"" + this.getIdName('lg-next') + "\" aria-label=\"Next slide\" class=\"lg-next lg-icon\"> " + this.settings.nextHtml + " </button>";
            }
            if (this.settings.appendSubHtmlTo === '.lg-sub-html') {
                subHtmlCont =
                    '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
            }
            var addClasses = '';
            if (this.settings.allowMediaOverlap) {
                // Do not remove space before last single quote
                addClasses += 'lg-media-overlap ';
            }
            var ariaLabelledby = this.settings.ariaLabelledby
                ? 'aria-labelledby="' + this.settings.ariaLabelledby + '"'
                : '';
            var ariaDescribedby = this.settings.ariaDescribedby
                ? 'aria-describedby="' + this.settings.ariaDescribedby + '"'
                : '';
            var containerClassName = "lg-container " + this.settings.addClass + " " + (document.body !== this.settings.container ? 'lg-inline' : '');
            var closeIcon = this.settings.closable && this.settings.showCloseIcon
                ? "<button type=\"button\" aria-label=\"Close gallery\" id=\"" + this.getIdName('lg-close') + "\" class=\"lg-close lg-icon\"></button>"
                : '';
            var maximizeIcon = this.settings.showMaximizeIcon
                ? "<button type=\"button\" aria-label=\"Toggle maximize\" id=\"" + this.getIdName('lg-maximize') + "\" class=\"lg-maximize lg-icon\"></button>"
                : '';
            var template = "\n        <div class=\"" + containerClassName + "\" id=\"" + this.getIdName('lg-container') + "\" tabindex=\"-1\" aria-modal=\"true\" " + ariaLabelledby + " " + ariaDescribedby + " role=\"dialog\"\n        >\n            <div id=\"" + this.getIdName('lg-backdrop') + "\" class=\"lg-backdrop\"></div>\n\n            <div id=\"" + this.getIdName('lg-outer') + "\" class=\"lg-outer lg-hide-items " + addClasses + " \">\n                    <div id=\"" + this.getIdName('lg-content') + "\" class=\"lg\" style=\"width: " + this.settings.width + "; height:" + this.settings.height + "\">\n                        <div id=\"" + this.getIdName('lg-inner') + "\" class=\"lg-inner\"></div>\n                        <div id=\"" + this.getIdName('lg-toolbar') + "\" class=\"lg-toolbar lg-group\">\n                        " + maximizeIcon + "\n                        " + closeIcon + "\n                    </div>\n                    " + controls + "\n                    <div id=\"" + this.getIdName('lg-components') + "\" class=\"lg-components\">\n                        " + subHtmlCont + "\n                    </div>\n                </div> \n            </div>\n        </div>\n        ";
            $LG(this.settings.container)
                .css('position', 'relative')
                .append(template);
            this.outer = this.getElementById('lg-outer');
            this.$lgContent = this.getElementById('lg-content');
            this.$lgComponents = this.getElementById('lg-components');
            this.$backdrop = this.getElementById('lg-backdrop');
            this.$container = this.getElementById('lg-container');
            this.$inner = this.getElementById('lg-inner');
            this.$toolbar = this.getElementById('lg-toolbar');
            this.$backdrop.css('transition-duration', this.settings.backdropDuration + 'ms');
            this.outer.addClass('lg-use-css3');
            // add Class for css support and transition mode
            this.outer.addClass('lg-css3');
            this.outer.addClass(this.settings.mode);
            if (this.settings.enableDrag && this.galleryItems.length > 1) {
                this.outer.addClass('lg-grab');
            }
            if (this.settings.showAfterLoad) {
                this.outer.addClass('lg-show-after-load');
            }
            this.$inner.css('transition-timing-function', this.settings.easing);
            this.$inner.css('transition-duration', this.settings.speed + 'ms');
            if (this.settings.download) {
                this.$toolbar.append("<a id=\"" + this.getIdName('lg-download') + "\" target=\"_blank\" aria-label=\"Download\" download class=\"lg-download lg-icon\"></a>");
            }
            this.counter();
            $LG(window).on("resize.lg.global" + this.lgId + " orientationchange.lg.global" + this.lgId, function () {
                _this.refreshOnResize();
            });
            this.hideBars();
            this.manageCloseGallery();
            this.toggleMaximize();
            return this.buildModules();
        };
        LightGallery.prototype.refreshOnResize = function () {
            if (this.lgOpened) {
                var currentGalleryItem = this.galleryItems[this.index];
                var videoInfo = currentGalleryItem.__slideVideoInfo;
                var _a = this.getMediaContainerPosition(), top_1 = _a.top, bottom = _a.bottom;
                this.currentImageSize = utils.getSize(this.items[this.index], this.$lgContent, top_1 + bottom, videoInfo && this.settings.videoMaxSize);
                if (videoInfo) {
                    this.resizeVideoSlide(this.index, this.currentImageSize);
                }
                if (this.zoomFromOrigin && !this.isDummyImageRemoved) {
                    var imgStyle = this.getDummyImgStyles(this.currentImageSize);
                    this.outer
                        .find('.lg-current .lg-dummy-img')
                        .first()
                        .attr('style', imgStyle);
                }
                this.LGel.trigger(lGEvents.containerResize);
            }
        };
        LightGallery.prototype.resizeVideoSlide = function (index, imageSize) {
            var lgVideoStyle = this.getVideoContStyle(imageSize);
            var currentSlide = this.getSlideItem(index);
            currentSlide.find('.lg-video-cont').attr('style', lgVideoStyle);
        };
        /**
         * Update slides dynamically.
         * Add, edit or delete slides dynamically when lightGallery is opened.
         * Modify the current gallery items and pass it via updateSlides method
         * @note
         * - Do not mutate existing lightGallery items directly.
         * - Always pass new list of gallery items
         * - You need to take care of thumbnails outside the gallery if any
         * @param items Gallery items
         * @param index After the update operation, which slide gallery should navigate to
         * @category lGPublicMethods
         * @example
         * const plugin = lightGallery();
         *
         * // Adding slides dynamically
         * let galleryItems = [
         * // Access existing lightGallery items
         * // galleryItems are automatically generated internally from the gallery HTML markup
         * // or directly from galleryItems when dynamic gallery is used
         *   ...plugin.galleryItems,
         *     ...[
         *       {
         *         src: 'img/img-1.png',
         *           thumb: 'img/thumb1.png',
         *         },
         *     ],
         *   ];
         *   plugin.updateSlides(
         *     galleryItems,
         *     plugin.index,
         *   );
         *
         *
         * // Remove slides dynamically
         * galleryItems = JSON.parse(
         *   JSON.stringify(updateSlideInstance.galleryItems),
         * );
         * galleryItems.shift();
         * updateSlideInstance.updateSlides(galleryItems, 1);
         * @see <a href="/demos/update-slides/">Demo</a>
         */
        LightGallery.prototype.updateSlides = function (items, index) {
            if (this.index > items.length - 1) {
                this.index = items.length - 1;
            }
            if (items.length === 1) {
                this.index = 0;
            }
            if (!items.length) {
                this.closeGallery();
                return;
            }
            var currentSrc = this.galleryItems[index].src;
            this.addSlideVideoInfo(items);
            this.galleryItems = items;
            this.$inner.empty();
            this.currentItemsInDom = [];
            var _index = 0;
            // Find the current index based on source value of the slide
            this.galleryItems.some(function (galleryItem, itemIndex) {
                if (galleryItem.src === currentSrc) {
                    _index = itemIndex;
                    return true;
                }
                return false;
            });
            this.currentItemsInDom = this.organizeSlideItems(_index, -1);
            this.loadContent(_index, true);
            this.getSlideItem(_index).addClass('lg-current');
            this.index = _index;
            this.updateCurrentCounter(_index);
            this.updateCounterTotal();
            this.LGel.trigger(lGEvents.updateSlides);
        };
        // Get gallery items based on multiple conditions
        LightGallery.prototype.getItems = function () {
            // Gallery items
            this.items = [];
            if (!this.settings.dynamic) {
                if (this.settings.selector === 'this') {
                    this.items.push(this.el);
                }
                else if (this.settings.selector) {
                    if (this.settings.selectWithin) {
                        var selectWithin = $LG(this.settings.selectWithin);
                        this.items = selectWithin
                            .find(this.settings.selector)
                            .get();
                    }
                    else {
                        this.items = this.el.querySelectorAll(this.settings.selector);
                    }
                }
                else {
                    this.items = this.el.children;
                }
                return utils.getDynamicOptions(this.items, this.settings.extraProps, this.settings.getCaptionFromTitleOrAlt, this.settings.exThumbImage);
            }
            else {
                return this.settings.dynamicEl || [];
            }
        };
        /**
         * Open lightGallery.
         * Open gallery with specific slide by passing index of the slide as parameter.
         * @category lGPublicMethods
         * @param {Number} index  - index of the slide
         * @param {HTMLElement} element - Which image lightGallery should zoom from
         *
         * @example
         * const $dynamicGallery = document.getElementById('dynamic-gallery-demo');
         * const dynamicGallery = lightGallery($dynamicGallery, {
         *     dynamic: true,
         *     dynamicEl: [
         *         {
         *              src: 'img/1.jpg',
         *              thumb: 'img/thumb-1.jpg',
         *              subHtml: '<h4>Image 1 title</h4><p>Image 1 descriptions.</p>',
         *         },
         *         ...
         *     ],
         * });
         * $dynamicGallery.addEventListener('click', function () {
         *     // Starts with third item.(Optional).
         *     // This is useful if you want use dynamic mode with
         *     // custom thumbnails (thumbnails outside gallery),
         *     dynamicGallery.openGallery(2);
         * });
         *
         */
        LightGallery.prototype.openGallery = function (index, element) {
            var _this = this;
            if (index === void 0) { index = this.settings.index; }
            // prevent accidental double execution
            if (this.lgOpened)
                return;
            this.lgOpened = true;
            this.outer.get().focus();
            this.outer.removeClass('lg-hide-items');
            // Add display block, but still has opacity 0
            this.$container.addClass('lg-show');
            var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, index);
            this.currentItemsInDom = itemsToBeInsertedToDom;
            var items = '';
            itemsToBeInsertedToDom.forEach(function (item) {
                items = items + ("<div id=\"" + item + "\" class=\"lg-item\"></div>");
            });
            this.$inner.append(items);
            this.addHtml(index);
            var transform = '';
            this.mediaContainerPosition = this.getMediaContainerPosition();
            var _a = this.mediaContainerPosition, top = _a.top, bottom = _a.bottom;
            if (!this.settings.allowMediaOverlap) {
                this.setMediaContainerPosition(top, bottom);
            }
            if (this.zoomFromOrigin && element) {
                this.currentImageSize = utils.getSize(element, this.$lgContent, top + bottom, this.galleryItems[this.index].__slideVideoInfo &&
                    this.settings.videoMaxSize);
                transform = utils.getTransform(element, this.$lgContent, top, bottom, this.currentImageSize);
            }
            if (!this.zoomFromOrigin || !transform) {
                this.outer.addClass(this.settings.startClass);
                this.getSlideItem(index).removeClass('lg-complete');
            }
            var timeout = this.settings.zoomFromOrigin
                ? 100
                : this.settings.backdropDuration;
            setTimeout(function () {
                _this.outer.addClass('lg-components-open');
            }, timeout);
            this.LGel.trigger(lGEvents.beforeOpen);
            // add class lg-current to remove initial transition
            this.getSlideItem(index).addClass('lg-current');
            this.lGalleryOn = false;
            this.index = index;
            // Store the current scroll top value to scroll back after closing the gallery..
            this.prevScrollTop = $LG(window).scrollTop();
            setTimeout(function () {
                // Need to check both zoomFromOrigin and transform values as we need to set set the
                // default opening animation if user missed to add the lg-size attribute
                if (_this.zoomFromOrigin && transform) {
                    var currentSlide_1 = _this.getSlideItem(index);
                    currentSlide_1.css('transform', transform);
                    setTimeout(function () {
                        currentSlide_1
                            .addClass('lg-start-progress lg-start-end-progress')
                            .css('transition-duration', _this.settings.startAnimationDuration + 'ms');
                        _this.outer.addClass('lg-zoom-from-image');
                    });
                    setTimeout(function () {
                        currentSlide_1.css('transform', 'translate3d(0, 0, 0)');
                    }, 100);
                }
                setTimeout(function () {
                    _this.$backdrop.addClass('in');
                    _this.$container.addClass('lg-show-in');
                }, 10);
                // lg-visible class resets gallery opacity to 1
                if (!_this.zoomFromOrigin || !transform) {
                    setTimeout(function () {
                        _this.outer.addClass('lg-visible');
                    }, _this.settings.backdropDuration);
                }
                // initiate slide function
                _this.slide(index, false, false, false);
                _this.LGel.trigger(lGEvents.afterOpen);
            });
            $LG(document.body).addClass('lg-on');
        };
        /**
         * Note - Changing the position of the media on every slide transition creates a flickering effect.
         * Therefore, The height of the caption is calculated dynamically, only once based on the first slide caption.
         * if you have dynamic captions for each media,
         * you can provide an appropriate height for the captions via allowMediaOverlap option
         */
        LightGallery.prototype.getMediaContainerPosition = function () {
            if (this.settings.allowMediaOverlap) {
                return {
                    top: 0,
                    bottom: 0,
                };
            }
            var top = this.$toolbar.get().clientHeight || 0;
            var captionHeight = this.settings.defaultCaptionHeight ||
                this.outer.find('.lg-sub-html').get().clientHeight;
            var thumbContainer = this.outer.find('.lg-thumb-outer').get();
            var thumbHeight = thumbContainer ? thumbContainer.clientHeight : 0;
            var bottom = thumbHeight + captionHeight;
            return {
                top: top,
                bottom: bottom,
            };
        };
        LightGallery.prototype.setMediaContainerPosition = function (top, bottom) {
            if (top === void 0) { top = 0; }
            if (bottom === void 0) { bottom = 0; }
            this.$inner.css('top', top + 'px').css('bottom', bottom + 'px');
        };
        // Build Gallery if gallery id exist in the URL
        LightGallery.prototype.buildFromHash = function () {
            var _this = this;
            // if dynamic option is enabled execute immediately
            var _hash = window.location.hash;
            if (_hash.indexOf('lg=' + this.settings.galleryId) > 0) {
                // This class is used to remove the initial animation if galleryId present in the URL
                $LG(document.body).addClass('lg-from-hash');
                this.zoomFromOrigin = false;
                var index_1 = this.getIndexFromUrl(_hash);
                var openGalleryAfter = this.buildStructure();
                setTimeout(function () {
                    _this.openGallery(index_1);
                }, openGalleryAfter);
                return true;
            }
        };
        LightGallery.prototype.hideBars = function () {
            var _this = this;
            // Hide controllers if mouse doesn't move for some period
            setTimeout(function () {
                _this.outer.removeClass('lg-hide-items');
                if (_this.settings.hideBarsDelay > 0) {
                    _this.outer.on('mousemove.lg click.lg touchstart.lg', function () {
                        _this.outer.removeClass('lg-hide-items');
                        clearTimeout(_this.hideBarTimeout);
                        // Timeout will be cleared on each slide movement also
                        _this.hideBarTimeout = setTimeout(function () {
                            _this.outer.addClass('lg-hide-items');
                        }, _this.settings.hideBarsDelay);
                    });
                    _this.outer.trigger('mousemove.lg');
                }
            }, this.settings.showBarsAfter);
        };
        LightGallery.prototype.initPictureFill = function ($img) {
            if (this.settings.supportLegacyBrowser) {
                try {
                    picturefill({
                        elements: [$img.get()],
                    });
                }
                catch (e) {
                    console.warn('lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document.');
                }
            }
        };
        /**
         *  @desc Create image counter
         *  Ex: 1/10
         */
        LightGallery.prototype.counter = function () {
            if (this.settings.counter) {
                var counterHtml = "<div class=\"lg-counter\" role=\"status\" aria-live=\"polite\">\n                <span id=\"" + this.getIdName('lg-counter-current') + "\" class=\"lg-counter-current\">" + (this.index + 1) + " </span> / \n                <span id=\"" + this.getIdName('lg-counter-all') + "\" class=\"lg-counter-all\">" + this.galleryItems.length + " </span></div>";
                this.outer.find(this.settings.appendCounterTo).append(counterHtml);
            }
        };
        /**
         *  @desc add sub-html into the slide
         *  @param {Number} index - index of the slide
         */
        LightGallery.prototype.addHtml = function (index) {
            var subHtml;
            var subHtmlUrl;
            if (this.galleryItems[index].subHtmlUrl) {
                subHtmlUrl = this.galleryItems[index].subHtmlUrl;
            }
            else {
                subHtml = this.galleryItems[index].subHtml;
            }
            if (!subHtmlUrl) {
                if (subHtml) {
                    // get first letter of subhtml
                    // if first letter starts with . or # get the html form the jQuery object
                    var fL = subHtml.substring(0, 1);
                    if (fL === '.' || fL === '#') {
                        if (this.settings.subHtmlSelectorRelative &&
                            !this.settings.dynamic) {
                            subHtml = $LG(this.items)
                                .eq(index)
                                .find(subHtml)
                                .first()
                                .html();
                        }
                        else {
                            subHtml = $LG(subHtml).first().html();
                        }
                    }
                }
                else {
                    subHtml = '';
                }
            }
            if (this.settings.appendSubHtmlTo === '.lg-sub-html') {
                if (subHtmlUrl) {
                    this.outer.find('.lg-sub-html').load(subHtmlUrl);
                }
                else {
                    this.outer.find('.lg-sub-html').html(subHtml);
                }
            }
            else {
                var currentSlide = $LG(this.getSlideItemId(index));
                if (subHtmlUrl) {
                    currentSlide.load(subHtmlUrl);
                }
                else {
                    currentSlide.append("<div class=\"lg-sub-html\">" + subHtml + "</div>");
                }
            }
            // Add lg-empty-html class if title doesn't exist
            if (typeof subHtml !== 'undefined' && subHtml !== null) {
                if (subHtml === '') {
                    this.outer
                        .find(this.settings.appendSubHtmlTo)
                        .addClass('lg-empty-html');
                }
                else {
                    this.outer
                        .find(this.settings.appendSubHtmlTo)
                        .removeClass('lg-empty-html');
                }
            }
            this.LGel.trigger(lGEvents.afterAppendSubHtml, {
                index: index,
            });
        };
        /**
         *  @desc Preload slides
         *  @param {Number} index - index of the slide
         * @todo preload not working for the first slide, Also, should work for the first and last slide as well
         */
        LightGallery.prototype.preload = function (index) {
            for (var i = 1; i <= this.settings.preload; i++) {
                if (i >= this.galleryItems.length - index) {
                    break;
                }
                this.loadContent(index + i, false);
            }
            for (var j = 1; j <= this.settings.preload; j++) {
                if (index - j < 0) {
                    break;
                }
                this.loadContent(index - j, false);
            }
        };
        LightGallery.prototype.getDummyImgStyles = function (imageSize) {
            if (!imageSize)
                return '';
            return "width:" + imageSize.width + "px; \n                margin-left: -" + imageSize.width / 2 + "px;\n                margin-top: -" + imageSize.height / 2 + "px; \n                height:" + imageSize.height + "px";
        };
        LightGallery.prototype.getVideoContStyle = function (imageSize) {
            if (!imageSize)
                return '';
            return "width:" + imageSize.width + "px; \n                height:" + imageSize.height + "px";
        };
        LightGallery.prototype.getDummyImageContent = function ($currentSlide, index, alt) {
            var $currentItem;
            if (!this.settings.dynamic) {
                $currentItem = $LG(this.items).eq(index);
            }
            if ($currentItem) {
                var _dummyImgSrc = void 0;
                if (!this.settings.exThumbImage) {
                    _dummyImgSrc = $currentItem.find('img').first().attr('src');
                }
                else {
                    _dummyImgSrc = $currentItem.attr(this.settings.exThumbImage);
                }
                var imgStyle = this.getDummyImgStyles(this.currentImageSize);
                var dummyImgContent = "<img " + alt + " style=\"" + imgStyle + "\" class=\"lg-dummy-img\" src=\"" + _dummyImgSrc + "\" />";
                $currentSlide.addClass('lg-first-slide');
                return dummyImgContent;
            }
            return '';
        };
        LightGallery.prototype.setImgMarkup = function (src, $currentSlide, index) {
            var currentGalleryItem = this.galleryItems[index];
            var alt = currentGalleryItem.alt, srcset = currentGalleryItem.srcset, sizes = currentGalleryItem.sizes, sources = currentGalleryItem.sources;
            // Use the thumbnail as dummy image which will be resized to actual image size and
            // displayed on top of actual image
            var imgContent = '';
            var altAttr = alt ? 'alt="' + alt + '"' : '';
            if (!this.lGalleryOn && this.zoomFromOrigin && this.currentImageSize) {
                imgContent = this.getDummyImageContent($currentSlide, index, altAttr);
            }
            else {
                imgContent = utils.getImgMarkup(index, src, altAttr, srcset, sizes, sources);
            }
            var imgMarkup = "<picture class=\"lg-img-wrap\"> " + imgContent + "</picture>";
            $currentSlide.prepend(imgMarkup);
        };
        LightGallery.prototype.onLgObjectLoad = function ($el, index, delay, speed, dummyImageLoaded) {
            var _this = this;
            if (dummyImageLoaded) {
                this.LGel.trigger(lGEvents.slideItemLoad, {
                    index: index,
                    delay: delay || 0,
                });
            }
            $el.find('.lg-object')
                .first()
                .on('load.lg', function () {
                _this.handleLgObjectLoad($el, index, delay, speed, dummyImageLoaded);
            });
            setTimeout(function () {
                $el.find('.lg-object')
                    .first()
                    .on('error.lg', function () {
                    $el.addClass('lg-complete lg-complete_');
                    $el.html('<span class="lg-error-msg">Oops... Failed to load content...</span>');
                });
            }, speed);
        };
        LightGallery.prototype.handleLgObjectLoad = function ($el, index, delay, speed, dummyImageLoaded) {
            var _this = this;
            setTimeout(function () {
                $el.addClass('lg-complete lg-complete_');
                if (!dummyImageLoaded) {
                    _this.LGel.trigger(lGEvents.slideItemLoad, {
                        index: index,
                        delay: delay || 0,
                    });
                }
            }, speed);
        };
        /**
         * @desc Check the given src is video
         * @param {String} src
         * @return {Object} video type
         * Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
         *
         * @todo - this information can be moved to dynamicEl to avoid frequent calls
         */
        LightGallery.prototype.isVideo = function (src, index) {
            if (!src) {
                if (this.galleryItems[index].video) {
                    return {
                        html5: true,
                    };
                }
                else {
                    console.error('lightGallery :- data-src is not provided on slide item ' +
                        (index + 1) +
                        '. Please make sure the selector property is properly configured. More info - http://sachinchoolur.github.io/lightGallery/demos/html-markup.html');
                    return;
                }
            }
            var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
            var vimeo = src.match(/\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)/i);
            var wistia = src.match(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/);
            if (youtube) {
                return {
                    youtube: youtube,
                };
            }
            else if (vimeo) {
                return {
                    vimeo: vimeo,
                };
            }
            else if (wistia) {
                return {
                    wistia: wistia,
                };
            }
        };
        // Add video slideInfo
        LightGallery.prototype.addSlideVideoInfo = function (items) {
            var _this = this;
            items.forEach(function (element, index) {
                element.__slideVideoInfo = _this.isVideo(element.src, index);
            });
        };
        /**
         *  Load slide content into slide.
         *  This is used to load content into slides that is not visible too
         *  @param {Number} index - index of the slide.
         *  @param {Boolean} rec - if true call loadcontent() function again.
         */
        LightGallery.prototype.loadContent = function (index, rec) {
            var _this = this;
            var currentGalleryItem = this.galleryItems[index];
            var $currentSlide = $LG(this.getSlideItemId(index));
            var poster = currentGalleryItem.poster, srcset = currentGalleryItem.srcset, sizes = currentGalleryItem.sizes, sources = currentGalleryItem.sources;
            var src = currentGalleryItem.src;
            var video = currentGalleryItem.video;
            var _html5Video = video && typeof video === 'string' ? JSON.parse(video) : video;
            if (currentGalleryItem.responsive) {
                var srcDyItms = currentGalleryItem.responsive.split(',');
                src = utils.getResponsiveSrc(srcDyItms) || src;
            }
            var videoInfo = currentGalleryItem.__slideVideoInfo;
            var lgVideoStyle = '';
            var iframe = !!currentGalleryItem.iframe;
            if (!$currentSlide.hasClass('lg-loaded')) {
                if (videoInfo) {
                    var _a = this.mediaContainerPosition, top_2 = _a.top, bottom = _a.bottom;
                    var videoSize = utils.getSize(this.items[index], this.$lgContent, top_2 + bottom, videoInfo && this.settings.videoMaxSize);
                    lgVideoStyle = this.getVideoContStyle(videoSize);
                }
                if (iframe) {
                    var markup = utils.getIframeMarkup(src, this.settings.iframeWidth, this.settings.iframeHeight, currentGalleryItem.iframeTitle);
                    $currentSlide.prepend(markup);
                }
                else if (poster) {
                    var dummyImg = '';
                    var isFirstSlide_1 = !this.lGalleryOn;
                    var hasStartAnimation = !this.lGalleryOn &&
                        this.zoomFromOrigin &&
                        this.currentImageSize;
                    if (hasStartAnimation) {
                        dummyImg = this.getDummyImageContent($currentSlide, index, '');
                    }
                    var markup = utils.getVideoPosterMarkup(poster, dummyImg || '', lgVideoStyle, videoInfo);
                    $currentSlide.prepend(markup);
                    var delay_1 = (hasStartAnimation
                        ? this.settings.startAnimationDuration
                        : this.settings.backdropDuration) + 100;
                    setTimeout(function () {
                        _this.LGel.trigger(lGEvents.hasVideo, {
                            index: index,
                            src: src,
                            html5Video: _html5Video,
                            hasPoster: true,
                            isFirstSlide: isFirstSlide_1,
                        });
                    }, delay_1);
                }
                else if (videoInfo) {
                    var markup = "<div class=\"lg-video-cont \" style=\"" + lgVideoStyle + "\"></div>";
                    $currentSlide.prepend(markup);
                    this.LGel.trigger(lGEvents.hasVideo, {
                        index: index,
                        src: src,
                        html5Video: _html5Video,
                        hasPoster: false,
                    });
                }
                else {
                    this.setImgMarkup(src, $currentSlide, index);
                    if (srcset || sources) {
                        var $img = $currentSlide.find('.lg-object');
                        this.initPictureFill($img);
                    }
                }
                this.LGel.trigger(lGEvents.afterAppendSlide, { index: index });
                if (this.lGalleryOn &&
                    this.settings.appendSubHtmlTo !== '.lg-sub-html') {
                    this.addHtml(index);
                }
            }
            // For first time add some delay for displaying the start animation.
            var _speed = 0;
            // delay for adding complete class. it is 0 except first time.
            var delay = 0;
            if (!this.lGalleryOn) {
                if (this.zoomFromOrigin && this.currentImageSize) {
                    delay = this.settings.startAnimationDuration + 10;
                }
                else {
                    delay = this.settings.backdropDuration + 10;
                }
            }
            // Do not change the delay value because it is required for zoom plugin.
            // If gallery opened from direct url (hash) speed value should be 0
            if (delay && !$LG(document.body).hasClass('lg-from-hash')) {
                _speed = delay;
            }
            // Only for first slide
            if (!this.lGalleryOn && this.zoomFromOrigin && this.currentImageSize) {
                setTimeout(function () {
                    $currentSlide
                        .removeClass('lg-start-end-progress lg-start-progress')
                        .removeAttr('style');
                }, this.settings.startAnimationDuration + 100);
                if (!$currentSlide.hasClass('lg-loaded')) {
                    setTimeout(function () {
                        $currentSlide
                            .find('.lg-img-wrap')
                            .append(utils.getImgMarkup(index, src, '', srcset, sizes, currentGalleryItem.sources));
                        if (srcset || sources) {
                            var $img = $currentSlide.find('.lg-object');
                            _this.initPictureFill($img);
                        }
                        _this.onLgObjectLoad($currentSlide, index, delay, _speed, true);
                        var mediaObject = $currentSlide
                            .find('.lg-object')
                            .first();
                        if (utils.isImageLoaded(mediaObject.get())) {
                            _this.loadContentOnLoad(index, $currentSlide, _speed);
                        }
                        else {
                            mediaObject.on('load.lg error.lg', function () {
                                _this.loadContentOnLoad(index, $currentSlide, _speed);
                            });
                        }
                    }, this.settings.startAnimationDuration + 100);
                }
            }
            // SLide content has been added to dom
            $currentSlide.addClass('lg-loaded');
            this.onLgObjectLoad($currentSlide, index, delay, _speed, false);
            // @todo check load state for html5 videos
            if (videoInfo && videoInfo.html5 && !poster) {
                $currentSlide.addClass('lg-complete lg-complete_');
            }
            // When gallery is opened once content is loaded (second time) need to add lg-complete class for css styling
            if ((!this.zoomFromOrigin || !this.currentImageSize) &&
                $currentSlide.hasClass('lg-complete_') &&
                !this.lGalleryOn) {
                setTimeout(function () {
                    $currentSlide.addClass('lg-complete');
                }, this.settings.backdropDuration);
            }
            // Content loaded
            // Need to set lGalleryOn before calling preload function
            this.lGalleryOn = true;
            if (rec === true) {
                if (!$currentSlide.hasClass('lg-complete_')) {
                    $currentSlide
                        .find('.lg-object')
                        .first()
                        .on('load.lg error.lg', function () {
                        _this.preload(index);
                    });
                }
                else {
                    this.preload(index);
                }
            }
        };
        LightGallery.prototype.loadContentOnLoad = function (index, $currentSlide, speed) {
            var _this = this;
            setTimeout(function () {
                $currentSlide.find('.lg-dummy-img').remove();
                $currentSlide.removeClass('lg-first-slide');
                _this.isDummyImageRemoved = true;
                _this.preload(index);
            }, speed + 300);
        };
        LightGallery.prototype.getItemsToBeInsertedToDom = function (index, prevIndex, numberOfItems) {
            var _this = this;
            if (numberOfItems === void 0) { numberOfItems = 0; }
            var itemsToBeInsertedToDom = [];
            // Minimum 2 items should be there
            var possibleNumberOfItems = Math.max(numberOfItems, 3);
            possibleNumberOfItems = Math.min(possibleNumberOfItems, this.galleryItems.length);
            var prevIndexItem = "lg-item-" + this.lgId + "-" + prevIndex;
            if (this.galleryItems.length <= 3) {
                this.galleryItems.forEach(function (_element, index) {
                    itemsToBeInsertedToDom.push("lg-item-" + _this.lgId + "-" + index);
                });
                return itemsToBeInsertedToDom;
            }
            if (index < (this.galleryItems.length - 1) / 2) {
                for (var idx = index; idx > index - possibleNumberOfItems / 2 && idx >= 0; idx--) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
                }
                var numberOfExistingItems = itemsToBeInsertedToDom.length;
                for (var idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index + idx + 1));
                }
            }
            else {
                for (var idx = index; idx <= this.galleryItems.length - 1 &&
                    idx < index + possibleNumberOfItems / 2; idx++) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
                }
                var numberOfExistingItems = itemsToBeInsertedToDom.length;
                for (var idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index - idx - 1));
                }
            }
            if (this.settings.loop) {
                if (index === this.galleryItems.length - 1) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + 0);
                }
                else if (index === 0) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (this.galleryItems.length - 1));
                }
            }
            if (itemsToBeInsertedToDom.indexOf(prevIndexItem) === -1) {
                itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + prevIndex);
            }
            return itemsToBeInsertedToDom;
        };
        LightGallery.prototype.organizeSlideItems = function (index, prevIndex) {
            var _this = this;
            var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, prevIndex, this.settings.numberOfSlideItemsInDom);
            itemsToBeInsertedToDom.forEach(function (item) {
                if (_this.currentItemsInDom.indexOf(item) === -1) {
                    _this.$inner.append("<div id=\"" + item + "\" class=\"lg-item\"></div>");
                }
            });
            this.currentItemsInDom.forEach(function (item) {
                if (itemsToBeInsertedToDom.indexOf(item) === -1) {
                    $LG("#" + item).remove();
                }
            });
            return itemsToBeInsertedToDom;
        };
        /**
         * Get previous index of the slide
         */
        LightGallery.prototype.getPreviousSlideIndex = function () {
            var prevIndex = 0;
            try {
                var currentItemId = this.outer
                    .find('.lg-current')
                    .first()
                    .attr('id');
                prevIndex = parseInt(currentItemId.split('-')[3]) || 0;
            }
            catch (error) {
                prevIndex = 0;
            }
            return prevIndex;
        };
        LightGallery.prototype.setDownloadValue = function (index) {
            if (this.settings.download) {
                var currentGalleryItem = this.galleryItems[index];
                var src = currentGalleryItem.downloadUrl !== false &&
                    (currentGalleryItem.downloadUrl || currentGalleryItem.src);
                if (src) {
                    this.getElementById('lg-download').attr('href', src);
                    this.outer.removeClass('lg-hide-download');
                }
                else {
                    this.outer.addClass('lg-hide-download');
                }
            }
        };
        LightGallery.prototype.makeSlideAnimation = function (direction, currentSlideItem, previousSlideItem) {
            var _this = this;
            if (this.lGalleryOn) {
                previousSlideItem.addClass('lg-slide-progress');
            }
            setTimeout(function () {
                // remove all transitions
                _this.outer.addClass('lg-no-trans');
                _this.outer
                    .find('.lg-item')
                    .removeClass('lg-prev-slide lg-next-slide');
                if (direction === 'prev') {
                    //prevslide
                    currentSlideItem.addClass('lg-prev-slide');
                    previousSlideItem.addClass('lg-next-slide');
                }
                else {
                    // next slide
                    currentSlideItem.addClass('lg-next-slide');
                    previousSlideItem.addClass('lg-prev-slide');
                }
                // give 50 ms for browser to add/remove class
                setTimeout(function () {
                    _this.outer.find('.lg-item').removeClass('lg-current');
                    currentSlideItem.addClass('lg-current');
                    // reset all transitions
                    _this.outer.removeClass('lg-no-trans');
                }, 50);
            }, this.settings.slideDelay);
        };
        /**
         * Goto a specific slide.
         * @param {Number} index - index of the slide
         * @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
         * @param {Boolean} fromThumb - true if slide function called via thumbnail click
         * @param {String} direction - Direction of the slide(next/prev)
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery();
         *  // to go to 3rd slide
         *  plugin.slide(2);
         *
         */
        LightGallery.prototype.slide = function (index, fromTouch, fromThumb, direction) {
            var _this = this;
            var prevIndex = this.getPreviousSlideIndex();
            this.currentItemsInDom = this.organizeSlideItems(index, prevIndex);
            // Prevent multiple call, Required for hsh plugin
            if (this.lGalleryOn && prevIndex === index) {
                return;
            }
            var numberOfGalleryItems = this.galleryItems.length;
            if (!this.lgBusy) {
                this.setDownloadValue(index);
                if (this.settings.counter) {
                    this.updateCurrentCounter(index);
                }
                var currentSlideItem = this.getSlideItem(index);
                var previousSlideItem_1 = this.getSlideItem(prevIndex);
                var currentGalleryItem = this.galleryItems[index];
                var videoInfo = currentGalleryItem.__slideVideoInfo;
                if (videoInfo) {
                    var _a = this.mediaContainerPosition, top_3 = _a.top, bottom = _a.bottom;
                    var videoSize = utils.getSize(this.items[index], this.$lgContent, top_3 + bottom, videoInfo && this.settings.videoMaxSize);
                    this.resizeVideoSlide(index, videoSize);
                }
                this.LGel.trigger(lGEvents.beforeSlide, {
                    prevIndex: prevIndex,
                    index: index,
                    fromTouch: !!fromTouch,
                    fromThumb: !!fromThumb,
                });
                this.lgBusy = true;
                clearTimeout(this.hideBarTimeout);
                this.arrowDisable(index);
                if (!direction) {
                    if (index < prevIndex) {
                        direction = 'prev';
                    }
                    else if (index > prevIndex) {
                        direction = 'next';
                    }
                }
                if (!fromTouch) {
                    this.makeSlideAnimation(direction, currentSlideItem, previousSlideItem_1);
                }
                else {
                    this.outer
                        .find('.lg-item')
                        .removeClass('lg-prev-slide lg-current lg-next-slide');
                    var touchPrev = void 0;
                    var touchNext = void 0;
                    if (numberOfGalleryItems > 2) {
                        touchPrev = index - 1;
                        touchNext = index + 1;
                        if (index === 0 && prevIndex === numberOfGalleryItems - 1) {
                            // next slide
                            touchNext = 0;
                            touchPrev = numberOfGalleryItems - 1;
                        }
                        else if (index === numberOfGalleryItems - 1 &&
                            prevIndex === 0) {
                            // prev slide
                            touchNext = 0;
                            touchPrev = numberOfGalleryItems - 1;
                        }
                    }
                    else {
                        touchPrev = 0;
                        touchNext = 1;
                    }
                    if (direction === 'prev') {
                        this.getSlideItem(touchNext).addClass('lg-next-slide');
                    }
                    else {
                        this.getSlideItem(touchPrev).addClass('lg-prev-slide');
                    }
                    currentSlideItem.addClass('lg-current');
                }
                // Do not put load content in set timeout as it needs to load immediately when the gallery is opened
                if (!this.lGalleryOn) {
                    this.loadContent(index, true);
                }
                setTimeout(function () {
                    if (_this.lGalleryOn) {
                        _this.loadContent(index, true);
                    }
                    // Add title if this.settings.appendSubHtmlTo === lg-sub-html
                    if (_this.settings.appendSubHtmlTo === '.lg-sub-html') {
                        _this.addHtml(index);
                    }
                }, (this.lGalleryOn ? this.settings.speed + 50 : 50) + (fromTouch ? 0 : this.settings.slideDelay));
                setTimeout(function () {
                    _this.lgBusy = false;
                    previousSlideItem_1.removeClass('lg-slide-progress');
                    _this.LGel.trigger(lGEvents.afterSlide, {
                        prevIndex: prevIndex,
                        index: index,
                        fromTouch: fromTouch,
                        fromThumb: fromThumb,
                    });
                }, (this.lGalleryOn ? this.settings.speed + 100 : 100) + (fromTouch ? 0 : this.settings.slideDelay));
            }
            this.index = index;
        };
        LightGallery.prototype.updateCurrentCounter = function (index) {
            this.getElementById('lg-counter-current').html(index + 1 + '');
        };
        LightGallery.prototype.updateCounterTotal = function () {
            this.getElementById('lg-counter-all').html(this.galleryItems.length + '');
        };
        LightGallery.prototype.touchMove = function (startCoords, endCoords) {
            var distanceX = endCoords.pageX - startCoords.pageX;
            var distanceY = endCoords.pageY - startCoords.pageY;
            var allowSwipe = false;
            if (this.swipeDirection) {
                allowSwipe = true;
            }
            else {
                if (Math.abs(distanceX) > 15) {
                    this.swipeDirection = 'horizontal';
                    allowSwipe = true;
                }
                else if (Math.abs(distanceY) > 15) {
                    this.swipeDirection = 'vertical';
                    allowSwipe = true;
                }
            }
            if (!allowSwipe) {
                return;
            }
            var $currentSlide = this.getSlideItem(this.index);
            if (this.swipeDirection === 'horizontal') {
                // reset opacity and transition duration
                this.outer.addClass('lg-dragging');
                // move current slide
                this.setTranslate($currentSlide, distanceX, 0);
                // move next and prev slide with current slide
                var width = $currentSlide.get().offsetWidth;
                var slideWidthAmount = (width * 15) / 100;
                var gutter = slideWidthAmount - Math.abs((distanceX * 10) / 100);
                this.setTranslate(this.outer.find('.lg-prev-slide').first(), -width + distanceX - gutter, 0);
                this.setTranslate(this.outer.find('.lg-next-slide').first(), width + distanceX + gutter, 0);
            }
            else if (this.swipeDirection === 'vertical') {
                if (this.settings.swipeToClose) {
                    this.$container.addClass('lg-dragging-vertical');
                    var opacity = 1 - Math.abs(distanceY) / window.innerHeight;
                    this.$backdrop.css('opacity', opacity);
                    var scale = 1 - Math.abs(distanceY) / (window.innerWidth * 2);
                    this.setTranslate($currentSlide, 0, distanceY, scale, scale);
                    if (Math.abs(distanceY) > 100) {
                        this.outer
                            .addClass('lg-hide-items')
                            .removeClass('lg-components-open');
                    }
                }
            }
        };
        LightGallery.prototype.touchEnd = function (endCoords, startCoords, event) {
            var _this = this;
            var distance;
            // keep slide animation for any mode while dragg/swipe
            if (this.settings.mode !== 'lg-slide') {
                this.outer.addClass('lg-slide');
            }
            // set transition duration
            setTimeout(function () {
                _this.$container.removeClass('lg-dragging-vertical');
                _this.outer
                    .removeClass('lg-dragging lg-hide-items')
                    .addClass('lg-components-open');
                var triggerClick = true;
                if (_this.swipeDirection === 'horizontal') {
                    distance = endCoords.pageX - startCoords.pageX;
                    var distanceAbs = Math.abs(endCoords.pageX - startCoords.pageX);
                    if (distance < 0 &&
                        distanceAbs > _this.settings.swipeThreshold) {
                        _this.goToNextSlide(true);
                        triggerClick = false;
                    }
                    else if (distance > 0 &&
                        distanceAbs > _this.settings.swipeThreshold) {
                        _this.goToPrevSlide(true);
                        triggerClick = false;
                    }
                }
                else if (_this.swipeDirection === 'vertical') {
                    distance = Math.abs(endCoords.pageY - startCoords.pageY);
                    if (_this.settings.closable &&
                        _this.settings.swipeToClose &&
                        distance > 100) {
                        _this.closeGallery();
                        return;
                    }
                    else {
                        _this.$backdrop.css('opacity', 1);
                    }
                }
                _this.outer.find('.lg-item').removeAttr('style');
                if (triggerClick &&
                    Math.abs(endCoords.pageX - startCoords.pageX) < 5) {
                    // Trigger click if distance is less than 5 pix
                    var target = $LG(event.target);
                    if (_this.isPosterElement(target)) {
                        _this.LGel.trigger(lGEvents.posterClick);
                    }
                }
                _this.swipeDirection = undefined;
            });
            // remove slide class once drag/swipe is completed if mode is not slide
            setTimeout(function () {
                if (!_this.outer.hasClass('lg-dragging') &&
                    _this.settings.mode !== 'lg-slide') {
                    _this.outer.removeClass('lg-slide');
                }
            }, this.settings.speed + 100);
        };
        LightGallery.prototype.enableSwipe = function () {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isMoved = false;
            var isSwiping = false;
            if (this.settings.enableSwipe) {
                this.$inner.on('touchstart.lg', function (e) {
                    e.preventDefault();
                    var $item = _this.getSlideItem(_this.index);
                    if (($LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target)) &&
                        !_this.outer.hasClass('lg-zoomed') &&
                        !_this.lgBusy &&
                        e.targetTouches.length === 1) {
                        isSwiping = true;
                        _this.touchAction = 'swipe';
                        _this.manageSwipeClass();
                        startCoords = {
                            pageX: e.targetTouches[0].pageX,
                            pageY: e.targetTouches[0].pageY,
                        };
                    }
                });
                this.$inner.on('touchmove.lg', function (e) {
                    e.preventDefault();
                    if (isSwiping &&
                        _this.touchAction === 'swipe' &&
                        e.targetTouches.length === 1) {
                        endCoords = {
                            pageX: e.targetTouches[0].pageX,
                            pageY: e.targetTouches[0].pageY,
                        };
                        _this.touchMove(startCoords, endCoords);
                        isMoved = true;
                    }
                });
                this.$inner.on('touchend.lg', function (event) {
                    if (_this.touchAction === 'swipe') {
                        if (isMoved) {
                            isMoved = false;
                            _this.touchEnd(endCoords, startCoords, event);
                        }
                        else if (isSwiping) {
                            var target = $LG(event.target);
                            if (_this.isPosterElement(target)) {
                                _this.LGel.trigger(lGEvents.posterClick);
                            }
                        }
                        _this.touchAction = undefined;
                        isSwiping = false;
                    }
                });
            }
        };
        LightGallery.prototype.enableDrag = function () {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isDraging = false;
            var isMoved = false;
            if (this.settings.enableDrag) {
                this.outer.on('mousedown.lg', function (e) {
                    var $item = _this.getSlideItem(_this.index);
                    if ($LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target)) {
                        if (!_this.outer.hasClass('lg-zoomed') && !_this.lgBusy) {
                            e.preventDefault();
                            if (!_this.lgBusy) {
                                _this.manageSwipeClass();
                                startCoords = {
                                    pageX: e.pageX,
                                    pageY: e.pageY,
                                };
                                isDraging = true;
                                // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                                _this.outer.get().scrollLeft += 1;
                                _this.outer.get().scrollLeft -= 1;
                                // *
                                _this.outer
                                    .removeClass('lg-grab')
                                    .addClass('lg-grabbing');
                                _this.LGel.trigger(lGEvents.dragStart);
                            }
                        }
                    }
                });
                $LG(window).on("mousemove.lg.global" + this.lgId, function (e) {
                    if (isDraging && _this.lgOpened) {
                        isMoved = true;
                        endCoords = {
                            pageX: e.pageX,
                            pageY: e.pageY,
                        };
                        _this.touchMove(startCoords, endCoords);
                        _this.LGel.trigger(lGEvents.dragMove);
                    }
                });
                $LG(window).on("mouseup.lg.global" + this.lgId, function (event) {
                    if (!_this.lgOpened) {
                        return;
                    }
                    var target = $LG(event.target);
                    if (isMoved) {
                        isMoved = false;
                        _this.touchEnd(endCoords, startCoords, event);
                        _this.LGel.trigger(lGEvents.dragEnd);
                    }
                    else if (_this.isPosterElement(target)) {
                        _this.LGel.trigger(lGEvents.posterClick);
                    }
                    // Prevent execution on click
                    if (isDraging) {
                        isDraging = false;
                        _this.outer.removeClass('lg-grabbing').addClass('lg-grab');
                    }
                });
            }
        };
        LightGallery.prototype.manageSwipeClass = function () {
            var _touchNext = this.index + 1;
            var _touchPrev = this.index - 1;
            if (this.settings.loop && this.galleryItems.length > 2) {
                if (this.index === 0) {
                    _touchPrev = this.galleryItems.length - 1;
                }
                else if (this.index === this.galleryItems.length - 1) {
                    _touchNext = 0;
                }
            }
            this.outer.find('.lg-item').removeClass('lg-next-slide lg-prev-slide');
            if (_touchPrev > -1) {
                this.getSlideItem(_touchPrev).addClass('lg-prev-slide');
            }
            this.getSlideItem(_touchNext).addClass('lg-next-slide');
        };
        /**
         * Go to next slide
         * @param {Boolean} fromTouch - true if slide function called via touch event
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery();
         *  plugin.goToNextSlide();
         * @see <a href="/demos/methods/">Demo</a>
         */
        LightGallery.prototype.goToNextSlide = function (fromTouch) {
            var _this = this;
            var _loop = this.settings.loop;
            if (fromTouch && this.galleryItems.length < 3) {
                _loop = false;
            }
            if (!this.lgBusy) {
                if (this.index + 1 < this.galleryItems.length) {
                    this.index++;
                    this.LGel.trigger(lGEvents.beforeNextSlide, {
                        index: this.index,
                    });
                    this.slide(this.index, !!fromTouch, false, 'next');
                }
                else {
                    if (_loop) {
                        this.index = 0;
                        this.LGel.trigger(lGEvents.beforeNextSlide, {
                            index: this.index,
                        });
                        this.slide(this.index, !!fromTouch, false, 'next');
                    }
                    else if (this.settings.slideEndAnimation && !fromTouch) {
                        this.outer.addClass('lg-right-end');
                        setTimeout(function () {
                            _this.outer.removeClass('lg-right-end');
                        }, 400);
                    }
                }
            }
        };
        /**
         * Go to previous slides
         * @param {Boolean} fromTouch - true if slide function called via touch event
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery({});
         *  plugin.goToPrevSlide();
         * @see <a href="/demos/methods/">Demo</a>
         *
         */
        LightGallery.prototype.goToPrevSlide = function (fromTouch) {
            var _this = this;
            var _loop = this.settings.loop;
            if (fromTouch && this.galleryItems.length < 3) {
                _loop = false;
            }
            if (!this.lgBusy) {
                if (this.index > 0) {
                    this.index--;
                    this.LGel.trigger(lGEvents.beforePrevSlide, {
                        index: this.index,
                        fromTouch: fromTouch,
                    });
                    this.slide(this.index, !!fromTouch, false, 'prev');
                }
                else {
                    if (_loop) {
                        this.index = this.galleryItems.length - 1;
                        this.LGel.trigger(lGEvents.beforePrevSlide, {
                            index: this.index,
                            fromTouch: fromTouch,
                        });
                        this.slide(this.index, !!fromTouch, false, 'prev');
                    }
                    else if (this.settings.slideEndAnimation && !fromTouch) {
                        this.outer.addClass('lg-left-end');
                        setTimeout(function () {
                            _this.outer.removeClass('lg-left-end');
                        }, 400);
                    }
                }
            }
        };
        LightGallery.prototype.keyPress = function () {
            var _this = this;
            $LG(window).on("keydown.lg.global" + this.lgId, function (e) {
                if (_this.lgOpened &&
                    _this.settings.escKey === true &&
                    e.keyCode === 27) {
                    e.preventDefault();
                    if (_this.settings.allowMediaOverlap &&
                        _this.outer.hasClass('lg-can-toggle') &&
                        _this.outer.hasClass('lg-components-open')) {
                        _this.outer.removeClass('lg-components-open');
                    }
                    else {
                        _this.closeGallery();
                    }
                }
                if (_this.lgOpened && _this.galleryItems.length > 1) {
                    if (e.keyCode === 37) {
                        e.preventDefault();
                        _this.goToPrevSlide();
                    }
                    if (e.keyCode === 39) {
                        e.preventDefault();
                        _this.goToNextSlide();
                    }
                }
            });
        };
        LightGallery.prototype.arrow = function () {
            var _this = this;
            this.getElementById('lg-prev').on('click.lg', function () {
                _this.goToPrevSlide();
            });
            this.getElementById('lg-next').on('click.lg', function () {
                _this.goToNextSlide();
            });
        };
        LightGallery.prototype.arrowDisable = function (index) {
            // Disable arrows if settings.hideControlOnEnd is true
            if (!this.settings.loop && this.settings.hideControlOnEnd) {
                var $prev = this.getElementById('lg-prev');
                var $next = this.getElementById('lg-next');
                if (index + 1 < this.galleryItems.length) {
                    $prev.removeAttr('disabled').removeClass('disabled');
                }
                else {
                    $prev.attr('disabled', 'disabled').addClass('disabled');
                }
                if (index > 0) {
                    $next.removeAttr('disabled').removeClass('disabled');
                }
                else {
                    $next.attr('disabled', 'disabled').addClass('disabled');
                }
            }
        };
        /**
         * Get index of the slide from custom slideName. Has to be a public method. Used in hash plugin
         * @param {String} hash
         * @returns {Number} Index of the slide.
         */
        LightGallery.prototype.getIndexFromUrl = function (hash) {
            if (hash === void 0) { hash = window.location.hash; }
            var slideName = hash.split('&slide=')[1];
            var _idx = 0;
            if (this.settings.customSlideName) {
                for (var index = 0; index < this.galleryItems.length; index++) {
                    var dynamicEl = this.galleryItems[index];
                    if (dynamicEl.slideName === slideName) {
                        _idx = index;
                        break;
                    }
                }
            }
            else {
                _idx = parseInt(slideName, 10);
            }
            return isNaN(_idx) ? 0 : _idx;
        };
        LightGallery.prototype.setTranslate = function ($el, xValue, yValue, scaleX, scaleY) {
            if (scaleX === void 0) { scaleX = 1; }
            if (scaleY === void 0) { scaleY = 1; }
            $el.css('transform', 'translate3d(' +
                xValue +
                'px, ' +
                yValue +
                'px, 0px) scale3d(' +
                scaleX +
                ', ' +
                scaleY +
                ', 1)');
        };
        LightGallery.prototype.mousewheel = function () {
            var _this = this;
            this.outer.on('mousewheel.lg', function (e) {
                if (!e.deltaY) {
                    return;
                }
                if (e.deltaY > 0) {
                    _this.goToPrevSlide();
                }
                else {
                    _this.goToNextSlide();
                }
                e.preventDefault();
            });
        };
        LightGallery.prototype.isSlideElement = function (target) {
            return (target.hasClass('lg-outer') ||
                target.hasClass('lg-item') ||
                target.hasClass('lg-img-wrap'));
        };
        LightGallery.prototype.isPosterElement = function (target) {
            var playButton = this.getSlideItem(this.index)
                .find('.lg-video-play-button')
                .get();
            return (target.hasClass('lg-video-poster') ||
                target.hasClass('lg-video-play-button') ||
                (playButton && playButton.contains(target.get())));
        };
        /**
         * Maximize minimize inline gallery.
         * @category lGPublicMethods
         */
        LightGallery.prototype.toggleMaximize = function () {
            var _this = this;
            this.getElementById('lg-maximize').on('click.lg', function () {
                _this.$container.toggleClass('lg-inline');
                _this.refreshOnResize();
            });
        };
        LightGallery.prototype.manageCloseGallery = function () {
            var _this = this;
            if (!this.settings.closable)
                return;
            var mousedown = false;
            this.getElementById('lg-close').on('click.lg', function () {
                _this.closeGallery();
            });
            if (this.settings.closeOnTap) {
                // If you drag the slide and release outside gallery gets close on chrome
                // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
                this.outer.on('mousedown.lg', function (e) {
                    var target = $LG(e.target);
                    if (_this.isSlideElement(target)) {
                        mousedown = true;
                    }
                    else {
                        mousedown = false;
                    }
                });
                this.outer.on('mousemove.lg', function () {
                    mousedown = false;
                });
                this.outer.on('mouseup.lg', function (e) {
                    var target = $LG(e.target);
                    if (_this.isSlideElement(target) && mousedown) {
                        if (!_this.outer.hasClass('lg-dragging')) {
                            _this.closeGallery();
                        }
                    }
                });
            }
        };
        /**
         * Close lightGallery if it is opened.
         *
         * @description If closable is false in the settings, you need to pass true via closeGallery method to force close gallery
         * @return returns the estimated time to close gallery completely including the close animation duration
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery();
         *  plugin.closeGallery();
         *
         */
        LightGallery.prototype.closeGallery = function (force) {
            var _this = this;
            if (!this.lgOpened || (!this.settings.closable && !force)) {
                return 0;
            }
            this.LGel.trigger(lGEvents.beforeClose);
            $LG(window).scrollTop(this.prevScrollTop);
            var currentItem = this.items[this.index];
            var transform;
            if (this.zoomFromOrigin && currentItem) {
                var _a = this.mediaContainerPosition, top_4 = _a.top, bottom = _a.bottom;
                var imageSize = utils.getSize(currentItem, this.$lgContent, top_4 + bottom, this.galleryItems[this.index].__slideVideoInfo &&
                    this.settings.videoMaxSize);
                transform = utils.getTransform(currentItem, this.$lgContent, top_4, bottom, imageSize);
            }
            if (this.zoomFromOrigin && transform) {
                this.outer.addClass('lg-closing lg-zoom-from-image');
                this.getSlideItem(this.index)
                    .addClass('lg-start-end-progress')
                    .css('transition-duration', this.settings.startAnimationDuration + 'ms')
                    .css('transform', transform);
            }
            else {
                this.outer.addClass('lg-hide-items');
                // lg-zoom-from-image is used for setting the opacity to 1 if zoomFromOrigin is true
                // If the closing item doesn't have the lg-size attribute, remove this class to avoid the closing css conflicts
                this.outer.removeClass('lg-zoom-from-image');
            }
            // Unbind all events added by lightGallery
            // @todo
            //this.$el.off('.lg.tm');
            this.destroyModules();
            this.lGalleryOn = false;
            this.isDummyImageRemoved = false;
            this.zoomFromOrigin = this.settings.zoomFromOrigin;
            clearTimeout(this.hideBarTimeout);
            this.hideBarTimeout = false;
            $LG(document.body).removeClass('lg-on lg-from-hash');
            this.outer.removeClass('lg-visible lg-components-open');
            // Resetting opacity to 0 isd required as  vertical swipe to close function adds inline opacity.
            this.$backdrop.removeClass('in').css('opacity', 0);
            var removeTimeout = this.zoomFromOrigin && transform
                ? Math.max(this.settings.startAnimationDuration, this.settings.backdropDuration)
                : this.settings.backdropDuration;
            this.$container.removeClass('lg-show-in');
            // Once the closign animation is completed and gallery is invisible
            setTimeout(function () {
                if (_this.zoomFromOrigin && transform) {
                    _this.outer.removeClass('lg-zoom-from-image');
                }
                _this.$container.removeClass('lg-show');
                // Need to remove inline opacity as it is used in the stylesheet as well
                _this.$backdrop
                    .removeAttr('style')
                    .css('transition-duration', _this.settings.backdropDuration + 'ms');
                _this.outer.removeClass("lg-closing " + _this.settings.startClass);
                _this.getSlideItem(_this.index).removeClass('lg-start-end-progress');
                _this.$inner.empty();
                if (_this.lgOpened) {
                    _this.LGel.trigger(lGEvents.afterClose, {
                        instance: _this,
                    });
                }
                _this.LGel.get().focus();
                _this.lgOpened = false;
            }, removeTimeout + 100);
            return removeTimeout + 100;
        };
        LightGallery.prototype.destroyModules = function (destroy) {
            this.plugins.forEach(function (module) {
                try {
                    if (destroy) {
                        module.destroy();
                    }
                    else {
                        module.closeGallery && module.closeGallery();
                    }
                }
                catch (err) {
                    console.warn("lightGallery:- make sure lightGallery module is properly destroyed");
                }
            });
            for (var key in this.plugins) {
                if (this.plugins[key]) {
                    try {
                        if (destroy) {
                            this.plugins[key].destroy();
                        }
                        else {
                            this.plugins[key].closeGallery &&
                                this.plugins[key].closeGallery();
                        }
                    }
                    catch (err) {
                        console.warn("lightGallery:- make sure lightGallery " + key + " module is properly destroyed");
                    }
                }
            }
        };
        /**
         * Destroy lightGallery.
         * Destroy lightGallery and its plugin instances completely
         *
         * @description This method also calls CloseGallery function internally
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery();
         *  plugin.destroy();
         *
         */
        LightGallery.prototype.destroy = function () {
            var _this = this;
            var closeTimeout = this.closeGallery(true);
            setTimeout(function () {
                _this.destroyModules(true);
                if (!_this.settings.dynamic) {
                    for (var index = 0; index < _this.items.length; index++) {
                        var element = _this.items[index];
                        var $element = $LG(element);
                        $element.off("click.lgcustom-item-" + $element.attr('data-lg-id'));
                    }
                }
                $LG(window).off(".lg.global" + _this.lgId);
                _this.LGel.off('.lg');
                _this.$container.remove();
            }, closeTimeout);
        };
        return LightGallery;
    }());

    function lightGallery(el, options) {
        if (!el) {
            return;
        }
        try {
            return new LightGallery(el, options);
        }
        catch (err) {
            console.error('lightGallery has not initiated properly', err);
        }
    }

    return lightGallery;

})));
//# sourceMappingURL=lightgallery.umd.js.map

;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgVideo = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var videoSettings = {
        autoplayFirstVideo: true,
        youTubePlayerParams: false,
        vimeoPlayerParams: false,
        wistiaPlayerParams: false,
        gotoNextSlideOnVideoEnd: true,
        autoplayVideoOnSlide: false,
        videojs: false,
        videojsOptions: {},
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
    };

    /**
     * Video module for lightGallery
     * Supports HTML5, YouTube, Vimeo, wistia videos
     *
     *
     * @ref Wistia
     * https://wistia.com/support/integrations/wordpress(How to get url)
     * https://wistia.com/support/developers/embed-options#using-embed-options
     * https://wistia.com/support/developers/player-api
     * https://wistia.com/support/developers/construct-an-embed-code
     * http://jsfiddle.net/xvnm7xLm/
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
     * https://wistia.com/support/embed-and-share/sharing-videos
     * https://private-sharing.wistia.com/medias/mwhrulrucj
     *
     * @ref Youtube
     * https://developers.google.com/youtube/player_parameters#enablejsapi
     * https://developers.google.com/youtube/iframe_api_reference
     *
     */
    function param(obj) {
        return Object.keys(obj)
            .map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        })
            .join('&');
    }
    var Video = /** @class */ (function () {
        function Video(instance) {
            // get lightGallery core plugin instance
            this.core = instance;
            this.settings = __assign(__assign({}, videoSettings), this.core.settings);
            this.init();
            return this;
        }
        Video.prototype.init = function () {
            var _this = this;
            /**
             * Event triggered when video url found without poster
             * Append video HTML
             * Play if autoplayFirstVideo is true
             */
            this.core.LGel.on(lGEvents.hasVideo + ".video", this.onHasVideo.bind(this));
            if (this.core.galleryItems.length > 1 &&
                (this.core.settings.enableSwipe || this.core.settings.enableDrag)) {
                this.core.LGel.on(lGEvents.posterClick + ".video", function () {
                    var $el = _this.core.getSlideItem(_this.core.index);
                    _this.loadVideoOnPosterClick($el);
                });
            }
            else {
                // For IE 9 and bellow
                this.core.outer
                    .find('.lg-item')
                    .first()
                    .on('click.lg', function () {
                    var $el = _this.core.getSlideItem(_this.core.index);
                    _this.loadVideoOnPosterClick($el);
                });
            }
            // @desc fired immediately before each slide transition.
            this.core.LGel.on(lGEvents.beforeSlide + ".video", this.onBeforeSlide.bind(this));
            // @desc fired immediately after each slide transition.
            this.core.LGel.on(lGEvents.afterSlide + ".video", this.onAfterSlide.bind(this));
        };
        /**
         * @desc Event triggered when video url or poster found
         * Append video HTML is poster is not given
         * Play if autoplayFirstVideo is true
         *
         * @param {Event} event - Javascript Event object.
         */
        Video.prototype.onHasVideo = function (event) {
            var _a = event.detail, index = _a.index, src = _a.src, html5Video = _a.html5Video, hasPoster = _a.hasPoster, isFirstSlide = _a.isFirstSlide;
            if (!hasPoster) {
                // All functions are called separately if poster exist in loadVideoOnPosterClick function
                this.appendVideos(this.core.getSlideItem(index), {
                    src: src,
                    addClass: 'lg-object',
                    index: index,
                    html5Video: html5Video,
                });
                // Automatically navigate to next slide once video reaches the end.
                this.gotoNextSlideOnVideoEnd(src, index);
            }
            if (this.settings.autoplayFirstVideo && isFirstSlide) {
                if (hasPoster) {
                    var $slide = this.core.getSlideItem(index);
                    this.loadVideoOnPosterClick($slide);
                }
                else {
                    this.playVideo(index);
                }
            }
        };
        /**
         * @desc fired immediately before each slide transition.
         * Pause the previous video
         * Hide the download button if the slide contains YouTube, Vimeo, or Wistia videos.
         *
         * @param {Event} event - Javascript Event object.
         * @param {number} prevIndex - Previous index of the slide.
         * @param {number} index - Current index of the slide
         */
        Video.prototype.onBeforeSlide = function (event) {
            var _a = event.detail, prevIndex = _a.prevIndex, index = _a.index;
            this.pauseVideo(prevIndex);
            var _videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
            if (_videoInfo.youtube || _videoInfo.vimeo || _videoInfo.wistia) {
                this.core.outer.addClass('lg-hide-download');
            }
        };
        /**
         * @desc fired immediately after each slide transition.
         * Play video if autoplayVideoOnSlide option is enabled.
         *
         * @param {Event} event - Javascript Event object.
         * @param {number} prevIndex - Previous index of the slide.
         * @param {number} index - Current index of the slide
         */
        Video.prototype.onAfterSlide = function (event) {
            var _this = this;
            var index = event.detail.index;
            if (this.settings.autoplayVideoOnSlide && this.core.lGalleryOn) {
                setTimeout(function () {
                    var $slide = _this.core.getSlideItem(index);
                    if (!$slide.hasClass('lg-video-loaded')) {
                        _this.loadVideoOnPosterClick($slide);
                    }
                    else {
                        _this.playVideo(index);
                    }
                }, 100);
            }
        };
        /**
         * Play HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
         * @param {number} index - Index of the slide
         */
        Video.prototype.playVideo = function (index) {
            this.controlVideo(index, 'play');
        };
        /**
         * Pause HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
         * @param {number} index - Index of the slide
         */
        Video.prototype.pauseVideo = function (index) {
            this.controlVideo(index, 'pause');
        };
        Video.prototype.getVideoHtml = function (src, addClass, index, html5Video) {
            var video = '';
            var videoInfo = this.core.galleryItems[index]
                .__slideVideoInfo || {};
            var currentGalleryItem = this.core.galleryItems[index];
            var videoTitle = currentGalleryItem.title || currentGalleryItem.alt;
            videoTitle = videoTitle ? 'title="' + videoTitle + '"' : '';
            var commonIframeProps = "allowtransparency=\"true\" \n            frameborder=\"0\" \n            scrolling=\"no\" \n            allowfullscreen \n            mozallowfullscreen \n            webkitallowfullscreen \n            oallowfullscreen \n            msallowfullscreen";
            if (videoInfo.youtube) {
                var videoId = 'lg-youtube' + index;
                var youTubePlayerParams = "?wmode=opaque&autoplay=0&enablejsapi=1";
                var playerParams = youTubePlayerParams +
                    (this.settings.youTubePlayerParams
                        ? '&' + param(this.settings.youTubePlayerParams)
                        : '');
                video = "<iframe allow=\"autoplay\" id=" + videoId + " class=\"lg-video-object lg-youtube " + addClass + "\" " + videoTitle + " src=\"//www.youtube.com/embed/" + (videoInfo.youtube[1] + playerParams) + "\" " + commonIframeProps + "></iframe>";
            }
            else if (videoInfo.vimeo) {
                var videoId = 'lg-vimeo' + index;
                var playerParams = param(this.settings.vimeoPlayerParams);
                video = "<iframe allow=\"autoplay\" id=" + videoId + " class=\"lg-video-object lg-vimeo " + addClass + "\" " + videoTitle + " src=\"//player.vimeo.com/video/" + (videoInfo.vimeo[1] + playerParams) + "\" " + commonIframeProps + "></iframe>";
            }
            else if (videoInfo.wistia) {
                var wistiaId = 'lg-wistia' + index;
                var playerParams = param(this.settings.wistiaPlayerParams);
                video = "<iframe allow=\"autoplay\" id=\"" + wistiaId + "\" src=\"//fast.wistia.net/embed/iframe/" + (videoInfo.wistia[4] + playerParams) + "\" " + videoTitle + " class=\"wistia_embed lg-video-object lg-wistia " + addClass + "\" name=\"wistia_embed\" " + commonIframeProps + "></iframe>";
            }
            else if (videoInfo.html5) {
                var html5VideoMarkup = '';
                for (var i = 0; i < html5Video.source.length; i++) {
                    html5VideoMarkup += "<source src=\"" + html5Video.source[i].src + "\" type=\"" + html5Video.source[i].type + "\">";
                }
                var html5VideoAttrs_1 = '';
                var videoAttributes_1 = html5Video.attributes || {};
                Object.keys(videoAttributes_1 || {}).forEach(function (key) {
                    html5VideoAttrs_1 += key + "=\"" + videoAttributes_1[key] + "\" ";
                });
                video = "<video class=\"lg-video-object lg-html5 " + (this.settings.videojs ? 'video-js' : '') + "\" " + html5VideoAttrs_1 + ">\n                " + html5VideoMarkup + "\n                Your browser does not support HTML5 video.\n            </video>";
            }
            return video;
        };
        /**
         * @desc - Append videos to the slide
         *
         * @param {HTMLElement} el - slide element
         * @param {Object} videoParams - Video parameters, Contains src, class, index, htmlVideo
         */
        Video.prototype.appendVideos = function (el, videoParams) {
            var _a;
            var videoHtml = this.getVideoHtml(videoParams.src, videoParams.addClass, videoParams.index, videoParams.html5Video);
            el.find('.lg-video-cont').append(videoHtml);
            var $videoElement = el.find('.lg-video-object').first();
            if (this.settings.videojs && ((_a = this.core.galleryItems[videoParams.index].__slideVideoInfo) === null || _a === void 0 ? void 0 : _a.html5)) {
                try {
                    return videojs($videoElement.get(), this.settings.videojsOptions);
                }
                catch (e) {
                    console.error('lightGallery:- Make sure you have included videojs');
                }
            }
        };
        Video.prototype.gotoNextSlideOnVideoEnd = function (src, index) {
            var _this = this;
            var $videoElement = this.core
                .getSlideItem(index)
                .find('.lg-video-object')
                .first();
            var videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
            if (this.settings.gotoNextSlideOnVideoEnd) {
                if (videoInfo.html5) {
                    $videoElement.on('ended', function () {
                        _this.core.goToNextSlide();
                    });
                }
                else if (videoInfo.vimeo) {
                    try {
                        // https://github.com/vimeo/player.js/#ended
                        new Vimeo.Player($videoElement.get()).on('ended', function () {
                            _this.core.goToNextSlide();
                        });
                    }
                    catch (e) {
                        console.error('lightGallery:- Make sure you have included //github.com/vimeo/player.js');
                    }
                }
                else if (videoInfo.wistia) {
                    try {
                        window._wq = window._wq || [];
                        // @todo Event is gettign triggered multiple times
                        window._wq.push({
                            id: $videoElement.attr('id'),
                            onReady: function (video) {
                                video.bind('end', function () {
                                    _this.core.goToNextSlide();
                                });
                            },
                        });
                    }
                    catch (e) {
                        console.error('lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js');
                    }
                }
            }
        };
        Video.prototype.controlVideo = function (index, action) {
            var $videoElement = this.core
                .getSlideItem(index)
                .find('.lg-video-object')
                .first();
            var videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
            if (!$videoElement.get())
                return;
            if (videoInfo.youtube) {
                try {
                    $videoElement.get().contentWindow.postMessage("{\"event\":\"command\",\"func\":\"" + action + "Video\",\"args\":\"\"}", '*');
                }
                catch (e) {
                    console.error("lightGallery:- " + e);
                }
            }
            else if (videoInfo.vimeo) {
                try {
                    new Vimeo.Player($videoElement.get())[action]();
                }
                catch (e) {
                    console.error('lightGallery:- Make sure you have included //github.com/vimeo/player.js');
                }
            }
            else if (videoInfo.html5) {
                if (this.settings.videojs) {
                    try {
                        videojs($videoElement.get())[action]();
                    }
                    catch (e) {
                        console.error('lightGallery:- Make sure you have included videojs');
                    }
                }
                else {
                    $videoElement.get()[action]();
                }
            }
            else if (videoInfo.wistia) {
                try {
                    window._wq = window._wq || [];
                    // @todo Find a way to destroy wistia player instance
                    window._wq.push({
                        id: $videoElement.attr('id'),
                        onReady: function (video) {
                            video[action]();
                        },
                    });
                }
                catch (e) {
                    console.error('lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js');
                }
            }
        };
        Video.prototype.loadVideoOnPosterClick = function ($el) {
            var _this = this;
            // check slide has poster
            if (!$el.hasClass('lg-video-loaded')) {
                // check already video element present
                if (!$el.hasClass('lg-has-video')) {
                    $el.addClass('lg-has-video');
                    var _html = void 0;
                    var _src = this.core.galleryItems[this.core.index].src;
                    var video = this.core.galleryItems[this.core.index].video;
                    if (video) {
                        _html =
                            typeof video === 'string' ? JSON.parse(video) : video;
                    }
                    var videoJsPlayer_1 = this.appendVideos($el, {
                        src: _src,
                        addClass: '',
                        index: this.core.index,
                        html5Video: _html,
                    });
                    this.gotoNextSlideOnVideoEnd(_src, this.core.index);
                    var $tempImg = $el.find('.lg-object').first().get();
                    // @todo make sure it is working
                    $el.find('.lg-video-cont').first().append($tempImg);
                    $el.addClass('lg-video-loading');
                    videoJsPlayer_1 &&
                        videoJsPlayer_1.ready(function () {
                            videoJsPlayer_1.on('loadedmetadata', function () {
                                _this.onVideoLoadAfterPosterClick($el, _this.core.index);
                            });
                        });
                    $el.find('.lg-video-object')
                        .first()
                        .on('load.lg error.lg loadeddata.lg', function () {
                        setTimeout(function () {
                            _this.onVideoLoadAfterPosterClick($el, _this.core.index);
                        }, 50);
                    });
                }
                else {
                    this.playVideo(this.core.index);
                }
            }
        };
        Video.prototype.onVideoLoadAfterPosterClick = function ($el, index) {
            $el.addClass('lg-video-loaded');
            this.playVideo(index);
        };
        Video.prototype.destroy = function () {
            this.core.LGel.off('.lg.video');
            this.core.LGel.off('.video');
        };
        return Video;
    }());

    return Video;

})));
//# sourceMappingURL=lg-video.umd.js.map

;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgFullscreen = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var fullscreenSettings = {
        fullScreen: true,
    };

    var FullScreen = /** @class */ (function () {
        function FullScreen(instance, $LG) {
            // get lightGallery core plugin instance
            this.core = instance;
            this.$LG = $LG;
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, fullscreenSettings), this.core.settings);
            this.init();
            return this;
        }
        FullScreen.prototype.init = function () {
            var fullScreen = '';
            if (this.settings.fullScreen) {
                // check for fullscreen browser support
                if (!document.fullscreenEnabled &&
                    !document.webkitFullscreenEnabled &&
                    !document.mozFullScreenEnabled &&
                    !document.msFullscreenEnabled) {
                    return;
                }
                else {
                    fullScreen =
                        '<button type="button aria-label="Toggle fullscreen" class="lg-fullscreen lg-icon"></button>';
                    this.core.$toolbar.append(fullScreen);
                    this.fullScreen();
                }
            }
        };
        FullScreen.prototype.isFullScreen = function () {
            return (document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement ||
                document.msFullscreenElement);
        };
        FullScreen.prototype.requestFullscreen = function () {
            var el = document.documentElement;
            if (el.requestFullscreen) {
                el.requestFullscreen();
            }
            else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            }
            else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            }
            else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            }
        };
        FullScreen.prototype.exitFullscreen = function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        };
        // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
        FullScreen.prototype.fullScreen = function () {
            var _this = this;
            this.$LG(document).on("fullscreenchange.lg.global" + this.core.lgId + " \n            webkitfullscreenchange.lg.global" + this.core.lgId + " \n            mozfullscreenchange.lg.global" + this.core.lgId + " \n            MSFullscreenChange.lg.global" + this.core.lgId, function () {
                if (!_this.core.lgOpened)
                    return;
                _this.core.outer.toggleClass('lg-fullscreen-on');
            });
            this.core.outer
                .find('.lg-fullscreen')
                .first()
                .on('click.lg', function () {
                if (_this.isFullScreen()) {
                    _this.exitFullscreen();
                }
                else {
                    _this.requestFullscreen();
                }
            });
        };
        FullScreen.prototype.closeGallery = function () {
            // exit from fullscreen if activated
            if (this.isFullScreen()) {
                this.exitFullscreen();
            }
        };
        FullScreen.prototype.destroy = function () {
            this.$LG(document).off("fullscreenchange.lg.global" + this.core.lgId + " \n            webkitfullscreenchange.lg.global" + this.core.lgId + " \n            mozfullscreenchange.lg.global" + this.core.lgId + " \n            MSFullscreenChange.lg.global" + this.core.lgId);
        };
        return FullScreen;
    }());

    return FullScreen;

})));
//# sourceMappingURL=lg-fullscreen.umd.js.map

;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgZoom = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var zoomSettings = {
        scale: 1,
        zoom: true,
        actualSize: true,
        showZoomInOutIcons: false,
        actualSizeIcons: {
            zoomIn: 'lg-zoom-in',
            zoomOut: 'lg-zoom-out',
        },
        enableZoomAfter: 300,
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
    };

    var Zoom = /** @class */ (function () {
        function Zoom(instance, $LG) {
            // get lightGallery core plugin instance
            this.core = instance;
            this.$LG = $LG;
            this.settings = __assign(__assign({}, zoomSettings), this.core.settings);
            if (this.settings.zoom) {
                this.init();
                // Store the zoomable timeout value just to clear it while closing
                this.zoomableTimeout = false;
                this.positionChanged = false;
                // Set the initial value center
                this.pageX = this.core.outer.width() / 2;
                this.pageY =
                    this.core.outer.height() / 2 + this.$LG(window).scrollTop();
                this.scale = 1;
            }
            return this;
        }
        // Append Zoom controls. Actual size, Zoom-in, Zoom-out
        Zoom.prototype.buildTemplates = function () {
            var zoomIcons = this.settings.showZoomInOutIcons
                ? "<button id=\"" + this.core.getIdName('lg-zoom-in') + "\" type=\"button\" class=\"lg-zoom-in lg-icon\"></button><button id=\"" + this.core.getIdName('lg-zoom-out') + "\" type=\"button\" class=\"lg-zoom-out lg-icon\"></button>"
                : '';
            if (this.settings.actualSize) {
                zoomIcons += "<button id=\"" + this.core.getIdName('lg-actual-size') + "\" type=\"button\" class=\"" + this.settings.actualSizeIcons.zoomIn + " lg-icon\"></button>";
            }
            this.core.outer.addClass('lg-use-transition-for-zoom');
            this.core.$toolbar.first().append(zoomIcons);
        };
        /**
         * @desc Enable zoom option only once the image is completely loaded
         * If zoomFromOrigin is true, Zoom is enabled once the dummy image has been inserted
         *
         * Zoom styles are defined under lg-zoomable CSS class.
         */
        Zoom.prototype.enableZoom = function (event) {
            var _this = this;
            // delay will be 0 except first time
            var _speed = this.settings.enableZoomAfter + event.detail.delay;
            // set _speed value 0 if gallery opened from direct url and if it is first slide
            if (this.$LG('body').first().hasClass('lg-from-hash') &&
                event.detail.delay) {
                // will execute only once
                _speed = 0;
            }
            else {
                // Remove lg-from-hash to enable starting animation.
                this.$LG('body').first().removeClass('lg-from-hash');
            }
            this.zoomableTimeout = setTimeout(function () {
                _this.core.getSlideItem(event.detail.index).addClass('lg-zoomable');
            }, _speed + 30);
        };
        Zoom.prototype.enableZoomOnSlideItemLoad = function () {
            // Add zoomable class
            this.core.LGel.on(lGEvents.slideItemLoad + ".zoom", this.enableZoom.bind(this));
        };
        Zoom.prototype.getModifier = function (rotateValue, axis, el) {
            var originalRotate = rotateValue;
            rotateValue = Math.abs(rotateValue);
            var transformValues = this.getCurrentTransform(el);
            if (!transformValues) {
                return 1;
            }
            var modifier = 1;
            if (axis === 'X') {
                var flipHorizontalValue = Math.sign(parseFloat(transformValues[0]));
                if (rotateValue === 0 || rotateValue === 180) {
                    modifier = 1;
                }
                else if (rotateValue === 90) {
                    if ((originalRotate === -90 && flipHorizontalValue === 1) ||
                        (originalRotate === 90 && flipHorizontalValue === -1)) {
                        modifier = -1;
                    }
                    else {
                        modifier = 1;
                    }
                }
                modifier = modifier * flipHorizontalValue;
            }
            else {
                var flipVerticalValue = Math.sign(parseFloat(transformValues[3]));
                if (rotateValue === 0 || rotateValue === 180) {
                    modifier = 1;
                }
                else if (rotateValue === 90) {
                    var sinX = parseFloat(transformValues[1]);
                    var sinMinusX = parseFloat(transformValues[2]);
                    modifier = Math.sign(sinX * sinMinusX * originalRotate * flipVerticalValue);
                }
                modifier = modifier * flipVerticalValue;
            }
            return modifier;
        };
        Zoom.prototype.getImageSize = function ($image, rotateValue, axis) {
            var imageSizes = {
                y: 'offsetHeight',
                x: 'offsetWidth',
            };
            if (rotateValue === 90) {
                // Swap axis
                if (axis === 'x') {
                    axis = 'y';
                }
                else {
                    axis = 'x';
                }
            }
            return $image[imageSizes[axis]];
        };
        Zoom.prototype.getDragCords = function (e, rotateValue) {
            if (rotateValue === 90) {
                return {
                    x: e.pageY,
                    y: e.pageX,
                };
            }
            else {
                return {
                    x: e.pageX,
                    y: e.pageY,
                };
            }
        };
        Zoom.prototype.getSwipeCords = function (e, rotateValue) {
            var x = e.targetTouches[0].pageX;
            var y = e.targetTouches[0].pageY;
            if (rotateValue === 90) {
                return {
                    x: y,
                    y: x,
                };
            }
            else {
                return {
                    x: x,
                    y: y,
                };
            }
        };
        Zoom.prototype.getDragAllowedAxises = function ($image, rotateValue) {
            var $lg = this.core.$lgContent.get();
            var scale = parseFloat($image.attr('data-scale')) || 1;
            var imgEl = $image.get();
            var allowY = this.getImageSize(imgEl, rotateValue, 'y') * scale >
                $lg.clientHeight;
            var allowX = this.getImageSize(imgEl, rotateValue, 'x') * scale >
                $lg.clientWidth;
            if (rotateValue === 90) {
                return {
                    allowX: allowY,
                    allowY: allowX,
                };
            }
            else {
                return {
                    allowX: allowX,
                    allowY: allowY,
                };
            }
        };
        /**
         *
         * @param {Element} el
         * @return matrix(cos(X), sin(X), -sin(X), cos(X), 0, 0);
         * Get the current transform value
         */
        Zoom.prototype.getCurrentTransform = function (el) {
            if (!el) {
                return;
            }
            var st = window.getComputedStyle(el, null);
            var tm = st.getPropertyValue('-webkit-transform') ||
                st.getPropertyValue('-moz-transform') ||
                st.getPropertyValue('-ms-transform') ||
                st.getPropertyValue('-o-transform') ||
                st.getPropertyValue('transform') ||
                'none';
            if (tm !== 'none') {
                return tm.split('(')[1].split(')')[0].split(',');
            }
            return;
        };
        Zoom.prototype.getCurrentRotation = function (el) {
            if (!el) {
                return 0;
            }
            var values = this.getCurrentTransform(el);
            if (values) {
                return Math.round(Math.atan2(parseFloat(values[1]), parseFloat(values[0])) *
                    (180 / Math.PI));
                // If you want rotate in 360
                //return (angle < 0 ? angle + 360 : angle);
            }
            return 0;
        };
        /**
         * @desc Image zoom
         * Translate the wrap and scale the image to get better user experience
         *
         * @param {String} scale - Zoom decrement/increment value
         */
        Zoom.prototype.zoomImage = function (scale) {
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-image')
                .first();
            var imageNode = $image.get();
            if (!imageNode)
                return;
            var containerRect = this.core.outer.get().getBoundingClientRect();
            // Find offset manually to avoid issue after zoom
            var offsetX = (containerRect.width - imageNode.offsetWidth) / 2 +
                containerRect.left;
            var offsetY = (containerRect.height - imageNode.offsetHeight) / 2 +
                this.$LG(window).scrollTop() +
                containerRect.top;
            var originalX;
            var originalY;
            if (scale === 1) {
                this.positionChanged = false;
            }
            if (this.positionChanged) {
                originalX =
                    parseFloat($image.parent().attr('data-x')) /
                        (parseFloat($image.attr('data-scale')) - 1);
                originalY =
                    parseFloat($image.parent().attr('data-y')) /
                        (parseFloat($image.attr('data-scale')) - 1);
                this.pageX = originalX + offsetX;
                this.pageY = originalY + offsetY;
                this.positionChanged = false;
            }
            var _x = this.pageX - offsetX;
            var _y = this.pageY - offsetY;
            var x = (scale - 1) * _x;
            var y = (scale - 1) * _y;
            this.setZoomStyles({
                x: x,
                y: y,
                scale: scale,
            });
        };
        /**
         * @desc apply scale3d to image and translate to image wrap
         * @param {style} X,Y and scale
         */
        Zoom.prototype.setZoomStyles = function (style) {
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-image')
                .first();
            var $dummyImage = this.core.outer
                .find('.lg-current .lg-dummy-img')
                .first();
            var $imageWrap = $image.parent();
            $image
                .attr('data-scale', style.scale + '')
                .css('transform', 'scale3d(' + style.scale + ', ' + style.scale + ', 1)');
            $dummyImage.css('transform', 'scale3d(' + style.scale + ', ' + style.scale + ', 1)');
            var transform = 'translate3d(-' + style.x + 'px, -' + style.y + 'px, 0)';
            $imageWrap.css('transform', transform);
            $imageWrap.attr('data-x', style.x).attr('data-y', style.y);
        };
        /**
         * @param index - Index of the current slide
         * @param event - event will be available only if the function is called on clicking/taping the imags
         */
        Zoom.prototype.setActualSize = function (index, event) {
            var _this = this;
            var currentItem = this.core.galleryItems[this.core.index];
            // Allow zoom only on image
            if (!currentItem.src) {
                return;
            }
            var scale = this.getCurrentImageActualSizeScale();
            if (this.core.outer.hasClass('lg-zoomed')) {
                this.scale = 1;
            }
            else {
                this.scale = this.getScale(scale);
            }
            this.setPageCords(event);
            this.beginZoom(this.scale);
            this.zoomImage(this.scale);
            setTimeout(function () {
                _this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
            }, 10);
        };
        Zoom.prototype.getNaturalWidth = function (index) {
            var $image = this.core.getSlideItem(index).find('.lg-image').first();
            var naturalWidth = this.core.galleryItems[index].width;
            return naturalWidth
                ? parseFloat(naturalWidth)
                : $image.get().naturalWidth;
        };
        Zoom.prototype.getActualSizeScale = function (naturalWidth, width) {
            var _scale;
            var scale;
            if (naturalWidth > width) {
                _scale = naturalWidth / width;
                scale = _scale || 2;
            }
            else {
                scale = 1;
            }
            return scale;
        };
        Zoom.prototype.getCurrentImageActualSizeScale = function () {
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-image')
                .first();
            var width = $image.get().offsetWidth;
            var naturalWidth = this.getNaturalWidth(this.core.index) || width;
            return this.getActualSizeScale(naturalWidth, width);
        };
        Zoom.prototype.getPageCords = function (event) {
            var cords = {};
            if (event) {
                cords.x = event.pageX || event.targetTouches[0].pageX;
                cords.y = event.pageY || event.targetTouches[0].pageY;
            }
            else {
                var containerRect = this.core.outer.get().getBoundingClientRect();
                cords.x = containerRect.width / 2 + containerRect.left;
                cords.y =
                    containerRect.height / 2 +
                        this.$LG(window).scrollTop() +
                        containerRect.top;
            }
            return cords;
        };
        Zoom.prototype.setPageCords = function (event) {
            var pageCords = this.getPageCords(event);
            this.pageX = pageCords.x;
            this.pageY = pageCords.y;
        };
        // If true, zoomed - in else zoomed out
        Zoom.prototype.beginZoom = function (scale) {
            this.core.outer.removeClass('lg-zoom-drag-transition lg-zoom-dragging');
            if (scale > 1) {
                this.core.outer.addClass('lg-zoomed');
                var $actualSize = this.core.getElementById('lg-actual-size');
                $actualSize
                    .removeClass(this.settings.actualSizeIcons.zoomIn)
                    .addClass(this.settings.actualSizeIcons.zoomOut);
            }
            else {
                this.resetZoom();
            }
            return scale > 1;
        };
        Zoom.prototype.getScale = function (scale) {
            var actualSizeScale = this.getCurrentImageActualSizeScale();
            if (scale < 1) {
                scale = 1;
            }
            else if (scale > actualSizeScale) {
                scale = actualSizeScale;
            }
            return scale;
        };
        Zoom.prototype.init = function () {
            var _this = this;
            this.buildTemplates();
            this.enableZoomOnSlideItemLoad();
            var tapped = null;
            this.core.outer.on('dblclick.lg', function (event) {
                if (!_this.$LG(event.target).hasClass('lg-image')) {
                    return;
                }
                _this.setActualSize(_this.core.index, event);
            });
            this.core.outer.on('touchstart.lg', function (event) {
                var $target = _this.$LG(event.target);
                if (event.targetTouches.length === 1 &&
                    $target.hasClass('lg-image')) {
                    if (!tapped) {
                        tapped = setTimeout(function () {
                            tapped = null;
                        }, 300);
                    }
                    else {
                        clearTimeout(tapped);
                        tapped = null;
                        _this.setActualSize(_this.core.index, event);
                    }
                    event.preventDefault();
                }
            });
            // Update zoom on resize and orientationchange
            this.core.LGel.on(lGEvents.containerResize + ".zoom", function () {
                if (!_this.core.lgOpened)
                    return;
                _this.setPageCords();
                _this.zoomImage(_this.scale);
            });
            this.core.getElementById('lg-zoom-out').on('click.lg', function () {
                if (_this.core.outer.find('.lg-current .lg-image').get()) {
                    _this.scale -= _this.settings.scale;
                    _this.scale = _this.getScale(_this.scale);
                    _this.beginZoom(_this.scale);
                    _this.zoomImage(_this.scale);
                }
            });
            this.core.getElementById('lg-zoom-in').on('click.lg', function () {
                _this.zoomIn();
            });
            this.core.getElementById('lg-actual-size').on('click.lg', function () {
                _this.setActualSize(_this.core.index);
            });
            this.core.LGel.on(lGEvents.beforeOpen + ".zoom", function () {
                _this.core.outer.find('.lg-item').removeClass('lg-zoomable');
            });
            // Reset zoom on slide change
            this.core.LGel.on(lGEvents.afterSlide + ".zoom", function (event) {
                var prevIndex = event.detail.prevIndex;
                _this.scale = 1;
                _this.resetZoom(prevIndex);
            });
            // Drag option after zoom
            this.zoomDrag();
            this.pinchZoom();
            this.zoomSwipe();
        };
        Zoom.prototype.zoomIn = function (scale) {
            var currentItem = this.core.galleryItems[this.core.index];
            // Allow zoom only on image
            if (!currentItem.src) {
                return;
            }
            if (scale) {
                this.scale = scale;
            }
            else {
                this.scale += this.settings.scale;
            }
            this.scale = this.getScale(this.scale);
            this.beginZoom(this.scale);
            this.zoomImage(this.scale);
        };
        // Reset zoom effect
        Zoom.prototype.resetZoom = function (index) {
            this.core.outer.removeClass('lg-zoomed lg-zoom-drag-transition');
            var $actualSize = this.core.getElementById('lg-actual-size');
            var $item = this.core.getSlideItem(index !== undefined ? index : this.core.index);
            $actualSize
                .removeClass(this.settings.actualSizeIcons.zoomOut)
                .addClass(this.settings.actualSizeIcons.zoomIn);
            $item.find('.lg-img-wrap').first().removeAttr('style data-x data-y');
            $item.find('.lg-image').first().removeAttr('style data-scale');
            // Reset pagx pagy values to center
            this.setPageCords();
        };
        Zoom.prototype.getTouchDistance = function (e) {
            return Math.sqrt((e.targetTouches[0].pageX - e.targetTouches[1].pageX) *
                (e.targetTouches[0].pageX - e.targetTouches[1].pageX) +
                (e.targetTouches[0].pageY - e.targetTouches[1].pageY) *
                    (e.targetTouches[0].pageY - e.targetTouches[1].pageY));
        };
        Zoom.prototype.pinchZoom = function () {
            var _this = this;
            var startDist = 0;
            var pinchStarted = false;
            var initScale = 1;
            var $item = this.core.getSlideItem(this.core.index);
            this.core.$inner.on('touchstart.lg', function (e) {
                $item = _this.core.getSlideItem(_this.core.index);
                e.preventDefault();
                if (e.targetTouches.length === 2 &&
                    (_this.$LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target))) {
                    initScale = _this.scale || 1;
                    _this.core.outer.removeClass('lg-zoom-drag-transition lg-zoom-dragging');
                    _this.core.touchAction = 'pinch';
                    startDist = _this.getTouchDistance(e);
                }
            });
            this.core.$inner.on('touchmove.lg', function (e) {
                e.preventDefault();
                if (e.targetTouches.length === 2 &&
                    _this.core.touchAction === 'pinch' &&
                    (_this.$LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target))) {
                    var endDist = _this.getTouchDistance(e);
                    var distance = startDist - endDist;
                    if (!pinchStarted && Math.abs(distance) > 5) {
                        pinchStarted = true;
                    }
                    if (pinchStarted) {
                        _this.scale = Math.max(1, initScale + -distance * 0.008);
                        _this.zoomImage(_this.scale);
                    }
                }
            });
            this.core.$inner.on('touchend.lg', function (e) {
                if (_this.core.touchAction === 'pinch' &&
                    (_this.$LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target))) {
                    pinchStarted = false;
                    startDist = 0;
                    if (_this.scale <= 1) {
                        _this.resetZoom();
                    }
                    else {
                        _this.scale = _this.getScale(_this.scale);
                        _this.zoomImage(_this.scale);
                        _this.core.outer.addClass('lg-zoomed');
                    }
                    _this.core.touchAction = undefined;
                }
            });
        };
        Zoom.prototype.touchendZoom = function (startCoords, endCoords, allowX, allowY, touchDuration, rotateValue) {
            var rotateEl = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .first()
                .get();
            var distanceXnew = endCoords.x - startCoords.x;
            var distanceYnew = endCoords.y - startCoords.y;
            var speedX = Math.abs(distanceXnew) / touchDuration + 1;
            var speedY = Math.abs(distanceYnew) / touchDuration + 1;
            if (speedX > 2) {
                speedX += 1;
            }
            if (speedY > 2) {
                speedY += 1;
            }
            distanceXnew = distanceXnew * speedX;
            distanceYnew = distanceYnew * speedY;
            var _LGel = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-wrap')
                .first();
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-object')
                .first();
            var dataX = parseFloat(_LGel.attr('data-x')) || 0;
            var dataY = parseFloat(_LGel.attr('data-y')) || 0;
            var distance = {};
            distance.x =
                -Math.abs(dataX) +
                    distanceXnew * this.getModifier(rotateValue, 'X', rotateEl);
            distance.y =
                -Math.abs(dataY) +
                    distanceYnew * this.getModifier(rotateValue, 'Y', rotateEl);
            var possibleSwipeCords = this.getPossibleSwipeDragCords($image, rotateValue);
            if (Math.abs(distanceXnew) > 15 || Math.abs(distanceYnew) > 15) {
                if (allowY) {
                    if (distance.y <= -possibleSwipeCords.maxY) {
                        distance.y = -possibleSwipeCords.maxY;
                    }
                    else if (distance.y >= -possibleSwipeCords.minY) {
                        distance.y = -possibleSwipeCords.minY;
                    }
                }
                if (allowX) {
                    if (distance.x <= -possibleSwipeCords.maxX) {
                        distance.x = -possibleSwipeCords.maxX;
                    }
                    else if (distance.x >= -possibleSwipeCords.minX) {
                        distance.x = -possibleSwipeCords.minX;
                    }
                }
                if (allowY) {
                    _LGel.attr('data-y', Math.abs(distance.y));
                }
                else {
                    var dataY_1 = parseFloat(_LGel.attr('data-y')) || 0;
                    distance.y = -Math.abs(dataY_1);
                }
                if (allowX) {
                    _LGel.attr('data-x', Math.abs(distance.x));
                }
                else {
                    var dataX_1 = parseFloat(_LGel.attr('data-x')) || 0;
                    distance.x = -Math.abs(dataX_1);
                }
                this.setZoomSwipeStyles(_LGel, distance);
                this.positionChanged = true;
            }
        };
        Zoom.prototype.getZoomSwipeCords = function (startCoords, endCoords, allowX, allowY, possibleSwipeCords, dataY, dataX, rotateValue, rotateEl) {
            var distance = {};
            if (allowY) {
                distance.y =
                    -Math.abs(dataY) +
                        (endCoords.y - startCoords.y) *
                            this.getModifier(rotateValue, 'Y', rotateEl);
                if (distance.y <= -possibleSwipeCords.maxY) {
                    var diffMaxY = -possibleSwipeCords.maxY - distance.y;
                    distance.y = -possibleSwipeCords.maxY - diffMaxY / 6;
                }
                else if (distance.y >= -possibleSwipeCords.minY) {
                    var diffMinY = distance.y - -possibleSwipeCords.minY;
                    distance.y = -possibleSwipeCords.minY + diffMinY / 6;
                }
            }
            else {
                distance.y = -Math.abs(dataY);
            }
            if (allowX) {
                distance.x =
                    -Math.abs(dataX) +
                        (endCoords.x - startCoords.x) *
                            this.getModifier(rotateValue, 'X', rotateEl);
                if (distance.x <= -possibleSwipeCords.maxX) {
                    var diffMaxX = -possibleSwipeCords.maxX - distance.x;
                    distance.x = -possibleSwipeCords.maxX - diffMaxX / 6;
                }
                else if (distance.x >= -possibleSwipeCords.minX) {
                    var diffMinX = distance.x - -possibleSwipeCords.minX;
                    distance.x = -possibleSwipeCords.minX + diffMinX / 6;
                }
            }
            else {
                distance.x = -Math.abs(dataX);
            }
            return distance;
        };
        Zoom.prototype.getPossibleSwipeDragCords = function ($image, rotateValue) {
            var $cont = this.core.$lgContent;
            var contHeight = $cont.height();
            var contWidth = $cont.width();
            var imageYSize = this.getImageSize($image.get(), rotateValue, 'y');
            var imageXSize = this.getImageSize($image.get(), rotateValue, 'x');
            var dataY = parseFloat($image.attr('data-scale')) || 1;
            var elDataScale = Math.abs(dataY);
            var minY = (contHeight - imageYSize) / 2;
            var maxY = Math.abs(imageYSize * elDataScale - contHeight + minY);
            var minX = (contWidth - imageXSize) / 2;
            var maxX = Math.abs(imageXSize * elDataScale - contWidth + minX);
            if (rotateValue === 90) {
                return {
                    minY: minX,
                    maxY: maxX,
                    minX: minY,
                    maxX: maxY,
                };
            }
            else {
                return {
                    minY: minY,
                    maxY: maxY,
                    minX: minX,
                    maxX: maxX,
                };
            }
        };
        Zoom.prototype.setZoomSwipeStyles = function (LGel, distance) {
            LGel.css('transform', 'translate3d(' + distance.x + 'px, ' + distance.y + 'px, 0)');
        };
        Zoom.prototype.zoomSwipe = function () {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isMoved = false;
            // Allow x direction drag
            var allowX = false;
            // Allow Y direction drag
            var allowY = false;
            var startTime = new Date();
            var endTime = new Date();
            var dataX = 0;
            var dataY = 0;
            var possibleSwipeCords;
            var _LGel;
            var rotateEl = null;
            var rotateValue = 0;
            var $item = this.core.getSlideItem(this.core.index);
            this.core.$inner.on('touchstart.lg', function (e) {
                e.preventDefault();
                var currentItem = _this.core.galleryItems[_this.core.index];
                // Allow zoom only on image
                if (!currentItem.src) {
                    return;
                }
                $item = _this.core.getSlideItem(_this.core.index);
                if ((_this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target)) &&
                    e.targetTouches.length === 1 &&
                    _this.core.outer.hasClass('lg-zoomed')) {
                    startTime = new Date();
                    _this.core.touchAction = 'zoomSwipe';
                    var $image = _this.core
                        .getSlideItem(_this.core.index)
                        .find('.lg-object')
                        .first();
                    _LGel = _this.core
                        .getSlideItem(_this.core.index)
                        .find('.lg-img-wrap')
                        .first();
                    rotateEl = _this.core
                        .getSlideItem(_this.core.index)
                        .find('.lg-img-rotate')
                        .first()
                        .get();
                    rotateValue = _this.getCurrentRotation(rotateEl);
                    var dragAllowedAxises = _this.getDragAllowedAxises($image, Math.abs(rotateValue));
                    allowY = dragAllowedAxises.allowY;
                    allowX = dragAllowedAxises.allowX;
                    if (allowX || allowY) {
                        startCoords = _this.getSwipeCords(e, Math.abs(rotateValue));
                    }
                    dataY = parseFloat(_LGel.attr('data-y'));
                    dataX = parseFloat(_LGel.attr('data-x'));
                    possibleSwipeCords = _this.getPossibleSwipeDragCords($image, rotateValue);
                    // reset opacity and transition duration
                    _this.core.outer.addClass('lg-zoom-dragging lg-zoom-drag-transition');
                }
            });
            this.core.$inner.on('touchmove.lg', function (e) {
                e.preventDefault();
                if (e.targetTouches.length === 1 &&
                    _this.core.touchAction === 'zoomSwipe' &&
                    (_this.$LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target))) {
                    _this.core.touchAction = 'zoomSwipe';
                    endCoords = _this.getSwipeCords(e, Math.abs(rotateValue));
                    var distance = _this.getZoomSwipeCords(startCoords, endCoords, allowX, allowY, possibleSwipeCords, dataY, dataX, rotateValue, rotateEl);
                    if (Math.abs(endCoords.x - startCoords.x) > 15 ||
                        Math.abs(endCoords.y - startCoords.y) > 15) {
                        isMoved = true;
                        _this.setZoomSwipeStyles(_LGel, distance);
                    }
                }
            });
            this.core.$inner.on('touchend.lg', function (e) {
                if (_this.core.touchAction === 'zoomSwipe' &&
                    (_this.$LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target))) {
                    _this.core.touchAction = undefined;
                    _this.core.outer.removeClass('lg-zoom-dragging');
                    if (!isMoved) {
                        return;
                    }
                    isMoved = false;
                    endTime = new Date();
                    var touchDuration = endTime.valueOf() - startTime.valueOf();
                    _this.touchendZoom(startCoords, endCoords, allowX, allowY, touchDuration, rotateValue);
                }
            });
        };
        Zoom.prototype.zoomDrag = function () {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isDragging = false;
            var isMoved = false;
            var rotateEl = null;
            var rotateValue = 0;
            // Allow x direction drag
            var allowX = false;
            // Allow Y direction drag
            var allowY = false;
            var startTime;
            var endTime;
            var possibleSwipeCords;
            var dataY;
            var dataX;
            var _LGel;
            this.core.outer.on('mousedown.lg.zoom', function (e) {
                var currentItem = _this.core.galleryItems[_this.core.index];
                // Allow zoom only on image
                if (!currentItem.src) {
                    return;
                }
                var $item = _this.core.getSlideItem(_this.core.index);
                if (_this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target)) {
                    startTime = new Date();
                    // execute only on .lg-object
                    var $image = _this.core
                        .getSlideItem(_this.core.index)
                        .find('.lg-object')
                        .first();
                    _LGel = _this.core
                        .getSlideItem(_this.core.index)
                        .find('.lg-img-wrap')
                        .first();
                    rotateEl = _this.core
                        .getSlideItem(_this.core.index)
                        .find('.lg-img-rotate')
                        .get();
                    rotateValue = _this.getCurrentRotation(rotateEl);
                    var dragAllowedAxises = _this.getDragAllowedAxises($image, Math.abs(rotateValue));
                    allowY = dragAllowedAxises.allowY;
                    allowX = dragAllowedAxises.allowX;
                    if (_this.core.outer.hasClass('lg-zoomed')) {
                        if (_this.$LG(e.target).hasClass('lg-object') &&
                            (allowX || allowY)) {
                            e.preventDefault();
                            startCoords = _this.getDragCords(e, Math.abs(rotateValue));
                            possibleSwipeCords = _this.getPossibleSwipeDragCords($image, rotateValue);
                            isDragging = true;
                            dataY = parseFloat(_LGel.attr('data-y'));
                            dataX = parseFloat(_LGel.attr('data-x'));
                            // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                            _this.core.outer.get().scrollLeft += 1;
                            _this.core.outer.get().scrollLeft -= 1;
                            _this.core.outer
                                .removeClass('lg-grab')
                                .addClass('lg-grabbing lg-zoom-drag-transition lg-zoom-dragging');
                            // reset opacity and transition duration
                        }
                    }
                }
            });
            this.$LG(window).on("mousemove.lg.zoom.global" + this.core.lgId, function (e) {
                if (isDragging) {
                    isMoved = true;
                    endCoords = _this.getDragCords(e, Math.abs(rotateValue));
                    var distance = _this.getZoomSwipeCords(startCoords, endCoords, allowX, allowY, possibleSwipeCords, dataY, dataX, rotateValue, rotateEl);
                    _this.setZoomSwipeStyles(_LGel, distance);
                }
            });
            this.$LG(window).on("mouseup.lg.zoom.global" + this.core.lgId, function (e) {
                if (isDragging) {
                    endTime = new Date();
                    isDragging = false;
                    _this.core.outer.removeClass('lg-zoom-dragging');
                    // Fix for chrome mouse move on click
                    if (isMoved &&
                        (startCoords.x !== endCoords.x ||
                            startCoords.y !== endCoords.y)) {
                        endCoords = _this.getDragCords(e, Math.abs(rotateValue));
                        var touchDuration = endTime.valueOf() - startTime.valueOf();
                        _this.touchendZoom(startCoords, endCoords, allowX, allowY, touchDuration, rotateValue);
                    }
                    isMoved = false;
                }
                _this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
            });
        };
        Zoom.prototype.closeGallery = function () {
            this.resetZoom();
        };
        Zoom.prototype.destroy = function () {
            // Unbind all events added by lightGallery zoom plugin
            this.$LG(window).off(".lg.zoom.global" + this.core.lgId);
            this.core.LGel.off('.lg.zoom');
            this.core.LGel.off('.zoom');
            clearTimeout(this.zoomableTimeout);
            this.zoomableTimeout = false;
        };
        return Zoom;
    }());

    return Zoom;

})));
//# sourceMappingURL=lg-zoom.umd.js.map

;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgRotate = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
    };

    var rotateSettings = {
        rotate: true,
        rotateLeft: true,
        rotateRight: true,
        flipHorizontal: true,
        flipVertical: true,
    };

    var Rotate = /** @class */ (function () {
        function Rotate(instance, $LG) {
            // get lightGallery core plugin instance
            this.core = instance;
            this.$LG = $LG;
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, rotateSettings), this.core.settings);
            if (this.settings.rotate) {
                this.init();
            }
            return this;
        }
        Rotate.prototype.buildTemplates = function () {
            var rotateIcons = '';
            if (this.settings.flipVertical) {
                rotateIcons +=
                    '<button type="button" id="lg-flip-ver" aria-label="flip vertical" class="lg-flip-ver lg-icon"></button>';
            }
            if (this.settings.flipHorizontal) {
                rotateIcons +=
                    '<button type="button" id="lg-flip-hor" aria-label="Flip horizontal" class="lg-flip-hor lg-icon"></button>';
            }
            if (this.settings.rotateLeft) {
                rotateIcons +=
                    '<button type="button" id="lg-rotate-left" aria-label="Rotate left" class="lg-rotate-left lg-icon"></button>';
            }
            if (this.settings.rotateRight) {
                rotateIcons +=
                    '<button type="button" id="lg-rotate-right" aria-label="Rotate right" class="lg-rotate-right lg-icon"></button>';
            }
            this.core.$toolbar.append(rotateIcons);
        };
        Rotate.prototype.init = function () {
            var _this = this;
            this.buildTemplates();
            // Save rotate config for each item to persist its rotate, flip values
            // even after navigating to diferent slides
            this.rotateValuesList = {};
            // event triggered after appending slide content
            this.core.LGel.on(lGEvents.afterAppendSlide + ".rotate", function (event) {
                var index = event.detail.index;
                var imageWrap = _this.core
                    .getSlideItem(index)
                    .find('.lg-img-wrap')
                    .first();
                imageWrap.wrap('lg-img-rotate');
            });
            this.core.outer
                .find('#lg-rotate-left')
                .first()
                .on('click.lg', this.rotateLeft.bind(this));
            this.core.outer
                .find('#lg-rotate-right')
                .first()
                .on('click.lg', this.rotateRight.bind(this));
            this.core.outer
                .find('#lg-flip-hor')
                .first()
                .on('click.lg', this.flipHorizontal.bind(this));
            this.core.outer
                .find('#lg-flip-ver')
                .first()
                .on('click.lg', this.flipVertical.bind(this));
            // Reset rotate on slide change
            this.core.LGel.on(lGEvents.beforeSlide + ".rotate", function (event) {
                if (!_this.rotateValuesList[event.detail.index]) {
                    _this.rotateValuesList[event.detail.index] = {
                        rotate: 0,
                        flipHorizontal: 1,
                        flipVertical: 1,
                    };
                }
            });
        };
        Rotate.prototype.applyStyles = function () {
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .first();
            $image.css('transform', 'rotate(' +
                this.rotateValuesList[this.core.index].rotate +
                'deg)' +
                ' scale3d(' +
                this.rotateValuesList[this.core.index].flipHorizontal +
                ', ' +
                this.rotateValuesList[this.core.index].flipVertical +
                ', 1)');
        };
        Rotate.prototype.rotateLeft = function () {
            this.rotateValuesList[this.core.index].rotate -= 90;
            this.applyStyles();
        };
        Rotate.prototype.rotateRight = function () {
            this.rotateValuesList[this.core.index].rotate += 90;
            this.applyStyles();
        };
        Rotate.prototype.getCurrentRotation = function (el) {
            if (!el) {
                return 0;
            }
            var st = this.$LG(el).style();
            var tm = st.getPropertyValue('-webkit-transform') ||
                st.getPropertyValue('-moz-transform') ||
                st.getPropertyValue('-ms-transform') ||
                st.getPropertyValue('-o-transform') ||
                st.getPropertyValue('transform') ||
                'none';
            if (tm !== 'none') {
                var values = tm.split('(')[1].split(')')[0].split(',');
                if (values) {
                    var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
                    return angle < 0 ? angle + 360 : angle;
                }
            }
            return 0;
        };
        Rotate.prototype.flipHorizontal = function () {
            var rotateEl = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .first()
                .get();
            var currentRotation = this.getCurrentRotation(rotateEl);
            var rotateAxis = 'flipHorizontal';
            if (currentRotation === 90 || currentRotation === 270) {
                rotateAxis = 'flipVertical';
            }
            this.rotateValuesList[this.core.index][rotateAxis] *= -1;
            this.applyStyles();
        };
        Rotate.prototype.flipVertical = function () {
            var rotateEl = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .first()
                .get();
            var currentRotation = this.getCurrentRotation(rotateEl);
            var rotateAxis = 'flipVertical';
            if (currentRotation === 90 || currentRotation === 270) {
                rotateAxis = 'flipHorizontal';
            }
            this.rotateValuesList[this.core.index][rotateAxis] *= -1;
            this.applyStyles();
        };
        Rotate.prototype.closeGallery = function () {
            this.rotateValuesList = {};
        };
        Rotate.prototype.destroy = function () {
            // Unbind all events added by lightGallery rotate plugin
            this.core.LGel.off('.lg.rotate');
            this.core.LGel.off('.rotate');
        };
        return Rotate;
    }());

    return Rotate;

})));
//# sourceMappingURL=lg-rotate.umd.js.map

;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgThumbnail = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var thumbnailsSettings = {
        thumbnail: true,
        animateThumb: true,
        currentPagerPosition: 'middle',
        alignThumbnails: 'middle',
        thumbWidth: 100,
        thumbHeight: '80px',
        thumbMargin: 5,
        appendThumbnailsTo: '.lg-components',
        toggleThumb: false,
        enableThumbDrag: true,
        enableThumbSwipe: true,
        swipeThreshold: 10,
        loadYouTubeThumbnail: true,
        youTubeThumbSize: 1,
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
    };

    var Thumbnail = /** @class */ (function () {
        function Thumbnail(instance, $LG) {
            this.thumbOuterWidth = 0;
            this.thumbTotalWidth = 0;
            this.translateX = 0;
            this.thumbClickable = false;
            // get lightGallery core plugin instance
            this.core = instance;
            this.$LG = $LG;
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, thumbnailsSettings), this.core.settings);
            this.init();
            return this;
        }
        Thumbnail.prototype.init = function () {
            this.thumbOuterWidth = 0;
            this.thumbTotalWidth =
                this.core.galleryItems.length *
                    (this.settings.thumbWidth + this.settings.thumbMargin);
            // Thumbnail animation value
            this.translateX = 0;
            this.setAnimateThumbStyles();
            if (!this.core.settings.allowMediaOverlap) {
                this.settings.toggleThumb = false;
            }
            if (this.settings.thumbnail && this.core.galleryItems.length > 1) {
                this.build();
                if (this.settings.animateThumb) {
                    if (this.settings.enableThumbDrag) {
                        this.enableThumbDrag();
                    }
                    if (this.settings.enableThumbSwipe) {
                        this.enableThumbSwipe();
                    }
                    this.thumbClickable = false;
                }
                else {
                    this.thumbClickable = true;
                }
                this.toggleThumbBar();
                this.thumbKeyPress();
            }
        };
        Thumbnail.prototype.build = function () {
            var _this = this;
            this.setThumbMarkup();
            this.manageActiveClassOnSlideChange();
            this.$lgThumb.first().on('click.lg touchend.lg', function (e) {
                var $target = _this.$LG(e.target);
                if (!$target.hasAttribute('data-lg-item-id')) {
                    return;
                }
                setTimeout(function () {
                    // In IE9 and bellow touch does not support
                    // Go to slide if browser does not support css transitions
                    if (_this.thumbClickable && !_this.core.lgBusy) {
                        var index = parseInt($target.attr('data-lg-item-id'));
                        _this.core.slide(index, false, true, false);
                    }
                }, 50);
            });
            this.core.LGel.on(lGEvents.beforeSlide + ".thumb", function (event) {
                var index = event.detail.index;
                _this.animateThumb(index);
            });
            this.core.LGel.on(lGEvents.beforeOpen + ".thumb", function () {
                _this.thumbOuterWidth = _this.core.outer.get().offsetWidth;
            });
            this.core.LGel.on(lGEvents.updateSlides + ".thumb", function () {
                _this.rebuildThumbnails();
            });
            this.core.LGel.on(lGEvents.containerResize + ".thumb", function () {
                if (!_this.core.lgOpened)
                    return;
                setTimeout(function () {
                    _this.thumbOuterWidth = _this.core.outer.get().offsetWidth;
                    _this.animateThumb(_this.core.index);
                    _this.thumbOuterWidth = _this.core.outer.get().offsetWidth;
                }, 50);
            });
        };
        Thumbnail.prototype.setThumbMarkup = function () {
            var thumbOuterClassNames = 'lg-thumb-outer ';
            if (this.settings.alignThumbnails) {
                thumbOuterClassNames += "lg-thumb-align-" + this.settings.alignThumbnails;
            }
            var html = "<div class=\"" + thumbOuterClassNames + "\">\n        <div class=\"lg-thumb lg-group\">\n        </div>\n        </div>";
            this.core.outer.addClass('lg-has-thumb');
            if (this.settings.appendThumbnailsTo === '.lg-components') {
                this.core.$lgComponents.append(html);
            }
            else {
                this.core.outer.append(html);
            }
            this.$thumbOuter = this.core.outer.find('.lg-thumb-outer').first();
            this.$lgThumb = this.core.outer.find('.lg-thumb').first();
            if (this.settings.animateThumb) {
                this.core.outer
                    .find('.lg-thumb')
                    .css('transition-duration', this.core.settings.speed + 'ms')
                    .css('width', this.thumbTotalWidth + 'px')
                    .css('position', 'relative');
            }
            this.setThumbItemHtml(this.core.galleryItems);
        };
        Thumbnail.prototype.enableThumbDrag = function () {
            var _this = this;
            var thumbDragUtils = {
                cords: {
                    startX: 0,
                    endX: 0,
                },
                isMoved: false,
                newTranslateX: 0,
                startTime: new Date(),
                endTime: new Date(),
                touchMoveTime: 0,
            };
            var isDragging = false;
            this.$thumbOuter.addClass('lg-grab');
            this.core.outer
                .find('.lg-thumb')
                .first()
                .on('mousedown.lg.thumb', function (e) {
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                    // execute only on .lg-object
                    e.preventDefault();
                    thumbDragUtils.cords.startX = e.pageX;
                    thumbDragUtils.startTime = new Date();
                    _this.thumbClickable = false;
                    isDragging = true;
                    // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                    _this.core.outer.get().scrollLeft += 1;
                    _this.core.outer.get().scrollLeft -= 1;
                    // *
                    _this.$thumbOuter
                        .removeClass('lg-grab')
                        .addClass('lg-grabbing');
                }
            });
            this.$LG(window).on("mousemove.lg.thumb.global" + this.core.lgId, function (e) {
                if (!_this.core.lgOpened)
                    return;
                if (isDragging) {
                    thumbDragUtils.cords.endX = e.pageX;
                    thumbDragUtils = _this.onThumbTouchMove(thumbDragUtils);
                }
            });
            this.$LG(window).on("mouseup.lg.thumb.global" + this.core.lgId, function () {
                if (!_this.core.lgOpened)
                    return;
                if (thumbDragUtils.isMoved) {
                    thumbDragUtils = _this.onThumbTouchEnd(thumbDragUtils);
                }
                else {
                    _this.thumbClickable = true;
                }
                if (isDragging) {
                    isDragging = false;
                    _this.$thumbOuter.removeClass('lg-grabbing').addClass('lg-grab');
                }
            });
        };
        Thumbnail.prototype.enableThumbSwipe = function () {
            var _this = this;
            var thumbDragUtils = {
                cords: {
                    startX: 0,
                    endX: 0,
                },
                isMoved: false,
                newTranslateX: 0,
                startTime: new Date(),
                endTime: new Date(),
                touchMoveTime: 0,
            };
            this.$lgThumb.on('touchstart.lg', function (e) {
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                    e.preventDefault();
                    thumbDragUtils.cords.startX = e.targetTouches[0].pageX;
                    _this.thumbClickable = false;
                    thumbDragUtils.startTime = new Date();
                }
            });
            this.$lgThumb.on('touchmove.lg', function (e) {
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                    e.preventDefault();
                    thumbDragUtils.cords.endX = e.targetTouches[0].pageX;
                    thumbDragUtils = _this.onThumbTouchMove(thumbDragUtils);
                }
            });
            this.$lgThumb.on('touchend.lg', function () {
                if (thumbDragUtils.isMoved) {
                    thumbDragUtils = _this.onThumbTouchEnd(thumbDragUtils);
                }
                else {
                    _this.thumbClickable = true;
                }
            });
        };
        // Rebuild thumbnails
        Thumbnail.prototype.rebuildThumbnails = function () {
            var _this = this;
            // Remove transitions
            this.$thumbOuter.addClass('lg-rebuilding-thumbnails');
            setTimeout(function () {
                _this.thumbTotalWidth =
                    _this.core.galleryItems.length *
                        (_this.settings.thumbWidth + _this.settings.thumbMargin);
                _this.$lgThumb.css('width', _this.thumbTotalWidth + 'px');
                _this.$lgThumb.empty();
                _this.setThumbItemHtml(_this.core.galleryItems);
                _this.animateThumb(_this.core.index);
            }, 50);
            setTimeout(function () {
                _this.$thumbOuter.removeClass('lg-rebuilding-thumbnails');
            }, 200);
        };
        // @ts-check
        Thumbnail.prototype.setTranslate = function (value) {
            this.$lgThumb.css('transform', 'translate3d(-' + value + 'px, 0px, 0px)');
        };
        Thumbnail.prototype.getPossibleTransformX = function (left) {
            if (left > this.thumbTotalWidth - this.thumbOuterWidth) {
                left = this.thumbTotalWidth - this.thumbOuterWidth;
            }
            if (left < 0) {
                left = 0;
            }
            return left;
        };
        Thumbnail.prototype.animateThumb = function (index) {
            this.$lgThumb.css('transition-duration', this.core.settings.speed + 'ms');
            if (this.settings.animateThumb) {
                var position = 0;
                switch (this.settings.currentPagerPosition) {
                    case 'left':
                        position = 0;
                        break;
                    case 'middle':
                        position =
                            this.thumbOuterWidth / 2 - this.settings.thumbWidth / 2;
                        break;
                    case 'right':
                        position = this.thumbOuterWidth - this.settings.thumbWidth;
                }
                this.translateX =
                    (this.settings.thumbWidth + this.settings.thumbMargin) * index -
                        1 -
                        position;
                if (this.translateX > this.thumbTotalWidth - this.thumbOuterWidth) {
                    this.translateX = this.thumbTotalWidth - this.thumbOuterWidth;
                }
                if (this.translateX < 0) {
                    this.translateX = 0;
                }
                this.setTranslate(this.translateX);
            }
        };
        Thumbnail.prototype.onThumbTouchMove = function (thumbDragUtils) {
            thumbDragUtils.newTranslateX = this.translateX;
            thumbDragUtils.isMoved = true;
            thumbDragUtils.touchMoveTime = new Date().valueOf();
            thumbDragUtils.newTranslateX -=
                thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
            thumbDragUtils.newTranslateX = this.getPossibleTransformX(thumbDragUtils.newTranslateX);
            // move current slide
            this.setTranslate(thumbDragUtils.newTranslateX);
            this.$thumbOuter.addClass('lg-dragging');
            return thumbDragUtils;
        };
        Thumbnail.prototype.onThumbTouchEnd = function (thumbDragUtils) {
            thumbDragUtils.isMoved = false;
            thumbDragUtils.endTime = new Date();
            this.$thumbOuter.removeClass('lg-dragging');
            var touchDuration = thumbDragUtils.endTime.valueOf() -
                thumbDragUtils.startTime.valueOf();
            var distanceXnew = thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
            var speedX = Math.abs(distanceXnew) / touchDuration;
            // Some magical numbers
            // Can be improved
            if (speedX > 0.15 &&
                thumbDragUtils.endTime.valueOf() - thumbDragUtils.touchMoveTime < 30) {
                speedX += 1;
                if (speedX > 2) {
                    speedX += 1;
                }
                speedX =
                    speedX +
                        speedX * (Math.abs(distanceXnew) / this.thumbOuterWidth);
                this.$lgThumb.css('transition-duration', Math.min(speedX - 1, 2) + 'settings');
                distanceXnew = distanceXnew * speedX;
                this.translateX = this.getPossibleTransformX(this.translateX - distanceXnew);
                this.setTranslate(this.translateX);
            }
            else {
                this.translateX = thumbDragUtils.newTranslateX;
            }
            if (Math.abs(thumbDragUtils.cords.endX - thumbDragUtils.cords.startX) <
                this.settings.swipeThreshold) {
                this.thumbClickable = true;
            }
            return thumbDragUtils;
        };
        Thumbnail.prototype.getThumbHtml = function (thumb, index) {
            var slideVideoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
            var thumbImg;
            if (slideVideoInfo.youtube) {
                if (this.settings.loadYouTubeThumbnail) {
                    thumbImg =
                        '//img.youtube.com/vi/' +
                            slideVideoInfo.youtube[1] +
                            '/' +
                            this.settings.youTubeThumbSize +
                            '.jpg';
                }
                else {
                    thumbImg = thumb;
                }
            }
            else {
                thumbImg = thumb;
            }
            return "<div data-lg-item-id=\"" + index + "\" class=\"lg-thumb-item " + (index === this.core.index ? ' active' : '') + "\" \n        style=\"width:" + this.settings.thumbWidth + "px; height: " + this.settings.thumbHeight + ";\n            margin-right: " + this.settings.thumbMargin + "px;\">\n            <img data-lg-item-id=\"" + index + "\" src=\"" + thumbImg + "\" />\n        </div>";
        };
        Thumbnail.prototype.getThumbItemHtml = function (items) {
            var thumbList = '';
            for (var i = 0; i < items.length; i++) {
                thumbList += this.getThumbHtml(items[i].thumb, i);
            }
            return thumbList;
        };
        Thumbnail.prototype.setThumbItemHtml = function (items) {
            var thumbList = this.getThumbItemHtml(items);
            this.$lgThumb.html(thumbList);
        };
        Thumbnail.prototype.setAnimateThumbStyles = function () {
            if (this.settings.animateThumb) {
                this.core.outer.addClass('lg-animate-thumb');
            }
        };
        // Manage thumbnail active calss
        Thumbnail.prototype.manageActiveClassOnSlideChange = function () {
            var _this = this;
            // manage active class for thumbnail
            this.core.LGel.on(lGEvents.beforeSlide + ".thumb", function (event) {
                var $thumb = _this.core.outer.find('.lg-thumb-item');
                var index = event.detail.index;
                $thumb.removeClass('active');
                $thumb.eq(index).addClass('active');
            });
        };
        // Toggle thumbnail bar
        Thumbnail.prototype.toggleThumbBar = function () {
            var _this = this;
            if (this.settings.toggleThumb) {
                this.core.outer.addClass('lg-can-toggle');
                this.core.$toolbar.append('<button type="button" aria-label="Toggle thumbnails" class="lg-toggle-thumb lg-icon"></button>');
                this.core.outer
                    .find('.lg-toggle-thumb')
                    .first()
                    .on('click.lg', function () {
                    _this.core.outer.toggleClass('lg-components-open');
                });
            }
        };
        Thumbnail.prototype.thumbKeyPress = function () {
            var _this = this;
            this.$LG(window).on("keydown.lg.thumb.global" + this.core.lgId, function (e) {
                if (!_this.core.lgOpened || !_this.settings.toggleThumb)
                    return;
                if (e.keyCode === 38) {
                    e.preventDefault();
                    _this.core.outer.addClass('lg-components-open');
                }
                else if (e.keyCode === 40) {
                    e.preventDefault();
                    _this.core.outer.removeClass('lg-components-open');
                }
            });
        };
        Thumbnail.prototype.destroy = function () {
            if (this.settings.thumbnail && this.core.galleryItems.length > 1) {
                this.$LG(window).off(".lg.thumb.global" + this.core.lgId);
                this.core.LGel.off('.lg.thumb');
                this.core.LGel.off('.thumb');
                this.$thumbOuter.remove();
                this.core.outer.removeClass('lg-has-thumb');
            }
        };
        return Thumbnail;
    }());

    return Thumbnail;

})));
//# sourceMappingURL=lg-thumbnail.umd.js.map

;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgPager = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
    };

    var pagerSettings = {
        pager: true,
    };

    var Pager = /** @class */ (function () {
        function Pager(instance, $LG) {
            // get lightGallery core plugin instance
            this.core = instance;
            this.$LG = $LG;
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, pagerSettings), this.core.settings);
            if (this.settings.pager && this.core.galleryItems.length > 1) {
                this.init();
            }
            return this;
        }
        Pager.prototype.getPagerHtml = function (items) {
            var pagerList = '';
            for (var i = 0; i < items.length; i++) {
                pagerList += "<span  data-lg-item-id=\"" + i + "\" class=\"lg-pager-cont\"> \n                    <span data-lg-item-id=\"" + i + "\" class=\"lg-pager\"></span>\n                    <div class=\"lg-pager-thumb-cont\"><span class=\"lg-caret\"></span> <img src=\"" + items[i].thumb + "\" /></div>\n                    </span>";
            }
            return pagerList;
        };
        Pager.prototype.init = function () {
            var _this = this;
            var timeout;
            this.core.$lgComponents.prepend('<div class="lg-pager-outer"></div>');
            var $pagerOuter = this.core.outer.find('.lg-pager-outer');
            $pagerOuter.html(this.getPagerHtml(this.core.galleryItems));
            // @todo enable click
            $pagerOuter.first().on('click.lg touchend.lg', function (event) {
                var $target = _this.$LG(event.target);
                if (!$target.hasAttribute('data-lg-item-id')) {
                    return;
                }
                var index = parseInt($target.attr('data-lg-item-id'));
                _this.core.slide(index, false, true, false);
            });
            $pagerOuter.first().on('mouseover.lg', function () {
                clearTimeout(timeout);
                $pagerOuter.addClass('lg-pager-hover');
            });
            $pagerOuter.first().on('mouseout.lg', function () {
                timeout = setTimeout(function () {
                    $pagerOuter.removeClass('lg-pager-hover');
                });
            });
            this.core.LGel.on(lGEvents.beforeSlide + ".pager", function (event) {
                var index = event.detail.index;
                _this.manageActiveClass.call(_this, index);
            });
            this.core.LGel.on(lGEvents.updateSlides + ".pager", function () {
                $pagerOuter.empty();
                $pagerOuter.html(_this.getPagerHtml(_this.core.galleryItems));
                _this.manageActiveClass(_this.core.index);
            });
        };
        Pager.prototype.manageActiveClass = function (index) {
            var $pagerCont = this.core.outer.find('.lg-pager-cont');
            $pagerCont.removeClass('lg-pager-active');
            $pagerCont.eq(index).addClass('lg-pager-active');
        };
        Pager.prototype.destroy = function () {
            this.core.outer.find('.lg-pager-outer').remove();
            this.core.LGel.off('.lg.pager');
            this.core.LGel.off('.pager');
        };
        return Pager;
    }());

    return Pager;

})));
//# sourceMappingURL=lg-pager.umd.js.map

;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgHash = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
    };

    var hashSettings = {
        hash: true,
    };

    var Hash = /** @class */ (function () {
        function Hash(instance, $LG) {
            // get lightGallery core plugin instance
            this.core = instance;
            this.$LG = $LG;
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, hashSettings), this.core.settings);
            if (this.settings.hash) {
                this.oldHash = window.location.hash;
                this.init();
            }
            return this;
        }
        Hash.prototype.init = function () {
            // Change hash value on after each slide transition
            this.core.LGel.on(lGEvents.afterSlide + ".hash", this.onAfterSlide.bind(this));
            this.core.LGel.on(lGEvents.afterClose + ".hash", this.onCloseAfter.bind(this));
            // Listen hash change and change the slide according to slide value
            this.$LG(window).on("hashchange.lg.hash.global" + this.core.lgId, this.onHashchange.bind(this));
        };
        Hash.prototype.onAfterSlide = function (event) {
            var slideName = this.core.galleryItems[event.detail.index].slideName;
            slideName = this.core.settings.customSlideName
                ? slideName || event.detail.index
                : event.detail.index;
            if (history.replaceState) {
                history.replaceState(null, '', window.location.pathname +
                    window.location.search +
                    '#lg=' +
                    this.core.settings.galleryId +
                    '&slide=' +
                    slideName);
            }
            else {
                window.location.hash =
                    'lg=' + this.core.settings.galleryId + '&slide=' + slideName;
            }
        };
        Hash.prototype.onCloseAfter = function () {
            // Reset to old hash value
            if (this.oldHash &&
                this.oldHash.indexOf('lg=' + this.core.settings.galleryId) < 0) {
                if (history.replaceState) {
                    history.replaceState(null, '', this.oldHash);
                }
                else {
                    window.location.hash = this.oldHash;
                }
            }
            else {
                if (history.replaceState) {
                    history.replaceState(null, document.title, window.location.pathname + window.location.search);
                }
                else {
                    window.location.hash = '';
                }
            }
        };
        Hash.prototype.onHashchange = function () {
            if (!this.core.lgOpened)
                return;
            var _hash = window.location.hash;
            var index = this.core.getIndexFromUrl(_hash);
            // it galleryId doesn't exist in the url close the gallery
            if (_hash.indexOf('lg=' + this.core.settings.galleryId) > -1) {
                this.core.slide(index, false, false);
            }
            else if (this.core.lGalleryOn) {
                this.core.closeGallery();
            }
        };
        Hash.prototype.closeGallery = function () {
            if (!this.settings.hash) {
                return;
            }
        };
        Hash.prototype.destroy = function () {
            this.core.LGel.off('.lg.hash');
            this.core.LGel.off('.hash');
            this.$LG(window).off("hashchange.lg.hash.global" + this.core.lgId);
        };
        return Hash;
    }());

    return Hash;

})));
//# sourceMappingURL=lg-hash.umd.js.map

;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgShare = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var shareSettings = {
        share: true,
        facebook: true,
        facebookDropdownText: 'Facebook',
        twitter: true,
        twitterDropdownText: 'Twitter',
        pinterest: true,
        pinterestDropdownText: 'Pinterest',
        additionalShareOptions: [],
    };

    function getFacebookShareLink(galleryItem) {
        var facebookBaseUrl = '//www.facebook.com/sharer/sharer.php?u=';
        return (facebookBaseUrl +
            encodeURIComponent(galleryItem.facebookShareUrl || window.location.href));
    }

    function getTwitterShareLink(galleryItem) {
        var twitterBaseUrl = '//twitter.com/intent/tweet?text=';
        var url = encodeURIComponent(galleryItem.twitterShareUrl || window.location.href);
        var text = galleryItem.tweetText;
        return twitterBaseUrl + text + '&url=' + url;
    }

    function getPinterestShareLink(galleryItem) {
        var pinterestBaseUrl = 'http://www.pinterest.com/pin/create/button/?url=';
        var description = galleryItem.pinterestText;
        var media = encodeURIComponent(galleryItem.src);
        var url = encodeURIComponent(galleryItem.pinterestShareUrl || window.location.href);
        return (pinterestBaseUrl +
            url +
            '&media=' +
            media +
            '&description=' +
            description);
    }

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
    };

    var Share = /** @class */ (function () {
        function Share(instance) {
            this.shareOptions = [];
            // get lightGallery core plugin instance
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, shareSettings), this.core.settings);
            if (this.settings.share) {
                this.init();
            }
            return this;
        }
        Share.prototype.init = function () {
            this.shareOptions = __spreadArrays(this.getDefaultShareOptions(), this.settings.additionalShareOptions);
            this.setLgShareMarkup();
            this.core.outer
                .find('.lg-share .lg-dropdown')
                .append(this.getShareListHtml());
            this.core.LGel.on(lGEvents.afterSlide + ".share", this.onAfterSlide.bind(this));
        };
        Share.prototype.getShareListHtml = function () {
            var shareHtml = '';
            this.shareOptions.forEach(function (shareOption) {
                shareHtml += shareOption.dropdownHTML;
            });
            return shareHtml;
        };
        Share.prototype.setLgShareMarkup = function () {
            var _this = this;
            this.core.$toolbar.append("<button type=\"button aria-label=\"Share\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"lg-share lg-icon\">\n                <ul class=\"lg-dropdown\" style=\"position: absolute;\"></ul></button>");
            this.core.$lgContent.append('<div class="lg-dropdown-overlay"></div>');
            var $shareButton = this.core.outer.find('.lg-share');
            $shareButton.first().on('click.lg', function () {
                _this.core.outer.toggleClass('lg-dropdown-active');
                if (_this.core.outer.hasClass('lg-dropdown-active')) {
                    _this.core.outer.attr('aria-expanded', true);
                }
                else {
                    _this.core.outer.attr('aria-expanded', false);
                }
            });
            this.core.outer
                .find('.lg-dropdown-overlay')
                .first()
                .on('click.lg', function () {
                _this.core.outer.removeClass('lg-dropdown-active');
                _this.core.outer.attr('aria-expanded', false);
            });
        };
        Share.prototype.onAfterSlide = function (event) {
            var _this = this;
            var index = event.detail.index;
            var currentItem = this.core.galleryItems[index];
            setTimeout(function () {
                _this.shareOptions.forEach(function (shareOption) {
                    var selector = shareOption.selector;
                    _this.core.outer
                        .find(selector)
                        .attr('href', shareOption.generateLink(currentItem));
                });
            }, 100);
        };
        Share.prototype.getShareListItemHTML = function (type, text) {
            return "<li><a class=\"lg-share-" + type + "\" target=\"_blank\"><span class=\"lg-icon\"></span><span class=\"lg-dropdown-text\">" + text + "</span></a></li>";
        };
        Share.prototype.getDefaultShareOptions = function () {
            return __spreadArrays((this.settings.facebook
                ? [
                    {
                        type: 'facebook',
                        generateLink: getFacebookShareLink,
                        dropdownHTML: this.getShareListItemHTML('facebook', this.settings.facebookDropdownText),
                        selector: '.lg-share-facebook',
                    },
                ]
                : []), (this.settings.twitter
                ? [
                    {
                        type: 'twitter',
                        generateLink: getTwitterShareLink,
                        dropdownHTML: this.getShareListItemHTML('twitter', this.settings.twitterDropdownText),
                        selector: '.lg-share-twitter',
                    },
                ]
                : []), (this.settings.pinterest
                ? [
                    {
                        type: 'pinterest',
                        generateLink: getPinterestShareLink,
                        dropdownHTML: this.getShareListItemHTML('pinterest', this.settings.pinterestDropdownText),
                        selector: '.lg-share-pinterest',
                    },
                ]
                : []));
        };
        Share.prototype.destroy = function () {
            this.core.outer.find('.lg-dropdown-overlay').remove();
            this.core.outer.find('.lg-share').remove();
            this.core.LGel.off('.lg.share');
            this.core.LGel.off('.share');
        };
        return Share;
    }());

    return Share;

})));
//# sourceMappingURL=lg-share.umd.js.map

;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgComment = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
    };

    var commentSettings = {
        commentBox: false,
        fbComments: false,
        disqusComments: false,
        disqusConfig: {
            title: undefined,
            language: 'en',
        },
        commentsMarkup: '<div id="lg-comment-box" class="lg-comment-box lg-fb-comment-box"><div class="lg-comment-header"><h3 class="lg-comment-title">Leave a comment.</h3><span class="lg-comment-close lg-icon"></span></div><div class="lg-comment-body"></div></div>',
    };

    /**
     * lightGallery comments module
     * Supports facebook and disqus comments
     *
     * @ref - https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables
     * @ref - https://github.com/disqus/DISQUS-API-Recipes/blob/master/snippets/js/disqus-reset/disqus_reset.html
     * @ref - https://css-tricks.com/lazy-loading-disqus-comments/
     * @ref - https://developers.facebook.com/docs/plugins/comments/#comments-plugin
     *
     */
    var CommentBox = /** @class */ (function () {
        function CommentBox(instance, $LG) {
            // get lightGallery core plugin instance
            this.core = instance;
            this.$LG = $LG;
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, commentSettings), this.core.settings);
            if (this.settings.commentBox) {
                this.init();
            }
            return this;
        }
        CommentBox.prototype.init = function () {
            this.setMarkup();
            this.toggleCommentBox();
            if (this.settings.fbComments) {
                this.addFbComments();
            }
            else if (this.settings.disqusComments) {
                this.addDisqusComments();
            }
        };
        CommentBox.prototype.setMarkup = function () {
            this.core.$lgContent.append(this.settings.commentsMarkup +
                '<div class="lg-comment-overlay"></div>');
            var commentToggleBtn = '<button type="button" aria-label="Toggle comments" class="lg-comment-toggle lg-icon"></button>';
            this.core.$toolbar.append(commentToggleBtn);
        };
        CommentBox.prototype.toggleCommentBox = function () {
            var _this_1 = this;
            this.core.outer
                .find('.lg-comment-toggle')
                .first()
                .on('click.lg.comment', function () {
                _this_1.core.outer.toggleClass('lg-comment-active');
            });
            this.core.outer
                .find('.lg-comment-overlay')
                .first()
                .on('click.lg.comment', function () {
                _this_1.core.outer.removeClass('lg-comment-active');
            });
            this.core.outer
                .find('.lg-comment-close')
                .first()
                .on('click.lg.comment', function () {
                _this_1.core.outer.removeClass('lg-comment-active');
            });
        };
        CommentBox.prototype.addFbComments = function () {
            var _this_1 = this;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var _this = this;
            this.core.LGel.on(lGEvents.beforeSlide + ".comment", function (event) {
                var html = _this_1.core.galleryItems[event.detail.index].fbHtml;
                _this_1.core.outer.find('.lg-comment-body').html(html);
            });
            this.core.LGel.on(lGEvents.afterSlide + ".comment", function () {
                try {
                    FB.XFBML.parse();
                }
                catch (err) {
                    _this.$LG(window).on('fbAsyncInit', function () {
                        FB.XFBML.parse();
                    });
                }
            });
        };
        CommentBox.prototype.addDisqusComments = function () {
            var _this_1 = this;
            var $disqusThread = this.$LG('#disqus_thread');
            $disqusThread.remove();
            this.core.outer
                .find('.lg-comment-body')
                .append('<div id="disqus_thread"></div>');
            this.core.LGel.on(lGEvents.beforeSlide + ".comment", function () {
                $disqusThread.html('');
            });
            this.core.LGel.on(lGEvents.afterSlide + ".comment", function (event) {
                var index = event.detail.index;
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                var _this = _this_1;
                // DISQUS needs sometime to intialize when lightGallery is opened from direct url(hash plugin).
                setTimeout(function () {
                    try {
                        DISQUS.reset({
                            reload: true,
                            config: function () {
                                this.page.identifier =
                                    _this.core.galleryItems[index].disqusIdentifier;
                                this.page.url =
                                    _this.core.galleryItems[index].disqusURL;
                                this.page.title =
                                    _this.settings.disqusConfig.title;
                                this.language =
                                    _this.settings.disqusConfig.language;
                            },
                        });
                    }
                    catch (err) {
                        console.error('Make sure you have included disqus JavaScript code in your document. Ex - https://lg-disqus.disqus.com/admin/install/platforms/universalcode/');
                    }
                }, _this.core.lGalleryOn ? 0 : 1000);
            });
        };
        CommentBox.prototype.destroy = function () {
            this.core.LGel.off('.lg.comment');
            this.core.LGel.off('.comment');
        };
        return CommentBox;
    }());

    return CommentBox;

})));
//# sourceMappingURL=lg-comment.umd.js.map

;
/*!
 * lightgallery | 0.0.0-development | April 24th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgAutoplay = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
    };

    var autoplaySettings = {
        autoplay: true,
        slideShowAutoplay: false,
        slideShowInterval: 5000,
        progressBar: true,
        forceSlideShowAutoplay: false,
        autoplayControls: true,
        appendAutoplayControlsTo: '.lg-toolbar',
    };

    /**
     * Creates the autoplay plugin.
     * @param {object} element - lightGallery element
     */
    var Autoplay = /** @class */ (function () {
        function Autoplay(instance) {
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, autoplaySettings), this.core.settings);
            // Execute only if items are above 1
            if (this.core.galleryItems.length < 2) {
                return this;
            }
            this.interval = false;
            // Identify if slide happened from autoplay
            this.fromAuto = true;
            // Identify if autoplay canceled from touch/drag
            this.pausedOnTouchDrag = false;
            this.pausedOnSlideChange = false;
            if (this.settings.autoplay) {
                this.init();
            }
            return this;
        }
        Autoplay.prototype.init = function () {
            var _this = this;
            // append autoplay controls
            if (this.settings.autoplayControls) {
                this.controls();
            }
            // Create progress bar
            if (this.settings.progressBar) {
                this.core.$lgContent.append('<div class="lg-progress-bar"><div class="lg-progress"></div></div>');
            }
            // Start autoplay
            if (this.settings.slideShowAutoplay) {
                this.core.LGel.once(lGEvents.slideItemLoad + ".autoplay", function () {
                    _this.startAuto();
                });
            }
            // cancel interval on touchstart and dragstart
            this.core.LGel.on(lGEvents.dragStart + ".autoplay touchstart.lg.autoplay", function () {
                if (_this.interval) {
                    _this.cancelAuto();
                    _this.pausedOnTouchDrag = true;
                }
            });
            // restore autoplay if autoplay canceled from touchstart / dragstart
            this.core.LGel.on(lGEvents.dragEnd + ".autoplay touchend.lg.autoplay", function () {
                if (!_this.interval && _this.pausedOnTouchDrag) {
                    _this.startAuto();
                    _this.pausedOnTouchDrag = false;
                }
            });
            this.core.LGel.on(lGEvents.beforeSlide + ".autoplay", function () {
                _this.showProgressBar();
                if (!_this.fromAuto && _this.interval) {
                    _this.cancelAuto();
                    _this.pausedOnSlideChange = true;
                }
                else {
                    _this.pausedOnSlideChange = false;
                }
                _this.fromAuto = false;
            });
            // restore autoplay if autoplay canceled from touchstart / dragstart
            this.core.LGel.on(lGEvents.afterSlide + ".autoplay", function () {
                if (_this.pausedOnSlideChange &&
                    !_this.interval &&
                    _this.settings.forceSlideShowAutoplay) {
                    _this.startAuto();
                    _this.pausedOnSlideChange = false;
                }
            });
            // set progress
            this.showProgressBar();
        };
        Autoplay.prototype.showProgressBar = function () {
            var _this = this;
            if (this.settings.progressBar && this.fromAuto) {
                var _$progressBar_1 = this.core.outer.find('.lg-progress-bar');
                var _$progress_1 = this.core.outer.find('.lg-progress');
                if (this.interval) {
                    _$progress_1.removeAttr('style');
                    _$progressBar_1.removeClass('lg-start');
                    setTimeout(function () {
                        _$progress_1.css('transition', 'width ' +
                            (_this.core.settings.speed +
                                _this.settings.slideShowInterval) +
                            'ms ease 0s');
                        _$progressBar_1.addClass('lg-start');
                    }, 20);
                }
            }
        };
        // Manage autoplay via play/stop buttons
        Autoplay.prototype.controls = function () {
            var _this = this;
            var _html = '<button type="button" class="lg-autoplay-button lg-icon"></button>';
            // Append autoplay controls
            this.core.outer
                .find(this.settings.appendAutoplayControlsTo)
                .append(_html);
            this.core.outer
                .find('.lg-autoplay-button')
                .first()
                .on('click.lg.autoplay', function () {
                if (_this.core.outer.hasClass('lg-show-autoplay')) {
                    _this.cancelAuto();
                }
                else {
                    if (!_this.interval) {
                        _this.startAuto();
                    }
                }
            });
        };
        // Autostart gallery
        Autoplay.prototype.startAuto = function () {
            var _this = this;
            this.core.outer
                .find('.lg-progress')
                .css('transition', 'width ' +
                (this.core.settings.speed +
                    this.settings.slideShowInterval) +
                'ms ease 0s');
            this.core.outer.addClass('lg-show-autoplay');
            this.core.outer.find('.lg-progress-bar').addClass('lg-start');
            this.interval = setInterval(function () {
                if (_this.core.index + 1 < _this.core.galleryItems.length) {
                    _this.core.index++;
                }
                else {
                    _this.core.index = 0;
                }
                _this.fromAuto = true;
                _this.core.slide(_this.core.index, false, false, 'next');
            }, this.core.settings.speed + this.settings.slideShowInterval);
        };
        // cancel Autostart
        Autoplay.prototype.cancelAuto = function () {
            if (this.interval) {
                this.core.outer.find('.lg-progress').removeAttr('style');
                this.core.outer.removeClass('lg-show-autoplay');
                this.core.outer.find('.lg-progress-bar').removeClass('lg-start');
            }
            clearInterval(this.interval);
            this.interval = false;
        };
        Autoplay.prototype.closeGallery = function () {
            this.cancelAuto();
        };
        Autoplay.prototype.destroy = function () {
            if (this.settings.autoplay) {
                this.core.outer.find('.lg-progress-bar').remove();
            }
            // Remove all event listeners added by autoplay plugin
            this.core.LGel.off('.lg.autoplay');
            this.core.LGel.off('.autoplay');
        };
        return Autoplay;
    }());

    return Autoplay;

})));
//# sourceMappingURL=lg-autoplay.umd.js.map

;
"use strict";function _toConsumableArray(arr){return _arrayWithoutHoles(arr)||_iterableToArray(arr)||_unsupportedIterableToArray(arr)||_nonIterableSpread();}
function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}
function _unsupportedIterableToArray(o,minLen){if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen);}
function _iterableToArray(iter){if(typeof Symbol!=="undefined"&&Symbol.iterator in Object(iter))return Array.from(iter);}
function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr);}
function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++){arr2[i]=arr[i];}return arr2;}
function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;});keys.push.apply(keys,symbols);}return keys;}
function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){_defineProperty(target,key,source[key]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));}else{ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}}return target;}
function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}
$(window).on('scroll',function(){if($(window).scrollTop()>50){$('body').addClass('has-fixed-header');$('#nav-header').addClass('fixed-header ');}else{$('body').removeClass('has-fixed-header');$('#nav-header').removeClass('fixed-header ');}});function getResponsiveThumbnailsSettings(){if($(window).width()<768){return{thumbWidth:30,thumbHeight:'20px',thumbMargin:2};}else{return{thumbWidth:100,thumbHeight:'80px',thumbMargin:5};}}
var $lgInlineContainer=document.getElementById('inline-gallery-container');if($lgInlineContainer){var inlineGallery=window.lightGallery($lgInlineContainer,_objectSpread(_objectSpread({container:$lgInlineContainer,dynamic:true,thumbnail:true,swipeToClose:false,addClass:'lg-inline',mode:'lg-scale-up',slideShowAutoplay:true,hash:false,pager:false,closable:false,showMaximizeIcon:true,rotate:false,download:false,slideDelay:400,plugins:[lgZoom,lgFullscreen,lgShare,lgAutoplay,lgThumbnail],appendSubHtmlTo:'.lg-item'},getResponsiveThumbnailsSettings()),{},{dynamicEl:[{src:'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@dann\">Dan</a></h4>\n                    <p>Published on November 13, 2018</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@kylepyt\">Kyle Peyton</a></h4>\n                    <p>Published on September 14, 2016</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@jxnsartstudio\">Garrett Jackson</a></h4>\n                    <p>Published on May 8, 2020</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@brookecagle\">Brooke Cagle</a></h4>\n                    <p>Description of the slide 4</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@charlespostiaux\">Charles Postiaux</a></h4>\n                    <p>Published on November 24, 2018</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@bruno_adam\">Bruno Adam</a></h4>\n                    <p>Published on January 6, 2021</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@sigmund\">Sigmund</a></h4>\n                    <p>Published on November 6, 2019</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@chow_parij\">Parij Borgohain</a></h4>\n                    <p>Published on January 19, 2020</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@inespiazzese\">Ines Piazzese</a></h4>\n                    <p>Published on September 1, 2020</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@rdsaunders\">Richard Saunders</a></h4>\n                    <p>Published on June 19, 2019</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@jalanmeier\">J. Meier</a></h4>\n                    <p>Published on October 17, 2019</p>\n                </div>"},{src:'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@brookecagle\">Brooke Cagle</a></h4>\n                    <p>Published on October 6, 2020</p>\n                </div>"}]}));setTimeout(function(){inlineGallery&&inlineGallery.openGallery();},130);}
window.lightGallery(document.getElementById('gallery-demo-animated-thumbnails'),_objectSpread({pager:false,hash:false,plugins:[lgZoom,lgAutoplay,lgFullscreen,lgPager,lgRotate,lgShare,lgThumbnail,lgVideo]},getResponsiveThumbnailsSettings()));jQuery('#animated-thumbnails-gallery').justifiedGallery({captions:false,lastRow:'hide',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('animated-thumbnails-gallery'),_objectSpread(_objectSpread({autoplayFirstVideo:false,pager:false,galleryId:'nature',plugins:[lgZoom,lgAutoplay,lgHash,lgFullscreen,lgPager,lgRotate,lgShare,lgThumbnail,lgVideo]},getResponsiveThumbnailsSettings()),{},{preload:3,videoMaxWidth:'1400px',mobileSettings:{controls:false,showCloseIcon:false,download:false,rotate:false}}));});var masonryElMixed=document.getElementById('static-thumbnails-gallery');if(masonryElMixed){imagesLoaded(document.getElementById('static-thumbnails-gallery'),function(){new Masonry(masonryElMixed,{temSelector:'.gallery-item',percentPosition:true,gutter:10});window.lightGallery(masonryElMixed,{animateThumb:false,pager:false,plugins:[lgZoom,lgAutoplay,lgFullscreen,lgThumbnail],hash:false,zoomFromOrigin:false,toggleThumb:true,allowMediaOverlap:true});});}
jQuery('#customize-thumbnails-gallery').justifiedGallery({captions:false,lastRow:'hide',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('customize-thumbnails-gallery'),{animateThumb:false,addClass:'lg-custom-thumbnails',appendThumbnailsTo:'.lg-outer',pager:false,hash:false,plugins:[lgZoom,lgAutoplay,lgFullscreen,lgThumbnail],allowMediaOverlap:true});});var $galleryEventsDemo=jQuery('#gallery-events-demo');var galleryEventsDemo=$galleryEventsDemo[0];if(galleryEventsDemo){var colours=['#6a7583','#1e304b','#315460','#080607'];galleryEventsDemo.addEventListener('lgBeforeSlide',function(event){var index=event.detail.index;document.querySelector('.lg-backdrop').style.backgroundColor=colours[index];});$galleryEventsDemo.justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(galleryEventsDemo,{zoom:false,thumbnail:false,addClass:'lg-events-demo-outer',rotate:false,pager:false,plugins:[],hash:false,fullScreen:false,download:false});});}
var customTransitionsGallery;function customTransitions(trans){jQuery('#gallery-transitions-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){customTransitionsGallery=window.lightGallery(document.getElementById('gallery-transitions-demo'),{mode:trans,zoom:false,thumbnail:false,rotate:false,pager:false,plugins:[],hash:false,fullScreen:false,download:false});});}
customTransitions('lg-slide');jQuery('#select-trans').on('change',function(){customTransitionsGallery.destroy();jQuery('#gallery-transitions-demo').justifiedGallery('destroy');jQuery('#gallery-transitions-demo').off('jg.complete');customTransitions(jQuery(this).val());});var customEasingGallery;function initCustomEasing(easing){jQuery('#gallery-custom-easing-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){customEasingGallery=window.lightGallery(document.getElementById('gallery-custom-easing-demo'),{easing:easing,zoom:false,thumbnail:false,rotate:false,pager:false,hash:false,plugins:[],speed:1000,fullScreen:false,download:false});});}
initCustomEasing('cubic-bezier(0.680, -0.550, 0.265, 1.550)');jQuery('#select-easing').on('change',function(){var val=jQuery(this).val();prompt('You can copy cubic-bezier from here',val);customEasingGallery.destroy();jQuery('#gallery-custom-easing-demo').justifiedGallery('destroy');jQuery('#gallery-custom-easing-demo').off('jg.complete');initCustomEasing('cubic-bezier('+val+')');});var methodsInstance;var $lgGalleryMethodsDemo=document.getElementById('gallery-methods-demo');if($lgGalleryMethodsDemo){$lgGalleryMethodsDemo.addEventListener('lgInit',function(){var previousBtn='<button type="button" aria-label="Previous slide" class="lg-prev"> Prev Slide </button>';var nextBtn='<button type="button" aria-label="Next slide" class="lg-next"> Next Slide </button>';var $lgContainer=document.querySelector('.lg');$lgContainer.insertAdjacentHTML('beforeend',nextBtn);$lgContainer.insertAdjacentHTML('beforeend',previousBtn);document.querySelector('.lg-next').addEventListener('click',function(){methodsInstance.goToNextSlide();});document.querySelector('.lg-prev').addEventListener('click',function(){methodsInstance.goToPrevSlide();});});jQuery('#gallery-methods-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){methodsInstance=window.lightGallery($lgGalleryMethodsDemo,{zoom:false,thumbnail:false,rotate:false,fullScreen:false,plugins:[lgZoom],addClass:'lg-methods-demo',controls:false,download:false,pager:false,hash:false});});}
var $lgDemoUpdateSlides=jQuery('#gallery-update-slides-demo');var lgDemoUpdateSlides=$lgDemoUpdateSlides.get(0);var slidesUpdated=false;if(lgDemoUpdateSlides){lgDemoUpdateSlides.addEventListener('lgAfterClose',function(event){if(slidesUpdated){setTimeout(function(){$lgDemoUpdateSlides.justifiedGallery('destroy');$lgDemoUpdateSlides.off('jg.complete');$('.lg-added-item').attr('src','https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=100');event.detail.instance.destroy();},100);setTimeout(function(){$lgDemoUpdateSlides.justifiedGallery({captions:false,lastRow:'center',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(lgDemoUpdateSlides,{addClass:'lg-update-slide-demo',controls:false,download:false,plugins:[lgZoom,lgAutoplay,lgFullscreen,lgShare,lgThumbnail],pager:false,hash:false});});slidesUpdated=false;},200);}});lgDemoUpdateSlides.addEventListener('lgInit',function(event){var updateSlideInstance=event.detail.instance;var addBtn='<button type="button" aria-label="Add slide" class="lg-icon" id="lg-add"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM8 13h3v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1v3h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg></button>';var deleteBtn='<button class="lg-icon" type="button" aria-label="Remove slide" class="lg-icon" id="lg-delete"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM8 13h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg></button>';updateSlideInstance.outer.find('.lg-toolbar').append(deleteBtn);updateSlideInstance.outer.find('.lg-toolbar').append(addBtn);updateSlideInstance.outer.find('#lg-add').on('click',function(){var galleryItems=[].concat(_toConsumableArray(updateSlideInstance.galleryItems),[{src:'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80',thumb:'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=100',subHtml:"<div class=\"lightGallery-captions\">\n                    <h4>Photo by <a href=\"https://unsplash.com/@brookecagle\">Brooke Cagle</a></h4>\n                    <p>Description of the slide 1</p>\n                </div>"}]);$lgDemoUpdateSlides.append("<a\n            data-lg-size=\"1600-1067\"\n            data-src=\"https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80\"\n            data-sub-html=\"<h4>Fading Light</h4><p>layers of blue.</p>\"\n        >\n            <img\n                alt=\"Captions\"\n                style=\"height: 200px; max-width: none; width: 200px\"\n                class=\"img-responsive lg-added-item\"\n                src=\"https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=100\"\n            />\n        </a>");updateSlideInstance.updateSlides(galleryItems,updateSlideInstance.index);slidesUpdated=true;});updateSlideInstance.outer.find('#lg-delete').on('click',function(){var galleryItems=JSON.parse(JSON.stringify(updateSlideInstance.galleryItems));galleryItems.shift();updateSlideInstance.updateSlides(galleryItems,1);$lgDemoUpdateSlides.children().first().remove();slidesUpdated=true;});});var jG=$lgDemoUpdateSlides.justifiedGallery({captions:false,lastRow:'center',rowHeight:180,margins:5});jG.on('jg.complete',function(){window.lightGallery(lgDemoUpdateSlides,{addClass:'lg-update-slide-demo',controls:false,pager:false,hash:false,plugins:[lgZoom,lgAutoplay,lgFullscreen,lgShare,lgThumbnail],download:false});});}
var $dynamicGallery=jQuery('#dynamic-gallery-demo');var dynamicGallery=window.lightGallery($dynamicGallery[0],{dynamic:true,hash:false,pager:false,thumbnail:false,rotate:false,plugins:[lgZoom,lgAutoplay,lgFullscreen,lgPager,lgRotate,lgShare,lgThumbnail,lgVideo],dynamicEl:[{src:'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                <h4>Photo by <a href=\"https://unsplash.com/@brookecagle\">Brooke Cagle</a></h4>\n                <p>Description of the slide 1</p>\n            </div>"},{src:'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',subHtml:"<div class=\"lightGallery-captions\">\n                <h4>Photo by <a href=\"https://unsplash.com/@brookecagle\">Brooke Cagle</a></h4>\n                <p>Description of the slide 2</p>\n            </div>"},{src:'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80'},{src:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',responsive:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',thumb:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80'}]});$dynamicGallery.on('click',function(){dynamicGallery.openGallery(2);});window.lightGallery(document.getElementById('open-website'),{selector:'this'});window.lightGallery(document.getElementById('open-google-map'),{selector:'this'});window.lightGallery(document.getElementById('open-pdf'),{selector:'this'});jQuery('#gallery-videos-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-videos-demo'),{thumbnail:false,pager:false,plugins:[lgAutoplay,lgFullscreen,lgShare,lgThumbnail,lgVideo],hash:false,preload:0});});jQuery('#gallery-videojs-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-videojs-demo'),{pager:false,hash:false,preload:0,plugins:[lgAutoplay,lgFullscreen,lgShare,lgThumbnail,lgVideo],videojs:true,videojsOptions:{muted:true}});});jQuery('#gallery-hash-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-hash-demo'),{thumbnail:false,plugins:[lgHash],pager:false,galleryId:1,customSlideName:false});});jQuery('#gallery-custom-hash-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-custom-hash-demo'),{thumbnail:false,plugins:[lgZoom,lgHash,lgAutoplay,lgFullscreen,lgPager,lgRotate,lgShare,lgThumbnail,lgVideo],galleryId:2,pager:false,customSlideName:true});});jQuery('#gallery-share-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-share-demo'),{thumbnail:false,pager:false,hash:true,plugins:[lgZoom,lgShare,lgThumbnail]});});jQuery('#gallery-captions-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-captions-demo'),{thumbnail:false,plugins:[lgZoom,lgShare],pager:true,hash:true});});jQuery('#responsive-images-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('responsive-images-demo'),{thumbnail:false,pager:true,hash:true,plugins:[lgAutoplay,lgThumbnail]});});jQuery('#gallery-fb-comments-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-fb-comments-demo'),{thumbnail:false,pager:false,hash:true,plugins:[lgZoom,lgComment,lgShare,lgThumbnail],commentBox:true,disqusComments:false,fbComments:true});});jQuery('#gallery-disqus-comments-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-disqus-comments-demo'),{thumbnail:false,pager:false,hash:true,plugins:[lgComment,lgRotate],commentBox:true,disqusComments:true,fbComments:false});});jQuery('#gallery-mixed-content-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-mixed-content-demo'),{thumbnail:false,pager:false,hash:true,plugins:[lgZoom,lgAutoplay,lgFullscreen,lgPager,lgRotate,lgShare,lgThumbnail,lgVideo]});});jQuery('#gallery-mixed-content-all-demo').justifiedGallery({captions:false,rowHeight:130,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-mixed-content-all-demo'),{thumbnail:false,pager:false,hash:true,plugins:[lgZoom,lgAutoplay,lgFullscreen,lgPager,lgRotate,lgShare,lgThumbnail,lgVideo]});});jQuery('#gallery-share-reddit-demo').justifiedGallery({captions:false,lastRow:'justify',rowHeight:180,margins:5}).on('jg.complete',function(){window.lightGallery(document.getElementById('gallery-share-reddit-demo'),{thumbnail:false,pager:false,hash:true,galleryId:2,plugins:[lgZoom,lgAutoplay,lgFullscreen,lgShare,lgThumbnail],addClass:'lg-custom-share-demo',extraProps:['redditTitle'],additionalShareOptions:[{selector:'.lg-share-reddit',dropdownHTML:'<li class="lg-share-item-reddit"><a class="lg-share-reddit" target="_blank"><svg class="lg-reddit" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><title>reddit</title><path d="M8 20c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM20 20c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM20.097 24.274c0.515-0.406 1.262-0.317 1.668 0.198s0.317 1.262-0.198 1.668c-1.434 1.13-3.619 1.86-5.567 1.86s-4.133-0.73-5.567-1.86c-0.515-0.406-0.604-1.153-0.198-1.668s1.153-0.604 1.668-0.198c0.826 0.651 2.46 1.351 4.097 1.351s3.271-0.7 4.097-1.351zM32 16c0-2.209-1.791-4-4-4-1.504 0-2.812 0.83-3.495 2.057-2.056-1.125-4.561-1.851-7.29-2.019l2.387-5.36 4.569 1.319c0.411 1.167 1.522 2.004 2.83 2.004 1.657 0 3-1.343 3-3s-1.343-3-3-3c-1.142 0-2.136 0.639-2.642 1.579l-5.091-1.47c-0.57-0.164-1.173 0.116-1.414 0.658l-3.243 7.282c-2.661 0.187-5.102 0.907-7.114 2.007-0.683-1.227-1.993-2.056-3.496-2.056-2.209 0-4 1.791-4 4 0 1.635 0.981 3.039 2.387 3.659-0.252 0.751-0.387 1.535-0.387 2.341 0 5.523 6.268 10 14 10s14-4.477 14-10c0-0.806-0.134-1.589-0.387-2.34 1.405-0.62 2.387-2.025 2.387-3.66zM27 5.875c0.621 0 1.125 0.504 1.125 1.125s-0.504 1.125-1.125 1.125-1.125-0.504-1.125-1.125 0.504-1.125 1.125-1.125zM2 16c0-1.103 0.897-2 2-2 0.797 0 1.487 0.469 1.808 1.145-1.045 0.793-1.911 1.707-2.552 2.711-0.735-0.296-1.256-1.016-1.256-1.856zM16 29.625c-6.42 0-11.625-3.414-11.625-7.625s5.205-7.625 11.625-7.625c6.42 0 11.625 3.414 11.625 7.625s-5.205 7.625-11.625 7.625zM28.744 17.856c-0.641-1.003-1.507-1.918-2.552-2.711 0.321-0.676 1.011-1.145 1.808-1.145 1.103 0 2 0.897 2 2 0 0.84-0.52 1.56-1.256 1.856z"></path></svg><span class="lg-dropdown-text">Reddit</span></a></li>',generateLink:function generateLink(galleryItem){var url=encodeURIComponent(window.location.href);var title=galleryItem.redditTitle;var redditShareLink="//reddit.com/submit?url=".concat(url,"&title=").concat(title);return redditShareLink;}}]});});lightGallery(document.getElementById('gallery-demo-super-customizable'),{pager:false,hash:false,mode:'lg-zoom-in-out',selector:'.gallery-item',addClass:'lightGallery-white-theme',plugins:[lgZoom,lgAutoplay,lgFullscreen,lgPager,lgRotate,lgShare,lgThumbnail,lgVideo],mobileSettings:{controls:false,showCloseIcon:false,download:false,rotate:false}});