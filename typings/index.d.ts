// Type definitions for noblox.js@4.8.0-0
// Authored by Gamenew09 w/ changes by suufi

declare module "noblox.js" {
    // Interfaces/Types
    import * as events from "events";
    import * as stream from "stream";

    /**
     * request
     */
    interface CookieJar
    {
        session?: string;
    }

    /// Asset

    /**
     * shirts = 11
     * pants = 12
     * decals = 13
     */
    type UploadItemAssetType = 11 | 12 | 13;

    interface ProductInfoCreator {
        Id: number;
        Name: string;
    }

    interface IGroupPartial {
        Name: string,
        Id: number,
        EmblemUrl: string,
        MemberCount: number,
        Rank: number,
        Role: string,
        RoleId: number,
        IsPrimary: boolean,
    }

    interface ProductInfo {
        AssetId: number;
        ProductId: number;
        Name: string
        Description: string;
        AssetTypeId: number;
        Creator: ProductInfoCreator;
        IconImageAssetId: number;
        Created: Date;
        Updated: Date;
        PriceInRobux: number | null;
        PriceInTickets: number | null;
        Sales: number;
        IsNew: boolean;
        IsForSale: boolean;
        IsPublicDomain: boolean;
        IsLimited: boolean;
        IsLimitedUnique: boolean;
        Remaining: number | null;
        MinimumMembershipLevel: number;
        ContentRatingTypeId: number;
    }

    interface BuyProductInfo {
        ProductId: number;
        Creator: {Id: number};
        PriceInRobux: number;
        UserAssetId: number;
    }

    interface PriceRange {
        high: number;
        low: number;
    }

    interface BuyAssetResponse {
        productId: number;
        price: number;
    }

    interface UploadItemResponse {
        id: number;
    }

    interface UploadModelResponse {
        AssetId: number;
        AssetVersionId : number;
    }

    interface UploadModelItemOptions {
        name: string;
        description?: string;
        copyLocked?: boolean;
        allowComments?: boolean;
        groupId?: number;
    }

    /// Avatar

    interface AssetTypeRulesModel
    {
        min: number;
        max: number;
        increment: number;
    }

    interface AvatarRulesScales
    {
        [scalename: string]: AssetTypeRulesModel;
    }

    interface WearableAssetType
    {
        maxNumber: number;
        id: number;
        name: string;
    }

    interface BodyColorModel
    {
        brickColorId: number;
        hexColor: string;
        name: string;
    }

    interface DefaultClothingAssetLists
    {
        defaultShirtAssetIds: number[];
        defaultPantAssetIds: number[];
    }

    interface AvatarRules
    {
        playerAvatarTypes: string[];
        scales: AvatarRulesScales;
        wearableAssetTypes: WearableAssetType[];
        bodyColorsPalette: BodyColorModel[];
        basicBodyColorsPalette: BodyColorModel[];
        minimumDeltaEBodyColorDifference: number;
        proportionsAndBodyTypeEnabledForUser: boolean;
        defaultClothingAssetLists: DefaultClothingAssetLists;
        bundlesEnabledForUser: boolean;
        emotesEnabledForUser: boolean;
    }

    interface AssetIdList
    {
        assetIds: number[];
    }

    interface AvatarScale
    {
        height: number;
        width: number;
        head: number;
        depth: number;
        proportion: number;
        bodyType: number;
    }

    interface AvatarBodyColors
    {
        headColorId: number;
        torsoColorId: number;
        rightArmColorId: number;
        leftArmColorId: number;
        rightLegColorId: number;
        leftLegColorId: number;
    }

    interface AvatarAssetType
    {
        id: number;
        name: string;
    }

    interface AvatarAsset
    {
        id: number;
        name: string;
        assetType: AvatarAssetType;
    }

    type PlayerAvatarType = "R6" | "R15";

    interface AvatarInfo
    {
        scales: AvatarScale;
        playerAvatarType: PlayerAvatarType;
        bodyColors: AvatarBodyColors;
        assets: AvatarAsset[];
        defaultShirtApplied: boolean;
        defaultPantsApplied: boolean;
    }

    type RecentItemListType = "All" | "Clothing" | "BodyParts" | "AvatarAnimations" | "Accessories" | "Outfits" | "Gear";
    type RecentItemType = "Asset" | "Outfit";

    interface AssetRecentItem
    {
        id: number;
        name: string;
        type: RecentItemType;
        assetType: AvatarAssetType;
        isEditable?: boolean;
    }

    interface AssetRecentItemsResult
    {
        data: AssetRecentItem[];
        total: number;
    }

    interface AvatarOutfitDetails
    {
        id: number;
        name: string;
        assets: AvatarAsset[];
        bodyColors: AvatarBodyColors[];
        scale: AvatarScale;
        playerAvatarType: PlayerAvatarType;
        isEditable: boolean;
    }

    interface AvatarOutfit
    {
        id: number;
        name: string;
        isEditable: boolean;
    }

    interface GetOutfitsResult
    {
        data: AvatarOutfit[];
        total: number;
    }

    /// Chat

    interface RejectedParticipant
    {
        rejectedReason: string;
        type: string;
        targetId: number;
        name: string;
        displayName: string;
    }

    interface ConversationAddResponse
    {
        conversationId: Number;
        rejectedParticipants: RejectedParticipant[];
        resultType: string;
        statusMessage: string;
    }

    interface ConversationRemoveResponse
    {
        conversationId: Number;
        resultType: string;
        statusMessage: string;
    }

    interface ConversationRenameResponse
    {
        conversationTitle: string;
        resultType: string;
        title: ChatConversationTitle;
        statusMessage: string;
    }

    interface SendChatResponse
    {
        content: string;
        filteredForRecievers: boolean;
        messageId: string;
        sent: string;
        messageType: string;
        resultType: string;
        statusMessage: string;
    }

    interface UpdateTypingResponse
    {
        statusMessage: string;
    }

    interface StartGroupConversationResponse
    {
        conversation: ChatConversation;
        rejectedParticipants: RejectedParticipant[];
        resultType: string;
        statusMessage: string;
    }

    interface ChatSettings
    {
        /**
         * Is chat enabled for the user.
         */
        chatEnabled: boolean;
        /**
         * Was the Last ChatMessage Sent within the last x days or the account was created in the last x days? Note: user is active by default unless he does not chat for more than x days after account creation
         */
        isActiveChatUser: boolean;
    }

    interface ChatMessage
    {
        id: string;
        senderType: "User" | "System";
        sent: string;
        read: boolean;
        messageType: "PlainText" | "Link" | "EventBased";
        decorators: string[];
        senderTargetId: number;
        content: string;
        link: ChatMessageLink;
        eventBased: ChatMessageEventBased;
    }

    interface ChatMessageLink
    {
        type: "Game";
        game: ChatMessageGameLink;
    }

    interface ChatMessageGameLink
    {
        universeId: number;
    }

    interface ChatMessageEventBased
    {
        type: "SetConversationUniverse";
        setConversationUniverse: ChatMessageSetConversationUniverseEventBased;
    }

    interface ChatMessageSetConversationUniverseEventBased
    {
        actorUserId: number;
        universeId: number;
    }

    interface ChatConversation
    {
        id: number;
        title: string;
        initiator: ChatParticipant;
        hasUnreadMessages: boolean;
        participants: ChatParticipant[];
        conversationType: "OneToOneConversation" | "MultiUserConversation" | "CloudEditConversation";
        conversationTitle: ChatConversationTitle;
        lastUpdated: string;
        conversationUniverse: ChatConversationUniverse;
    }

