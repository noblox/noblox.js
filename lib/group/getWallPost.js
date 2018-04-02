// Includes
var getWall = require('./getWall.js').func

// Args
exports.required = ['group', 'id']
exports.optional = ['page', 'view', 'jar']

function findPost (jar, group, id, page, view, resolve, reject, min, max) {
  getWall({group: group, page: page, view: view})
    .then(function (wall) {
      var posts = wall.posts
      var last
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].id === id) {
          if (view) {
            posts[i].view = wall.views[page]
          }
          resolve(posts[i])
          return
        }
        last = posts[i].id
      }
      if (!min) {
        min = 1
        max = wall.totalPages
      }
      if (last > id) {
        min = page + 1
      } else {
        max = page - 1
      }
      if (min > wall.totalPages || max <= 0) {
        reject('Couldn\'t find post')
        return
      }
      findPost(jar, group, id, Math.floor((min + max) / 2), view, resolve, reject, min, max)
    })
}

function getWallPost (jar, group, id, page, view) {
  return new Promise(function (resolve, reject) {
    findPost(jar, group, id, page || 1, view, resolve, reject)
  })
}

exports.func = function (args) {
  return getWallPost(args.jar, args.group, args.id, args.page, args.view)
}
