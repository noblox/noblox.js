// Dependencies
const parser = require('cheerio')

// Args
exports.required = [['html', 'selector']]

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
