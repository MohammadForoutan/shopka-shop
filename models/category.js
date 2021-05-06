const { DataTypes } = require('sequelize');

const db = require('../configs/database');

const Category = db.define('category', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true
    },
    title: {
        type: DataTypes.STRING
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    }
});

module.exports = Category;
