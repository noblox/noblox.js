// Includes
const settings = require('../../settings.json')
const shortPoll = require('../util/shortPoll.js').func
const getJoinRequests = require('./getJoinRequests.js').func
const promiseTimeout = require('../internal/timeout')

// Args
exports.required = ['group']
exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when someone makes a request to join the group.
 * @category Group
 * @alias onJoinRequest
 * @param {number} group - The id of the group.
 * @returns An EventEmitter that emits when someone tries to join.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const e = noblox.onJoinRequest()
 * e.on("data", function(data) {
 *  console.log("New request!", data)
 * })
 * e.on("error", function (err) {
 *   ...
 * })
 **/

async function getRequests (jar, group, cursor) {
  const requests = []
  const res = await promiseTimeout(getJoinRequests({ jar, group, cursor, limit: 100 }), settings.event.timeout, 'getRequests onJoinRequests internal')
  requests.push.apply(requests, res.data)
  if (res.nextPageCursor) {
    requests.push.apply(requests, await getRequests(jar, group, res.nextPageCursor))
  }
  return requests
}

// Define
exports.func = function (args) {
  return shortPoll({
    getLatest: function (latest) {
      return getRequests(args.jar, args.group)
        .then(function (requests) {
          const given = []
          for (const key in requests) {
            if (Object.prototype.hasOwnProperty.call(requests, key)) {
              const date = new Date(requests[key].created.slice(0, requests[key].created.lastIndexOf('.')))
              if (date > latest) {
                latest = date
                given.push(requests[key])
              }
            }
          }
          return {
            latest: latest,
            data: given
          }
        })
    },
    delay: 'onJoinRequest'
  })
}
