// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['universeId', 'datastoreName']
exports.optional = ['scope', 'prefix', 'limit', 'cursor', 'jar']

// Docs
/**
 * <p> ☁️ Returns a list of entry keys within a data store. </p>
 * API Key Permissions:
 * <ul>
 *  <li> List keys </li>
 * </ul>
 * @category Datastores
 * @param {number} universeId - The ID of the universe
 * @param {string} datastoreName - Name of the data store
 * @param {(string | boolean)=} [scope=global] - Defaults to global, similar to Lua API. If set to true, returns keys from all scopes.
 * @param {string=} prefix - Return only data stores with this prefix
 * @param {number=} limit - Maximum number of items to return
 * @param {string=} cursor - Provide to request the next set of data
 * @returns {Promise<DatastoreKeysResult>}
 * @example const noblox = require("noblox.js")
 * const keys = await noblox.getDatastoreKeys({ universeId: 127407415, datastoreName: 'LevelStore' })
**/

// Define
function getDatastoreKeys (universeId, datastoreName, scope = 'global', prefix, limit, cursor, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries`,
      options: {
        resolveWithFullResponse: true,
        method: 'GET',
        jar,
        qs: {
          datastoreName,
          scope,
          AllScopes: scope === true,
          prefix,
          limit,
          cursor
        }
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          const response = JSON.parse(res.body)

          resolve(response)
        } else {
          reject(new RobloxAPIError(res))
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  return getDatastoreKeys(args.universeId, args.datastoreName, args.scope, args.prefix, args.limit, args.cursor, args.jar)
}
