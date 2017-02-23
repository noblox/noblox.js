// Includes
var promise = require('../util/promise.js');
var options = require('../options.js');

// Define
module.exports = function (type, index, func, handler) {
  var group = options.queue[type];
  if (!group[index]) {
    group[index] = {
      jobs: []
    };
  }
  var home = group[index];
  function run (time) {
    return function (resolve, reject) {
      setTimeout(function () {
        func().then(resolve).catch(reject);
      }, time);
    };
  }
  function deactivate (err) {
    jobs.shift();
    if (!handler(err)) {
      home.last = Date.now();
    }
  }
  function next () {
    jobs.shift();
    home.last = Date.now();
  }
  if (group.delay > 0) {
    var jobs = home.jobs;
    var delay = group.delay;
    var last = home.last;
    if (jobs.length === 0) {
      var item;
      var diff = Date.now() - last;
      if (!last || diff > delay) {
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
