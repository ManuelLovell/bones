import OBR, { Grid, Item, Metadata, Player, Theme } from "@owlbear-rodeo/sdk";
import * as Utilities from '../utilities/bsUtilities';
import { MESSAGES } from "./bsMessageTracker";
import { Constants } from "./bsConstants";

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
    playerDiceTexture: string;

    party: Player[];

    gridDpi: number;
    gridScale: number; // IE; 5ft

    sceneItems: Item[];
    sceneSelected: string[];
    sceneMetadata: Metadata;
    sceneReady: boolean;

    roomMetadata: Metadata;

    theme: any;

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

        this.playerDiceTexture = "skulls";
        this.playerDiceColor = "#ff0000";

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
            this.playerDiceTexture = this.roomMetadata[Constants.DICETEXTURESETTING + this.playerId] as string ?? "default";
            
            if (!Constants.DEFAULTTEXTURES.includes(this.playerDiceTexture))
            {
                this.playerDiceTexture = "default";
            }
        }
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
        const textureCheck = this.roomMetadata[Constants.DICETEXTURESETTING + this.playerId];
        if (colorCheck)
        {
            this.playerDiceColor = colorCheck as string;
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
};

// Set the handlers needed for this Extension
export const BSCACHE = new BSCache([BSCache.PLAYER, BSCache.PARTY, BSCache.ROOMMETA]);
