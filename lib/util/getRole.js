// Dependencies
var entities = require('entities');

// Args
exports.required = ['roles', ['rank', 'name']];

// Define
exports.func = function (args) {
  var roles = args.roles;
  var search = args.rank || args.name;
  var found;
  var isObject = search instanceof Object;
  if (isObject) {
    found = [];
  }
  for (var i = 0; i < roles.length; i++) {
    var role = roles[i];
    var find = args.rank ? role['Rank'] : entities.decodeHTML(role['Name']);
    if (search instanceof Object) {
      if (search.indexOf(find) > -1) {
        found.push(role);
      }
    } else if (search === find) {
      return role;
    }
  }
  if (isObject) {
    return found;
  } else {
    return false;
  }
};
