'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    // Set custom primary key column
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    emailAddress: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    }
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  };

  return User;
};