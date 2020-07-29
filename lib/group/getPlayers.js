// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['group', ['roleset']]
exports.optional = ['sortOrder', 'limit', 'cursor', 'jar']

// Define
function getPlayersInRoleOnPage (jar, group, rolesetId, sortOrder, limit, cursor) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//groups.roblox.com/v1/groups/${group}/roles/${rolesetId}/users?cursor=${cursor}&limit=${limit}&sortOrder=${sortOrder}`,
      options: {
        method: 'GET',
        jar: jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.body))
        } else {
          const body = JSON.parse(res.body) || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          }
        }
      })
  })
}

function getPlayersInRole (jar, group, rolesetId, sortOrder, limit, cursor, currentPlayers) {
  return new Promise((resolve, reject) => {
    if (!currentPlayers) currentPlayers = []

    getPlayersInRoleOnPage(jar, group, rolesetId, sortOrder, 100, cursor, currentPlayers)
      .then(function (pageData) {
        const nextPageCursor = pageData.nextPageCursor
        const dataArray = pageData.data

        if (!dataArray) return reject(new Error('Error while retreiving players!'))

        currentPlayers = currentPlayers.concat(dataArray)

        if (limit > 0 && currentPlayers.length >= limit) {
          return resolve(currentPlayers.slice(0, limit))
        } else if (nextPageCursor === null) {
          return resolve(currentPlayers)
        }

        getPlayersInRole(jar, group, rolesetId, sortOrder, limit, nextPageCursor, currentPlayers)
          .then(function (newCurrentPlayers) {
            return resolve(newCurrentPlayers)
          })
      })
  })
}

async function getPlayersInRoles (jar, group, rolesetIds, sortOrder, limit, cursor) {
  let currentPlayers = []

  for (let i = 0; i < rolesetIds.length; i++) {
    const rolesetId = rolesetIds[i]
    const roleLimit = limit <= 0 ? limit : limit - currentPlayers.length

    await getPlayersInRole(jar, group, rolesetId, sortOrder, roleLimit, cursor)
      .then((newData) => {
        currentPlayers = currentPlayers.concat(newData)
      })
      .catch((error) => {
        throw new Error(error)
      })

    if (limit > 0 && currentPlayers.length >= limit) {
      return currentPlayers
    }
  }

  return currentPlayers
}

exports.func = function (args) {
  const jar = args.jar
  const rolesetIds = Array.isArray(args.roleset) ? args.roleset : [args.roleset]
  const sortOrder = args.sortOrder || 'Desc'
  const limit = args.limit || -1
  const cursor = args.cursor || ''
  return getPlayersInRoles(jar, args.group, rolesetIds, sortOrder, limit, cursor)
}
