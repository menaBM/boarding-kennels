const {sequelize} = require('./db');
const {Pet} = require("./Pet")

const seed = async () => {
    await sequelize.sync({ force: true }); // recreate db
    await Pet.bulkCreate([{name:"rusty", species: "dog", age:5 ,colour:"red-brown", date_arriving:"2023-05-13", date_leaving:"2023-05-15"}]);
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


//   {
//
//         "name":"fluffy",
//         "age": 2,
//         "species":"cat",
//         "colour":"white",
//         "date_arriving": "2023-06-02",
//         "date_leaving": "2023-06-04"
// }