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

interface StepsIntakePopupProps {
  setShowStepsIntakePop: React.Dispatch<React.SetStateAction<boolean>>;
}

const StepsIntakePop: React.FC<StepsIntakePopupProps> = ({
  setShowStepsIntakePop,
}) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [stepsIntake, setStepsIntake] = useState({
    item: "",
    date: new Date(),
    quantity: "",
    quantityType: "steps",
  });
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  interface StepsIntakeData {
    date: Date;
    steps: number;
  }
  
  const saveStepsIntake = async () => {
    if (stepsIntake.item && stepsIntake.quantity) {
      setIsLoading(true);
      
      // Transform the data to match backend expectations
      const stepData: StepsIntakeData = {
        date: stepsIntake.date,
        steps: parseFloat(stepsIntake.quantity) // Convert string to number
      };
  
      try {
        const response = await fetch('http://localhost:8080/step/add', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(stepData), // Send transformed data
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save step intake");
        }
  
        const savedItem = await response.json();
        setItems((prev) => [...prev, savedItem]);
        setStepsIntake({
          item: "",
          date: new Date(),
          quantity: "",
          quantityType: "steps",
        });
        toast.success("Steps intake saved successfully!");
      } catch (error) {
        console.error("Error saving steps intake:", error);
        toast.error(error instanceof Error ? error.message : "Failed to save step intake. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warn("Please fill out all fields before saving.");
    }
  };

  const getStepsIntake = async () => {
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
  
      const response = await fetch(`http://localhost:8080/step/date?date=${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setItems(data.stepsIntake || []); // Ensure to access the proper field
      } else {
        const errorResponse = await response.json(); // Read server error message
        toast.error(errorResponse.message || `Error fetching steps intake for ${formattedDate}`);
      }
    } catch (error) {
      console.error("Error fetching steps intake:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  
  

  const deleteStepIntake = async (stepIntakeId: string) => {
    const token = localStorage.getItem("accessToken"); // Retrieve access token
    if (!token) {
      toast.error("You are not authenticated!");
      return;
    }
  
    const response = await fetch(`http://localhost:8080/sleep/${stepIntakeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });
  
    if (response.ok) {
      toast.success("Steps intake deleted successfully!");
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Error deleting steps intake");
    }
  };
  
  
  useEffect(() => {
    getStepsIntake();
  }, [date]);

  const handleDateChange = (val: Date | null) => {
    setDate(val);
    setStepsIntake((prev) => ({ ...prev, date: val || new Date() }));
  };

  return (
    <div className="popup">
      <ToastContainer />
      <div className="popupbox">
        <button
          className="close"
          onClick={() => {
            setShowStepsIntakePop(false);
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
          label="Steps"
          variant="outlined"
          color="warning"
          value={stepsIntake.item}
          onChange={(e) =>
            setStepsIntake((prev) => ({ ...prev, item: e.target.value }))
          }
        />
        <TextField
          label="steps count"
          variant="outlined"
          color="warning"
          value={stepsIntake.quantity}
          onChange={(e) =>
            setStepsIntake((prev) => ({ ...prev, quantity: e.target.value }))
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
          onClick={saveStepsIntake}
          disabled={!stepsIntake.item || !stepsIntake.quantity || isLoading}
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
              <button onClick={() => deleteStepIntake(item.id)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default StepsIntakePop;
          