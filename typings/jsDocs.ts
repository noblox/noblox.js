// types/Types
import * as events from "events";
import * as stream from "stream";

/**
 * @typedef
*/
type CookieJar = {
    session?: string;
}

/**
 * @typedef
 * NobloxOptions for setOptions, based from settings.json
 */
type NobloxOptions = {
    /** Prints console warnings for functions that are being polyfilled by newer methods due to upstream Roblox API changes */
    show_deprecation_warnings: boolean;

    /** Minimizes data usage and speed up requests by only saving session cookies, disable if you need other cookies to be saved as well. (Default: true) */
    session_only: boolean;

    /** This is usually used for functions that have to receive a lot of pages at once. Only this amount will be queued up as to preserve memory, make this as high as possible for fastest responses (although it will be somewhat limited by maxSockets). (Default: 50) */
    max_threads: number;

    /** Timeout for http requests. This is necessary for functions that make a very large number of requests, where it is possible some simply won't connect. (Default: 10000) */
    timeout: number;

    event: {
        /** Maximum number of consecutive retries after an event times out or fails in some other way. (Default: 5) */
        maxRetries: number;
        /** Maximum time (in milliseconds) a request can take. If your server has extremely high latency you may have to raise this. (Default: 10000) */
        timeout: number;
        /** The poll time in milliseconds by default. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
        defaultDelay: number;
        /** The poll time in milliseconds to check for new audit log entries. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
        onAuditLog: number;
        /** The poll time in milliseconds to check for new wall posts. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
        onWallPost: number;
        /** The poll time in milliseconds to check for new join requests. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
        onJoinRequestHandle: number;
        /** The poll time in milliseconds to check for new join requests. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
        onJoinRequest: number;
        /** The poll time in milliseconds to check for a new shout message. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
        onShout: number;
        /** The poll time in milliseconds to check for a new blurb message. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
        onBlurbChange: number;
        /** The poll time in milliseconds to check for new transaction log entries. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. This endpoint has a low rate limit. (Default: 30000) */
        onGroupTransaction: number;
    }

    thumbnail: {
        /** Maximum number of retries to retrieve a pending thumbnail, rare, but occurs with uncached users (Roblox's cache) (Default: 2) */
        maxRetries: number;
        /** The time to wait between consecutive retries of retrieving pending thumbnails. (Default: 500) */
        retryDelay: number;

        failedUrl: {
            /** The image URL to provide when an asset thumbnail is still pending; defaults to Roblox moderation icon via noblox.js's GitHub repo at https://noblox.js.org/moderatedThumbnails/moderatedThumbnail_{size}.png */
            pending: string;
            /** The image URL to provide when an asset thumbnail has been moderated by Roblox; defaults to Roblox moderation icon via noblox.js's GitHub repo at https://noblox.js.org/moderatedThumbnails/moderatedThumbnail_{size}.png */
            blocked: string;
        }
    }

    queue: {
        Message: {
            /** Although messages do have a floodcheck, it is not instituted immediately so this is disabled by default. If you are sending a lot of messages set a delay around 10-15 seconds (10000-15000). (Default: 0) */
            delay: number
        }
    }

    cache: {
        /** XCSRF tokens expire 30 minutes after being created. Until they expire, however, no new tokens can be made. Sometimes an XCSRF token has already been created for the user so the server doesn't know when to collect a new one. During transitions some requests may use invalid tokens. For now, new XCSRF tokens are automatically retrieved when cached ones get rejected. */
        XCSRF: {
            /** Default: 1800 */
            expire: number | boolean;
            /** Default: false */
            refresh: number | boolean;
        },

        /** Verification tokens seem to last extremely long times. */
        Verify: {
            /** Default: 7200 */
            expire: number | boolean;
            /** Default: 3600 */
            refresh: number | boolean;
        },

        /** This should be fine unless your group changes its ranks often. */
        Roles: {
            /** Default: 600 */
            expire: number | boolean;
            /** Default: true */
            refresh: number | boolean;
        },

        /** Disable this completely if you don't plan on ever changing your exile bot's rank. */
        RolesetId: {
            /** Default: 86400 */
            expire: number | boolean;
            /** Default: false */
            refresh: number | boolean;
        },

        /** Disabled by default for security (price checks). If you are only working with ROBLOX assets, however, you can set this to something high (since ROBLOX product info rarely changes). */
        Product: {
            /** Default: false */
            expire: number | boolean;
            /** Default: false */
            refresh: number | boolean;
        },

        /** Caches a user's username based on their ID. It is not on by default because it is an uncontrollable change but the option is there to cache it if you would like. */
        NameFromID: {
            /** Default: false */
            expire: number | boolean;
            /** Default: false */
            refresh: number | boolean;
        },

        /** Permanent cache for a user's ID based on their name. There is no reason this would ever change (changing names would re-match it and old names cannot be reused by other accounts). Only disable if you want this to match current names only. */
        IDFromName: {
            /** Default: true */
            expire: number | boolean;
            /** Default: false */
            refresh: number | boolean;
        },

        /** Permanent cache for the sender's user ID. This should literally never change. */
        SenderId: {
            /** Default: true */
            expire: number | boolean;
            /** Default: false */
            refresh: number | boolean;
        },

        /** Caches rank by user ID. Changes cannot be anticipated so this is not enabled by default. */
        Rank: {
            /** Default: false */
            expire: number | boolean;
            /** Default: false */
            refresh: number | boolean;
        }
    }
}

