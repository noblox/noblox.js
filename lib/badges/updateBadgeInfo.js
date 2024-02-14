// Includes
const http = require('../util/http').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['badgeId']
exports.optional = ['name', 'description', 'enabled', 'jar']

// Docs
/**
 * 🔐 Configure a badge.
 * @category Badges
 * @alias updateBadgeInfo
 * @param {number} badgeId - The badge's id.
 * @param {string=} name - The new name of the badge.
 * @param {string=} description - The new description of the badge.
 * @param {boolean=} enabled - If the badge is enabled.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.updateBadgeInfo(1, "Badge", "A cool badge.", true)
**/

// Define
const updateInfo = (id, name, desc, enabled, xcrsf, jar) => {
  return http({
    url: `https://badges.roblox.com/v1/badges/${id}`,
    options: {
      resolveWithFullResponse: true,
      method: 'PATCH',
      jar,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': xcrsf
      },
      body: JSON.stringify({
        name,
        description: desc,
        enabled
      })
    }
  }).then(res => {
    if (res.statusCode === 200) {
      return JSON.parse(res.body)
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

  const name = args.name || ''
  const description = args.description || ''
  const enabled = args.enabled || true
  const jar = args.jar

  const xcsrf = await getGeneralToken({ jar })
  return updateInfo(args.badgeId, name, description, enabled, xcsrf, jar)
}
