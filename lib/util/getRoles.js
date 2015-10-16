// Dependencies
var request = require('request');

//Define
exports = function(group,rank,callbacks) {
  request.get('http://www.roblox.com/api/groups/' + group + '/RoleSets/',function(err,res,body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error(err);
    }
    var response = body;
    if (rank) {
      for (var i = 0; i < body.length; i++) {
        if (body[i].Rank == rank) {
          response = body[i].ID;
          break;
        }
      }
    }
    if (callbacks.success)
      callbacks.success(response);
    return response;
  });
};
