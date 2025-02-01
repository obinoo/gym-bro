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

interface CalorieIntakePopupProps {
  setShowCalorieIntakePop: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePop: React.FC<CalorieIntakePopupProps> = ({
  setShowCalorieIntakePop,
}) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [calorieIntake, setCalorieIntake] = useState({
    item: "",
    date: new Date(),
    quantity: "",
    quantityType: "g",
  });
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const saveCalorieIntake = async () => {
    if (calorieIntake.item && calorieIntake.quantity) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8080/calorie/add', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(calorieIntake),
        });

        if (!response.ok) {
          throw new Error("Failed to save calorie intake");
        }

        const savedItem = await response.json();
        setItems((prev) => [...prev, savedItem]);
        setCalorieIntake({
          item: "",
          date: new Date(),
          quantity: "",
          quantityType: "g",
        });
        toast.success("Calorie intake saved successfully!");
      } catch (error) {
        console.error("Error saving calorie intake:", error);
        toast.error("Failed to save calorie intake. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warn("Please fill out all fields before saving.");
    }
  };

  const getCalorieIntake = async () => {
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
  
      const response = await fetch(`http://localhost:8080/calorie/date?date=${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setItems(data.calorieIntake || []); // Ensure to access the proper field
      } else {
        const errorResponse = await response.json(); // Read server error message
        toast.error(errorResponse.message || `Error fetching calorie intake for ${formattedDate}`);
      }
    } catch (error) {
      console.error("Error fetching calorie intake:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  
  

  const deleteCalorieIntake = async (calorieIntakeId: string) => {
    const token = localStorage.getItem("accessToken"); // Retrieve access token
    if (!token) {
      toast.error("You are not authenticated!");
      return;
    }
  
    const response = await fetch(`http://localhost:8080/calorie/${calorieIntakeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });
  
    if (response.ok) {
      toast.success("Calorie intake deleted successfully!");
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Error deleting calorie intake");
    }
  };
  
  
  useEffect(() => {
    getCalorieIntake();
  }, [date]);

  const handleDateChange = (val: Date | null) => {
    setDate(val);
    setCalorieIntake((prev) => ({ ...prev, date: val || new Date() }));
  };

  return (
    <div className="popup">
      <ToastContainer />
      <div className="popupbox">
        <button
          className="close"
          onClick={() => {
            setShowCalorieIntakePop(false);
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
          label="Food item name"
          variant="outlined"
          color="warning"
          value={calorieIntake.item}
          onChange={(e) =>
            setCalorieIntake((prev) => ({ ...prev, item: e.target.value }))
          }
        />
        <TextField
          label="Food item amount (in gms)"
          variant="outlined"
          color="warning"
          value={calorieIntake.quantity}
          onChange={(e) =>
            setCalorieIntake((prev) => ({ ...prev, quantity: e.target.value }))
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
          onClick={saveCalorieIntake}
          disabled={!calorieIntake.item || !calorieIntake.quantity || isLoading}
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


export default CalorieIntakePop;
          