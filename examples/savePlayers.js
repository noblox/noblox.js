// Save all the players in a group to a file with status updates. Note that for extremely large groups you may need to increase the RAM allocated to this script by using the --max-old-space-size option

var rbx = require('roblox-js');
var group = 0;

var promise = rbx.getPlayers(group);
var ivl = setInterval(function () {
  console.log(promise.getStatus());
}, 1000);
promise.then(function (plrs) {
  require('fs').writeFileSync('./players.json', JSON.stringify(plrs));
  console.log('Done');
  clearInterval(ivl);
});
