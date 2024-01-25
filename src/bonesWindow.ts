import DiceBox from '@3d-dice/dice-box-threejs';
import { Constants } from './utilities/bsConstants';
import * as Utilities from './utilities/bsUtilities';
import OBR from '@owlbear-rodeo/sdk';
import './dice/dicewindow.css'

OBR.onReady(async () =>
{
    // FULL SCREEN WINDOW FOR SELF
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const preroll = decodeURIComponent(urlParams.get('preroll')!);
    const diceTexture = decodeURIComponent(urlParams.get('texture')!);
    const diceColor = decodeURIComponent(urlParams.get('color')!);

    const Box = new DiceBox("#bones-window-body-app", {
        theme_customColorset: {
            background: diceColor,
            foreground: Utilities.InvertColor(diceColor),
            baseScale: 80,
            texture: diceTexture,
            material: "plastic",
        },
        light_intensity: 1,
        gravity_multiplier: 600,
        baseScale: 100,
        strength: 3,
        onRollComplete: async (results: any) =>
        {
            const metadata = await OBR.player.getMetadata();
            // Get Data from Throw Roll and Transfer to Log Roll
            const messageContainer = metadata[`${Constants.EXTENSIONID}/metadata_throwroll`] as IBonesLog;
            await OBR.player.setMetadata({ [`${Constants.EXTENSIONID}/metadata_logroll`]: messageContainer });

            const message = `You rolled a ${results.total}!`;
            await OBR.notification.show(message, "DEFAULT");
            setTimeout(async () =>
            {
                await OBR.modal.close(Constants.EXTENSIONDICEWINDOWID);
            }, 1000);
        }
    });

    Box.initialize()
        .then(() =>
        {
            setTimeout(() =>
            {
                Box.roll(preroll.replace(/\_/g, '+'));
            }, 500);
        })
        .catch((e: any) => console.error(e));

    setTimeout(async () =>
    {
        await OBR.modal.close(Constants.EXTENSIONDICEWINDOWID);
    }, 5000);
});