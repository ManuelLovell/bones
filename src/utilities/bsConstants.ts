export class Constants
{
    static VERSION = "whatsnew-bones-131";
    static EXTENSIONID = "com.battle-system.bones";
    static EXTENSIONDICEWINDOWID = "com.battle-system.bones-dicewindow";
    static EXTENSIONDICECONTROLLERID = "com.battle-system.bones-dicecontroller";
    static EXTENSIONNOTIFY = "com.battle-system.bones-notify";
    static DISCORDID = "com.battle-system.discord";

    static OPEN = "OPEN";
    static CLOSE = "CLOSE";
    static TRUE = "TRUE";
    static FALSE = "FALSE";

    static DICEZOOMSETTING = `${Constants.EXTENSIONID}/zoom_`;
    static DICECOLORSETTING = `${Constants.EXTENSIONID}/color_`;
    static FRONTDICECOLORSETTING = `${Constants.EXTENSIONID}/fcolor_`;
    static DICETEXTURESETTING = `${Constants.EXTENSIONID}/texture_`;

    static NORMALDICE = /^[0-9+d]+$/;
    static DICENOTATION = /(\d+)[dD](\d+)(.*)$/i;
    static DICEMODIFIER = /([+-])(\d+)/;
    static PARENTHESESMATCH = /\((\d*d\d+\s*([+-]\s*\d+)?)\)/g;
    static PLUSMATCH = /\s?(\+\d+)\s?/g;
    static ALPHANUMERICTEXTMATCH = /\s[\da-zA-Z]$/;

    static BONESENTRY = document.querySelector<HTMLDivElement>('#bones-main-body-app') as HTMLDivElement;
    static BONESWINDOW = document.querySelector<HTMLDivElement>('#bones-window-body-app') as HTMLDivElement;
    static BONESDICECONTROLLER = document.querySelector<HTMLDivElement>('#bones-controller-dice') as HTMLDivElement;
    static BONESNOTIFICATIONS = document.querySelector<HTMLDivElement>('#bones-notify-body-app') as HTMLDivElement;
    
    static CHECKREGISTRATION = 'https://vrwtdtmnbyhaehtitrlb.supabase.co/functions/v1/patreon-check';
    static ANONAUTH = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    
    static DEFAULTTEXTURES = [
        "default",
        "diceOfRolling",
        "gemstone",
        "gemstoneMarble",
        "rock",
        "rust",
        "smooth",
        "wooden",
        "genesys"
    ];
}


export enum GameSystem
{
    Normal = "Normal",
    Abnormal = "Abnormal",
    COC = "COC",
    BRP = "BRP",
}