/// Asset

/**
 * @typedef
*/
type UploadItemAssetType = 11 | 12 | 13;

/**
 * @typedef
*/
type ProductInfoCreator = {
    Id: number;
    Name: string;
    HasVerifiedBadge: boolean;
}

/**
 * @typedef
*/
type ProductInfo = {
    TargetId: number;
    ProductType?: string;
    AssetId: number;
    ProductId: number;
    Name: string
    Description: string;
    AssetTypeId: number;
    Creator: ProductInfoCreator;
    IconImageAssetId: number;
    Created: Date;
    Updated: Date;
    PriceInRobux?: number;
    PriceInTickets?: number;
    Sales: number;
    IsNew: boolean;
    IsForSale: boolean;
    IsPublicDomain: boolean;
    IsLimited: boolean;
    IsLimitedUnique: boolean;
    Remaining?: number;
    MinimumMembershipLevel: number;
    ContentRatingTypeId: number;
    SaleAvailabilityLocations?: string[];
    SaleLocation?: string;
    CollectibleItemId?: number;
}

/**
 * @typedef
*/
type GamePassProductInfo = Omit<ProductInfo, "ContentRatingTypeId" | "SaleAvailabilityLocations" | "SaleLocation" | "CollectibleItemId">;

/**
 * @typedef
*/
type BuyProductInfo = {
    ProductId: number;
    Creator: { Id: number };
    PriceInRobux: number;
    UserAssetId: number;
}

/**
 * @typedef
*/
type PriceRange = {
    high: number;
    low: number;
}

/**
 * @typedef
*/
type BuyAssetResponse = {
    productId: number;
    price: number;
}

/**
 * @typedef
*/
type ChartDataPointResponse = {
    value?: number;
    date?: Date;
}

/**
 * @typedef
*/
type ResaleDataResponse = {
    assetStock?: number;
    sales?: number;
    numberRemaining?: number;
    recentAveragePrice?: number;
    originalPrice?: number;
    priceDataPoints?: ChartDataPointResponse[];
    volumeDataPoints?: ChartDataPointResponse[];
}

/**
 * @typedef
*/
type ResellerAgent = {
    id: number;
    type: "User" | "Group";
    name: string;
}

/**
 * @typedef
*/
type ResellerData = {
    userAssetId: number;
    seller: ResellerAgent;
    price: number;
    serialNumber?: number;
}

/**
 * @typedef
*/
type ThumbnailRequest = {
    requestId?: string;
    targetId?: number;
    token?: string;
    alias?: string;
    type: 'Avatar' | 'AvatarHeadShot' | 'GameIcon' | 'BadgeIcon' | 'GameThumbnail' | 'GamePass' | 'Asset' | 'BundleThumbnail' | 'Outfit' | 'GroupIcon' | 'DeveloperProduct' | 'AutoGeneratedAsset' | 'AvatarBust' | 'PlaceIcon' | 'AutoGeneratedGameIcon' | 'ForceAutoGeneratedGameIcon';
    size: string;
    format?: 'png' | 'jpeg';
    isCircular?: boolean;
}

/**
 * @typedef
*/
type ThumbnailData = {
    requestId?: string;
    errorCode: number;
    errorMessage: string;
    targetId: number;
    state: "Completed" | "Pending" | "Blocked";
    imageUrl?: string;
}

/**
 * @typedef
*/
type UploadItemResponse = {
    id: number;
}

/**
 * @typedef
*/
type UploadModelResponse = {
    AssetId: number;
    AssetVersionId : number;
}

/**
 * @typedef
*/
type UploadModelItemOptions = {
    name: string;
    description?: string;
    copyLocked?: boolean;
    allowComments?: boolean;
    groupId?: number;
}

/**
 * @typedef
 */
type ConfigureItemResponse = {
    name: string;
    assetId: number;
    description?: string;
    price?: number;
    isCopyingAllowed?: boolean;
}

/// Avatar

/**
 * @typedef
*/
type AssetTypeRulesModel = {
    min: number;
    max: number;
    increment: number;
}

/**
 * @typedef
*/
type AvatarRulesScales = {
    [scalename: string]: AssetTypeRulesModel;
}

/**
 * @typedef
*/
type WearableAssetType = {
    maxNumber: number;
    id: number;
    name: string;
}

/**
 * @typedef
*/
type BodyColorModel = {
    brickColorId: number;
    hexColor: string;
    name: string;
}

/**
 * @typedef
*/
type DefaultClothingAssetLists = {
    defaultShirtAssetIds: Array<number>;
    defaultPantAssetIds: Array<number>;
}

