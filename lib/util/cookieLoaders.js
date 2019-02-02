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
    loadCookie: function () {
      return query('SELECT cookie, updated as time FROM rbx_cookie LIMIT 1')
    },
    saveCookie: async function (cookie) {
      await query(`INSERT INTO rbx_cookie(cookie, updated)
      VALUES (?, ?)`, [cookie, Date.now()])
    }
  }
}
// PostgreSQL
exports.func.postgres = async function (options) {
  let pool = new (require('pg').Pool)(options)

  let client = null
  try {
    client = await pool.connect()
    await client.query('BEGIN')
    await client.query(`CREATE TABLE IF NOT EXISTS rbx_cookie (
      cookie text,
      updated bigint
    )`)
    await client.query(`COMMENT ON TABLE rbx_cookie IS 'Created by noblox.js'`)
    client.query('COMMIT')
    client.release()
  } catch (err) {
    if (client) { client.release() }
    throw err
  }

  return {
    loadCookie: function () {
      return pool.query('SELECT cookie, updated as time FROM rbx_cookie LIMIT 1').rows[0]
    },
    saveCookie: async function (cookie) {
      await pool.query(`INSERT INTO rbx_cookie(cookie, updated)
      VALUES($1, $2)`, [cookie, Date.now()])
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
