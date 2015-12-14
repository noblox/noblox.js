// Dependencies
var http = require('./util/http.js');
var getVerificationInputs = require('./util/getVerificationInputs.js');
var cheerio = require('cheerio');

// Define
module.exports = function(jar, post, group, message, callbacks) {
  post.ctl00$cphRoblox$GroupStatusPane$StatusTextBox = message;
  post.ctl00$cphRoblox$GroupStatusPane$StatusSubmitButton = 'Group Shout';
  http('http://www.roblox.com/My/Groups.aspx?gid=' + group, {method: 'POST', jar: jar, form: post}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err && callbacks.failure)
      callbacks.failure(err, 'shout1');
    if (res.statusCode == 200) {
      var $ = cheerio.load(body);
      if ($('#ctl00_cphRoblox_GroupStatusPane_StatusTextField').text() == message) {
        if (callbacks.success)
          callbacks.success();
      } else if (callbacks.failure)
        callbacks.failure('Invalid shouting permissions', 'shout2');
    } else if (callbacks.failure)
      callbacks.failure('Shout failed', 'shout3');
  });
};
