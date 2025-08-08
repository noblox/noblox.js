// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['universeId', 'datastoreName', 'entryKey']
exports.optional = ['scope', 'startTime', 'endTime', 'sortOrder', 'limit', 'cursor', 'jar']

// Docs
/**
 * <p> ☁️ Returns a list of entry versions of an entry. </p>
 * API Key Permissions:
 * <ul>
 *  <li> List versions </li>
 * </ul>
 * @category Datastores
 * @param {number} universeId - The ID of the universe
 * @param {string} datastoreName - Name of the data store
 * @param {string} entryKey - The key which identifies the entry.
 * @param {(string | boolean)=} [scope=global] - Defaults to global, similar to Lua API.
 * @param {Date=} startTime - Don't consider versions older than this
 * @param {Date=} endTime - Don't consider versions younger than this
 * @param {("Ascending" | "Descending")=} [sortOrder=Ascending] - Older first (Ascending) or younger first (Descending)
 * @param {number=} limit - Maximum number of items to return
 * @param {string=} cursor - Provide to request the next set of data
 * @returns {Promise<EntryVersionsResult>}
 * @example const noblox = require("noblox.js")
 * const versions = await noblox.getDatastoreEntryVersions({ universeId: 127407415, datastoreName: 'LevelStore', entryKey: 'Level_User' })
**/

// Define
function getDatastoreEntryVersions (universeId, datastoreName, entryKey, scope = 'global', startTime, endTime, sortOrder, limit, cursor, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/versions`,
      options: {
        resolveWithFullResponse: true,
        method: 'GET',
        jar,
        qs: {
          datastoreName,
          scope,
          entryKey,
          startTime,
          endTime,
          sortOrder,
          limit,
          cursor
        }
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          const response = JSON.parse(res.body)
          response.versions = response.versions.map(version => {
            version.createdTime = new Date(version.createdTime)
            version.objectCreatedTime = new Date(version.objectCreatedTime)
            return version
          })

          resolve(response)
        } else {
          reject(new RobloxAPIError(res))
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  return getDatastoreEntryVersions(args.universeId, args.datastoreName, args.entryKey, args.scope, args.startTime, args.endTime, args.sortOrder, args.limit, args.cursor, args.jar)
}
