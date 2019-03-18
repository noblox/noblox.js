const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const checkProductName = require('./checkDeveloperProductName.js').func
const parser = require('cheerio')

exports.required = ['universeId', 'name', 'priceInRobux']
exports.optional = ['description', 'jar']

const nextFunction = (jar, token, universeId, prodName, priceInRobux, prodDescription) => {
  return checkProductName({
    universeId: universeId,
    productName: prodName
  }).then((res) => {
    if (res.Success && res.Message === 'Name available') {
      return http({
        url: '//www.roblox.com/places/developerproducts/add',
        options: {
          method: 'POST',
          jar: jar,
          headers: {
            'X-CSRF-TOKEN': token
          },
          form: {
            universeId: universeId,
            name: prodName,
            priceInRobux: priceInRobux,
            description: prodDescription
          },
          resolveWithFullResponse: true
        }
      }).then((res) => {
        if (res.statusCode === 200) {
          let $ = parser.load(res.body)
          let creationStatus = $('#DeveloperProductStatus')

          if (creationStatus.length > 0) {
            return {
              universeId: universeId,
              name: prodName,
              priceInRobux: priceInRobux,
              description: prodDescription,
              productId: creationStatus.text().match(/\d+/)[0]
            }
          }
        } else {
          throw new Error('Create product failed')
        }
      })
    } else {
      throw new Error('Product with this name already exists')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.universeId, args.name, args.priceInRobux, args.prodDescription)
  })
}
