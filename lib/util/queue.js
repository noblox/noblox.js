// Includes
var promise = require('../util/promise.js');
var options = require('../options.js');

// Define
module.exports = function (type, index, ignoreFailures, func, handler) {
  var group = options.queue[type];
  var ignore = false;
  function run (time) {
    return function (resolve, reject) {
      setTimeout(function () {
        func().then(resolve).catch(reject);
      }, time);
    };
  }
  function deactivate (err) {
    jobs.shift();
    if (ignoreFailures) {
      ignore = true;
    }
    throw err;
  }
  function next () {
    if (ignore) {
      ignore = false;
    }
    jobs.shift();
    group.last = Date.now();
  }
  if (group.delay > 0) {
    var jobs;
    var home = group.jobs;
    if (!home[index]) {
      home[index] = [];
    }
    jobs = home[index];
    var delay = group.delay;
    var last = group.last;
    if (jobs.length === 0) {
      var item;
      var diff = Date.now() - last;
      if (ignore || !last || diff > delay) {
        if (ignore) {
          ignore = false;
        }
        item = func();
      } else {
        item = promise(run(delay - diff));
      }
      jobs.push(item);
      item.then(next).catch(deactivate);
      return item;
    } else {
      var job = jobs[jobs.length - 1].then(function () {
        var item = promise(run(delay));
        item.then(next).catch(deactivate);
        return item;
      }).catch(function (err) {
        var item = handler && handler(err) ? func() : promise(run(delay));
        item.then(next).catch(deactivate);
        return item;
      });
      jobs.push(job);
      return job;
    }
  } else {
    return promise(func);
  }
};
