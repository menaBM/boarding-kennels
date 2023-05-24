import logo from './logo.svg';
import './App.css';
import Home from "./pages/Home"
import Login from "./pages/Login"
import Edit from './pages/Edit';
import Layout from './layout/Layout';
import {UserProvider} from "./contexts/user"
import React from "react"
// import Navbar from './layout/Navbar';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import New from './pages/New';


function App() {
  return (
    <Router>
    <UserProvider>
    <div className='App'> 
        <Layout > 
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/edit/:name" element={<Edit/>}/>
          <Route exact path="/new" element={<New/>}/>
        </Routes>
        </Layout>
    </div>
    </UserProvider>
    </Router>
  );
}

export default App;
