import{j as u}from"./jsx-runtime.C56yvxuZ.js";import{r as o,$ as L}from"./index.DOMFhz7X.js";import"./_commonjsHelpers.gnU0ypJ3.js";const E={baseCurrencySymbol:"$",baseCurrencyCode:"USD"},N={data:null,loading:!0,error:null,baseCurrencyCode:E.baseCurrencyCode,baseCurrencySymbol:E.baseCurrencySymbol,environment:"production"},$=o.createContext(N),_="https://cdn.kelviq.com/static/assets/country_flags";function H(t){if(!t||t.length!==2)return"";const n=t.toUpperCase();return/^[A-Z]{2}$/.test(n)?`<img src="${_}/${n}.svg" alt="${n} flag" class="kq-banner-flag" style="display:inline-block;vertical-align:middle;width:1.2em;height:1.2em;" />`:""}function A(t,n){return t?t.replace(/\{country_flag\}/g,n.countryCode?H(n.countryCode):"").replace(/\{country\}/g,n.country||"").replace(/\{coupon_code\}/g,n.code||"").replace(/\{discount_percentage\}/g,n.percentage!=null?String(n.percentage):""):""}const j=o.memo(({backgroundColor:t,fontColor:n,borderRadius:b,fontSize:m,unStyled:p,addCloseIcon:f,className:h="",onClose:y})=>{const{data:a,loading:R,error:x}=o.useContext($),[c,w]=o.useState(!1),l=o.useMemo(()=>{var e;return(e=a?.widgets)!=null&&e.length?a.widgets.find(r=>r.type==="BANNER")||a.widgets[0]:null},[a?.widgets]),C=o.useMemo(()=>({...l,...t!==void 0&&{backgroundColor:t},...n!==void 0&&{fontColor:n},...b!==void 0&&{borderRadius:b},...m!==void 0&&{fontSize:m},...p!==void 0&&{unStyled:p},...f!==void 0&&{addCloseIcon:f}}),[l,t,n,b,m,p,f]),k=o.useCallback(e=>e.unStyled?"":`
    .kq-banner {
      background-color: ${e.backgroundColor};
      color: ${e.fontColor};
      border-radius: ${e.borderRadius};
      font-size: ${e.fontSize};
      padding: 20px 10px;
      text-align: center;
      position: relative;
    }

    ${e.addCloseIcon?`
      .kq-banner-close-btn {
        width: 1rem;
        height: 1rem;
        border: 0;
        opacity: .5;
        background-color: transparent;
        color: currentColor;
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0;
        cursor: pointer;
      }
      .kq-banner-close-btn:hover {
        opacity: 1;
      }
    `:""}

    .kq-banner.kq-banner-has-logo {
      padding-left: 120px;
    }
    .kq-banner.kq-banner-hide-close-btn .kq-banner-close-btn {
      display: none;
    }
  `,[]);o.useEffect(()=>{if(!l)return;const e="kq-banner-styles";let r=document.getElementById(e);return r||(r=document.createElement("style"),r.id=e,document.head.appendChild(r)),r.innerText=k(C),document.body.classList.add("kq-has-banner"),()=>{r&&document.head.contains(r)&&document.head.removeChild(r),document.body.classList.remove("kq-has-banner")}},[l,C,k]);const g=o.useCallback(()=>{w(!0),y?.()},[y]);if(R||x||!a||!l||c)return null;const q=["kq-banner",!l.countryMessage&&"kq-banner-hide-close-btn",h].filter(Boolean).join(" ");return u.jsxs("div",{className:q,"data-testid":"kq-banner",children:[u.jsx("div",{className:"kq-banner-inner",dangerouslySetInnerHTML:{__html:A(l.countryMessage,a)}}),C.addCloseIcon&&l.countryMessage&&u.jsx("button",{className:"kq-banner-close-btn",onClick:g,"aria-label":"Close banner","data-testid":"kq-banner-close",children:u.jsx("svg",{viewBox:"0 0 24 24",focusable:"false","aria-hidden":"true",children:u.jsx("path",{fill:"currentColor",d:"M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"})})})]})});j.displayName="KQBanner";const B="https://edge.api.kelviq.com/api/v1/promotions/",O="https://edge.sandboxapi.kelviq.com/api/v1/promotions/",P=({children:t,config:n={},promotionId:b,accessToken:m,kqIdentifier:p,environment:f="production",baseCurrencyCode:h=E.baseCurrencyCode,baseCurrencySymbol:y=E.baseCurrencySymbol})=>{const[a,R]=o.useState(null),[x,c]=o.useState(!0),[w,l]=o.useState(null),{apiUrl:C=f==="sandbox"?O:B,onError:k,maxRetries:g=3,timeout:q=5e3}=n,e=o.useCallback(d=>{console.error("Kelviq Error:",d),l("Oops! Something went wrong. Please email admin@kelviq.com"),k&&k(new Error(d))},[k]);o.useEffect(()=>{let d=!0,s=0,T;function M(){const i=new XMLHttpRequest,v=new URLSearchParams;b&&v.append("promotion_id",b),p&&v.append("kq_identifier",p),h&&v.append("base_currency_code",h),v.append("url",window.location.href);const I=v.toString();i.open("GET",`${C}?${I}`,!0),i.setRequestHeader("Accept","application/json"),i.setRequestHeader("X-Requested-With","XMLHttpRequest"),m&&i.setRequestHeader("Authorization",`Bearer ${m}`),i.onload=function(){if(d)if(this.status>=200&&this.status<400)try{const S=JSON.parse(this.response);R(S),c(!1)}catch(S){e("Invalid response format"),console.error("Kelviq Error:",S),c(!1)}else s<g?(s++,setTimeout(M,Math.min(1e3*Math.pow(2,s),5e3))):(e("HTTP Error: "+this.status),c(!1))},i.onerror=function(){d&&(s<g?(s++,setTimeout(M,Math.min(1e3*Math.pow(2,s),5e3))):(e("Network error"),c(!1)))},i.ontimeout=function(){d&&(s<g?(s++,setTimeout(M,Math.min(1e3*Math.pow(2,s),5e3))):(e("Request timeout"),c(!1)))},i.timeout=q;try{i.send(),T=window.setTimeout(()=>{i.readyState!==4&&(i.abort(),d&&s>=g&&(e("Request timeout"),c(!1)))},q)}catch(S){if(!d)return;e("Request failed"),console.error("Kelviq Error:",S),c(!1)}}return M(),()=>{d=!1,T&&window.clearTimeout(T)}},[C,q,g,e,n.apiUrl,b,m,p,h]);const r=L.useMemo(()=>({data:a,loading:x,error:w,environment:f,baseCurrencyCode:h,baseCurrencySymbol:y}),[a,x,w,f,h,y]);return u.jsx($.Provider,{value:r,children:t})},z="69bd3c63-858d-43a4-b8a3-2b52fcab2114",K="client-54cb04c1-1b65-411b-89c0-45570c2da8ea:a51fe7cb-e942-4de4-9fbf-3bd10b604c9c";function D(){return u.jsx(P,{promotionId:z,accessToken:K,children:u.jsx(j,{unStyled:!0,className:"plans-promo-banner"})})}export{D as default};
