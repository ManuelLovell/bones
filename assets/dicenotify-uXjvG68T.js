import{O as c,C as e}from"./bsConstants-ro0LkXpK.js";/* empty css                   */c.onReady(async()=>{const d=window.location.search,t=new URLSearchParams(d),a=decodeURIComponent(t.get("sender")),r=decodeURIComponent(t.get("message")),s=decodeURIComponent(t.get("color")),i=decodeURIComponent(t.get("queue"));e.BONESNOTIFICATIONS.innerHTML=`
        <div style="color:${s};" id="diceSender">${a}</div>
        <div id="diceContainer">
            <div id="diceImage">
                <img id="diceSvg" src="/dice-twenty.svg" alt="Dice Image">
            </div>
            <div id="diceMessage" class="dice-notification">${r}</div>
        </div>
    `;const n=document.getElementById("notifyHtml");e.BONESNOTIFICATIONS.style.border=`1px solid ${s}`;const o=document.createElement("input");o.type="image",o.classList.add("close-notify-button"),o.src="/close-button.svg",o.onclick=async()=>{await c.popover.close(e.EXTENSIONNOTIFY+i)},e.BONESNOTIFICATIONS.appendChild(o),n.scrollHeight>n.clientHeight&&await c.popover.setHeight(e.EXTENSIONNOTIFY+i,n.scrollHeight),setTimeout(async()=>{await c.popover.close(e.EXTENSIONNOTIFY+i)},3e3)});
