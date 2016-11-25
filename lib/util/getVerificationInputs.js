// Dependencies
var parser = require('cheerio');

// Args
exports.required = ['html'];

// Define
exports.func = function (args) {
  var $ = parser.load(args.html);
  var inputs = {};
  var find = ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION', '__RequestVerificationToken'];
  for (var i = 0; i < find.length; i++) {
    var get = find[i];
    inputs[get] = $('input[name=' + get + ']').val();
  }
  return inputs;
};
