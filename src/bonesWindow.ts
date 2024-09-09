import DiceBox from '@3d-dice/dice-box';
import DiceParser from "@3d-dice/dice-parser-interface";
import { Constants } from './utilities/bsConstants';
import OBR from '@owlbear-rodeo/sdk';
import './dice/dicewindow.css'
import { GetGenesysResults, GetGenesysResultsSimple, GetResults, parseGenesysRoll } from './dice/bsDiceResults';

OBR.onReady(async () =>
{
    const roomMetadata = await OBR.room.getMetadata();
    const playerMetadata = await OBR.player.getMetadata();
    const defaultId = await OBR.player.getId();
    const defaultName = await OBR.player.getName();
    const defaultColor = await OBR.player.getColor();
    const diceColor = roomMetadata[Constants.DICECOLORSETTING + defaultId] as string;
    let diceTexture = roomMetadata[Constants.DICETEXTURESETTING + defaultId] as string;
    let diceZoom = roomMetadata[Constants.DICEZOOMSETTING + defaultId] as number;

    if (!Constants.DEFAULTTEXTURES.includes(diceTexture))
    {
        diceTexture = "default";
    }
    if (!diceZoom)
    {
        diceZoom = 4;
    }

    let defaultViewers: "GM" | "SELF" | "ALL" = "SELF";
    let AUTOTIMER;

    let customId = "";
    let customName = "";
    let customColor = "";
    let customViewers: "GM" | "SELF" | "ALL" = "ALL";

    const DRP = new DiceParser();
    const Dice = new DiceBox(
        {
            id: "dice-canvas", // canvas element id
            assetPath: "/assets/dice-box/",
            container: "#bones-window-body-app", // target DOM element to inject the canvas for rendering
            startingHeight: 8,
            throwForce: 10,
            spinForce: 5,
            gravity: 2,
            lightIntensity: 1,
            scale: diceZoom, // Was 4
            enableShadows: true,
            shadowTransparency: .5,
            theme: diceTexture ?? "default",
            themeColor: diceColor ?? "#ff0000"
        }
    );

    Dice.onRollComplete = async (results) => 
    {
        const rerolls = DRP.handleRerolls(results);
        if (rerolls.length)
        {
            rerolls.forEach((roll) => Dice.add(roll, roll.groupId));
            return rerolls;
        }

        // if no rerolls needed then parse the final results
        let finalResultsValue = "";
        let htmlResults = "";

        if (diceTexture === "genesys")
        {
            htmlResults = GetGenesysResults(results);
            finalResultsValue = GetGenesysResultsSimple(results);
        }
        else
        {
            const finalResults = DRP.parseFinalResults(results);
            /// Use modified Result Parser to just get HTML back for Notifier
            htmlResults = GetResults(finalResults);
            finalResultsValue = finalResults.value;
        }

        const now = new Date().toISOString();
        const bonesLogged: IBonesLog = {
            created: now,
            rollHtml: htmlResults,
            senderColor: customColor,
            senderId: customId,
            senderName: customName,
            viewers: customViewers
        };
        await OBR.player.setMetadata({ [`${Constants.EXTENSIONID}/metadata_logroll`]: bonesLogged });

        const finalMessage = `You rolled a ${finalResultsValue}!`;
        await OBR.notification.show(finalMessage, "DEFAULT");
        clearTimeout(AUTOTIMER);

        setTimeout(async () =>
        {
            Constants.BONESWINDOW.classList.add('hidden');
        }, 1500);

        setTimeout(async () =>
        {
            await OBR.modal.close(Constants.EXTENSIONDICEWINDOWID);
        }, 2000);
    }

    ///StartUp
    try
    {
        Dice.init().then(async () =>
        {
            const messageContainer = playerMetadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] as IBonesRoll;
            customName = messageContainer.senderName ?? defaultName;
            customViewers = messageContainer.viewers ?? defaultViewers;
            customColor = messageContainer.senderColor ?? defaultColor;
            customId = messageContainer.senderId ?? defaultId;

            let rollnotation;
            try
            {
                if (diceTexture === "genesys")
                {
                    rollnotation = parseGenesysRoll(messageContainer.notation);
                }
                else
                {
                    rollnotation = DRP.parseNotation(messageContainer.notation);
                }
                Dice.hide().clear();
                Dice.show().roll(rollnotation);

                SetAutoTimeout();

            } catch (error)
            {
                // If we can't parse the formula, just leave so it doesnt block the screen.
                await OBR.notification.show("Unable to Parse Dice Notation", "ERROR");
                await OBR.modal.close(Constants.EXTENSIONDICEWINDOWID);

            }
        });

    } catch (error)
    {
        await OBR.notification.show("Unable to initialize 3D-Dice", "ERROR");
    }

    function SetAutoTimeout()
    {
        AUTOTIMER = setTimeout(async () =>
        {
            await OBR.modal.close(Constants.EXTENSIONDICEWINDOWID);
        }, 10000);
    }
});