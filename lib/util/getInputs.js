// Dependencies
var cheerio = require('cheerio');

// Define
module.exports = function(html, find) {
  var $ = cheerio.load(html);
  var inputs = {};
  if (find) {
    for (var i = 0; i < find.length; i++) {
      var get = find[i];
      inputs[get] = $('input[name=' + get + ']').val();
    }
  } else {
    $('input[name]').each(function(index, element) {
      var here = $(this);
      inputs[here.attr('name')] = here.val();
    });
  }
  return inputs;
};
