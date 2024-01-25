import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { Constants } from "./bsConstants";
import { DiceExpressionRoll, DiceRollResult, DiceRoller, DieRoll, DieRollBase } from "dice-roller-parser";
import { BSCACHE } from "./bsSceneCache";

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

    public async LogBonesRoll(metadata: Metadata)
    {
        if (metadata[`${Constants.EXTENSIONID}/metadata_logroll`] != undefined)
        {
            const bonesLog = metadata[`${Constants.EXTENSIONID}/metadata_logroll`] as IBonesLog;

            if (!this.IsThisOld(bonesLog.created, bonesLog.sender, "LOG"))
            {
                if (bonesLog.senderId === BSCACHE.playerId
                    || bonesLog.viewers === BSCACHE.playerRole
                    || bonesLog.viewers === "ALL")
                {
                    const chatLog = document.querySelector<HTMLUListElement>('#rollLog')!;
                    const message = bonesLog.rollMessage as string;

                    let appendTarget = '';
                    if (bonesLog.viewers === "GM") appendTarget = "[GM]";
                    if (bonesLog.viewers === "SELF") appendTarget = "[SELF]";

                    // Flag to see if you're the sender
                    const log = document.createElement('li');

                    log.className = "dice-log-item";
                    log.style.color = bonesLog.color;
                    log.innerText = `[${this.getTimestamp(bonesLog.created)}] - ${appendTarget}${bonesLog.sender} ${message}`;
                    chatLog.append(log);
                    log.scrollIntoView(false);

                    if (bonesLog.senderId !== BSCACHE.playerId)
                    {
                        const VIEWHEIGHT = await OBR.viewport.getHeight();
                        const encodedMessage = encodeURIComponent(message);
                        const encodedSender = encodeURIComponent(bonesLog.sender);

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

    public async VerifyMetadataRoll(metadata: Metadata)
    {
        // Get the roll from the Controller, FOrecast it and Prep the Window. SELF ONLY
        if (metadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] != undefined)
        {
            const messageContainer = metadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] as IBonesRoll;

            if (!this.IsThisOld(messageContainer.created, messageContainer.sender, "DEFAULT"))
            {
                await this.PrepareDiceRoll(messageContainer.notation, messageContainer.sender, messageContainer.viewers);
            }
        }

        // Outside Roll Acceptance
        if (metadata[`${Constants.EXTENSIONID}/outside_bonesroll`] != undefined)
        {
            const messageContainer = metadata[`${Constants.EXTENSIONID}/outside_bonesroll`] as IBonesRoll;

            if (!this.IsThisOld(messageContainer.created, messageContainer.sender, "OUTSIDE"))
            {
                await this.PrepareDiceRoll(messageContainer.notation, messageContainer.sender, messageContainer.viewers);
            }
        }

        // This is coming after forecasting, and is sending it to the roll window. SELF ONLY
        if (metadata[`${Constants.EXTENSIONID}/metadata_throwroll`] != undefined)
        {
            const messageContainer = metadata[`${Constants.EXTENSIONID}/metadata_throwroll`] as IBonesLog;
            const VIEWPORTHEIGHT = await OBR.viewport.getHeight();
            const VIEWPORTWIDTH = await OBR.viewport.getWidth();

            if (!this.IsThisOld(messageContainer.created, messageContainer.sender, "THROW"))
            {
                await OBR.modal.close(Constants.EXTENSIONDICEWINDOWID);
                await OBR.modal.open({
                    id: Constants.EXTENSIONDICEWINDOWID,
                    url: messageContainer.rollResult,
                    height: VIEWPORTHEIGHT - 100,
                    width: VIEWPORTWIDTH - 100,
                    disablePointerEvents: true,
                    hideBackdrop: true,
                    hidePaper: true
                });
            }
        }
    }

    private async PrepareDiceRoll(notation: string, sender: string, viewers: "SELF" | "ALL" | "GM")
    {
        //if (diceBusy) return;

        if (Constants.NORMALDICE.test(notation))
        {
            this.ForecastDice(notation, true, sender, viewers);
        }
        else
        {
            try
            {
                this.ForecastDice(notation, false, sender, viewers);
            }
            catch (error)
            {
                console.log(`Friend Roll was unable to be parsed: ${notation} | ${error}`);
            }
        }
    }

    private async ForecastDice(notation: string, normal: boolean, sender = "Bones!", viewers: "SELF" | "ALL" | "GM")
    {
        let cleanNotation = notation.replace(/\s/g, '');
        let dString: string[] = [];
        let vString: string[] = [];
        let diceRolled: string[] = [];
        let total = 0;
        let modifier = 0;
        let hundred = false;

        let diceResultMessage = "";

        // Create a dice roller to parse
        const diceRoller = new DiceRoller();
        let RESULT = diceRoller.roll(cleanNotation) as any;
        if (cleanNotation === "1d100")
        {
            RESULT = diceRoller.roll("1d10") as any;
            RESULT.value = RESULT.value * 10;
            RESULT.rolls[0].roll = RESULT.value;
            RESULT.rolls[0].value = RESULT.value;
            RESULT.rolls[0].die = 100;
        }
        else
        {
            RESULT = diceRoller.roll(cleanNotation) as any;
        }

        // ROLL 20 STYLE ROLLING
        if (!normal)
        {
            let booleanRoll = "";

            let diceRolled: string[] = [];
            if (RESULT.type == "die")
            {
                const dieRoll = RESULT as DiceRollResult;

                if (((notation.indexOf("<") !== -1) || notation.indexOf(">") !== -1) && this.checkBoolValues(dieRoll.rolls))
                {
                    dieRoll.rolls.forEach((rl) =>
                    {
                        const roll = rl as DieRoll;
                        vString.push(roll.value.toString());
                        dString.push("1d" + roll.die.toString());
                        const contest = rl.value === 1 ? "Pass" : "Fail";
                        diceRolled.push(`[${roll.critical === "success" ? "💥" : ""}${contest}${roll.valid ? "" : "✕"}]`);
                    });
                    if (dieRoll.value !== 0)
                    {
                        booleanRoll = dieRoll.value === 1 ? `1 success!` : `${dieRoll.value} successes!`;
                    }
                    else
                    {
                        booleanRoll = "no success..";
                    }
                }
                else
                {
                    if (dieRoll.die.type === "fate")
                    {
                        dieRoll.rolls.forEach((rl) =>
                        {
                            const roll = rl as DieRoll;
                            vString.push(roll.value.toString());
                            dString.push("1df");
                        });
                    }
                    else
                    {
                        dieRoll.rolls.forEach((rl) =>
                        {
                            const roll = rl as DieRoll;
                            vString.push(roll.value.toString());
                            dString.push("1d" + roll.die.toString());
                            diceRolled.push(`[${roll.critical === "success" ? "💥" : ""}${roll.value}${roll.valid ? "" : "✕"}]`);
                        });

                    }
                }
            }
            else if (RESULT.type == "number")
            {
                // Do nothing?
            }
            else
            {
                const expressionRoll = RESULT as DiceExpressionRoll;
                expressionRoll.dice.forEach((dice) =>
                {
                    const eDieRoll = dice as DiceRollResult;
                    if (eDieRoll.rolls?.length > 0)
                    {
                        eDieRoll.rolls.forEach((rl) => 
                        {
                            const roll = rl as DieRoll;
                            vString.push(roll.value.toString());
                            dString.push("1d" + roll.die.toString());
                            diceRolled.push(`[D${roll.die}⮞${roll.critical === "success" ? "💥" : ""}${roll.value}${roll.valid ? "" : "✕"}]`);
                        });
                    }
                });
            }

            // Starting roll mesage
            diceResultMessage = " rolled ";
            let rollInput = cleanNotation;
            // Remove the label from the string
            // Add label name
            if (RESULT.label)
            {
                rollInput = cleanNotation.replace(RESULT.label, "");
                diceResultMessage += "⭐" + RESULT.label + "⭐";
            }
            // Append results
            diceResultMessage += `[${rollInput}] → ${diceRolled.join(", ")} for ${booleanRoll == "" ? RESULT.value + "!" : booleanRoll}`;
        }
        else
        {
            if (RESULT.type === "expressionroll")
            {
                if (cleanNotation === "1d10+1d100")
                {
                    let d10 = Math.round(Math.random() * 10) + 1;
                    let d100 = Math.round(Math.random() * 9 + 1) * 10;
                    if (d100 === 100 && d10 !== 10)
                    {
                        d100 = 0;
                    }
                    else if (d100 !== 100 && d10 === 10)
                    {
                        d10 = 0;
                    }
                    else if (d100 === 100 && d10 === 10)
                    {
                        d10 = 0;
                        d100 = 0;
                        hundred = true;
                    }
                    vString.push(d10.toString());
                    dString.push("1d10");
                    vString.push(d100.toString());
                    dString.push("1d100");
                    diceResultMessage = ` rolled (1d10 → [${d10}], 1d100 → [${d100}]) for ${hundred ? "100" : d10 + d100}!`
                }
                else
                {
                    RESULT.dice.forEach((diceResult) =>
                    {
                        let breakdown: string[] = [];
                        if (diceResult.type === "number")
                        {
                            modifier += diceResult.value;
                        }
                        else
                        {
                            diceResult.rolls.forEach((rollResult) =>
                            {
                                vString.push(rollResult.value);
                                dString.push("1d" + rollResult.die);
                                breakdown.push(rollResult.value);
                                total += rollResult.value;
                            });
                            diceRolled.push(`${diceResult.count.value}d${diceResult.die.value} → [${breakdown.join("-")}]`);
                        }
                    });

                    diceResultMessage = modifier > 0 ? ` rolled (${diceRolled.join(", ")} +${modifier}) for ${total + modifier}!`
                        : ` rolled (${diceRolled.join(", ")}) for ${hundred ? "100" : total}!`
                }
            }
            else if (RESULT.type === "die")
            {
                let breakdown: string[] = [];
                RESULT.rolls.forEach((rollResult) =>
                {
                    vString.push(rollResult.value);
                    dString.push("1d" + rollResult.die);
                    breakdown.push(rollResult.value);
                    total += rollResult.value;
                });
                diceRolled.push(`${RESULT.count.value}d${RESULT.die.value} → [${breakdown.join("-")}]`);

                diceResultMessage = RESULT.modifier > 0 ? ` rolled (${diceRolled.join(", ")} +${RESULT.modifier}) for ${total + RESULT.modifier}!`
                    : ` rolled (${diceRolled.join(", ")}) for ${hundred ? "100" : total}!`
            }
            else
            {
                // Number?
            }
        }

        const forecast = `${dString.join("+")}@${vString.join(",")}`;
        const diceWindowUrl = `/dicewindow.html?preroll=${encodeURIComponent(forecast)}&texture=${encodeURIComponent(BSCACHE.playerDiceTexture)}&color=${encodeURIComponent(BSCACHE.playerDiceColor)}`;
        const metadata: Metadata = {};
        const now = new Date().toISOString();
        metadata[`${Constants.EXTENSIONID}/metadata_throwroll`]
            = {
                created: now,
                sender: sender, // Might not be Bones, could be from elsewhere.
                senderId: BSCACHE.playerId,
                viewers: viewers,
                rollResult: diceWindowUrl,
                rollMessage: diceResultMessage
            } as IBonesLog;
        await OBR.player.setMetadata(metadata);
    }

    private getTimestamp(time: string): string
    {
        const now = new Date(time);
        const hours = now.getHours().toString().padStart(2, '0'); // Ensure two digits
        const minutes = now.getMinutes().toString().padStart(2, '0'); // Ensure two digits

        return `${hours}:${minutes}`;
    }

    private checkBoolValues(rolls: DieRollBase[])
    {
        for (const roll of rolls)
        {
            const value = roll.value;
            if (value !== 0 && value !== 1)
            {
                return false; // Found an object with value other than 0 or 1
            }
        }
        return true; // All objects have values of 0 or 1
    }
}

class Queue
{
    private slots: boolean[] = [];

    constructor(private totalSlots: number)
    {
        this.initializeSlots();
    }

    private initializeSlots()
    {
        for (let i = 0; i < this.totalSlots; i++)
        {
            this.slots.push(true); // Initially, all slots are open
        }
    }

    private occupySlot(): number
    {
        const availableSlotIndex = this.slots.findIndex((slot) => slot);

        if (availableSlotIndex !== -1)
        {
            this.slots[availableSlotIndex] = false; // Occupy the slot
            setTimeout(() =>
            {
                this.releaseSlot(availableSlotIndex);
            }, 3500); // Release the slot after 3.5 seconds
            return availableSlotIndex;
        }

        return -1; // No available slots
    }

    private releaseSlot(slotIndex: number)
    {
        this.slots[slotIndex] = true; // Mark the slot as open
    }

    public runFunction(): number
    {
        const slotIndex = this.occupySlot();

        if (slotIndex !== -1)
        {
            console.log(`Function is running on slot ${slotIndex}`);
        } else
        {
            console.log('No available slots. Please try again later.');
        }

        return slotIndex;
    }
}

// Example usage:
const queue = new Queue(5); // Create a queue with 5 slots

// Simulate function calls
queue.runFunction(); // Function is running on slot 0
queue.runFunction(); // Function is running on slot 1
queue.runFunction(); // Function is running on slot 2
// ...

// After 3.5 seconds, the slots will become available again

export const MESSAGES = new MessageTracker();