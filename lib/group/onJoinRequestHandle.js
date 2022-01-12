// Includes
const settings = require('../../settings.json')
const shortPoll = require('../util/shortPoll.js').func
const getJoinRequests = require('./getJoinRequests.js').func
const handleJoinRequest = require('./handleJoinRequest.js').func
const promiseTimeout = require('../internal/timeout')

// Args
exports.required = ['group']
exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when someone is added to the join requests.
 * @category Group
 * @alias onJoinRequestHandle
 * @param {number} group - The id of the group.
 * @returns An EventEmitter that emits when someone tries to join.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.onJoinRequestHandle().on("data", function(data) {
 *  console.log("New request!", data)
 * })
**/

async function getRequests (jar, group, cursor) {
  const requests = []
  const res = await promiseTimeout(getJoinRequests({ jar, group, cursor, limit: 100 }), settings.event.timeout)
  requests.push.apply(requests, res.data)
  if (res.nextPageCursor) {
    requests.push.apply(requests, await getRequests(jar, group, res.nextPageCursor))
  }
  return requests
}

// Define
exports.func = function (args) {
  const group = args.group
  const jar = args.jar
  function getLatest (latest, evt) {
    return getRequests(jar, group)
      .then(function (requests) {
        const complete = {
          data: [],
          latest: -2,
          repeat: requests.length >= 20
        }
        let handled = 0
        let promise
        if (requests.length > 0) {
          promise = new Promise(function (resolve, reject) {
            evt.on('handle', function (request, accept, callback) {
              const id = request.requester.userId
              handleJoinRequest({ jar: jar, group, userId: id, accept: accept })
                .then(function () {
                  handled++
                  if (callback) {
                    callback()
                  }
                  if (handled === requests.length) {
                    evt.removeAllListeners('handle')
                    resolve(complete)
                  }
                })
                .catch(reject)
            })
          })
        }
        for (let i = 0; i < requests.length; i++) {
          const request = requests[i]
          evt.emit('data', request)
        }
        if (requests.length > 0) {
          return promise
        }
        return complete
      })
  }
  return shortPoll({
    getLatest: getLatest,
    delay: 'onJoinRequestHandle',
    timeout: -1
  })
}
