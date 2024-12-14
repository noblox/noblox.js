const http = require('../util/http.js').func

exports.required = ['universeId', 'userId', 'assetId', 'parameters']
exports.optional = ['jar']

// Docs
/**
 * ☁️ Send a universe notification to a user.
 * @category Game
 * @alias sendUserNotification
 * @param {number} universeId - The id of the universe.
 * @param {number} userId - The id of the target player.
 * @param {string} assetId - The asset id of the notification.
 * @param {UserNotificationPayloadParameters} parameters - The notification parameters.
 * @returns {Promise<boolean>}
 * @example const noblox = require("noblox.js")
 * // Set API key
 * const parameters = {
 *      myMessage: { stringValue: "Hello world!" }
 * }
 * const assetId = "774d62e5-3414-b84a-89dd-77d96f1a3d33"
 * noblox.sendUserNotification(4434277335, 1210019099, assetId, parameters)
 **/

function sendUserNotification (universeId, userId, assetId, parameters, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//apis.roblox.com/cloud/v2/users/${userId}/notifications`,
      options: {
        json: true,
        resolveWithFullResponse: true,
        jar,
        method: 'POST',
        body: {
          source: {
            universe: `universes/${universeId}`
          },
          payload: {
            type: 'MOMENT',
            messageId: assetId,
            parameters
          }
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(true)
        } else {
          if (typeof res.body === 'string') {
            reject(new Error(`[${res.statusCode}] ${res.statusMessage} ${res.body}`))
          } else {
            const data = Object.assign(res.body)
            reject(new Error(`[${res.statusCode}] ${data.Error} ${data.Message}`))
          }
        }
      })
      .catch(reject)
  })
}

exports.func = function (args) {
  return sendUserNotification(args.universeId, args.userId, args.assetId, args.parameters, args.jar)
}
