// Includes
const http = require('../util/http.js').func
const rbxDate = require('../util/getDate.js').func
const parser = require('cheerio')

// Args
exports.required = ['userId']

// Define
exports.func = function (args) {
  return http({
    url: '//www.roblox.com/users/' + args.userId + '/profile',
    options: {
      resolveWithFullResponse: true,
      followRedirect: false
    }
  })
    .then(function (res) {
      if (res.statusCode === 200) {
        const body = parser.load(res.body)

        const blurb = body('.profile-about-content-text').text()
        const status = body('div[data-statustext]').attr('data-statustext')
        const username = body('.header-title h2').text()
        const pastnames = body('.tooltip-pastnames').attr('title')
        let joinDate = body('.profile-stats-container .text-lead').eq(0).text()

        joinDate = rbxDate({ time: joinDate, timezone: 'CT' })

        const currentTime = new Date()
        const playerAge = Math.round(Math.abs((joinDate.getTime() - currentTime.getTime()) / (24 * 60 * 60 * 1000)))

        return {
          username: username,
          status: status,
          blurb: blurb,
          joinDate: joinDate,
          age: playerAge,
          pastnames: pastnames
        }
      } else {
        throw new Error('User does not exist')
      }
    })
}
