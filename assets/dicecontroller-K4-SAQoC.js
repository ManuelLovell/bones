import{C as p,O as u}from"./bsConstants-mb-QB5VY.js";/* empty css                   */function Me(){const y=document.createElement("img");y.id="whatsNewButton",y.style.cursor="pointer",y.setAttribute("class","icon"),y.classList.add("clickable"),y.setAttribute("title","Whats New?"),y.setAttribute("src","/info.svg"),y.onclick=async function(){try{localStorage.setItem(p.VERSION,"true"),y.classList.remove("whats-new-shine")}catch{}await u.modal.open({id:p.EXTENSIONWHATSNEW,url:"/bswhatsnew.html",height:500,width:350})};try{localStorage.getItem(p.VERSION)!=="true"&&y.classList.add("whats-new-shine")}catch{}return y}function oe(y,t){let i;return function(){clearTimeout(i),i=setTimeout(()=>{y()},t)}}function fe(y,t){const i=window.matchMedia("(prefers-color-scheme: dark)"),g=i.matches?"dark":"light",v=i.matches?"light":"dark";for(var m=0;m<t.styleSheets.length;m++)for(var f=0;f<t.styleSheets[m].cssRules.length;f++){let o=t.styleSheets[m].cssRules[f];o&&o.media&&o.media.mediaText.includes("prefers-color-scheme")&&(y.mode=="LIGHT"?(o.media.appendMedium(`(prefers-color-scheme: ${g})`),o.media.mediaText.includes(v)&&o.media.deleteMedium(`(prefers-color-scheme: ${v})`)):y.mode=="DARK"&&(o.media.appendMedium(`(prefers-color-scheme: ${v})`),o.media.mediaText.includes(g)&&o.media.deleteMedium(`(prefers-color-scheme: ${g})`)))}}class Ne{constructor(t){this.totalSlots=t,this.initializeSlots()}slots=[];initializeSlots(){for(let t=0;t<this.totalSlots;t++)this.slots.push(!0)}occupySlot(){const t=this.slots.findIndex(i=>i);return t!==-1?(this.slots[t]=!1,setTimeout(()=>{this.releaseSlot(t)},3500),t):-1}releaseSlot(t){this.slots[t]=!0}runFunction(){const t=this.occupySlot();return console.log(t!==-1?`Function is running on slot ${t}`:"No available slots. Please try again later."),t}}class ke{messageCounter;queue;constructor(){this.messageCounter={},this.queue=new Ne(4)}IsThisOld(t,i,g="DEFAULT"){const v=`${i}_${g}`,m=this.messageCounter[v];return m?m!==t?(this.messageCounter[v]=t,!1):!0:(this.messageCounter[v]=t,!1)}async ShowBonesRoll(t){if(t[`${p.EXTENSIONID}/metadata_bonesroll`]!=null){const i=t[`${p.EXTENSIONID}/metadata_bonesroll`];if(!this.IsThisOld(i.created,i.senderId,"ROLL")){const g=await u.viewport.getHeight(),v=await u.viewport.getWidth();await u.popover.open({id:p.EXTENSIONDICEWINDOWID,url:"/dicewindow.html",height:g-50,width:v-50,anchorPosition:{top:25,left:25},anchorReference:"POSITION",anchorOrigin:{vertical:"TOP",horizontal:"LEFT"},transformOrigin:{vertical:"TOP",horizontal:"LEFT"},disableClickAway:!0,hidePaper:!0})}}}async LogBonesRoll(t){if(t[`${p.EXTENSIONID}/metadata_logroll`]!=null){const i=t[`${p.EXTENSIONID}/metadata_logroll`];if(!this.IsThisOld(i.created,i.senderId,"LOG"))if(i.senderId===O.playerId||i.viewers===O.playerRole||i.viewers==="ALL"){const g=document.querySelector("#rollLog"),v=i.rollHtml;let m="";i.viewers==="GM"&&(m="[GM]"),i.viewers==="SELF"&&(m="[SELF]");const f=document.createElement("li");if(f.className="dice-log-item dice-notification",f.innerHTML=`[${this.getTimestamp(i.created)}] ${m}<span style="font-weight: bold; color:${i.senderColor};">${i.senderName}</span> => ${v}`,g.append(f),f.scrollIntoView(!1),i.senderId!==O.playerId){const o=await u.viewport.getHeight(),d=encodeURIComponent(v),c=encodeURIComponent(i.senderName);let E=O.party.find(N=>N.id===i.senderId)?.color??"#FFF";const b=encodeURIComponent(E),L=this.queue.runFunction();if(L!==-1){const N=L===0?o-50:o-L*100-50;await u.popover.open({id:p.EXTENSIONNOTIFY+L.toString(),url:`/dicenotify.html?sender=${c}&message=${d}&color=${b}&queue=${encodeURIComponent(L)}`,height:95,width:300,anchorPosition:{top:N,left:20},anchorReference:"POSITION",anchorOrigin:{vertical:"BOTTOM",horizontal:"LEFT"},transformOrigin:{vertical:"BOTTOM",horizontal:"LEFT"},disableClickAway:!0,hidePaper:!0})}}}else{const g=document.querySelector("#rollLog"),v=document.createElement("li");if(v.className="dice-log-item dice-notification",v.innerHTML=`[${this.getTimestamp(i.created)}]<span style="font-weight: bold; color:${i.senderColor};">${i.senderName}</span> rolled out of view.`,g.append(v),v.scrollIntoView(!1),i.senderId!==O.playerId){const m=await u.viewport.getHeight(),f=encodeURIComponent(" just rolled out of view."),o=encodeURIComponent(i.senderName);let d=O.party.find(b=>b.id===i.senderId)?.color??"#FFF";const c=encodeURIComponent(d),E=this.queue.runFunction();if(E!==-1){const b=E===0?m-50:m-E*100-50;await u.popover.open({id:p.EXTENSIONNOTIFY+E.toString(),url:`/dicenotify.html?sender=${o}&message=${f}&color=${c}&queue=${encodeURIComponent(E)}`,height:95,width:300,anchorPosition:{top:b,left:20},anchorReference:"POSITION",anchorOrigin:{vertical:"BOTTOM",horizontal:"LEFT"},transformOrigin:{vertical:"BOTTOM",horizontal:"LEFT"},disableClickAway:!0,hidePaper:!0})}}}}}getTimestamp(t){const i=new Date(t),g=i.getHours().toString().padStart(2,"0"),v=i.getMinutes().toString().padStart(2,"0");return`${g}:${v}`}}const Y=new ke;class I{static PLAYER="PLAYER";static PARTY="PARTY";static SCENEITEMS="SCENEITEMS";static SCENEMETA="SCENEMETADATA";static SCENEGRID="SCENEGRID";static ROOMMETA="ROOMMETADATA";debouncedOnSceneItemsChange;debouncedOnSceneMetadataChange;debouncedOnRoomMetadataChange;playerId;playerColor;playerName;playerMetadata;playerRole;playerDiceColor;playerDiceTexture;party;gridDpi;gridScale;sceneItems;sceneSelected;sceneMetadata;sceneReady;roomMetadata;theme;caches;sceneMetadataHandler;sceneItemsHandler;sceneGridHandler;sceneReadyHandler;playerHandler;partyHandler;themeHandler;roomHandler;constructor(t){this.playerId="",this.playerName="",this.playerColor="",this.playerMetadata={},this.playerRole="PLAYER",this.party=[],this.sceneItems=[],this.sceneSelected=[],this.sceneMetadata={},this.gridDpi=0,this.gridScale=5,this.sceneReady=!1,this.theme="DARK",this.roomMetadata={},this.playerDiceTexture="skulls",this.playerDiceColor="#ff0000",this.caches=t,this.debouncedOnSceneItemsChange=oe(this.OnSceneItemsChange.bind(this),100),this.debouncedOnSceneMetadataChange=oe(this.OnSceneMetadataChanges.bind(this),100),this.debouncedOnRoomMetadataChange=oe(this.OnRoomMetadataChange.bind(this),100)}async InitializeCache(){if(this.sceneReady=await u.scene.isReady(),this.theme=await u.theme.getTheme(),fe(this.theme,document),this.caches.includes(I.PLAYER)){this.playerId=await u.player.getId(),this.playerName=await u.player.getName(),this.playerColor=await u.player.getColor(),this.playerMetadata=await u.player.getMetadata(),this.playerRole=await u.player.getRole();const t=this.playerMetadata[`${p.EXTENSIONID}/metadata_bonesroll`];t&&Y.IsThisOld(t.created,t.senderName,"DEFAULT");const i=this.playerMetadata[`${p.EXTENSIONID}/metadata_logroll`];i&&Y.IsThisOld(i.created,i.senderId,"LOG")}if(this.caches.includes(I.PARTY)){this.party=await u.party.getPlayers();for(const t of this.party){const i=t.metadata[`${p.EXTENSIONID}/metadata_bonesroll`];i&&Y.IsThisOld(i.created,i.senderName,"DEFAULT");const g=t.metadata[`${p.EXTENSIONID}/metadata_logroll`];g&&Y.IsThisOld(g.created,g.senderId,"LOG")}}this.caches.includes(I.SCENEITEMS)&&this.sceneReady&&(this.sceneItems=await u.scene.items.getItems()),this.caches.includes(I.SCENEMETA)&&this.sceneReady&&(this.sceneMetadata=await u.scene.getMetadata()),this.caches.includes(I.SCENEGRID)&&this.sceneReady&&(this.gridDpi=await u.scene.grid.getDpi(),this.gridScale=(await u.scene.grid.getScale()).parsed?.multiplier??5),this.caches.includes(I.ROOMMETA)&&(this.roomMetadata=await u.room.getMetadata(),this.playerDiceColor=this.roomMetadata[p.DICECOLORSETTING+this.playerId]??"#ff0000",this.playerDiceTexture=this.roomMetadata[p.DICETEXTURESETTING+this.playerId]??"default",p.DEFAULTTEXTURES.includes(this.playerDiceTexture)||(this.playerDiceTexture="default"))}KillHandlers(){this.caches.includes(I.SCENEMETA)&&this.sceneMetadataHandler!==void 0&&this.sceneMetadataHandler(),this.caches.includes(I.SCENEITEMS)&&this.sceneItemsHandler!==void 0&&this.sceneItemsHandler(),this.caches.includes(I.SCENEGRID)&&this.sceneGridHandler!==void 0&&this.sceneGridHandler(),this.caches.includes(I.PLAYER)&&this.playerHandler!==void 0&&this.playerHandler(),this.caches.includes(I.PARTY)&&this.partyHandler!==void 0&&this.partyHandler(),this.caches.includes(I.ROOMMETA)&&this.roomHandler!==void 0&&this.roomHandler(),this.themeHandler!==void 0&&this.themeHandler()}SetupHandlers(){(this.sceneMetadataHandler===void 0||this.sceneMetadataHandler.length===0)&&this.caches.includes(I.SCENEMETA)&&(this.sceneMetadataHandler=u.scene.onMetadataChange(async t=>{this.sceneMetadata=t,this.debouncedOnSceneMetadataChange(t)})),(this.sceneItemsHandler===void 0||this.sceneItemsHandler.length===0)&&this.caches.includes(I.SCENEITEMS)&&(this.sceneItemsHandler=u.scene.items.onChange(async t=>{this.sceneItems=t,this.debouncedOnSceneItemsChange(t)})),(this.sceneGridHandler===void 0||this.sceneGridHandler.length===0)&&this.caches.includes(I.SCENEGRID)&&(this.sceneGridHandler=u.scene.grid.onChange(async t=>{this.gridDpi=t.dpi,this.gridScale=parseInt(t.scale),await this.OnSceneGridChange(t)})),(this.playerHandler===void 0||this.playerHandler.length===0)&&this.caches.includes(I.PLAYER)&&(this.playerHandler=u.player.onChange(async t=>{this.playerName=t.name,this.playerColor=t.color,this.playerId=t.id,this.playerRole=t.role,this.playerMetadata=t.metadata,await this.OnPlayerChange(t)})),(this.partyHandler===void 0||this.partyHandler.length===0)&&this.caches.includes(I.PARTY)&&(this.partyHandler=u.party.onChange(async t=>{this.party=t,await this.OnPartyChange(t)})),(this.roomHandler===void 0||this.roomHandler.length===0)&&this.caches.includes(I.ROOMMETA)&&(this.roomHandler=u.room.onMetadataChange(async t=>{this.roomMetadata=t,this.debouncedOnRoomMetadataChange()})),this.themeHandler===void 0&&(this.themeHandler=u.theme.onChange(async t=>{this.theme=t.mode,await this.OnThemeChange(t)})),this.sceneReadyHandler===void 0&&(this.sceneReadyHandler=u.scene.onReadyChange(async t=>{this.sceneReady=t,t&&(this.sceneItems=await u.scene.items.getItems(),this.sceneMetadata=await u.scene.getMetadata(),this.gridDpi=await u.scene.grid.getDpi(),this.gridScale=(await u.scene.grid.getScale()).parsed?.multiplier??5),await this.OnSceneReadyChange(t)}))}async OnSceneMetadataChanges(t){}async OnSceneItemsChange(t){this.sceneReady}async OnSceneGridChange(t){}async OnSceneReadyChange(t){}async OnPlayerChange(t){await Y.ShowBonesRoll(t.metadata),await Y.LogBonesRoll(t.metadata)}async OnPartyChange(t){for await(const i of t)await Y.LogBonesRoll(i.metadata)}async OnRoomMetadataChange(){const t=this.roomMetadata[p.DICECOLORSETTING+this.playerId],i=this.roomMetadata[p.DICETEXTURESETTING+this.playerId];t&&(this.playerDiceColor=t),i&&(this.playerDiceTexture=i)}async OnThemeChange(t){fe(t,document)}}const O=new I([I.PLAYER,I.PARTY,I.ROOMMETA]),x=(()=>{/*!
* Copyright (c) 2021-2023 Momo Bassit.
* Licensed under the MIT License (MIT)
* https://github.com/mdbassit/Coloris
* Version: 0.21.1
* NPM: https://github.com/melloware/coloris-npm
*/return((y,t,i,g)=>{const v=t.createElement("canvas").getContext("2d"),m={r:0,g:0,b:0,h:0,s:0,v:0,a:1};let f,o,d,c,E,b,L,N,$,G,D,H,C,q,B,te,k={};const s={el:"[data-coloris]",parent:"body",theme:"default",themeMode:"light",rtl:!1,wrap:!0,margin:2,format:"hex",formatToggle:!1,swatches:[],swatchesOnly:!1,alpha:!0,forceAlpha:!1,focusInput:!0,selectInput:!1,inline:!1,defaultColor:"#000000",clearButton:!1,clearLabel:"Clear",closeButton:!1,closeLabel:"Close",onChange:()=>g,a11y:{open:"Open color picker",close:"Close color picker",clear:"Clear the selected color",marker:"Saturation: {s}. Brightness: {v}.",hueSlider:"Hue slider",alphaSlider:"Opacity slider",input:"Color value field",format:"Color format",swatch:"Color swatch",instruction:"Saturation and brightness selector. Use up, down, left and right arrow keys to select."}},V={};let ae="",z={},j=!1;function J(e){if(typeof e=="object")for(const a in e)switch(a){case"el":se(e.el),e.wrap!==!1&&Z(e.el);break;case"parent":f=t.querySelector(e.parent),f&&(f.appendChild(o),s.parent=e.parent,f===t.body&&(f=g));break;case"themeMode":s.themeMode=e.themeMode,e.themeMode==="auto"&&y.matchMedia&&y.matchMedia("(prefers-color-scheme: dark)").matches&&(s.themeMode="dark");case"theme":e.theme&&(s.theme=e.theme),o.className=`clr-picker clr-${s.theme} clr-${s.themeMode}`,s.inline&&K();break;case"rtl":s.rtl=!!e.rtl,t.querySelectorAll(".clr-field").forEach(r=>r.classList.toggle("clr-rtl",s.rtl));break;case"margin":e.margin*=1,s.margin=isNaN(e.margin)?s.margin:e.margin;break;case"wrap":e.el&&e.wrap&&Z(e.el);break;case"formatToggle":s.formatToggle=!!e.formatToggle,R("clr-format").style.display=s.formatToggle?"block":"none",s.formatToggle&&(s.format="auto");break;case"swatches":if(Array.isArray(e.swatches)){const r=[];e.swatches.forEach((h,w)=>{r.push(`<button type="button" id="clr-swatch-${w}" aria-labelledby="clr-swatch-label clr-swatch-${w}" style="color: ${h};">${h}</button>`)}),R("clr-swatches").innerHTML=r.length?`<div>${r.join("")}</div>`:"",s.swatches=e.swatches.slice()}break;case"swatchesOnly":s.swatchesOnly=!!e.swatchesOnly,o.setAttribute("data-minimal",s.swatchesOnly);break;case"alpha":s.alpha=!!e.alpha,o.setAttribute("data-alpha",s.alpha);break;case"inline":if(s.inline=!!e.inline,o.setAttribute("data-inline",s.inline),s.inline){const r=e.defaultColor||s.defaultColor;q=ne(r),K(),Q(r)}break;case"clearButton":typeof e.clearButton=="object"&&(e.clearButton.label&&(s.clearLabel=e.clearButton.label,L.innerHTML=s.clearLabel),e.clearButton=e.clearButton.show),s.clearButton=!!e.clearButton,L.style.display=s.clearButton?"block":"none";break;case"clearLabel":s.clearLabel=e.clearLabel,L.innerHTML=s.clearLabel;break;case"closeButton":s.closeButton=!!e.closeButton,s.closeButton?o.insertBefore(N,E):E.appendChild(N);break;case"closeLabel":s.closeLabel=e.closeLabel,N.innerHTML=s.closeLabel;break;case"a11y":const l=e.a11y;let n=!1;if(typeof l=="object")for(const r in l)l[r]&&s.a11y[r]&&(s.a11y[r]=l[r],n=!0);if(n){const r=R("clr-open-label"),h=R("clr-swatch-label");r.innerHTML=s.a11y.open,h.innerHTML=s.a11y.swatch,N.setAttribute("aria-label",s.a11y.close),L.setAttribute("aria-label",s.a11y.clear),$.setAttribute("aria-label",s.a11y.hueSlider),D.setAttribute("aria-label",s.a11y.alphaSlider),b.setAttribute("aria-label",s.a11y.input),d.setAttribute("aria-label",s.a11y.instruction)}break;default:s[a]=e[a]}}function pe(e,a){typeof e=="string"&&typeof a=="object"&&(V[e]=a,j=!0)}function me(e){delete V[e],Object.keys(V).length===0&&(j=!1,e===ae&&le())}function re(e){if(j){const a=["el","wrap","rtl","inline","defaultColor","a11y"];for(let l in V){const n=V[l];if(e.matches(l)){ae=l,z={},a.forEach(r=>delete n[r]);for(let r in n)z[r]=Array.isArray(s[r])?s[r].slice():s[r];J(n);break}}}}function le(){Object.keys(z).length>0&&(J(z),ae="",z={})}function se(e){T(t,"click",e,a=>{s.inline||(re(a.target),C=a.target,B=C.value,q=ne(B),o.classList.add("clr-open"),K(),Q(B),(s.focusInput||s.selectInput)&&(b.focus({preventScroll:!0}),b.setSelectionRange(C.selectionStart,C.selectionEnd)),s.selectInput&&b.select(),(te||s.swatchesOnly)&&ue().shift().focus(),C.dispatchEvent(new Event("open",{bubbles:!0})))}),T(t,"input",e,a=>{const l=a.target.parentNode;l.classList.contains("clr-field")&&(l.style.color=a.target.value)})}function K(){if(!o||!C&&!s.inline)return;const e=f,a=y.scrollY,l=o.offsetWidth,n=o.offsetHeight,r={left:!1,top:!1};let h,w,A,S={x:0,y:0};if(e&&(h=y.getComputedStyle(e),w=parseFloat(h.marginTop),A=parseFloat(h.borderTopWidth),S=e.getBoundingClientRect(),S.y+=A+a),!s.inline){const M=C.getBoundingClientRect();let F=M.x,X=a+M.y+M.height+s.margin;e?(F-=S.x,X-=S.y,F+l>e.clientWidth&&(F+=M.width-l,r.left=!0),X+n>e.clientHeight-w&&n+s.margin<=M.top-(S.y-a)&&(X-=M.height+n+s.margin*2,r.top=!0),X+=e.scrollTop):(F+l>t.documentElement.clientWidth&&(F+=M.width-l,r.left=!0),X+n-a>t.documentElement.clientHeight&&n+s.margin<=M.top&&(X=a+M.y-n-s.margin,r.top=!0)),o.classList.toggle("clr-left",r.left),o.classList.toggle("clr-top",r.top),o.style.left=`${F}px`,o.style.top=`${X}px`,S.x+=o.offsetLeft,S.y+=o.offsetTop}k={width:d.offsetWidth,height:d.offsetHeight,x:d.offsetLeft+S.x,y:d.offsetTop+S.y}}function Z(e){t.querySelectorAll(e).forEach(a=>{const l=a.parentNode;if(!l.classList.contains("clr-field")){const n=t.createElement("div");let r="clr-field";(s.rtl||a.classList.contains("clr-rtl"))&&(r+=" clr-rtl"),n.innerHTML='<button type="button" aria-labelledby="clr-open-label"></button>',l.insertBefore(n,a),n.setAttribute("class",r),n.style.color=a.value,n.appendChild(a)}})}function W(e){if(C&&!s.inline){const a=C;e&&(C=g,B!==a.value&&(a.value=B,a.dispatchEvent(new Event("input",{bubbles:!0})))),setTimeout(()=>{B!==a.value&&a.dispatchEvent(new Event("change",{bubbles:!0}))}),o.classList.remove("clr-open"),j&&le(),a.dispatchEvent(new Event("close",{bubbles:!0})),s.focusInput&&a.focus({preventScroll:!0}),C=g}}function Q(e){const a=Ie(e),l=we(a);de(l.s,l.v),_(a,l),$.value=l.h,o.style.color=`hsl(${l.h}, 100%, 50%)`,G.style.left=`${l.h/360*100}%`,c.style.left=`${k.width*l.s/100}px`,c.style.top=`${k.height-k.height*l.v/100}px`,D.value=l.a*100,H.style.left=`${l.a*100}%`}function ne(e){const a=e.substring(0,3).toLowerCase();return a==="rgb"||a==="hsl"?a:"hex"}function P(e){e=e!==g?e:b.value,C&&(C.value=e,C.dispatchEvent(new Event("input",{bubbles:!0}))),s.onChange&&s.onChange.call(y,e,C),t.dispatchEvent(new CustomEvent("coloris:pick",{detail:{color:e,currentEl:C}}))}function ce(e,a){const l={h:$.value*1,s:e/k.width*100,v:100-a/k.height*100,a:D.value/100},n=be(l);de(l.s,l.v),_(n,l),P()}function de(e,a){let l=s.a11y.marker;e=e.toFixed(1)*1,a=a.toFixed(1)*1,l=l.replace("{s}",e),l=l.replace("{v}",a),c.setAttribute("aria-label",l)}function ge(e){return{pageX:e.changedTouches?e.changedTouches[0].pageX:e.pageX,pageY:e.changedTouches?e.changedTouches[0].pageY:e.pageY}}function U(e){const a=ge(e);let l=a.pageX-k.x,n=a.pageY-k.y;f&&(n+=f.scrollTop),he(l,n),e.preventDefault(),e.stopPropagation()}function ye(e,a){let l=c.style.left.replace("px","")*1+e,n=c.style.top.replace("px","")*1+a;he(l,n)}function he(e,a){e=e<0?0:e>k.width?k.width:e,a=a<0?0:a>k.height?k.height:a,c.style.left=`${e}px`,c.style.top=`${a}px`,ce(e,a),c.focus()}function _(e,a){e===void 0&&(e={}),a===void 0&&(a={});let l=s.format;for(const h in e)m[h]=e[h];for(const h in a)m[h]=a[h];const n=Ce(m),r=n.substring(0,7);switch(c.style.color=r,H.parentNode.style.color=r,H.style.color=n,E.style.color=n,d.style.display="none",d.offsetHeight,d.style.display="",H.nextElementSibling.style.display="none",H.nextElementSibling.offsetHeight,H.nextElementSibling.style.display="",l==="mixed"?l=m.a===1?"hex":"rgb":l==="auto"&&(l=q),l){case"hex":b.value=n;break;case"rgb":b.value=Se(m);break;case"hsl":b.value=Le(Te(m));break}t.querySelector(`.clr-format [value="${l}"]`).checked=!0}function ve(){const e=$.value*1,a=c.style.left.replace("px","")*1,l=c.style.top.replace("px","")*1;o.style.color=`hsl(${e}, 100%, 50%)`,G.style.left=`${e/360*100}%`,ce(a,l)}function Ee(){const e=D.value/100;H.style.left=`${e*100}%`,_({a:e}),P()}function be(e){const a=e.s/100,l=e.v/100;let n=a*l,r=e.h/60,h=n*(1-i.abs(r%2-1)),w=l-n;n=n+w,h=h+w;const A=i.floor(r)%6,S=[n,h,w,w,h,n][A],M=[h,n,n,h,w,w][A],F=[w,w,h,n,n,h][A];return{r:i.round(S*255),g:i.round(M*255),b:i.round(F*255),a:e.a}}function Te(e){const a=e.v/100,l=a*(1-e.s/100/2);let n;return l>0&&l<1&&(n=i.round((a-l)/i.min(l,1-l)*100)),{h:e.h,s:n||0,l:i.round(l*100),a:e.a}}function we(e){const a=e.r/255,l=e.g/255,n=e.b/255,r=i.max(a,l,n),h=i.min(a,l,n),w=r-h,A=r;let S=0,M=0;return w&&(r===a&&(S=(l-n)/w),r===l&&(S=2+(n-a)/w),r===n&&(S=4+(a-l)/w),r&&(M=w/r)),S=i.floor(S*60),{h:S<0?S+360:S,s:i.round(M*100),v:i.round(A*100),a:e.a}}function Ie(e){const a=/^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i;let l,n;return v.fillStyle="#000",v.fillStyle=e,l=a.exec(v.fillStyle),l?(n={r:l[3]*1,g:l[4]*1,b:l[5]*1,a:l[6]*1},n.a=+n.a.toFixed(2)):(l=v.fillStyle.replace("#","").match(/.{2}/g).map(r=>parseInt(r,16)),n={r:l[0],g:l[1],b:l[2],a:1}),n}function Ce(e){let a=e.r.toString(16),l=e.g.toString(16),n=e.b.toString(16),r="";if(e.r<16&&(a="0"+a),e.g<16&&(l="0"+l),e.b<16&&(n="0"+n),s.alpha&&(e.a<1||s.forceAlpha)){const h=e.a*255|0;r=h.toString(16),h<16&&(r="0"+r)}return"#"+a+l+n+r}function Se(e){return!s.alpha||e.a===1&&!s.forceAlpha?`rgb(${e.r}, ${e.g}, ${e.b})`:`rgba(${e.r}, ${e.g}, ${e.b}, ${e.a})`}function Le(e){return!s.alpha||e.a===1&&!s.forceAlpha?`hsl(${e.h}, ${e.s}%, ${e.l}%)`:`hsla(${e.h}, ${e.s}%, ${e.l}%, ${e.a})`}function Oe(){t.getElementById("clr-picker")||(f=g,o=t.createElement("div"),o.setAttribute("id","clr-picker"),o.className="clr-picker",o.innerHTML=`<input id="clr-color-value" name="clr-color-value" class="clr-color" type="text" value="" spellcheck="false" aria-label="${s.a11y.input}"><div id="clr-color-area" class="clr-gradient" role="application" aria-label="${s.a11y.instruction}"><div id="clr-color-marker" class="clr-marker" tabindex="0"></div></div><div class="clr-hue"><input id="clr-hue-slider" name="clr-hue-slider" type="range" min="0" max="360" step="1" aria-label="${s.a11y.hueSlider}"><div id="clr-hue-marker"></div></div><div class="clr-alpha"><input id="clr-alpha-slider" name="clr-alpha-slider" type="range" min="0" max="100" step="1" aria-label="${s.a11y.alphaSlider}"><div id="clr-alpha-marker"></div><span></span></div><div id="clr-format" class="clr-format"><fieldset class="clr-segmented"><legend>${s.a11y.format}</legend><input id="clr-f1" type="radio" name="clr-format" value="hex"><label for="clr-f1">Hex</label><input id="clr-f2" type="radio" name="clr-format" value="rgb"><label for="clr-f2">RGB</label><input id="clr-f3" type="radio" name="clr-format" value="hsl"><label for="clr-f3">HSL</label><span></span></fieldset></div><div id="clr-swatches" class="clr-swatches"></div><button type="button" id="clr-clear" class="clr-clear" aria-label="${s.a11y.clear}">${s.clearLabel}</button><div id="clr-color-preview" class="clr-preview"><button type="button" id="clr-close" class="clr-close" aria-label="${s.a11y.close}">${s.closeLabel}</button></div><span id="clr-open-label" hidden>${s.a11y.open}</span><span id="clr-swatch-label" hidden>${s.a11y.swatch}</span>`,t.body.appendChild(o),d=R("clr-color-area"),c=R("clr-color-marker"),L=R("clr-clear"),N=R("clr-close"),E=R("clr-color-preview"),b=R("clr-color-value"),$=R("clr-hue-slider"),G=R("clr-hue-marker"),D=R("clr-alpha-slider"),H=R("clr-alpha-marker"),se(s.el),Z(s.el),T(o,"mousedown",e=>{o.classList.remove("clr-keyboard-nav"),e.stopPropagation()}),T(d,"mousedown",e=>{T(t,"mousemove",U)}),T(d,"touchstart",e=>{t.addEventListener("touchmove",U,{passive:!1})}),T(c,"mousedown",e=>{T(t,"mousemove",U)}),T(c,"touchstart",e=>{t.addEventListener("touchmove",U,{passive:!1})}),T(b,"change",e=>{const a=b.value;if(C||s.inline){const l=a===""?a:Q(a);P(l)}}),T(L,"click",e=>{P(""),W()}),T(N,"click",e=>{P(),W()}),T(R("clr-format"),"click",".clr-format input",e=>{q=e.target.value,_(),P()}),T(o,"click",".clr-swatches button",e=>{Q(e.target.textContent),P(),s.swatchesOnly&&W()}),T(t,"mouseup",e=>{t.removeEventListener("mousemove",U)}),T(t,"touchend",e=>{t.removeEventListener("touchmove",U)}),T(t,"mousedown",e=>{te=!1,o.classList.remove("clr-keyboard-nav"),W()}),T(t,"keydown",e=>{const a=e.key,l=e.target,n=e.shiftKey;if(a==="Escape"?W(!0):["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(a)&&(te=!0,o.classList.add("clr-keyboard-nav")),a==="Tab"&&l.matches(".clr-picker *")){const h=ue(),w=h.shift(),A=h.pop();n&&l===w?(A.focus(),e.preventDefault()):!n&&l===A&&(w.focus(),e.preventDefault())}}),T(t,"click",".clr-field button",e=>{j&&le(),e.target.nextElementSibling.dispatchEvent(new Event("click",{bubbles:!0}))}),T(c,"keydown",e=>{const a={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};Object.keys(a).includes(e.key)&&(ye(...a[e.key]),e.preventDefault())}),T(d,"click",U),T($,"input",ve),T(D,"input",Ee))}function ue(){return Array.from(o.querySelectorAll("input, button")).filter(l=>!!l.offsetWidth)}function R(e){return t.getElementById(e)}function T(e,a,l,n){const r=Element.prototype.matches||Element.prototype.msMatchesSelector;typeof l=="string"?e.addEventListener(a,h=>{r.call(h.target,l)&&n.call(h.target,h)}):(n=l,e.addEventListener(a,n))}function ee(e,a){a=a!==g?a:[],t.readyState!=="loading"?e(...a):t.addEventListener("DOMContentLoaded",()=>{e(...a)})}NodeList!==g&&NodeList.prototype&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach);function Re(e,a){C=a,B=C.value,re(a),q=ne(e),K(),Q(e),P(),B!==e&&C.dispatchEvent(new Event("change",{bubbles:!0}))}const ie=(()=>{const e={init:Oe,set:J,wrap:Z,close:W,setInstance:pe,setColor:Re,removeInstance:me,updatePosition:K,ready:ee};function a(l){ee(()=>{l&&(typeof l=="string"?se(l):J(l))})}for(const l in e)a[l]=function(){for(var n=arguments.length,r=new Array(n),h=0;h<n;h++)r[h]=arguments[h];ee(e[l],r)};return ee(()=>{y.addEventListener("resize",l=>{a.updatePosition()}),y.addEventListener("scroll",l=>{a.updatePosition()})}),a})();return ie.coloris=ie,ie})(window,document,Math)})();x.coloris;x.init;x.set;x.wrap;x.close;x.setInstance;x.removeInstance;x.updatePosition;p.BONESENTRY.innerHTML=`    
    <div class="header"><span style="float:left;" id="optionsToggle">▼</span>Dice Options</div><div id="whatsNew"></div>
    <div id="optionsContainer">
        <div style="display:flex; justify-content:space-between;">
            <div id="selectContainer" class="select"></div>
            <div id="colorisContainer" class='coloris-container full'></div>
        </div>
    </div>
    <div class="header"><span style="float:left;" id="rollToggle">▼</span>Dice Log</div>
    <div id="rollContainer"><ul id="rollLog"></ul></div>
    <div class="header"><span style="float:left;" id="manualRollToggle">▼</span>Custom Rolls</div>
    <div id="manualRollContainer">
        <div id="viewToggleContainer"></div>
    </div>`;u.onReady(async()=>{await O.InitializeCache(),O.SetupHandlers(),g(),v(),i(),document.getElementById("whatsNew").appendChild(Me()),t("optionsToggle","optionsContainer",50,"block"),t("rollToggle","rollContainer",160,"block"),t("manualRollToggle","manualRollContainer",31,"flex");function t(m,f,o,d){const c=document.getElementById(m);c.style.cursor="pointer";const E=document.getElementById(f);c.onclick=async()=>{const b=await u.popover.getHeight(p.EXTENSIONDICECONTROLLERID);E.style.display!=="none"?(c.innerText="▶",await u.popover.setHeight(p.EXTENSIONDICECONTROLLERID,b-o),E.style.display="none"):(c.innerText="▼",await u.popover.setHeight(p.EXTENSIONDICECONTROLLERID,b+o),E.style.display=d)}}function i(){const m=document.getElementById("manualRollContainer"),f=document.getElementById("viewToggleContainer"),o=document.createElement("input");o.type="text",o.placeholder="Custom Roll",o.classList.add("input-button");const d=document.createElement("input");d.id="manualRollSelfButton",d.type="button",d.classList.add("options-button"),d.classList.add("options-hover"),d.value="Self",d.dataset.active=p.FALSE,d.onclick=()=>{d.dataset.active===p.TRUE?(d.dataset.active=p.FALSE,d.classList.remove("options-active")):(d.dataset.active=p.TRUE,d.classList.add("options-active"))};const c=document.createElement("input");c.id="manualRollGMButton",c.type="button",c.classList.add("options-button"),c.classList.add("options-hover"),c.value="GM",c.onclick=()=>{c.dataset.active===p.TRUE?(c.dataset.active=p.FALSE,c.classList.remove("options-active")):(c.dataset.active=p.TRUE,c.classList.add("options-active"))};const E=document.createElement("input");E.id="rollButton",E.type="image",E.src="/dice-twenty.svg",E.onclick=async()=>{await b()},o.onkeydown=async L=>{L.key==="Enter"&&await b()},m.prepend(o),f.appendChild(E),f.appendChild(d),f.appendChild(c);async function b(){const L=o.value;if(L.length>0){const N=d.dataset.active,$=c.dataset.active;let G="ALL";N==="TRUE"&&(G="SELF"),$==="TRUE"&&(G="GM");const D={},H=new Date().toISOString();D[`${p.EXTENSIONID}/metadata_bonesroll`]={notation:L,created:H,senderName:O.playerName,senderId:O.playerId,viewers:G},await u.player.setMetadata(D)}o.value=""}}function g(){let m;const f=document.getElementById("colorisContainer"),o=document.createElement("input");o.type="text",o.classList.add("coloris"),o.id="diceColoris",o.value=O.playerDiceColor,o.maxLength=7,o.oninput=async d=>{if(!d||!d.target)return;const c=d.target;clearTimeout(m),m=setTimeout(async()=>{/#[a-f0-9]{6}/.test(c.value)&&await u.room.setMetadata({[p.DICECOLORSETTING+O.playerId]:c.value})},400)},f.appendChild(o),console.log(O.theme.mode),x.init(),x({alpha:!1,theme:"polaroid",closeButton:!0,themeMode:O.theme.mode==="DARK"?"dark":"light",el:"#diceColoris"})}function v(){const m=document.getElementById("selectContainer"),f=document.createElement("select");f.id="textureSelect",[{text:"Default",value:"default"},{text:"D.o.R",value:"diceOfRolling"},{text:"Gemstone",value:"gemstone"},{text:"Marble",value:"gemstoneMarble"},{text:"Rocky",value:"rock"},{text:"Rusty",value:"rust"},{text:"Smooth",value:"smooth"},{text:"Wood",value:"wooden"}].forEach(d=>{const c=document.createElement("option");c.setAttribute("value",d.value);const E=document.createTextNode(d.text);c.appendChild(E),f.appendChild(c)}),f.value=O.playerDiceTexture,f.onchange=async d=>{const c=d.currentTarget;await u.room.setMetadata({[p.DICETEXTURESETTING+O.playerId]:c.value})},m.appendChild(f)}});
