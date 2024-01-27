import OBR from "@owlbear-rodeo/sdk";
import './bsWhatsNewStyle.css'
import { Constants } from "./bsConstants";


const whatsnew = document.querySelector<HTMLDivElement>('#bs-whatsnew')!;
const footer = document.querySelector<HTMLElement>('#bs-whatsnew-notes')!;

whatsnew.innerHTML = `
  <div id="newsContainer">
    <h1>Bones! 1/26</h1>
    </br> So, some things shuffled around. I decided to use the old dice-box package that Rumble started with for this one. It seems to have better performance in areas, though loses in some other areas.
    </br> There are less dice themes (by default), but they seem pretty easy to make. So - in the future - probably will.
    </br>
    </br> Also took a layer off the 'hidden' dice rolls. Now it lets people know you rolled (As was suggested by a Discord member), but doesn't tell them the results.
    </br>
  </div>
`;

OBR.onReady(async () =>
{
    footer.innerHTML = `
    <a href="https://www.patreon.com/battlesystem" target="_blank">Patreon!</a>
    <a href="https://discord.gg/ANZKDmWzr6" target="_blank">Join the OBR Discord!</a>
    <div class="close"><img style="height:40px; width:40px;" src="/close-button.svg"</div>`;

    const closebutton = document.querySelector<HTMLElement>('.close')!;
    closebutton!.onclick = async () =>
    {
        await OBR.modal.close(Constants.EXTENSIONWHATSNEW);
    };
});
