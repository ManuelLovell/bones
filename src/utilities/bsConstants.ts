import { Command, PathCommand } from "@owlbear-rodeo/sdk";

export class Constants
{
    static VERSION = "whatsnew-bones-134";
    static EXTENSIONID = "com.battle-system.bones";
    static EXTENSIONDICEWINDOWID = "com.battle-system.bones-dicewindow";
    static EXTENSIONDICECONTROLLERID = "com.battle-system.bones-dicecontroller";
    static EXTENSIONNOTIFY = "com.battle-system.bones-notify";
    static DISCORDID = "com.battle-system.discord";
    static DICETOKENBROADCAST = "bones.dicetoken.broadcast";
    static BROADCASTLISTENER = "bones.broadcast.listener";
    static BROADCASTSENDER = "bones.broadcast.sender";
    static OPEN = "OPEN";
    static CLOSE = "CLOSE";
    static TRUE = "TRUE";
    static FALSE = "FALSE";

    static DICEZOOMSETTING = `${Constants.EXTENSIONID}/zoom_`;
    static DICEMARKERSETTING = `${Constants.EXTENSIONID}/marker_`;
    static DICECOLORSETTING = `${Constants.EXTENSIONID}/color_`;
    static SECONDDICECOLORSETTING = `${Constants.EXTENSIONID}/scolor_`;
    static DICETEXTURESETTING = `${Constants.EXTENSIONID}/texture_`;
    static COLORCHANNEL = `${Constants.EXTENSIONID}/colorChannel`;

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

export class DiceShapes
{
    static DiceRimPath(centerX: number, centerY: number, size: number): PathCommand[]
    {
        const radius = size / 2;

        return [
            [Command.MOVE, centerX, centerY - radius],

            [Command.QUAD, centerX - radius, centerY - radius, centerX - radius, centerY],

            [Command.QUAD, centerX - radius, centerY + radius, centerX, centerY + radius],

            [Command.QUAD, centerX + radius, centerY + radius, centerX + radius, centerY],

            [Command.QUAD, centerX + radius, centerY - radius, centerX, centerY - radius],
        ];
    }

    static D4Path(centerX: number, centerY: number, size: number): PathCommand[]
    {
        const radius = (size / 2) * .8;
        const points = {
            top: { x: centerX, y: centerY - radius },
            bottomRight: { x: centerX + radius, y: centerY + radius * 0.25 },
            bottomLeft: { x: centerX - radius, y: centerY + radius * 0.25 },
            bottom: { x: centerX, y: centerY + radius }
        };

        return [
            [Command.MOVE, points.top.x, points.top.y],
            [Command.LINE, points.bottomLeft.x, points.bottomLeft.y],
            [Command.LINE, points.bottom.x, points.bottom.y],
            [Command.LINE, points.top.x, points.top.y],
            [Command.LINE, points.bottomRight.x, points.bottomRight.y],
            [Command.LINE, points.bottom.x, points.bottom.y]
        ];
    }

    static D6Path(centerX: number, centerY: number, size: number): PathCommand[]
    {
        const radius = (size / 2) * .8;
        const points = {
            top: { x: centerX, y: centerY - radius },
            bottom: { x: centerX, y: centerY + radius },
            topRight: { x: centerX + radius * 0.866, y: centerY - radius * 0.5 },
            bottomRight: { x: centerX + radius * 0.866, y: centerY + radius * 0.5 },
            topLeft: { x: centerX - radius * 0.866, y: centerY - radius * 0.5 },
            bottomLeft: { x: centerX - radius * 0.866, y: centerY + radius * 0.5 },
        };

        return [
            [Command.MOVE, points.top.x, points.top.y],
            [Command.LINE, points.topRight.x, points.topRight.y],
            [Command.LINE, points.bottomRight.x, points.bottomRight.y],
            [Command.LINE, points.bottom.x, points.bottom.y],
            [Command.LINE, centerX, centerY],
            [Command.LINE, points.topRight.x, points.topRight.y],
            [Command.MOVE, centerX, centerY],
            [Command.LINE, points.topLeft.x, points.topLeft.y],
            [Command.LINE, points.bottomLeft.x, points.bottomLeft.y],
            [Command.LINE, points.bottom.x, points.bottom.y],
            [Command.MOVE, points.top.x, points.top.y],
            [Command.LINE, points.topLeft.x, points.topLeft.y],
        ];
    }

