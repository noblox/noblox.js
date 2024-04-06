// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['universeId', 'datastoreName', 'entryKey']
exports.optional = ['scope', 'jar']

// Docs
/**
 * <p> ☁️ Marks the entry as deleted by creating a tombstone version. Entries are deleted permanently after 30 days. </p>
 * API Key Permissions:
 * <ul>
 *  <li> Delete entry </li>
 * </ul>
 * @category Datastores
 * @param {number} universeId - The ID of the universe
 * @param {string} datastoreName - Name of the data store
 * @param {string} entryKey - The key which identifies the entry.
 * @param {string=} [scope=global] - Defaults to global, similar to Lua API.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * await noblox.deleteDatastoreEntry({ universeId: 127407415, datastoreName: 'LevelStore', entryKey: 'Level_User' })
**/

// Define
function deleteDatastoreEntry (universeId, datastoreName, entryKey, scope = 'global', jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
      options: {
        resolveWithFullResponse: true,
        method: 'DELETE',
        jar,
        qs: {
          datastoreName,
          scope,
          entryKey
        }
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 204) {
          resolve()
        } else {
          // Sourced from: https://stackoverflow.com/a/32278428
          const isAnObject = (val) => !!(val instanceof Array || val instanceof Object)

          let body

          try {
            body = isAnObject(res.body) ? res.body : {}
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
  return deleteDatastoreEntry(args.universeId, args.datastoreName, args.entryKey, args.scope, args.jar)
}
