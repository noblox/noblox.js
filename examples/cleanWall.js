/**
 * About:
 * Deletes group wall posts with optional filtering.
 *
 * NOTE: By default, this will delete all wall posts. Change the body of shouldDelete to alter this behaviour.
 */

// Settings
const cookie = process.env.COOKIE || '' // Roblox account .ROBLOSECURITY cookie
const options = {
  group: 0, // Group ID
  sortOrder: 'Asc' // Sort order: "Asc" or "Desc"
}

function shouldDelete (wallPost) {
  /*
  if (wallPost.poster === null) {
    return true // Deleted posts from deleted users
  } else if (wallPost.poster.username === "Bob") {
    return true // Delete posts from Bob
  } else if (wallPost.body.toLowerCase().includes("noob")) {
    return true // Delete post containing "noob", case insensitive
  }

  return false
  */

  return true // Delete all posts
}

// Dependencies
const rbx = require('noblox.js')
const logUpdate = require('log-update')

// Main
let scanning = true
const posts = {
  scanned: 0,
  filtered: 0,
  deleted: 0,
  failed: 0
}

async function getWallPage (getWallOptions, cursor) {
  getWallOptions.cursor = cursor || ''

  const wallPage = await rbx.getWall(getWallOptions)

  return wallPage
}

function filterWallPosts (wallPosts) {
  const filteredPostIDs = []

  for (const wallPost of wallPosts) {
    if (shouldDelete(wallPost)) {
      posts.filtered++
      filteredPostIDs.push(wallPost.id)
    }
  }

  return filteredPostIDs
}

function deleteWallPosts (wallPostIDs) {
  wallPostIDs.forEach((wallPostID) => {
    const deleteWallPostOptions = {
      group: options.group,
      id: wallPostID
    }

    rbx.deleteWallPost(deleteWallPostOptions)
      .then(() => {
        posts.deleted++
      })
      .catch((e) => {
        posts.failed++
      })
  })
}

rbx.setCookie(cookie)
  .then(async () => {
    console.time('Time taken')

    const logUpdater = setInterval(() => {
      logUpdate(`Scanned: ${posts.scanned}\nFiltered: ${posts.filtered}\nDeleted: ${posts.deleted}\nFailed: ${posts.failed}`)

      if (!scanning && posts.deleted + posts.failed === posts.filtered) {
        clearInterval(logUpdater)

        console.timeEnd('Time taken')
      }
    }, 100)

    let wallPage = await getWallPage(options)
    posts.scanned += wallPage.data.length

    deleteWallPosts(filterWallPosts(wallPage.data))

    while (wallPage.nextPageCursor !== null) {
      wallPage = await getWallPage(options, wallPage.nextPageCursor)
      posts.scanned += wallPage.data.length

      deleteWallPosts(filterWallPosts(wallPage.data))
    }

    scanning = false
  })
