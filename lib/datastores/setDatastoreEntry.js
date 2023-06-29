// Includes
const http = require('../util/http.js').func
const crypto = require('crypto')

// Args
exports.required = ['universeId', 'datastoreName', 'entryKey', 'body']
exports.optional = ['scope', 'matchVersion', 'exclusiveCreate', 'robloxEntryUserIDs', 'robloxEntryAttributes', 'jar']

// Docs
/**
 * <p> ☁️ Sets the value, metadata and user IDs associated with an entry. </p>
 * <p>
 * Note: You cannot use both matchVersion and exclusiveCreate. MD5 checksum is automatically generated.
 * </p>
 * API Key Permissions:
 * <ul>
 *  <li> Create entry </li>
 *  <li> Update entry </li>
 * </ul>
 * @category Datastores
 * @param {number} universeId - The ID of the universe
 * @param {string} datastoreName - Name of the data store
 * @param {string} entryKey - The key which identifies the entry.
 * @param {any} body - The value the key should be set to.
 * @param {string=} [scope=global] - Defaults to global, similar to Lua API.
 * @param {string=} matchVersion - Only update if current version matches this.
 * @param {boolean} [exclusiveCreate=false] - Only create the entry if it does not exist.
 * @param {Array<number>=} robloxEntryUserIDs - Comma-separated list of Roblox user IDs the entry is tagged with. If not provided, existing user IDs are cleared.
 * @param {object=} robloxEntryAttributes - If not provided, existing attributes are cleared.
 * @returns {Promise<EntryVersion>}
 * @example const noblox = require("noblox.js")
 * const response = await noblox.setDatastoreEntry({ universeId: 127407415, datastoreName: 'LevelStore', entryKey: 'Level_Random', body: 230, robloxEntryUserIDs: [55549140], robloxEntryAttributes: { node: true } }))
**/

// Define
function setDatastoreEntry (universeId, datastoreName, entryKey, body, scope = 'global', matchVersion, exclusiveCreate = false, robloxEntryUserIDs = [], robloxEntryAttributes, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`,
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        jar,
        qs: {
          datastoreName,
          scope,
          entryKey,
          matchVersion,
          exclusiveCreate
        },
        headers: {
          'Content-Type': 'application/json',
          'content-md5': crypto.createHash('md5').update(JSON.stringify(body)).digest('base64'),
          'roblox-entry-userids': JSON.stringify(robloxEntryUserIDs),
          'roblox-entry-attributes': JSON.stringify(robloxEntryAttributes)
        },
        body: JSON.stringify(body)
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.status === 200) {
          const response = res.data

          response.createdTime = new Date(response.createdTime)
          response.objectCreatedTime = new Date(response.objectCreatedTime)

          resolve(response)
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
  return setDatastoreEntry(args.universeId, args.datastoreName, args.entryKey, args.body, args.scope, args.matchVersion, args.exclusiveCreate, args.robloxEntryUserIDs, args.robloxEntryAttributes, args.jar)
}
