// Includes
var request = require('request-promise');
var settings = require('../settings.json');

exports.jar = request.jar();
exports.errorHandler = function (err) {
  console.error(err.stack);
};
exports.cache = require('./cache/new.js')([{
  name: 'XCSRF',
  refresh: settings.cache.xcsrf_refresh,
  expire: settings.cache.XCSRF
}, {
  name: 'Verify',
  refresh: settings.cache.verify_refresh,
  expire: settings.cache.Veirfy
}, {
  name: 'Roles',
  refresh: settings.cache.role_refresh,
  expire: settings.cache.Roles
}, {
  name: 'Product',
  refresh: settings.cache.product_refresh,
  expire: settings.cache.Product
}, {
  name: 'RolesetId',
  refresh: settings.cache.rolesetid_refresh,
  expire: settings.cache.RolesetId
}]);
