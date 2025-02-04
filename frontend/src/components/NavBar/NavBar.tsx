import React, { useState , useEffect} from "react";
import logo from "../../assets/images/nav-image.png"
import { IoIosBody } from 'react-icons/io'
import AuthPopUp from "../AuthPopUp/AuthPopUp";
import './NavBar.css'

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });
    const [showpop, setShowpop] = useState(false);

    const isTokenExpired = (token: any) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            return payload.exp < currentTime; // Token is expired if currentTime > exp
        } catch (error) {
            console.error('Error decoding token:', error);
            return true; 
        }
      };

    const handleSignOut = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn'); // Clear login state
        localStorage.removeItem('accessToken');
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token || isTokenExpired(token)) {
            setIsLoggedIn(false); // Ensure it's set correctly
            localStorage.removeItem("isLoggedIn"); // Clear stale login state
        } else {
            setIsLoggedIn(true);
        }
    }, []); 

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