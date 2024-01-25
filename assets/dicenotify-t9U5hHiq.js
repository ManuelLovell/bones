import{O as c,C as e}from"./bsConstants-E4N5t5Rc.js";c.onReady(async()=>{const d=window.location.search,t=new URLSearchParams(d),a=decodeURIComponent(t.get("sender")),r=decodeURIComponent(t.get("message")),i=decodeURIComponent(t.get("color")),n=decodeURIComponent(t.get("queue"));e.BONESNOTIFICATIONS.innerHTML=`
        <div style="color:${i};" id="diceSender">${a}</div>
        <div id="diceContainer">
            <div id="diceImage">
                <img id="diceSvg" src="/dice-twenty.svg" alt="Dice Image">
            </div>
            <div id="diceMessage">${r}</div>
        </div>
    `;const s=document.getElementById("notifyHtml");e.BONESNOTIFICATIONS.style.border=`1px solid ${i}`;const o=document.createElement("input");o.type="image",o.classList.add("close-notify-button"),o.src="/close-button.svg",o.onclick=async()=>{await c.popover.close(e.EXTENSIONNOTIFY+n)},e.BONESNOTIFICATIONS.appendChild(o),s.scrollHeight>s.clientHeight&&await c.popover.setHeight(e.EXTENSIONNOTIFY+n,s.scrollHeight),setTimeout(async()=>{await c.popover.close(e.EXTENSIONNOTIFY+n)},3e3)});