/**
 * @typedef
*/
type AvatarRules = {
    playerAvatarTypes: Array<string>;
    scales: AvatarRulesScales;
    wearableAssetTypes: Array<WearableAssetType>;
    bodyColorsPalette: Array<BodyColorModel>;
    basicBodyColorsPalette: Array<BodyColorModel>;
    minimumDeltaEBodyColorDifference: number;
    proportionsAndBodyTypeEnabledForUser: boolean;
    defaultClothingAssetLists: DefaultClothingAssetLists;
    bundlesEnabledForUser: boolean;
    emotesEnabledForUser: boolean;
}

/**
 * @typedef
*/
type AssetIdList = {
    assetIds: Array<number>;
}

/**
 * @typedef
*/
type AvatarScale = {
    height: number;
    width: number;
    head: number;
    depth: number;
    proportion: number;
    bodyType: number;
}

/**
 * @typedef
*/
type AvatarBodyColors = {
    headColorId: number;
    torsoColorId: number;
    rightArmColorId: number;
    leftArmColorId: number;
    rightLegColorId: number;
    leftLegColorId: number;
}

/**
 * @typedef
*/
type AvatarAssetType = {
    id: number;
    name: string;
}

/**
 * @typedef
*/
type AvatarAsset = {
    id: number;
    name: string;
    assetType: AvatarAssetType;
}

/**
 * @typedef
*/
type PlayerAvatarType = "R6" | "R15";

/**
 * @typedef
*/
type AvatarInfo = {
    scales: AvatarScale;
    playerAvatarType: PlayerAvatarType;
    bodyColors: AvatarBodyColors;
    assets: Array<AvatarAsset>;
    defaultShirtApplied: boolean;
    defaultPantsApplied: boolean;
}

/**
 * @typedef
*/
type RecentItemListType = "All" | "Clothing" | "BodyParts" | "AvatarAnimations" | "Accessories" | "Outfits" | "Gear";

/**
 * @typedef
*/
type RecentItemType = "Asset" | "Outfit";

/**
 * @typedef
*/
type AssetRecentItem = {
    id: number;
    name: string;
    type: RecentItemType;
    assetType: AvatarAssetType;
    isEditable?: boolean;
}

/**
 * @typedef
*/
type AssetRecentItemsResult = {
    data: Array<AssetRecentItem>;
    total: number;
}

/**
 * @typedef
*/
type AvatarOutfitDetails = {
    id: number;
    name: string;
    assets: Array<AvatarAsset>;
    bodyColors: Array<AvatarBodyColors>;
    scale: AvatarScale;
    playerAvatarType: PlayerAvatarType;
    isEditable: boolean;
}

/**
 * @typedef
*/
type AvatarOutfit = {
    id: number;
    name: string;
    isEditable: boolean;
}

/**
 * @typedef
*/
type GetOutfitsResult = {
    data: Array<AvatarOutfit>;
    total: number;
}

/// Chat

/**
 * @typedef
*/
type RejectedParticipant = {
    rejectedReason: string;
    type: string;
    targetId: number;
    name: string;
    displayName: string;
}

/**
 * @typedef
*/
type ConversationAddResponse = {
    conversationId: number;
    rejectedParticipants: Array<RejectedParticipant>;
    resultType: string;
    statusMessage: string;
}

/**
 * @typedef
*/
type ConversationRemoveResponse = {
    conversationId: number;
    resultType: string;
    statusMessage: string;
}

/**
 * @typedef
*/
type ConversationRenameResponse = {
    conversationTitle: string;
    resultType: string;
    title: ChatConversationTitle;
    statusMessage: string;
}

/**
 * @typedef
*/
type SendChatResponse = {
    content: string;
    filteredForReceivers: boolean;
    messageId: string;
    sent: string;
    messageType: string;
    resultType: string;
    statusMessage: string;
}

/**
 * @typedef
*/
type UpdateTypingResponse = {
    statusMessage: string;
}

/**
 * @typedef
*/
type StartGroupConversationResponse = {
    conversation: ChatConversation;
    rejectedParticipants: Array<RejectedParticipant>;
    resultType: string;
    statusMessage: string;
}

/**
 * @typedef
*/
type ChatSettings = {
    /**
     * Is chat enabled for the user.
     */
    chatEnabled: boolean;
    /**
     * Was the Last ChatMessage Sent within the last x days or the account was created in the last x days? Note: user is active by default unless he does not chat for more than x days after account creation
     */
    isActiveChatUser: boolean;
}

/**
 * @typedef
*/
type ChatMessage = {
    id: string;
    senderType: "User" | "System";
    sent: string;
    read: boolean;
    messageType: "PlainText" | "Link" | "EventBased";
    decorators: Array<string>;
    senderTargetId: number;
    content: string;
    link: ChatMessageLink;
    eventBased: ChatMessageEventBased;
}

/**
 * @typedef
*/
type ChatMessageLink = {
    type: "Game";
    game: ChatMessageGameLink;
}

/**
 * @typedef
*/
type ChatMessageGameLink = {
    universeId: number;
}

