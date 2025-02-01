import React, { useState } from "react";
import logo from "../../assets/images/nav-image.png"
import { IoIosBody } from 'react-icons/io'
import AuthPopUp from "../AuthPopUp/AuthPopUp";
import './NavBar.css'

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });
    const [showpop, setShowpop] = useState(false);

    const handleSignOut = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn'); // Clear login state
    };

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
                    {isLoggedIn ? (
                        <button onClick={handleSignOut}>Sign Out</button>
                    ) : (
                        <button onClick={() => setShowpop(true)}>Sign In</button>
                    )}
                    {showpop && <AuthPopUp setShowpop={setShowpop} setIsLoggedIn={setIsLoggedIn} />}
                </div>
            </nav>
        </>
    );
};
export default NavBar;