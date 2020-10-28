/**
 * About:
 * Exiles group members with optional filtering.
 *
 * NOTE: By default, this will exile all players in the rolesets provided. Change the body of shouldExile to alter this behaviour.
 */

// Settings
const cookie = process.env.COOKIE || '' // Roblox account .ROBLOSECURITY cookie
const options = {
  group: 0, // Group ID
  roleset: [1, 2, 3], // Array of roleset IDs - NOTE: This is not the same as role number
  limit: -1, // Search limit - NOTE: When <= 0 there is no limit
  exileLimit: -1, // Exile limit - NOTE: When <= 0 there is no limit
  sortOrder: 'Asc' // Sort order: "Asc" or "Desc"
}

function shouldExile (player) {
  /*
  if (player.username === "Bob") {
    return true // Exile Bob
  } else if (player.username.toLowerCase().includes("bot")) {
    return true // Exile users with username containing "bot"
  } else if (player.userId > 1000000000) {
    return true // Exile users with userId over 1 billion
  }

  return false
  */

  return true // Exile all players found
}

// Dependencies
const rbx = require('noblox.js')
const logUpdate = require('log-update')

const players = {
  passed: 0,
  exiled: 0,
  failed: 0
}

rbx.setCookie(cookie)
  .then(async () => {
    console.time('Time taken')

    const getRolesOptions = {
      group: options.group
    }

    const groupRoles = await rbx.getRoles(getRolesOptions)
    const targetRoles = []

    for (const role of groupRoles) {
      if (options.roleset.includes(role.ID)) {
        targetRoles.push(role)
      }

      if (targetRoles.length === options.roleset.length) {
        break
      }
    }

    if (targetRoles.length === 0) {
      console.error('No roles matching the roleset IDs were found.')

      return
    }

    options.roleset = targetRoles.map((role) => {
      return role.ID
    })

    let totalPlayers = 0

    for (const role of targetRoles) {
      totalPlayers += role.memberCount
    }

    if (options.limit > 0) {
      totalPlayers = Math.min(options.limit, totalPlayers)
    }

    if (totalPlayers >= 10000) {
      console.log(`Fetching ${totalPlayers} players, this will take a while...`)
    } else if (totalPlayers >= 2000) {
      console.log(`Fetching ${totalPlayers} players, this may take a while...`)
    } else {
      console.log(`Fetching ${totalPlayers} players...`)
    }

    const getPlayersOptions = {
      group: options.group,
      limit: 100,
      sortOrder: options.sortOrder
    }

    const groupPlayers = await rbx.getPlayers(getPlayersOptions)

    const logUpdater = setInterval(() => {
      logUpdate(`Got ${groupPlayers.length} players, exiling...\nPassed: ${players.passed}\nExiled: ${players.exiled}\nFailed: ${players.failed}`)

      if (players.passed + players.exiled + players.failed === groupPlayers.length) {
        clearInterval(logUpdater)

        console.timeEnd('Time taken')
      }
    }, 100)

    groupPlayers.forEach((player) => {
      if (shouldExile(player)) {
        const exileOptions = {
          group: options.group,
          target: player.userId
        }

        rbx.exile(exileOptions)
          .then(() => {
            players.exiled++
          })
          .catch(() => {
            players.failed++
          })
      } else {
        players.passed++
      }
    })
  })
