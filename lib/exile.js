// Includes
var http = require('./util/http.js').func;
var promise = require('./util/promise.js');
var getGeneralToken = require('./util/getGeneralToken.js').func;
var getRolesetInGroupWithJar = require('./util/getRolesetInGroupWithJar.js').func;

// Args
exports.args = ['group', 'target', 'deleteAllPosts', 'senderRolesetId', 'jar'];

// Define
function exile (jar, token, group, target, senderRolesetId, deleteAllPosts) {
  return function (resolve, reject) {
    var httpOpt = {
      url: '//www.roblox.com/My/Groups.aspx/ExileUserAndDeletePosts',
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          userId: target,
          deleteAllPostsOption: deleteAllPosts || false,
          rolesetId: senderRolesetId,
          selectedGroupId: group
        }
      }
    };
    http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(res.body));
      }
    });
  };
}

function exileWithToken (args) {
  var jar = args.jar;
  return getGeneralToken({jar: jar})
  .then(function (xcsrf) {
    return promise(exile(jar, xcsrf, args.group, args.target, args.senderRolesetId, args.deleteAllPosts));
  });
}

exports.func = function (args) {
  if (!args.senderRolesetId) {
    return getRolesetInGroupWithJar({
      jar: args.jar,
      group: args.group
    }).then(function (roleset) {
      args.senderRolesetId = roleset;
      return exileWithToken(args);
    });
  } else {
    return exileWithToken(args);
  }
};
