<h1 align="center">
    <img src="https://raw.githubusercontent.com/noblox/noblox.js/master/img/noblox-js.png" alt="noblox.js" width="400"/>
    <br>
</h1>

<h4 align="center">A Node.js wrapper for interacting with the Roblox API; forked from <a href="https://github.com/sentanos/roblox-js">roblox-js</a>.</h4>

<p align="center">
    <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-blue.svg?style=flat-square" alt="JavaScript Style Guide"/></a>
    <a href="https://discord.gg/R5GVSyTVGv"><img src="https://img.shields.io/badge/discord-noblox.js-blue.svg?style=flat-square" alt="noblox.js Discord"/></a>
    <a href="https://npmjs.org/noblox.js"><img src="https://img.shields.io/npm/v/noblox.js.svg?style=flat-square" alt="NPM package"/>
    <a href="https://travis-ci.org/noblox/noblox.js"><img src="https://img.shields.io/travis/noblox/noblox.js/master.svg?style=flat-square" alt="Travis Build Status"/></a></a>
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#prerequisites">Prerequisites</a> •
  <a href="#installation">Installation</a> •
  <a href="#quickstart">Quickstart</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#common-issues">Common Issues</a> •
  <a href="https://www.youtube.com/playlist?list=PLEW4K4VqMUb_VMA3Yp9LI4gReRyVWGTnU">YouTube Series</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

---

## About

`noblox.js` is an open-source Roblox API wrapper written in JavaScript (with TypeScript compatibility) as a fork from sentanos's <a href="https://github.com/sentanos/roblox-js"> roblox-js module</a>.

