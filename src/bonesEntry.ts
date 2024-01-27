import OBR from '@owlbear-rodeo/sdk';
import { BSCACHE } from './utilities/bsSceneCache';
import { Constants } from './utilities/bsConstants';
import Coloris from '@melloware/coloris';
import * as Utilities from './utilities/bsUtilities';
import "@melloware/coloris/dist/coloris.css";
import './style.css'

Constants.BONESENTRY.innerHTML =
    `
    <div class="header">Dice Color</div><div id="whatsNew"></div>
    <div id="colorisContainer" class='coloris-container full'></div>
    <div class="header">Dice Choice</div>
    <div id="selectContainer" class="select"></div>
    <div class="header">Dice Log</div>
    <div id="rollContainer"><ul id="rollLog"></ul></div>
`;
let VIEWPORTHEIGHT;
let VIEWPORTWIDTH;

// Setup OBR functions
OBR.onReady(async () =>
{
    await BSCACHE.InitializeCache();
    BSCACHE.SetupHandlers();

    await OpenDiceController();
    await OpenDiceBoxWindow();
    CreateColorSelect();
    CreateTextureSelect();

    const whatsNewContainer = document.getElementById("whatsNew")!;
    whatsNewContainer.appendChild(Utilities.GetWhatsNewButton());

    // Check if the button needs repositioning every 2 seconds.
    setInterval(handleViewportdChange, 2000);
});

async function handleViewportdChange()
{
    const currentHeight = await OBR.viewport.getHeight();
    const currentWidth = await OBR.viewport.getWidth();

    if (currentHeight !== VIEWPORTHEIGHT || currentWidth !== VIEWPORTWIDTH)
    {
        await OBR.popover.close(Constants.EXTENSIONDICECONTROLLERID);
        await OpenDiceController();
        VIEWPORTHEIGHT = currentHeight;
        VIEWPORTWIDTH = currentWidth;
    }
}

async function OpenDiceController()
{
    try
    {
        await OpenDiceControllerInner();
    } catch (error)
    {
        setTimeout(async () =>
        {
            await OpenDiceControllerInner();
        }, 2000);
    }
}

async function OpenDiceBoxWindow()
{
    try
    {
        await OpenDiceBoxWindowInner();
    } catch (error)
    {
        setTimeout(async () =>
        {
            await OpenDiceBoxWindowInner();
        }, 2000);
    }
}

async function OpenDiceControllerInner()
{
    VIEWPORTHEIGHT = await OBR.viewport.getHeight();
    VIEWPORTWIDTH = await OBR.viewport.getWidth();

    await OBR.popover.close(Constants.EXTENSIONDICECONTROLLERID);
    await OBR.popover.open({
        id: Constants.EXTENSIONDICECONTROLLERID,
        url: '/dicecontroller.html',
        height: 54,
        width: 54,
        anchorPosition: { top: VIEWPORTHEIGHT - 75, left: VIEWPORTWIDTH - 20 },
        anchorReference: "POSITION",
        anchorOrigin: {
            vertical: "BOTTOM",
            horizontal: "RIGHT",
        },
        transformOrigin: {
            vertical: "BOTTOM",
            horizontal: "RIGHT",
        },
        disableClickAway: true,
        hidePaper: true
    });
}

async function OpenDiceBoxWindowInner()
{
    await OBR.popover.open({
        id: Constants.EXTENSIONDICEWINDOWID,
        url: '/dicewindow.html',
        height: 0,
        width: 0,
        anchorPosition: { top: 50, left: 50 },
        anchorReference: "POSITION",
        anchorOrigin: {
            vertical: "TOP",
            horizontal: "LEFT",
        },
        transformOrigin: {
            vertical: "TOP",
            horizontal: "LEFT",
        },
        disableClickAway: true,
        hidePaper: true
    });
}

function CreateColorSelect()
{
    let debouncer: ReturnType<typeof setTimeout>;

    const colorisContainer = document.getElementById('colorisContainer')!;

    const colorInput = document.createElement('input');
    colorInput.type = "text";
    colorInput.classList.add('coloris');
    colorInput.id = "diceColoris";
    colorInput.value = BSCACHE.playerDiceColor;
    colorInput.maxLength = 7;
    colorInput.oninput = async (event: Event) =>
    {
        if (!event || !event.target) return;
        const target = event.target as HTMLInputElement;

        clearTimeout(debouncer);

        // Debounce this input to avoid hitting OBR rate limit
        debouncer = setTimeout(async () =>
        {
            const hexTest = /#[a-f0-9]{6}/
            if (hexTest.test(target.value))
            {
                await OBR.room.setMetadata({ [Constants.DICECOLORSETTING + BSCACHE.playerId]: target.value });
            }
        }, 400);

    };
    colorisContainer.appendChild(colorInput);

    Coloris.init();
    Coloris({
        alpha: false,
        theme: 'polaroid',
        closeButton: true,
        themeMode: "dark",
        el: "#diceColoris",
    });
}

function CreateTextureSelect()
{
    const selectContainer = document.getElementById('selectContainer')!;

    const selector = <HTMLSelectElement>document.createElement('select');
    selector.id = "textureSelect";

    const textures = [
        { text: "Default", value: "default" },
        { text: "D.o.R", value: "diceOfRolling" },
        { text: "Gemstone", value: "gemstone" },
        { text: "Marble", value: "gemstoneMarble" },
        { text: "Rocky", value: "rock" },
        { text: "Rusty", value: "rust" },
        { text: "Smooth", value: "smooth" },
        { text: "Wood", value: "wooden" },
    ];

    textures.forEach((texture) =>
    {
        const option = document.createElement("option");
        option.setAttribute('value', texture.value);
        const text = document.createTextNode(texture.text);
        option.appendChild(text);

        selector.appendChild(option);
    });
    selector.value = BSCACHE.playerDiceTexture;

    selector.onchange = async (event) =>
    {
        const target = event.currentTarget as HTMLSelectElement;
        await OBR.room.setMetadata({ [Constants.DICETEXTURESETTING + BSCACHE.playerId]: target.value });
    }
    selectContainer.appendChild(selector);

}