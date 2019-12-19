// Includes
var shortPoll = require('../util/shortPoll.js').func
var getWall = require('./getWall.js').func

// Args
exports.required = ['group']
exports.optional = ['view', 'jar']

// Define
exports.func = function (args) {
  var group = args.group
  var jar = args.jar
  var view = args.view
  return shortPoll({
    getLatest: function (latest) {
      return getWall({ group: group, jar: jar, sortOrder: 'Desc' })
        .then(function (wall) {
          var posts = wall.data
          var given = []
          for (var i = posts.length - 1; i >= 0; i--) {
            var post = posts[i]
            var id = post.id
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
