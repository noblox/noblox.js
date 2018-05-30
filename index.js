const Client = require("./lib/Client");

function Noblox(username, password, options) {
    return new Client(username, password, options);
}

Noblox.RobloxUser = require('./lib/structures/RobloxUser')

module.exports = Noblox;
