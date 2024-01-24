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
        allowNull: true,
    },
    acabamento: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    cor: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    enobrecimento: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    formato: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    material: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    arquivo: {
        type: Sequelize.BLOB(),
        allowNull: true,
    },
    extensao: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    raio: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    statusPed: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    graficaAtend: {
        type: Sequelize.STRING(255),
    },
    graficaCancl: {
        type: Sequelize.STRING(255)
    },
})

//ItensPedidos.belongsTo(Produtos, { foreignKey: 'idProduto' });
//ItensPedidos.sync({force:true})
ItensPedidos.sync()

module.exports = ItensPedidos