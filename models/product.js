const { DataTypes } = require('sequelize');

const db = require('../configs/database');

const Product = db.define('product', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    attributes: {
        type: DataTypes.TEXT
    },
    completeDecription: {
        type: DataTypes.TEXT
    }
});

module.exports = Product;
