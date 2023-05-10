const express = require("express")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express()
const {Pet, User} = require("./db");
const { Op } = require("sequelize");
require("dotenv").config(".env")

app.use(express.json())

const authorize = async(req,res,next)=>{
    try{
        let auth = req.header("Authorization")
        if (!auth) return res.sendStatus(403)
        const [,token] = auth.split(" ")
        if(!token) return res.sendStatus(403)
        const user = jwt.verify(token, process.env.JWT_SECRET)
        if (!user){
            return res.status(403).send("You must log in to access this API")
        }else{
            req.user = user
            req.user.isAdmin = (await User.findByPk(user.id)).isAdmin
            next()
        }
    }
    catch(error){
        res.status(500).send(error)
    }
}

app.post("/login", async(req,res)=>{
    try{
        const user = await User.findOne({where:{username:req.body.username}})
        if (!user) {
            res.sendStatus(401)
        }else{
            let {id, username, password} = user
            if (await bcrypt.compare(req.body.password, password)){
                let token = jwt.sign({id, username}, process.env.JWT_SECRET)
                res.send(token)
            }else{
                res.sendStatus(401)
            }
        }
    }catch(error){
        console.log(error)
        res.send(500)
    }
})

app.post("/register" ,async(req,res)=>{
    try{
        let hash = await bcrypt.hash(req.body.password, 10)
        let {id, username} = await User.create({username:req.body.username, password:hash, isAdmin:false})
        let token = jwt.sign({id, username}, process.env.JWT_SECRET)
        res.send(token)
    }catch(error){
        console.log(error)
        res.send(500)
    }
})

app.get("/pet",authorize, async(req,res)=>{
    try{
        let pets;
        pets = await Pet.findAll({
            where:{
                ownerId:{
                    [Op.substring]: req.user.isAdmin?"":req.user.id}}, 
            include :{
                model: User, 
                attributes:['id', 'username']
        }})
        res.status(200).send(pets)
    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

app.get("/pet/:name", authorize, async(req,res)=>{
    try{
        const pet = await Pet.findOne({where:{
            name: req.params.name,
            ownerId:{
                [Op.substring]: req.user.isAdmin?"":req.user.id
              }
        },
        include :{
            model: User, 
            attributes:['id', 'username']
        }})
        if (pet){
            res.status(200).send(pet)
        }else{
            res.status(404).send(`you have no booking for a pet with the name ${req.params.name}`)
        }
        
    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

app.get("/pet/date/:date", authorize, async(req,res)=>{
    try{
        const pets = await Pet.findAll({where:{
            date_arriving: {[Op.lt]: req.params.date},
            date_leaving :{[Op.gt]: req.params.date},
            ownerId:{
                [Op.substring]: req.user.isAdmin?"":req.user.id
              }
        },
        include :{
            model: User, 
            attributes:['id', 'username']
        }})
        if (pets.length >0 ){
            res.send(pets)
        }else{
            res.status(404).send("you have no bookings that cover the given date")
        }
        
    }
    catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

app.post("/pet",authorize,  async(req,res)=>{
    try{
        if ( (await Pet.findAll({where:{name:req.body.name}})).length === 0){
            const pet = await Pet.create(req.body)
            let owner = await User.findByPk(req.user.id)
            owner.addPets(pet)
            res.send(`${req.body.name} has been booked into the kennels`)
        }else{
            res.status(400).send("a pet has already been booked in under this name")
        }
    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

app.put("/pet",authorize, async(req,res)=>{
    try{
        const pet = await Pet.findOne({where:{name:req.body.name, ownerId:{
            [Op.substring]: req.user.isAdmin?"":req.user.id
          }}})
        if (pet){
            if (req.body.date_arriving) await pet.update({date_arriving:req.body.date_arriving})
            if (req.body.date_leaving) await pet.update({date_leaving:req.body.date_leaving})
            res.send(`${req.body.name}'s booking has been updated`)
        }else{
            res.send("no booking found")
        }
    }catch{
        res.sendStatus(500)
    }       
})

app.delete("/pet", authorize, async(req,res)=>{
    try{
        let pet = await Pet.destroy({where:{name:req.body.name,ownerId:{
            [Op.substring]: req.user.isAdmin?"":req.user.id
          }}})
        if (pet){
            res.send(`${req.body.name}'s booking has been cancelled`)
        }else{
            res.send("no booking found")
        }
    }catch{
        res.sendStatus(500)
    }
})

module.exports = {app}