    interface ChatParticipant
    {
        type: "User" | "System";
        targetId: number;
        name: string;
    }

    interface ChatConversationTitle
    {
        titleForViewer: string;
        isDefaultTitle: boolean;
    }

    interface ChatConversationUniverse
    {
        universeId: number;
        rootPlaceId: number;
    }

    type ChatFeatureNames = "LuaChat" | "ConversationUniverse" | "PlayTogether" | "Party" | "GameLink" | "OldPlayTogether";

    interface GetRolloutSettingsResult
    {
        rolloutFeatures: ChatRolloutFeature[];
    }

    interface ChatRolloutFeature
    {
        featureName: ChatFeatureNames;
        isRolloutEnabled: boolean;
    }

    interface GetUnreadConversationCountResult
    {
        count: number;
    }

    interface ChatConversationWithMessages
    {
        conversationId: number;
        chatMessages: ChatMessage[];
    }

    interface OnUserTypingChatEvent
    {
        UserId: number;
        ConversationId: number;
        IsTyping: boolean;
    }

    /// Game

    interface GameInstancePlayerThumbnail {
        AssetId: number;
        AssetTypeId: number;
        Url: string;
        IsFinal: boolean;
    }

    interface GameInstancePlayer {
        Id: number;
        Username: string;
        Thumbnail: GameInstancePlayerThumbnail;
    }

    interface GameInstance {
        Capacity: number;
        Ping: number;
        Fps: number;
        ShowSlowGameMessage: boolean;
        Guid: string;
        PlaceId: number;
        CurrentPlayers: GameInstancePlayer[];
        UserCanJoin: boolean;
        ShowShutdownButton: boolean;
        JoinScript: string;
        FriendsDescription: string;
        FriendsMouseover: string;
        PlayersCapacity: string;
    }

    interface GameInstances {
        PlaceId: number;
        ShowShutdownAllButton: boolean;
        Collection: GameInstance[];
        TotalCollectionSize: number;
    }

    interface GamePassResponse
    {
        gamePassId: number,
        name?: string,
        description?: string,
        price?: number,
        isForSale?: boolean,
        iconChanged?: boolean
    }

    interface PlaceInformation {
        AssetId: number;
        Name: string;
        Description: string;
        Created: Date;
        Updated: Date;
        FavoritedCount: number;
        Url: string;
        ReportAbuseAbsoluteUrl: string;
        IsFavoritedByUser: boolean;
        IsFavoritesUnavailable: boolean;
        UserCanManagePlace: boolean;
        VisitedCount: number,
        MaxPlayers: number,
        Builder: string,
        BuilderId: number,
        BuilderAbsoluteUrl: string
        IsPlayable: boolean,
        ReasonProhibited: string,
        ReasonProhibitedMessage: string,
        IsCopyingAllowed: boolean,
        PlayButtonType: string,
        AssetGenre: string,
        AssetGenreViewModel: { DisplayName: string, Id: number },
        OnlineCount: number,
        UniverseId: number,
        UniverseRootPlaceId: number,
        TotalUpVotes: number,
        TotalDownVotes: number,
        OverridesDefaultAvatar: boolean,
        UsePortraitMode: boolean,
        Price: number
    }

    interface DeveloperProduct {
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

    interface DeveloperProductsResult {
        DeveloperProducts: DeveloperProduct[],
        FinalPage: boolean,
        PageSize: number
    }

    interface DeveloperProductAddResult
    {
        universeId: number,
        name: string,
        priceInRobux: number,
        description?: string,
        productId: string
    }

    interface DeveloperProductUpdateResult
    {
        universeId: number,
        name: string,
        priceInRobux: number,
        description?: string,
        productId: number
    }

    interface CheckDeveloperProductNameResult
    {
        Success: boolean;
        /**
         * When success is true: "Name available"
         * When success is false, you can get: "Product name already exists"
         */
        Message: string;
    }

    /// Group

    type GroupIconSize = "150x150" | "420x420"
    type GroupIconFormat = "Png"

    interface Role
    {
        name: string;
        memberCount?: number;
        rank: number;
        id: number;
    }

    interface RoleWithDescription
    {
        name: string;
        memberCount?: number;
        rank: number;
        id: number;
        description: string;
    }

    interface GroupPostsPermissions
    {
        viewWall: boolean;
        postToWall: boolean;
        deleteFromWall: boolean;
        viewStatus: boolean;
        postToStatus: boolean;
    }

    interface GroupMembershipPermissions
    {
        changeRank: boolean;
        inviteMembers: boolean;
        removeMembers: boolean;
    }

    interface GroupManagementPermissions
    {
        manageRelationships: boolean;
        manageClan: boolean;
        viewAuditLogs: boolean;
    }

    interface GroupEconomyPermissions
    {
        spendGroupFunds: boolean;
        advertiseGroup: boolean;
        createItems: boolean;
        manageItems: boolean;
        addGroupPlaces: boolean;
        manageGroupGames: boolean;
        viewGroupPayouts: boolean;
    }

    interface RolePermissionsBody
    {
        groupPostsPermissions: GroupPostsPermissions;
        groupMembershipPermissions: GroupMembershipPermissions;
        groupManagementPermissions: GroupManagementPermissions;
        groupEconomyPermissions: GroupEconomyPermissions;
    }

    interface RolePermissions
    {
        groupId: number;
        role: RoleWithDescription;
        permissions: RolePermissionsBody
    }

    interface ChangeRankResult
    {
        newRole: Role;
        oldRole: Role;
    }

    interface Group
    {
        id: number;
        name: string;
        description: string;
        owner: GroupUser;
        shout: GroupShout;
        memberCount: number;
        isBuildersClubOnly: boolean;
        publicEntryAllowed: boolean;
        isLocked: boolean;
    }

    interface GroupView
    {
        __VIEWSTATE: string;
        __VIEWSTATEGENERATOR: string;
        __EVENTVALIDATION: string;
        __RequestVerificationToken: string;
    }

    interface GroupUser
    {
        userId: number;
        username: string;
        displayName: string;
        buildersClubMembershipType: "None" | "BC" | "TBC" | "OBC" | "RobloxPremium";
    }

    interface GroupShout
    {
        body: string;
        poster: GroupUser;
        created: string;
        updated: string;
    }

    interface AuditItemActor
    {
        user: GroupUser;
        role: Role;
    }

    interface AuditItem
    {
        actor: AuditItemActor;
        actionType: string;
        description: object;
        created: string;
    }

    interface AuditPage
    {
        data: AuditItem[];
        nextPageCursor?: string;
        previousPageCursor?: string;
    }

    interface TransactionAgent
    {
        id: number;
        type: string;
        name: string;
    }

    interface TransactionDetails
    {
        id: number;
        name: string;
        type: string;
    }

    interface TransactionCurrency
    {
        amount: number;
        type: string;
    }

    interface TransactionItem
    {
        created: Date;
        isPending: boolean;
        agent: TransactionAgent;
        details?: TransactionDetails;
        currency: TransactionCurrency;
    }

    interface TransactionPage
    {
        data: TransactionItem[];
        nextPageCursor?: string;
        previousPageCursor?: string;
    }

    interface GroupJoinRequester
    {
        userId: number;
        username: string;
        displayName: string;
    }

    interface GroupJoinRequest
    {
        requester: GroupJoinRequester;
        created: Date;
    }

