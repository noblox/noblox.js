// Includes
const newCache = require('./new.js')
const add = require('./add.js')
const addIf = require('./addIf.js')
const get = require('./get.js')
const clear = require('./clear.js')
const wrap = require('./wrap.js')

// Define
module.exports = {
  new: newCache,
  add,
  clear,
  addIf,
  get,
  wrap
}
