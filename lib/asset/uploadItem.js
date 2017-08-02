// Includes
var http = require('../util/http.js').func;
var getVerification = require('../util/getVerification.js').func;

// Args
exports.required = ['name', 'assetType', 'file'];
exports.optional = ['groupId', 'jar'];

// Define
function upload (jar, file, name, assetType, groupId) {
  return getVerification({
    url: '//www.roblox.com/build/upload',
    options: {
      jar: jar
    }
  })
  .then(function (ver) {
    var data = {
      name: name,
      assetTypeId: assetType,
      groupId: groupId || '',
      __RequestVerificationToken: ver.inputs.__RequestVerificationToken,
      file: {
        value: file,
        options: {
          filename: 'Image.png',
          contentType: 'image/png'
        }
      }
    };
    return http({
      url: '//www.roblox.com/build/upload',
      options: {
        method: 'POST',
        verification: ver.header,
        formData: data,
        resolveWithFullResponse: true,
        jar: jar
      }
    })
    .then(function (res) {
      if (res.statusCode === 302) {
        var location = res.headers.location;
        console.log(location);
        var errMsg = location.match('message=(.*)$');
        var match = location.match(/\d+$/);
        if (match) {
          var id = parseInt(match[0], 10);
          if (location.indexOf('/build/upload') === -1) {
            throw new Error('Unknown redirect: ' + location);
          }
          return id;
        } else if (errMsg) {
          throw new Error('Upload error: ' + decodeURI(errMsg[1]));
        } else {
          throw new Error('Match error. Original: ' + location);
        }
      } else {
        throw new Error('Unknown upload error');
      }
    });
  });
}

exports.func = function (args) {
  return upload(args.jar, args.file, args.name, args.assetType, args.groupId);
};
