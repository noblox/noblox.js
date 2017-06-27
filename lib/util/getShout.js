// Includes
var http = require('./http.js').func;
var parser = require('cheerio');

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
        date: new Date($('#ctl00_cphRoblox_GroupStatusPane_StatusDate').text() + ' CST')
      };
    }
  });
}

exports.func = function (args) {
  return getShout(args.jar, args.group);
};
