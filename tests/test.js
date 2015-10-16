var rjs = require('roblox-js');
var request = require('request');
var jar = request.jar();

var opt2 = {
    //jar: jar,
    success: console.log,
    failure: function(err) {
        console.log('Fail: ' + err);
    },
    always: function() {
        console.log('Done');
    }
};

var sopt = {
    group: 147864,
    roleset: 791521,
    target: 21303105,
    //jar: jar,
    success: function() {
        console.log('woot');
    },
    failure: function(err) {
        console.log('Fail set: ' + err);
    },
    always: function() {
        console.log('Done set');
    }
};

var mopt = {
  recipient: 21303049,
  subject: 'Test',
  body: Date.now().toString()
};

var options = {
    username: '',
    password: '',
    //jar: jar,
    success: function() {
        console.log('Logged in');
        rjs.getCurrentUser(opt2);
        //rjs.getToken('http://www.roblox.com/messages/send',jar,console.log,console.log);

        //rjs.message(21303049,'Test',Date.now().toString(),undefined,jar,console.log,console.log);
        rjs.message(mopt);

        //rjs.setRank(sopt);
        //rjs.setRank(sopt.group,sopt.target,sopt.roleset,undefined,sopt.jar,sopt.success,sopt.failure,sopt.always);
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
