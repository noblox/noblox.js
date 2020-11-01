// Dependencies
const parser = require('cheerio')

// Args
exports.required = ['html']
exports.optional = ['find']

// Docs
/**
 * Get verification inputs on a page.
 * @category Utility
 * @alias getInputs
 * @param {string} html - The html to get the inputs from.
 * @param {Array=} find - The inputs to find on the page
 * @returns {Inputs}
 * @example const noblox = require("noblox.js")
 * const inputs = noblox.getInputs("htmlhere")
**/

// Define
exports.func = function (args) {
  const $ = parser.load(args.html)
  const inputs = {}
  const find = args.find
  if (find) {
    for (let i = 0; i < find.length; i++) {
      const get = find[i]
      inputs[get] = $('input[name=' + get + ']').val()
    }
  } else {
    $('input[name]').each(function (index, element) {
      const here = $(this)
      inputs[here.attr('name')] = here.val()
    })
  }
  return inputs
}
