// Includes
const settings = require('../../settings.json')

// Args
exports.required = ['getPage', 'start', 'end']

// Define
exports.func = function (args) {
  const getPage = args.getPage
  const start = args.start
  const end = args.end
  let completed = 0
  let expected = end - start
  let rslv
  function next (i, ivl, tries) {
    if (i >= end) {
      return
    }
    if (i < start) {
      next(i + ivl, ivl, 0)
      return
    }
    if (tries > 2) {
      expected--
      console.error('Ran out of tries for ' + i)
      if (completed >= expected) {
        rslv()
      } else {
        next(i + ivl, ivl, 0)
      }
      return
    }
    const res = getPage(i)
    if (res && res.then) {
      res.then(function () {
        completed++
        if (completed >= expected) {
          rslv()
          return
        }
        next(i + ivl, ivl, 0)
      })
        .catch(function (err) {
          if (!err.stack.includes('ESOCKETTIMEDOUT')) { // Silence common socket timeout errors
            console.error('Thread error: ' + err.stack)
          }
          setTimeout(next, 5000, i, ivl, tries + 1)
        })
    } else {
      expected--
      if (completed >= expected) {
        rslv()
        return
      }
      next(i + ivl, ivl, 0)
    }
  }

  const promise = new Promise(function (resolve) {
    rslv = resolve
    if (expected <= 0) {
      resolve()
      return
    }
    const ivl = Math.min(settings.maxThreads, expected)
    for (let i = 0; i < ivl; i++) {
      next(i, ivl, 0)
    }
  })
  promise.getStatus = function () {
    return Math.round((completed / expected) * 10000) / 100 || 0
  }
  promise.getCompleted = function () {
    return completed
  }
  promise.getExpected = function () {
    return expected
  }
  return promise
}
