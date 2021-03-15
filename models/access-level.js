const { DataTypes } = require('sequelize');

const db = require('../configs/database');

const AccessLevel = db.define('accessLevel', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
})


module.exports = AccessLevel;