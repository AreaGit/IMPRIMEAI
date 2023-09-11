const Sequelize = require('sequelize')
const db = require('./db')



const  User = db.define('users', {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    userCad: {
        type : Sequelize.STRING(255),
        allowNull: true,
    },
    emailCad: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    passCad: {
        type: Sequelize.STRING(255),
        allowNull: true
    }
})



//CRIAR A TABELA
User.sync()

//User.sync({ force: true})

module.exports = User