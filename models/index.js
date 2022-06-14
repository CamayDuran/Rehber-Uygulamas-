'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
var Umzug = require('umzug');
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
var migrate = function () {
  return new Promise(
      function (resolve, reject) {
          const umzug = new Umzug({
              storage: 'sequelize',
              storageOptions: {
                  sequelize: sequelize,
              },
              // see: https://github.com/sequelize/umzug/issues/17
              migrations: {
                  params: [
                      sequelize.getQueryInterface(), // queryInterface
                      sequelize.constructor, // DataTypes
                      function () {
                          throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
                      }
                  ],
                  path: './migrations',
                  pattern: /\.js$/
              },
              logging: function () {
                  console.log.apply(null, arguments);
              }
          });
          umzug.up().then(function (migrations) {
              resolve(migrations);
              // console.log(`Executed migrations ${migrations}`);
          }).catch(err => {
              reject(err);
          });
      }
  );
};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sequelize.migrate = migrate;
module.exports = db;
