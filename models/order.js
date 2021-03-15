const { DataTypes } = require('sequelize');

const db = require('../configs/database');

const Order = db.define('order', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true
    }
})


module.exports = Order;