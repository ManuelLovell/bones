import OBR, { buildPath, buildText, Grid, Item, Metadata, Player, Theme } from "@owlbear-rodeo/sdk";
import * as Utilities from '../utilities/bsUtilities';
import { MESSAGES } from "./bsMessageTracker";
import { Constants, DiceShapes } from "./bsConstants";

class BSCache
{
    // Cache Names
    static PLAYER = "PLAYER";
    static PARTY = "PARTY";
    static SCENEITEMS = "SCENEITEMS";
    static SCENEMETA = "SCENEMETADATA";
    static SCENEGRID = "SCENEGRID";
    static ROOMMETA = "ROOMMETADATA";

    private debouncedOnSceneItemsChange: (items: Item[]) => void;
    private debouncedOnSceneMetadataChange: (items: Metadata) => void;
    private debouncedOnRoomMetadataChange: () => void;

    playerId: string;
    playerColor: string;
    playerName: string;
    playerMetadata: {};
    playerRole: "GM" | "PLAYER";

    playerDiceColor: string;
    playerSecondDiceColor: string;
    playerDiceTexture: string;
    playerDiceZoom: number;
    playerMarkers: boolean;

    party: Player[];

    gridDpi: number;
    gridScale: number; // IE; 5ft

    sceneItems: Item[];
    sceneSelected: string[];
    sceneMetadata: Metadata;
    sceneReady: boolean;

    roomMetadata: Metadata;

    theme: any;

    USER_REGISTERED: boolean;
    caches: string[];

    //handlers
    sceneMetadataHandler?: () => void;
    sceneItemsHandler?: () => void;
    sceneGridHandler?: () => void;
    sceneReadyHandler?: () => void;
    playerHandler?: () => void;
    partyHandler?: () => void;
    themeHandler?: () => void;
    roomHandler?: () => void;

    constructor(caches: string[])
    {
        this.playerId = "";
        this.playerName = "";
        this.playerColor = "";
        this.playerMetadata = {};
        this.playerRole = "PLAYER";
        this.party = [];
        this.sceneItems = [];
        this.sceneSelected = [];
        this.sceneMetadata = {};
        this.gridDpi = 0;
        this.gridScale = 5;
        this.sceneReady = false;
        this.theme = "DARK";
        this.roomMetadata = {};

        this.playerDiceTexture = "default";
        this.playerDiceColor = "#ff0000";
        this.playerSecondDiceColor = "#FFFFFF";
        this.playerDiceZoom = 4;
        this.playerMarkers = false;

        this.USER_REGISTERED = false;
        this.caches = caches;

        // Large singular updates to sceneItems can cause the resulting onItemsChange to proc multiple times, at the same time
        this.debouncedOnSceneItemsChange = Utilities.Debounce(this.OnSceneItemsChange.bind(this) as any, 100);
        this.debouncedOnSceneMetadataChange = Utilities.Debounce(this.OnSceneMetadataChanges.bind(this) as any, 100);
        this.debouncedOnRoomMetadataChange = Utilities.Debounce(this.OnRoomMetadataChange.bind(this) as any, 100);
    }

    public async InitializeCache()
    {
        // Always Cache
        this.sceneReady = await OBR.scene.isReady();
        this.theme = await OBR.theme.getTheme();
        Utilities.SetThemeMode(this.theme, document);

        if (this.caches.includes(BSCache.PLAYER))
        {
            this.playerId = await OBR.player.getId();
            this.playerName = await OBR.player.getName();
            this.playerColor = await OBR.player.getColor();
            this.playerMetadata = await OBR.player.getMetadata();
            this.playerRole = await OBR.player.getRole();

            const boneData = this.playerMetadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] as IBonesRoll;
            if (boneData) MESSAGES.IsThisOld(boneData.created, boneData.senderName!, "DEFAULT");
            const logData = this.playerMetadata[`${Constants.EXTENSIONID}/metadata_logroll`] as IBonesLog;
            if (logData) MESSAGES.IsThisOld(logData.created, logData.senderId, "LOG");
        }

