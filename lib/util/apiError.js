// The data should be a response object

class RobloxAPIError extends Error {
  constructor (data) {
    super(getResponseBody(data))

    this.name = 'RobloxAPIError'
    this.httpStatusCode = data.statusCode
    this.responseBody = getResponseBody(data)
  }

  get error () {
    let obj

    try {
      obj = JSON.parse(this.responseBody)
    } catch {
      return { code: 0, message: this.responseBody.toString() }
    }

    if (Object.hasOwn(obj, 'error')) return obj.error // V1 open cloud and some very old BEDEV1 endpoints + some global errors

    else if (Object.hasOwn(obj, 'errors')) { // Most BEDEV1 endpoints
      return obj.errors.at(0) // In spite of BEDEV1 endpoint errors being nested in an array, they are never seen in groups.
    } else if (Object.hasOwn(obj, 'code') && Object.hasOwn(obj, 'message')) { // V2 open cloud
      return obj
    } else return { code: 0, message: this.responseBody } // Roblox did a funny (i.e. the platform is down)
  }

  get caller() {
    try {
      // https://stackoverflow.com/a/57023880
      return (new Error()).stack?.split("\n")[2]?.trim().split(" ").at(1) ?? null
    } catch {
      return null
    }
  }
}

function getResponseBody (data) {
  if (typeof data.body === 'string') return data.body

  try {
    return JSON.stringify(data.body)
  } catch {
    throw Error('The passed response body is not a valid object')
  }
}

module.exports = RobloxAPIError
