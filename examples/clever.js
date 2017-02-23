var rbx = require('roblox-js');
var Cleverbot = require('cleverbot.io');
var bot = new Cleverbot('api_user', 'api_key');
var group = 0;
var username = '';
var password = '';

function login () {
  return rbx.login(username, password);
}

login()
.then(function (info) {
  var id = info.userId;
  bot.create(function (err, session) {
    if (err) {
      return console.error('Cleverbot error: ' + session);
    }
    bot.setNick(session);
    var evt = rbx.onWallPost(group);
    evt.on('data', function (post) {
      console.log(post);
      if (post.author.id !== id) {
        bot.ask(post.content, function (err, response) {
          if (err) {
            return console.error('Cleverbot error: ' + response);
          }
          console.log(response);
          rbx.post({group: group, message: response});
        });
      }
    });
    evt.on('error', function (err) {
      console.error(err);
    });
  });
});

setInterval(login, 86400000);
