//引入配置对象
const config = require('../config');
// 引入数据库对象
const mysql = require('mysql');
// 选择数据库连接
const pool = mysql.createPool({
	connectionLimit: config.db_connectionLimit,
	host: config.db_host,
	user: config.db_user,
	password: config.db_password,
	database: config.db_database
});

/**
 * 
 * @param {*} sql mysql查询语句
 * @param {*} props 查询的条件
 * @param {*} callback 回调函数，处理获取数据后的操作
 */
let query = function (sql, props, callback) {
	// 连接数据库
	pool.getConnection((err, connection) => {
		// 处理连接数据库时发生的异常
		if (err) return callback(err, null);
		// 从数据库中查询相关的数据
		connection.query(sql, props, (error, results) => {
			// 查询完毕,释放连接
			connection.release();
			// 不管有没有异常,让外部判断
			callback(error, results);
		})
	})
};

// 将这个函数向外暴露
module.exports = {
	query: query
};