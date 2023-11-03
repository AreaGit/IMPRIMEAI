const Sequelize = require('sequelize')
const db = require('./db')


const Pedidos = db.define('pedidos', {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    idUserPed: {
        type: Sequelize.INTEGER,
    },
    nomePed: {
        type : Sequelize.STRING(255),
        allowNull:true
    },
    quantPed: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    valorPed: {
        type: Sequelize.FLOAT, // Use FLOAT para valores decimais
        allowNull: false,
    },
    enderecoEntrega: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    statusPed: {
        type: Sequelize.STRING(255),
        allowNull: true
    }
})



Pedidos.sync({force:true})
//Pedidos.sync()

module.exports = Pedidos