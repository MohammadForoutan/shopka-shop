const { DataTypes } = require("sequelize");
const db = require("../configs/database");

const OrderItem = db.define('orderItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    quantity: DataTypes.INTEGER
  });
  
  module.exports = OrderItem;