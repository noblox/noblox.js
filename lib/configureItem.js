// Includes
var generalRequest = require('./util/generalRequest.js').func;

// Args
exports.required = ['id', 'name', 'description'];
exports.optional = ['enableComments', 'sellForRobux', 'genreSelection', 'jar'];

// Define
function configure (jar, id, name, description, enableComments, sellForRobux, genreSelection) {
  var url = 'https://www.roblox.com/My/Item.aspx?ID=' + id;
  var data = {
    __EVENTTARGET: 'ctl00$cphRoblox$SubmitButtonTop',
    ctl00$cphRoblox$DescriptionTextBox: description,
    ctl00$cphRoblox$NameTextBox: name,
    ctl00$cphRoblox$actualGenreSelection: genreSelection || 1
  };
  if (sellForRobux) {
    data.ctl00$cphRoblox$SellThisItemCheckBox = 'on';
    data.ctl00$cphRoblox$SellForRobux = 'on';
    data.ctl00$cphRoblox$RobuxPrice = sellForRobux;
  }
  if (enableComments) {
    data.ctl00$cphRoblox$EnableCommentsCheckBox = 'on';
  }
  return generalRequest({
    url: url,
    events: data,
    jar: jar
  })
  .then(function (run) {
    if (run.res.statusCode !== 200) {
      throw new Error('Error configuring item, make sure not to sell unsellable items or anything else unusual.');
    }
  });
}

exports.func = function (args) {
  return configure(args.jar, args.id, args.name, args.description, args.enableComments, args.sellForRobux, args.genreSelection);
};
