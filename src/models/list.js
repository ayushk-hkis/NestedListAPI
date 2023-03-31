'use strict';
const db = require('./index')
const Model = db.Model
const sequelize = db.sequelize

class List extends Model { }

List.init({
  title: {
    type: db.Sequelize.STRING
  },
  parent: {
    type: db.Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  timestamps: true,
  modelName: 'lists',
  freezeTableName: true
})

module.exports = List