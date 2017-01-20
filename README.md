# roblox-js
## About

Roblox-js is a node module that provides an interface for [ROBLOX](http://www.roblox.com) site actions, mostly for use with their HttpService feature.

Most functions are related to group service but there are other general functions as well. The list of main functions is in the contents section, they all have detailed documentation.

Many of the functions use simple caches in order to server requests faster. Cache time can be changed in settings.json. Cached items include XCSRF tokens and group roles: unless you change your group roles often the default cache settings should be fine. The cache works by saving request responses for a set amount of time (of course), but will refresh immediately if the item has expired. You may also set a time (or boolean) in which the item will serve an item based on the conditions above but silently refresh it if that has expired.

To use this with HttpService simply set up API's on your node server for accessing the functions, you can use the example server outlined in the below example server section as a base.

## Installation

Simply install with npm: `npm install roblox-js`, no need to download anything manually.

## Example Server

A usable express server utilizing this module is available [here](https://github.com/sentanos/roblox-js-server) and includes a detailed tutorial for setup on a free host as well as Lua scripts for sending requests to the server from in-game.

## Usage

#### Functions

All functions have alternate forms, arguments are either passed:
- Through a single options object
- Individually

The options object has all the manually named arguments, passing arguments individually required them to be in the same order as they are shown in the documentation. Use .then to get results and to continue after the function is complete. To catch errors you follow up with a catch function which will receive any errors that occur during the function call, these often contain important information. Also remember that promises can be chained.

Example:
```javascript
var rbx = require('roblox-js');

rbx.login('shedletsky', 'hunter2')
.then(function (info) {
  console.log('Logged in with ID ' + info.userId)
})
.catch(function (err) {
  console.error(err.stack);
});
```
_or_
```javascript
var rbx = require('roblox-js');

var options = {
  username: 'shedletsky',
  password: 'hunter2'
}

rbx.login(options)
.then(function (info) {
  console.log('Logged in with ID ' + info.userId)
})
.catch(function (err) {
  console.error(err.stack);
});
```

#### Cookies

There is a single global cookie jar stored in the module which will automatically be used if you don't specify a custom jar. If you only use the module with one user at a time this is the recommended method. The global cookie jar is stored in options. Example of retrieving it:
```javascript
var rbx = require('roblox-js');
var jar = rbx.options.jar;
```

If you want to work with multiple users you can work directly with jar files. User session are stored in two ways: the default is simply an object containing the session and is structured like so:
```javascript
var jar = {'session': 'AAAAA'};
```

If `session_only` is disabled, jars are stored in a `CookieJar`, which can be created with:
```javascript
var request = require('request-promise');
var jar = request.jar();
```
CookieJar contains all cookies, including the session. For the most part these are just useless things that make requests larger, session only should be fine most of the time.

The easiest thing to do would be to simply get a jar file from the module, which will obey the `session_only` rule and return a corresponding jar file:
```javascript
var rbx = require('roblox-js');
var jar = rbx.jar();
```

Be aware that you must set something to refresh this token every once in a while: otherwise it will expire. Logging in every server restart and making a login interval of 1 day should be enough. The module does not check to make sure if you are logged in, you have to make sure of it yourself.

#### Settings

If you can you should change settings directly from the `settings.json` file. You can also use `rbx.settings` directly as shown below, remember to call `rbx.options.init()` once you are done to update some things which are normally created off settings at startup.

```javascript
var rbx = require('roblox-js');
var request = require('request');
rbx.settings.session_only = false;
rbx.settings.cache.XCSRF.expire = 60;
rbx.options.init();
```

An example of usage is available on the [roblox-js-server](#https://github.com/sentanos/roblox-js-server) repository.

Function usage is below.

## Contents

- [roblox-js](#roblox-js)
- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Example Server](#example-server)
- [Contents](#contents)
- [Documentation Info](#documentation-info)
- [Main Functions](#main-functions)
  - [buy](#buy)
  - [exile](#exile)
  - [forumPost](#forumpost)
  - [getPlayers](#getplayers)
  - [groupPayout](#grouppayout)
  - [handleJoinRequest](#handlejoinrequest)
  - [message](#message)
  - [post](#post)
  - [setRank](#setrank)
  - [shout](#shout)
  - [upload](#upload)
- [Utility Functions](#utility-functions)
  - [clearSession](#clearsession)
  - [generalRequest](#generalrequest)
  - [getBlurb](#getblurb)
  - [getCurrentUser](#getcurrentuser)
  - [getGeneralToken](#getgeneraltoken)
  - [getHash](#gethash)
  - [getIdFromUsername](#getidfromusername)
  - [getInputs](#getinputs)
  - [getProductInfo](#getproductinfo)
  - [getRankInGroup](#getrankingroup)
  - [getRole](#getrole)
  - [getRoles](#getroles)
  - [getRolesetInGroupWithJar](#getrolesetingroupwithjar)
  - [getSession](#getsession)
  - [getUsernameFromId](#getusernamefromid)
  - [getVerification](#getverification)
  - [getVerificationInputs](#getverificationinputs)
  - [http](#http)
  - [jar](#jar-3)
  - [login](#login)

### example function: name
##### argument 1, argument 2/other argument 2[, optional argument 1, optional argument 2]
Description. When calling functions without an options object and you come across a multi argument (argument 2 or other argument 2) `argument 2` will be used. The only way to get `other argument 2` is by using an options object and specifying the name.

**Arguments**
- argument name (argument type)
  - _structure (for objects)_
  - index (index type)

**Returns**
(type)
- _structure (for objects)_

_Cookie jars are always optional, if one isn't specified the function will automatically use the default global cookie jar._

## Main Functions

### buy
##### asset/product[, price, jar]
Buys asset `asset` with `price` restrictions. This can be a single value or an object with `high` and `low` that sets the respective price limits (both inclusive). This allows you to buy assets with a minimum or maximum amount of robux that can be used or a single required value and therefore guarantees you can't be scammed by a sudden price change. If a price restriction is not set, the asset will be bought for however much it costs (works with free assets). You are able to use product instead of asset, the options in `product` are collected automatically if not provided.

**Arguments**
- _either_ asset (number)
- _or_ product (object)
  - ProductId (number)
  - Creator (object)
    - Id (number)
  - PriceInRobux (number)
  - _optional_ UserAssetId (number)
- _optional_ price (number/object)
  - high (number)
  - low (number)
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- (object)
  - productId (number)
  - price (number)

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

### forumPost
##### forumId/postId, body[, subject, locked, jar]
Creates a new forum thread with subject `subject` and body `body` in the subforum with ID `forumId`. Alternatively, reply to an existing post by providing `postId` instead. If `locked` is true, replies will be disabled (this technically works with both new threads and replies, but the latter obviously won't make a difference). Note that `subject` is required when making a new post but is optional when replying. To find `forumId` go to the subforum you want in a browser and check the end of the URL.

**Arguments**
- _either_ forumId (number)
- _or_ postId (number)
- body (string)
- _optional_ subject (string)
- _optional_ locked (boolean)
  - _default_ false
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- postId (number)

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

### groupPayout
##### group, member, amount[, recurring, usePercentage, jar]

Performs a payout in group with the groupId `group`. If `recurring` is true this will configure the recurring options for the group's payout _replacing all old values_, otherwise a one-time-payout is made. To clear the recurring payouts, pass in empty arrays to both member and amount. Argument `member` can either be a single userId or an array of userIds. If it is a single value `amount` must be as well, otherwise `amount` has to be a parallel array of equal length. If `usePercentage` is true `amount` percentage of the total group funds is paid to the members, otherwise it pays `amount` ROBUX. Note that recurring payouts are always percentages, and when `recurring` is true `usePercentage` is ignored.

**Arguments**
- group (number)
- members (number/Array)
  - _either_ `userId`
  - _or_ `[userId1, userId2]`
- amount (number/Array)
  - _either_ `amount`
  - _or_ `[amount1, amount2]`
- _optional_ recurring
  - _default_ false
- _optional_ usePercentage
  - _default_ false
- _optional_ jar (CookieJar)

**Returns**

(Promise)

### handleJoinRequest
##### group, username, accept[, jar]
`Accept`s user with `username` into `group`. Note that `username` is case-sensitive.

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
- message (string)
- _optional_ jar (CookieJar)

**Returns**

(Promise)

### setRank
##### group, target, rank/roleset/name[, jar]
Promotes player with userId `target` in group with groupId `group` to rank `rank`, roleset `roleset`, or name `name`. One is required but not all, use `roleset` to speed up requests and `name` if there are ambiguous ranks (same rank number).

**Arguments**
- group (number)
- target (number)
- _either_ rank (number)
- _or_ roleset (number)
- _or_ name (string)
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- newRoleSetId (number)

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
##### data[, itemOptions, asset, jar]
Uploads `data` to `asset` with `itemOptions`. If asset is empty a new asset will be created. Both the assetId as well as the assetVersionId are returned in a object. Note that `itemOptions` is _required when creating a new asset_. It is only optional when updating an old asset, which ignores `itemOptions` and only updates `data`.

**Arguments**
- data (String)
- _optional_ itemOptions (object)
  - name (String)
  - _optional_ description (String)
    - _default_ ""
  - copyLocked (boolean)
    - _default_ true
  - allowComments (boolean)
    - _default_ true
  - _optional_ groupId (number)
- asset (number)
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- (object)
  - AssetId (number)
  - AssetVersionId (number)

## Utility Functions

### clearSession
##### jar
Removes the `.ROBLOSECURITY` cookie from `jar`. Note that this does not return a new jar, it simply changes the existing one.

**Arguments**
- jar (CookieJar)

**Returns**
- session (String)

### generalRequest
##### url, events[, http, ignoreCache, getBody, jar]
Gets the verification inputs from `url` and sends a post request with data from `events`, returning the original body before the post request according to `getBody` and obeying the cache based on `ignoreCache`. Use `http` for custom request options; if url is contained, it will not replace the main url but the url used for getting verification tokens. This function is used for primitive site functions that involve ASP viewstates.

**Arguments**
- url (String)
- events (object)
- _optional_ ignoreCache (boolean)
  - _default_ false
- _optional_ getBody (boolean)
  - _default_ false
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- (object)
  - res (object)
  - body (String)

### getBlurb
##### userId
Gets the `blurb` of the user with userId.

**Arguments**
- userId (number)

**Returns**

(Promise)
- blurb (string)

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

### getHash
##### [jar]
Generates a unique hash for the given jar file `jar` or default if none is specified. Typically used to cache items that depend on session.

**Arguments**
- _optional_ jar (CookieJar)

**Returns**

- hash (string)

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
##### roles, rank/name
Returns role information of rank `rank`, which can be a single rank or an array of ranks, from a `roles` group role object (that can be retrieved from getRoles). If an array of ranks is inputted a parallel array of roles is returned. Alternatively, the name `name` of the role can be searched for, this should be used if there are "ambiguous roles" that have the same rank. If ambiguous roles cannot be resolved an error will be thrown.

**Arguments**
- roles (object)
- _either_ rank (number/array)
- _or_ name (string/array)


**Returns**

- role (object)
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
Gets the `.ROBLOSECURITY` session cookie from `jar`.

**Arguments**
- jar (CookieJar)

**Returns**
- session (String)

### getUsernameFromId
##### id
Gets `username` of user with `id` and caches according to settings.

**Arguments**
- id (number)

**Returns**

(Promise)
- username (string)

### getVerification
##### url[, ignoreCache, getBody, jar]
Gets verification inputs off of `url` using `jar` and caches them. If `getBody` is true, the body and inputs will both be returned in an object. If `ignoreCache` is enabled, the resulting tokens will not be cached.

**Arguments**
- url (string)
- _optional_ ignoreCache (boolean)
  - _default_ false
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

### jar
##### [sessionOnly]
Creates a jar file based on `sessionOnly`. Normally you will not need this argument as the function will use the default from settings.json. If for some other reason you need a jar file you can collect it this way, but without changing the settings it will not work.

**Arguments**
- sessionOnly (boolean)

**Returns**

- jar (CookieJar)

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
  - userId (number)
