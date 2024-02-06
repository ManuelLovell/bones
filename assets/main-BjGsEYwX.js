import{O as r,C as t}from"./bsConstants-mb-QB5VY.js";r.onReady(async()=>{const h="/noscene.svg",L="/cancel-dice.svg",g="/go.svg",B=await r.player.getName(),N=await r.player.getId();await r.popover.open({id:t.EXTENSIONDICECONTROLLERID,url:"/dicecontroller.html",height:350,width:0,anchorOrigin:{horizontal:"RIGHT",vertical:"BOTTOM"},transformOrigin:{horizontal:"RIGHT",vertical:"BOTTOM"},disableClickAway:!0,marginThreshold:120});let v={};function p(e,u,C){const s=document.createElement("input");s.id=e,s.type="image",s.value="0",s.title=C,s.src=u,s.classList.add("dice-button"),s.onclick=E=>{let c=parseInt(o.innerText);E.stopPropagation(),E.preventDefault(),c===0&&(o.hidden=!1),c<20&&(c++,o.innerText=c.toString(),v[e]=c),Object.values(v).reduce((m,T)=>m+T,0)===0?a.src=L:a.src=g},s.oncontextmenu=E=>{let c=parseInt(o.innerText);E.stopPropagation(),E.preventDefault(),c>0&&(c--,o.innerText=c.toString(),v[e]=c),c===0&&(o.hidden=!0),Object.values(v).reduce((m,T)=>m+T,0)===0?a.src=L:a.src=g};const l=document.createElement("div");l.id=e+"Container",l.classList.add("label-container");const o=document.createElement("label");return o.innerText="0",o.id=e+"Label",o.classList.add("label"),o.classList.add("dice-counter"),o.hidden=!0,l.appendChild(s),l.appendChild(o),l}const O=document.createElement("div");O.classList.add("options-container");const n=document.createElement("input");n.id="rollSelfButton",n.type="button",n.classList.add("options-button"),n.value="Self",n.dataset.active=t.FALSE,n.onclick=()=>{n.dataset.active===t.TRUE?(n.dataset.active=t.FALSE,n.classList.remove("options-active")):(n.dataset.active=t.TRUE,n.classList.add("options-active"))};const i=document.createElement("input");i.id="rollGMButton",i.type="button",i.classList.add("options-button"),i.value="GM",i.onclick=()=>{i.dataset.active===t.TRUE?(i.dataset.active=t.FALSE,i.classList.remove("options-active")):(i.dataset.active=t.TRUE,i.classList.add("options-active"))};const d=document.createElement("input");d.id="showLogButton",d.type="button",d.classList.add("options-button"),d.value="Log",d.dataset.active=t.CLOSE,d.onclick=async()=>{d.dataset.active===t.OPEN?(d.dataset.active=t.CLOSE,await r.popover.setWidth(t.EXTENSIONDICECONTROLLERID,0),d.classList.remove("options-active")):(d.dataset.active=t.OPEN,await r.popover.setWidth(t.EXTENSIONDICECONTROLLERID,220),d.classList.add("options-active"))},O.appendChild(d),O.appendChild(i),O.appendChild(n);const I=p("d4Button","/dice-four.svg","Add a Four-Sided Dice"),D=p("d6Button","/dice-six.svg","Add a Six-Sided Dice"),f=p("d8Button","/dice-eight.svg","Add a Eight-Sided Dice"),w=p("d10Button","/dice-ten.svg","Add a Ten-Sided Dice"),b=p("d12Button","/dice-twelve.svg","Add a Twelve-Sided Dice"),y=p("d20Button","/dice-twenty.svg","Add a Twenty-Sided Dice"),A=p("d100Button","/dice-hundred.svg","Add a Percentile and Ten-Sided Dice"),R=await r.scene.isReady(),a=document.createElement("input");a.id="diceWindowOpen",a.type="image",a.src=R?L:h,a.disabled=!R,a.classList.add("dice-button"),a.onclick=async()=>{const e=[];for(const[u,C]of Object.entries(v)){const s=u.replace("Button","");e.push(`${C}${s}`)}if(e.length!==0){const u=e.join("+"),C=n.dataset.active,s=i.dataset.active;let l="ALL";C==="TRUE"&&(l="SELF"),s==="TRUE"&&(l="GM");const o={},E=new Date().toISOString();o[`${t.EXTENSIONID}/metadata_bonesroll`]={notation:u,created:E,senderName:B,senderId:N,viewers:l},await r.player.setMetadata(o),S()}},a.oncontextmenu=async e=>{e.stopPropagation(),e.preventDefault(),S()},t.BONESDICECONTROLLER.appendChild(O),t.BONESDICECONTROLLER.appendChild(I),t.BONESDICECONTROLLER.appendChild(D),t.BONESDICECONTROLLER.appendChild(f),t.BONESDICECONTROLLER.appendChild(w),t.BONESDICECONTROLLER.appendChild(A),t.BONESDICECONTROLLER.appendChild(b),t.BONESDICECONTROLLER.appendChild(y),t.BONESCONTROLLER.appendChild(a);function S(){v={};const e=document.querySelectorAll(".dice-counter");a.src=L,i.dataset.active=t.FALSE,i.classList.remove("options-active"),i.classList.remove("options-hover"),n.dataset.active=t.FALSE,n.classList.remove("options-active"),n.classList.remove("options-hover"),e.forEach(u=>{u.hidden=!0,u.innerText="0"})}r.scene.onReadyChange(e=>{a.disabled=!e,a.src=e?L:h})});
