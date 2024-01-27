interface IRollResult
{
    number?: number,
    type?: number,
    modifier?: number,
    result?: number
}

interface IBonesRoll
{
    created: string;
    notation: string;
    senderName?: string,
    senderColor?: string,
    viewers?: "SELF" | "ALL" | "GM";

    // Outside-Extension Metadata ID: "com.battle-system.friends"
    // metadata[`com.battle-system.friends/metadata_diceroll`] = {
    //   created: now,
    //   notation: "2d10",
    //   sender: "Buddy!!"
    //   viewers: "GM"
    // };
}

interface IBonesLog
{
    created: string; // new Date().toISOString();
    senderName: string; // Sender Name
    senderId: string; // Sender OBR Id
    senderColor: string; // Sender OBR Color
    viewers: "SELF" | "ALL" | "GM";
    rollHtml: string; // result of a roll to broadcast
}

interface IBRPRoll
{
    skillName?: string;
    skillNumb?: number;
    critSucc?: number;
    specSucc?: number;
    extSucc?: number;
    hardSucc?: number;
    fumble?: number;
}

interface ResultsData
{
    rolls: Roll[] | { [key: string]: Roll };
    value?: number;
}

interface Roll
{
    die?: number;
    sides?: number;
    success?: boolean | null;
    failures?: number;
    value?: number;
    modifier?: number;
    critical?: string;
    drop?: boolean;
    reroll?: boolean;
    explode?: boolean;
}