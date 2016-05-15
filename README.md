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
  - [handleJoinRequest](#handleJoinRequest)
  - [message](#message)
  - [post](#post)
  - [setRank](#setrank)
  - [shout](#shout)
  - [upload](#upload)
- [Utility Functions](#utility-functions)
  - [getCurrentUser](#getcurrentuser)
  - [getGeneralToken](#getgeneraltoken)
  - [getInputs](#getinputs)
  - [getRoles](#getroles)
  - [getToken](#gettoken)
  - [getVerification](#getverification)
  - [getVerificationInputs](#getverificationinputs)
  - [http](#http)
  - [login](#login)

## Documentation Info

All functions have alternate forms, arguments are either passed:
- Through a single options object
- Individually

The options object has all the arguments listed are manually named.

For example, you could do:
```javascript
login('shedletsky', 'hunter2', jar)
.then(function (info) {
  console.log('Logged in with ID ' + info.UserID)
})
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

_Note that raw functions (required individually) require that arguments are served in an options object, this is because support for the alternate form of the function is added when the module is required._

_All asynchronous functions are promises. Use .then as a callback for when the function has completed and .catch to catch errors._

_Cookie jars are all optional, if one isn't specified the function will automatically use the default global cookie jar._

## Main Functions

### buy
##### asset, [price, jar]
Buys `asset` with `price` restrictions. This can be a single value or an object with `high` and `low` that sets the respective price limits (both inclusive). This allows you to buy assets with a minimum or maximum amount of robux that can be used or a single required value and therefore guarantees you can't be scammed by a sudden price change. If a price restriction is not set, the asset will be bought for however much it costs (works with free assets).

**Arguments**
- asset (number)
- _optional_ price (number/object)
  - high (number)
  - low (number)
- _optional_ jar (CookieJar)

**Returns**

(Promise)

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
Sends a `message` with `subject` to the user with id `recipient`.

**Arguments**
- recipient (number)
- subject (string)
- message (string)
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
##### group, [message, jar]
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
##### url[, jar]
Gets a general X-CSRF-TOKEN for APIs that don't return it after failure.

**Arguments**
- url (string)
- _optional_ jar (CookieJar)

**Returns**

(Promise)
- x-csrf-token (string)

### getInputs
##### html[, find]
Returns verification inputs on the page with the names in `find` - or all inputs if not provided. Typically used for ROBLOX requests working with ASP.NET.

**Arguments**
- html (string)
- _optional_ find (array)

**Returns**

- inputs (object)
  - name (string): value (string)

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
- inputs (object)
  - name (string): value (string)
- _or_ response (object)
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
Sends an http request to `url` with `options`.

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
