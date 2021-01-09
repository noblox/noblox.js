<h1 align="center">
    <img src="https://raw.githubusercontent.com/suufi/noblox.js/master/img/noblox-js.png" alt="noblox.js" width="250"/>
    <br>
</h1>

<h4 align="center">A Node.js wrapper for interacting with the Roblox API. Forked from <a href="https://github.com/sentanos/roblox-js">roblox-js</a>.</h4>

<p align="center">
    <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-blue.svg?style=flat-square" alt="JavaScript Style Guide"/></a>
    <a href="https://discord.gg/EDXNdAT"><img src="https://img.shields.io/badge/discord-roblox%20api%20chat-blue.svg?style=flat-square" alt="Roblox API Discord"/></a>
    <a href="https://npmjs.org/noblox.js"><img src="https://img.shields.io/npm/v/noblox.js.svg?style=flat-square" alt="NPM package"/>
    <a href="https://travis-ci.org/suufi/noblox.js"><img src="https://img.shields.io/travis/suufi/noblox.js/master.svg?style=flat-square" alt="Travis Build Status"/></a></a>
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

# if you're using yarn:
$ yarn add noblox.js

# Run this instead to install noblox.js globally so you can use it anywhere.
$ npm install noblox.js -g
```
That's it!

## Documentation

You can find the current noblox.js wiki with all API documentation [here](https://noblox.js.org/). Keep in mind that all methods may not be documented.  

## Making use of new login workaround
> Note, as of v4.6.0 The way you log in to Noblox has changed significantly.
> The library is no longer responsible for refreshing your cookies
>
> This is because of many reasons including that creating a file caused several security/usability issues and made the library incompatible with some hosts.
### Initial setup
1. Remove any usages of the `login` or `cookieLogin` methods.
2. Run `setCookie` with your cookie. This will store your cookie internally and validate it, but will perform **no** cookie refresh automatically
3. While this works, Roblox `.ROBLOSECURITY` cookies expire after an unknown length of time. For applications which run continuously, **you must** use the function `refreshCookie` to prevent this. This will refresh either the cookie you pass or the internally stored cookie and return the new one.*
4. You need to store this new cookie somewhere - whether it be in a database, or a JSON file.

\* See [Cookie expiration](#cookie-expiration) for an in depth discussion of cookie expiration.
> Note: By default, setCookie will validate the cookie you provide by making a HTTP request.
> To Disable this behaviour, pass `false` as the second parameter (validate)
    
### Getting your cookie (Chrome):
1. Open any Roblox page and login
2. Press `Control + Shift + i` on your keyboard
3. Click `Application`
4. Find `.ROBLOSECURITY`. Copy its contents, which will start with: `_|WARNING:-DO`
5. Put this full token, *including* the warning into cookieLogin: `rbx.setCookie( tokenHere )`
    
### Example
This example makes use of the new async-await syntax.
```js
const rbx = require("noblox.js")
async function startApp () {
    await rbx.setCookie("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_F9F1EA531adk")
    // Do everything else, calling functions and the like.
    let currentUser = await rbx.getCurrentUser()
}
```

## Drawbacks
- You need to set up something to store and refresh cookies yourself 
- Roblox-js-server is **not** currently compatible. Use [noblox.js-server](https://github.com/Hamzah-z/noblox.js-server) instead.

## Common issues
### CSRF 
In July 2020 Roblox updated the endpoint we used to get CSRF tokens (`auth.roblox.com/v1/logout`) and essentially disabled it.
They didn't warn anyone of this change so as of v4.6.3 we've updated to a new endpoint that works.
To make use of the new fix, run `npm install noblox.js@4.6.3`. Alternatively, use `latest` to get the latest version.


### Cookie expiration
We do not know for a fact whether Roblox cookies expire. Roblox has not enlightened us on this fact, so we're pretty much in the dark.

We advise that you refresh your cookies in a production environment **no more often than** once every 24 hours.
However, several users have noted lately that they've had cookies last for several months - meaning you could choose not to refresh your cookie.


## Credits

* [suufi](https://github.com/suufi) - Lead maintainer
* [sentanos](https://github.com/sentanos) - We wouldn't exist without him. 😀
* [Neztore](https://github.com/Neztore) - Library maintenance and review 
* [popeeyy](https://github.com/popeeyy) - Creation of the documentation.
* [edward](https://github.com/edwrddd) - Helping with the creation of the documentation.

## License

MIT
