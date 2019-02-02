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
    cookie varchar(256),
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
  let { ConnectionPool, Transaction, Request } = require('mssql')
  let pool = new ConnectionPool(options).connect()

  let transaction = new Transaction(pool)
  await transaction.begin();
  (new Request(transaction)).query(`CREATE TABLE IF NOT EXISTS rbx_cookie (
    cookie ntext,
    updated bigint
  )`);
  (new Request(transaction)).execute('sp_addextendedproperty')
    .input('name', 'Source')
    .input('value', 'Created by noblox.js')
    .input('level0type', 'Schema')
    .input('level0name', 'dbo')
    .input('level1type', 'Table')
    .input('level1name', 'rbx_cookie')
  await transaction.commit()

  return {
    loadCookie: async function () {
      return (await pool.request().query('SELECT cookie, updated as time FROM rbx_cookie LIMIT 1')).recordset[0]
    },
    saveCookie: async function (cookie) {
      await pool.request().query`INSERT INTO rbx_cookie(cookie, updated) VALUES(${cookie}, ${Date.now()})`
    }
  }
}

exports.func = function (type, options) {
  switch (type.toLowerCase()) {
    case 'mysql':
      return this.mysql(options)
    case 'postgres':
      return this.postgres(options)
    case 'mssql':
      return this.mssql(options)
  }
}