    interface GroupJoinRequestsPage
    {
        previousPageCursor?: string;
        nextPageCursor?: string;
        data: GroupJoinRequest[];
    }

    interface WallPost
    {
        id: number;
        poster: GroupUser;
        body: string;
        created: string;
        updated: string;
    }

    interface WallPostPage
    {
        previousPageCursor?: string;
        nextPageCursor?: string;
        data: WallPost[];
    }

    /// Party

    interface PartyData
    {
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

    // https://noblox.js.org/thumbnailSizes.png | Archived: https://i.imgur.com/UwiKqjs.png
    type BodySizes = 30 | 48 | 60 | 75 | 100 | 110 | 140 | 150 | 180 | 250 | 352 | 420 | 720 | "30x30" | "48x48" | "60x60" | "75x75" | "100x100" | "110x110" | "140x140" | "150x150" | "150x200" | "180x180" | "250x250" | "352x352" | "420x420" | "720x720"
    type BustSizes = 50 | 60 | 75 | "50x50" | "60x60" | "75x75"
    type HeadshotSizes = 48 | 50 | 60 | 75 | 100 | 110 | 150 | 180 | 352 | 420 | 720 | "48x48" | "50x50" | "60x60" | "75x75" | "100x100" | "110x110" | "150x150" | "180x180" | "352x352" | "420x420" | "720x720";

    interface LoggedInUserData {
        UserID: number,
        UserName: string,
        RobuxBalance: number,
        TicketsBalance: number,
        ThumbnailUrl: string,
        IsAnyBuildersClubMember: boolean,
        IsPremium: boolean
    }

    interface UserLoginApiData {
        userId: number;
    }

    interface AvatarEntry {
        url: string;
        final: boolean;
    }

    interface UserStatus {
        online: boolean;
        lastSeen: Date;
    }

    interface FriendRequestEntry {
        description: string;
        created: string;
        isBanned: boolean;
        id: number;
        name: string;
        displayName: string;
    }

    interface FriendRequestsPage {
        previousPageCursor?: string;
        nextPageCursor?: string;
        data: FriendRequestEntry[];
    }

    interface FriendEntry {
        isOnline?: boolean;
        isDeleted: boolean;
        id: number;
        name: string;
        description: string;
        created: string;
    }

    interface Friends {
        friends: FriendEntry[];
    }

    interface FollowEntry {
        isDeleted: false;
        id: number;
        name: string;
        description: string;
        created: string;
    }

    interface FollowingsPage {
        previousPageCursor?: string;
        nextPageCursor?: string;
        data: FollowEntry[];
    }

    interface FollowersPage {
        previousPageCursor?: string;
        nextPageCursor?: string;
        data: FollowEntry[];
    }

    //

    interface PrivateMessagesPage {
        collection: PrivateMessage[];
        totalPages: number;
        totalCollectionSize: number;
        pageNumber: number;
    }

    //

    interface UserEntry {
        userId: number;
        name: string;
    }

    interface PrivateMessageParent {
        page: number;
    }

    interface PrivateMessage {
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

    interface NotificationMessage {
        type: string;
        [key: string]: any;
    }

    interface FriendRequest
    {
        userId: number;
    }

    interface UserPresence {
        userPresenceType?: UserPresenceType;
        lastLocation?: string;
        placeId?: number;
        rootPlaceId?: number;
        gameId?: string;
        universeId?: number;
        userId?: number;
        lastOnline?: string;
    }

    interface PlayerInfo {
        username: string;
        status?: string;
        blurb: string;
        joinDate: Date;
        age?: number;
        friendCount?: number;
        followerCount?: number;
        followingCount?: number;
        oldNames?: string[];
        isBanned: boolean;
    }
    interface Presences {
        userPresences: UserPresence[]
    }

    interface PlayerThumbnailData {
        targetId: number;
        state: "Completed" | "Pending" | "Blocked";
        imageUrl: string | null;
    }

    /// Badges

    interface BadgeAwarder {
        id: number;
        type: string;
    }

    interface UserBadgeStats {
        badgeId: number;
        awardedDate: Date;
    }

    interface BadgeStatistics {
        pastDayAwardedCount: number;
        awardedCount: number;
        winRatePercentage: number;
    }

    interface BadgeUniverse {
        id: number;
        name: string;
        rootPlaceId: number;
    }

    //
    interface PlayerBadges {
        id: number;
        name: string;
        description: string | null;
        displayName: string;
        displayDescription: string | null;
        enabled: boolean;
        iconImageId: number;
        displayIconImageId: number;
        awarder: BadgeAwarder;
        statistics: BadgeStatistics;
        created: Date;
        updated: Date;
    }
    //

    interface BadgeInfo {
        id: number;
        name: string;
        description: string | null;
        displayName: string;
        displayDescription: string | null;
        enabled: boolean;
        iconImageId: number;
        displayIconImageId: number;
        created: Date;
        updated: Date;
        statistics: BadgeStatistics
        awardingUniverse: BadgeUniverse
    }

    //Inventory

    interface AssetOwner
    {
        userId: number;
        username: string;
        buildersClubMembershipType: number;
    }

    interface CollectibleEntry {
        userAssetId: number;
        serialNumber?: number;
        assetId: number;
        name: string;
        recentAveragePrice: number;
        originalPrice?: number;
        assetStock?: number;
        buildersClubMembershipType: number;
    }
    //

    interface InventoryEntry {
        assetId: number;
        name: string;
        assetType: string;
        created: Date;
        updated?: Date;
        assetName?: string;
        userAssetId?: number;
        owner?: AssetOwner;
    }

    ///Trading

    interface UAIDResponse {
        uaids: number[],
        failedIds: number[]
    }

    interface CanTradeResponse {
        canTrade: boolean,
        status: string
    }

    interface TradeUser {
        userId: number;
        username: string;
        displayName: string;
    }

    interface TradeAsset {
        id: number,
        user: TradeUser,
        created: Date,
        expiration?: Date,
        isActive: boolean,
        status: string
    }

    interface DetailedTradeAsset {
        id: number,
        serialNumber: number,
        assetId: number,
        name: string,
        recentAveragePrice: number,
        originalPrice: number,
        assetStock: number,
        membershipType: string
    }

    interface DetailedTradeOffer {
        user: TradeUser,
        userAssets: DetailedTradeAsset[],
        robux: number
    }

    interface TradeOffer {
        userAssetIds: number[],
        robux: number
    }

    interface TradeInfo {
        offers: DetailedTradeOffer[],
        id: number,
        user: TradeUser,
        created: Date,
        expiration?: Date,
        isActive: boolean,
        status: string
    }

    interface SendTradeResponse {
        id: number
    }

    /// Utility

    type SelectorFunction = (selector: string) => {val(): any};
    type SortOrder = 'Asc' | 'Desc';
    type Limit = 10 | 25 | 50 | 100;

    interface Inputs
    {
        /**
         * With a provided name, this returns the input's value.
         */
        [name: string]: string;
    }

    interface GetVerificationResponse
    {
        body?: string;
        inputs: Inputs;
        header: string;
    }

    interface HttpOptions
    {
        verification?: string;
        jar?: CookieJar | null;
    }

    interface ThreadedPromise extends Promise<void>
    {
        getStatus(): number;
        getCompleted(): number;
        getExpected(): number;
    }

    interface GetLatestResponse
    {
        latest: number;
        data: object;
        repeat?: boolean;
    }


    // Functions

    /// Asset

