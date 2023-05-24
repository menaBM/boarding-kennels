import { useContext, useState } from "react"
import "../styles/new.scss"
import { UserContext } from "../contexts/user"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

export default function(){
    const navigate = useNavigate()
    const {loggedIn, token} = useContext(UserContext)
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState()

    function onSubmit(form){
        fetch(`http://localhost:3000/pet`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
                name: form.name,
                age: form.age,
                colour: form.colour,
                species: form.species,
                date_arriving:form.arriving,
                date_leaving: form.leaving
            })
        })
        .then(res => res.json())
        .then(data => { 
            console.log(data)
            window.alert(`${form.name}'s booking has been created!`)??( navigate("/"))})
        .catch(error => {
            console.log("error", error)
            setError("A pet has already been booked in under this name")
        })
    }

    return (
        <section className="create">
            {!loggedIn?(
                <section >
                    <p>Please log in to make a new booking</p>
                </section>
            ):(
                <section className="new-booking">
                    <h2>Create a New Booking</h2>
                    <form onSubmit={handleSubmit(onSubmit)}> 
                        <div className="form-item">
                            <label>Name:</label>
                            <input type="text" {...register("name", { required: true })} />
                        </div>
                        <div className="form-item">
                            <label>Species:</label>
                            <input type="text" {...register("species", { required: true })}/>
                        </div>
                        <div className="form-item">
                            <label>Colour:</label>
                            <input type="text" {...register("colour", { required: true })}/>
                        </div>
                        <div className="form-item">
                            <label>Age:</label>
                            <input type="Number" {...register("age", { required: true })}/>
                        </div>
                        <div className="form-item">
                            <label>Date Arriving:</label>
                            <input type="date" {...register("arriving", { required: true })}/>
                        </div>
                        <div className="form-item">
                            <label>Date Leaving:</label>
                            <input type="date" {...register("leaving", { required: true })}/>
                        </div>
                        <p>{error}</p>
                        <button type="submit">Submit</button>
                    </form>
                </section>
            )}
        </section>
    )
}