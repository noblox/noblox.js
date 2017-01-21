<div align="center">
  <h1 align="center"> roblox-js </h1>
    **A module allowing you to use ROBLOX web functions with JS!** <br/>
    [![js-semistandard-style](https://cdn.rawgit.com/flet/semistandard/master/badge.svg)](https://github.com/Flet/semistandard)
    <br/>
    [![NPM](https://nodei.co/npm/roblox-js.png?compact=true)](https://nodei.co/npm/roblox-js/)
</div><br/>
  
## About

Roblox-js is a node module that provides an interface for [ROBLOX](http://www.roblox.com) site actions, mostly for use with their HttpService feature.

Most functions are related to group service but there are other general functions as well. The list of main functions is in the contents section, they all have detailed documentation.

Many of the functions use simple caches in order to server requests faster. Cache time can be changed in settings.json. Cached items include XCSRF tokens and group roles: unless you change your group roles often the default cache settings should be fine. The cache works by saving request responses for a set amount of time (of course), but will refresh immediately if the item has expired. You may also set a time (or boolean) in which the item will serve an item based on the conditions above but silently refresh it if that has expired.

To use this with HttpService simply set up API's on your node server for accessing the functions, you can use the example server outlined in the below example server section as a base. A usable express server utilizing this module is available [here](https://github.com/sentanos/roblox-js-server) and includes a detailed tutorial for setup on a free host as well as Lua scripts for sending requests to the server from in-game.

## Prerequisites

- [**Node.js**](https://nodejs.org/en/download/current/)

## Installation

With node.js installed, simply run: `npm install roblox-js`. That's it!

## Documentation

You can find the roblox-js wiki with all the functions [here](https://github.com/OnlyTwentyCharacters/roblox-js/wiki)!