    /**
     * Buys asset `asset` with `price` restrictions. This can be a single value or an object with `high` and `low` that sets the respective price limits (both inclusive). This allows you to buy assets with a minimum or maximum amount of robux that can be used or a single required value and therefore guarantees you can't be scammed by a sudden price change. If a price restriction is not set, the asset will be bought for however much it costs (works with free assets). You are able to use product instead of asset, the options in `product` are collected automatically if not provided.
     */
    function buy(asset: number | ProductInfo | BuyProductInfo, price?: number | PriceRange, jar?: CookieJar): Promise<BuyAssetResponse>;

    /**
     * Configures an item (shirt, pants, decal, etc.) with the id `id` to have `name` and `description`. If `enableComments` is true comments will be allowed and if `sellForRobux` is set it will be put on sale for that amount of robux.
     *
     * NOTE: Use `configureGamePass()` for Game Passes.
     */
    function configureItem(id: number, name: string, description: string, enableComments?: boolean, sellForRobux?: boolean, genreSelection?: number, jar?: CookieJar): Promise<void>;

    /**
     * Deletes an item from the logged in user's inventory
     */
    function deleteFromInventory(assetId: number, jar?: CookieJar): Promise<void>;

    /**
     * Uploads an image stored in `file` as an `assetType` with `name`. If `groupId` is specified it will be uploaded to that group. This is for uploading shirts, pants, or decals which have the assetTypes `11`, `12`, and `13`, respectively. Returns the asset `id` of the new item.
     */
    function uploadItem(name: string, assetType: UploadItemAssetType, file: string | stream.Stream, groupId?: number, jar?: CookieJar): Promise<UploadItemResponse>;

    /**
     * Uploads `data` to `asset` with `itemOptions`. If asset is empty a new asset will be created. Both the assetId as well as the assetVersionId are returned in a object. Note that `itemOptions` is required when creating a new asset. It is only optional when updating an old asset, which ignores `itemOptions` and only updates `data`.
     */
    function uploadModel(data: string | stream.Stream, itemOptions?: UploadModelItemOptions, asset?: number, jar?: CookieJar): Promise<UploadModelResponse>;

    /**
     * Gets `info` of `asset` and caches according to settings.
     */
    function getProductInfo(asset: number): Promise<ProductInfo>;

    /// Avatar

    function avatarRules(option?: "playerAvatarTypes" | "scales" | "wearableAssetTypes" | "bodyColorsPalette" | "basicBodyColorsPalette" | "minimumDeltaEBodyColorDifference" | "proportionsAndBodyTypeEnabledForUser" | "defaultClothingAssetLists" | "bundlesEnabledForUser" | "emotesEnabledForUser" | undefined, jar?: CookieJar): Promise<AvatarRules>;

    function avatarRules(option: "playerAvatarTypes", jar?: CookieJar): Promise<string[]>;
    function avatarRules(option: "scales", jar?: CookieJar): Promise<AvatarRulesScales>;
    function avatarRules(option: "wearableAssetTypes", jar?: CookieJar): Promise<WearableAssetType[]>;
    function avatarRules(option: "bodyColorsPalette", jar?: CookieJar): Promise<BodyColorModel[]>;
    function avatarRules(option: "basicBodyColorsPalette", jar?: CookieJar): Promise<BodyColorModel[]>;
    function avatarRules(option: "minimumDeltaEBodyColorDifference", jar?: CookieJar): Promise<number>;
    function avatarRules(option: "proportionsAndBodyTypeEnabledForUser", jar?: CookieJar): Promise<boolean>;
    function avatarRules(option: "defaultClothingAssetLists", jar?: CookieJar): Promise<DefaultClothingAssetLists>;
    function avatarRules(option: "bundlesEnabledForUser", jar?: CookieJar): Promise<boolean>;
    function avatarRules(option: "emotesEnabledForUser", jar?: CookieJar): Promise<boolean>;

    function currentlyWearing(userId: number): Promise<AssetIdList>;

    function getAvatar(userId: number): Promise<AvatarInfo>;

    function getCurrentAvatar(option?: "scales" | "playerAvatarType" | "bodyColors" | "assets" | "defaultShirtApplied" | "defaultPantsApplied" | undefined, jar?: CookieJar): Promise<AvatarInfo>;

    function getCurrentAvatar(option: "scales", jar?: CookieJar): Promise<AvatarScale>;
    function getCurrentAvatar(option: "playerAvatarType", jar?: CookieJar): Promise<PlayerAvatarType>;
    function getCurrentAvatar(option: "bodyColors", jar?: CookieJar): Promise<AvatarBodyColors>;
    function getCurrentAvatar(option: "assets", jar?: CookieJar): Promise<AvatarAsset[]>;
    function getCurrentAvatar(option: "defaultShirtApplied", jar?: CookieJar): Promise<boolean>;
    function getCurrentAvatar(option: "defaultPantsApplied", jar?: CookieJar): Promise<boolean>;

    function getRecentItems(listType?: RecentItemListType, jar?: CookieJar): Promise<AssetRecentItemsResult>;

    function outfitDetails(outfitId: number): Promise<AvatarOutfitDetails>;

    function outfits(userId: number, page?: number, itemsPerPage?: number): Promise<GetOutfitsResult>;

    function redrawAvatar(jar?: CookieJar): Promise<void>;

    function removeAssetId(assetId: number, jar?: CookieJar): Promise<void>;

    function setAvatarBodyColors(args: AvatarBodyColors & {jar?: CookieJar}): Promise<void>;

    function setAvatarScales(args: AvatarScale & {jar?: CookieJar}): Promise<void>;

    function setPlayerAvatarType(avatarType: PlayerAvatarType, jar?: CookieJar): Promise<void>;

    function setWearingAssets(assetIds: number[], jar?: CookieJar): Promise<void>;

    function wearAssetId(assetId: number, jar?: CookieJar): Promise<void>;

    /// Chat

    function addUsersToConversation(conversationId: number, userIds: number[], jar?: CookieJar): Promise<ConversationAddResponse>;

    function chatSettings(jar?: CookieJar): Promise<ChatSettings>;

    function getChatMessages(conversationId: number, pageSize?: number, exclusiveStartMessageId?: string, jar?: CookieJar): Promise<ChatMessage[]>;

    function getConversations(conversationIds: number[], jar?: CookieJar): Promise<ChatConversation[]>;

    function getRolloutSettings(featureNames?: ChatFeatureNames[], jar?: CookieJar): Promise<GetRolloutSettingsResult>;

    function getUnreadConversationCount(jar?: CookieJar): Promise<GetUnreadConversationCountResult>;

    function getUnreadMessages(conversationIds: number[], pageSize?: number, jar?: CookieJar): Promise<ChatConversationWithMessages[]>;

    function getUserConversations(pageNumber?: number, pageSize?: number, jar?: CookieJar): Promise<ChatConversation[]>;

    function markChatAsRead(conversationId: number, endMessageId: string): Promise<void>;

    function markChatAsSeen(conversationIds: number[], jar?: CookieJar): Promise<void>;

    function multiGetLatestMessages(conversationIds: number[], pageSize?: number, jar?: CookieJar): Promise<ChatConversationWithMessages[]>;

    function removeFromGroupConversation(conversationId: number, userId: number, jar?: CookieJar): Promise<ConversationRemoveResponse>;

    function renameGroupConversation(conversationId: number, title: string, jar?: CookieJar): Promise<ConversationRenameResponse>;

