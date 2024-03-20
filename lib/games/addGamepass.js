const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['universeId', 'name', 'priceInRobux']
exports.optional = ['description', 'jar']

// Docs
/**
 * 🔐 Create a gamepass.
 * @category Game
 * @alias addGamepass
 * @param {number} universeId - The id of the universe.
 * @param {string} name - The name of the gamepass.
 * @param {number} priceInRobux - The price of the product.
 * @param {string=} description - The description of the gamepass.
 * @returns {Promise<GamepassAddResult>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.addGamepass(1, "A Gamepass", 100, "A cool item.")
**/

const nextFunction = (jar, token, universeId, name, priceInRobux, description) => {
  const FormData = require('form-data');
  const goofy = new FormData()
  goofy.append("Name", name)
  goofy.append("Description", description)
  goofy.append("UniverseId", universeId)
  goofy.append("IsForSale", 'true')
  goofy.append("Price", priceInRobux)
  return http({
    url: `//apis.roblox.com/game-passes/v1/game-passes`,
    options: {
      method: 'POST',
      jar: jar,
      body: goofy,
      headers: {
        ...goofy.getHeaders(),
        'X-CSRF-TOKEN': token
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    console.log(res)
    if (res.statusCode === 200) {
      return {
        universeId,
        name,
        priceInRobux,
        description,
        gamepassId: typeof res.body === 'object' ? res.body.id : JSON.parse(res.body).id
      }
    } else {
      throw new Error(`Create gamepass failed, ${res.statusCode} ${res.statusMessage}`)
    }
  }).catch(e => {})
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.universeId, args.name, args.priceInRobux, args.description)
  })
}
