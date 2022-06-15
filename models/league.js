'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class league extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  league.init({
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    company: DataTypes.STRING,
   // status:DataTypes.BOOLEAN,
    createdAt :DataTypes.DATE,
    updatedAt :DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'league',
  
  });
  return league;
};