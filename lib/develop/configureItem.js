// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['id', 'name', 'description']
exports.optional = ['enableComments', 'sellForRobux', 'genreSelection', 'jar']

// Docs
/**
 * 🔐 Configure an asset.
 * @category Develop
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
      jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        name,
        description,
        enableComments,
        genres: genreSelection || ['All'],
        isCopyingAllowed: typeof (sellForRobux) === 'boolean' ? sellForRobux : null
      },
      resolveWithFullResponse: true
    }
  }).then(function (res) {
    const json = JSON.parse(res.body)

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
      throw new RobloxAPIError(res)
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
      },
      resolveWithFullResponse: true
    }
  })
    .then(function (res) {
      const json = res.body

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
              },
              resolveWithFullResponse: true
            }
          }).then((res) => {
            const err = res.body
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
        } else if (json.errors[0].code === 37) { // "AssetIsLimited" - Use the newer endpoint to update price and sale status
          return http({
            url: '//catalog.roblox.com/v1/catalog/items/details',
            options: {
              method: 'POST',
              jar: args.jar,
              json: {
                items: [
                  {
                    id: args.id,
                    itemType: 1
                  }
                ]
              },
              resolveWithFullResponse: true
            }
          }).then((response) => {
            if (!response.ok) throw new Error(response.body)

            const { collectibleItemId, price } = JSON.parse(response.body)

            if (!collectibleItemId) throw new Error(`The publishing fee for asset ${args.id} has not been paid, you must do this in order to change or set the price.`)

            return http({
              url: `//itemconfiguration.roblox.com/v1/collectibles/${collectibleItemId}`,
              options: {
                method: 'PATCH',
                jar: args.jar,
                headers: {
                  'X-CSRF-Token': args.token
                },
                json: {
                  isFree: false,
                  priceInRobux: args.sellForRobux || price,
                  priceOffset: 0,
                  quantityLimitPerUser: 0,
                  resaleRestriction: 2,
                  saleLocationConfiguration: {
                    places: [],
                    saleLocationType: 1
                  },
                  saleStatus: args.sellForRobux > 0 ? 0 : 1
                },
                resolveWithFullResponse: true
              }
            }).then((response) => {
              if (!response.ok) throw new RobloxAPIError(response)

              return {
                name: args.name,
                assetId: args.id,
                description: args.description,
                price: args.sellForRobux,
                isCopyingAllowed: null
              }
            })
          })
        } else if (json.errors[0].code === 40) { // "Use collecibles publishing endpoint." - Publishing fee has not been paid for this asset
          throw new Error(`The publishing fee for asset ${args.id} has not been paid, you must pay the fee before setting or updating the price.`)
        }
        throw new RobloxAPIError(res)
      }
    })
}

function runWithToken (args) {
  const jar = args.jar
  return getGeneralToken({
    jar
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