    function sendChatMessage(conversationId: number, message: string, jar?: CookieJar): Promise<SendChatResponse>;

    function setChatUserTyping(conversationId: number, isTyping: boolean, jar?: CookieJar): Promise<UpdateTypingResponse>;

    function start121Conversation(userId: number, jar?: CookieJar): Promise<void>;

    function startCloudEditConversation(placeId: number, jar?: CookieJar): Promise<void>;

    function startGroupConversation(userIds: number[], title: string, jar?: CookieJar): Promise<StartGroupConversationResponse>;

    /// Game

    /**
     * Returns data about the existing game instances (servers) of the specified place. You must have permission to view the game's server list to use this. (Must be logged in)
     * @param placeId The place whose game instances are being fetched.
     * @param startIndex The index to start from in regards to server list.
     */
    function getGameInstances(placeId: number, startIndex: number): Promise<GameInstances>;

    function getGameBadges(universeId: number, limit?: Limit, cursor?: string, sortOrder?: SortOrder): Promise<BadgeInfo>

    /**
     * Returns information about the place in question, such as description, name etc; varies based on whether or not you're logged in.
     * @param placeId The place whose information is being fetched.
     */
    function getPlaceInfo(placeId: number, jar?: CookieJar): Promise<PlaceInformation>;

    // You can create a developer product, but the productId returned does not match the actual developer product id needed by the endpoints.
    // It's strange, but the edit link on the product page has the id that Roblox wants so you can edit dev products.

    function addDeveloperProduct(universeId: number, name: string, priceInRobux: number, description?: string, jar?: CookieJar): Promise<DeveloperProductAddResult>;

    /**
     * Checks to see if the provided `produceName` is able to be used on `productId`.
     *
     * NOTE: You actually need a valid `productId` and `universeId` otherwise, the http request returns a `404 Not Found` response.
     */
    function checkDeveloperProductName(universeId: number, productName: string, jar?: CookieJar, productId?: number): Promise<CheckDeveloperProductNameResult>;

    /**
     * Returns the existing developer products in a specified game.
     * @param placeId The place whose developer products are being fetched.
     * @param page Which page of developer products to return (pageSize is 50)
     */
    function getDeveloperProducts(placeId: number, page: number, jar?: CookieJar): Promise<DeveloperProductsResult>;

    function updateDeveloperProduct(universeId: number, productId: number, name: string, priceInRobux: number, description?: string, jar?: CookieJar): Promise<DeveloperProductUpdateResult>;

    /**
     * Configures a game pass with the id `gamePassId` to have a `name`, `description`, `price` in Robux, and `icon` image. If `name` is an empty string, only `price` is changed. Setting `price` to false, 0, or a negative value will place the game pass off-sale.
     * Returns a `GamePassResponse` with the changed attributes.
     * 
     * NOTE: Updating `name` will affect `description`: you must repeat `description` with each `name` update, or `description` will be cleared.
     */
    
    function configureGamePass(gamePassId: number, name: string, description?: string, price?: number | boolean, icon?: string | stream.Stream, jar?: CookieJar): Promise<GamePassResponse>;

    /// Group

    /**
     * Moves the user with userId `target` up or down the list of ranks in `group` by `change`. For example `changeRank(group, target, 1)` would promote the user 1 rank and `changeRank(group, target, -1)` would demote them down 1. Note that this simply follows the list, ignoring ambiguous ranks. The full `newRole` as well as the user's original `oldRole` is returned.
     */
    function changeRank(group: number, target: number, change: number, jar?: CookieJar): Promise<ChangeRankResult>;

    /**
     * Deletes the wall post with `id` in `group`. If `page` is known it can be inserted to speed up finding the post, otherwise it will search for the post. Alternatively `post` can be passed in, which only has to contain `view` and `parent.index` to work properly. Using `post` will be much faster because it will not have to search for the post first.
     */
    function deleteWallPost(group: number, post: number | WallPost, page?: number, jar?: CookieJar): Promise<void>;

    /**
     * Alias of `changeRank(group, target, -1)`.
     */
    function demote(group: number, target: number, jar?: CookieJar): Promise<ChangeRankResult>;

    /**
     * Exiles user with `userId` target from `group`.
     */
    function exile(group: number, target: number, jar?: CookieJar): Promise<void>;

    /**
     * Performs a payout in group with the groupId `group`. If `recurring` is true this will configure the recurring options for the group's payout replacing all old values, otherwise a one-time-payout is made. To clear the recurring payouts, pass in empty arrays to both member and amount. Argument `member` can either be a single userId or an array of userIds. If it is a single value `amount` must be as well, otherwise `amount` has to be a parallel array of equal length. If `usePercentage` is true `amount` percentage of the total group funds is paid to the members, otherwise it pays `amount` ROBUX. Note that recurring payouts are always percentages, and when `recurring` is true `usePercentage` is ignored.
     */
    function groupPayout(group: number, member: number | number[], amount: number | number[], recurring?: boolean, usePercentage?: boolean, jar?: CookieJar): Promise<void>;

    /**
     * `Accepts user with `username` into `group`. Note that `username` is case-sensitive.
     */
    function handleJoinRequest(group: number, userId: string, accept: boolean, jar?: CookieJar): Promise<void>;

    /**
     * Leaves the group with id `group`. Unless `useCache` is enabled the function will not cache because errors will occur if joining or leaving the same group multiple times, you can enable it if you are only joining or leaving a group once or many differenct groups once.
     */
    function leaveGroup(group: number, jar?: CookieJar): Promise<void>;

    /**
     * Alias of `changeRank(group, target, 1)`.
     */
    function promote(group: number, target: number, jar?: CookieJar): Promise<ChangeRankResult>;

    /**
     * Changes the rank of the player with the `target` userId in group with `groupId` to the provided rank. If rank <= 255, it is assumes to be rank. If rank is a string, it is assumed to be the name of a rank/role. If rank is > 255, it is assumed to be a rolesetId (which speeds up requests). If two or more ranks share a rank, this will not resolve properly (use the name of the rank instead). You may also pass a Role which can be gotten from `getRoles` or `getRole`.
     */
    function setRank(group: number, target: number, rank: number | string | Role, jar?: CookieJar): Promise<Role>;

    /**
     * Shouts message `message` in the group with groupId `group`. Setting `message` to "" will clear the shout.
     */
    function shout(group: number, message: string, jar?: CookieJar): Promise<GroupShout>;

    /**
     * Gets the audit logs of the specified group.
     */
    function getAuditLog(group: number, actionType?: "" | "DeletePost" | "RemoveMember" | "AcceptJoinRequest" | "DeclineJoinRequest" | "PostStatus" | "ChangeRank" | "BuyAd" | "SendAllyRequest" | "CreateEnemy" | "AcceptAllyRequest" | "DeclineAllyRequest" | "DeleteAlly" | "DeleteEnemy" | "AddGroupPlace" | "RemoveGroupPlace" | "CreateItems" | "ConfigureItems" | "SpendGroupFunds" | "ChangeOwner" | "Delete" | "AdjustCurrencyAmounts" | "Abandon" | "Claim" | "Rename" | "ChangeDescription" | "InviteToClan" | "KickFromClan" | "CancelClanInvite" | "BuyClan" | "CreateGroupAsset" | "UpdateGroupAsset" | "ConfigureGroupAsset" | "RevertGroupAsset" | "CreateGroupDeveloperProduct" | "ConfigureGroupGame" | "Lock" | "Unlock" | "CreateGamePass" | "CreateBadge" | "ConfigureBadge" | "SavePlace" | "PublishPlace", userId?: number, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar ): Promise<AuditPage>;

