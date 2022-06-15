'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  team.init({
    phone: DataTypes.STRING,
    leagueId: DataTypes.INTEGER,
    //status:DataTypes.BOOLEAN,
    createdAt :DataTypes.DATE,
    updatedAt :DataTypes.DATE,
  }, {
    sequelize,
    // If you want to give a custom name to the deletedAt column
    modelName: 'team',
   
  });
  return team;
};