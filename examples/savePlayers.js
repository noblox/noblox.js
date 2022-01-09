/**
 * About:
 * Saves group players to a JSON file with optional filtering.
 *
 * NOTE: By default, this will save all players found. Change the body of shouldSave to alter this behaviour.
 */

// Settings
const cookie = process.env.COOKIE || '' // Roblox account .ROBLOSECURITY cookie
const outputFile = 'players.json' // Output file name
const options = {
  group: 0, // Group ID
  all: true, // Get all members of group - NOTE: Overrides roleset option
  roleset: [1, 2, 3], // Array of roleset IDs - NOTE: This is not the same as role number
  limit: -1, // Save limit - NOTE: When <= 0 there is no limit
  sortOrder: 'Asc' // Sort order: "Asc" or "Desc"
}

function shouldSave (player) {
  /*
  if (player.username === "Bob") {
    return true // Save Bob
  } else if (player.username.toLowerCase().includes("bot")) {
    return true // Save users with username containing "bot"
  } else if (player.userId > 1000000000) {
    return true // Save users with userId over 1 billion
  }

  return false
  */

  return true // Save all players found
}

// Dependencies
const noblox = require('noblox.js')
const js = require('JSONStream')
const fs = require('fs')

// Main
const stream = js.stringify('[\n  ', ',\n  ', '\n]\n')
const output = fs.createWriteStream(`./${outputFile}`)
stream.pipe(output)

noblox.setCookie(cookie)
  .then(async () => {
    console.time('Time taken')

    const getRolesOptions = {
      group: options.group
    }

    const groupRoles = await noblox.getRoles(getRolesOptions)
    let targetRoles = []

    if (options.all) {
      targetRoles = groupRoles
    } else {
      for (const role of groupRoles) {
        if (options.roleset.includes(role.id)) {
          targetRoles.push(role)
        }

        if (targetRoles.length === options.roleset.length) {
          break
        }
      }
    }

    if (targetRoles.length === 0) {
      console.error('No roles matching the roleset IDs were found.')

      return
    }

    options.roleset = targetRoles.map((role) => {
      return role.id
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
      sortOrder: options.sortOrder,
      rolesetId: options.roleset
    }

    const groupPlayers = await noblox.getPlayers(getPlayersOptions)

    console.log(`Writing ${totalPlayers} players to file...`)

    for (const player of groupPlayers) {
      if (shouldSave(player)) {
        stream.write(player)
      }
    }

    stream.end()

    console.log(`Done, check ${outputFile} file.`)
    console.timeEnd('Time taken')
  })
