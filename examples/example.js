var rbx = require('roblox-js');
var user = {
  username: 'Shedletsky',
  password: 'hunter2',
  success: function() {
    rbx.getCurrentUser(undefined,undefined,console.log);
  }
}
rbx.login(user);
