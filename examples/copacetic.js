var rbx = require('roblox-js');
var username = '';
var password = '';

function login () {
  return rbx.login(username, password);
}

// Bypass duplicate post blocking
function clear () {
  var str = '';
  for (var i = 0; i < 20; i++) {
    if (Math.random() < 0.5) {
      str += '\u200B';
    } else {
      str += ' ';
    }
  }
  return str;
}

login()
.then(function () {
  var evt = rbx.onForumPost(32);
  evt.on('data', function (post) {
    console.log(post);
    var response;
    var rand = Math.random();
    if (rand < 0.3) {
      response = 'Disagreed';
    } else if (rand > 0.4 && rand < 0.45) {
      response = 'The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues.';
    } else {
      response = 'Agreed';
    }
    rbx.forumPost({postId: post.id, body: response + clear()});
  });
  evt.on('error', function (err) {
    console.error('Event error: ' + err.stack);
  });
});

setInterval(login, 86400000);
