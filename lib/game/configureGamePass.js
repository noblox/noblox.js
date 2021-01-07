// Includes
const http = require('noblox.js/lib/util/http').func
const getGeneralToken = require('noblox.js/lib/util/getGeneralToken').func

// Docs
/**
 * Modifies an existing game pass.
 * @category Game
 * @alias configureGamePass
 * @param {number} gamePassId - The id of the game pass.
 * @param {string} name - The name of the game pass; skips name, description, and icon if set to "".
 * @param {string=} description - The description of the game pass; description is updated when name is modified.
 * @param {number|boolean=} price - The price of the game pass in Robux; sets to 'Off Sale' if 0, false, or a negative value; skips if true.
 * @param {ReadStream=} icon - The read stream for the game pass icon being uploaded; .png, .jpg, .gif
 * @returns {Promise<GamePassResponse>}
 * @example const noblox = require("noblox.js")
 * const fs = require("fs")
 * // Login using your cookie
 * noblox.configureGamePass(12345678, "Game Pass Title", "Game Pass Description", 1234, fs.createReadStream("./Image.png"))
**/

// Args
exports.required = ['gamePassId', 'name']
exports.optional = ['description', 'price', 'icon', 'jar']

// Define
function configure (jar, token, gamePassId, name, description, price, icon) {
  const file = icon
    ? {
        value: icon,
        options: {
          filename: 'icon.png',
          contentType: 'image/png'
        }
      }
    : undefined
  const httpOpt = {
    url: '//www.roblox.com/game-pass/update',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      resolveWithFullResponse: true,
      formData: {
        id: gamePassId,
        name: name,
        description: description,
        file
      }
    }
  }

  // Skip updating name and description if name is empty.
  if (!name) {
    return {
      gamePassId,
      ...price
    }
  }

  return http(httpOpt).then(function (res) {
    const json = JSON.parse(res.body)
    if (json.isValid) {
      return {
        gamePassId,
        name,
        description: description || '',
        ...price,
        iconChanged: !!file // Boolean Cast
      }
    } else {
      const priceComment = (typeof (price) === 'number') ? ` | NOTE: Price has successfully been changed to ${price}R.` : ''
      if (res.statusCode === 403) {
        throw new Error('You do not have permission to edit this game pass.' + priceComment)
      } else if (json.error) {
        throw new Error(json.error + priceComment) // 'The name or description contains inappropriate text.' or 'Text filtering service is unavailable at this time.'
      } else {
        throw new Error(`An unexpected error occurred with status code ${res.statusCode}.` + priceComment)
      }
    }
  })
}

// Configuring the name/description and robux must be done in separate calls, albeit to the same end-point.
function configureRobux (args) {
  const httpOpt = {
    url: '//www.roblox.com/game-pass/update',
    options: {
      method: 'POST',
      jar: args.jar,
      headers: {
        'X-CSRF-TOKEN': args.token
      },
      resolveWithFullResponse: true,
      json: {
        id: args.gamePassId,
        price: Math.floor(args.price || 0), // Prevent Decimals
        isForSale: !!Math.max(args.price, 0) // Boolean Cast
      }
    }
  }
  return http(httpOpt).then(function (res) {
    if (res.body.isValid) {
      // Passing price as an object, so they can be omitted if configureRobux is not run.
      return configure(
        args.jar,
        args.token,
        args.gamePassId,
        args.name,
        args.description,
        {
          price: Math.max(Math.floor(args.price || 0), 0),
          isForSale: !!Math.max(args.price, 0)
        },
        args.icon
      )
    } else {
      if (res.statusCode === 403) {
        throw new Error('You do not have permission to edit this game pass.')
      } else if (res.body.error) {
        throw new Error(res.body.error)
      } else {
        throw new Error(`An unexpected error occurred with status code ${res.statusCode}.`)
      }
    }
  })
}

function runWithToken (args) {
  const jar = args.jar
  return getGeneralToken({
    jar
  })
    .then(function (token) {
      args.token = token
      // Needs to catch falsy input of `false` and `0` as they should change the gamepass to offsale; price updating will be skipped if undefined.
      if (typeof (args.price) === 'boolean' || typeof (args.price) === 'number') {
        return configureRobux(args)
      } else {
        return configure(args.jar, args.token, args.gamePassId, args.name, args.description, undefined, args.icon)
      }
    })
}

exports.func = function (args) {
  return runWithToken(args)
}
