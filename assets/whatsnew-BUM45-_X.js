import{O as e,C as t}from"./bsConstants-O-uRKwz7.js";const s=document.querySelector("#bs-whatsnew"),n=document.querySelector("#bs-whatsnew-notes");s.innerHTML=`
  <div id="newsContainer">
    <h1>Bones! 9/7</h1>
    Just some accessibility updates today.
    </br> Added a dice zoom option, so you can have mondo-dice. Or min-dice if you're insane.
    </br> I wanted to add front-coloring in (like Bones) but I'll have to tinker some more to see if that's possible with this dice package.
    </br> Also some styling updates for people using zoomed-in displays, or have an arrow vertical screen.  The scrollbar/scrolling should be available now in case.
    </br> I do see that Genesys dice are available for the package now, so I'll probably look into getting those configured soon.
    </br> Enjoy!
    </br>
    <h1>Bones! 5/24</h1>
    </br> Minor update to fix how negative modifiers are shown in the log (1d20-5, for example was showing as a positive in the roll text).
    <h1>Bones! 5/24</h1>
    </br> Hello again! Some changes/fixes.
    <li> You should now be able to 'click through' the dice while they are rolling.  This is a layering trade-off, because it means certain extensions/pop-ups might obscure the dice. (Meaning they might slide UNDER the windows)
    <li> Updated the parsing HTML to account better for negative numbers. (So 1d4-1d6 should be seen accurately.)
    <li> Updated the parsing HTML to visibly show modifiers on the formula. (So 1d4+6 should be seen accurately.)
    <li> The 'roll' button now pulses to show that it's changed to a 'click me' type of button.  Someone mentioned they couldn't figure out how to roll dice.. so.. this one's for you.
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
`;e.onReady(async()=>{n.innerHTML=`
    <div id="footButtonContainer">
        <a href="https://www.patreon.com/battlesystem" target="_blank">Patreon!</a>
        <a href="https://discord.gg/ANZKDmWzr6" target="_blank">OBR Discord!</a>
        <a href="https://help.roll20.net/hc/en-us/articles/360037773133-Dice-Reference" target="_blank">Roll20 Dice Reference</a>
    </div>
    <div class="close"><img style="height:40px; width:40px;" src="/close-button.svg"></div>
    `;const o=document.querySelector(".close");o.onclick=async()=>{await e.modal.close(t.EXTENSIONWHATSNEW)}});
