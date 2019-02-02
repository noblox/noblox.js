// Includes
const { promisify } = require('util')
// Args
exports.required = []
exports.optional = []
// Define
// MySQL
exports.func.mysql = async function (options) {
  let pool = require('mysql').createPool(options)
  let query = promisify(pool.query)

  await query(`CREATE TABLE IF NOT EXISTS rbx_cookie (
    cookie varchar(128),
    updated bigint
  )
  COMMENT="Created by noblox.js"`)

  return {
    loadCookie: async function () {
      return await query('SELECT cookie, updated as time FROM rbx_cookie LIMIT 1')
    },
    saveCookie: async function (cookie) {
	  await query(`INSERT INTO rbx_cookie(cookie, updated)
	  VALUES (?, ?)`, [cookie, Date.now()])
    }
  }
}
// PostgreSQL
exports.func.postgres = async function (options) {
  let pool = new require('pg').Pool(options)
  return {
    loadCookie: async function () {

    },
    saveCookie: async function (cookie) {

    }
  }
}
// Microsoft SQL
exports.func.mssql = async function (options) {
  let pool = new require('mssql').ConnectionPool(options)
  return {
    loadCookie: async function () {

    },
    saveCookie: async function (cookie) {

    }
  }
}

exports.func = async function (type, options) {
  switch (type.toLowerCase()) {
    case 'mysql':
      return await this.mysql(options)
    case 'postgres':
      return await this.postgres(options)
    case 'mssql':
      return await this.mssql(options)
  }
}
