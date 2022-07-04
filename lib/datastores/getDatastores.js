// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['universeId']
exports.optional = ['prefix', 'limit', 'cursor', 'jar']

// Docs
/**
 * <p> ☁️ Returns a list of data stores belonging to a universe. </p>
 * API Key Permissions:
 * <ul>
 *  <li> List DataStores </li>
 * </ul>
 * @category Datastores
 * @param {number} universeId - The ID of the universe whose data stores are being retrieved.
 * @param {string=} prefix - Return only data stores with this prefix
 * @param {number=} limit - Maximum number of items to return
 * @param {string=} cursor - Provide to request the next set of data
 * @returns {Promise<DatastoresResult>}
 * @example const noblox = require("noblox.js")
 * const datastores = await noblox.getDatastores(1117747196)
**/

// Define
function getDatastores (universeId, prefix, limit, cursor, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores`,
      options: {
        resolveWithFullResponse: true,
        method: 'GET',
        jar,
        qs: {
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
          response.datastores = response.datastores.map(datastore => {
            datastore.createdTime = new Date(datastore.createdTime)
            return datastore
          })

          resolve(response)
        } else {
          // Sourced from: https://stackoverflow.com/a/32278428
          const isAnObject = (val) => !!(val instanceof Array || val instanceof Object)

          let body

          try {
            body = isAnObject(JSON.parse(res.body)) ? JSON.parse(res.body) : {}
          } catch (error) {
            reject(new Error(`${res.statusCode} ${res.statusMessage}`))
          }

          reject(new Error(`${res.statusCode} ${body.error} ${body.message}`))
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  return getDatastores(args.universeId, args.prefix, args.limit, args.cursor, args.jar)
}
