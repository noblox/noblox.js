// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'target']
exports.optional = ['jar']

function exileUser(group, target, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/users/${target}`,
      options: {
        method: 'DELETE',
        resolveWithFullResponse: true,
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }
  
    return http(httpOpt)
    .then(function(res) {
      if(res.statusCode === 200) {
        resolve()
      }
      if(res.statusCode === 400) {
        let resErrors = res.body.errors
        for (let i = 0; i < resErrors.length; i++) { 
          let resError = resErrors[i]
          if(resError.code === 1) {
            reject(new Error('The group is invalid or does not exist.'))
          }
          if(resError.code === 3) {
            reject(new Error('The user is invalid or does not exist.'))
          }
        }
      }
      if(res.statusCode === 401) {
        reject(new Error('Authorization has been denied for this request. Ensure you are logged in.'))
      }
      if(res.statusCode === 403) {
        let resErrors = res.body.errors
        for (let i = 0; i < resErrors.length; i++) { 
          let resError = resErrors[i]
          if(resError.code === 0) {
            reject(new Error('Token Validation Failed - Failed to verify XCSRF Token.'))
          }
          if(resError.code === 4) {
            reject(new Error('You do not have permission to exile this member.'))
          }
        }
      }
    })
  })
}

// Define
exports.func = function(args) {
  let jar = args.jar
  return getGeneralToken({jar: jar})
  .then(function(xcsrf) {
    return exileUser(args.group, args.target, args.jar, xcsrf)
  })
}