    static D8Path(centerX: number, centerY: number, size: number): PathCommand[]
    {
        const radius = (size / 2) * .8;
        const points = {
            top: { x: centerX, y: centerY - radius },
            left: { x: centerX - radius, y: centerY },
            right: { x: centerX + radius, y: centerY },
            bottom: { x: centerX, y: centerY + radius }
        };

        return [
            [Command.MOVE, points.top.x, points.top.y],
            [Command.LINE, points.left.x, points.left.y],
            [Command.LINE, centerX, centerY + radius * 0.4],
            [Command.LINE, points.top.x, points.top.y],
            [Command.LINE, points.right.x, points.right.y],
            [Command.LINE, centerX, centerY + radius * 0.4],
            [Command.LINE, points.bottom.x, points.bottom.y],
            [Command.LINE, points.left.x, points.left.y],
            [Command.MOVE, points.bottom.x, points.bottom.y],
            [Command.LINE, points.right.x, points.right.y],
        ];
    }

    static D100Path(centerX: number, centerY: number, size: number): PathCommand[]
    {
        const radius = (size / 2) * .8;
        const points = {
            top: { x: centerX, y: centerY - radius },
            left: { x: centerX - radius, y: centerY + radius * 0.1 },
            leftCrink: { x: centerX - radius * 0.5, y: centerY },
            right: { x: centerX + radius, y: centerY + radius * 0.1 },
            rightCrink: { x: centerX + radius * 0.5, y: centerY },
            bottom: { x: centerX, y: centerY + radius },
            center: { x: centerX, y: centerY + radius * 0.2 }
        };

        const points2 = {
            top: { x: centerX, y: centerY - radius },
            left: { x: centerX - radius, y: centerY - radius * 0.1 },
            leftCrink: { x: centerX - radius * 0.5, y: centerY + radius * 0.2 },
            right: { x: centerX + radius, y: centerY - radius * 0.1 },
            rightCrink: { x: centerX + radius * 0.5, y: centerY + radius * 0.2 },
            bottom: { x: centerX, y: centerY + radius },
            center: { x: centerX, y: centerY - radius * 0.2 }
        };

        return [
            [Command.MOVE, points.top.x, points.top.y],
            [Command.LINE, points.left.x, points.left.y],
            [Command.LINE, points.leftCrink.x, points.leftCrink.y],
            [Command.LINE, points.top.x, points.top.y],
            [Command.LINE, points.rightCrink.x, points.rightCrink.y],
            [Command.LINE, points.right.x, points.right.y],
            [Command.LINE, points.top.x, points.top.y],
            [Command.MOVE, points.bottom.x, points.bottom.y],
            [Command.LINE, points.left.x, points.left.y],
            [Command.LINE, points.leftCrink.x, points.leftCrink.y],
            [Command.LINE, points.center.x, points.center.y],
            [Command.LINE, points.bottom.x, points.bottom.y],
            [Command.LINE, points.right.x, points.right.y],
            [Command.LINE, points.rightCrink.x, points.rightCrink.y],
            [Command.LINE, points.center.x, points.center.y],
            [Command.MOVE, points2.top.x, points2.top.y],
            [Command.LINE, points2.left.x, points2.left.y],
            [Command.LINE, points2.leftCrink.x, points2.leftCrink.y],
            [Command.LINE, points2.top.x, points2.top.y],
            [Command.LINE, points2.rightCrink.x, points2.rightCrink.y],
            [Command.LINE, points2.right.x, points2.right.y],
            [Command.LINE, points2.top.x, points2.top.y],
            [Command.MOVE, points2.bottom.x, points2.bottom.y],
            [Command.LINE, points2.left.x, points2.left.y],
            [Command.LINE, points2.leftCrink.x, points2.leftCrink.y],
            [Command.LINE, points2.center.x, points2.center.y],
            [Command.LINE, points2.bottom.x, points2.bottom.y],
            [Command.LINE, points2.right.x, points2.right.y],
            [Command.LINE, points2.rightCrink.x, points2.rightCrink.y],
            [Command.LINE, points2.center.x, points2.center.y]
        ];
    }

