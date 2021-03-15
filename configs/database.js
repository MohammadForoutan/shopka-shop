const { Sequelize, Op } = require('sequelize');

const db = new Sequelize('simple-shop', 'root', '1234', {
    dialect: 'mysql',
    host: 'localhost'
})


module.exports = db;