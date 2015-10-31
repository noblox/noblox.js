// Dependencies
var request = require('request');
var getVerificationInputs = require('./util/getVerificationInputs.js');
var cheerio = require('cheerio');

// Define
module.exports = function(jar, group, message, callbacks) {
  var url = 'http://www.roblox.com/My/Groups.aspx?gid=' + group;
  request.get(url, {jar: jar}, function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('Request failed: ' + err);
    }
    var post = getVerificationInputs(body);
    post.ctl00$cphRoblox$GroupStatusPane$StatusTextBox = message;
    post.ctl00$cphRoblox$GroupStatusPane$StatusSubmitButton = 'Group Shout';
    request.post(url, {jar: jar, form: post}, function(err, res, body) {
      if (callbacks.always)
        callbacks.always();
      if (err) {
        if (callbacks.failure)
          callbacks.failure(err);
        return console.error('Request failed: ' + err);
      }
      if (res.statusCode == 200) {
        var $ = cheerio.load(body);
        if ($('#ctl00_cphRoblox_GroupStatusPane_StatusTextField').text() == message) {
          if (callbacks.success)
            callbacks.success();
        } else {
          if (callbacks.failure)
            callbacks.failure('Invalid shouting permissions');
          return console.error('Invalid shouting permissions');
        }
      } else {
        if (callbacks.failure)
          callbacks.failure('Shout failed.');
        return console.error('Shout failed.');
      }
    });
  });
};