This NPM package enables operations froms the [Roblox website](https://www.roblox.com) to be executed via NodeJS; many individuals leverage `noblox.js` along side [Roblox's HTTPService](http://wiki.roblox.com/index.php?title=API:Class/HttpService) to create in-game scripts that interact with the website, i.e. promote users, shout events, and so on, or to create Discord utiltiies to manage their community.

If you are looking for more information on how to create something like this, check out [our sister library, `noblox.js-server`](https://github.com/noblox/noblox.js-server) or [our YouTube series](https://www.youtube.com/playlist?list=PLEW4K4VqMUb_VMA3Yp9LI4gReRyVWGTnU). Keep in mind that these resources may not always be up to date, so it is **highly** encouraged that you learn to use the `noblox.js` library directly.

---

## Prerequisites

- [**Node.js®**](https://nodejs.org/en/download/current/)

---

## Installation

With node.js installed simply run: 
```bash
# Run this to install noblox.js locally to your repository. 
$ npm install noblox.js

# Alternatively, if you are using yarn:
$ yarn add noblox.js

# To use noblox.js anywhere, run this code to install the package globally:
$ npm install noblox.js -g
```
That's it!

---

## Documentation

You can locate the [`noblox.js` documentation here](https://noblox.js.org/); keep in mind some internal or legacy methods may not be documented.

### Legend
You may notice our documentation utilizes emojis in every function description; they have meanings!

| Icon | Description |
| ---- | ----------- |
| 🔐 | Authentication through `setCookie()` is required to use this method.<sup id="a1">[1](#f1)</sup>
| 🔓 | Authentication through `setCookie()` is required in **some** use-cases; dependent on the target's privacy settings.
| ✅ | No authentication is required to use this method.

<b id="f1">[1](#a1)</b> : Extended permissions may be required such as edit permissions or account ownership.
---

## Quickstart

1 | Install `noblox.js`:
```bash
npm install noblox.js
```

2 | Retrieve your `.ROBLOSECURITY` cookie (Google Chrome):
1) Go to `https://www.roblox.com` and login to the bot account.
2) Open the Developer Console by pressing `CTRL SHIFT I` or `F12`.
3) Click the `Application` along the top row.
4) Expand the `Cookies` dropdown in the left panel, and select `https://www.roblox.com`.
5) Copy the value of the `.ROBLOSECURITY` cookie to your clipboard.

> [Instructions for alternative browsers can be found here.](https://noblox.js.org/tutorial-Authentication.html)

3 | Write your code.

_Using `async/await` syntax:_
```js
const noblox = require('noblox.js')
async function startApp () {
    // You MUST call setCookie() before using any authenticated methods [marked by 🔐]
    // Replace the parameter in setCookie() with your .ROBLOSECURITY cookie.
    const currentUser = await noblox.setCookie('_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_6E6F626C6F782E6A73') 
    console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)

    // Do everything else, calling functions and the like.
    const groupInfo = await noblox.getGroup(9997719)
    console.log(groupInfo)
}
startApp()
```

You are now using `noblox.js`!

### [More examples can be found here.](https://github.com/noblox/noblox.js/tree/master/examples)

**Promises are fundamental to this library**; if you are unfamiliar with JavaScript promises, we recommend you check out [our tutorial here](https://noblox.js.org/tutorial-Promises.html), and [Daniel Shiffman's JavaScript series](https://www.youtube.com/watch?v=QO4NXhWo_NM&list=PLRqwX-V7Uu6YgpA3Oht-7B4NBQwFVe3pr&index=12).

---

## Hiding Your Cookie

It is bad practice to store your `.ROBLOSECURITY` cookie inside your codebase; it is too easy to accidentally screenshot or push this private key to GitHub. We recommend using a [package such as `dotenv`](https://www.npmjs.com/package/dotenv) to store your private information in environmental variables.

We recommend using a secondary account for botting purposes.

Consult their documentation or [follow this video](https://www.youtube.com/watch?v=17UVejOw3zA).

---

### Invalidating A Cookie

In the event of accidentally exposing your `.ROBLOSECURITY` cookie, do not panic. Go to [`'Account Settings'` > `'Security'`](https://www.roblox.com/my/account#!/security) then select `'Sign out of all other sessions'`, then log out of your account. This should invalidate your `.ROBLOSECURITY` cookie. 


---

## Common Issues

> **Error: You are not logged in.**

You may be calling a function before `setCookie()` is completed; make sure that you are awaiting `setCookie()` before initializing any event listeners or function calls.

`noblox.js` is a promise based library, this enables you to run operations concurrently; however if you are not awaiting your promises, this means while `setCookie()` is validating your cookie, _your other functions will continue to run_- ~30ms is a **long time** at the computer scale.

**Promises are fundamental to this library**; if you are unfamiliar with JavaScript promises, we recommend you check out [our tutorial here](https://noblox.js.org/tutorial-Promises.html), and [Daniel Shiffman's JavaScript series](https://www.youtube.com/watch?v=QO4NXhWo_NM&list=PLRqwX-V7Uu6YgpA3Oht-7B4NBQwFVe3pr&index=12).

> **Error: 400 The roleset is invalid or does not exist.**

You likely are using a `rankId` (0 - 255) instead of a `rolesetId` (>255); a `rolesetId` is a unique identifier for a role which you can find by calling [`getRoles(groupId)`](https://noblox.js.org/global.html#getRoles).

Roblox's naming scheme is a fickle beast; similarly, a `developerProductId` is _different_ than a `productId` (which appears on the public facing dashboard); use [`getDeveloperProducts(placeId)`](https://noblox.js.org/global.html#getDeveloperProducts) to see the `developerProductId`.



> **Error: Initialization failed: 401 Authorization has been denied for this request.**

First, see the steps for `Error: You are not logged in`. 

If this is unresolved, are you sure the bot has permissions to access this resource? Can you do this operation manually on the website through the bot account?

At the end of the day, a 'bot' is a user account, it cannot magically bypass privacy restrictions or group permissions.

---

## Credits
* [suufi](https://github.com/suufi) - Lead maintainer
* [sentanos](https://github.com/sentanos) - We wouldn't exist without him. 😀
* [Neztore](https://github.com/Neztore) - Library maintenance and review 
* [Alan Bixby](https://github.com/alanbixby) - Library maintenance
* [popeeyy](https://github.com/popeeyy) - Creation of the documentation.
* [edward](https://github.com/edwrddd) - Helping with the creation of the documentation.

---

## License

[MIT](https://github.com/noblox/noblox.js/blob/master/LICENSE)
