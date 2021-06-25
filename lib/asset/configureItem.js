// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['id', 'name', 'description']
exports.optional = ['enableComments', 'sellForRobux', 'genreSelection', 'jar']

// Docs
/**
 * 🔐 Configure an asset.
 * @category Assets
 * @alias configureItem
 * @param {number} assetId - The id of the asset.
 * @param {string} name - The new name of the asset.
 * @param {string} description - The new description of the asset.
 * @param {boolean=} enableComments - Enable comments on your asset.
 * @param {number|boolean=} [sellForRobux=false] - The amount of robux to sell for
 * @param {string=} [genreSelection="All"] - The genre of your asset.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.configureItem(1117747196, "Item", "A cool item.")
**/

// Define
function configure (jar, token, id, name, description, enableComments, sellForRobux, genreSelection, sellingPrice) {
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
        isCopyingAllowed: typeof (sellForRobux) === 'boolean' ? sellForRobux : null
      }
    }
  }
  return http(httpOpt).then(function (json) {
    if (!json.errors) {
      return { name: name, description: description, assetId: id, price: sellingPrice || 0 }
    } else {
      throw new Error(json.errors[0].message)
    }
  })
}

function configureRobux (args) {
  const httpOpt = {
    url: '//itemconfiguration.roblox.com/v1/assets/' + args.id + '/release',
    options: {
      method: 'POST',
      jar: args.jar,
      headers: {
        'X-CSRF-TOKEN': args.token
      },
      json: {
        saleStatus: args.sellForRobux ? 'OnSale' : 'OffSafe',
        priceConfiguration: {
          priceInRobux: args.sellForRobux || 0
        }
      }
    }
  }
  return http(httpOpt).then(function (json) {
    if (!json.errors) {
      return configure(args.jar, args.token, args.id, args.name, args.description, args.enableComments, args.sellForRobux, args.genreSelection, args.sellForRobux)
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
      if (args.sellForRobux && typeof (args.sellForRobux) === 'number') {
        args.token = token
        return configureRobux(args)
      } else {
        return configure(args.jar, token, args.id, args.name, args.description, args.enableComments, args.sellForRobux, args.genreSelection)
      }
    })
}

exports.func = function (args) {
  return runWithToken(args)
}
