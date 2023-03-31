'use strict'
const { Sequelize, Model, DataTypes } = require('sequelize')
const { development } = require('../db/config/config.json')
var db = {}

const sequelize = new Sequelize(development.database, development.username, development.password, {
    host: development.host,
    dialect: development.dialect
})

db.sequelize = sequelize
db.Sequelize = Sequelize
db.Model = Model
db.DataTypes = DataTypes

module.exports = db;