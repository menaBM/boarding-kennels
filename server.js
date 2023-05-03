const express = require("express")
const app = express()
const { sequelize } = require('./db/db');
const {Pet} = require("./db");
const { Op } = require("sequelize");

app.use(express.json())

app.get("/pet", async(req,res)=>{
    try{
        const pets = await Pet.findAll()
        res.status(200).send(pets)
    }catch{
        res.sendStatus(500)
    }
})

app.get("/pet/:name", async(req,res)=>{
    try{
        const pets = await Pet.findOne({where:{
            name:{
                [Op.substring]:req.params.name??""
            }
        }})
        res.status(200).send(pets)
    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

app.get("/pet/date/:date", async(req,res)=>{
    try{
        const pets = await Pet.findAll({where:{
            date_arriving: {[Op.lt]: req.params.date},
            date_leaving :{[Op.gt]: req.params.date}
        }})
        res.send(pets)
    }
    catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

app.post("/pet", async(req,res)=>{
    try{
        if (! await Pet.findAll({where:{name:req.body.name}})){
            await Pet.create(req.body)
            res.send(`${req.body.name} has been booked into the kennels`)
        }else{
            res.status(400).send("a pet has already been booked in under this name")
        }
    }catch{
        res.sendStatus(500)
    }
})

app.put("/pet", async(req,res)=>{
    try{
        const pet = await Pet.findOne({where:{name:req.body.name}})
        if (req.body.date_arriving) await pet.update({date_arriving:req.body.date_arriving})
        if (req.body.date_leaving) await pet.update({date_leaving:req.body.date_leaving})
        res.send(`${req.body.name}'s booking has been updated`)
    }catch{
        res.sendStatus(500)
    }       
})

app.delete("/pet", async(req,res)=>{
    try{
        await Pet.destroy({where:{name:req.body.name}})
        res.send(`${req.body.name}'s booking has been cancelled`)
    }catch{
        res.sendStatus(500)
    }
})


app.listen(3000, () => {
    sequelize.sync({ force: false });
    console.log(`Pets are ready at http://localhost:3000`);
  });