        if (this.caches.includes(BSCache.PARTY))
        {
            this.party = await OBR.party.getPlayers();
            for (const player of this.party)
            {
                const boneData = player.metadata[`${Constants.EXTENSIONID}/metadata_bonesroll`] as IBonesRoll;
                if (boneData) MESSAGES.IsThisOld(boneData.created, boneData.senderName!, "DEFAULT");
                const logData = player.metadata[`${Constants.EXTENSIONID}/metadata_logroll`] as IBonesLog;
                if (logData) MESSAGES.IsThisOld(logData.created, logData.senderId, "LOG");
            }
        }

        if (this.caches.includes(BSCache.SCENEITEMS))
        {
            if (this.sceneReady) this.sceneItems = await OBR.scene.items.getItems();
        }

        if (this.caches.includes(BSCache.SCENEMETA))
        {
            if (this.sceneReady) this.sceneMetadata = await OBR.scene.getMetadata();
        }

        if (this.caches.includes(BSCache.SCENEGRID))
        {
            if (this.sceneReady)
            {
                this.gridDpi = await OBR.scene.grid.getDpi();
                this.gridScale = (await OBR.scene.grid.getScale()).parsed?.multiplier ?? 5;
            }
        }

        if (this.caches.includes(BSCache.ROOMMETA))
        {
            this.roomMetadata = await OBR.room.getMetadata();
            this.playerDiceColor = this.roomMetadata[Constants.DICECOLORSETTING + this.playerId] as string ?? "#ff0000";
            this.playerDiceZoom = this.roomMetadata[Constants.DICEZOOMSETTING + this.playerId] as number ?? 4;
            this.playerMarkers = this.roomMetadata[Constants.DICEMARKERSETTING + this.playerId] === true;
            this.playerSecondDiceColor = this.roomMetadata[Constants.SECONDDICECOLORSETTING + this.playerId] as string ?? "#FFFFFF";
            this.playerDiceTexture = this.roomMetadata[Constants.DICETEXTURESETTING + this.playerId] as string ?? "default";

            if (!Constants.DEFAULTTEXTURES.includes(this.playerDiceTexture))
            {
                this.playerDiceTexture = "default";
            }
        }

        const diceTokenHandler = OBR.broadcast.onMessage(Constants.DICETOKENBROADCAST, async (data) =>
        {
            if (!this.playerMarkers) return;

            const halfGridUnit = this.gridDpi / 2;
            const rolls = data.data as RollValue[];
            const tokensToCreate: Item[] = [];

            const width = await OBR.viewport.getWidth();
            const height = await OBR.viewport.getHeight();
            const viewportPosition = await OBR.viewport.inverseTransformPoint({
                x: width / 2,
                y: height / 2,
            });

            function GetShape(diceType: number)
            {
                switch (diceType)
                {
                    case 4:
                        return DiceShapes.D4Path(0, 0, BSCACHE.gridDpi);
                    case 6:
                        return DiceShapes.D6Path(0, 0, BSCACHE.gridDpi);
                    case 8:
                        return DiceShapes.D8Path(0, 0, BSCACHE.gridDpi);
                    case 10:
                        return DiceShapes.D10Path(0, 0, BSCACHE.gridDpi);
                    case 12:
                        return DiceShapes.D12Path(0, 0, BSCACHE.gridDpi);
                    case 20:
                        return DiceShapes.D20Path(0, 0, BSCACHE.gridDpi);
                    case 100:
                        return DiceShapes.D100Path(0, 0, BSCACHE.gridDpi);
                    default:
                        return DiceShapes.D20Path(0, 0, BSCACHE.gridDpi);
                }
            }

            let baseZIndex = .0005;
            let offSetX = 0;
            let offSetY = 0;
            const cap = 2;
            for (const roll of rolls)
            {
                const offsetPosition = { x: viewportPosition.x + offSetX, y: viewportPosition.y + offSetY };
                // Create Border
                const diceBorder = buildPath()
                    .position(offsetPosition)
                    .commands(DiceShapes.DiceRimPath(0, 0, this.gridDpi))
                    .strokeOpacity(1)
                    .strokeWidth(6)
                    .strokeColor(this.playerColor)
                    .fillOpacity(1)
                    .fillColor("black")
                    .layer("PROP")
                    .zIndex(baseZIndex + .00001)
                    .build();

                // Create Dice Image
                const diceImage = buildPath()
                    .position(offsetPosition)
                    .commands(GetShape(roll.type))
                    .attachedTo(diceBorder.id)
                    .strokeOpacity(1)
                    .strokeWidth(4)
                    .strokeColor("#828282")
                    .disableHit(true)
                    .layer("PROP")
                    .zIndex(baseZIndex + .00002)
                    .build();

                // Create Text
                const diceText = buildText()
                    .attachedTo(diceBorder.id)
                    .strokeColor("white")
                    .strokeOpacity(1)
                    .strokeWidth(4)
                    .fontWeight(600)
                    .fontSize(72)
                    .width(BSCACHE.gridDpi)
                    .height(BSCACHE.gridDpi)
                    .position({ x: offsetPosition.x - halfGridUnit, y: offsetPosition.y - halfGridUnit })
                    .textAlign("CENTER")
                    .textAlignVertical("MIDDLE")
                    .textType("PLAIN")
                    .fillColor("white")
                    .fillOpacity(1)
                    .plainText(roll.value.toString())
                    .disableHit(true)
                    .layer("PROP")
                    .zIndex(baseZIndex + .00003)
                    .build();

                tokensToCreate.push(diceBorder);
                tokensToCreate.push(diceImage);
                tokensToCreate.push(diceText);
                baseZIndex += + 1;
                offSetY += this.gridDpi
                if (offSetY > (this.gridDpi * cap))
                {
                    offSetY = 0;
                    offSetX += this.gridDpi;
                }
            }

            await OBR.scene.items.addItems(tokensToCreate);
        });

