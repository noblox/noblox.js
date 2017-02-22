// Includes
var http = require('./util/http.js').func;
var getGeneralToken = require('./util/getGeneralToken.js').func;
var getRolesetInGroupWithJar = require('./util/getRolesetInGroupWithJar.js').func;

// Args
exports.required = ['group', 'target'];
exports.optional = ['deleteAllPosts', 'senderRolesetId', 'jar'];

// Define
function exile (jar, token, group, target, senderRolesetId, deleteAllPosts) {
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
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode !== 200) {
      throw new Error(res.body.Message);
    }
  });
}

function exileWithToken (args) {
  var jar = args.jar;
  return getGeneralToken({jar: jar})
  .then(function (xcsrf) {
    return exile(jar, xcsrf, args.group, args.target, args.senderRolesetId, args.deleteAllPosts);
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