    static D10Path(centerX: number, centerY: number, size: number): PathCommand[]
    {
        const radius = (size / 2) * .8;
        const points = {
            top: { x: centerX, y: centerY - radius },
            left: { x: centerX - radius, y: centerY + radius * 0.1 },
            leftCrink: { x: centerX - radius * 0.5, y: centerY },
            right: { x: centerX + radius, y: centerY + radius * 0.1 },
            rightCrink: { x: centerX + radius * 0.5, y: centerY },
            bottom: { x: centerX, y: centerY + radius },
            center: { x: centerX, y: centerY + radius * 0.2 }
        };

        return [
            [Command.MOVE, points.top.x, points.top.y],
            [Command.LINE, points.left.x, points.left.y],
            [Command.LINE, points.leftCrink.x, points.leftCrink.y],
            [Command.LINE, points.top.x, points.top.y],
            [Command.LINE, points.rightCrink.x, points.rightCrink.y],
            [Command.LINE, points.right.x, points.right.y],
            [Command.LINE, points.top.x, points.top.y],
            [Command.MOVE, points.bottom.x, points.bottom.y],
            [Command.LINE, points.left.x, points.left.y],
            [Command.LINE, points.leftCrink.x, points.leftCrink.y],
            [Command.LINE, points.center.x, points.center.y],
            [Command.LINE, points.bottom.x, points.bottom.y],
            [Command.LINE, points.right.x, points.right.y],
            [Command.LINE, points.rightCrink.x, points.rightCrink.y],
            [Command.LINE, points.center.x, points.center.y]
        ];
    }

    static D12Path(centerX: number, centerY: number, size: number): PathCommand[]
    {
        const radius = (size / 2) * .8;
        const points = {
            topLeft: { x: centerX - radius * 0.4, y: centerY - radius },
            topRight: { x: centerX + radius * 0.4, y: centerY - radius },
            bottomLeft: { x: centerX - radius * 0.4, y: centerY + radius },
            bottomRight: { x: centerX + radius * 0.4, y: centerY + radius },

            upLeft: { x: centerX - radius * 0.7, y: centerY - radius * 0.8 },
            upRight: { x: centerX + radius * 0.7, y: centerY - radius * 0.8 },
            downLeft: { x: centerX - radius * 0.7, y: centerY + radius * 0.8 },
            downRight: { x: centerX + radius * 0.7, y: centerY + radius * 0.8 },

            midLeft: { x: centerX - radius, y: centerY - radius * 0.2 },
            midRight: { x: centerX + radius, y: centerY - radius * 0.2 },
            lowMidLeft: { x: centerX - radius, y: centerY + radius * 0.2 },
            lowMidRight: { x: centerX + radius, y: centerY + radius * 0.2 },

            center: { x: centerX, y: centerY },
            centerPine: { x: centerX, y: centerY - radius * 0.7 },
            leftPine: { x: centerX - radius * 0.5, y: centerY + radius * 0.25 },
            rightPine: { x: centerX + radius * 0.5, y: centerY + radius * 0.25 },
        };

        return [
            [Command.MOVE, points.topLeft.x, points.topLeft.y],
            [Command.LINE, points.topRight.x, points.topRight.y],
            [Command.LINE, points.upRight.x, points.upRight.y],
            [Command.LINE, points.midRight.x, points.midRight.y],
            [Command.LINE, points.lowMidRight.x, points.lowMidRight.y],
            [Command.LINE, points.downRight.x, points.downRight.y],
            [Command.LINE, points.bottomRight.x, points.bottomRight.y],
            [Command.LINE, points.bottomLeft.x, points.bottomLeft.y],
            [Command.LINE, points.downLeft.x, points.downLeft.y],
            [Command.LINE, points.lowMidLeft.x, points.lowMidLeft.y],
            [Command.LINE, points.midLeft.x, points.midLeft.y],
            [Command.LINE, points.upLeft.x, points.upLeft.y],
            [Command.LINE, points.topLeft.x, points.topLeft.y],
            [Command.MOVE, points.upLeft.x, points.upLeft.y],
            [Command.LINE, points.centerPine.x, points.centerPine.y],
            [Command.LINE, points.center.x, points.center.y],
            [Command.LINE, points.leftPine.x, points.leftPine.y],
            [Command.LINE, points.midLeft.x, points.midLeft.y],
            [Command.MOVE, points.upRight.x, points.upRight.y],
            [Command.LINE, points.centerPine.x, points.centerPine.y],
            [Command.MOVE, points.center.x, points.center.y],
            [Command.LINE, points.rightPine.x, points.rightPine.y],
            [Command.LINE, points.midRight.x, points.midRight.y],
            [Command.MOVE, points.rightPine.x, points.rightPine.y],
            [Command.LINE, points.bottomRight.x, points.bottomRight.y],
            [Command.MOVE, points.leftPine.x, points.leftPine.y],
            [Command.LINE, points.bottomLeft.x, points.bottomLeft.y],
        ];
    }

