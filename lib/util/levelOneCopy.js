// Define
function shallowCopy (obj) {
  return Object.assign({}, obj);
}

module.exports = function (obj) {
  var newObj = shallowCopy(obj);
  for (var index in obj) {
    var value = obj[index];
    if (value instanceof Object) {
      value = shallowCopy(value);
    }
    newObj[index] = value;
  }
  return newObj;
};
