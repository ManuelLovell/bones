import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { Constants } from './utilities/bsConstants';
import './dice/dicecontroller.css'

const defaultImageMappings = {
    'd4': '/dice-four.svg',
    'd6': '/dice-six.svg',
    'd8': '/dice-eight.svg',
    'd10': '/dice-ten.svg',
    'd12': '/dice-twelve.svg',
    'd20': '/dice-twenty.svg',
    'd100': '/dice-hundred.svg'
};

const defaultTextMappings = {
    'd4': 'Add a Four-Sided Dice',
    'd6': 'Add a Six-Sided Dice',
    'd8': 'Add an Eight-Sided Dice',
    'd10': 'Add a Ten-Sided Dice',
    'd12': 'Add a Twelve-Sided Dice',
    'd20': 'Add a Twenty-Sided Dice',
    'd100': 'Add a Hundred-Sided Dice'
};

// Genesys mappings for images and text
const genesysImageMappings = {
    'd4': '/gen-boost.svg',
    'd6': '/gen-setback.svg',
    'd8': '/gen-ability.svg',
    'd10': '/gen-difficulty.svg',
    'd12': '/gen-challenge.svg',
    'd20': '/blank.svg',
    'd100': '/gen-proficiency.svg'
};

const genesysTextMappings = {
    'd4': 'Add a Boost die',
    'd6': 'Add a Setback die',
    'd8': 'Add an Ability die',
    'd10': 'Add a Difficulty die',
    'd12': 'Add a Challenge die',
    'd20': "",
    'd100': 'Add a Proficiency die'
};
// Setup OBR functions
OBR.onReady(async () =>
{
    const diceWaitingImg = '/noscene.svg';
    const diceCloseImg = '/cancel-dice.svg';
    const diceGoImg = '/go.svg';
    const userName = await OBR.player.getName();
    const userId = await OBR.player.getId();
    const roomMeta = await OBR.room.getMetadata();
    let diceTexture = roomMeta[Constants.DICETEXTURESETTING + userId] as string ?? "default";

    function getMappings()
    {
        if (diceTexture === "genesys")
        {
            return {
                imageMappings: genesysImageMappings,
                textMappings: genesysTextMappings
            };
        }
        return {
            imageMappings: defaultImageMappings,
            textMappings: defaultTextMappings
        };
    }
    // Function to get button image
    function GetButtonImage(diceType)
    {
        const { imageMappings } = getMappings();
        return imageMappings[diceType] || 'default-image.svg'; // Provide a default image if needed
    }

    // Function to get button text
    function GetButtonText(diceType)
    {
        const { textMappings } = getMappings();
        return textMappings[diceType] || 'Unknown Dice Type'; // Provide a default text if needed
    }

    // Update the buttons if the theme/texture changes
    OBR.room.onMetadataChange((metdata) =>
    {
        const newTexture = metdata[Constants.DICETEXTURESETTING + userId] as string ?? "default";
        if ((diceTexture === "genesys" && newTexture !== "genesys")
            || diceTexture !== "genesys" && newTexture === "genesys")
        {
            diceTexture = newTexture; // Swap the old for checks
            ReplaceButtonText('d4Button', GetButtonImage('d4'), GetButtonText('d4'));
            ReplaceButtonText('d6Button', GetButtonImage('d6'), GetButtonText('d6'));
            ReplaceButtonText('d8Button', GetButtonImage('d8'), GetButtonText('d8'));
            ReplaceButtonText('d10Button', GetButtonImage('d10'), GetButtonText('d10'));
            ReplaceButtonText('d12Button', GetButtonImage('d12'), GetButtonText('d12'));
            ReplaceButtonText('d20Button', GetButtonImage('d20'), GetButtonText('d20'));
            ReplaceButtonText('d100Button', GetButtonImage('d100'), GetButtonText('d100'));

            const d20Button = document.getElementById('d20Button') as HTMLInputElement;
            d20Button.disabled = newTexture === "genesys";
            ResetDiceCounters();

            function ReplaceButtonText(id: string, image: string, text: string)
            {
                const button = document.getElementById(id) as HTMLInputElement;
                button.src = image;
                button.title = text;
            }
        }
    });

    await OBR.popover.open({
        id: Constants.EXTENSIONDICECONTROLLERID,
        url: '/dicecontroller.html',
        height: 350,
        width: 0,
        anchorOrigin: {
            horizontal: "RIGHT",
            vertical: "BOTTOM"
        },
        transformOrigin: {
            horizontal: "RIGHT",
            vertical: "BOTTOM"
        },
        disableClickAway: true,
        marginThreshold: 120
    });

    let rollDict: { [key: string]: number } = {};

    function createDiceButton(id: string, imageSrc: string, tooltip: string): HTMLDivElement
    {
        const button = document.createElement('input');
        button.id = id;
        button.type = 'image';
        button.value = '0';
        button.title = tooltip;
        button.src = imageSrc;
        if (diceTexture === "genesys" && id === "d20Button") button.disabled = true;
        button.classList.add("dice-button");
        button.onclick = (e) =>
        {
            let diceCount = parseInt(label.innerText);
            e.stopPropagation();
            e.preventDefault();

            if (diceCount === 0)
            {
                label.hidden = false;
            }

            if (diceCount < 20)
            {
                diceCount++;
                label.innerText = diceCount.toString();
                rollDict[id] = diceCount;
            }

            const ticks: number = Object.values(rollDict).reduce((sum, count) => sum + count, 0);
            if (ticks === 0)
            {
                diceButton.src = diceCloseImg;
                diceButton.classList.remove("pulse");
            }
            else
            {
                diceButton.src = diceGoImg;
                diceButton.classList.add("pulse");
            }
        };
        button.oncontextmenu = (e) => 
        {
            let diceCount = parseInt(label.innerText);
            e.stopPropagation();
            e.preventDefault();
            if (diceCount > 0)
            {
                diceCount--;
                label.innerText = diceCount.toString();
                rollDict[id] = diceCount;
            }
            if (diceCount === 0)
            {
                label.hidden = true;
            }

            const ticks: number = Object.values(rollDict).reduce((sum, count) => sum + count, 0);
            if (ticks === 0)
            {
                diceButton.src = diceCloseImg;
                diceButton.classList.remove("pulse");
            }
            else
            {
                diceButton.src = diceGoImg;
                diceButton.classList.add("pulse");
            }
        };

        const container = document.createElement('div');
        container.id = id + "Container";
        container.classList.add("label-container");

        const label = document.createElement('label');
        label.innerText = "0";
        label.id = id + "Label";
        label.classList.add("label");
        label.classList.add("dice-counter");
        label.hidden = true;

        container.appendChild(button);
        container.appendChild(label);

        return container;
    }

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    const selfButton = document.createElement('input');
    selfButton.id = "rollSelfButton";
    selfButton.type = 'button';
    selfButton.classList.add('options-button');
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
    gmButton.id = "rollGMButton";
    gmButton.type = 'button';
    gmButton.classList.add('options-button');
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

    const optionsButton = document.createElement('input');
    optionsButton.id = "showLogButton";
    optionsButton.type = 'button';
    optionsButton.classList.add('options-button');
    optionsButton.value = 'Log';
    optionsButton.dataset.active = Constants.CLOSE;
    optionsButton.onclick = async () =>
    {
        if (optionsButton.dataset.active === Constants.OPEN)
        {
            optionsButton.dataset.active = Constants.CLOSE;
            await OBR.popover.setWidth(Constants.EXTENSIONDICECONTROLLERID, 0);
            optionsButton.classList.remove('options-active');
        }
        else
        {
            optionsButton.dataset.active = Constants.OPEN;
            await OBR.popover.setWidth(Constants.EXTENSIONDICECONTROLLERID, 220);
            optionsButton.classList.add('options-active');
        }
    };

    optionsContainer.appendChild(optionsButton);
    optionsContainer.appendChild(gmButton);
    optionsContainer.appendChild(selfButton);

    const dFourButton = createDiceButton('d4Button', GetButtonImage('d4'), GetButtonText('d4'));
    const dSixButton = createDiceButton('d6Button', GetButtonImage('d6'), GetButtonText('d6'));
    const dEightButton = createDiceButton('d8Button', GetButtonImage('d8'), GetButtonText('d8'));
    const dTenButton = createDiceButton('d10Button', GetButtonImage('d10'), GetButtonText('d10'));
    const dTwelveButton = createDiceButton('d12Button', GetButtonImage('d12'), GetButtonText('d12'));
    const dTwentyButton = createDiceButton('d20Button', GetButtonImage('d20'), GetButtonText('d20'));
    const dHundredButton = createDiceButton('d100Button', GetButtonImage('d100'), GetButtonText('d100'));

    const sceneReady = await OBR.scene.isReady();

    const diceButton = document.createElement('input');
    diceButton.id = "diceWindowOpen";
    diceButton.type = 'image';
    diceButton.src = sceneReady ? diceCloseImg : diceWaitingImg;
    diceButton.disabled = !sceneReady;
    diceButton.classList.add("dice-button");
    diceButton.onclick = async () =>
    {
        const rolls: string[] = [];
        for (const [buttonId, count] of Object.entries(rollDict))
        {
            const diceType = buttonId.replace('Button', '');
            rolls.push(`${count}${diceType}`);
        }

        if (rolls.length !== 0)
        {
            let rollEquation = rolls.join('+');
            if (diceTexture === "genesys")
            {
                const replacements = new Map([
                    ['d100', 'proficiency'],
                    ['d12', 'challenge'],
                    ['d10', 'difficulty'],
                    ['d8', 'ability'],
                    ['d6', 'setback'],
                    ['d4', 'boost']
                ]);

                function replaceRollEquation(rollEquation: string): string
                {
                    let result = rollEquation;
                    for (const [key, value] of replacements)
                    {
                        result = result.replace(new RegExp(key, 'g'), value);
                    }
                    return result;
                }
                rollEquation = replaceRollEquation(rollEquation);
            }

            const selfview = selfButton.dataset.active;
            const gmview = gmButton.dataset.active;

            let viewedBy = "ALL";
            if (selfview === "TRUE") viewedBy = "SELF";
            if (gmview === "TRUE") viewedBy = "GM";

            const metadata: Metadata = {};
            const now = new Date().toISOString();
            metadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] // metadata[`com.battle-system.bones/metadata_bonesroll`]
                = {
                    notation: rollEquation, //"8d6!",
                    created: now, // new Date().toISOString()
                    senderName: userName, // Name to display for Roll
                    senderId: userId, // PlayerId | Self-Tracking-Number
                    viewers: viewedBy // "ALL" | "GM" | "SELF"
                } as IBonesRoll;

            await OBR.player.setMetadata(metadata);
            ResetDiceCounters();
        }
    };
    diceButton.oncontextmenu = async (e) =>
    {
        e.stopPropagation();
        e.preventDefault();
        ResetDiceCounters();
    };

    Constants.BONESDICECONTROLLER.appendChild(optionsContainer);
    Constants.BONESDICECONTROLLER.appendChild(dFourButton);
    Constants.BONESDICECONTROLLER.appendChild(dSixButton);
    Constants.BONESDICECONTROLLER.appendChild(dEightButton);
    Constants.BONESDICECONTROLLER.appendChild(dTenButton);
    Constants.BONESDICECONTROLLER.appendChild(dHundredButton);
    Constants.BONESDICECONTROLLER.appendChild(dTwelveButton);
    Constants.BONESDICECONTROLLER.appendChild(dTwentyButton);
    Constants.BONESDICECONTROLLER.appendChild(diceButton);

    function ResetDiceCounters()
    {
        rollDict = {};
        const diceCounters = document.querySelectorAll<HTMLLabelElement>('.dice-counter');
        diceButton.src = diceCloseImg;
        diceButton.classList.remove("pulse");
        gmButton.dataset.active = Constants.FALSE;
        gmButton.classList.remove('options-active');
        gmButton.classList.remove('options-hover');
        selfButton.dataset.active = Constants.FALSE;
        selfButton.classList.remove('options-active');
        selfButton.classList.remove('options-hover');
        diceCounters.forEach((counter) =>
        {
            counter.hidden = true;
            counter.innerText = '0';
        });
    }

    // Disable button if scene isn't ready, cannot access viewport controls without it
    OBR.scene.onReadyChange((ready) =>
    {
        diceButton.disabled = !ready;
        diceButton.src = ready ? diceCloseImg : diceWaitingImg;
        diceButton.classList.remove("pulse");
    });
});