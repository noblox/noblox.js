// Includes
const promise = require('./promise.js')
const options = require('../options.js')

// Define
module.exports = function (type, index, func, handler) {
  const group = options.queue[type]
  if (!group[index]) {
    group[index] = {
      jobs: []
    }
  }
  const home = group[index]
  function run (time) {
    return function (resolve, reject) {
      setTimeout(function () {
        func().then(resolve).catch(reject)
      }, time)
    }
  }
  const jobs = home.jobs
  function deactivate (err) {
    jobs.shift()
    if (!handler(err)) {
      home.last = Date.now()
    }
  }
  function next () {
    jobs.shift()
    home.last = Date.now()
  }
  if (group.delay > 0) {
    const delay = group.delay
    const last = home.last
    if (jobs.length === 0) {
      let item
      const diff = Date.now() - last
      if (!last || diff > delay) {
        item = func()
      } else {
        item = promise(run(delay - diff))
      }
      jobs.push(item)
      item.then(next).catch(deactivate)
      return item
    } else {
      const job = jobs[jobs.length - 1].then(function () {
        const item = promise(run(delay))
        item.then(next).catch(deactivate)
        return item
      }).catch(function (err) {
        const item = handler && handler(err) ? func() : promise(run(delay))
        item.then(next).catch(deactivate)
        return item
      })
      jobs.push(job)
      return job
    }
  } else {
    return func()
  }
}
