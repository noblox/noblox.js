// Dependencies
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);

// Define
module.exports = function(html) {
  var page = $(html);
  var inputs = {};
  var find = ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION'];
  for (var i = 0; i < find.length; i++) {
    var get = find[i];
    inputs[get] = page.find('input[name=' + get + ']').val();
  }
  return inputs;
};
