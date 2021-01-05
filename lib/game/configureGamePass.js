// Includes
const http = require('noblox.js/lib/util/http').func
const getGeneralToken = require('noblox.js/lib/util/getGeneralToken').func

// Args
exports.required = ['id', 'name']
exports.optional = ['description', 'price', 'jar']

// Define
function configure(jar, token, id, name, description, price) {
  const httpOpt = {
    url: '//www.roblox.com/game-pass/update',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        id,
        name,
        description
      }
    }
  }

  // Skip updating name and description if they are not provided.
  if (!(name || description)) {
    return {
      gamepassId: id,
      ...name,
      ...description,
      ...price
    }
  }

  return http(httpOpt).then(function (json) {
    if (json.isValid) {
      return {
        gamepassId: id,
        name,
        description: description || '',
        ...price
      }
    } else {
      // @TODO: Improve error messaging; ROBLOX provides little useful (HTML 403 instead of JSON) feedback on why a request may be considered "not valid", error prevention has been done as much as is practical.
      throw new Error('An error occurred running configureGamepass.js; you likely are accessing a gamepass you do not have permission to edit, or are providing an illegal input.');
    }
  })
}

// Configuring the name/description and robux must be done in separate calls, albeit to the same end-point.
function configureRobux(args) {
  const httpOpt = {
    url: '//www.roblox.com/game-pass/update',
    options: {
      method: 'POST',
      jar: args.jar,
      headers: {
        'X-CSRF-TOKEN': args.token
      },
      json: {
        id: args.id,
        price: Math.floor(args.price || 0), // Prevent Decimals
        isForSale: !!Math.max(args.price, 0) // Boolean Cast
      }
    }
  }
  return http(httpOpt).then(function (json) {
    if (json.isValid) {
      // Passing price as an object, so they can be omitted if configureRobux is not run.
      return configure(args.jar, args.token, args.id, args.name, args.description, {
        price: Math.max(Math.floor(args.price || 0), 0),
        isForSale: !!Math.max(args.price, 0)
      })
    } else {
      throw new Error('An error occurred running configureGamepass.js; you likely are accessing a gamepass you do not have permission to edit, or are providing an illegal input.');
    }
  })
}

function runWithToken(args) {
  const jar = args.jar
  return getGeneralToken({
      jar
    })
    .then(function (token) {
      args.token = token;
      // Needs to catch falsy input of `false` and `0` as they should change the gamepass to offsale; price updating will be skipped if undefined.
      if (typeof (args.price) === 'boolean' || typeof (args.price) === 'number') {
        return configureRobux(args);
      } else {
        return configure(args.jar, args.token, args.id, args.name, args.description);
      }
    })
}

exports.func = function (args) {
  return runWithToken(args)
}