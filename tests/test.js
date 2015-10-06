var rjs = require('roblox-js');
var request = require('request');
var jar = request.jar();

var opt2 = {
    jar: jar,
    success: console.log,
    failure: function(err) {
        console.log('Fail: ' + err);
    },
    always: function() {
        console.log('Done');
    }
};

var options = {
    username: 'username',
    password: 'password',
    jar: jar,
    success: function() {
        console.log('Logged in');
        console.log(rjs.getSession(jar));
        rjs.getCurrentUser(opt2);
    },
    failure: function(err) {
        console.log('Fail: ' + err);
    },
    always: function() {
        console.log('Done');
    }
};

rjs.login(options);

//rjs.login(options.username,options.password,options.jar,options.success,options.failure,options.always);