/**
 * @typedef
*/
type ChatMessageEventBased = {
    type: "SetConversationUniverse";
    setConversationUniverse: ChatMessageSetConversationUniverseEventBased;
}

/**
 * @typedef
*/
type ChatMessageSetConversationUniverseEventBased = {
    actorUserId: number;
    universeId: number;
}

/**
 * @typedef
*/
type ChatConversation = {
    id: number;
    title: string;
    initiator: ChatParticipant;
    hasUnreadMessages: boolean;
    participants: Array<ChatParticipant>;
    conversationType: "OneToOneConversation" | "MultiUserConversation" | "CloudEditConversation";
    conversationTitle: ChatConversationTitle;
    lastUpdated: Date;
    conversationUniverse: ChatConversationUniverse;
}

/**
 * @typedef
*/
type ChatParticipant = {
    type: "User" | "System";
    targetId: number;
    name: string;
    displayName: string;
}

/**
 * @typedef
*/
type ChatConversationTitle = {
    titleForViewer: string;
    isDefaultTitle: boolean;
}

/**
 * @typedef
*/
type ChatConversationUniverse = {
    universeId: number;
    rootPlaceId: number;
}

/**
 * @typedef
*/
type ChatFeatureNames = "LuaChat" | "ConversationUniverse" | "PlayTogether" | "Party" | "GameLink" | "OldPlayTogether";

/**
 * @typedef
*/
type GetRolloutSettingsResult = {
    rolloutFeatures: Array<ChatRolloutFeature>;
}

/**
 * @typedef
*/
type ChatRolloutFeature = {
    featureName: ChatFeatureNames;
    isRolloutEnabled: boolean;
}

/**
 * @typedef
*/
type GetUnreadConversationCountResult = {
    count: number;
}

/**
 * @typedef
*/
type ChatConversationWithMessages = {
    conversationId: number;
    chatMessages: Array<ChatMessage>;
}

/**
 * @typedef
*/
type OnUserTypingChatEvent = {
    UserId: number;
    ConversationId: number;
    IsTyping: boolean;
}

/// Game
/**
 * @typedef
*/
type GameInstance = {
    id: string;
    maxPlayers: number;
    playing: number;
    playerTokens: Array<string>;
    fps: number;
    ping: number;
}

/**
 * @typedef
 */
type GamePassResponse = {
    gamePassId: number,
    name?: string,
    description?: string,
    price?: number,
    isForSale?: boolean,
    iconChanged?: boolean
}

/**
 * @typedef
*/
type UniverseCreator = {
    id: number;
    name: string;
    type: string;
    isRNVAccount: boolean;
}

/**
 * @typedef
*/
type UniverseInformation = {
    id: number;
    rootPlaceId: number;
    name: string;
    description: string;
    creator: UniverseCreator;
    price: number;
    allowedGearGenres: Array<string>;
    allowedGearCategories: Array<string>;
    isGenreEnforced: boolean;
    copyingAllowed: boolean;
    playing: number;
    visits: number;
    maxPlayers: number;
    created: Date;
    updated: Date;
    studioAccessToApisAllowed: boolean;
    createVipServersAllowed: boolean;
    universeAvatarType: "MorphToR6" | "PlayerChoice" | "MorphToR15";
    genre: "All" | "Tutorial" | "Scary" | "TownAndCity" | "War" | "Funny" | "Fantasy" | "Adventure" | "SciFi" | "Pirate" | "FPS" | "RPG" | "Sports" | "Ninja" | "WildWest";
    isAllGenre: boolean;
    isFavoritedByUser: boolean;
    favoritedCount: number;
}

/**
 * @typedef
 */
type PlaceInformation = {
    placeId: number;
    name: string;
    sourceName: string;
    sourceDescription: string;
    url: string;
    builder: string;
    builderId: number;
    hasVerifiedBadge: boolean;
    isPlayable: boolean;
    reasonProhibited: string;
    universeId: number;
    universeRootPlaceId: number;
    price: number;
    imageToken: string;
}
        
/**
 * @typedef
 */
type DeveloperProduct = {
    ProductId: number,
    DeveloperProductId: number,
    Name: string,
    Description: string,
    IconImageAssetId: number,
    displayName: string,
    displayDescription: string,
    displayIcon: number,
    PriceInRobux: number
}

/**
 * @typedef
 */
type SocialLinkResponse = {
    id: number;
    type: 'Facebook' | 'Twitter' | 'YouTube' | 'Twitch' | 'GooglePlus' | 'Discord' | 'RobloxGroup' | 'Amazon';
    url: string;
    title: string;
}

/**
 * @typedef
 */
type DeveloperProductsResult = {
    DeveloperProducts: Array<DeveloperProduct>,
    FinalPage: boolean,
    PageSize: number
}

/**
 * @typedef
*/
type DeveloperProductAddResult = {
    universeId: number,
    name: string,
    priceInRobux: number,
    description?: string,
    productId: string
}

