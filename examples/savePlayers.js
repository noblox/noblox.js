var rbx = require('roblox-js');
var group = 18;

var promise = rbx.getPlayers(group);
var ivl = setInterval(function () {
  console.log(promise.getStatus());
}, 1000);
promise.then(function (plrs) {
  require('fs').writeFileSync('./players.json', JSON.stringify(plrs));
  console.log('Done');
  clearInterval(ivl);
});
