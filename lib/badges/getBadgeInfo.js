// Includes
const http = require('../util/http').func

// Args
exports.required = ['badgeId']

// Define
const badgeInfo = async (id) => {
  return http({
    url: `https://badges.roblox.com/v1/badges/${id}`,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }).then(res => {
    if (res.statusCode === 200) {
      const json = JSON.parse(res.body)
      return json
    } else {
      throw new Error('Badge is invalid or does not exist.')
    }
  })
}

exports.func = async (args) => {
  if (isNaN(args.badgeId)) {
    throw new Error('The provided Badge ID is not a number.')
  }
  return badgeInfo(args.badgeId)
}