/**
 * @typedef
*/
type CheckDeveloperProductNameResult = {
    Success: boolean;
    /**
     * When success is true: "Name available"
     * When success is false, you can get: "Product name already exists"
     */
    Message: string;
}

/**
 * @typedef
 */
type GamePassData = {
    id: number;
    name: string;
    displayName: string;
    productId?: number;
    price?: number;
}

/**
 * @typedef
 */
type UniversePermissions = {
    IsThirdPartyTeleportAllowed?: boolean;
    IsThirdPartyAssetAllowed?: boolean;
    IsThirdPartyPurchaseAllowed?: boolean;
}

/**
 * @typedef
 */
type UniverseAsset = {
    assetID: number,
    assetTypeID: number,
    isPlayerChoice: boolean
}

/**
 * @typedef
 */
type PlayableDevices = "Computer" | "Phone" | "Tablet" | "Console"

/**
 * @typedef
 */
type Regions = "Unknown" | "China"

/**
 * @typedef
 */
type UniverseSettings = {
    allowPrivateServers?: boolean;
    privateServerPrice?: number;

    name?: string;
    description?: string;

    universeAvatarType?: "MorphToR6" | "MorphToR15" | "PlayerChoice";
    universeAnimationType?: "Standard" | "PlayerChoice";
    universeCollisionType?: "InnerBox" | "OuterBox";
    universeJointPositioningType?: "Standard" | "ArtistIntent";
    
    isArchived?: boolean;
    isFriendsOnly?: boolean;

    genre?: "All" | "Tutorial" | "Scary" | "TownAndCity" | "War" | "Funny" | "Fantasy" | "Adventure" | "SciFi" | "Pirate" | "FPS" | "RPG" | "Sports" | "Ninja" | "WildWest";

    /**
     * Computer, Phone, Tablet, Console
    */
    playableDevices?: Array<PlayableDevices>;
    universeAvatarAssetOverrides?: Array<UniverseAsset>;

    isForSale?: boolean;
    price?: number;
    
    universeAvatarMinScales?: AvatarScale;
    universeAvatarMaxScales?: AvatarScale;

    studioAccessToApisAllowed?: boolean;
    permissions?: UniversePermissions;

    /**
     * Unknown, China
    */
    optInRegions?: Array<Regions>;
}

/**
 * @typedef
 */
 type UpdateUniverseResponse = {
    allowPrivateServers?: boolean;
    privateServerPrice?: number;

    id: number;
    name?: string;
    description?: string;

    universeAvatarType?: "MorphToR6" | "MorphToR15" | "PlayerChoice";
    universeAnimationType?: "Standard" | "PlayerChoice";
    universeCollisionType?: "InnerBox" | "OuterBox";
    universeJointPositioningType?: "Standard" | "ArtistIntent";
    
    isArchived?: boolean;
    isFriendsOnly?: boolean;

    genre?: "All" | "Tutorial" | "Scary" | "TownAndCity" | "War" | "Funny" | "Fantasy" | "Adventure" | "SciFi" | "Pirate" | "FPS" | "RPG" | "Sports" | "Ninja" | "WildWest";

    /**
     * Computer, Phone, Tablet, Console
    */
    playableDevices?: Array<PlayableDevices>;
    universeAvatarAssetOverrides?: Array<UniverseAsset>;

    isForSale?: boolean;
    price?: number;
    
    universeAvatarMinScales?: AvatarScale;
    universeAvatarMaxScales?: AvatarScale;

    studioAccessToApisAllowed?: boolean;
    permissions?: UniversePermissions;

    /**
     * Unknown, China
    */
     optInRegions?: Array<Regions>;
}

/**
 * @typedef
 */
 type GameRevenueData = {
    Total: object;
}

/**
 * @typedef
 */
type GameRevenueResponse = {
    placeId: number;
    dataType: number;
    dataGranularity: number;
    startTime: Date;
    endTime: Date;
    data: GameRevenueData;
}

/// Group

/**
 * @typedef
*/
type GroupIconSize = "150x150" | "420x420"
type GroupIconFormat = "Png"

/**
 * @typedef
*/
type Role = {
    name: string;
    memberCount?: number;
    rank: number;
    id: number;
}

/**
 * @typedef
*/
type RoleWithDescription = {
    name: string;
    memberCount?: number;
    rank: number;
    id: number;
    description: string;
}

/**
 * @typedef
*/
type GroupPostsPermissions = {
    viewWall: boolean;
    postToWall: boolean;
    deleteFromWall: boolean;
    viewStatus: boolean;
    postToStatus: boolean;
}

/**
 * @typedef
*/
type GroupMembershipPermissions = {
    changeRank: boolean;
    inviteMembers: boolean;
    removeMembers: boolean;
}

/**
 * @typedef
*/
type GroupManagementPermissions = {
    manageRelationships: boolean;
    manageClan: boolean;
    viewAuditLogs: boolean;
}

/**
 * @typedef
*/
type GroupEconomyPermissions = {
    spendGroupFunds: boolean;
    advertiseGroup: boolean;
    createItems: boolean;
    manageItems: boolean;
    addGroupPlaces: boolean;
    manageGroupGames: boolean;
    viewGroupPayouts: boolean;
}

