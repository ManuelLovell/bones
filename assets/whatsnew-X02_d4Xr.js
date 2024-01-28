import{O as e,C as o}from"./bsConstants-vq7ZmLno.js";const s=document.querySelector("#bs-whatsnew"),r=document.querySelector("#bs-whatsnew-notes");s.innerHTML=`
  <div id="newsContainer">
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
`;e.onReady(async()=>{r.innerHTML=`
    <div id="footButtonContainer">
        <a href="https://www.patreon.com/battlesystem" target="_blank">Patreon!</a>
        <a href="https://discord.gg/ANZKDmWzr6" target="_blank">OBR Discord!</a>
        <a href="https://help.roll20.net/hc/en-us/articles/360037773133-Dice-Reference" target="_blank">Roll20 Dice Reference</a>
    </div>
    <div class="close"><img style="height:40px; width:40px;" src="/close-button.svg"></div>
    `;const t=document.querySelector(".close");t.onclick=async()=>{await e.modal.close(o.EXTENSIONWHATSNEW)}});
