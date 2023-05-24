const request = require("supertest")
const {app} = require("./server")
const {Pet, User} = require("./db");
const {seed} = require("./db/seed")

describe("Routes", ()=>{
    let auth;

    beforeAll(async()=>{
        await seed()
        auth = await request(app).post("/login").send({username:"test user", password:"testPassword"})
    })

    it("fetches all of the pets associated with the user", async ()=>{
        const response = await request(app).get("/pet").set({Authorization: `Bearer ${auth.body.token}`})
        expect(response.body[0].name).toBe("rusty")
        expect(response.body[1].name).toBe("fluffy")
        expect(response.body.length).toBe(3)
    })

    it("fetches the pet associated with the user with the given name", async ()=>{
        const response = await request(app).get("/pet/fluffy").set({Authorization: `Bearer ${auth.body.token}`})
        expect(response.body.length).toBe(1)
        expect(response.body[0].name).toBe("fluffy")
    })

    it("fetches the pets associated with the user that whose bookings include the given day", async()=>{
        const response = await request(app).get("/pet/date/2023-07-25").set({Authorization: `Bearer ${auth.body.token}`})
        expect(response.body.length).toBe(2)
        expect(response.body[0].name).toBe("fluffy")
        expect(response.body[1].name).toBe("patch")
    })

    it("fetches the associated user data of the pet owner", async()=>{
        const response1 = await request(app).get("/pet").set({Authorization: `Bearer ${auth.body.token}`})
        const response2 = await request(app).get("/pet/fluffy").set({Authorization: `Bearer ${auth.body.token}`})
        const response3 = await request(app).get("/pet/date/2023-07-25").set({Authorization: `Bearer ${auth.body.token}`})

        expect(response1.body[0]).toEqual(expect.objectContaining({user:{username:"test user", id:2}}))
        expect(response2.body[0]).toEqual(expect.objectContaining({user:{username:"test user", id:2}}))
        expect(response3.body[0]).toEqual(expect.objectContaining({user:{username:"test user", id:2}}))
    })

    it("doesn't fetch the pets that don't belong to the user", async()=>{
        const response1 = await request(app).get("/pet").set({Authorization: `Bearer ${auth.body.token}`})
        const response2 = await request(app).get("/pet/buster").set({Authorization: `Bearer ${auth.body.token}`})
        const response3 = await request(app).get("/pet/date/2023-04-25").set({Authorization: `Bearer ${auth.body.token}`})

        expect(response1.body).toContainEqual(expect.objectContaining({name:"rusty"}))
        expect(response1.body).not.toContainEqual(expect.objectContaining({name:"buster"}))

        expect(response2.body).toEqual({})
        expect(response2.text).toBe("you have no booking for a pet with the name buster")

        expect(response3.body).toEqual({})
        expect(response3.text).toBe("you have no bookings that cover the given date")
    })

    it("allows the user to create a booking for a pet that is then assigned to them", async()=>{
        const response = (await request(app).post("/pet").send({name:"bubbles", age:3, species:"fish", colour:"gold", date_arriving:"2023-05-06", date_leaving:"2023-05-08"}).set({Authorization: `Bearer ${auth.body.token}`}))
        let pet = await Pet.findOne({where:{name:"bubbles"}})

        expect(response.body.message).toBe("bubbles has been booked into the kennels")
        expect(pet.dataValues).toEqual(expect.objectContaining({ownerId:2}))
    })

    it("does not allow a pet to be booked under a name that is already in the database", async()=>{
        const response = (await request(app).post("/pet").send({name:"bubbles", age:3, species:"fish", colour:"gold", date_arriving:"2023-05-06", date_leaving:"2023-05-08"}).set({Authorization: `Bearer ${auth.body.token}`}))

        expect(response.text).toBe("a pet has already been booked in under this name")
    })

    it("allows the user to update their booking", async()=>{
        const response = (await request(app).put("/pet").send({name:"bubbles", date_arriving:"2023-06-06", date_leaving:"2023-06-08"}).set({Authorization: `Bearer ${auth.body.token}`}))

        let pet = await Pet.findOne({where:{name:"bubbles"}})
        expect(pet.date_arriving).toEqual(new Date("2023-06-06"))
    })

    it("does not allow the user to update another users booking", async()=>{
        const response = (await request(app).put("/pet").send({name:"buster", date_arriving:"2023-06-06", date_leaving:"2023-06-08"}).set({Authorization: `Bearer ${auth.body.token}`}))

        expect(response.text).toBe("no booking found")
    })

    it("gives the correct error message if the user attempts to update a booking that doesn't exist", async()=>{
        const response = (await request(app).put("/pet").send({name:"dave", date_arriving:"2023-06-06", date_leaving:"2023-06-08"}).set({Authorization: `Bearer ${auth.body.token}`}))

        expect(response.text).toBe("no booking found")
    })

    it("allows the user to delete one of their bookings", async()=>{
        const response = (await request(app).delete("/pet").send({name:"bubbles"}).set({Authorization: `Bearer ${auth.body.token}`}))

        expect(response.text).toBe("bubbles's booking has been cancelled")
        expect(await Pet.findOne({where:{name:"bubbles"}})).toBe(null)
    })

    it("does not allow a user to delete another users booking", async()=>{
        const response = (await request(app).delete("/pet").send({name:"buster"}).set({Authorization: `Bearer ${auth.body.token}`}))

        expect(response.text).toBe("no booking found")
    })

    it("gives the correct error message if the user attempts to delete a booking that doesn't exist", async()=>{
        const response = (await request(app).delete("/pet").send({name:"dave"}).set({Authorization: `Bearer ${auth.body.token}`}))

        expect(response.text).toBe("no booking found")
    })
})