    /**
     * Gets the transaction history of the specified group.
     */
    function getGroupTransactions(group: number, transactionType?: "Sale" | "Purchase" | "AffiliateSale" | "DevEx" | "GroupPayout" | "AdImpressionPayout", limit?: Limit, cursor?: string, jar?: CookieJar): Promise<TransactionPage>;

    /**
     * Gets a brief overview of the specified group.
     */
    function getGroup(groupId: number): Promise<Group>;

    /**
     * Gets the groups a player is in.
     */
    function getGroups(userId: number): Promise<IGroupPartial[]>

    /**
     * Gets the logo of the specified group.
     */
    function getLogo(groupId: number, size?: GroupIconSize, circular?: boolean, format?: GroupIconFormat): Promise<string>;

    /**
     * Gets the first page of join requests from `group`.
     */
    function getJoinRequests(group: number, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<GroupJoinRequestsPage>;

    /**
     * Gets all (or up to limit when provided and greater than 0) players in `group` with the number/array of `roleset`.
     */
    function getPlayers(group: number, rolesetId: number[] | number, sortOrder?: SortOrder, limit?: number, jar?: CookieJar): Promise<GroupUser[]>;

    /**
     * Gets `rank` of user with `userId` in `group` and caches according to settings.
     */
    function getRankInGroup(group: number, userId: number): Promise<number>;

    /**
     * Gets the rank `name` of user with `userId` in `group` and caches according to settings.
     */
    function getRankNameInGroup(group: number, userId: number): Promise<string>;

    /**
     * Returns role information of rank `rank`, which can be a single rank or an array of ranks. The `roles` object can be passed in directly from the `getRoles` function or the `group` id can be given to retrieve it automatically. If an array of ranks is inputted a parallel array of roles is returned. Alternatively, the name `name` of the role can be searched for, this should be used if there are "ambiguous roles" that have the same rank. If ambiguous roles cannot be resolved an error will be thrown. The actual roleset `id` may be used as well.
     */
    function getRole(group: number | Role[], roleQuery: number | string): Promise<Role>;

    /**
     * Returns the permissions a role has been assigned.
     */
    function getRolePermissions(group: number, rolesetId: number, jar?: CookieJar): Promise<RolePermissions>;

    /**
     * Returns role information of a group with groupId `group` in the form `[{"ID":number,"Name":"string","Rank":number},{"ID":number,"Name":"string","Rank":number}]`.
     */
    function getRoles(group: number): Promise<Role[]>;

    /**
     * Gets the current shout in `group`. If there is no shout the promise is fulfilled but nothing is returned.
     */
    function getShout(group: number, jar?: CookieJar): Promise<GroupShout>;

    /**
     * Gets posts on the `group` wall. Parameter `page` may be a number or array where negative numbers indicate trailing pages, if it is not specified all pages of the wall will be retrieved.
     * The body of the post is in `content` and the `id` and `name` of the poster are stored in the `author` object. The `id` is the unique ID of the wall post that is internally used by ROBLOX. This serves no real use other than reporting it (although it can be used indirectly to track down specific posts).
     * The `page` the post was found on and its `index` on that page are both in the `parent` object.
     * If `view` is true the viewstates of each page will be returned in the `views` object, with each page having its viewstates at the corresponding page number. For example page 5 of the wall will have its view stored in `wall.views[5]`.
     * The `getStatus` function is returned as a property of the promise and returns the percent completion of the operation.
     */
    function getWall(group: number, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<WallPostPage>;

    /// Party

    /// User

    /**
     * Accepts friend requests from `userId`.
     */
    function acceptFriendRequest(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * Blocks the user with `userId`.
     */
    function block(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * Allows the user to login with a provided cookie string, bypassing the username/password captcha issues.
     * By default, the provided cookie will be validated by making a HTTP request. To disable this behaviour, pass false as the second optional parameter (shouldValidate).
     */
    function setCookie<B extends boolean = true>(cookie: string, shouldValidate?: B): B extends false ? boolean : Promise<LoggedInUserData>

    /**
     * Declines friend requests from `userId`.
     */
    function declineFriendRequest(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * Declines all friend requests.
     */
    function declineAllFriendRequest(jar?: CookieJar): Promise<void>;

    /**
     * Follows the user with `userId`.
     */
    function follow(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * Logs into the user account with a provided `username` and `password`. On success -, stores the account cookie in `jar`.
     *
     * NOTE: Usage of this function is deprecated as of v4.6.0 and calling requires passing the robot test.
     */
    function login(username: string, password: string, jar?: CookieJar): Promise<UserLoginApiData>;

    /**
     * Sends a message with `body` and `subject` to the user with id `recipient`.
     */
    function message(recipient: number, subject: string, body: string, replyMessageId?: number, includePreviousMessage?: boolean, jar?: CookieJar): Promise<void>;

    /**
     * Removes friendship with `userId`.
     */
    function removeFriend(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * Sends a friend request to `userId`.
     */
    function sendFriendRequest(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * Unblocks the user with `userId`.
     */
    function unblock(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * Unfollows the user with `userId`.
     */
    function unfollow(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * Gets the `blurb` of the user with the ID `userId`.
     */
    function getBlurb(userId: number): Promise<string>;

    /**
     * Gets the pending friend requests of the logged in user.
     */
    function getFriendRequests(sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<FriendRequestsPage>;

    /**
     * Gets the friends list of the specified user.
     */
    function getFriends(userId: number, jar?: CookieJar): Promise<Friends>;

    /**
     * Get the followings of a user (users who have been followed by the specified person)
     */
    function getFollowings(userId: number, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<FollowingsPage>;

    /**
     * Get the followers of a user (users who follow the specified person)
     */
    function getFollowers(userId: number, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<FollowersPage>;

    /**
     * Get the groups a user is in.
     */
    function getGroups(userId: number): Promise<Group[]>;

    /**
     * Gets the transaction history of the logged in user or of the user specified by the jar.
     */
    function getUserTransactions(transactionType?: "Sale" | "Purchase" | "AffiliateSale" | "DevEx" | "GroupPayout" | "AdImpressionPayout", limit?: Limit, cursor?: string, jar?: CookieJar): Promise<TransactionPage>;


    /**
     * Gets the `id` of user with `username` and caches according to settings.
     * Username is not case-sensitive.
     */
    function getIdFromUsername(username: string): Promise<number>;

    /**
     * Gets the messages of the logged in user or of the user specified by the jar. Returns by newest to oldest messages.
     */
    function getMessages(pageNumber?: number, pageSize?: number, messageTab?: "Archive" | "Inbox" | "Sent", jar?: CookieJar): Promise<PrivateMessagesPage>;

    /**
     * Returns whether a user owns an asset or not
     */
    function getOwnership(userId: number, itemTargetId: number, itemType?: "Asset" | "GamePass" | "Badge" | "Bundle"): Promise<boolean>;

    /**
     * Gets the badges of a user.
     */
    function getPlayerBadges(userId: number, limit?: Limit, cursor?: string, sortOrder?: SortOrder): Promise<PlayerBadges>

    /**
     * Gets a brief overview of a user.
     */
    function getPlayerInfo(userId: number): Promise<PlayerInfo>;

    /**
     * Gets the thumbnail of an array of users.
     */
    function getPlayerThumbnail(userIds: number | number[], size: BodySizes | BustSizes | ThumbnailSizes, format?: "png" | "jpeg", isCircular?: boolean, cropType?: "body" | "bust" | "headshot"): Promise<PlayerThumbnailData[]>;

    /**
     * Gets the presence statuses of the specified users
     */
    function getPresences(userIds: number[]): Promise<Presences>;

    /**
     * Gets the `status` message of the user with the ID `userId`.
     */
    function getStatus(userId: number): Promise<string>;

    /**
     * Gets `username` of user with `id` and caches according to settings.
     */
    function getUsernameFromId(id: number): Promise<string>;


    /**
     * Get the collectibles of a user.
     */
    function getCollectibles(userId: number, assetType?: string, sortOrder?: SortOrder, limit?: number, jar?: CookieJar): Promise<CollectibleEntry[]>;

    /**
     * Get the UserAssetIDs for assets a user owns.
     */
    function getUAIDs(userId: number, assetIds: number[], exclusionList?: number[], jar?: CookieJar): Promise<UAIDResponse>;

    /**
     * Get the inventory of a user.
     */
    function getInventory(userId: number, assetTypes: Array<string>, sortOrder?: SortOrder, limit?: number, jar?: CookieJar): Promise<InventoryEntry[]>;

    /**
     * Get the inventory of a user by the assetTypeId.
     */
    function getInventoryById(userId: number, assetTypeId: number, sortOrder?: SortOrder, limit?: number, jar?: CookieJar): Promise<InventoryEntry[]>;

    ///Trades

    /**
     * Check if the current user can trade with another user.
     */
    function canTradeWith(userId: number, jar?: CookieJar): Promise<CanTradeResponse>;

    /**
     * Decline an active trade.
     */
    function declineTrade(tradeId: number, jar?: CookieJar): Promise<void>;
    
    /**
     * Accept an active trade.
     */
    function acceptTrade(tradeId: number, jar?: CookieJar): Promise<void>;

    /**
     * Get detailed info about a trade.
     */
    function getTradeInfo(tradeId: number, jar?: CookieJar): Promise<TradeInfo>;

    /**
     * Get all trades under a category.
     */
    function getTrades(tradeStatusType: string, sortOrder?: SortOrder, limit?: number, jar?: CookieJar): Promise<TradeAsset[]>;

    /**
     * Send a trade to a user.
     */
    function sendTrade(targetUserId: number, sendingOffer: TradeOffer, receivingOffer: TradeOffer, jar?: CookieJar): Promise<SendTradeResponse>;

    /**
     * Counter an active incoming trade..
     */
    function counterTrade(tradeId: number, targetUserId: number, sendingOffer: TradeOffer, receivingOffer: TradeOffer, jar?: CookieJar): Promise<SendTradeResponse>;


    /// Utility

    /**
     * Removes the `.ROBLOSECURITY` cookie from `jar`. Note that this does not return a new jar, it simply changes the existing one.
     */
    function clearSession(jar: CookieJar): Promise<string>;

    /**
     * Gets the verification inputs from `url` and sends a post request with data from `events`, returning the original body before the post request according to `getBody` and obeying the cache based on `ignoreCache`. Use `http` for custom request options for the post request; if url is contained, it will not replace the main url but the url used for getting verification tokens. This function is used for primitive site functions that involve ASP viewstates.
     */
    function generalRequest(url: string, events: object, http?: object, ignoreCache?: boolean, getBody?: boolean, jar?: CookieJar): Promise<Object>;

    /**
     * Gets the action row for audit log text. Current supported types are: change rank, delete post, and change group status (shouts).
     */
    function getAction(row: string): AuditItem;

    /**
     * Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option?: "UserID" | "UserName" | "RobuxBalance" | "TicketsBalance" | "ThumbnailUrl" | "IsAnyBuildersClubMember" | "IsPremium" | undefined, jar?: CookieJar): Promise<LoggedInUserData>;

    /**
     * Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "UserID", jar?: CookieJar): Promise<number>;

    /**
     * Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "UserName", jar?: CookieJar): Promise<string>;

    /**
     * Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "RobuxBalance", jar?: CookieJar): Promise<number>;

    /**
     * Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "TicketsBalance", jar?: CookieJar): Promise<number>;

    /**
     * Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "ThumbnailUrl", jar?: CookieJar): Promise<string>;

    /**
     * Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "IsAnyBuildersClubMember", jar?: CookieJar): Promise<boolean>;

    /**
     * Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "IsPremium", jar?: CookieJar): Promise<boolean>;

    /**
     * Gets the date for `time` which originates from a two-letter `timezone`. This is used to get the time for that timezone despite daylight savings. For example if you did `getDate(time, 'CT')` it would return the time in CST if daylight savings is inactive or CDT if it is active.
     */
    function getDate(time: string, timezone: string): Date;

    /**
     * Gets a general X-CSRF-TOKEN for APIs that don't return it after failure. This uses the https://api.roblox.com/sign-out/v1 API to get tokens.
     */
    function getGeneralToken(jar?: CookieJar): Promise<string>;

    /**
     * Generates a unique hash for the given jar file `jar` or default if none is specified. Typically used to cache items that depend on session.
     */
    function getHash(jar?: CookieJar): string;

    /**
     * Returns verification inputs on the page with the names in `find` - or all inputs if not provided. Typically used for ROBLOX requests working with ASP.NET.
     */
    function getInputs(html: string, find?: Array<any>): Inputs;

    /**
     * Returns the results from indexing the requested pages.
     */
    function getPageResults(url: string, query: string, sortOrder?: string): Array<any>;

    /**
     * Gets the user ID of the current logged in user and caches it permanently. This is needed for some functions.
     */
    function getSenderUserId(jar?: CookieJar): Promise<number>;

    /**
     * Gets the `.ROBLOSECURITY` session cookie from `jar`, which is the default jar file if not specified.
     */
    function getSession(jar?: CookieJar): Promise<string>;

    /**
     * Gets verification inputs off of `url` using `jar` and caches them. If `getBody` is true, the body and inputs will both be returned in an object. The `header` is the value of the `__RequestVerificationToken` cookie if it exists. If `ignoreCache` is enabled, the resulting tokens will not be cached.
     */
    function getVerification(url: string, ignoreCache?: boolean, getBody?: boolean, jar?: CookieJar): Promise<GetVerificationResponse>;

    /**
     * Gets verification inputs from `html`. Short for `getInputs(html,['__VIEWSTATE','__VIEWSTATEGENERATOR','__EVENTVALIDATION, '__RequestVerificationToken']')`. Typically used for ROBLOX requests working with ASP.NET. If you have already loaded html with a parser you can pass the `selector` directly.
     */
    function getVerificationInputs(html: string | SelectorFunction): Inputs;

    /**
     * Sends an http request to `url` with `options`. If `ignoreLoginError` is true the function will not error when the user is redirected to the ROBLOX login page, otherwise it will as detection for failed logins and preventing further errors. The custom option `verification` adds the token to the cookies as `__RequestVerificationToken`. *Note that if jar is a key in the options object but is still null, the default jar will be used*
     */
    function http(url: string, options?: HttpOptions, ignoreLoginError?: boolean): Promise<string>;

    /**
     * Creates a jar file based on `sessionOnly`. Normally you will not need this argument as the function will use the default from settings.json. If for some other reason you need a jar file you can collect it this way, but without changing the settings it will not work.
     */
    function jar(sessionOnly?: boolean): CookieJar;

    /**
     * Refreshes the internally stored cookie, or the cookie provided, stores the new cookie and returns it.
     */
    function refreshCookie(cookie?: string): Promise<string>;

    /**
     * This is the base for events that do not rely on true streams. The `getLatest` function receives some value that represents the latest version of something (eg. a date or unique ID) and determines if there is new information, every time it is fired it waits `delay` ms before being fired again. Every time it must return an object with the field `latest`, representing the latest value (which will not change if new information was not received), and an array `data` which has the new values (if there are multiple they each have their own index, if there is only one then it is by itself in the array). If `latest` is equal to -2, the returned data will be processed even if it is the initial run (which usually only establishes the latest value). If the return object has a true `repeat` value, the function latest will be run again immediately after. If `delay` is a string it will take the number from that string key in the `event` object of the settings.json file.
     * When the function is first called it will initialize `getLatest` with the value -1 and then emit the `connect` event. Whenever data is received, it will emit the `data` event for each value. If the `close` event is emitted the function will no longer run. If an error occurs the `error` event will be emitted, the function will log a retry and after the number of max retries as specified by settings, it will emit the `close` event.
     * The `getLatest` function will be marked as failed if it does not resolve within `timeout` ms (which can be disabled if timeout is negative). If getLatest fails for any reason (including timeout) it will be retried `maxRetries` times before stopping.
     */
    function shortPoll(getLatest: (latest: number, event: events.EventEmitter) => Promise<GetLatestResponse>, delay: string | number, timeout?: number): events.EventEmitter;

    /**
     * Will run `getPage` (which should return a promise) for every number starting from `start` and ending at `end - 1`. At any one time only `maxThreads` number will be running. This for functions that require a large number of requests but actually makes it practical to use them because it doesn't prepare all the requests at once, taking up all available memory.
     * Errors will not stop the thread from running, instead the request will be tried 3 times after with 5 seconds between each retry. If it still does not succeed it will be skipped and a warning will be printed but will still not end threaded.
     * Returns a promise with the additional function properties `getStatus`, `getCompleted`, `getExpected` which represent the percent completion, the current number of completed threads, and the total number of threads for completion.
     */
    function threaded(getPage: (pageNum: number) => Promise<void> | void, start: number, end: number): ThreadedPromise;

    // Events

    /// Asset

    /// Avatar

    /// Chat

    interface OnNewConversationEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (conversationId: number) => void): this;
    }

    interface OnNewMessageEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (conversationId: number) => void): this;
    }

    interface OnNewMessageBySelfEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (conversationId: number) => void): this;
    }

    interface OnUserOnlineEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (userId: number) => void): this;
    }

    interface OnUserTypingEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (typingEvent: OnUserTypingChatEvent) => void): this;
    }

    /// Game

    /// Group

    interface OnJoinRequestHandleEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (joinRequest: GroupJoinRequest) => void): this;

        emit(event: 'handle', joinRequest: GroupJoinRequest, accept: boolean, callback?: () => void): boolean;
    }

    interface OnShoutEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (shout: GroupShout) => void): this;
    }

