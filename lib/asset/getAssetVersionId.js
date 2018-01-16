let http = require('../util/http.js').func,
    parser = require('cheerio')

exports.required = ['assetId']
exports.optional = ['jar']

exports.func = (args) => {
    let jar = args.jar,
        assetId = parseInt(args.assetId) ? parseInt(args.assetId) : 0
    
    return http({
        url: '//www.roblox.com/studio/plugins/info?assetId=' + assetId,
        options: {
            method: 'GET',
            jar: jar,
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 200) {
            let $ = parser.load(res.body),
                avId = $('.asset-version-id')
            
            if (avId.length > 0) {
                return {
                    assetId: assetId,
                    assetVersionId: avId.attr('value')
                }
            }
        } else {
            throw new Error('Get AssetVersionId failed.')
        }
    })
}