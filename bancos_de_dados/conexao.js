const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '3306',
  user: 'users',
  password: 'imprimeai',
  database: 'listaUser.sql'
});

module.exports = connection;