    interface OnAuditLogEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (auditLog: AuditItem) => void): this;
    }

    /// Party

    interface OnPartyNotificationEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (partyInfo: PartyData) => void): this;
    }

    /// User

    interface OnFriendRequestEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (message: FriendRequest) => void): this;
    }

    interface OnMessageEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (message: PrivateMessage) => void): this;
    }

    interface OnNotificationEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (name: string, message: NotificationMessage) => void): this;
    }

    interface OnWallPostEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (message: WallPost) => void): this;
    }

    // Event Emitter Accessors

    /// Asset

    /// Avatar

    /// Chat

    function onNewConversation(jar?: CookieJar): OnNewConversationEventEmitter;

    function onNewMessage(jar?: CookieJar): OnNewMessageEventEmitter;

    function onNewMessageBySelf(jar?: CookieJar): OnNewMessageBySelfEventEmitter;

    function onUserOnline(jar?: CookieJar): OnUserOnlineEventEmitter;

    function onUserTyping(jar?: CookieJar): OnUserTypingChatEvent;

    /// Game

    /// Group

    /**
     * This function emits all join requests and waits until all of them have been resolved by firing the `handle` event with the request and either true or false. You can also pass a third argument `callback` to handle to execute once the join request has been handled. Once all requests on a page have been resolved, the next page is collected. Make sure that all join requests are handled in some way. Because this function has to wait for input, it does handle timeouts but does them within the function as opposed to within shortPoll.
     *
     * To accept all new users that aren't on a blacklist and send them a message, for example:
     * ```javascript
     * const blacklist = [1, 261]
     * const evt = rbx.onJoinRequestHandle(18)
     * evt.on('data', function (request) {
     *   rbx.getIdFromUsername(request.username).then(function (id) {
     *     for (const i = 0; i < blacklist.length; i++) {
     *       if (blacklist[i] === id) {
     *         evt.emit('handle', request, false);
     *         return;
     *       }
     *     }
     *     evt.emit('handle', request, true, function () {
     *       rbx.message(id, 'Welcome', 'Welcome to my group');
     *     });
     *   });
     * });
     * ```
     */
    function onJoinRequestHandle(group: number, jar?: CookieJar): OnJoinRequestHandleEventEmitter;

    /**
     * Fires when there is a shout in the group with groupId `group`. If the shout was cleared the shout body will be blank.
     */
    function onShout(group: number, jar?: CookieJar): OnShoutEventEmitter;

    function onAuditLog(group: number, jar?: CookieJar): OnAuditLogEventEmitter;

    /**
     * Fires when there is a new wall post in the group with groupId `group`. If `view` is enabled the wall posts viewstate will be returned in `view`, otherwise it will not be present.
     */
    function onWallPost(group: number, view?: boolean, jar?: CookieJar): OnWallPostEventEmitter;

    /// Party

    // Seems like Party specific events are no longer supported.
    // Still adding them as a function you can use.

    function onPartyDeleted(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartyInvite(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartyJoinedGame(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartyLeftGame(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartySelfJoined(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartySelfLeft(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartyUserJoined(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartyUserLeft(jar?: CookieJar): OnPartyNotificationEventEmitter;

    /// User

    /**
     * Fires when new friend requests are received.
     */
    function onFriendRequest(jar?: CookieJar): OnFriendRequestEventEmitter;

    /**
     * Fires whenever a new message is received. Because it relies on `onNotification`, the logged in user's notification stream for messages must be enabled; however, it is one of the true events and does not rely on short polling.
     */
    function onMessage(jar?: CookieJar): OnMessageEventEmitter;

    /**
     * This is one of the only true streams, using web sockets to connect to ROBLOX's notification system. The logged in user must have relevant notifications enabled in their settings in order to receive notifications through this (of course). All notifications haven't been mapped out but what is known is that they all have a `name` and `message` (separate arguments to the `data` event), where `message` is an object that includes a field `type`.
     */
    function onNotification(jar?: CookieJar): OnNotificationEventEmitter;


    /// Badges

    /**
     * Gets information about a badge.
     */
    function getBadgeInfo(badgeId: number): Promise<BadgeInfo>

    /**
     * Gets user award date for a badge.
     */
    function getAwardedTimestamps(userId: number, badgeId: number[]): Promise<UserBadgeStats>

    /**
     * Updates badge information.
     */
    function updateBadgeInfo(badgeId: number, name?: string, description?: string, enabled?: boolean, jar?: CookieJar): Promise<void>
}
