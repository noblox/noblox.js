module.exports = {
  version: require('../package.json').version,
  RobloxUser: require('./user/RobloxUser'),
  Client: require('./user/Client'),

  getUser: require('./user/getUser').func
}
