// Includes
var http = require('./util/http.js').func;

// Args
exports.required = ['data'];
exports.optional = ['itemOptions', 'asset', 'jar'];

// Define
function upload (jar, data, itemOptions, asset) {
  var httpOpt = {
    url: '//data.roblox.com/Data/Upload.ashx?json=1&assetid=' + (asset || 0),
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
    var copyLocked = itemOptions.copyLocked;
    var allowComments = itemOptions.allowComments;
    httpOpt.url += '&type=Model&genreTypeId=1&name=' +
      itemOptions.name +
      '&description=' +
      (itemOptions.description || '') +
      '&ispublic=' +
      (copyLocked != null ? !copyLocked : false) +
      '&allowComments=' +
      (allowComments != null ? allowComments : true) +
      '&groupId=' +
      (itemOptions.groupId || '');
  } else if (!asset) {
    throw new Error('ItemOptions is required for new assets.');
  }
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 200) {
      var body = res.body;
      var parsed;
      try {
        parsed = JSON.parse(body);
      } catch (e) {
        throw new Error('Could not parse JSON, returned body:' + body);
      }
      return parsed;
    } else {
      throw new Error('Upload failed, confirm that all item options, asset options, and upload data are valid.');
    }
  });
}

exports.func = function (args) {
  return upload(args.jar, args.data, args.itemOptions, args.asset);
};
