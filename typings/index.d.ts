// Type definitions for noblox.js@4.2.6
// Authored by Gamenew09

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

    /// Game

    /// Group

    interface Role
    {
        name: string;
        memberCount?: number;
        rank: number;
        ID: number;
    }

    interface ChangeRankResult
    {
        newRole: Role;
        oldRole: Role;
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
        buildersClubMembershipType: "None" | "BC" | "TBC" | "OBC" | "RobloxPremium";
    }

    interface GroupShout
    {
        body: string;
        poster: GroupUser;
        created: string;
        updated: string;
    }

    interface AuditItemUser
    {
        name: string;
        id: number;
        role: string;
    }

    interface AuditItemAction
    {
        target: number;
        params: Array<any>;
    }

    interface AuditItemParent
    {
        page: number;
        index: number;
    }

    interface AuditItem
    {
        user: AuditItemUser;
        text: string;
        action: AuditItemAction;
        date: Date;
        parent: AuditItemParent;
    }

    interface AuditPage
    {
        logs: AuditItem[];
        totalPages: number;
        total: number;
    }

    interface GroupJoinRequest
    {
        username: string;
        date: Date;
        requestId: number;
    }

    interface GroupHandleJoinRequest
    {
        name: string;
        date: Date;
        requestId: number;
    }

    interface WallPostAuthor
    {
        id: number;
        name: number;
    }

    interface WallPostParent
    {
        page: number;
        index: number;
    }

    interface WallPost
    {
        content: string;
        author: WallPostAuthor;
        date: Date;
        parent: WallPostParent;
        id: number;
        view?: GroupView;
    }

    interface WallPostPage
    {
        posts: WallPost[];
        totalPages: number;
        views?: {
            page: number;
            view: GroupView;   
        }[];
    }

    /// Party

    /// User

    /**
     * 0 = Inbox
     * 1 = Sent Messages
     * 3 = Archived Messages
     */
    type PrivateMessageTab = 0 | 1 | 3;

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

    interface FriendParent {
        page: number;
        index: number;
        fullIndex: number;
    }

    interface FriendEntry {
        user: UserEntry;
        avatar: AvatarEntry;
        status: UserStatus;
        parent: FriendParent;
        inGame: boolean;
        inStudio: boolean;
        following: boolean;
        deleted: boolean;
    }

    interface FriendsPage {
        friends: FriendEntry[];
        totalPages: number;
        total: number;
    }

    //

    interface PrivateMessagesPage {
        messages: PrivateMessage[];
        totalPages: number;
        total: number;
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
        sender: UserEntry;
        subject: string;
        body: string;
        created: Date;
        updated: Date;
        read: boolean;
        parent: PrivateMessageParent;
        id: number;
    }

    interface NotificationMessage {
        type: string;
        [key: string]: any;
    }

    interface FriendRequest
    {
        userId: number;
    }

    /// Utility

    type SelectorFunction = (selector: string) => {val(): any};

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
     */
    function configureItem(id: number, name: string, description: string, enableComments?: boolean, sellForRobux?: boolean, genreSelection?: number, jar?: CookieJar): Promise<void>;

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

    function setAvatarBodyColours(args: AvatarBodyColors & {jar?: CookieJar}): Promise<void>;

    function setAvatarScales(args: AvatarScale & {jar?: CookieJar}): Promise<void>;

    function setPlayerAvatarType(avatarType: PlayerAvatarType, jar?: CookieJar): Promise<void>;

    function setWearingAssets(assetIds: number[], jar?: CookieJar): Promise<void>;

    function wearAssetId(assetId: number, jar?: CookieJar): Promise<void>;

    /// Chat

    /// Game

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
    function groupPayout(group: number, members: number | number[], amount: number | number[], recurring?: boolean, usePercentage?: boolean, jar?: CookieJar): Promise<void>;

    /**
     * `Accept`s user with `username` into `group`. Note that `username` is case-sensitive.
     */
    function handleJoinRequest(group: number, username: string, accept: boolean, jar?: CookieJar): Promise<void>;

    /**
     * Raw utility for handling join requests based on their unique `requestId`. If `accept` is true the user is accepted into `group`, otherwise they are denied.
     */
    function handleJoinRequestId(group: number, requestId: number, accept: boolean, jar?: CookieJar): Promise<void>;

    /**
     * Joins the group with id `group`. Unless `useCache` is enabled the function will not cache because errors will occur if joining or leaving the same group multiple times, you can enable it if you are only joining or leaving a group once or many differenct groups once.
     */
    function joinGroup(group: number, useCache?: boolean, jar?: CookieJar): Promise<void>;

    /**
     * Leaves the group with id `group`. Unless `useCache` is enabled the function will not cache because errors will occur if joining or leaving the same group multiple times, you can enable it if you are only joining or leaving a group once or many differenct groups once.
     */
    function leaveGroup(group: number, jar?: CookieJar): Promise<void>;

    /**
     * Posts message `message` on the group wall with groupId `group`.
     */
    function post(group: number, message: string, jar?: CookieJar): Promise<void>;

    /**
     * Alias of `changeRank(group, target, 1)`.
     */
    function promote(group: number, target: number, jar?: CookieJar): Promise<ChangeRankResult>;

    /**
     * Promotes player with userId `target` in group with groupId `group` to rank `rank`, roleset `roleset`, or name `name`. One is required but not all, use `roleset` to speed up requests and `name` if there are ambiguous ranks (same rank number). If a rank or name was passed the corresponding role will be returned.
     */
    function setRank(group: number, target: number, rank: number | string, jar?: CookieJar): Promise<Role>;

    /**
     * Shouts message `message` in the group with groupId `group`. Setting `message` to "" will clear the shout.
     */
    function shout(group: number, message: string, jar?: CookieJar): Promise<GroupShout>;

    /**
     * Gets audit log entries in `group` for the specified `action` or `username` where `action` is the actionTypeId. To find the actionTypeId for the action you want, go to the audit log and check the URL when you select a specific action. If `username` selected only entries from that user are searched for. To specify what page(s) to retrieve use `page`, which is a number or array of numbers. Negative numbers are allowed and instruct the function to return the trailing pages of the log.
     * Each row has an `action` object which contains the ID of the target and any parameters it gets. Currently this will be populated with change rank, shout, and delete post logs. The `target` is the ID of the user or game the action was targeted to. Sometimes there is no target and this will equal the user ID of the user who did the action. Params are in the order that they appear on the log.
     * For example, if you have a log with text: `Froast changed user ROBLOX's rank from [L1] Initiate to [L2] Novice.` then
     * ```javascript
     * log.action.params[0] == '[L1] Initiate'
     * log.action.params[1] == '[L2] Novice'
     * log.action.target == 1 // (ROBLOX's user ID)
     * ```
     * Not all log types are supported, if the log you want isn't added you will have to get the parameters yourself by using the full `text` of the log.
     * The `stream` argument can be a writable stream in order to handle logs without taking up a ton of RAM. Each log is individually written to the stream. The `audit` object will still be fulfilled with the promise at the end but the `logs` array will be empty.
     * Logs are sorted from most newest to oldest.
     */
    function getAuditLog(group: number, page?: number | number[], action?: number, username?: string, stream?: stream.Stream, jar?: CookieJar): Promise<AuditPage>;

    /**
     * Gets the first page of join requests from `group`.
     */
    function getJoinRequests(group: number, jar?: CookieJar): Promise<GroupJoinRequest[]>;

    /**
     * Gets all players in `group` with the array `roleset`
     */
    function getPlayers(group: number, roleset: number[], jar?: CookieJar): Promise<GroupUser[]>;

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
    function getRole(group: number | Role[], rank: number | number[] | string | string[]): Promise<Role>;

    /**
     * Returns role information of a group with groupId `group` in the form `[{"ID":number,"Name":"string","Rank":number},{"ID":number,"Name":"string","Rank":number}]`.
     */
    function getRoles(group: number): Promise<Role[]>;

    /**
     * Gets the `roleset` of the logged in user in `group`.
     */
    function getRolesetInGroupWithJar(group: number, jar?: CookieJar): Promise<number>;

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
     * If `stream` is specified `post` objects will be written to the stream and will _not_ be added to the wall object. The stream can process posts as they are retrieved but for the most part should be written to a file for post processing. This should be used for extremely large walls, as when javascript arrays reach a certain point it slows down considerably and will begin running into a lot of errors. Note that if `stream` is specified the entries will _not_ be returned in order because there is no chance for the script to sort them. Page numbers and indexes, however, are always returned with the post, allowing the data to be sorted later. The `wall` object will still be fulfilled with the promise at the end but the `posts` array will be empty.
     */
    function getWall(group: number, page?: number, stream?: stream.Stream, view?: boolean, jar?: CookieJar): Promise<WallPostPage>;

    /**
     * Gets the post with `id`. If `view` is true `view` information will be returned, which can be used to do actions on the post. If `page` is known it can be given to speed up the request, otherwise it will be found automatically using a binary search.
     */
    function getWallPost(group: number, id: number, page?: number, view?: boolean, jar?: CookieJar): Promise<WallPost>;

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
     * Allows user to login with a cookie.json, bypassing the username/password captcha issues.
     */
    function cookieLogin(cookie: string): Promise<LoggedInUserData>;

    /**
     * Declines friend requests from `userId`.
     */
    function declineFriendRequest(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * Follows the user with `userId`.
     */
    function follow(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * Logs into `username` with `password` and stores their cookie in `jar`.
     * 
     * NOTE: Calling login requires passing the robot test.
     */
    function login(username: string, password: string, jar?: CookieJar): Promise<UserLoginApiData>;

    /**
     * Sends a message with `body` and `subject` to the user with id `recipient`.
     */
    function message(recipient: number, subject: string, body: string, jar?: CookieJar): Promise<void>;

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
     * Gets the friend list of `userId` where type is `AllFriends`, `Following`, `Followers`, or `FriendRequests`. The `page` parameter can be a number or array of numbers specifying what pages to get. *Note that pages are in groups of 200 friends.* If you need to be more precise use limit. As usual `page` can be negative to specify trailing pages. If `limit` is specified a maximum of that many friends are retrieved.
     * You do not have to be logged in to get friends however if you want to get friend requests you have to and if you want to see what games your friends are in you may have to be logged in as the permission is often limited to friends.
     * Friends are returned in the order they appear on the normal list.
     * 
     * NOTE from TypeScript type author: It seems only `AllFriends` works, everything else seems to error.
     */
    function getFriends(userId: number, type: 'AllFriends' | 'Following' | 'Followers' | 'FriendRequests', page?: number | number[], limit?: number, jar?: CookieJar): Promise<FriendsPage>;

    /**
     * Gets the `id` of user with `username` and caches according to settings.
     * Username is not case-sensitive.
     */
    function getIdFromUsername(username: string): Promise<number>;

    /**
     * Gets messages in the inbox of player with `jar`. If `page` does not exist the entire inbox will be indexed, otherwise it will only do the specific page or a specific number of pages in an array. Similar to getForumPost, negative numbers can be used to get pages of the inbox starting from the end. Note that even though ROBLOX internally begins pages at 0, if you pass a page into this function it will automatically be adjusted. So the first page of the inbox is page 1 and not page 0.
     * If `limit` is defined that is the maximum number of messages that will be returned. Regardless of how many pages are specified, the function will automatically cut down request sizes to meet it. For example, if you do not specify a page number but enter in a limit of 30, the function will only get the first page and half of the second page (each page has 20 messages).
     * The `tab` option specifies which part of messages to index where 0 is the inbox, 1 is sent messages, and 3 is archived messages.
     * An object is returned with the thread's posts in the posts array, they are in order from newest to oldest.
     */
    function getMessages(page?: number, limit?: number, tab?: PrivateMessageTab, jar?: CookieJar): Promise<PrivateMessagesPage>;

    /**
     * Gets the `status` message of the user with the ID `userId`.
     */
    function getStatus(userId: number): Promise<string>;

    /**
     * Gets `username` of user with `id` and caches according to settings.
     */
    function getUsernameFromId(id: number): Promise<string>;

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
    function getAction(row: string): AuditItemAction;

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
     * Processes some forum-related 302 error and returns a corresponding message. The argument `append` is optional and describes the calling function.
     * @deprecated The Roblox Forums no longer exist.
     */
    function getForumError(location: string, append?: string): Error;

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

    /// Game

    /// Group

    interface OnJoinRequestHandleEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (joinRequest: GroupHandleJoinRequest) => void): this;

        emit(event: 'handle', joinRequest: GroupHandleJoinRequest, accept: boolean, callback?: () => void): boolean;
    }

    interface OnShoutEventEmitter extends events.EventEmitter
    {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (shout: GroupShout) => void): this;
    }

    /// Party

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

    /// Game

    /// Group

    /**
     * This function emits all join requests and waits until all of them have been resolved by firing the `handle` event with the request and either true or false. You can also pass a third argument `callback` to handle to execute once the join request has been handled. Once all requests on a page have been resolved, the next page is collected. Make sure that all join requests are handled in some way. Because this function has to wait for input, it does handle timeouts but does them within the function as opposed to within shortPoll.
     * 
     * To accept all new users that aren't on a blacklist and send them a message, for example:
     * ```javascript
     * var blacklist = [1, 261]
     * var evt = rbx.onJoinRequestHandle(18)
     * evt.on('data', function (request) {
     *   rbx.getIdFromUsername(request.username).then(function (id) {
     *     for (var i = 0; i < blacklist.length; i++) {
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

    /**
     * Fires when there is a new wall post in the group with groupId `group`. If `view` is enabled the wall posts viewstate will be returned in `view`, otherwise it will not be present.
     */
    function onWallPost(group: number, view?: boolean, jar?: CookieJar): OnWallPostEventEmitter;

    /// Party

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
}