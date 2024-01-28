import OBR from '@owlbear-rodeo/sdk';
import './dice/dicenotify.css'
import { Constants } from './utilities/bsConstants';

OBR.onReady(async () =>
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sender = decodeURIComponent(urlParams.get('sender')!);
    const message = decodeURIComponent(urlParams.get('message')!);
    const color = decodeURIComponent(urlParams.get('color')!);
    const queuenumber = decodeURIComponent(urlParams.get('queue')!);

    Constants.BONESNOTIFICATIONS.innerHTML =
        `
        <div style="color:${color};" id="diceSender">${sender}</div>
        <div id="diceContainer">
            <div id="diceImage">
                <img id="diceSvg" src="/dice-twenty.svg" alt="Dice Image">
            </div>
            <div id="diceMessage" class="dice-notification">${message}</div>
        </div>
    `;
    const htmlele = document.getElementById("notifyHtml") as HTMLElement;
    Constants.BONESNOTIFICATIONS.style.border = `1px solid ${color}`;

    const closeButton = document.createElement('input');
    closeButton.type = 'image';
    closeButton.classList.add('close-notify-button');
    closeButton.src = '/close-button.svg';
    closeButton.onclick = async () =>
    {
        await OBR.popover.close(Constants.EXTENSIONNOTIFY + queuenumber);
    };
    Constants.BONESNOTIFICATIONS.appendChild(closeButton);

    const hasVerticalScrollbar = htmlele.scrollHeight > htmlele.clientHeight;
    if (hasVerticalScrollbar) await OBR.popover.setHeight(Constants.EXTENSIONNOTIFY + queuenumber, htmlele.scrollHeight);

    setTimeout(async () =>
    {
        await OBR.popover.close(Constants.EXTENSIONNOTIFY + queuenumber);
    }, 3000);
});