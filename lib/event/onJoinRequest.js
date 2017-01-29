// Includes
var shortPoll = require('../util/shortPoll.js').func;
var getJoinRequests = require('../util/getJoinRequests.js').func;

// Args
exports.required = ['group'];
exports.optional = ['jar'];

// Define
exports.func = function (args) {
  return shortPoll({
    getLatest: function (latest) {
      return getJoinRequests({jar: args.jar, group: args.group})
      .then(function (requests) {
        var given = [];
        for (var i = requests.length - 1; i >= 0; i--) {
          var request = requests[i];
          var id = request.requestId;
          if (id > latest) {
            latest = id;
            given.push(request);
          }
        }
        return {
          latest: latest,
          data: given
        };
      });
    },
    interval: 'onJoinRequest'
  });
};
