// Dependencies
const parser = require('cheerio')

// Args
exports.required = [['html', 'selector']]

// Docs
/**
 * Get the verification inputs from the html.
 * @category Utility
 * @alias getVerificationInputs
 * @param {string | function} html | selector - The html to search or the cheerio selector to use.
 * @returns {Inputs}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie.
 * const inputs = noblox.getVerificationInputs("htmlstuff")
**/

// Define
exports.func = function (args) {
  let $ = args.selector
  if (!$) {
    $ = parser.load(args.html)
  }
  const inputs = {}
  const find = ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION', '__RequestVerificationToken']
  for (let i = 0; i < find.length; i++) {
    const get = find[i]
    inputs[get] = $('input[name=' + get + ']').val()
  }
  return inputs
}
