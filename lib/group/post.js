// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'message']
exports.optional = ['jar']

function postOnGroup (group, postMessage, jar, xcsrf) {
  var httpOpt = {
    url: `https://groups.roblox.com/v2/groups/${group}/wall/posts`,
    options: {
      method: 'POST',
      resolveWithFullResponse: true,
      json: {
        body: postMessage
      },
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': xcsrf
      }
    }
  }

  return http(httpOpt)
  .then(function(res) {
    if(res.statusCode === 400) {
      let resErrors = res.body.errors
      for (let i = 0; i < resErrors.length; i++) { 
        let resError = resErrors[i]
        console.log(resError)
        if(resError.code === 1) {
          throw new Error('Wallpost failed, verify that the group provided exists.')
        }
        if(resError.code === 5) {
          throw new Error('Wallpost failed, your post was empty, white space, or more than 500 characters.')
        }
      }
    }
    if(res.statusCode === 401) {
      throw new Error('Wallpost failed, verify that you are logged in.')
    }
    if(res.statusCode === 403) {
      let resErrors = res.body.errors
      for (let i = 0; i < resErrors.length; i++) { 
        let resError = resErrors[i]
        if(resError.code === 0) {
          throw new Error('Token Validation Failed - Failed to verify XCSRF Token.')
        }
        if(resError.code === 2) {
          throw new Error('You do not have permission to access this group wall.')
        }
      }
    }
    if(res.statusCode === 429) {
      throw new Error('Wallpost failed, you are posting too fast, please try again in a few minutes.')
    }
  })
}

// Define
exports.func = function(args) {
  let jar = args.jar
  console.log(JSON.stringify(args.message))
  return getGeneralToken({jar: jar})
  .then(function(xcsrf) {
    return postOnGroup(args.group, args.message, args.jar, xcsrf)
  })
}