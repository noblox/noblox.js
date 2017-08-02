// Dependencies
var parser = require('cheerio');

// Args
exports.required = [['html', 'selector']];

// Define
exports.func = function (args) {
  var $ = args.selector;
  if (!$) {
    $ = parser.load(args.html);
  }
  var inputs = {};
  var find = ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION', '__RequestVerificationToken'];
  for (var i = 0; i < find.length; i++) {
    var get = find[i];
    inputs[get] = $('input[name=' + get + ']').val();
  }
  return inputs;
};
