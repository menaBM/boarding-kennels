const {sequelize} = require('./db');
const {Pet, User} = require("./index")
const bcrypt = require("bcrypt")

const seed = async () => {
    await sequelize.sync({ force: true }); // recreate db
    const passwords = [await bcrypt.hash("password1", 10), await bcrypt.hash("testPassword", 10)]
    
    let user = await User.bulkCreate([{username:"jim",password: passwords[0]}, {username:"test user", password: passwords[1]}])
    let pets1 = await Pet.create({name:"buster", species:"dog", age:9, colour:"black", date_arriving:"2023-04-2", date_leaving:"2023-05-01"})
    let pets2 = await Pet.bulkCreate([{name:"rusty", species: "dog", age:5 ,colour:"red-brown", date_arriving:"2023-05-13", date_leaving:"2023-05-15"}, {name:"fluffy", species:"cat", age:2, colour:"white", date_arriving:"2023-07-10", date_leaving:"2023-08-01"}, {name:"patch", species:"guinea pig", age:1, colour:"tricolour", date_arriving:"2023-07-20", date_leaving:"2023-07-30" }]);
    
    await user[0].setPets(pets1)
    await user[1].setPets(pets2)

  };

  // seed()
  // .then(() => {
  //   console.log('Seeding success');
  // })
  // .catch(err => {
  //   console.error(err);
  // })
  // .finally(() => {
  //   sequelize.close();
  // });

module.exports = {seed}
//   {
//
//         "name":"fluffy",
//         "age": 2,
//         "species":"cat",
//         "colour":"white",
//         "date_arriving": "2023-06-02",
//         "date_leaving": "2023-06-04"
// }