import React, { useState } from "react";
import logo from "../../assets/images/nav-image.png"
import { IoIosBody } from 'react-icons/io'
import AuthPopUp from "../AuthPopUp/AuthPopUp";
import './NavBar.css'

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [showpop, setShowpop] = useState(false)

    return (
        <>
            <nav>
                <div className="container">
                    <img src={logo} alt="logo" />
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/profile">
                        <IoIosBody />
                    </a>
                    {isLoggedIn ? 
                    <button>Sign Out</button>
                : 
                <button
                onClick={()=>{
                    setShowpop(true)
                }}
                >Sign In</button>}

                {
                    showpop && <AuthPopUp setShowpop = {setShowpop}/>
                }
                </div>
            </nav>
        </>
    );
};
export default NavBar;
