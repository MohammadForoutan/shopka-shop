const { DataTypes } = require('sequelize');

const db = require('../configs/database');

const Cart = db.define('cart', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true
    }
})


module.exports = Cart;