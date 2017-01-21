// Includes
var http = require('./http.js').func;
var promise = require('./promise.js');
var parser = require('cheerio');

// Args
exports.required = ['userId'];

// Define
function getBlurb (userId) {
  return function (resolve, reject) {
    http({url: 'https://www.roblox.com/users/' + userId + '/profile'})
    .then(function (body) {
      var $ = parser.load(body);
      var blurb = $('.profile-about-content-text').text();
      resolve(blurb);
    });
  };
}

exports.func = function (args) {
  return promise(getBlurb(args.userId));
};
