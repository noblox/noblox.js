// Includes
const http = require('./http.js').func

// Args
exports.required = ['url', 'query', 'limit']
exports.optional = ['jar', 'sortOrder']

// Define
function getPageResults (jar, url, query, sortOrder, limit, pageCursor, results) {
  return new Promise((resolve, reject) => {
    const allowedLimits = [10, 25, 50, 100]

    const httpOpt = {
      url: url,
      options: {
        qs: {
          limit: limit <= 100 ? allowedLimits.reduce((prev, curr) => Math.abs(curr - limit) < Math.abs(prev - limit) ? curr : prev) : 100, // Get the most fit page limit within the boundries.
          cursor: pageCursor || '', // Add page cursor.
          ...query // Add asset types.
        },
        method: 'GET',
        resolveWithFullResponse: true,
        jar: jar,
        json: true
      }
    }
    return http(httpOpt).then((res) => {
      const body = res.body

      if (body.errors && body.errors.length > 0) {
        const errors = body.errors.map((e) => {
          return e.message
        })

        throw new Error(`${res.statusCode} ${errors.join(', ')}`)
      }

      results = results ? results.concat(body.data) : body.data

      if (results.length > limit) {
        results = results.slice(0, limit)
      }

      if (results.length >= limit || body.data.length === 0 || !body.nextPageCursor) {
        return resolve(results)
      }

      resolve(getPageResults(jar, url, query, sortOrder, limit, body.nextPageCursor, results))
    })
  })
}

function parseDates (results) {
  return new Promise((resolve, reject) => {
    resolve(results.map(result => {
      if (result.created) result.created = new Date(result.created)
      if (result.updated) result.updated = new Date(result.updated)
      return result
    }))
  })
}

exports.func = function (args) {
  return getPageResults(args.jar, args.url, args.query, args.sortOrder, args.limit).then(results => {
    return parseDates(results)
  })
}
