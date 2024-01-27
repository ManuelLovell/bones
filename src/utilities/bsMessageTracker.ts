import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { Constants } from "./bsConstants";
import { BSCACHE } from "./bsSceneCache";
import { Queue } from "./bsQueue";

export class MessageTracker
{
    messageCounter: { [key: string]: string };
    queue: Queue;

    constructor()
    {
        this.messageCounter = {};
        this.queue = new Queue(4);
    }

    public IsThisOld(timeStamp: string, processId: string, category = "DEFAULT"): boolean
    {
        const processCategory = `${processId}_${category}`;
        const logKey = this.messageCounter[processCategory];
        if (logKey)
        {
            if (logKey !== timeStamp)
            {
                this.messageCounter[processCategory] = timeStamp;
                return false;
            }
            else
                return true;
        }
        else
        {
            this.messageCounter[processCategory] = timeStamp;
            return false;
        }
    }
    /// Step 2. Send to the window.
    public async ShowBonesRoll(metadata: Metadata)
    {
        if (metadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] != undefined)
        {
            const bonesLog = metadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] as IBonesLog;

            if (!this.IsThisOld(bonesLog.created, bonesLog.senderId, "ROLL"))
            {

                const VIEWPORTHEIGHT = await OBR.viewport.getHeight();
                const VIEWPORTWIDTH = await OBR.viewport.getWidth();
                await OBR.popover.open({
                    id: Constants.EXTENSIONDICEWINDOWID,
                    url: '/dicewindow.html',
                    height: VIEWPORTHEIGHT - 50,
                    width: VIEWPORTWIDTH - 50,
                    anchorPosition: { top: 25, left: 25 },
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
        }
    }

    /// Step 3. This logs the roll to the window after the roll has completed.
    public async LogBonesRoll(metadata: Metadata)
    {
        if (metadata[`${Constants.EXTENSIONID}/metadata_logroll`] != undefined)
        {
            const bonesLog = metadata[`${Constants.EXTENSIONID}/metadata_logroll`] as IBonesLog;

            if (!this.IsThisOld(bonesLog.created, bonesLog.senderId, "LOG"))
            {
                if (bonesLog.senderId === BSCACHE.playerId
                    || bonesLog.viewers === BSCACHE.playerRole
                    || bonesLog.viewers === "ALL")
                {
                    const chatLog = document.querySelector<HTMLUListElement>('#rollLog')!;
                    const rollHtml = bonesLog.rollHtml as string;

                    let appendTarget = '';
                    if (bonesLog.viewers === "GM") appendTarget = "[GM]";
                    if (bonesLog.viewers === "SELF") appendTarget = "[SELF]";

                    // Flag to see if you're the sender
                    const log = document.createElement('li');

                    log.className = "dice-log-item";
                    log.innerHTML = `[${this.getTimestamp(bonesLog.created)}] ${appendTarget}<span style="font-weight: bold; color:${bonesLog.senderColor};">${bonesLog.senderName}</span> => ${rollHtml}`;
                    chatLog.append(log);
                    log.scrollIntoView(false);

                    if (bonesLog.senderId !== BSCACHE.playerId)
                    {
                        const VIEWHEIGHT = await OBR.viewport.getHeight();
                        const encodedMessage = encodeURIComponent(rollHtml);
                        const encodedSender = encodeURIComponent(bonesLog.senderName);

                        let senderColor = BSCACHE.party.find(player => player.id === bonesLog.senderId)?.color ?? "#FFF";
                        const encodedColor = encodeURIComponent(senderColor);

                        const queueNumber = this.queue.runFunction();
                        if (queueNumber !== -1)
                        {
                            const buffer = queueNumber === 0 ? VIEWHEIGHT - 50 : VIEWHEIGHT - (queueNumber * 100) - 50;
                            // SET UP NOTIFICATION
                            await OBR.popover.open({
                                id: Constants.EXTENSIONNOTIFY + queueNumber.toString(),
                                url: `/dicenotify.html?sender=${encodedSender}&message=${encodedMessage}&color=${encodedColor}&queue=${encodeURIComponent(queueNumber)}`,
                                height: 95,
                                width: 300,
                                anchorPosition: { top: buffer, left: 20 },
                                anchorReference: "POSITION",
                                anchorOrigin: {
                                    vertical: "BOTTOM",
                                    horizontal: "LEFT",
                                },
                                transformOrigin: {
                                    vertical: "BOTTOM",
                                    horizontal: "LEFT",
                                },
                                disableClickAway: true,
                                hidePaper: true
                            });
                        }
                    }
                }
                else
                {
                    // Letting people know a roll happened privatley.
                    const chatLog = document.querySelector<HTMLUListElement>('#rollLog')!;
                    const log = document.createElement('li');

                    log.className = "dice-log-item";
                    log.innerHTML = `[${this.getTimestamp(bonesLog.created)}]<span style="font-weight: bold; color:${bonesLog.senderColor};">${bonesLog.senderName}</span> rolled out of view.`;
                    chatLog.append(log);
                    log.scrollIntoView(false);

                    if (bonesLog.senderId !== BSCACHE.playerId)
                    {
                        const VIEWHEIGHT = await OBR.viewport.getHeight();
                        const encodedMessage = encodeURIComponent(" just rolled out of view.");
                        const encodedSender = encodeURIComponent(bonesLog.senderName);

                        let senderColor = BSCACHE.party.find(player => player.id === bonesLog.senderId)?.color ?? "#FFF";
                        const encodedColor = encodeURIComponent(senderColor);

                        const queueNumber = this.queue.runFunction();
                        if (queueNumber !== -1)
                        {
                            const buffer = queueNumber === 0 ? VIEWHEIGHT - 50 : VIEWHEIGHT - (queueNumber * 100) - 50;
                            // SET UP NOTIFICATION
                            await OBR.popover.open({
                                id: Constants.EXTENSIONNOTIFY + queueNumber.toString(),
                                url: `/dicenotify.html?sender=${encodedSender}&message=${encodedMessage}&color=${encodedColor}&queue=${encodeURIComponent(queueNumber)}`,
                                height: 95,
                                width: 300,
                                anchorPosition: { top: buffer, left: 20 },
                                anchorReference: "POSITION",
                                anchorOrigin: {
                                    vertical: "BOTTOM",
                                    horizontal: "LEFT",
                                },
                                transformOrigin: {
                                    vertical: "BOTTOM",
                                    horizontal: "LEFT",
                                },
                                disableClickAway: true,
                                hidePaper: true
                            });
                        }
                    }
                }
            }
        }
    }

    private getTimestamp(time: string): string
    {
        const now = new Date(time);
        const hours = now.getHours().toString().padStart(2, '0'); // Ensure two digits
        const minutes = now.getMinutes().toString().padStart(2, '0'); // Ensure two digits

        return `${hours}:${minutes}`;
    }
}

export const MESSAGES = new MessageTracker();