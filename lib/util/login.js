// Depdendencies
var request = require('request');

// Define
exports = function(jar,username,password,callbacks) {
  var url = 'https://www.roblox.com/Services/Secure/LoginService.asmx/ValidateLogin';
  var post = {
    'userName': username,
    'password': password,
    'isCaptchaOn': false,
    'challenge': '',
    'captchaResponse': ''
  };
  request.post(url,{json: post, jar: jar},function(err,res,body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('Request failed: ' + err);
    }
    var json = body.d;
    if (json.IsValid && callbacks.success)
        callbacks.success();
    else if (!json.IsValid) {
      if (callbacks.failure)
        callbacks.failure(json.Message);
      return console.error('Login failed: ' + json.Message);
    }
  });
};
