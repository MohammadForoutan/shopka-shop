const { Sequelize, Op } = require('sequelize');

// Env variable

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;


// const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
//     dialect: 'mysql',
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT
// })

const db = new Sequelize(process.env.DB_URL)


module.exports = db;