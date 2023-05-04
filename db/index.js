const {Pet} = require('./Pet');
const {User} = require("./User")
const {sequelize, Sequelize} = require('./db');


Pet.belongsTo(User, {foreignKey: 'ownerId'})
User.hasMany(Pet , {foreignKey: 'ownerId'})


module.exports = {
    Pet, User
};