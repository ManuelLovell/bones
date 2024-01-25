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
    sender: string;
    viewers: "SELF" | "ALL" | "GM";
    
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
    sender: string; // Sender Name
    senderId: string; // Sender OBR Id
    viewers: "SELF" | "ALL" | "GM";
    critical?: boolean; // critical hit css
    rollResult: any; // result of a roll to broadcast
    rollMessage: string;

    // Outside-Extension Metadata ID: "com.battle-system.friends"
    // Example:
    // metadata[`com.battle-system.friends/metadata_chatlog`] = {
    //   chatlog: "How are you",
    //   sender: "CoolExtension",
    //   targetId: "User-OBR-Id" to send to yourself .. OR... "0000" to 'everyone'
    //   created: new Date().toISOString()
    // };
    // await OBR.scene.setMetadata(metadata);

    color: string;
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

enum GameSystem
{
    Normal = "Normal",
    Abnormal = "Abnormal",
}