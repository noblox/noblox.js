// Includes
var http = require('../util/http.js').func;
var parser = require('cheerio');

// Args
exports.required = ['userId'];

// Define
exports.func = function (args) {
  return http({
    url: '//www.roblox.com/users/' + args.userId + '/profile',
    options: {
      resolveWithFullResponse: true,
      followRedirect: false
    }
  })
  .then(function (res) {
    if (res.statusCode === 200) {
      let body = parser.load(res.body);

      let blurb = body('.profile-about-content-text').text();
      let status = body('div[data-statustext]').attr('data-statustext');
      let username = body('.header-title h2').text();
      let joinDate = body('.profile-stats-container .text-lead').text().slice(0,9);

      joinDate = Date.parse(joinDate);

      let currentTime = new Date();
      let playerAge = Math.round(Math.abs((joinDate - currentTime.getTime())/(24*60*60*1000)));
      let DateObj = new Date(joinDate);
      return {
        username: username,
        status: status,
        blurb: blurb,
        joinDate: DateObj,
        age: playerAge
      }
    } else {
      throw new Error('User does not exist');
    }
  });
};
