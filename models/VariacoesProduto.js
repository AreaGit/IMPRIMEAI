const Sequelize = require('sequelize')
const db = require('./db')
const Produtos = require('./Produtos');

const VariacoesProduto = db.define('variacoesproduto', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idProduto: {
        type: Sequelize.INTEGER,
    },
    material: {
        type: Sequelize.STRING(255),
    },
    tamanho: {
        type: Sequelize.STRING(255),
    },
    modeloProduto: {
        type: Sequelize.STRING(255),
    },
    cor: {
        type: Sequelize.STRING(255),
    },
})

VariacoesProduto.belongsTo(Produtos, { foreignKey: 'idProduto' });
VariacoesProduto.sync({force:true})
//VariacoesProduto.sync()

module.exports = VariacoesProduto;