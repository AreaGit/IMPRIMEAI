const Sequelize = require('sequelize')
const db = require('./db')

const Produtos = db.define('produtos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(255),
        allowNull: false // Corrigido para allowNull em vez de allownull
    },
    preço: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true // Corrigido para allowNull em vez de allownull
    },
    categoria: {
        type: Sequelize.ENUM("Comunicação Visual", "Adesivos e Etiquetas", "Papelaria", "Brindes", "Cartazes"),
        allowNull: true // Corrigido para allowNull em vez de allownull
    },
    descrição: {
        type: Sequelize.TEXT(),
        allowNull: true // Corrigido para allowNull em vez de allownull
    },
    imagem: {
        type: Sequelize.TEXT(),
        allowNull: true // Corrigido para allowNull em vez de allownull
    }
})

// CRIAR A TABELA
Produtos.sync();

// Exportar o modelo Produtos
module.exports = Produtos;
