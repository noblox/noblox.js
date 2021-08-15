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
 * @param {number|boolean=} [sellForRobux=false] - The amount of robux to sell for; use a number for sellable assets, boolean for copyable assets
 * @param {string=} [genreSelection="All"] - The genre of your asset.
 * @returns {Promise<ConfigureItemResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.configureItem(1117747196, "Item", "A cool item.", false, 100)
**/

// Define
function configure (jar, token, id, name, description, enableComments, sellForRobux, genreSelection, sellingPrice) {
  return http({
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
  }).then(function (json) {
    if (!json.errors) {
      const response = {
        name,
        description,
        assetId: id
      }
      if (typeof sellForRobux === 'boolean') {
        response.isCopyingAllowed = sellForRobux
      } else {
        response.price = sellingPrice || 0
      }
      return response
    } else {
      if (json.errors[0].code === 13) { // "Only a marketplace asset can be updated with IsCopyingAllowed."
        throw new Error('Attempting to make a sellable asset copyable; it must be sold for robux. (Use a number for sellForRobux.)')
      }
      throw new Error(json.errors[0].message)
    }
  })
}

function configureRobux (args) {
  return http({
    url: '//itemconfiguration.roblox.com/v1/assets/' + args.id + '/release',
    options: {
      method: 'POST',
      jar: args.jar,
      headers: {
        'X-CSRF-TOKEN': args.token
      },
      json: {
        saleStatus: args.sellForRobux ? 'OnSale' : 'OffSale',
        priceConfiguration: {
          priceInRobux: args.sellForRobux || 0
        }
      }
    }
  })
    .then(function (json) {
      if (!json.errors) {
        return configure(args.jar, args.token, args.id, args.name, args.description, args.enableComments, args.sellForRobux, args.genreSelection, args.sellForRobux)
      } else {
        // Code 6: "Asset is released"; caused when changing the price of an on-sale asset from non-zero to non-zero
        if (json.errors[0].code === 6) {
          return http({
            url: '//itemconfiguration.roblox.com/v1/assets/' + args.id + '/update-price',
            options: {
              method: 'POST',
              jar: args.jar,
              headers: {
                'X-CSRF-TOKEN': args.token
              },
              json: {
                priceConfiguration: {
                  priceInRobux: args.sellForRobux
                }
              }
            }
          }).then((err) => {
            if (!err.errors) {
              return configure(args.jar, args.token, args.id, args.name, args.description, args.enableComments, args.sellForRobux, args.genreSelection, args.sellForRobux)
            } else {
              throw new Error(json.errors[0].message)
            }
          })
        } else if (json.errors[0].code === 3) { // "Cannot release the associated asset type" - caused by copyable asset using sellForRobux: 2 or greater
          // Throw an error as the developer may have intended to sell the asset for robux instead of making it free.
          throw new Error('Attempting to sell a copyable asset for robux; it can only be made free. (Use true for sellForRobux.)')
        } else if (json.errors[0].code === 20) { // "Cannot set the associated asset type to remove-from-release" - caused by copyable asset using sellForRobux: 0
          // Continue and ignore the error as the intended outcome makes the asset private; set sellForRobux from 0 to false
          return configure(args.jar, args.token, args.id, args.name, args.description, args.enableComments, args.sellForRobux, args.genreSelection, !!args.sellForRobux)
        }
        throw new Error(`An unknown error occurred: [${json.errors[0].code}] ${json.errors[0].message}`)
      }
    })
}

function runWithToken (args) {
  const jar = args.jar
  return getGeneralToken({
    jar: jar
  })
    .then(function (token) {
      if (typeof (args.sellForRobux) === 'number') {
        if (args.sellForRobux < 2 && args.sellForRobux !== 0) {
          throw new Error('Assets cannot be sold for less than 2R.')
        }
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
