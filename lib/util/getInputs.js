// Dependencies
var cheerio = require('whacko');

// Args
exports.args = ['html', 'find'];

// Define
exports.func = function (args) {
  var $ = cheerio.load(args.html);
  var inputs = {};
  var find = args.find;
  if (find) {
    for (var i = 0; i < find.length; i++) {
      var get = find[i];
      inputs[get] = $('input[name=' + get + ']').val();
    }
  } else {
    $('input[name]').each(function (index, element) {
      var here = $(this);
      inputs[here.attr('name')] = here.val();
    });
  }
  return inputs;
};
