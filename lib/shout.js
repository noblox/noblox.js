// Dependencies
var request = require('request');
var getInputs = require('./util/getInputs.js');
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);

// Define
module.exports = function(jar,group,message,callbacks) {
  var url = 'http://www.roblox.com/My/Groups.aspx?gid=' + group;
  request.get(url,{jar: jar},function(err,res,body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('Request failed: ' + err);
    }
    var post = getInputs(body,['__VIEWSTATE','__VIEWSTATEGENERATOR','__EVENTVALIDATION']);
    post.ctl00$cphRoblox$GroupStatusPane$StatusTextBox = message;
    post.ctl00$cphRoblox$GroupStatusPane$StatusSubmitButton = 'Group Shout';
    request.post(url,{jar: jar, form: post},function(err,res,body) {
      if (callbacks.always)
        callbacks.always();
      if (err) {
        if (callbacks.failure)
          callbacks.failure(err);
        return console.error('Request failed: ' + err);
      }
      if (res.statusCode == 200) {
        if ($(body).find('#ctl00_cphRoblox_GroupStatusPane_StatusTextField').text() == message) {
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
