const { DataTypes } = require('sequelize');

const db = require('../configs/database');

const User = db.define('user', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resetToken: {
        type: DataTypes.STRING,
    },
    resetTokenExpiration: {
        type: DataTypes.DATE,
    },
    avatar: {
        type: DataTypes.STRING
    }
});

module.exports = User;