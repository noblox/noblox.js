// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['universeId', 'datastoreName', 'entryKey']
exports.optional = ['scope', 'versionId', 'jar']

// Docs
/**
 * <p> ☁️ Returns the latest value and metadata associated with an entry, or a specific version if versionId is provided. </p>
 * API Key Permissions:
 * <ul>
 *  <li> Read entries </li>
 *  <li> Read version </li>
 * </ul>
 * @category Datastores
 * @param {number} universeId - The ID of the universe
 * @param {string} datastoreName - Name of the data store
 * @param {string} entryKey - The key which identifies the entry.
 * @param {string=} [scope=global] - Defaults to global, similar to Lua API.
 * @param {string=} versionId - The version to inspect
 * @returns {Promise<DatastoreEntry>}
 * @example const noblox = require("noblox.js")
 * const entry = await noblox.getDatastoreEntry({ universeId: 127407415, datastoreName: 'LevelStore', entryKey: 'Level_User' })
**/

// Define
function getDatastoreEntry (universeId, datastoreName, entryKey, scope = 'global', versionId, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: versionId ? `//apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/versions/version` : `//apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
      options: {
        resolveWithFullResponse: true,
        method: 'GET',
        jar,
        qs: {
          datastoreName,
          scope,
          entryKey,
          versionId
        }
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.status === 200) {
          const response = res.data
          const headers = res.headers

          resolve({
            data: response,
            metadata: {
              robloxEntryCreatedTime: new Date(headers['roblox-entry-created-time']),
              lastModified: headers['last-modified'] ? new Date(headers['last-modified']) : new Date(headers['roblox-entry-created-time']),
              robloxEntryVersion: headers['roblox-entry-version'],
              robloxEntryAttributes: headers['roblox-entry-attributes'],
              robloxEntryUserIDs: headers['roblox-entry-userids'],
              contentMD5: headers['content-md5'],
              contentLength: parseInt(headers['content-length'])
            }
          })
        } else if (res.status === 204) {
          const headers = res.headers

          resolve({
            data: null,
            metadata: {
              robloxEntryCreatedTime: new Date(headers['roblox-entry-created-time']),
              lastModified: headers['last-modified'] ? new Date(headers['last-modified']) : new Date(headers['roblox-entry-created-time']),
              robloxEntryVersion: headers['roblox-entry-version'],
              robloxEntryAttributes: headers['roblox-entry-attributes'],
              robloxEntryUserIDs: headers['roblox-entry-userids'],
              contentMD5: headers['content-md5'],
              contentLength: headers['content-length']
            }
          })
        } else {
          // Sourced from: https://stackoverflow.com/a/32278428
          const isAnObject = (val) => !!(val instanceof Array || val instanceof Object)

          let body

          try {
            body = isAnObject(res.data) ? res.data : {}
          } catch (error) {
            reject(new Error(`${res.status} ${res.statusMessage}`))
          }

          reject(new Error(`${res.status} ${body.error} ${body.message}`))
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  return getDatastoreEntry(args.universeId, args.datastoreName, args.entryKey, args.scope, args.versionId, args.jar)
}
