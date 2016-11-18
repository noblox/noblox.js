// Dependencies
var entities = require('entities');

// Args
exports.required = ['roles', ['rank', 'name']];

// Define
exports.func = function (args) {
  var roles = args.roles;
  var rank = args.rank;
  var search = rank || args.name;
  var found = {};
  var result = [];
  var isObject = search instanceof Object;
  for (var i = 0; i < roles.length; i++) {
    var role = roles[i];
    var find = rank ? role['Rank'] : entities.decodeHTML(role['Name']);
    if (found[find]) {
      throw new Error('There are two or more roles with the rank ' + rank + '. You must specify the role name.');
    }
    if (isObject ? search.indexOf(find) > -1 : search === find) {
      found[find] = true;
      result.push(role);
    }
  }
  if (isObject) {
    return result;
  } else {
    return result[0] || false;
  }
};
