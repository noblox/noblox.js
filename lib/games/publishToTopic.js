const http = require('../util/http.js').func

exports.required = ['universeId', 'topic', 'data']
exports.optional = ['jar']

// Docs
/**
 * ☁️ Publish a message to a subscribed topic.
 * @category Game
 * @alias postToTopic
 * @param {number} universeId - The id of the universe.
 * @param {string} topic - The name of the topic.
 * @param {Object | string} data - The data to post.
 * @returns {Promise<boolean>}
 * @example const noblox = require("noblox.js")
 * const data = { targetUser: "1210019099" }
 * await noblox.publishToTopic(2152417643, "MyTopic", data)
**/

function publishToTopic (universeId, topic, data, jar) {
  return new Promise((resolve, reject) => {

    const httpOpt = {
      url: `//apis.roblox.com/messaging-service/v1/universes/${universeId}/topics/${topic}`,
      options: {
        json: true,
        resolveWithFullResponse: true,
        jar,
        method: 'POST',
        body: { 'message': JSON.stringify(data) },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }

    return http(httpOpt)
      .then(function ({ statusCode }) {
        switch (statusCode) {
          case 200: resolve(true)
          case 400: reject(new Error(`[${statusCode}] Bad Request, check what data is being sent`))
          case 401: reject(new Error(`[${statusCode}] Unauthorized`))
          case 403: reject(new Error(`[${statusCode}] Forbidden, possible insufficient API key access permissions`))
          case 500: reject(new Error(`[${statusCode}] Internal server error`))
        }
      }).catch(reject)
  })
}

exports.func = function (args) {
  return publishToTopic(args.universeId, args.topic, args.data, args.jar)
}