/**
 * @typedef
*/
type RolePermissionsBody = {
    groupPostsPermissions: GroupPostsPermissions;
    groupMembershipPermissions: GroupMembershipPermissions;
    groupManagementPermissions: GroupManagementPermissions;
    groupEconomyPermissions: GroupEconomyPermissions;
}

/**
 * @typedef
*/
type RolePermissions = {
    groupId: number;
    role: RoleWithDescription;
    permissions: RolePermissionsBody
}

/**
 * @typedef
*/
type ChangeRankResult = {
    newRole: Role;
    oldRole: Role;
}

/**
 * @typedef
*/
type Group = {
    id: number;
    name: string;
    description: string;
    owner: GroupUser;
    shout?: GroupShout;
    memberCount: number;
    isBuildersClubOnly: boolean;
    publicEntryAllowed: boolean;
    isLocked: boolean;
}

/**
 * @typedef
 */
type GroupSearchItem = {
    id: number;
    name: string;
    description: string;
    memberCount: number;
    publicEntryAllowed: boolean;
    created: Date;
    updated: Date;
}

/**
 * @typedef
 */
type GroupGameInfo = {
    id: number;
    name: string;
    description: string;
    creator: { id: number; type: string; };
    rootPlace: { id: number; type: string; };
    created: Date;
    updated: Date;
    placeVisits: number;
}

/**
 * @typedef
 */
type GroupAssetInfo = {
    assetId: number;
    name: string;
}

/**
 * @typedef
 */
type IGroupPartial = {
    Name: string;
    Id: number;
    EmblemUrl: string;
    MemberCount: number;
    Rank: number;
    Role: string;
    RoleId: number;
    IsPrimary: boolean;
}

/**
 * @typedef
*/
type GroupView = {
    __VIEWSTATE: string;
    __VIEWSTATEGENERATOR: string;
    __EVENTVALIDATION: string;
    __RequestVerificationToken: string;
}

/**
 * @typedef
*/
type GroupUser = {
    userId: number;
    username: string;
    displayName: string;
    hasVerifiedBadge?: boolean;
}

/**
 * @typedef
*/
type GroupShout = {
    body: string;
    poster: GroupUser;
    created: Date;
    updated: Date;
}

/**
 * @typedef
 */
type GroupDescriptionResult = {
    newDescription: string
}

/**
 * @typedef
 */
type GroupNameResult = {
    newName: string
}

/**
 * @typedef
*/
type AuditItemActor = {
    user: GroupUser;
    role: Role;
}

/**
 * @typedef
*/
type AuditItem = {
    actor: AuditItemActor;
    actionType: string;
    description: object;
    created: Date;
}

/**
 * @typedef
*/
type AuditPage = {
    data: Array<AuditItem>;
    nextPageCursor?: string;
    previousPageCursor?: string;
}

/**
 * @typedef
*/
type TransactionAgent = {
    id: number;
    type: string;
    name: string;
}

/**
 * @typedef
*/
type TransactionDetails = {
    id: number;
    name: string;
    type: string;
}

/**
 * @typedef
*/
type TransactionCurrency = {
    amount: number;
    type: string;
}

/**
 * @typedef
*/
type TransactionItem = {
    id: number;
    transactionType?: string;
    created: Date;
    isPending: boolean;
    agent: TransactionAgent;
    details?: TransactionDetails;
    currency: TransactionCurrency;
}

/**
 * @typedef
*/
type GroupJoinRequester = {
    userId: number;
    username: string;
    displayName: string;
}

/**
 * @typedef
*/
type GroupJoinRequest = {
    requester: GroupJoinRequester;
    created: Date;
}

/**
 * @typedef
*/
type GroupJoinRequestsPage = {
    previousPageCursor?: string;
    nextPageCursor?: string;
    data: Array<GroupJoinRequest>;
}

/**
 * @typedef
 */
type RevenueSummaryResponse = {
    recurringRobuxStipend?: number;
    itemSaleRobux?: number;
    purchasedRobux?: number;
    tradeSystemRobux?: number;
    pendingRobux?: number;
    groupPayoutRobux?: number;
    individualToGroupRobux?: number;
    premiumPayouts?: number;
    groupPremiumPayouts?: number;
    adjustmentRobux?: number;
}

/**
 * @typedef
*/
type WallPost = {
    id: number;
    poster: GroupUser;
    body: string;
    created: Date;
    updated: Date;
}

/**
 * @typedef
*/
type WallPostPage = {
    previousPageCursor?: string;
    nextPageCursor?: string;
    data: Array<WallPost>;
}

/// Party

/**
 * @typedef
*/
type PartyData = {
    PartyId: number;
    PartyType: string;
}

/// User

/**
 * 0 = Inbox
 * 1 = Sent Messages
 * 3 = Archived Messages
 */
type PrivateMessageTab = 0 | 1 | 3;

