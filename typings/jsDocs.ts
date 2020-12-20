// types/Types
import * as events from "events";
import * as stream from "stream";

/**
 * @typedef
*/
type CookieJar =
{
    session?: string;
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
}

/**
 * @typedef
*/
type ProductInfo = {
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

/**
 * @typedef
*/
type BuyProductInfo = {
    ProductId: number;
    Creator: {Id: number};
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
    defaultShirtAssetIds: number[];
    defaultPantAssetIds: number[];
}

/**
 * @typedef
*/
type AvatarRules = {
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

/**
 * @typedef
*/
type AssetIdList = {
    assetIds: number[];
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
    assets: AvatarAsset[];
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
    data: AssetRecentItem[];
    total: number;
}

/**
 * @typedef
*/
type AvatarOutfitDetails = {
    id: number;
    name: string;
    assets: AvatarAsset[];
    bodyColors: AvatarBodyColors[];
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
    data: AvatarOutfit[];
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
    conversationId: Number;
    rejectedParticipants: RejectedParticipant[];
    resultType: string;
    statusMessage: string;
}

/**
 * @typedef
*/
type ConversationRemoveResponse = {
    conversationId: Number;
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
    filteredForRecievers: boolean;
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
    rejectedParticipants: RejectedParticipant[];
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
    decorators: string[];
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
    participants: ChatParticipant[];
    conversationType: "OneToOneConversation" | "MultiUserConversation" | "CloudEditConversation";
    conversationTitle: ChatConversationTitle;
    lastUpdated: string;
    conversationUniverse: ChatConversationUniverse;
}

/**
 * @typedef
*/
type ChatParticipant = {
    type: "User" | "System";
    targetId: number;
    name: string;
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
    rolloutFeatures: ChatRolloutFeature[];
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
    chatMessages: ChatMessage[];
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
type GameInstancePlayerThumbnail = {
    AssetId: number;
    AssetTypeId: number;
    Url: string;
    IsFinal: boolean;
}

/**
 * @typedef
*/
type GameInstancePlayer = {
    Id: number;
    Username: string;
    Thumbnail: GameInstancePlayerThumbnail;
}

/**
 * @typedef
*/
type GameInstance = {
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

/**
 * @typedef
*/
type GameInstances = {
    PlaceId: number;
    ShowShutdownAllButton: boolean;
    Collection: GameInstance[];
    TotalCollectionSize: number;
}

/**
 * @typedef
*/
type PlaceInformation = {
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
type DeveloperProductUpdateResult = {
    universeId: number,
    name: string,
    priceInRobux: number,
    description?: string,
    productId: number
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
    shout: GroupShout;
    memberCount: number;
    isBuildersClubOnly: boolean;
    publicEntryAllowed: boolean;
    isLocked: boolean;
}

/**
 * @typedef
 */
type IGroupPartial = {
    Name: string;
    Id: number;
    EmblemUrl: string;
    EmblemId: number;
    Rank: number;
    Role: string;
    IsPrimary: boolean;
    IsInClan: boolean;
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
    buildersClubMembershipType: "None" | "BC" | "TBC" | "OBC" | "RobloxPremium";
}

/**
 * @typedef
*/
type GroupShout = {
    body: string;
    poster: GroupUser;
    created: string;
    updated: string;
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
    created: string;
}

/**
 * @typedef
*/
type AuditPage = {
    data: AuditItem[];
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
    created: Date;
    isPending: boolean;
    agent: TransactionAgent;
    details?: TransactionDetails;
    currency: TransactionCurrency;
}

/**
 * @typedef
*/
type TransactionPage = {
    data: TransactionItem[];
    nextPageCursor?: string;
    previousPageCursor?: string;
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
    data: GroupJoinRequest[];
}

/**
 * @typedef
*/
type WallPost = {
    id: number;
    poster: GroupUser;
    body: string;
    created: string;
    updated: string;
}

/**
 * @typedef
*/
type WallPostPage = {
    previousPageCursor?: string;
    nextPageCursor?: string;
    data: WallPost[];
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
    TicketsBalance: number,
    ThumbnailUrl: string,
    IsAnyBuildersClubMember: boolean,
    IsPremium: boolean
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
    created: string;
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
    data: FriendRequestEntry[];
}

/**
 * @typedef
*/
type FriendEntry = {
    isOnline?: boolean;
    isDeleted: boolean;
    id: number;
    name: string;
    description: string;
    created: string;
}

/**
 * @typedef
*/
type Friends = {
    friends: FriendEntry[];
}

/**
 * @typedef
*/
type FollowEntry = {
    isDeleted: false;
    id: number;
    name: string;
    description: string;
    created: string;
}

/**
 * @typedef
*/
type FollowingsPage = {
    previousPageCursor?: string;
    nextPageCursor?: string;
    data: FollowEntry[];
}

/**
 * @typedef
*/
type FollowersPage = {
    previousPageCursor?: string;
    nextPageCursor?: string;
    data: FollowEntry[];
}

//

/**
 * @typedef
*/
type PrivateMessagesPage = {
    collection: PrivateMessage[];
    totalPages: number;
    totalCollectionSize: number;
    pageNumber: number;
}

//

/**
 * @typedef
*/
type UserEntry = {
    userId: number;
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
type FriendRequest = {
    userId: number;
}

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
    status: string;
    blurb: string;
    joinDate: Date;
    age: number;
    oldNames: string[];
}
type Presences = {
    userPresences: UserPresence[]
}

/**
 * @typedef
*/
type playerThumbnailData = {
    targetId: number;
    state: string;
    imageUrl: string;
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

//
type PlayerBadges = {
    id: number;
    name: string;
    description: string|null;
    displayName: string;
    displayDescription: string|null;
    enabled: boolean;
    iconImageId: number;
    displayIconImageId: number;
    awarder: BadgeAwarder;
    statistics: BadgeStatistics;
    created: Date;
    updated: Date;
}
//

/**
 * @typedef
*/
type BadgeInfo = {
    id: number;
    name: string;
    description: string|null;
    displayName: string;
    displayDescription: string|null;
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
    collectibles: CollectibleEntry[];
}
//

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
    items: InventoryEntry[];
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
    jar?: CookieJar | null;
}

/**
 * @typedef
*/
type GetLatestResponse = {
    latest: number;
    data: object;
    repeat?: boolean;
}
