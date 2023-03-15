// Includes
const shortPoll = require('../util/shortPoll.js').func
const getWall = require('./getWall.js').func

// Args
exports.required = ['group']
exports.optional = ['view', 'jar']

// Docs
/**
 * 🔐 An event for when someone posts on the group wall.
 * @category Group
 * @alias onWallPost
 * @param {number} group - The id of the group.
 * @returns An EventEmitter that emits when someone posts on the group wall.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const wallpostEvent = noblox.onWallPost(1)
 * wallpostEvent.on("data", function(data) {
 *  console.log("New post!", data)
 * })
 * wallpostEvent.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

// Define
exports.func = function (args) {
  const group = args.group
  const jar = args.jar
  const view = args.view
  return shortPoll({
    getLatest: function (latest) {
      return getWall({ group: group, jar: jar, sortOrder: 'Desc' })
        .then(function (wall) {
          const posts = wall.data
          const given = []
          for (let i = posts.length - 1; i >= 0; i--) {
            const post = posts[i]
            const id = post.id
            if (id > latest) {
              latest = id
              if (view) {
                post.view = wall.views[post.parent.page]
              }
              given.push(post)
            }
          }
          return {
            latest: latest,
            data: given
          }
        })
    },
    delay: 'onWallPost'
  })
}
