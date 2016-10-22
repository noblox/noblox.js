// Includes
var http = require('./util/http.js').func;
var promise = require('./util/promise.js');
var getGeneralToken = require('./util/getGeneralToken.js').func;
var getRoles = require('./util/getRoles.js').func;
var getRole = require('./util/getRole.js').func;

// Args
exports.required = ['group', 'target', 'rank', 'roleset'];
exports.optional = ['jar'];

// Define
function setRank (jar, xcsrf, group, target, roleset) {
  return function (resolve, reject) {
    var httpOpt = {
      url: '//www.roblox.com/groups/api/change-member-rank?groupId=' + group + '&newRoleSetId=' + roleset + '&targetUserId=' + target,
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    };
    http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        var success = JSON.parse(res.body).success;
        if (success) {
          resolve();
        } else {
          reject(new Error('Invalid permissions, make sure the user is in the group and is allowed to change the rank of target'));
        }
      } else {
        reject(new Error('Internal error, make sure the change rank request is valid'));
      }
    });
  };
}

function runWithToken (args) {
  var jar = args.jar;
  return getGeneralToken({jar: jar})
  .then(function (xcsrf) {
    return promise(setRank(jar, xcsrf, args.group, args.target, args.roleset));
  });
}

exports.func = function (args) {
  if (!args.roleset) {
    var rank = args.rank;
    return getRoles({
      group: args.group,
      rank: rank
    })
    .then(function (roles) {
      var role = getRole({
        roles: roles,
        rank: rank
      });
      if (!role) {
        throw new Error('Rank does not exist');
      }
      args.roleset = role.ID;
      return runWithToken(args);
    });
  } else {
    return runWithToken(args);
  }
};
