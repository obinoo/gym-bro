import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiFillDelete } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, TextField, CircularProgress } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import dayjs, { Dayjs } from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../popUp.css";

interface WaterIntakePopupProps {
  setShowWaterIntakePop: React.Dispatch<React.SetStateAction<boolean>>;
}

const WaterIntakePop: React.FC<WaterIntakePopupProps> = ({
  setShowWaterIntakePop,
}) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [waterIntake, setWaterIntake] = useState({
    item: "",
    date: new Date(),
    quantity: "",
    quantityType: "ltr",
  });
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  interface WaterIntakeData {
    date: Date;
    amountInMilliliters: number;
  }

  const saveWaterIntake = async () => {
    if (waterIntake.item && waterIntake.quantity) {
      setIsLoading(true);
      try {

        const waterData: WaterIntakeData = {
            date: waterIntake.date,
            amountInMilliliters: parseFloat(waterIntake.quantity) * 1000,
        }
        const response = await fetch('http://localhost:8080/water/add', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(waterData),
        });

        if (!response.ok) {
          throw new Error("Failed to save steps intake");
        }

        const savedItem = await response.json();
        setItems((prev) => [...prev, savedItem]);
        setWaterIntake({
          item: "",
          date: new Date(),
          quantity: "",
          quantityType: "ltr",
        });
        toast.success("Water intake saved successfully!");
      } catch (error) {
        console.error("Error saving water intake:", error);
        toast.error("Failed to save water intake. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warn("Please fill out all fields before saving.");
    }
  };

  const getWaterIntake = async () => {
    try {
      setItems([]);
      if (!date) {
        toast.error("Date is not selected.");
        return;
      }
  
      const formattedDate = date.toLocaleDateString("en-CA");
      const token = localStorage.getItem('accessToken'); // Retrieve the token from storage
  
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }
  
      const response = await fetch(`http://localhost:8080/water/date?date=${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setItems(data.waterIntake || []); // Ensure to access the proper field
      } else {
        const errorResponse = await response.json(); // Read server error message
        toast.error(errorResponse.message || `Error fetching steps intake for ${formattedDate}`);
      }
    } catch (error) {
      console.error("Error fetching steps intake:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  
  

  const deleteWaterIntake = async (waterIntakeId: string) => {
    const token = localStorage.getItem("accessToken"); // Retrieve access token
    if (!token) {
      toast.error("You are not authenticated!");
      return;
    }
  
    const response = await fetch(`http://localhost:8080/water/${waterIntakeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });
  
    if (response.ok) {
      toast.success("Water intake deleted successfully!");
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Error deleting steps intake");
    }
  };
  
  
  useEffect(() => {
    getWaterIntake();
  }, [date]);

  const handleDateChange = (val: Date | null) => {
    setDate(val);
    setWaterIntake((prev) => ({ ...prev, date: val || new Date() }));
  };

  return (
    <div className="popup">
      <ToastContainer />
      <div className="popupbox">
        <button
          className="close"
          onClick={() => {
            setShowWaterIntakePop(false);
          }}
        >
          <AiOutlineClose />
        </button>

        <DatePicker
          selected={date}
          onChange={handleDateChange}
          dateFormat="MMMM d, yyyy"
          maxDate={new Date()}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />

        <TextField
          label="water"
          variant="outlined"
          color="warning"
          value={waterIntake.item}
          onChange={(e) =>
            setWaterIntake((prev) => ({ ...prev, item: e.target.value }))
          }
        />
        <TextField
          label="water item amount (in ltr)"
          variant="outlined"
          color="warning"
          value={waterIntake.quantity}
          onChange={(e) =>
            setWaterIntake((prev) => ({ ...prev, quantity: e.target.value }))
          }
        />

        <div className="timebox">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeClock
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </LocalizationProvider>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={saveWaterIntake}
          disabled={!waterIntake.item || !waterIntake.quantity || isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save to Database"}
        </Button>

        <div className="hrline"></div>
        <div className="items">
          {items.map((item, index) => (
            <div className="item" key={index}>
              <h3>{item.item}</h3>
              <h3>
                {item.quantity} {item.quantityType}
              </h3>
              <button onClick={() => deleteWaterIntake(item.id)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default WaterIntakePop;
          