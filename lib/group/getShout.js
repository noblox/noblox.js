// Dependencies
var parser = require('cheerio');

// Includes
var http = require('../util/http.js').func;
var getDate = require('../util/getDate.js').func;

// Args
exports.required = ['group'];
exports.optional = ['jar'];

// Define
function getShout (jar, group) {
  var httpOpt = {
    url: '//www.roblox.com/My/Groups.aspx?gid=' + group,
    options: {
      jar: jar
    }
  };
  return http(httpOpt)
  .then(function (body) {
    var $ = parser.load(body);
    var field = $('#ctl00_cphRoblox_GroupStatusPane_StatusTextField');
    if (field.length > 0) {
      var poster = $('#ctl00_cphRoblox_GroupStatusPane_StatusPoster');
      return {
        message: field.text(),
        author: {
          name: poster.text(),
          id: poster.attr('href').match(/\d+/)[0]
        },
        date: getDate({time: $('#ctl00_cphRoblox_GroupStatusPane_StatusDate').text(), timezone: 'CT'})
      };
    }
  });
}

exports.func = function (args) {
  return getShout(args.jar, args.group);
};
