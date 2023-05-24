import { Link, useNavigate } from "react-router-dom"
import React, { useContext } from "react"
import "../styles/navbar.scss"
import { UserContext } from "../contexts/user"

export default function  Navbar(){
    const {user, setUser, setToken, setLoggedIn} = useContext(UserContext)
    const navigate = useNavigate()

    return (
        <nav>
            <p>WELCOME TO THE BOARDING KENNELS</p>
            <section>
                <Link className="item" to="/">Your Bookings</Link>
                <Link className="item" to="/new">New Booking</Link>
                {!user?(
                    <Link  className="item" to="/login" >Login</Link> 
                ):(
                    <>
                        <p className="item">welcome {user}</p>
                        <button onClick={()=> {
                            setToken(null)
                            setUser(null)
                            setLoggedIn(null)
                            navigate("/")
                        }}>Logout</button>
                    </>
                )
                }
            </section>
        </nav>
    )
}