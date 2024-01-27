import DiceBox from '@3d-dice/dice-box';
import DiceParser from "@3d-dice/dice-parser-interface";
import { Constants } from './utilities/bsConstants';
import { MESSAGES } from './utilities/bsMessageTracker';
import OBR from '@owlbear-rodeo/sdk';
import './dice/dicewindow.css'
import { GetResults } from './dice/bsDiceResults';

OBR.onReady(async () =>
{
    let roomMetadata = await OBR.room.getMetadata();
    let defaultId = await OBR.player.getId();
    let defaultName = await OBR.player.getName();
    let defaultColor = await OBR.player.getColor();
    let diceColor = roomMetadata[Constants.DICECOLORSETTING + defaultId] as string;
    let diceTexture = roomMetadata[Constants.DICETEXTURESETTING + defaultId] as string;
    let defaultViewers: "GM" | "SELF" | "ALL" = "SELF";
    let ERROR = false;
    let AUTOTIMER;

    let customName = "";
    let customColor = "";
    let customViewers: "GM" | "SELF" | "ALL" = "ALL";

    const DRP = new DiceParser();
    const Dice = new DiceBox(
        "#bones-window-body-app", // target DOM element to inject the canvas for rendering
        {
            id: "dice-canvas", // canvas element id
            assetPath: "/assets/",
            startingHeight: 8,
            throwForce: 10,
            spinForce: 5,
            gravity: 2,
            lightIntensity: 1,
            scale: 4,
            enableShadows: true,
            shadowTransparency: .5,
            theme: diceTexture,
            themeColor: diceColor
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
            senderId: defaultId,
            senderName: customName,
            viewers: customViewers
        };
        await OBR.player.setMetadata({ [`${Constants.EXTENSIONID}/metadata_logroll`]: bonesLogged });

        const finalMessage = `You rolled a ${finalResults.value}!`;
        await OBR.notification.show(finalMessage, "DEFAULT");
        clearTimeout(AUTOTIMER);
        setTimeout(async () =>
        {
            await OBR.popover.setHeight(Constants.EXTENSIONDICEWINDOWID, 0);
            await OBR.popover.setWidth(Constants.EXTENSIONDICEWINDOWID, 0);
        }, 1000);
    }

    ///StartUp
    try
    {
        Dice.init();
    } catch (error)
    {
        await OBR.notification.show("Unable to initialize 3D-Dice", "ERROR");
        ERROR = true;
    }

    OBR.room.onMetadataChange(metadata =>
    {
        diceColor = metadata[Constants.DICECOLORSETTING + defaultId] as string;
        diceTexture = metadata[Constants.DICETEXTURESETTING + defaultId] as string;

        Dice.updateConfig({ theme: diceTexture, themeColor: diceColor });
    });
    OBR.player.onChange(async (self) =>
    {
        defaultColor = self.color;
        defaultName = self.name;
        defaultId = self.id;

        if (ERROR)
        {
            await OBR.notification.show("Unable to display Dice in your browser", "ERROR");
        }
        else
        {
            if (self.metadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] != undefined)
            {
                const messageContainer = self.metadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] as IBonesRoll;

                if (!MESSAGES.IsThisOld(messageContainer.created, defaultId, "DEFAULT"))
                {
                    customName = messageContainer.senderName ?? defaultName;
                    customViewers = messageContainer.viewers ?? defaultViewers;
                    customColor = messageContainer.senderColor ?? defaultColor;

                    const VIEWPORTHEIGHT = await OBR.viewport.getHeight();
                    const VIEWPORTWIDTH = await OBR.viewport.getWidth();

                    await OBR.popover.setHeight(Constants.EXTENSIONDICEWINDOWID, VIEWPORTHEIGHT - 50);
                    await OBR.popover.setWidth(Constants.EXTENSIONDICEWINDOWID, VIEWPORTWIDTH - 50);

                    try
                    {
                        Dice.hide().clear();
                        Dice.show().roll(DRP.parseNotation(messageContainer.notation));

                        AUTOTIMER = setTimeout(async () =>
                        {
                            await OBR.popover.setHeight(Constants.EXTENSIONDICEWINDOWID, 0);
                            await OBR.popover.setWidth(Constants.EXTENSIONDICEWINDOWID, 0);
                        }, 6000);

                    } catch (error)
                    {
                        await OBR.notification.show("Unable to display Dice in your browser:"+ error, "ERROR");
                        await OBR.popover.setHeight(Constants.EXTENSIONDICEWINDOWID, 0);
                        await OBR.popover.setWidth(Constants.EXTENSIONDICEWINDOWID, 0);
                        ERROR = true;
                    }
                }
            }
        }
    });
});