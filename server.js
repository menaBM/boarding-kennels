const express = require("express")
const app = express()
const { sequelize } = require('./db/db');

app.use(express.json())




app.listen(3000, () => {
    sequelize.sync({ force: false });
    console.log(`Pets are ready at http://localhost:${PORT}`);
  });