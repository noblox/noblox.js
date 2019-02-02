// Args
exports.required = []
exports.optional = []
// Define
// MySQL
exports.func.mysql = function(options) {
	let pool = require('mysql').createPool(options)
	return {
		loadCookie = function() {

		},
		saveCookie = function() {

		}
	}
}
// PostgreSQL
exports.func.postgres = function(options) {
	let pool = new require('pg').Pool(options)
	return {
		loadCookie = function() {

		},
		saveCookie = function() {

		}
	}
}
// Microsoft SQL
exports.func.mssql = function(options) {
	let pool = new require('mssql').ConnectionPool(options)
	return {
		loadCookie = function() {

		},
		saveCookie = function() {

		}
	}
}

exports.func = function(type, options) {
	switch (type.toLowerCase()) {
		case 'mysql':
			return this.mysql(options)
		case 'postgres':
			return this.postgres(options)
		case 'mssql':
			return this.mssql(options)
	}
}
