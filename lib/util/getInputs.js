// Dependencies
var parser = require('cheerio')

// Args
exports.required = ['html']
exports.optional = ['find']

// Define
exports.func = function (args) {
  var $ = parser.load(args.html)
  var inputs = {}
  var find = args.find
  if (find) {
    for (var i = 0; i < find.length; i++) {
      var get = find[i]
      inputs[get] = $('input[name=' + get + ']').val()
    }
  } else {
    $('input[name]').each(function (index, element) {
      var here = $(this)
      inputs[here.attr('name')] = here.val()
    })
  }
  return inputs
}
