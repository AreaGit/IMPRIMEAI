const Sequelize = require('sequelize')
const db = require('./db')


const  User = db.define('users', {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    userCad: {
        type : Sequelize.STRING(10),
        allowNull: false,
    },
    emailCad: {
        type: Sequelize.STRING(),
        allowNull: true
    },
    passCad: {
        type: Sequelize.STRING(),
        allowNull: true
    }
})

//CRIAR A TABELA
User.sync()

//User.sync({ force: true})

module.exports = User 