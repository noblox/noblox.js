# roblox-js
## About

Roblox-js is a node module that provides functions for performing actions on [roblox](http://www.roblox.com), mostly for use with their HttpService feature.

This is mostly a collection of functions to perform actions for groups, though others are included. The list of main functions is in the contents section, they all have detailed documentation.

Many of the functions use simple caches in order to server requests faster. Cache time can be changed in settings.json. Cached items include XCSRF tokens and group roles: unless you change your group roles often the default cache settings should be fine. The cache works by saving request responses for a set amount of time (of course), but will refresh immediately if the item has expired. You may also set a time (or boolean) in which the item will serve an item based on the conditions above but silently refresh it if that has expired.

To use this with HttpService simply set up API's on your node server for accessing the functions, this module does not provide examples or support for doing that specifically.

## Installation

Simply install with npm: `npm install roblox-js`, no need to download anything manually.

## Usage

ROBLOX user sessions are stored in a `CookieJar`, which can be created like so:
```javascript
var request = require('request');
var jar = request.jar();
```
Be default, however, there is a single global cookie jar stored in the module which will automatically be used if you don't specify a custom jar. You can get the global cookie jar with the `getJar` function and set a new one with `setJar`. There is a custom property of the CookieJar `user` which is an object containing the `id` and `name` of the logged in player retrieved during the login.

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
  - [setRank](#setrank)
  - [handleJoinRequest](#handlejoinrequest)
  - [exile](#exile)
  - [message](#message)
  - [shout](#shout)
  - [post](#post)
  - [buy](#buy)
  - [upload](#upload)
  - [getPlayers](#getplayers)
- [Utility Functions](#utility-functions)
  - [login](#login)
  - [getToken](#gettoken)
  - [getGeneralToken](#getgeneraltoken)
  - [httpGet](#httpget)
  - [httpPost](#httppost)
  - [getVerification](#getverification)
  - [setFailureHandler](#setfailurehandler)
  - [getFailureHandler](#getfailurehandler)
  - [getProductInfo](#getproductinfo)
  - [getRoles](#getroles)
  - [getUserId](#getuserid)
  - [getCurrentUser](#getcurrentuser)
  - [getRankInGroup](#getrankingroup)
  - [getUsernameFromId](#getusernamefromid)
  - [getIdFromUsername](#getidfromusername)
  - [getRolesetInGroup](#getrolesetingroup)
  - [getRolesetInGroupWithJar](#getrolesetingroupwithjar)
  - [getSession](#getsession)
  - [getJar](#getjar)
  - [setJar](#setjar)
  - [getInputs](#getinputs)
  - [getVerificationInputs](#getverificationinputs)

## Documentation Info

All functions have alternate forms, arguments are either passed:
- Through a single options object
- Individually

The options object has all the arguments listed are manually named.

For example, you could do:
```javascript
login('shedletsky','hunter2',jar, function() {
  console.log('It worked!');
});
```
_or_
```javascript
var options = {
  username: 'shedletsky',
  password: 'hunter2',
  jar: jar,
  success: function() {
    console.log('It worked!');
  }
}

login(options);
```

_Note that raw functions (required individually) do not support alternate forms. Furthermore, their arguments may not be the same or be in the same order: to find them you have to go into the source and check for yourself._

_Success, failure, and always callbacks are executed when the goal of the function: succeeds, fails, or runs at all, respectively._

_Failure will sometimes contain an error message and will always have an errorId to identify where the error originated. Their is a default failure callback that will be used if none is specified. It can be turned off by being set to false._

_Cookie jars are all optional, if one isn't specified the function will automatically use the default global cookie jar._

## Main Functions

### setRank
##### group, target, roleset[, jar, success, failure, always]
Changes the role of `target` (UserID) in `group` to `roleset` or returns a general error if unsuccessful.

options [object]:
- group [number]
- target [number]
- roleset [number]
- rank [number]
  - _Rank can only be used in the options array and will override roleset (making it not required). The rank in the specified group will be converted to its corresponding roleset id_
- _optional_ jar [CookieJar]
- _optional_ success [function]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### handleJoinRequest
##### group, username, accept[, jar, success, failure, always]
Accepts or denies `username`'s join request in `group`.

options [object]:
- group [number]
- username [string]
-  accept [boolean]
- _optional_ jar [CookieJar]
- _optional_ success [function]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### exile
##### group, target[, deleteAllPosts, senderRoleSetId, jar, success, failure, always]
Exiles `target` in `group` and does not return an error if the action was unsuccessful.

options [object]:
- group [number]
- message [string]
- _optional_ deleteAllPosts [boolean]
 - _Defaults to false._
- _optional_ senderRoleSetId [number]
  - _Used for custom handling of the sender's roleset, which is required by the exile API. If not specified_ `getRolesetInGroupWithJar` _will be used._
- _optional_ jar [CookieJar]
- _optional_ success [function]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### message
##### recipient, subject, body[, jar, success, failure, always]
Message `recipient` with the message `body` and subject `subject` and returns a detailed error if unsuccessful.

options [object]:
- recipient [number]
- subject [string]
- body [string]
- _optional_ jar [CookieJar]
- _optional_ success [function]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### shout
##### group, message[, jar, success, failure, always]
Shouts `message` in `group` and returns a general error if unsuccessful.

options [object]:
- group [number]
- message [string]
- _optional_ jar [CookieJar]
- _optional_ success [function]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### post
##### group, message[, jar, success, failure, always]
Posts `message` on `group` wall and returns a general error if unsuccessful.

options [object]:
- group [number]
- message [string]
- _optional_ jar [CookieJar]
- _optional_ success [function]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### buy
##### asset[, currency, jar, success, failure, always]
Buys `asset` using `currency`, which can be 'robux' or default 'tickets' and return a detailed error if unsuccessful.

options [object]:
- asset [number]
- _optional_ currency [string]
- _optional_ jar [CookieJar]
- _optional_ success [function]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### upload
##### data, itemOptions[, asset, jar, success, failure, always]
Uploads `data` to `asset` (or creates a new one) and returns the assetId it uploaded to.

options [object]:
- data [string]
- itemOptions [object]
  - _This is not required if asset is specified, otherwise it has to be set for the new item_
  - name [string]
  - _optional_ description [string]
  - locked [boolean]
  - allowComments [boolean]
  - _optional_ groupId [number]
- _optional_ asset [number]
- _optional_ jar [CookieJar]
- _optional_ success [function]
  - assetId [number]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### getPlayers
##### group[, roleset, online, limit, success, failure, always]
Gets players with in `group` with `roleset` (or all members) up to `limit` (if there is one), `online` only or not.

options [object]:
- group [number]
- _optional_ roleset [number] or [array]
  - _Gets players of all ranks if none is specified_
  - _Can be a single role as a number or multiple roles in an array eg. [11, 60]_
- rank [number] or [array]
  - _Rank can only be used in the options array and will override roleset. The rank in the specified group will be converted to its corresponding roleset id_
  - _Can be a single rank as a number or multiple ranks in an array eg. [11, 60]_
- _optional_ online [boolean]
  - _Defaults to false_
  - _Gets online players only_
- _optional_ limit [number]
  - _Continues up to the last page of members if none is specified_
- _optional_ success [function]
  - players [object]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

## Utility Functions

### login
##### username, password[, jar, success, failure, always]
Logs in with `username` and `password` and puts the new cookie into `jar` (or the default global jar if unspecified) or returns a detailed error if unsuccessful.

options [object]:
- username [string]
- password [string]
- _optional_ jar [CookieJar]
- _optional_ success [function]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### getToken
##### url[, jar, callback, failure, form, json]
Sends the X-CSRF-TOKEN used by the URL to `callback`. This only needs to be used if you want to custom handle tokens, normally it is handled automatically. `Form` and `json` are any options that need to be sent to the API to make it return a token at all, using urlencoded and json respectively.

options [object]:
- url [string]
- _optional_ jar [CookieJar]
- _optional_ callback [function]
  - `token [string]`
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ form [object]
- _optional_ json [object]

### getGeneralToken
##### url[, jar, callback, failure]
Gets a general X-CSRF-TOKEN for APIs that don't return it after failure.

options [object]:
- url [string]
- _optional_ jar [CookieJar]
- _optional_ callback [function]
  - `token [string]`
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`

### httpGet
##### url[, opt, callback, jar]
Sends an httpGet request to `url` using `jar` or default jar.

options [object]:
- url [string]
- _optional_ opt [object]
- _optional_ callback [function]
  - `err [error]`
  - `res [object]`
  - `body [string]`
- _optional_ jar [CookieJar]

### httpGet
##### url[, jar, opt, callback]
Sends an http GET request to `url` using `jar` or default jar.

options [object]:
- url [string]
- _optional_ jar [CookieJar]
- _optional_ opt [object]
- _optional_ callback [function]
  - `err [error]`
  - `res [object]`
  - `body [string]`

### httpPost
##### url[, jar, opt, callback]
Sends an http POST request to `url` using `jar` or default jar.

options [object]:
- url [string]
- _optional_ jar [CookieJar]
- _optional_ opt [object]
- _optional_ callback [function]
  - `err [error]`
  - `res [object]`
  - `body [string]`

### getVerification
##### url[, jar, callback, failure]
Sends verification inputs used by URL to `callback`. This includes `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION`.

options [object]:
- url [string]
- _optional_ jar [CookieJar]
- _optional_ callback [function]
  - `token [string]`
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`

### setFailureHandler
##### handler
Sets the default failure handler for all requests that will be used if none is specified for the request. This can be set to false to disable failure handling.

options [object]:
- handler [function or boolean]

### getFailureHandler

### getProductInfo
##### asset[, success, failure, always]
Gets detailed `productInfo` on `asset`.

- asset [number]
- _optional_ success [function]
  - `productInfo [object]`
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### getRoles
##### group[, rank, success, failure, always]
Returns role information of a group in the form `[{"ID":number,"Name":"string","Rank":number},{"ID":number,"Name":"string","Rank":number}]`. To be used with `setRank`.

options [object]:
- group [number]
- _optional_ rank [number] or [object]
  - _Used to select a specific role from the roles array._
  - _Can be a single role as a number or multiple roles in an array eg. [11, 60]_
- _optional_ success [function]
  - `roles [object]`
    - `ID [number]`
    - `Name [string]`
    - `Rank [number]`
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### getUserId
##### [jar]
Returns the `UserId` that the logged in user had. This is simply a saved ID and is not an accurate check if the user is still logged in.

options [object]:
- _optional_ jar [CookieJar]

### getCurrentUser
##### [option, jar, success, failure, always]
Gets the current user from the ROBLOX website and feeds `option` or all options if successful, otherwise returns detailed error.

options [object]:
- _optional_ option [string]
 - Any one:
  - `UserID`, `UserName`, `RobuxBalance`, `TicketsBalance`, `ThumbnailUrl`, `IsAnyBuildersClubMember`
- _optional_ jar [CookieJar]
- _optional_ success [function]
  - `option [string]` _or_ all options [object]
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### getRankInGroup
##### player, group[, success, failure, always]
Gets the rank of `player` in group `group`.

options [object]:
- player [number]
- group [number]
- _optional_ success [function]
  - `rank [number]`
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

## getUsernameFromId
##### id[, success, failure, always]
Gets the username of the player with `id`.

options [object]:
- id [number]
- _optional_ success [function]
  - `username [string]`
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

## getIdFromUsername
##### username[, success, failure, always]
Gets the id of the player with `username`.

options [object]:
- id [number]
- _optional_ success [function]
  - `id [number]`
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### getRolesetInGroup
##### player, group[, success, failure, always]
Gets the roleset ID of `player` in group `group`.

options [object]:
- player [number]
- group [number]
- _optional_ success [function]
  - `roleset [number]`
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### getRolesetInGroupWithJar
##### group[, jar, success, failure, always]
Gets the roleset ID of player logged into `jar` in group `group`.

options [object]:
- group [number]
- _optional_ jar [CookieJar]
- _optional_ success [function]
  - `roleset [number]`
- _optional_ failure [function]
  - `error [string]`, `errorId [string]`
- _optional_ always _or_ callback [function]

### getSession
##### [jar]
Returns the .ROBLOSECURITY cookie extracted from `jar` if it exists.

options [object]:
- _optional_ jar [CookieJar]

### getJar
Returns the global cookie jar in use by the module.

### setJar
##### jar
Sets the global cookie jar for the module to use.

- jar [CookieJar]

### getInputs
##### html[, find]
Returns verification inputs on the page with the names in find - or all inputs if not provided. Typically used for ROBLOX requests working with ASP.NET.

options [object]:
- html [string]
- _optional_ find [array]

### getVerificationInputs
##### html
Short for `getInputs(html,['__VIEWSTATE','__VIEWSTATEGENERATOR','__EVENTVALIDATION]')`. Typically used for ROBLOX requests working with ASP.NET.

options [object]:
- html [string]
