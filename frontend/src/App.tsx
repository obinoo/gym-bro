import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import NavBar from './components/NavBar/NavBar';
import HomeBanner1 from './components/HomeBanner1/HomeBanner1';
import HomeBanner2 from './components/HomeBanner2/HomeBanner2';
import Exercises from './components/Workouts/Exercises';
import Page from './components/Report/Page';
import About from './components/About/About';
import Profile from './components/Profile/Profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <HomeBanner1 />
                <HomeBanner2 />
              </>
            }
          />
          <Route path="/exercises/:type" element={<Exercises />} /> {/* Exercises Page */}
          <Route path="/report/:name" element={<Page />} /> {/* Report Page */}
          <Route path="/about" element={<About />} /> {/* About Page */}
          <Route path="/profile" element={<Profile />} /> {/* Profile Page */}
        </Routes>

        {/* Add ToastContainer here */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" 
        />
      </div>
    </Router>
  );
}

export default App;
