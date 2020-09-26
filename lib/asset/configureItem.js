// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['id', 'name', 'description']
exports.optional = ['enableComments', 'sellForRobux', 'genreSelection', 'jar']

// Define
function configure (jar, token, id, name, description, enableComments, sellForRobux, genreSelection) {
  const httpOpt = {
    url: '//develop.roblox.com/v1/assets/' + id,
    options: {
      method: 'PATCH',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        name: name,
        description: description,
        enableComments: enableComments,
        genres: genreSelection || ['All'],
        isCopyingAllowed: sellForRobux
      }
    }
  }
  return http(httpOpt).then(function (json) {
    if (!json.errors) {
      return { name: name, description: description, assetId: id }
    } else {
      throw new Error(json.errors[0].message)
    }
  })
}

function runWithToken (args) {
  const jar = args.jar
  return getGeneralToken({
    jar: jar
  })
    .then(function (token) {
      return configure(args.jar, token, args.id, args.name, args.description, args.enableComments, args.sellForRobux, args.genreSelection)
    })
}

exports.func = function (args) {
  return runWithToken(args)
}
