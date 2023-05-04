const {sequelize} = require('./db');
const {Pet, User} = require("./index")

const seed = async () => {
    await sequelize.sync({ force: true }); // recreate db
    let user = await User.create({name:"jim",password: "$2b$10$F0e.8k.8x6UHC3FysbwVQ.yaO3zTY05VNFYPtCk9BKAsgGaKPwuTm"})
    let pet = await Pet.bulkCreate([{name:"rusty", species: "dog", age:5 ,colour:"red-brown", date_arriving:"2023-05-13", date_leaving:"2023-05-15"}]);
    await user.setPets(pet)

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