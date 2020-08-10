// Includes
const http = require('../util/http').func

// Args
exports.required = ['userId']
exports.optional = ['limit', 'cursor', 'sortOrder']

// Define
const playerBadges = async (id, limit, cursor, order) => {
  return http({
    url: `https://badges.roblox.com/v1/users/${id}/badges?limit=${limit}&cursor=${cursor}&sortOrder=${order}`,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }).then(res => {
    if (res.statusCode === 200) {
      const json = JSON.parse(res.body)
      return json.data
    } else {
      throw new Error('User is invalid or does not exist.')
    }
  })
}

exports.func = async (args) => {
  if (isNaN(args.userId)) {
    throw new Error('The provided User ID is not a number.')
  };
  if (args.limit) {
    if (![10, 25, 50, 100].includes(args.limit)) {
      throw new Error('The allowed values are: 10, 25, 50 and 100.')
    };
  };
  if (args.sortOrder) {
    if (args.sortOrder.toLowerCase() !== 'asc' && args.sortOrder.toLowerCase() !== 'desc') {
      throw new Error('Invalid sort order type.')
    }
  }
  const limit = args.limit || 10
  const sortOrder = args.sortOrder || 'Asc'
  const cursor = args.cursor || ''
  return playerBadges(args.userId, limit, cursor, sortOrder)
}
