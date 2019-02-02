// Args
exports.required = []
exports.optional = []
// Define
// MySQL
exports.func.mysql = async function(options) {
	let pool = require('mysql').createPool(options)
	return {
		loadCookie = function() {

		},
		saveCookie = function() {

		}
	}
}
// PostgreSQL
exports.func.postgres = async function(options) {
	let pool = new require('pg').Pool(options)
	return {
		loadCookie = async function() {

		},
		saveCookie = async function(cookie) {

		}
	}
}
// Microsoft SQL
exports.func.mssql = async function(options) {
	let pool = new require('mssql').ConnectionPool(options)
	return {
		loadCookie = async function() {

		},
		saveCookie = async function(cookie) {

		}
	}
}

exports.func = async function(type, options) {
	switch (type.toLowerCase()) {
		case 'mysql':
			return await this.mysql(options)
		case 'postgres':
			return await this.postgres(options)
		case 'mssql':
			return await this.mssql(options)
	}
}
