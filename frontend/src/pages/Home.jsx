import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/user"
import "../styles/home.scss"
import { useNavigate } from "react-router-dom"

export default function Home(){

    const {token, loggedIn} = useContext(UserContext)
    const [bookings , setBookings] = useState([])
    const [filterMode, setFilterMode] = useState(true)
    const [nameFilter, setNameFilter] = useState("")
    const [dateFilter, setDateFilter] = useState("")
    const [filteredBookings, setFilteredBookings] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        fetchPets()
    },[filterMode])

    function fetchPets(){
        fetch(`http://localhost:3000/pet`, {
            method: 'GET', 
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
        })
        .then(res => res.json())
        .then((data) => {
            setBookings(data)
            setFilteredBookings(data)})
        .catch(error => {
            console.log("error", error)
        })
    }

    function getDate(){
            fetch(`http://localhost:3000/pet/date/${dateFilter}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            })
            .then(res => res.json())
            .then((data) => {
                setFilteredBookings(data)})
            .catch(error => {
                console.log("error", error)
                setFilteredBookings([])
            })
    }

    function getName(){
            fetch(`http://localhost:3000/pet/${nameFilter}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            })
            .then(res => res.json())
            .then((data) => {
                setFilteredBookings(data)})
            .catch(error => {
                console.log("error", error)
                setFilteredBookings([])
            })
        }
       
    useEffect(()=>{
        if (!nameFilter && !dateFilter){
            fetchPets()
        }else{
            if (filterMode){
                getDate()
            }else{
                getName() 
            }
        }
    },[nameFilter, dateFilter])

    function deleteBooking(name){
        fetch(`http://localhost:3000/pet`, {
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
                body: JSON.stringify({name: name })
            })
            .then(res => res.json())
            .then(fetchPets())
            .catch(error => {
                console.log("error", error)
            })
    }

    return (
        <section className="home-page">
            {!loggedIn?(
                <section >
                    <p>Please log in to see your existing bookings</p>
                </section>
            ):(
                <section className="home">
                    <section className="bookings">
                        <div className="title">
                            <h2>Your Bookings</h2>
                            <div>
                            <button onClick={()=> setFilterMode(!filterMode)}>Filter by {filterMode?"Name":"Date"}</button>
                            {filterMode?(
                                <input className="filter-choice" type="date" onChange={(e)=> {
                                    // value={dateFilter}
                                    setDateFilter(e.target.value)}}/>
                            ):(
                                <select className="filter-choice" onChange={(e)=>{
                                    setNameFilter(e.target.value)}}>
                                    value={nameFilter}
                                    <option value="">Name</option>
                                    {bookings.map(booking => {
                                        return <option value={booking.name}>{booking.name}</option>
                                    })}                                    
                                </select>
                            )}
                            </div>
                        </div>
                        {filteredBookings.map(booking=>{
                            return (
                                <>
                                <div className="booking">
                            <p className="name">{booking.name}</p>
                            <div className="grid">
                                <div className="details-left">
                                    <p>Species: {booking.species}</p>
                                    <p>Colour: {booking.colour}</p>
                                    <p>Age: {booking.age}</p>
                                </div>
                                <div className="details">
                                    <p>Arriving: {booking.date_arriving.slice(0,10)}</p>
                                    <p>Leaving: {booking.date_leaving.slice(0,10)}</p>
                                </div>
                            </div>
                            <div className="buttons">
                                <button onClick={()=> window.confirm(`Are you sure you want to delete ${booking.name}'s booking?`)
                                    ? deleteBooking(booking.name) 
                                    : null }
                                    >Delete</button> 
                                <button onClick={() => navigate(`/edit/${booking.name}`)}>Edit</button>
                            </div>
                            </div>
                            <hr />
                            </>
                            )
                        })}
                     </section>
                </section>
            )
            }
        </section>
    )
}