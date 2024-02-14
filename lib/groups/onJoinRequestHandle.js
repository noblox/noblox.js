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
 * 🔐 An event for when someone is added to the join requests, which allows you to handle the join request as part of a
 * screening process. Emits all join requests and waits until all of them have been resolved by firing the handle event
 * with the request and either true or false. You can also pass a third argument callback to handle to execute once the
 * join request has been handled.
 * Once all requests on a page have been resolved, the next page is collected. Make sure that all join requests are handled in some way.
 * Because this function has to wait for input, it does handle timeouts but does them within the function as opposed to within shortPoll.
 *
 * The use of this function is generally pretty complex. If it is not as working as you expect, you may actually be wanting
 * to use `onJoinRequest`.
 * @category Group
 * @alias onJoinRequestHandle
 * @param {number} group - The id of the group.
 * @returns An EventEmitter that emits when someone tries to join.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 *
 * var blacklist = [1, 261]
 * var evt = noblox.onJoinRequestHandle(18)
 * evt.on('data', function (request) {
 * noblox.getIdFromUsername(request.username).then(function (id) {
 * for (var i = 0; i < blacklist.length; i++) {
 *    if (blacklist[i] === id) {
 *      evt.emit('handle', request, false);
 *      return;
 *    }
 *  }
 *  evt.emit('handle', request, true, function () {
 *    console.log(`Welcome ${id} to the group`)
 *  });
 *});
 *});
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
              handleJoinRequest({ jar, group, userId: id, accept })
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
    getLatest,
    delay: 'onJoinRequestHandle',
    timeout: -1
  })
}
