const {Sequelize, sequelize} = require('./db');

const Pet = sequelize.define('pet', {
  name: Sequelize.STRING,
  species: Sequelize.STRING,
  colour: Sequelize.STRING,
  age: Sequelize.INTEGER,
  date_arriving: Sequelize.DATE,
  date_leaving: Sequelize.DATE
});

module.exports = { Pet };
