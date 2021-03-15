const { DataTypes } = require('sequelize');

const db = require('../configs/database');

const Comment = db.define('comment', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.TEXT
    },
    usrename: {
        type: DataTypes.STRING
    }
})


module.exports = Comment;