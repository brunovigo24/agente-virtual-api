const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '172.17.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123',
  database: process.env.DB_DATABASE || 'automacaobeta',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
