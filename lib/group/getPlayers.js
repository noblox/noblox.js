// Includes
const request = require("request");

// Args
exports.required = ['group', ['roleset']]

function getPlayerData(groupId, roleId, pageCursor, currentPlayers) {
    if (!pageCursor) pageCursor = "";
    if (!currentPlayers) currentPlayers = [];

    return new Promise((resolve, reject) => {
        request.get({
            url: `https://groups.roblox.com/v1/groups/${groupId}/roles/${roleId}/users?cursor=${pageCursor}&limit=100&sortOrder=Desc`,
            json: true,
        }, (err, res, body) => {
            if (err) return reject(err);
            if (res.statusCode !== 200) return reject(new Error(res.statusCode + " : " + res.statusMessage));

            var nextPageCursor = body["nextPageCursor"];
            var dataArray = body["data"];

            if (!dataArray) return reject(new Error("Error while retreiving players!"));
            if (nextPageCursor === null) {
                if (dataArray.length > 0) {
                    currentPlayers = currentPlayers.concat(dataArray);
                }
                return resolve(currentPlayers);
            }
            currentPlayers = currentPlayers.concat(dataArray);
            getPlayerData(groupId, roleId, nextPageCursor, currentPlayers)
        });
    });
}

function getPlayers(groupId, rolesetIds, pageCursor, currentPlayers) {
    return new Promise((resolve, reject) => {
        if (!pageCursor) pageCursor = "";
        currentPlayers = [];

        for (var i = 0; i < rolesetIds.length; i++) {
            try {
                throw i;
            } catch (ii) {
                getPlayerData(groupId, rolesetIds[ii]).then(newData => {
                    currentPlayers = currentPlayers.concat(newData);
                    if (rolesetIds[rolesetIds.length-1] === rolesetIds[ii]) {
                        setTimeout(function() {
                            return resolve(currentPlayers)
                        }, 50);
                    };
                })
                .catch(error => {
                    reject(error);
                });
            }
        }
    });
}

exports.func = function(args) {
    return getPlayers(args.group, args.roleset)
}