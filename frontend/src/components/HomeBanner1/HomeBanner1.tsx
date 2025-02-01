import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./HomeBanner1.css";
import { toast } from "react-toastify";

export const isTokenExpired = (token: any) => {
  try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return payload.exp < currentTime; // Token is expired if currentTime > exp
  } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Treat invalid or corrupt tokens as expired
  }
};


const HomeBanner1 = () => {
  const [data, setData] = useState([
    { name: "Calories", value: 0, unit: "kcal", goal: 25000, goalUnit: "kcal" },
    { name: "Sleep", value: 0, unit: "hrs", goal: 8, goalUnit: "hrs" },
    { name: "Steps", value: 0, unit: "steps", goal: 10000, goalUnit: "steps" },
    { name: "Water", value: 0, unit: "ml", goal: 3000, goalUnit: "ml" },
    { name: "Weight", value: 0, unit: "kg", goal: 700, goalUnit: "kg" },
    { name: "Workout", value: 0, unit: "days", goal: 6, goalUnit: "days" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log(token);

      if (!token) {
        // setError("Please log in.");
        navigate("/"); // Redirect to login if no token
        return;
      }

      // Check if the token is expired
      if (isTokenExpired(token)) {
        // setError("Session expired. Please log in again.");
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("accessToken"); // Clear token from localStorage
        navigate("/"); // Redirect to login page
        return;
      }

      setLoading(true);
      const response = await fetch("http://localhost:8080/report/getreport", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

     // Improved error handling
    if (!response.ok) {
      if (response.status === 401) {
        toast.error("Session expired. Please log in again");
        localStorage.removeItem("accessToken");
        navigate("/");
        return;
      }
      if (response.status === 404) {
        toast.error("Unable to fetch data. Please log in again");
        return;
      }
      // Handle other status codes
      toast.error("Something went wrong. Please try again later");
      return;
    }

      const result = await response.json();
      console.log(result);
      if (result.tempResponse && Array.isArray(result.tempResponse)) {
        const mappedData = result.tempResponse.map((item: any) => ({
          name: item.name.replace(" Intake", ""),
          value: Number(item.value) || 0,
          goal: Number(item.goal) || 0,
          unit: item.unit
        })).filter((item: any) => item.name !== "Height");
        
        setData(mappedData);
        setError(null);
      } else {
        console.log("Invalid data format:", result); // Debug log
        toast.error("Unable to load your data. Please try again later");
      }
     
    } catch (err: any) {
      toast.error("Unable to connect to the server. Please try again later");
    console.error("Fetch error:", err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="meters">
      {data.map((item: any, index: number) => (
        <div key={index} className="card">
          <div className="card-header">
            <div className="card-header-box">
              <div className="card-header-box-name">{item.name}</div>
              <div className="card-header-box-value">
                {parseInt(item.value)} {item.unit}
              </div>
            </div>
            <div className="card-header-box">
              <div className="card-header-box-name">Target</div>
              <div className="card-header-box-value">
                {parseInt(item.goal)} {item.goalUnit}
              </div>
            </div>
          </div>

          <CircularProgress
            color="neutral"
            determinate
            variant="solid"
            size="lg"
            value={(item.value / item.goal) * 100}
          >
            <div className="textincircle">
              <span>{parseInt(item.value)}</span>
              <span className="hrline"></span>
              <span>{parseInt(item.goal)}</span>
            </div>
          </CircularProgress>

          <button onClick={() => navigate(`/report/${item.name}`)}>
            Show Report <AiOutlineEye />
          </button>
        </div>
      ))}
      {loading && <div>Loading data...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default HomeBanner1;