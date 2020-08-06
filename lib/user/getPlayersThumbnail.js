// Includes
var http = require('../util/http.js').func

// Args
exports.required = ['userIds', 'size', 'format', 'isCircular']

// Define
exports.func = function (args) {
	if(!Array.isArray(userIds)){
		throw new Error('Users ids needs to be an array')
	}
	const eligibleSizes = ['720', '420', '352', '250', '180', '150', '140', '110', '100', '75', '60', '48', '30']
	if(!eligibleSizes.includes(size)){
		throw new Error(`You are using an ineligible size\nValid sizes: ${eligibleSize.join(', ')}`)
	}
	if(!format){
		format = 'Png'
	}
	if(format.toLowerCase() !== 'png' && format.toLowerCase() !== 'jpeg'){
		throw new Error('Incorrect format type')
	}
	if(isCircular !== true){
		isCircular = false
	}
  return http({
    url: `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userIds.join(',')}&size=${size}x${size}&format=${format}&isCircular=${isCircular}`,
    options: {
      resolveWithFullResponse: true,
      followRedirect: true
    }
  })
    .then(function (res) {
      if(res.statusCode === 200){
		  if(!res.body.data.length){
			throw new Error('Users are invalid')
		  }
		  else{
		  	return res.body
		  }
	  }
    })
}
