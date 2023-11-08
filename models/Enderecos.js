const Sequelize = require('sequelize')
const db = require('./db')

const Enderecos = db.define('enderecos', {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    idPed: {
        type: Sequelize.INTEGER,
        allownull: true
    },
    rua: {
        type: Sequelize.STRING(255),
        allownull: false
    },
    cep: {
        type: Sequelize.STRING(255),
        allownull: false
    },
    cidade: {
        type: Sequelize.STRING(255),
        allownull: false
    },
    estado: {
        type: Sequelize.STRING(255),
        allownull: false
    },
    numero: {
        type: Sequelize.STRING(255),
        allownull: false
    },
    complemento: {
        type: Sequelize.STRING(255),
        allownull: false
    },
    bairro: {
        type: Sequelize.STRING(255),
        allownull: false
    },
    cuidados: {
        type: Sequelize.STRING(255),
        allownull: false
    },
    celular: {
        type: Sequelize.STRING(255),
        allownull: false
    }, 
    quantidade: {
        type: Sequelize.STRING(255),
        allownull: false
    }
})

//Criar Tabela

//Enderecos.sync()
Enderecos.sync({force:true})

module.exports = Enderecos