describe("Accounts", ()=>{
    it("allows a user to register", async()=>{
        const response = await request(app).post("/register").send({username:"name", password:"password"})

        expect(response.text).not.toBe(null)
        expect(await User.findOne({where:{username:"name"}})).not.toBe(null)
    })

    it("allows a user to login", async()=>{
        const auth = await request(app).post("/login").send({username:"test user", password:"testPassword"})
        const response = await request(app).get("/pet").set({Authorization: `Bearer ${auth.body.token}`})
        
        expect(auth.body.token).not.toBe(null)
        expect(response.body.length).toBeGreaterThan(0)
    })

    it("does not allow a user to access the API without logging in", async()=>{
        const response1 = await request(app).get("/pet").set({Authorization: `Bearer `})
        const response2 = await request(app).get("/pet").set({Authorization: `Bearer test`})
        const response3 = await request(app).get("/pet")

        expect(response1.status).toBe(403)
        expect(response2.status).toBe(500)
        expect(response3.status).toBe(403)
    })

    it("gives the correct error message when the user provides the wrong username", async()=>{
        const auth = await request(app).post("/login").send({username:"test", password:"testPassword"})
        expect(auth.text).toBe("Unauthorized")
    })

    it("gives the correct error message when the user gives the wrong password", async()=>{
        const auth = await request(app).post("/login").send({username:"test user", password:"testpassword"})
        expect(auth.text).toBe("Unauthorized")
    })
})

describe("Admin", ()=>{
    let auth;
    beforeAll(async()=>{
        auth = await request(app).post("/login").send({username:"jim", password:"password1"})
    })

    it("allows an account to be set as admin", async()=>{
        const user = await User.findByPk(1)
        expect(user.isAdmin).toBe(true)
    })

    it("allows an admin to fetch all entries regardless of owner", async()=>{
        const response = await request(app).get("/pet").set({Authorization: `Bearer ${auth.body.token}`})
        expect(response.body[0].user.id).toBe(1)
        expect(response.body[1].user.id).toBe(2)
        expect(response.body.length).toBe(4)
    })

    it("allows an admin to get any pet entry by name", async()=>{
        const response = await request(app).get("/pet/fluffy").set({Authorization: `Bearer ${auth.body.token}`})
        expect(response.body[0].name).toBe("fluffy")
    })

    it("allows an admin to get all entires that cover the given date", async()=>{
        const response = await request(app).get("/pet/date/2023-07-25").set({Authorization: `Bearer ${auth.body.token}`})
        expect(response.body.length).toBe(2)
        expect(response.body[0].name).toBe("fluffy")
        expect(response.body[1].name).toBe("patch")
    })

    it("allows an admin to update any booking", async()=>{
        const response = (await request(app).put("/pet").send({name:"rusty", date_arriving:"2023-06-06", date_leaving:"2023-06-08"}).set({Authorization: `Bearer ${auth.body.token}`}))

        let pet = await Pet.findOne({where:{name:"rusty"}})
        expect(pet.date_arriving).toEqual(new Date("2023-06-06"))
    })

    it("allows an admin to delete any booking", async()=>{
        const response = (await request(app).delete("/pet").send({name:"patch"}).set({Authorization: `Bearer ${auth.body.token}`}))

        expect(response.text).toBe("patch's booking has been cancelled")
        expect(await Pet.findOne({where:{name:"patch"}})).toBe(null)
    })
})