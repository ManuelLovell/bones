import OBR from "@owlbear-rodeo/sdk";
import './bsWhatsNewStyle.css'
import { Constants } from "./bsConstants";


const whatsnew = document.querySelector<HTMLDivElement>('#bs-whatsnew')!;
const footer = document.querySelector<HTMLElement>('#bs-whatsnew-notes')!;

whatsnew.innerHTML = `
  <div id="newsContainer">
    <h1>Bones! 2/5</h1>
    </br> You'll notice.. everything got moved around.  In order to get approved for the store I had to compromise on some things that couldn't be achieved.
    </br> All in all, it should still function the same.  But now you can drag the Action popover wherever you want, and rolling doesn't collapse the window.
    </br> (Technically I could still, but it looks/feels weird with the tiny action icon..)
    </br>
    <h1>Bones! 1/28</h1>
    </br> You'll notice a few changes. Like the link to the Roll20 Dice reference.
    <li> Better response notifications on dice results. (Improved styling)
    <li> Custom roll input for those things that can't be done just clicking dice. (Like exploding dice, or advantage)
    <li> More general error-correction and bug checks.
    <li> Oh, and a d100.
    </br>
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
    <div id="footButtonContainer">
        <a href="https://www.patreon.com/battlesystem" target="_blank">Patreon!</a>
        <a href="https://discord.gg/ANZKDmWzr6" target="_blank">OBR Discord!</a>
        <a href="https://help.roll20.net/hc/en-us/articles/360037773133-Dice-Reference" target="_blank">Roll20 Dice Reference</a>
    </div>
    <div class="close"><img style="height:40px; width:40px;" src="/close-button.svg"></div>
    `;

    const closebutton = document.querySelector<HTMLElement>('.close')!;
    closebutton!.onclick = async () =>
    {
        await OBR.modal.close(Constants.EXTENSIONWHATSNEW);
    };
});
