// Dependencies
var cheerio = require('whacko');
var entities = require('entities');

// Includes
var generalRequest = require('./util/generalRequest.js').func;
var promise = require('./util/promise.js');

// Args
exports.args = ['group', 'message', 'jar'];

// Define
function shout (jar, oldBody, res, message) {
  return function (resolve, reject) {
    if (res.statusCode === 200) {
      // This used to check if the post was updated but it looks like the request actually fails if the user did not have permission to shout (or if the shout contained bad characters). I do not know if it was always like this or it was updated recently.
      resolve();
      /* var $ = cheerio.load(res.body);
      var old = cheerio.load(oldBody);
      var query = '#ctl00_cphRoblox_GroupStatusPane_StatusDate';
      // Check that the message is updated and the post time is not the same (unless command was clear shout)
      if ((message.length === 0 || (old(query).text() !== $(query).text())) && ($('#ctl00_cphRoblox_GroupStatusPane_StatusTextField').text() === entities.decodeXML(message))) {
        resolve();
      } else {
        reject(new Error('Invalid permissions, make sure the user is in the group and is allowed to shout'));
      } */
    } else {
      reject(new Error('Shout failed, verify login, permissions, and message'));
    }
  };
}

exports.func = function (args) {
  var jar = args.jar;
  var group = args.group;
  var message = args.message;
  var events = {
    ctl00$cphRoblox$GroupStatusPane$StatusTextBox: message,
    ctl00$cphRoblox$GroupStatusPane$StatusSubmitButton: 'Group Shout'
  };
  return generalRequest({jar: jar, url: '//www.roblox.com/My/Groups.aspx?gid=' + group, events: events, getBody: true})
  .then(function (result) {
    return promise(shout(jar, result.body, result.res, message));
  });
};
