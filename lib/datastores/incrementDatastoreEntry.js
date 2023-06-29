// Includes
const http = require('../util/http.js').func
const crypto = require('crypto')

// Args
exports.required = ['universeId', 'datastoreName', 'entryKey', 'incrementBy']
exports.optional = ['scope', 'robloxEntryUserIDs', 'robloxEntryAttributes', 'jar']

// Docs
/**
 * <p> ☁️ Increments the value for an entry by a given amount, or create a new entry with that amount. </p>
 * API Key Permissions:
 * <ul>
 *  <li> Create entry </li>
 *  <li> Update entry </li>
 * </ul>
 * @category Datastores
 * @param {number} universeId - The ID of the universe
 * @param {string} datastoreName - Name of the data store
 * @param {string} entryKey - The key which identifies the entry.
 * @param {number} incrementBy - The amount by which the entry should be incremented, or the starting value if it does not exist
 * @param {string=} [scope=global] - Defaults to global, similar to Lua API.
 * @param {Array<number>=} robloxEntryUserIDs - Comma-separated list of Roblox user IDs the entry is tagged with. If not provided, existing user IDs are cleared.
 * @param {object=} robloxEntryAttributes - If not provided, existing attributes are cleared.
 * @returns {Promise<DatastoreEntry>}
 * @example const noblox = require("noblox.js")
 * const entry = await noblox.incrementDatastoreEntry({ universeId: 127407415, datastoreName: 'LevelStore', entryKey: 'Level_User', incrementBy: 2 })
**/

// Define
function incrementDatastoreEntry (universeId, datastoreName, entryKey, incrementBy, scope = 'global', robloxEntryUserIDs = [], robloxEntryAttributes, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/increment`,
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        jar,
        qs: {
          datastoreName,
          scope,
          entryKey,
          incrementBy
        },
        headers: {
          'Content-Type': 'application/json',
          'content-md5': crypto.createHash('md5').update(JSON.stringify(incrementBy)).digest('base64'),
          'roblox-entry-userids': JSON.stringify(robloxEntryUserIDs),
          'roblox-entry-attributes': JSON.stringify(robloxEntryAttributes),
          'content-length': '0'
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
  return incrementDatastoreEntry(args.universeId, args.datastoreName, args.entryKey, args.incrementBy, args.scope, args.robloxEntryUserIDs, args.robloxEntryAttributes, args.jar)
}
