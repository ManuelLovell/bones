import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { BSCACHE } from './utilities/bsSceneCache';
import { Constants } from './utilities/bsConstants';
import Coloris from '@melloware/coloris';
import * as Utilities from './utilities/bsUtilities';
import "@melloware/coloris/dist/coloris.css";
import './style.css'
import './dice/dicenotify.css'

Constants.BONESENTRY.innerHTML =
    `    
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
    </div>`;

OBR.onReady(async () =>
{
    await BSCACHE.InitializeCache();
    BSCACHE.SetupHandlers();

    CreateColorSelect();
    CreateTextureSelect();
    CreateManualRollArea();

    const whatsNewContainer = document.getElementById("whatsNew")!;
    whatsNewContainer.appendChild(Utilities.GetWhatsNewButton());

    CreateCollapser("optionsToggle", "optionsContainer", 50, "block");
    CreateCollapser("rollToggle", "rollContainer", 160, "block");
    CreateCollapser("manualRollToggle", "manualRollContainer", 31, "flex");

    function CreateCollapser(toggleName: string, containerName: string, height: number, display: string)
    {
        const toggle = document.getElementById(toggleName) as HTMLSpanElement;
        toggle.style.cursor = "pointer";
        const container = document.getElementById(containerName) as HTMLDivElement;
        toggle.onclick = async () =>
        {
            const actionHeight = await OBR.popover.getHeight(Constants.EXTENSIONDICECONTROLLERID) as number;
            //Container is 50px
            if (container.style.display !== "none")
            {
                toggle.innerText = "▶";
                await OBR.popover.setHeight(Constants.EXTENSIONDICECONTROLLERID, actionHeight - height);
                container.style.display = "none";
            }
            else
            {
                toggle.innerText = "▼";
                await OBR.popover.setHeight(Constants.EXTENSIONDICECONTROLLERID, actionHeight + height);
                container.style.display = display;
            }
        };
    }

    function CreateManualRollArea()
    {
        const manualRollContainer = document.getElementById("manualRollContainer")!;
        const viewToggleContainer = document.getElementById("viewToggleContainer")!;

        const inputButton = document.createElement('input');
        inputButton.type = "text";
        inputButton.placeholder = "Custom Roll";
        inputButton.classList.add('input-button');

        const selfButton = document.createElement('input');
        selfButton.id = "manualRollSelfButton";
        selfButton.type = 'button';
        selfButton.classList.add('options-button');
        selfButton.classList.add('options-hover');
        selfButton.value = 'Self';
        selfButton.dataset.active = Constants.FALSE;
        selfButton.onclick = () => 
        {
            if (selfButton.dataset.active === Constants.TRUE)
            {
                selfButton.dataset.active = Constants.FALSE;
                selfButton.classList.remove('options-active');
            }
            else
            {
                selfButton.dataset.active = Constants.TRUE;
                selfButton.classList.add('options-active');
            }
        };

        const gmButton = document.createElement('input');
        gmButton.id = "manualRollGMButton";
        gmButton.type = 'button';
        gmButton.classList.add('options-button');
        gmButton.classList.add('options-hover');
        gmButton.value = 'GM';
        gmButton.onclick = () =>
        {
            if (gmButton.dataset.active === Constants.TRUE)
            {
                gmButton.dataset.active = Constants.FALSE;
                gmButton.classList.remove('options-active');
            }
            else
            {
                gmButton.dataset.active = Constants.TRUE;
                gmButton.classList.add('options-active');
            }
        };

        const rollButton = document.createElement('input');
        rollButton.id = 'rollButton';
        rollButton.type = 'image';
        rollButton.src = '/dice-twenty.svg';
        rollButton.onclick = async () =>
        {
            await SendRoll();
        };
        inputButton.onkeydown = async (e) =>
        {
            if (e.key === 'Enter') await SendRoll();
        };

        manualRollContainer.prepend(inputButton);
        viewToggleContainer.appendChild(rollButton);
        viewToggleContainer.appendChild(selfButton);
        viewToggleContainer.appendChild(gmButton);

        async function SendRoll()
        {
            const notation = inputButton.value;
            if (notation.length > 0)
            {
                const selfview = selfButton.dataset.active;
                const gmview = gmButton.dataset.active;
                let viewedBy = "ALL";
                if (selfview === "TRUE") viewedBy = "SELF";
                if (gmview === "TRUE") viewedBy = "GM";

                const metadata: Metadata = {};
                const now = new Date().toISOString();
                metadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] // metadata[`com.battle-system.bones/metadata_bonesroll`]
                    = {
                        notation: notation, //"8d6!",
                        created: now, // new Date().toISOString()
                        senderName: BSCACHE.playerName, // Name to display for Roll
                        senderId: BSCACHE.playerId, // PlayerId | Self-Tracking-Number
                        viewers: viewedBy // "ALL" | "GM" | "SELF"
                    } as IBonesRoll;

                await OBR.player.setMetadata(metadata);
            }
            inputButton.value = "";
        }
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
        console.log(BSCACHE.theme.mode);
        Coloris.init();
        Coloris({
            alpha: false,
            theme: 'polaroid',
            closeButton: true,
            themeMode: BSCACHE.theme.mode === "DARK" ? "dark" : "light",
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
});
