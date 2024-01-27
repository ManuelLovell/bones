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
    senderId?: string,
    viewers?: "SELF" | "ALL" | "GM";

    // HOW TO ROLL THE BONES, HAHAHAHAHAHA.
    // metadata[`com.battle-system.bones/metadata_bonesroll`]
    // = {
    //     notation: rollEquation,  // "2d20kh1"
    //     created: now,            // new Date().toISOString()
    //     senderName: userName,    // Name to display for Roll
    //     senderId: userId,        // PlayerId | Self-Tracking-Number
    //     viewers: viewedBy        // "ALL" | "GM" | "SELF"
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