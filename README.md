# roblox-js
## About

Roblox-js is a node module that provides functions for performing action on [roblox](http://www.roblox.com), mostly for use with their HttpService feature.

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

## Main functions

## Utility Functions

_Success, failure, and always callbacks are executed when the goal of the function: succeeds, fails, or runs at all, respectively._

_Cookie jars are all optional, if one isn't specified the function will automatically use the default global cookie jar._

### login(username, password[, jar, success, failure, always])
Logs in with username and password and puts the new cookie into jar (or the default global jar if unspecified) or returns a detailed error if unsuccessful.

options [object]:
- username: string,
- password: string,
- _optional_ jar: CookieJar
- _optional_ success: function,
- _optional_ failure: function,
  - `error`
- _optional_ always _or_ callback: function

### getCurrentUser([option, jar, success, failure, always])
Gets the current user from the ROBLOX website and feeds option or all options if successful, otherwise returns detailed error.

options [object]:
- _optional_ option: string
 - Any one:
  - `UserID`, `UserName`, `RobuxBalance`, `TicketsBalance`, `ThumbnailUrl`, `IsAnyBuildersClubMember`
- _optional_ jar: CookieJar
- _optional_ success: function,
  - `option` _or_ all options [object]
- _optional_ failure: function,
  - `error`
- _optional_ always _or_ callback: function

### getSettings([jar])
Returns the .ROBLOSECURITY cookie extracted from jar if it exists.

options [object]:
- _optional_ jar: CookieJar