/**
 * 0 = Offline
 * 1 = Online
 * 2 = InGame
 * 3 = Studio
 */
type UserPresenceType = 0 | 1 | 2 | 3

/**
 * @typedef
*/
type LoggedInUserData = {
    UserID: number,
    UserName: string,
    RobuxBalance: number,
    ThumbnailUrl: string,
    IsAnyBuildersClubMember: false,
    IsPremium: boolean
}

/**
 * @typedef
*/
type AuthenticatedUserData = {
    id: number;
    name: string;
    displayName: string;
}

/**
 * @typedef
*/
type UserLoginApiData = {
    userId: number;
}

/**
 * @typedef
*/
type AvatarEntry = {
    url: string;
    final: boolean;
}

/**
 * @typedef
*/
type UserStatus = {
    online: boolean;
    lastSeen: Date;
}

/**
 * @typedef
*/
type FriendRequestEntry = {
    description: string;
    created: Date;
    isBanned: boolean;
    id: number;
    name: string;
    displayName: string;
}

/**
 * @typedef
*/
type FriendRequestsPage = {
    previousPageCursor?: string;
    nextPageCursor?: string;
    data: Array<FriendRequestEntry>;
}

/**
 * @typedef
*/
type FriendEntry = {
    created: Date;
    id: number;
    isBanned: boolean;
    isDeleted: boolean;
    isOnline?: boolean;
    name: string;
    description?: string;
    displayName: string;
    externalAppDisplayName?: string;
    friendFrequentRank: number;
    friendFrequentScore: number;
    presenceType?: UserPresenceType;
}

/**
 * @typedef
*/
type Friends = {
    friends: Array<FriendEntry>;
}

/**
 * @typedef
*/
type FollowEntry = {
    isDeleted: false;
    id: number;
    name: string;
    description: string;
    created: Date;
    displayName: string;
}

/**
 * @typedef
*/
type FollowingsPage = {
    previousPageCursor?: string;
    nextPageCursor?: string;
    data: Array<FollowEntry>;
}

/**
 * @typedef
*/
type FollowersPage = {
    previousPageCursor?: string;
    nextPageCursor?: string;
    data: Array<FollowEntry>;
}

/**
 * @typedef
*/
type PrivateMessagesPage = {
    collection: Array<PrivateMessage>;
    totalPages: number;
    totalCollectionSize: number;
    pageNumber: number;
}

/**
 * @typedef
*/
type UserEntry = {
    userId: number;
    name: string;
    displayName: string;
}

/**
 * @typedef
*/
type UsernameHistoryEntry = {
    name: string;
}

/**
 * @typedef
*/
type PrivateMessageParent = {
    page: number;
}

/**
 * @typedef
*/
type PrivateMessage = {
    id: number;
    sender: UserEntry;
    recipient: UserEntry;
    subject: string;
    body: string;
    created: Date;
    updated: Date;
    isRead: boolean;
    isSystemMessage: boolean;
    isReportAbuseDisplayed: boolean;
    parent: PrivateMessageParent;
}

/**
 * @typedef
*/
type NotificationMessage = {
    type: string;
    [key: string]: any;
}

/**
 * @typedef
*/
type FriendRequest = number;

/**
 * @typedef
*/
type UserPresence = {
    userPresenceType?: UserPresenceType;
    lastLocation?: string;
    placeId?: number;
    rootPlaceId?: number;
    gameId?: string;
    universeId?: number;
    userId?: number;
    lastOnline?: string;
}

/**
 * @typedef
*/
type PlayerInfo = {
    username: string;
    displayName: string;
    blurb: string;
    joinDate: Date;
    age?: number;
    friendCount?: number;
    followerCount?: number;
    followingCount?: number;
    isBanned: boolean;
}

/**
 * @typedef
*/
type UserInfo = {
    description: string;
    created: Date;
    isBanned: boolean;
    hasVerifiedBadge: boolean;
    id: number;
    name: string;
    displayName: string;
}

/**
 * @typedef
*/
type Presences = {
    userPresences: Array<UserPresence>;
}

/**
 * @typedef
*/
type PlayerThumbnailData = {
    targetId: number;
    state: string;
    imageUrl: string;
}

/**
 * @typedef
 */
type PromotionChannelsResponse = {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    twitch?: string;
    guilded?: string;
}

type UserSearchResult = {
    previousUsernames: string[];
    hasVerifiedBadge: boolean;
    id: number;
    name: string;
    displayName: string;
}

/// Badges

/**
 * @typedef
*/
type BadgeAwarder = {
    id: number;
    type: string;
}

/**
 * @typedef
*/
type UserBadgeStats = {
    badgeId: number;
    awardedDate: Date;
}

/**
 * @typedef
*/
type BadgeStatistics = {
    pastDayAwardedCount: number;
    awardedCount: number;
    winRatePercentage: number;
}

/**
 * @typedef
*/
type BadgeUniverse = {
    id: number;
    name: string;
    rootPlaceId: number;
}

