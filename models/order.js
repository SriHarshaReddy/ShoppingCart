const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order',{
id:{
    type : Sequelize.INTEGER,
    allowNull : false,
    autoIncrement : true,
    primaryKey: true   
}
});

module.exports = Order;