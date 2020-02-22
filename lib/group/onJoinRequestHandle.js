// Dependencies
var Promise = require('bluebird')

// Includes
var settings = require('../../settings.json')
var shortPoll = require('../util/shortPoll.js').func
var getJoinRequests = require('./getJoinRequests.js').func
var handleJoinRequest = require('./handleJoinRequest.js').func

// Args
exports.required = ['group']
exports.optional = ['jar']

async function getRequests (jar, group, cursor) {
  const requests = []
  await getJoinRequests({ jar, group, cursor, limit: 100 }).timeout(settings.event.timeout).then(async (res) => {
    requests.push.apply(requests, res.data)
    if (res.nextPageCursor) {
      requests.push.apply(requests, await getRequests(jar, group, res.nextPageCursor))
    }
  })
  return requests
}

// Define
exports.func = function (args) {
  var group = args.group
  var jar = args.jar
  function getLatest (latest, evt) {
    return getRequests(jar, group)
      .then(function (requests) {
        var complete = {
          data: [],
          latest: -2,
          repeat: requests.length >= 20
        }
        var handled = 0
        var promise
        if (requests.length > 0) {
          promise = new Promise(function (resolve, reject) {
            evt.on('handle', function (request, accept, callback) {
              var id = request.requester.userId
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
        for (var i = 0; i < requests.length; i++) {
          var request = requests[i]
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
