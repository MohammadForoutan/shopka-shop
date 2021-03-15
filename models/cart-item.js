const { DataTypes } = require("sequelize");
const db = require('../configs/database')

const CartItem = db.define('cartItem', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true
    },
    quantity: {
        type: DataTypes.INTEGER
    }
})


module.exports = CartItem;