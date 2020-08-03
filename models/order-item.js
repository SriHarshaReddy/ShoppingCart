const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const OrderItem = sequelize.define('orderitem',{
id:{
    type : Sequelize.INTEGER,
    allowNull : false,
    autoIncrement : true,
    primaryKey: true   
},
quantity : Sequelize.INTEGER
});

module.exports = OrderItem;