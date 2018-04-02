// Args
exports.required = ['location']
exports.optional = ['append']

// Define
exports.func = function (args) {
  var redirect = args.location
  var append = args.append
  if (redirect.indexOf('/Forum/Msgs/default.aspx') === 0) {
    var id = parseInt(redirect.match(/MessageId=(\d+)/)[1], 10)
    var errorMsg
    switch (id) {
      case 4:
        errorMsg = 'Duplicate posts are not allowed'
        break
      case 6:
        errorMsg = 'Forum does not exist'
        break
      case 8:
        errorMsg = 'Post blocked for prohibited content'
        break
      case 9:
        errorMsg = 'Post does not exist'
        break
      case 17:
        errorMsg = 'Floodcheck blocked post'
        break
      case 18:
        errorMsg = 'Post is too large'
        break
      default:
        errorMsg = 'Forum post failed, error message path: ' + redirect
    }
    return new Error(errorMsg)
  } else {
    return new Error(append ? (append + ', unknown path redirect: ' + redirect) : ('Unknown path redirect: ' + redirect))
  }
}
