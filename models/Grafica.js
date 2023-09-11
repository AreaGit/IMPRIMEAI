const Sequelize = require('sequelize')
const db = require('./db')


const Grafica = db.define('graficas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    endereco: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    cidade: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    estado: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    latitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false
    },
    longitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false
    }
});


// CRIAR A TABELA
Grafica.sync();

// Exportar o modelo Grafica para uso em outros lugares
module.exports = Grafica;