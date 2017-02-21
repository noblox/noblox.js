// Dependencies
var Promise = require('bluebird');

// Includes
var settings = require('../../settings.json');
var shortPoll = require('../util/shortPoll.js').func;
var getJoinRequests = require('../util/getJoinRequests.js').func;
var handleJoinRequestId = require('../util/handleJoinRequestId.js').func;

// Args
exports.required = ['group'];
exports.optional = ['jar'];

// Define
exports.func = function (args) {
  var group = args.group;
  var jar = args.jar;
  var timeout = settings.event.timeout;
  function getLatest (latest, evt) {
    return getJoinRequests({jar: jar, group: group})
    .timeout(timeout)
    .then(function (requests) {
      var jobs = [];
      var complete = {
        data: [],
        latest: -2,
        repeat: requests.length >= 20
      };
      for (var i = 0; i < requests.length; i++) {
        var request = requests[i];
        jobs.push(request.requestId);
        evt.emit('data', request);
      }
      var handled = 0;
      if (jobs.length > 0) {
        return new Promise(function (resolve, reject) {
          evt.on('handle', function (request, accept, callback) {
            var id = request.requestId;
            handleJoinRequestId({jar: jar, group: group, requestId: id, accept: accept})
            .then(function () {
              handled++;
              if (callback) {
                callback();
              }
              if (handled === jobs.length) {
                evt.removeAllListeners('handle');
                resolve(complete);
              }
            })
            .catch(reject);
          });
        });
      }
      return complete;
    });
  }
  return shortPoll({
    getLatest: getLatest,
    delay: 'onJoinRequestHandle',
    timeout: -1
  });
};
