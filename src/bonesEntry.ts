import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { Constants } from './utilities/bsConstants';
import './dice/dicecontroller.css'

// Setup OBR functions
OBR.onReady(async () =>
{
    const diceWaitingImg = '/noscene.svg';
    const diceCloseImg = '/cancel-dice.svg';
    const diceGoImg = '/go.svg';
    const userName = await OBR.player.getName();
    const userId = await OBR.player.getId();

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

    const dFourButton = createDiceButton('d4Button', '/dice-four.svg', "Add a Four-Sided Dice");
    const dSixButton = createDiceButton('d6Button', '/dice-six.svg', "Add a Six-Sided Dice");
    const dEightButton = createDiceButton('d8Button', '/dice-eight.svg', "Add a Eight-Sided Dice");
    const dTenButton = createDiceButton('d10Button', '/dice-ten.svg', "Add a Ten-Sided Dice");
    const dTwelveButton = createDiceButton('d12Button', '/dice-twelve.svg', "Add a Twelve-Sided Dice");
    const dTwentyButton = createDiceButton('d20Button', '/dice-twenty.svg', "Add a Twenty-Sided Dice");
    const dHundredButton = createDiceButton('d100Button', '/dice-hundred.svg', "Add a Percentile and Ten-Sided Dice");

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
            const rollEquation = rolls.join('+');
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