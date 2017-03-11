// Includes
var shortPoll = require('../util/shortPoll.js').func;
var getShout = require('../util/getShout.js').func;

// Args
exports.required = ['group'];
exports.optional = ['jar'];

// Define
exports.func = function (args) {
  var empty = false;
  return shortPoll({
    getLatest: function (latest) {
      return getShout({group: args.group, jar: args.jar})
      .then(function (shout) {
        var given = [];
        if (shout) {
          var date = shout.date;
          if (date > latest) {
            latest = date;
            given.push(shout);
          }
          empty = false;
        } else if (!empty) {
          date = new Date();
          given.push({message: '', date: date, author: {name: '', id: -1}});
          latest = date;
          empty = true;
        }
        return {
          latest: latest,
          data: given
        };
      });
    },
    delay: 'onShout'
  });
};
