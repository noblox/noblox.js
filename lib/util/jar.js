// Dependencies
const request = require('request-promise')

// Includes
const settings = require('../../settings.json')

// Define
exports.func = function (sessionOnly) {
  if (!sessionOnly) {
    sessionOnly = settings.session_only
  }
  return (sessionOnly ? { session: '' } : request.jar())
}
