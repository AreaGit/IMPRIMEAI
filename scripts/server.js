const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { extend } = require('jquery')

const app = express()

app.use(bodyParser.urlencoded({extend:true}))

const db = mysql.createConnection({
    host: 'local-host',
    user: 'seu-usuario',
    password: 'sua-senha',
    database: 'seu-banco-de-dados'
})
