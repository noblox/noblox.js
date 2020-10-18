/**
 * About:
 * Saves wall posts to a JSON file with optional filtering.
 *
 * NOTE: By default, this will save all wall posts. Change the body of shouldSave to alter this behaviour.
 */

// Settings
const cookie = process.env.COOKIE || '' // Roblox account .ROBLOSECURITY cookie
const outputFile = 'wall.json' // Output file name
const options = {
  group: 0, // Group Id
  sortOrder: 'Asc' // Sort order: "Asc" or "Desc"
}

function shouldSave (wallPost) {
  /*
  if (wallPost.poster === null) {
    return true // Save posts from deleted users
  } else if (wallPost.poster.username === "Bob") {
    return true // Save posts from Bob
  } else if (wallPost.body.toLowerCase().includes("noob")) {
    return true // Save post containing "noob", case insensitive
  }

  return false
  */

  return true // Save all posts
}

// Dependencies
const rbx = require('noblox.js')
const logUpdate = require('log-update')
const js = require('JSONStream')
const fs = require('fs')

// Main
const stream = js.stringify('[\n  ', ',\n  ', '\n]\n')
const output = fs.createWriteStream(`./${outputFile}`)
stream.pipe(output)

const wallPosts = {
  found: 0,
  written: 0,
  skipped: 0
}

async function getWallPage (getWallOptions, cursor) {
  getWallOptions.cursor = cursor || ''

  const wallPage = await rbx.getWall(getWallOptions)

  return wallPage
}

function streamWallPageData (wallPageData) {
  for (const wallPost of wallPageData) {
    if (shouldSave(wallPost)) {
      stream.write(wallPost)
      wallPosts.written += 1
    } else {
      wallPosts.skipped += 1
    }
  }
}

rbx.setCookie(cookie)
  .then(async () => {
    console.time('Time taken')

    const logUpdater = setInterval(() => {
      logUpdate(`Found: ${wallPosts.found}\nWritten: ${wallPosts.written}\nSkipped: ${wallPosts.skipped}`)
    }, 100)

    let wallPage = await getWallPage(options)
    wallPosts.found += wallPage.data.length

    streamWallPageData(wallPage.data)

    while (wallPage.nextPageCursor !== null) {
      wallPage = await getWallPage(options, wallPage.nextPageCursor)
      wallPosts.found += wallPage.data.length

      streamWallPageData(wallPage.data)
    }

    stream.end()

    clearInterval(logUpdater)
    logUpdate(`Found: ${wallPosts.found}\nWritten: ${wallPosts.written}\nSkipped: ${wallPosts.skipped}`)

    console.log(`Done, check ${outputFile} file.`)
    console.timeEnd('Time taken')
  })
