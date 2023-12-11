const Sequelize = require('sequelize')
const db = require('./db')
const Produtos = require('./Produtos');

const ItensPedidos = db.define('itenspedidos', {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    idPed: {
        type: Sequelize.INTEGER,
    },
    idProduto: {
        type: Sequelize.STRING(255),
        allowNull: true,
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
    acabamento: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    cor: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    enobrecimento: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    formato: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    material: {
        type: Sequelize.STRING(255),
        allowNull: false
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

ItensPedidos.belongsTo(Produtos, { foreignKey: 'idProduto' });
//ItensPedidos.sync({force:true})
ItensPedidos.sync()

module.exports = ItensPedidos