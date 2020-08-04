const http = require('../util/http.js').func;

exports.required = ['placeId'];

function getPlaceInfo (placeId) {
  const httpOpt = {
    url: `//www.roblox.com/places/api-get-details?assetId=${placeId}`,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  };
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        return JSON.parse(res.body)
      } else {
        throw new Error('Game does not exist')
      };
    });
};

exports.func = function (args) {
  return getPlaceInfo(args.placeId)
};
