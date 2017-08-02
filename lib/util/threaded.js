// Dependencies
var Promise = require('bluebird');

// Includes
var settings = require('../../settings.json');

// Args
exports.required = ['getPage', 'start', 'end'];

// Define
exports.func = function (args) {
  var getPage = args.getPage;
  var start = args.start;
  var end = args.end;
  var completed = 0;
  var expected = end - start;
  var rslv;
  function next (i, ivl, tries) {
    if (i >= end) {
      return;
    }
    if (i < start) {
      next(i + ivl, ivl, 0);
      return;
    }
    if (tries > 2) {
      expected--;
      console.error('Ran out of tries for ' + i);
      if (completed >= expected) {
        rslv();
      } else {
        next(i + ivl, ivl, 0);
      }
      return;
    }
    var res = getPage(i);
    if (res && res.then) {
      res.then(function () {
        completed++;
        if (completed >= expected) {
          rslv();
          return;
        }
        next(i + ivl, ivl, 0);
      })
      .catch(function (err) {
        if (!err.stack.includes('ESOCKETTIMEDOUT')) { // Silence common socket timeout errors
          console.error('Thread error: ' + err.stack);
        }
        setTimeout(next, 5000, i, ivl, tries + 1);
      });
    } else {
      expected--;
      if (completed >= expected) {
        rslv();
        return;
      }
      next(i + ivl, ivl, 0);
    }
  }

  var promise = new Promise(function (resolve) {
    rslv = resolve;
    if (expected <= 0) {
      resolve();
      return;
    }
    var ivl = Math.min(settings.maxThreads, expected);
    for (var i = 0; i < ivl; i++) {
      next(i, ivl, 0);
    }
  });
  promise.getStatus = function () {
    return Math.round((completed / expected) * 10000) / 100 || 0;
  };
  promise.getCompleted = function () {
    return completed;
  };
  promise.getExpected = function () {
    return expected;
  };
  return promise;
};
