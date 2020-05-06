// Includes
var http = require('../util/http.js').func
var getVerification = require('../util/getVerification.js').func

// Args
exports.required = ['name', 'assetType', 'file']
exports.optional = ['groupId', 'jar']

// Define
function upload (jar, file, name, assetType, groupId) {
  return new Promise((resolve, reject) => {
    return getVerification({
      url: 'https://www.roblox.com/build/upload',
      options: {
        jar: jar
      }
    }).then(function (ver) {
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
      }
      return http({
        url: '//www.roblox.com/build/upload',
        options: {
          method: 'POST',
          verification: ver.header,
          formData: data,
          resolveWithFullResponse: true,
          jar: jar
        }
      }).then(function (res) {
        if (res.statusCode === 302) {
          var location = res.headers.location
          var errMsg = location.match('uploadedId=(.*)$')
          var match = location.match(/\d+$/)
          if (match) {
            var id = parseInt(match[0], 10)
            if (location.indexOf('/build/upload') === -1) {
              reject(new Error('Unknown redirect: ' + location))
            }
            resolve(id)
          } else if (errMsg) {
            reject(new Error('Upload error: ' + decodeURI(errMsg[1])))
          } else {
            reject(new Error('Match error. Original: ' + location))
          }
        } else {
          reject(new Error('Unknown upload error'))
        }
      })
    })
  })
}

exports.func = function (args) {
  return upload(args.jar, args.file, args.name, args.assetType, args.groupId)
}
