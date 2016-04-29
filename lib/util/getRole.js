// Args
exports.args = ['roles', 'rank'];

// Define
exports.func = function (args) {
  var roles = args.roles;
  var rank = args.rank;
  if (typeof rank === 'object') {
    var found = [];
    for (var i = 0; i < roles.length; i++) {
      var role = roles[i];
      if (rank.indexOf(role.Rank) > -1) {
        found.push(role);
      }
    }
    return found;
  } else {
    for (i = 0; i < roles.length; i++) {
      role = roles[i];
      if (rank === role.Rank) {
        return role;
      }
    }
    return false;
  }
};