    static D20Path(centerX: number, centerY: number, size: number): PathCommand[]
    {
        const radius = (size / 2) * .8;

        const points = {
            // Outer points of the hexagon
            top: { x: centerX, y: centerY - radius },
            bottom: { x: centerX, y: centerY + radius },
            topRight: { x: centerX + radius * 0.866, y: centerY - radius * 0.5 },
            bottomRight: { x: centerX + radius * 0.866, y: centerY + radius * 0.5 },
            topLeft: { x: centerX - radius * 0.866, y: centerY - radius * 0.5 },
            bottomLeft: { x: centerX - radius * 0.866, y: centerY + radius * 0.5 },

            // Inner pentagon triangle (top)
            topLeftTriangle: { x: centerX - radius * 0.55, y: centerY - radius * 0.35 },
            topRightTriangle: { x: centerX + radius * 0.55, y: centerY - radius * 0.35 },
            bottomMidTriangle: { x: centerX, y: centerY + radius * 0.7 },
        };

        return [
            // Outer hexagon
            [Command.MOVE, points.top.x, points.top.y],
            [Command.LINE, points.topRight.x, points.topRight.y],
            [Command.LINE, points.bottomRight.x, points.bottomRight.y],
            [Command.LINE, points.bottom.x, points.bottom.y],
            [Command.LINE, points.bottomLeft.x, points.bottomLeft.y],
            [Command.LINE, points.topLeft.x, points.topLeft.y],
            [Command.CLOSE],

            // Large Inner Shape
            [Command.MOVE, points.top.x, points.top.y],
            [Command.LINE, points.topLeftTriangle.x, points.topLeftTriangle.y],
            [Command.LINE, points.bottomLeft.x, points.bottomLeft.y],
            [Command.LINE, points.bottomMidTriangle.x, points.bottomMidTriangle.y],
            [Command.LINE, points.bottomRight.x, points.bottomRight.y],
            [Command.LINE, points.topRightTriangle.x, points.topRightTriangle.y],
            [Command.CLOSE],

            // Large Inner Shape
            [Command.MOVE, points.topLeft.x, points.topLeft.y],
            [Command.LINE, points.topLeftTriangle.x, points.topLeftTriangle.y],
            [Command.LINE, points.topRightTriangle.x, points.topRightTriangle.y],
            [Command.LINE, points.topRight.x, points.topRight.y],
            [Command.LINE, points.topRightTriangle.x, points.topRightTriangle.y],
            [Command.LINE, points.bottomMidTriangle.x, points.bottomMidTriangle.y],
            [Command.LINE, points.bottom.x, points.bottom.y],
            [Command.LINE, points.bottomMidTriangle.x, points.bottomMidTriangle.y],
            [Command.LINE, points.topLeftTriangle.x, points.topLeftTriangle.y],
            [Command.CLOSE],
        ];
    }
}

export enum GameSystem
{
    Normal = "Normal",
    Abnormal = "Abnormal",
    COC = "COC",
    BRP = "BRP",
}