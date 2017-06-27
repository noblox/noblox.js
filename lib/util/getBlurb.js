// Includes
var http = require('./http.js').func;
var parser = require('cheerio');

// Args
exports.required = ['userId'];

// Define
exports.func = function (args) {
  return http({url: '//www.roblox.com/users/' + args.userId + '/profile'})
  .then(function (body) {
    return parser.load(body)('.profile-about-content-text').text();
  });
};
