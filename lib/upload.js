// Dependencies
var http = require('./util/http.js').func;
var promise = require('./util/promise.js');

// Args
exports.args = ['data', 'itemOptions', 'asset', 'jar'];

// Define
function upload (jar, data, itemOptions, asset) {
  return function (resolve, reject) {
    var httpOpt = {
      url: 'https://data.roblox.com/Data/Upload.ashx?assetid=' + (asset || 0),
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        jar: jar,
        body: data,
        headers: {
          'Content-Type': 'application/xml'
        }
      }
    };
    if (itemOptions) {
      httpOpt.url += '&type=Model&genreTypeId=1&name=' +
        itemOptions.name +
        '&description=' +
        (itemOptions.description || '') +
        '&ispublic=' +
        itemOptions.locked +
        '&allowComments=' +
        itemOptions.allowComments +
        '&groupId=' +
        (itemOptions.groupId || '');
    }
    http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error('Upload failed, confirm that all item options, asset options, and upload data are valid.'));
      }
    });
  };
}

exports.func = function (args) {
  return promise(upload(args.jar, args.data, args.itemOptions, args.asset));
};
