// Includes
const http = require('../util/http').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['badgeId']
exports.optional = ['name', 'description', 'enabled', 'jar']

// Define
const updateInfo = async (id, name, desc, enabled, xcrsf, jar) => {
  return http({
    url: `https://badges.roblox.com/v1/badges/${id}`,
    options: {
      resolveWithFullResponse: true,
      method: 'PATCH',
      jar: jar,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': xcrsf
      },
      body: JSON.stringify({
        name: name,
        description: desc,
        enabled: enabled
      })
    }
  }).then(res => {
    if (res.statusCode === 200) {
      const json = JSON.parse(res.body)
      return json
    } else if (res.statusCode === 400) {
      throw new Error('Text moderated.')
    } else if (res.statusCode === 401) {
      throw new Error('Authorization has been denied for this request.')
    } else if (res.statusCode === 403) {
      throw new Error('Token Validation failed or you do not have permission to manage this badge.')
    } else if (res.statusCode === 404) {
      throw new Error('Badge is invalid or does not exist.')
    }
  })
}

const runWithToken = (args) => {
  const name = args.name || ''
  const description = args.description || ''
  const enabled = args.enabled || true
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then(xcrsf => {
    return updateInfo(args.badgeId, name, description, enabled, xcrsf, jar)
  })
}
exports.func = async (args) => {
  if (isNaN(args.badgeId)) {
    throw new Error('The provided Badge ID is not a number.')
  }
  if (args.name) {
    if (typeof args.name !== 'string') throw new Error('The name must be a string.')
  } else if (args.description) {
    if (typeof args.description !== 'string') throw new Error('The description must be a string.')
  }

  if (args.enabled) {
    if (typeof args.enabled !== 'boolean') {
      throw new Error('Enabled must be a boolean.')
    }
  }

  return runWithToken(args)
}
