const Sequelize = require('sequelize')
const db = require('./db')


const ItensPedidos = db.define('itenspedidos', {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    idPed: {
        type: Sequelize.INTEGER,
    },
    nomeProd: {
        type : Sequelize.STRING(255),
        allowNull:true
    },
    quantidade: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    valorProd: {
        type: Sequelize.FLOAT, // Use FLOAT para valores decimais
        allowNull: false,
    },
    raio: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    statusPed: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
})

ItensPedidos.sync({force:true})
//ItensPedidos.sync()

module.exports = ItensPedidos