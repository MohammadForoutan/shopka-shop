const { DataTypes } = require('sequelize');

const db = require('../configs/database');

const CommentStatus = db.define('commentStatus', {
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


module.exports = CommentStatus;