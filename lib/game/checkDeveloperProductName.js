let http = require('../util/http.js').func

exports.required = ['universeId', 'productName']
exports.optional = ['jar', 'productId']

exports.func = (args) => {
    let jar = args.jar,
        universeId = parseInt(args.universeId) ? parseInt(args.universeId) : 0,
        productId = parseInt(args.productId) ? parseInt(args.productId) : 0
    
    return http({
        url: '//www.roblox.com/places/check-developerproduct-name?universeId=' + universeId + '&developerProductId=' + productId + '&developerProductName=' + args.productName + '&_=1515792139751',
        options: {
            method: 'GET',
            jar: jar,
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode !== 200) {
            throw new Error('You are not logged in')
        } else {
            return JSON.parse(res.body)
        }
    })
}