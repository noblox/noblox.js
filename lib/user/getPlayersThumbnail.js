// Includes
var http = require('../util/http.js').func

// Args
exports.required = ['userIds', 'size']
exports.optional = ['format', 'isCircular']

// Define
exports.func = function (args) {
	if(!Array.isArray(args.userIds)){
		throw new Error('Users ids needs to be an array')
	}
	const eligibleSizes = [720, 420, 352, 250, 180, 150, 140, 110, 100, 75, 60, 48, 30]
	if(!eligibleSizes.includes(args.size)){
		throw new Error(`You are using an ineligible size\nValid sizes: ${eligibleSizes.join(', ')}`)
	}
	if(!args.format){
		args.format = 'Png'
	}
	if(args.format.toLowerCase() !== 'png' && args.format.toLowerCase() !== 'jpeg'){
		throw new Error('Incorrect format type')
	}
	if(args.isCircular !== true){
		args.isCircular = false
	}
  return http({
    url: `https://thumbnails.roblox.com/v1/users/avatar?userIds=${args.userIds.join(',')}&size=${args.size}x${args.size}&format=${args.format}&isCircular=${args.isCircular}`,
    options: {
      resolveWithFullResponse: true,
      followRedirect: true
    }
  })
    .then(function (res) {
      if(res.statusCode === 200){
		  const json = JSON.parse(res.body)
		  if(!json.data.length){
			  throw new Error('Users are invalid')
		  }
		  else{
			  return json.data
		  }
	  }
    })
}
