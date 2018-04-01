// Delete posts from a group wall, including by post content and by author name.
var rbx = require('roblox-js')
var ProgressBar = require('progress')
var username = ''
var password = ''
var group = 0

rbx.login(username, password)
  .then(function () {
  // This allows you to retrieve only a specific set of pages.
  /* pages = [];
  for (var i = 0; i <= 100; i++) {
    pages.push(i);
  } */
    var wall = new ProgressBar('Getting wall [:bar] :current/:total = :percent :etas remaining ', {total: 10000})
    var promise = rbx.getWall({
      group: group,
      // page: pages,
      view: true
    })
    promise.then(function (wall) {
      var posts = wall.posts
      // Remember these are reversed, it starts off with all the posts on the wall and you are REMOVING the ones you DON'T want to delete from the array
      /* for (var i = posts.length - 1; i >= 0; i--) {
      var post = posts[i];
      if (post.author.name !== 'Bob') { // Delete all posts by Bob
        posts.splice(i, 1);
      }
      if (!post.content.includes('Bob')) { // Delete all posts that contain "Bob"
        posts.splice(i, 1);
      }
    } */
      var deletion = new ProgressBar('Deleting posts [:bar] :current/:total = :percent :etas remaining ', {total: 10000})
      console.time('Time: ')
      var thread = rbx.threaded(function (i) {
        var post = posts[i]
        return rbx.deleteWallPost({
          group: group,
          post: {
            parent: {
              index: post.parent.index
            },
            view: wall.views[post.parent.page]
          }
        })
      }, 0, posts.length)
      var ivl = setInterval(function () {
        deletion.update(thread.getStatus() / 100)
      }, 1000)
      thread.then(function () {
        clearInterval(ivl)
        console.timeEnd('Time: ')
      })
    })
    var ivl = setInterval(function () {
      wall.update(promise.getStatus() / 100)
    }, 1000)
    promise.then(function () {
      clearInterval(ivl)
    })
  })
