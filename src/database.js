const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '172.17.0.1',
  user: 'root',
  password: '123',
  database: 'automacaobeta',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
