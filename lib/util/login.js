// Includes
var http = require('./http.js').func;
var promise = require('./promise.js');

// Args
exports.args = ['username', 'password', 'jar'];

// Define
function login (jar, username, password) {
  return function (resolve, reject) {
    var url = 'https://www.roblox.com/MobileAPI/Login'; // Using this API because it returns user info.
    var post = {
      'username': username,
      'password': password
    };
    var httpOpt = {
      url: url,
      options: {
        method: 'POST',
        json: post,
        jar: jar
      }
    };
    http(httpOpt)
    .then(function (body) {
      if (body.Status === 'OK') {
        resolve(body.UserInfo);
      } else {
        reject(new Error(body.Status));
      }
    });
  };
}

exports.func = function (args) {
  return promise(login(args.jar, args.username, args.password));
};
