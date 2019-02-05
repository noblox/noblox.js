// Includes
const request = require("request");

// Args
exports.required = ['group', 'roleset']

function getPlayers(groupId, roleId, pageCursor, currentPlayers) {
    return new Promise((resolve, reject) => {
        if (!currentPlayers) currentPlayers = [];
        if(!pageCursor) pageCursor = "";
        request.get({
            url: `https://groups.roblox.com/v1/groups/${groupId}/roles/${roleId}/users?cursor=${pageCursor}&limit=100&sortOrder=Desc`,
            json: true,
        }, (err, res, body) => {
            if (res.statusCode !== 200) return reject(`Error while retreiving players, please verify that the groupId and roleset are correct.`);

            var nextPageCursor = body["nextPageCursor"];
            var fetchedPlayerData = body["data"];

            if (!fetchedPlayerData) return reject("Error while retreiving players, please try again.");
            if (nextPageCursor === null) {
                if (fetchedPlayerData.length > 0) {
                    currentPlayers = currentPlayers.concat(fetchedPlayerData);
                }
                return resolve(currentPlayers);
            }
            if (fetchedPlayerData.length > 0) {
                currentPlayers = currentPlayers.concat(fetchedPlayerData);
            }
            
            getPlayers(groupId, roleId, nextPageCursor, currentPlayers)
            .then(allFetchedPlayers => {
                resolve(allFetchedPlayers);
            }).catch(err => {
                reject(err);
            });
        });
    });
}

exports.func = function(args) {
  return getPlayers(args.group, args.roleset)
}
