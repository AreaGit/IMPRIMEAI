const Sequelize = require('sequelize')

const sequelize = new Sequelize("listaUser", "root", "", {
    host: "localhost",
    dialect: 'mysql'
})

sequelize.authenticate()
.then(function () {
    console.log("Conectado ao banco de dados com sucesso!")
}).catch(function() {
    console.log("Erro ao conectar com o banco de dados")
})

module.exports = sequelize