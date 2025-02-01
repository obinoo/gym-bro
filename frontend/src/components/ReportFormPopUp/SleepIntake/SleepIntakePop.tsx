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

interface SleepIntakePopupProps {
  setShowSleepIntakePop: React.Dispatch<React.SetStateAction<boolean>>;
}

const SleepIntakePop: React.FC<SleepIntakePopupProps> = ({
  setShowSleepIntakePop,
}) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [sleepIntake, setSleepIntake] = useState({
    item: "",
    date: new Date(),
    quantity: "",
    quantityType: "hrs",
  });
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  
  interface SleepIntakeData {
    date: Date;
    durationInHrs: number;
  }
  
  const saveSleepIntake = async () => {
    if (sleepIntake.item && sleepIntake.quantity) {
      setIsLoading(true);
      
      // Transform the data to match backend expectations
      const sleepData: SleepIntakeData = {
        date: sleepIntake.date,
        durationInHrs: parseFloat(sleepIntake.quantity) // Convert string to number
      };
  
      try {
        const response = await fetch('http://localhost:8080/sleep/add', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(sleepData), // Send transformed data
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save sleep intake");
        }
  
        const savedItem = await response.json();
        setItems((prev) => [...prev, savedItem]);
        setSleepIntake({
          item: "",
          date: new Date(),
          quantity: "",
          quantityType: "hrs",
        });
        toast.success("Sleep intake saved successfully!");
      } catch (error) {
        console.error("Error saving sleep intake:", error);
        toast.error(error instanceof Error ? error.message : "Failed to save sleep intake. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warn("Please fill out all fields before saving.");
    }
  };

  const getSleepIntake = async () => {
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
  
      const response = await fetch(`http://localhost:8080/sleep/date?date=${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setItems(data.sleepIntake || []); // Ensure to access the proper field
      } else {
        const errorResponse = await response.json(); // Read server error message
        toast.error(errorResponse.message || `Error fetching sleep intake for ${formattedDate}`);
      }
    } catch (error) {
      console.error("Error fetching sleep intake:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  
  

  const deleteCalorieIntake = async (sleepIntakeId: string) => {
    const token = localStorage.getItem("accessToken"); // Retrieve access token
    if (!token) {
      toast.error("You are not authenticated!");
      return;
    }
  
    const response = await fetch(`http://localhost:8080/sleep/${sleepIntakeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });
  
    if (response.ok) {
      toast.success("Sleep intake deleted successfully!");
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Error deleting sleep intake");
    }
  };
  
  
  useEffect(() => {
    getSleepIntake();
  }, [date]);

  const handleDateChange = (val: Date | null) => {
    setDate(val);
    setSleepIntake((prev) => ({ ...prev, date: val || new Date() }));
  };

  return (
    <div className="popup">
      <ToastContainer />
      <div className="popupbox">
        <button
          className="close"
          onClick={() => {
            setShowSleepIntakePop(false);
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
          label="Sleep"
          variant="outlined"
          color="warning"
          value={sleepIntake.item}
          onChange={(e) =>
            setSleepIntake((prev) => ({ ...prev, item: e.target.value }))
          }
        />
        <TextField
          label="Sleep Quantity"
          variant="outlined"
          color="warning"
          value={sleepIntake.quantity}
          onChange={(e) =>
            setSleepIntake((prev) => ({ ...prev, quantity: e.target.value }))
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
          onClick={saveSleepIntake}
          disabled={!sleepIntake.item || !sleepIntake.quantity || isLoading}
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
              <button onClick={() => deleteCalorieIntake(item.id)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default SleepIntakePop;
          