        await this.CheckRegistration();
    }

    public KillHandlers()
    {
        if (this.caches.includes(BSCache.SCENEMETA) && this.sceneMetadataHandler !== undefined) this.sceneMetadataHandler!();
        if (this.caches.includes(BSCache.SCENEITEMS) && this.sceneItemsHandler !== undefined) this.sceneItemsHandler!();
        if (this.caches.includes(BSCache.SCENEGRID) && this.sceneGridHandler !== undefined) this.sceneGridHandler!();
        if (this.caches.includes(BSCache.PLAYER) && this.playerHandler !== undefined) this.playerHandler!();
        if (this.caches.includes(BSCache.PARTY) && this.partyHandler !== undefined) this.partyHandler!();
        if (this.caches.includes(BSCache.ROOMMETA) && this.roomHandler !== undefined) this.roomHandler!();

        if (this.themeHandler !== undefined) this.themeHandler!();
    }

    public SetupHandlers()
    {

        if (this.sceneMetadataHandler === undefined || this.sceneMetadataHandler.length === 0)
        {
            if (this.caches.includes(BSCache.SCENEMETA))
            {
                this.sceneMetadataHandler = OBR.scene.onMetadataChange(async (metadata) =>
                {
                    this.sceneMetadata = metadata;
                    this.debouncedOnSceneMetadataChange(metadata);
                });
            }
        }

        if (this.sceneItemsHandler === undefined || this.sceneItemsHandler.length === 0)
        {
            if (this.caches.includes(BSCache.SCENEITEMS))
            {
                this.sceneItemsHandler = OBR.scene.items.onChange(async (items) =>
                {
                    this.sceneItems = items;
                    this.debouncedOnSceneItemsChange(items);
                });
            }
        }

        if (this.sceneGridHandler === undefined || this.sceneGridHandler.length === 0)
        {
            if (this.caches.includes(BSCache.SCENEGRID))
            {
                this.sceneGridHandler = OBR.scene.grid.onChange(async (grid) =>
                {
                    this.gridDpi = grid.dpi;
                    this.gridScale = parseInt(grid.scale);
                    await this.OnSceneGridChange(grid);
                });
            }
        }

        if (this.playerHandler === undefined || this.playerHandler.length === 0)
        {
            if (this.caches.includes(BSCache.PLAYER))
            {
                this.playerHandler = OBR.player.onChange(async (player) =>
                {
                    this.playerName = player.name;
                    this.playerColor = player.color;
                    this.playerId = player.id;
                    this.playerRole = player.role;
                    this.playerMetadata = player.metadata;
                    await this.OnPlayerChange(player);
                });
            }
        }

        if (this.partyHandler === undefined || this.partyHandler.length === 0)
        {
            if (this.caches.includes(BSCache.PARTY))
            {
                this.partyHandler = OBR.party.onChange(async (party) =>
                {
                    this.party = party;
                    await this.OnPartyChange(party);
                });
            }
        }

        if (this.roomHandler === undefined || this.roomHandler.length === 0)
        {
            if (this.caches.includes(BSCache.ROOMMETA))
            {
                this.roomHandler = OBR.room.onMetadataChange(async (metadata) =>
                {
                    this.roomMetadata = metadata;
                    this.debouncedOnRoomMetadataChange();
                });
            }
        }


        if (this.themeHandler === undefined)
        {
            this.themeHandler = OBR.theme.onChange(async (theme) =>
            {
                this.theme = theme.mode;
                await this.OnThemeChange(theme);
            });
        }

        // Only setup if we don't have one, never kill
        if (this.sceneReadyHandler === undefined)
        {
            this.sceneReadyHandler = OBR.scene.onReadyChange(async (ready) =>
            {
                this.sceneReady = ready;

                if (ready)
                {
                    this.sceneItems = await OBR.scene.items.getItems();
                    this.sceneMetadata = await OBR.scene.getMetadata();
                    this.gridDpi = await OBR.scene.grid.getDpi();
                    this.gridScale = (await OBR.scene.grid.getScale()).parsed?.multiplier ?? 5;
                }
                await this.OnSceneReadyChange(ready);
            });
        }
    }

    public async OnSceneMetadataChanges(_metadata: Metadata)
    {
    }

    public async OnSceneItemsChange(_items: Item[])
    {
        if (this.sceneReady)
        {
        }
    }

    public async OnSceneGridChange(_grid: Grid)
    {

    }

    public async OnSceneReadyChange(ready: boolean)
    {
        if (ready)
        {
        }
    }

    public async OnPlayerChange(player: Player)
    {
        await MESSAGES.ShowBonesRoll(player.metadata);
        await MESSAGES.LogBonesRoll(player.metadata);
    }

    public async OnPartyChange(party: Player[])
    {
        for await (const player of party)
        {
            await MESSAGES.LogBonesRoll(player.metadata);
        }
    }

    public async OnRoomMetadataChange()
    {
        const colorCheck = this.roomMetadata[Constants.DICECOLORSETTING + this.playerId];
        const zoomCheck = this.roomMetadata[Constants.DICEZOOMSETTING + this.playerId];
        this.playerMarkers = this.roomMetadata[Constants.DICEMARKERSETTING + this.playerId] === true;
        const secondColorCheck = this.roomMetadata[Constants.SECONDDICECOLORSETTING + this.playerId];
        const textureCheck = this.roomMetadata[Constants.DICETEXTURESETTING + this.playerId];

        if (colorCheck)
        {
            this.playerDiceColor = colorCheck as string;
            await OBR.broadcast.sendMessage(Constants.COLORCHANNEL, { color: colorCheck }, { destination: "LOCAL" });
        }
        if (secondColorCheck)
        {
            this.playerSecondDiceColor = secondColorCheck as string;
            await OBR.broadcast.sendMessage(Constants.COLORCHANNEL, { secondaryColor: secondColorCheck }, { destination: "LOCAL" });
        }
        if (zoomCheck)
        {
            this.playerDiceZoom = zoomCheck as number;
        }

        if (textureCheck)
        {
            this.playerDiceTexture = textureCheck as string;
        }
    }

    public async OnThemeChange(theme: Theme)
    {
        Utilities.SetThemeMode(theme, document);
    }

    public async CheckRegistration()
    {
        try
        {
            const debug = window.location.origin.includes("localhost") ? "eternaldream" : "";
            const userid = {
                owlbearid: BSCACHE.playerId
            };

            const requestOptions = {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": Constants.ANONAUTH,
                    "x-manuel": debug
                }),
                body: JSON.stringify(userid),
            };
            const response = await fetch(Constants.CHECKREGISTRATION, requestOptions);

            if (!response.ok)
            {
                const errorData = await response.json();
                // Handle error data
                console.error("Error:", errorData);
                return;
            }
            const data = await response.json();
            if (data.Data === "OK")
            {
                this.USER_REGISTERED = true;
                console.log("Connected");
            }
            else console.log("Not Registered");
        }
        catch (error)
        {
            // Handle errors
            console.error("Error:", error);
        }
    }
};

// Set the handlers needed for this Extension
export const BSCACHE = new BSCache([BSCache.PLAYER, BSCache.PARTY, BSCache.SCENEGRID, BSCache.ROOMMETA]);
