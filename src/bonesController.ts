import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { Constants } from './utilities/bsConstants';
import './dice/dicecontroller.css'

OBR.onReady(async () =>
{
    const diceOpenImg = '/dice-twenty.svg';
    const diceCloseImg = '/cancel-dice.svg';
    const diceGoImg = '/go.svg';
    const userName = await OBR.player.getName();
    const userId = await OBR.player.getId();

    let rollDict: { [key: string]: number } = {};

    function createDiceButton(id: string, imageSrc: string): HTMLDivElement
    {
        const button = document.createElement('input');
        button.id = id;
        button.type = 'image';
        button.value = '0';
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
            if (ticks === 0) diceButton.src = diceCloseImg;
            else diceButton.src = diceGoImg;
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
            if (ticks === 0) diceButton.src = diceCloseImg;
            else diceButton.src = diceGoImg;
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

    optionsContainer.appendChild(gmButton);
    optionsContainer.appendChild(selfButton);

    const dFourButton = createDiceButton('d4Button', '/dice-four.svg');
    const dSixButton = createDiceButton('d6Button', '/dice-six.svg');
    const dEightButton = createDiceButton('d8Button', '/dice-eight.svg');
    const dTenButton = createDiceButton('d10Button', '/dice-ten.svg');
    const dTwelveButton = createDiceButton('d12Button', '/dice-twelve.svg');
    const dTwentyButton = createDiceButton('d20Button', '/dice-twenty.svg');

    const diceButton = document.createElement('input');
    diceButton.id = "diceWindowOpen";
    diceButton.type = 'image';
    diceButton.src = diceOpenImg;
    diceButton.classList.add("dice-button");
    diceButton.value = Constants.CLOSE;
    diceButton.onclick = async () =>
    {
        if (diceButton.value === Constants.CLOSE)
        {
            diceButton.src = diceCloseImg;
            diceButton.value = Constants.OPEN;
            diceButton.hidden = true;
            await OBR.popover.setHeight(Constants.EXTENSIONDICECONTROLLERID, 420);
            ToggleDiceDisplay();
            diceButton.hidden = false;
            gmButton.classList.add('options-hover');
            selfButton.classList.add('options-hover');
        }
        else
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
                        notation: rollEquation, // "2d20kh1"
                        created: now, // new Date().toISOString()
                        senderName: userName, // Name to display for Roll
                        senderId: userId, // PlayerId | Self-Tracking-Number
                        viewers: viewedBy // "ALL" | "GM" | "SELF"
                    } as IBonesRoll;

                await OBR.player.setMetadata(metadata);
            }

            diceButton.src = diceOpenImg;
            diceButton.value = Constants.CLOSE;
            ToggleDiceDisplay();
            setTimeout(async () =>
            {
                await OBR.popover.setHeight(Constants.EXTENSIONDICECONTROLLERID, 54);
            }, 500);
        }
    };
    diceButton.oncontextmenu = async (e) =>
    {
        e.stopPropagation();
        e.preventDefault();
        if (diceButton.value === Constants.OPEN)
        {
            diceButton.src = diceOpenImg;
            diceButton.value = Constants.CLOSE;
            ToggleDiceDisplay();
            setTimeout(async () =>
            {
                await OBR.popover.setHeight(Constants.EXTENSIONDICECONTROLLERID, 54);
            }, 500);
        }
    };

    Constants.BONESDICECONTROLLER.appendChild(optionsContainer);
    Constants.BONESDICECONTROLLER.appendChild(dFourButton);
    Constants.BONESDICECONTROLLER.appendChild(dSixButton);
    Constants.BONESDICECONTROLLER.appendChild(dEightButton);
    Constants.BONESDICECONTROLLER.appendChild(dTenButton);
    Constants.BONESDICECONTROLLER.appendChild(dTwelveButton);
    Constants.BONESDICECONTROLLER.appendChild(dTwentyButton);
    Constants.BONESCONTROLLER.appendChild(diceButton);

    function ToggleDiceDisplay()
    {
        if (Constants.BONESDICECONTROLLER.classList.contains('hidden'))
        {
            Constants.BONESDICECONTROLLER.classList.remove('hidden');
            Constants.BONESDICECONTROLLER.style.height = '358px';
        } else
        {
            Constants.BONESDICECONTROLLER.classList.add('hidden');
            Constants.BONESDICECONTROLLER.style.height = '0';
            rollDict = {};
            resetDiceCounters();
        }
    }

    function resetDiceCounters()
    {
        const diceCounters = document.querySelectorAll<HTMLLabelElement>('.dice-counter');
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
});
