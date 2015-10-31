// Define
module.exports = function(roles, rank) {
  for (var i = 0; i < roles.length; i++) {
    var role = roles[i];
    if (role.Rank == rank) {
      return role.ID;
    }
  }
};
