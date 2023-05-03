const {sequelize} = require('./db');
const {Pet} = require("./Pet")

const seed = async () => {
    await sequelize.sync({ force: true }); // recreate db
    await Pet.bulkCreate([{name:"rusty", species: "dog", colour:"red-brown", date_arriving:"13-5-23", date_leaving:"15-5-23"}]);
  };

seed()
  .then(() => {
    console.log('Seeding success');
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    sequelize.close();
  });