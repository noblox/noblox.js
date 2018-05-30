const request = require('superagent')
const parser = require('cheerio')
const rbxDate = require('../util/getDate.js').func
const Map = require('collections/map')

module.exports = async function (args) {
  let user = {}
  let apiData

  if (typeof args.user === 'number') {
    const apiFetch = await request.get(`https://api.roblox.com/users/${args.user}`)

    if (apiFetch.status === 200) {
      apiData = apiFetch.body
    } else {
      throw new Error('User does not exist')
    }

    // Check if the user argument provided is a string, then assume it's a username
  } else if (typeof args.user === 'string') {
    const apiFetch = await request.get(`https://api.roblox.com/users/get-by-username?username=${args.user}`)

    // Roblox is not consist with their errors, so check if we can find an Id from the returned data (after parsing in JSON)
    if (apiFetch.body['Id']) {
      apiData = apiFetch.body
    } else {
      throw new Error('User does not exist')
    }
  }

  const profile = await request.get(`https://www.roblox.com/users/${apiData.Id}/profile`)

  // User was most likely banned if they do not exist despite having an ID
  if (profile.status !== 200) throw new Error('User does not exist')

  let fetchedGroups = await request.get(`https://api.roblox.com/users/${apiData.Id}/groups`)
  fetchedGroups = fetchedGroups.body

  const $ = parser.load(profile.text)

  const blurb = $('.profile-about-content-text').text()
  const status = $('div[data-statustext]').attr('data-statustext')
  const userId = apiData.Id
  const username = apiData.Username
  const joinDate = rbxDate({time: $('.profile-stats-container .text-lead').eq(0).text(), timezone: 'CT'})
  const groups = new Map()

  for (var group in fetchedGroups) {
    groups.set(fetchedGroups[group].Id, fetchedGroups[group])
  }

  user.blurb = blurb
  user.status = status
  user.userId = userId
  user.username = username
  user.joinDate = joinDate
  user.groups = groups

  return user
}
