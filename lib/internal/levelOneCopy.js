// Define
function shallowCopy (obj) {
  return Object.assign(obj instanceof Array ? [] : {}, obj)
}

module.exports = function (obj) {
  const newObj = shallowCopy(obj)
  for (const index in obj) {
    let value = obj[index]
    if (value instanceof Object) {
      value = shallowCopy(value)
    }
    newObj[index] = value
  }
  return newObj
}
