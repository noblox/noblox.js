// Dependencies
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);

// Define
module.exports = function(html, find) {
  var page = $(html);
  var inputs = {};
  if (find) {
    for (var i = 0; i < find.length; i++) {
      var get = find[i];
      inputs[get] = page.find('input[name=' + get + ']').val();
    }
  } else {
    page.find('input[name]').each(function(index, element) {
      var here = $(this);
      inputs[here.attr('name')] = here.val();
    });
  }
  return inputs;
};
