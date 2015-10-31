// Dependencies
var cheerio = require('cheerio');

// Define
module.exports = function(html) {
  var $ = cheerio.load(html);
  var inputs = {};
  var find = ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION'];
  for (var i = 0; i < find.length; i++) {
    var get = find[i];
    inputs[get] = $('input[name=' + get + ']').val();
  }
  return inputs;
};
