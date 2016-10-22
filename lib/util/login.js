// Includes
var http = require('./http.js').func;
var promise = require('./promise.js');
var options = require('../options.js');

// Args
exports.required = ['username', 'password'];
exports.optional = ['jar'];

// Define
function login (jar, username, password) {
  return function (resolve, reject) {
    var url = '//www.roblox.com/MobileAPI/Login'; // Using this API because it returns user info.
    var post = {
      'username': username,
      'password': password
    };
    var httpOpt = {
      url: url,
      options: {
        method: 'POST',
        json: post,
        resolveWithFullResponse: true,
        jar: jar
      }
    };
    http(httpOpt)
    .then(function (res) {
      var body = res.body;
      if (body.Status === 'OK') {
        if (options.sessionOnly) {
          var session = res.headers['set-cookie'].toString().match('\.ROBLOSECURITY=(.*);')[1];
          if (jar) {
            jar.session = session;
          } else {
            options.jar.session = session;
          }
        }
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
