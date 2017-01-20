// Includes
var http = require('./http.js').func;
var cache = require('../cache');
var cheerio = require('cheerio');
// Args
exports.required = ['userId'];

// Define
function getBlurb (userId) {
  return function (resolve, reject) {
    http({url: `https://www.roblox.com/users/${userId}/profile`})
    .then(function (body) {
      var $ = cheerio.load(body);
      var blurb = $('.profile-about-content-text').text();
      resolve(blurb);
    });
  };
}

exports.func = function (args) {
  var id = args.userId;
  return cache.wrap('GetBlurb', id, getBlurb(id));
};
