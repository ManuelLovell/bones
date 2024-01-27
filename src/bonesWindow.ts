import DiceBox from '@3d-dice/dice-box';
import DiceParser from "@3d-dice/dice-parser-interface";
import { Constants } from './utilities/bsConstants';
import OBR from '@owlbear-rodeo/sdk';
import './dice/dicewindow.css'
import { GetResults } from './dice/bsDiceResults';

OBR.onReady(async () =>
{
    const roomMetadata = await OBR.room.getMetadata();
    const playerMetadata = await OBR.player.getMetadata();
    const defaultId = await OBR.player.getId();
    const defaultName = await OBR.player.getName();
    const defaultColor = await OBR.player.getColor();
    const diceColor = roomMetadata[Constants.DICECOLORSETTING + defaultId] as string;
    const diceTexture = roomMetadata[Constants.DICETEXTURESETTING + defaultId] as string;

    let defaultViewers: "GM" | "SELF" | "ALL" = "SELF";
    let AUTOTIMER;

    let customId = "";
    let customName = "";
    let customColor = "";
    let customViewers: "GM" | "SELF" | "ALL" = "ALL";

    const DRP = new DiceParser();
    const Dice = new DiceBox(
        "#bones-window-body-app", // target DOM element to inject the canvas for rendering
        {
            id: "dice-canvas", // canvas element id
            assetPath: "/assets/dice-box/",
            startingHeight: 8,
            throwForce: 10,
            spinForce: 5,
            gravity: 2,
            lightIntensity: 1,
            scale: 4,
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
        const finalResults = DRP.parseFinalResults(results);

        /// Use modified Result Parser to just get HTML back for Notifier
        const htmlResults = GetResults(finalResults);

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

        const finalMessage = `You rolled a ${finalResults.value}!`;
        await OBR.notification.show(finalMessage, "DEFAULT");
        clearTimeout(AUTOTIMER);

        setTimeout(async () =>
        {
            Constants.BONESWINDOW.classList.add('hidden');
        }, 1500);

        setTimeout(async () =>
        {
            await OBR.popover.close(Constants.EXTENSIONDICEWINDOWID);
        }, 2000);
    }

    ///StartUp
    try
    {
        Dice.init().then(() =>
        {
            const messageContainer = playerMetadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] as IBonesRoll;
            customName = messageContainer.senderName ?? defaultName;
            customViewers = messageContainer.viewers ?? defaultViewers;
            customColor = messageContainer.senderColor ?? defaultColor;
            customId = messageContainer.senderId ?? defaultId;

            try
            {
                Dice.hide().clear();
                Dice.show().roll(DRP.parseNotation(messageContainer.notation));

                SetAutoTimeout();

            } catch (error)
            {
                Dice.show().roll(DRP.parseNotation(messageContainer.notation), { theme: "default", themeColor: "#ff0000" });
                SetAutoTimeout();
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
            await OBR.popover.close(Constants.EXTENSIONDICEWINDOWID);
        }, 6000);
    }
});