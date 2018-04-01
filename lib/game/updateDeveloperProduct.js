let http = require('../util/http.js').func,
  getGeneralToken = require('../util/getGeneralToken.js').func,
  checkProductName = require('./checkDeveloperProductName.js').func,
  parser = require('cheerio')

exports.required = ['universeId', 'productId', 'name', 'priceInRobux']
exports.optional = ['description', 'jar']

let nextFunction = (jar, token, universeId, productId, prodName, priceInRobux, prodDescription) => {
  return checkProductName({
    universeId: universeId,
    productId: productId,
    productName: prodName
  }).then((res) => {
    if (res.Success && res.Message == 'Name available') {
      return http({
        url: '//www.roblox.com/places/developerproducts/update',
        options: {
          method: 'POST',
          jar: jar,
          headers: {
            'X-CSRF-TOKEN': token
          },
          form: {
            universeId: universeId,
            name: prodName,
            developerProductId: productId,
            priceInRobux: priceInRobux,
            description: prodDescription
          },
          resolveWithFullResponse: true
        }
      }).then((res) => {
        if (res.statusCode === 200) {
          let $ = parser.load(res.body),
            creationStatus = $('#DeveloperProductStatus')

          if (creationStatus.length > 0 && creationStatus.text().toLowerCase().indexOf('successfully updated') > -1) {
            return {
              universeId: universeId,
              name: prodName,
              priceInRobux: priceInRobux,
              description: prodDescription,
              productId: productId
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
  let jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.universeId, args.productId, args.name, args.priceInRobux, args.prodDescription)
  })
}
