const Sequelize = require('Sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id: {
      type : Sequelize.INTEGER,
      allowNull : false,
      autoIncrement : true,
      primaryKey : true
    },
    userName: {
        type : Sequelize.STRING,
        allowNull : false
    },
    emailId: {
        type : Sequelize.STRING,
        allowNull : false
    }
});

module.exports = User;