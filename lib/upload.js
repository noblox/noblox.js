// Dependencies
var request = require('request');

// Define
module.exports = function(jar, data, itemOptions, asset, callbacks) {
  var url = 'http://data.roblox.com/Data/Upload.ashx?assetid=' + (asset || 0);
  if (itemOptions) {
    url = url + '&type=Model&genreTypeId=1&name=' +
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
  request.post(url, {jar: jar, body: data, headers: {'Content-Type': 'application/xml'}}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err && callbacks.failure)
      callbacks.failure(err, 'upload1');
    if (res.statusCode == 200)
      callbacks.success(body);
    else
      callbacks.failure('Upload failed', 'upload2');
  });
};
