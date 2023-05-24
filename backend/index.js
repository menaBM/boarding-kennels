const {app} = require("./server.js")
const { sequelize } = require('./db/db');

app.listen(3000, () => {
  
    sequelize.sync({ force: false });
    console.log(`Pets are ready at http://localhost:3000`);
  });