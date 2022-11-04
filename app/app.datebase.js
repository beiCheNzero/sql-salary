const mysql = require('mysql2')
const {
  MYSQL_USER,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_QUEUELIMIT,
  MYSQL_CONNECTIONLIMIT
} = require('./app.config')

// 创建连接池
const connections = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  // 可以没有端口，应该是默认就是3306
  port: MYSQL_PORT,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: MYSQL_CONNECTIONLIMIT,
  queueLimit: MYSQL_QUEUELIMIT
})

connections.getConnection((err, connection) => {
  if (err) {
    console.log('连接失败：' + err)
  } else {
    console.log('连接成功')
  }
  // 释放连接池
  connections.releaseConnection(connection);
})

module.exports = connections.promise()
