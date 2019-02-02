<h1 align="center">
    <img src="https://raw.githubusercontent.com/suufi/noblox.js/master/img/noblox-js.png" alt="noblox.js" width="250"/>
    <br>
</h1>

<h4 align="center">A Node.js wrapper for interacting with the Roblox API. Forked from <a href="https://github.com/sentanos/roblox-js">roblox-js</a>.</h4>

<p align="center">
    <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-blue.svg?style=flat-square" alt="JavaScript Style Guide"/></a>
    <a href="https://discord.gg/EDXNdAT"><img src="https://img.shields.io/badge/discord-roblox%20api%20chat-blue.svg?style=flat-square" alt="Roblox API Discord"/></a>
    <a href="https://npmjs.org/noblox.js"><img src="https://img.shields.io/npm/v/noblox.js.svg?style=flat-square" alt="NPM package"/>
    <a href="https://travis-ci.org/suufi/noblox.js"><img src="https://img.shields.io/travis/suufi/noblox.js/master.svg?style=flat-square" alt="Travis Build Status"/></a>
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#prerequisites">Prerequisites</a> •
  <a href="#installation">Installation</a> •
  <a href="#documentation">Docs</a> •
  <a href="https://github.com/suufi/noblox.js/tree/master/examples">Examples</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## About

Noblox.js is a node module that was forked from <a href="https://github.com/sentanos/roblox-js">sentanos's roblox-js module</a>. This project was created because the roblox-js repository was no longer maintained by sentanos.

Noblox.js allows you to do things you would normally do on the [Roblox](https://www.roblox.com) website through a Node.js interface. You can use noblox.js along with Roblox's [HttpService feature](http://wiki.roblox.com/index.php?title=API:Class/HttpService) to create scripts that interact with the website. If you're looking for more information on how to create something like this, check out [this](https://github.com/sentanos/roblox-js-server) repository by sentanos. Keep in mind that this does not use the latest version of this module and it is **highly** encouraged that you learn to use the library directly.

## Prerequisites

- [**node.js**](https://nodejs.org/en/download/current/)

## Installation

With node.js installed simply run: 
```bash
# Run this to install noblox.js locally to your repository. 
$ npm install noblox.js --save

# Run this instead to install noblox.js globally so you can use it anywhere.
$ npm install noblox.js -g
```
That's it!

## Documentation

You can find the current noblox.js wiki with all API documentation [here](https://github.com/sentanos/roblox-js/wiki). A majority of the new features that can be found in noblox.js are not in roblox-js. There will be new documentation coming in with v5.0.0.

## Making use of new login workaround

### Initial setup
1. Remove any usages of the `login` method.
2. Run `cookieLogin` when your app starts. You only need to run it on app start. Supply it with a cookie, guide on obtaining that below.
3. This cookie will be automatically refreshed. You never need to supply it again, but supplying it is unlikely to cause problems
    
### Getting your cookie (Chrome):
1. Open any Roblox page and login
2. Press `Control + Shift + i` on your keyboard
3. Click `Application`
4. Find `.ROBLOSECURITY`. Copy it's contents, which will start with `_|WARNING:-DO`
5. Put this full token, *including* the warning into cookieLogin: `rbx.cookieLogin( tokenHere )`
    
### Example
This example makes use of the new async-await syntax.
```js
const rbx = require("noblox.js")
async function startApp () {
    await rbx.cookieLogin("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_F9F1EA531adk")
    // Do everything else, calling functions and the like.
    let currentUser = await rbx.getCurrentUser()
}
```

## Drawbacks
- Only one application can be logged in at once. 
- If the application is offline for like a week to a month you may need to get the cookie again
- Your cookie is stored within a file in the lib by default (see: Using a custom cookie loader)
- Roblox-js-server is **not** currently compatible. Use [noblox.js-server](https://github.com/suufi/noblox.js-server) instead.
- The application will **not** work on Heroku. This is because we store the cookie internally in a file, and files do not persist in Heroku.

## Using a custom cookie loader
The cookie can be stored using a cookie loader. A cookie loader is a set of functions passed to cookieLogin to load and save cookies. In this case, the initial cookie should be a paramater in the object argument.

*cookieLoad* should return (if available) an object with the **cookie** string and optionally a **time** number (which represents the amount of time since the unix epoch; e.g. `Date.Now()`). *cookieSave* is given a cookie to save and should return once completed.
Both *cookieLoad* and *cookieSave* may run asynchronously in which case they must return a Promise.
```js
const rbx = require("noblox.js")
const { promisify } = require("util")
const redis = require("redis").createClient()
const redisGet = promisify(redis.get)
const redisSet = promisify(redis.set)
async function startApp () {
    await rbx.cookieLogin({
        cookie: "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_F9F1EA531adk",
        loadCookie: function () {
            return redisGet('cookie')
        },
        saveCookie: function (cookie) {
            await redisSet('cookie', {cookie: cookie, time: Date.now()})
        }
    })
    // Do everything else, calling functions and the like.
    let currentUser = await rbx.getCurrentUser()
}
```

Additionally, sample loaders have been provided for MySql, PostgreSQL, and Microsoft SQL databases.

1. A connection pool is created for the database,
2. an `rbx_cookie` table is created (if it does not exist),
3. and the loader functions are returned.
```js
const rbx = require("noblox.js")
async function startApp () {
    let loader = rbx.cookieLoaders('mysql', {
        host: 'example.org',
        user: 'bob',
        password: 'secret',
        connectionLimit: 20
    })
    await rbx.cookieLogin({
        cookie: "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_F9F1EA531adk",
        loadCookie: loader.loadCookie,
        saveCookie: loader.saveCookie 
    })
    // Do everything else, calling functions and the like.
    let currentUser = await rbx.getCurrentUser()
}
```
Each sample loader has it's own identifier and driver that needs to be installed:
- `mysql` - Requires `mysql` (`npm install --save mysql`).
- `postgres` - Requires `pg` (`npm install --save pg`).
- `mssql` - Requires `mssql` (`npm install --save mssql`).

## Credits

* [sentanos](https://github.com/sentanos) - We wouldn't exist without him. 😀

## License

MIT
