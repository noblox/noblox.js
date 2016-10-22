# roblox-js
## About

Roblox-js is a node module that provides an interface for  [roblox](http://www.roblox.com) site actions, mostly for use with their HttpService feature.

Most functions are related to group service but there are other general functions as well. The list of main functions is in the contents section, they all have detailed documentation.

Many of the functions use simple caches in order to server requests faster. Cache time can be changed in settings.json. Cached items include XCSRF tokens and group roles: unless you change your group roles often the default cache settings should be fine. The cache works by saving request responses for a set amount of time (of course), but will refresh immediately if the item has expired. You may also set a time (or boolean) in which the item will serve an item based on the conditions above but silently refresh it if that has expired.

To use this with HttpService simply set up API's on your node server for accessing the functions, this module does not provide examples or support for doing that specifically.

## Installation

Simply install with npm: `npm install roblox-js`, no need to download anything manually.

## Usage

ROBLOX user sessions are stored in a `CookieJar`, which can be created like so:
```javascript
var request = require('request-promise');
var jar = request.jar();
```
Be default, however, there is a single global cookie jar stored in the module which will automatically be used if you don't specify a custom jar. You can get the global cookie jar with the `getJar` function and set a new one with `setJar`.

The login function populates the cookie jar with the users cookies, including their `.ROBLOSECURITY` (session), if successful and any functions that perform non-guest actions need a cookie jar to do so. If you are only using this module for a single group with one promotion user I recommend simply using the default global cookie jar.

Be aware that you must set something to refresh this token every once in a while: otherwise it will expire. Logging in every server restart and making a login interval of 1 day should be enough.

Also remember to check the scripts in the examples and tests folder to see the module in action.

Function usage is below.

## Contents

- [roblox-js](#roblox-js)
- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Contents](#contents)
- [Documentation Info](#documentation-info)
- [Main Functions](#main-functions)
  - [buy](#buy)
  - [exile](#exile)
  - [getPlayers](#getplayers)
  - [handleJoinRequest](#handleJoinRequest)
  - [message](#message)
  - [post](#post)
  - [setRank](#setrank)
  - [shout](#shout)
  - [upload](#upload)
- [Utility Functions](#utility-functions)
  - [generalRequest](#generalrequest)
  - [getCurrentUser](#getcurrentuser)
  - [getGeneralToken](#getgeneraltoken)
  - [getIdFromUsername](#getidfromusername)
  - [getInputs](#getinputs)
  - [getProductInfo](#getproductinfo)
  - [getRankInGroup](#getrankingroup)
  - [getRole](#getrole)
  - [getRoles](#getroles)
  - [getRolesetInGroupWithJar](#getrolesetingroupwithjar)
  - [getSession](#getsession)
  - [getToken](#gettoken)
  - [getUsernameFromId](#getusernamefromid)
  - [getVerification](#getverification)
  - [getVerificationInputs](#getverificationinputs)
  - [http](#http)
  - [login](#login)

## Documentation Info

All functions have alternate forms, arguments are either passed:
- Through a single options object
- Individually

The options object has all the manually named arguments.

For example, you could do:
```javascript
login('shedletsky', 'hunter2', jar)
.then(function (info) {
  console.log('Logged in with ID ' + info.UserID)
});
```
_or_
```javascript
var options = {
  username: 'shedletsky',
  password: 'hunter2',
  jar: jar,
}

login(options)
.then(function (info) {
  console.log('Logged in with ID ' + info.UserID)
});
```

_All asynchronous functions are promises. Use .then as a callback for when the function has completed and .catch to catch errors._

_Cookie jars are all optional, if one isn't specified the function will automatically use the default global cookie jar._

## Main Functions

### buy
##### asset[, price, jar]
Buys `asset` with `price` restrictions. This can be a single value or an object with `high` and `low` that sets the respective price limits (both inclusive). This allows you to buy assets with a minimum or maximum amount of robux that can be used or a single required value and therefore guarantees you can't be scammed by a sudden price change. If a price restriction is not set, the asset will be bought for however much it costs (works with free assets).

**Arguments**
- asset (number)
- _optional_ price (number/object)
  - high (number)
  - low (number)
- _optional_ jar (CookieJar)

**Returns**

(Promise)

### exile
##### group, target[, deleteAllPosts, senderRolesetId, jar]
Exiles user with userId `target` from `group` and using option `deleteAllPosts`. The `senderRolesetId` is retrieved automatically if it is not provided.

**Arguments**
- group (number)
- target (number)
- _optional_ deleteAllPosts
  - _default_ false
- _optional_ senderRolesetId
- _optional_ jar (CookieJar)

**Returns**

(Promise)

### getPlayers
##### group[, rank, limit, online]
Gets all players to `limit` in `group` with `rank`. If `rank` is not specified or is set to `-1`, all players from `group` are retrieved.

`Limit` guarantees the outputted players are in the same order as they appear on the group page and that the number of these players is less than or equal to `limit`. A limit of `-1` is the same as no limit _but players will still be retrieved in order_, a limit of `-2` is the same as leaving limit empty. Note that because the pages have to be retrieved in order, adding a `limit` will make the function take considerably more time to complete.

If `online` is `true`, only players that are online at the time of the scraping will be outputted. Note that if `limit` is also set that the number of outputted players may not be equal to limit even if there are actually enough online players in the rank. This is because limit does not set the number of players to output, it only sets the number of pages (and players on those pages) to scan. You can find the number of pages that will be scanned with `ceil(limit / 12)` online players will be collected from this number of pages as long as the total is less than `limit`.

Ordering rules of the output is as follows:
- People in a single rank are _not_ guaranteed be in the same order as they show up on the actual group pages **except when limit is enabled**.
- Every page of players (12 players) _is_ guaranteed to be in the same order. It should be noted, though, that this doesn't mean every 12 players will be a single page. This is because the last page (which may not have 12 players) may not be added to the list last **except when limit is enabled** (in which case every 12 players is guaranteed to be one page).
- If rank was not specified and all players in the group are collected, every rank of players _is_ guaranteed to be in ascending order (lowest to highest rank). For example, the owner of the group is always the last player in the list (except when a bug has been used to add more players to the highest rank).

**Settings**
- interval (number)
  - _default_ 1000
  - This is how large a batch of requests is. To prevent the app from running out of memory, only a certain number of requests are made at once.
- delay (number)
  - _default_ 2000
  - This is the time (in milliseconds) that is waited after every batch of requests. This is mainly to stop ROBLOX from blocking you because of excessive scraping.

**Arguments**
- group (number)
- target (number)
- _optional_ online (boolean)
  - _default_ false
- _optional_ limit (number)
  - _default_ -2

**Returns**

(object)
- promise (Promise)
  - players (object)
    - name (string): userId (number)
- getStatus (function)
  - percent (number)
    - Current percentage of players indexed (out of the total number of members in the group)
      - This may be somewhat inaccurate due to ROBLOX's semi-broken member counter but it is guaranteed to be 100 when the function is complete.

### handleJoinRequest
##### group, username, accept[, jar]
`Accept`s user with `username` into `group`.

**Arguments**
- group (number)
- username (string)
- accept (boolean)
- _optional_ jar (CookieJar)

**Returns**

(Promise)

### message
##### recipient, subject, message[, jar]
Sends a message with `body` and `subject` to the user with id `recipient`.

**Arguments**
- recipient (number)
- subject (string)
- body (string)
- _optional_ jar (CookieJar)

**Returns**

(Promise)

### post
##### group, message[, jar]
Posts message `message` on the group wall with groupId `group`.

**Arguments**
- group (number)
- _optional_ message (string)
- _optional_ jar (CookieJar)

**Returns**

(Promise)

### setRank
##### group, target, rank/roleset[, jar]
Promotes player with userId `target` in group with groupId `group` to rank `rank` or roleset `roleset`. One is required but not both, use `roleset` to speed up requests.

**Arguments**
- group (number)
- target (number)
- _either_ rank (number)
- _or_ roleset (number)
- _optional_ jar (CookieJar)

**Returns**

(Promise)

### shout
##### group[, message, jar]
Shouts message `message` in the group with groupId `group`. Leaving `message` empty will clear the shout.

**Arguments**
- group (number)
- _optional_ message (string)
  - _default_ ""
- _optional_ jar (CookieJar)

**Returns**

(Promise)

### upload
##### data[, itemOptions, asset, type, jar]
Uploads `data` to `asset` with `itemOptions` and `type`. If asset is empty a new asset will be created. The ID of the asset is always returned in the promise. Note that `itemOptions` is _required_ when creating a new asset. It is only optional when updating an old asset, which ignores `itemOptions` and only updates `data`.

**Arguments**
- data (String)
- _optional_ itemOptions (object)
  - name (String)
  - _optional_ description (String)
    - _default_ ""
  - copyLocked (boolean)
  - allowComments (boolean)
  - _optional_ groupId (number)
- asset (number)
- _optional_ type (String)
  - "Model"
  - "Place"
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- assetID/assetVersionID (number)

## Utility Functions

### generalRequest
##### url, events[, getBody, jar]
Gets the verification inputs from `url` and sends a post request with data from `events`, returning the original body before the post request according to `getBody`. Used for primitive site functions that involve ASP viewstates.

**Arguments**
- url (String)
- events (object)
- _optional_ getBody (boolean)
  - _default_ false
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- (object)
  - res (Promise)
  - body (String)

### getCurrentUser
##### [option, jar]
Gets the current user logged into `jar` and returns an `option` if specified or all options if not.

**Arguments**
- _optional_ option (string)
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- option (string) / options (object)

### getGeneralToken
##### [jar]
Gets a general X-CSRF-TOKEN for APIs that don't return it after failure. This uses the https://api.roblox.com/sign-out/v1 API to get tokens.

**Arguments**
- url (string)
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- x-csrf-token (string)

### getIdFromUsername
##### username
Gets the `id` of user with `username` and caches according to settings.

**Arguments**
- username (string)

**Returns**

(Promise)
- id (number)

### getInputs
##### html[, find]
Returns verification inputs on the page with the names in `find` - or all inputs if not provided. Typically used for ROBLOX requests working with ASP.NET.

**Arguments**
- html (string)
- _optional_ find (array)

**Returns**

- inputs (object)
  - name (string): value (string)

### getProductInfo
##### asset
Gets `info` of `asset` and caches according to settings.

**Arguments**
- asset (number)

**Returns**

(Promise)
- info (object)
  - `{ "AssetId":123456789, "ProductId":24870409, "Name":"Hat", "Description":"", "AssetTypeId":8, "Creator":{"Id":1,"Name":"ROBLOX"}, "IconImageAssetId":0, "Created":"2015-06-25T20:07:49.147Z", "Updated":"2015-07-11T20:07:51.863Z", "PriceInRobux":350, "PriceInTickets":null, "Sales":0, "IsNew":true, "IsForSale":true, "IsPublicDomain":false, "IsLimited":false, "IsLimitedUnique":false, "Remaining":null, "MinimumMembershipLevel":0, "ContentRatingTypeId":0 }`

### getRankInGroup
##### group, userId
Gets `rank` of user with `userId` in `group` and caches according to settings.

**Arguments**
- group (number)
- userId (number)

**Returns**

(Promise)
- rank (number)

### getRole
##### roles, rank
Returns role information of rank `rank`, which can be a single rank or an array of ranks, from a `roles` group role object (that can be retrieved from getRoles).

**Arguments**
- roles (object)
- _optional_ rank (number/array)

**Returns**

- role (number/array)
  - ID (number)
  - Name (string)
  - Rank (number)

### getRoles
##### group
Returns role information of a group with groupId `group` in the form `[{"ID":number,"Name":"string","Rank":number},{"ID":number,"Name":"string","Rank":number}]`.

**Arguments**
- group (number)

**Returns**

(Promise)
- roles (object)
  - ID (number)
  - Name (string)
  - Rank (number)

### getRolesetInGroupWithJar
##### group[, jar]
Gets the `roleset` of the logged in user in `group`.

**Arguments**
- group (number)
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- rolesetId (number)

### getSession
##### jar
Gets the `.ROBLOSECURITY` session cookie from `jar`. _Note: Will not work if session_only is enabled_

**Arguments**
- jar (CookieJar)

**Returns**
- session (String)

### getToken
##### url, form[, json, jar]
Returns X-CSRF-TOKEN from `url` after posting to it with `form` which is `json` or not.

**Arguments**
- url (string)
- form (object)
- _optional_ json (boolean)
  - default: false
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- x-csrf-token (string)

### getUsernameFromId
##### id
Gets `username` of user with `id` and caches according to settings.

**Arguments**
- id (number)

**Returns**

(Promise)
- username (string)

### getVerification
##### url[, getBody, jar]
Gets verification inputs off of `url` using `jar` and caches them. If `getBody` is true, the body and inputs will both be returned in an object.

**Arguments**
- url (string)
- _optional_ getBody (boolean)
  - _default_ false
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- response (object)
  - body: body (string)
  - inputs: name (string): value (string)

### getVerificationInputs
##### html
Gets verification inputs from `html`. Short for `getInputs(html,['__VIEWSTATE','__VIEWSTATEGENERATOR','__EVENTVALIDATION, '__RequestVerificationToken']')`. Typically used for ROBLOX requests working with ASP.NET.

**Arguments**
- html (string)

**Returns**

- inputs (object)
  - name (string): value (string)

### http
##### url[, options]
Sends an http request to `url` with `options`. _Note that if jar is a key in the options object but is still null, the default jar will be used_

**Arguments**
- url (string)
- _optional_ options (object)

**Returns**

(Promise)
- body (string)

### login
##### username, password[, jar]
Logs into `username` with `password` and stores their cookie in `jar`.

*Arguments*
- username (string)
- password (string)
- _optional_ jar (CookieJar)

*Returns*

(Promise)
- userInfo (object)
  - UserID (number)
  - UserName (string)
  - RobuxBalance (number)
  - TicketsBalance (number)
  - ThumbnailUrl (string)
  - IsAnyBuildersClubMember (boolean)
