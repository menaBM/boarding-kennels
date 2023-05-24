import { useContext } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../contexts/user"
import "../styles/edit.scss"

export default function Edit(){
    const {register,handleSubmit} = useForm()
    const {name} = useParams()
    const navigate = useNavigate()
    const {token} = useContext(UserContext)

    function onSubmit(form){
        fetch(`http://localhost:3000/pet`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
                name: name,
                date_arriving:form.date_arriving,
                date_leaving: form.date_leaving
            })
        })
        .then(res => res.json())
        .then(data => { window.alert(`${name}'s booking has been updated!`)??( navigate("/"))})
        .catch(error => {
            console.log("error", error)
        })
    }

    return(
        <section className="edit">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Edit {name}'s booking</h2>
                <div className="item">
                    <label>Date Arriving:</label>
                    <input type="date" {...register("date_arriving", {required:false})}/>
                </div>
                <div className="item">
                    <label>Date Leaving:</label>
                    <input type="date" {...register("date_leaving", {required:false})}/>
                </div>
                <button type="submit">submit</button>
            </form>
        </section>
    )
}