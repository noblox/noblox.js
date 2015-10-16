// Dependencies
var request = require('request');

//Define
module.exports = function(group,rank,callbacks) {
  request.get('http://www.roblox.com/api/groups/' + group + '/RoleSets/',function(err,res,body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error(err);
    }
    var response = JSON.parse(body);
    if (rank) {
      for (var i = 0; i < body.length; i++) {
        if (response[i].Rank == rank) {
          response = response[i].ID;
          break;
        }
      }
    }
    if (callbacks.success)
      callbacks.success(response);
    return response;
  });
};
