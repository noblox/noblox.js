// Includes
var promise = require('./promise.js');
var http = require('./http.js').func;

// Args
exports.args = ['option', 'jar'];

// Define
function getCurrentUser (jar, option) {
  return function (resolve, reject) {
    var httpOpt = {
      url: 'https://www.roblox.com/mobileapi/userinfo',
      options: {
        resolveWithFullResponse: true,
        method: 'GET',
        followRedirect: false,
        jar: jar
      }
    };
    http(httpOpt)
    .then(function (res) {
      if (res.statusCode !== 200) {
        reject(new Error('You are not logged in.'));
      } else {
        var json = JSON.parse(res.body);
        var result = (option ? json[option] : json);
        resolve(result);
      }
    });
  };
}

exports.func = function (args) {
  return promise(getCurrentUser(args.jar, args.option));
};