/**
 * @typedef
*/
type PlayerBadges = {
    id: number;
    name: string;
    description?: string;
    displayName: string;
    displayDescription?: string;
    enabled: boolean;
    iconImageId: number;
    displayIconImageId: number;
    awarder: BadgeAwarder;
    statistics: BadgeStatistics;
    created: Date;
    updated: Date;
}

/**
 * @typedef
*/
type BadgeInfo = {
    id: number;
    name: string;
    description?: string;
    displayName: string;
    displayDescription?: string;
    enabled: boolean;
    iconImageId: number;
    displayIconImageId: number;
    created: Date;
    updated: Date;
    statistics: BadgeStatistics
    awardingUniverse: BadgeUniverse
}

//Inventory

/**
 * @typedef
*/
type AssetOwner = {
    userId: number;
    username: string;
    buildersClubMembershipType: number;
}

/**
 * @typedef
*/
type CollectibleEntry = {
    userAssetId: number;
    serialNumber?: number;
    assetId: number;
    name: string;
    recentAveragePrice: number;
    originalPrice?: number;
    assetStock?: number;
    buildersClubMembershipType: number;
}

/**
 * @typedef
*/
type Collectibles = {
    collectibles: Array<CollectibleEntry>;
}

/**
 * @typedef
*/
type InventoryEntry = {
    assetId: number;
    name: string;
    assetType: string;
    created: Date;
    updated?: Date;
    assetName?: string;
    userAssetId?: number;
    owner?: AssetOwner;
}

/**
 * @typedef
*/
type Inventory = {
    items: Array<InventoryEntry>;
}

///Trading

/**
 * @typedef
*/
type UAIDResponse = {
    uaids: Array<number>,
    failedIds: Array<number>
}

/**
 * @typedef
*/
type CanTradeResponse = {
    canTrade: boolean,
    status: string
}

/**
 * @typedef
*/
type TradeUser = {
    userId: number;
    username: string;
    displayName: string;
}

/**
 * @typedef
*/
type TradeAsset = {
    id: number,
    user: TradeUser,
    created: Date,
    expiration?: Date,
    isActive: boolean,
    status: string
}

/**
 * @typedef
*/
type DetailedTradeAsset = {
    id: number,
    serialNumber: number,
    assetId: number,
    name: string,
    recentAveragePrice: number,
    originalPrice: number,
    assetStock: number,
    membershipType: string
}

/**
 * @typedef
*/
type DetailedTradeOffer = {
    user: TradeUser,
    userAssets: Array<DetailedTradeAsset>,
    robux: number
}

/**
 * @typedef
*/
type TradeOffer = {
    userAssetIds: Array<number>,
    robux: number
}

/**
 * @typedef
*/
type TradeInfo = {
    offers: Array<DetailedTradeOffer>,
    id: number,
    user: TradeUser,
    created: Date,
    expiration?: Date,
    isActive: boolean,
    status: string
}

/**
 * @typedef
*/
type SendTradeResponse = {
    id: number
}

/// Utility

/**
 * @typedef
*/
type SelectorFunction = (selector: string) => {val(): any};
type SortOrder = 'Asc' | 'Desc';
type Limit = 10 | 25 | 50 | 100;

/**
 * @typedef
*/
type Inputs = {
    /**
     * With a provided name, this returns the input's value.
     */
    [name: string]: string;
}

/**
 * @typedef
*/
type GetVerificationResponse = {
    body?: string;
    inputs: Inputs;
    header: string;
}

/**
 * @typedef
*/
type HttpOptions = {
    verification?: string;
    jar?: CookieJar;
}

/**
 * @typedef
*/
type GetLatestResponse = {
    latest: number;
    data: object;
    repeat?: boolean;
}

/// Datastores

/**
 * @typedef
*/
type Datastore = { 
    name: string;
    createdTime: Date;
}

/**
 * @typedef
*/
type DatastoresResult = { 
    datastores: Datastore[];
    nextPageCursor?: string;
}

/**
 * @typedef
*/
type EntryKey = { 
    scope: string;
    key: string;
}

/**
 * @typedef
*/
type DatastoreKeysResult = {
    keys: EntryKey[];
    nextPageCursor?: string;
}

/**
 * @typedef
*/
type DatastoreEntry = {
    data: any;
    metadata: {
        /**  (ISO datetime, UTC): the time at which the entry was created */
        robloxEntryCreatedTime: Date;
        /**  (ISO datetime, UTC): the time at which the entry was updated */
        lastModified: Date;
        /** version of the entry being read */
        robloxEntryVersion: string;
        robloxEntryAttributes?: string;
        robloxEntryUserIDs?: string;
        /** the base-64 encoded MD5 checksum of the content */
        contentMD5: string;
        /** the content length in bytes */
        contentLength: number;
    }
}

/**
 * @typedef
*/
type EntryVersion = {
    version: string;
    deleted: boolean;
    contentLength: number;
    createdTime: Date;
    objectCreatedTime: Date;
}

/**
 * @typedef
*/
type EntryVersionsResult = {
    versions: EntryVersion[];
    nextPageCursor: string;
}
