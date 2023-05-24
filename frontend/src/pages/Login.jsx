import {useForm} from "react-hook-form"
import {useState, useContext, useEffect} from "react"
import "../styles/login.scss"
import { UserContext } from "../contexts/user"
import {useNavigate} from "react-router-dom"


export default function Login() {
    const {register,handleSubmit} = useForm()
    const [mode, setMode] = useState("login")
    const [error, setError] = useState()
    const { setToken, setLoggedIn, setUser} = useContext(UserContext)
    const navigate = useNavigate()

    function onSubmit(form){
        //can you have the same animal with multiple bokings?
        // admins can see username next to booking?
        //toggle admin view
        //homepage pagination
        //make token persist refreshes
      
        fetch(`http://localhost:3000/${mode}`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username:form.username,
                password:form.password
            })
        })
        .then(res => res.json())
        .then(data => {
            setToken(data.token)
            setLoggedIn(true)
            setUser(form.username)
            navigate("/")
        })
        .catch(error => {
            console.log("error", error)
            if (mode ==="login"){
                setError("Incorrect username or password")
            }else{
                setError("This username is already in use")
            }
        })
            
    }

    return (
        <section className="login-page">
        <section className="login">
            <h1>{mode}</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="item">
                    <label htmlFor="">username</label>
                    <input type="text" {...register("username", { required: true })}/>
                </div>
                <div className="item">
                        <label htmlFor="">password</label>
                        <input type="password" {...register("password", { required: true })}/>
                </div>
                <p>{error}</p>
                <button type="submit">{mode}</button>
            </form>
            <button className="switch-mode" onClick={()=>setMode(mode==="login"?"register":"login")}>Click to {mode==="login"?"Register":"Login"}</button>
        </section>
        </section>
    )
}