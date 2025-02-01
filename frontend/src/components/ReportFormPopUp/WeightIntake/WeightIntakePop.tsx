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

interface WeightIntakePopupProps {
  setShowWeightIntakePop: React.Dispatch<React.SetStateAction<boolean>>;
}

const StepsIntakePop: React.FC<WeightIntakePopupProps> = ({
  setShowWeightIntakePop,
}) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [weightIntake, setWeightIntake] = useState({
    item: "",
    date: new Date(),
    quantity: "",
    quantityType: "g",
  });
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  interface WeightIntakeData {
    date: Date;
    weight: number;
  }

  const saveWeightIntake = async () => {
    if (weightIntake.item && weightIntake.quantity) {
      setIsLoading(true);

      const weightData: WeightIntakeData = {
        date: weightIntake.date,
        weight: parseFloat(weightIntake.quantity)
      };

      try {
        const response = await fetch('http://localhost:8080/weight/add', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(weightData),
        });

        if (!response.ok) {
          throw new Error("Failed to save weight intake");
        }

        const savedItem = await response.json();
        setItems((prev) => [...prev, savedItem]);
        setWeightIntake({
          item: "",
          date: new Date(),
          quantity: "",
          quantityType: "g",
        });
        toast.success("Weight intake saved successfully!");
      } catch (error) {
        console.error("Error saving weight intake:", error);
        toast.error("Failed to save weight intake. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warn("Please fill out all fields before saving.");
    }
  };

  const getWeightIntake = async () => {
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
  
      const response = await fetch(`http://localhost:8080/weight/date?date=${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setItems(data.weightIntake || []); // Ensure to access the proper field
      } else {
        const errorResponse = await response.json(); // Read server error message
        toast.error(errorResponse.message || `Error fetching weight intake for ${formattedDate}`);
      }
    } catch (error) {
      console.error("Error fetching weight intake:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  
  

  const deleteWeightIntake = async (weightIntakeId: string) => {
    const token = localStorage.getItem("accessToken"); // Retrieve access token
    if (!token) {
      toast.error("You are not authenticated!");
      return;
    }
  
    const response = await fetch(`http://localhost:8080/weight/${weightIntakeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });
  
    if (response.ok) {
      toast.success("Weight intake deleted successfully!");
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Error deleting weight intake");
    }
  };
  
  
  useEffect(() => {
    getWeightIntake();
  }, [date]);

  const handleDateChange = (val: Date | null) => {
    setDate(val);
    setWeightIntake((prev) => ({ ...prev, date: val || new Date() }));
  };

  return (
    <div className="popup">
      <ToastContainer />
      <div className="popupbox">
        <button
          className="close"
          onClick={() => {
            setShowWeightIntakePop(false);
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
          label="Weight"
          variant="outlined"
          color="warning"
          value={weightIntake.item}
          onChange={(e) =>
            setWeightIntake((prev) => ({ ...prev, item: e.target.value }))
          }
        />
        <TextField
          label="Weight"
          variant="outlined"
          color="warning"
          value={weightIntake.quantity}
          onChange={(e) =>
            setWeightIntake((prev) => ({ ...prev, quantity: e.target.value }))
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
          onClick={saveWeightIntake}
          disabled={!weightIntake.item || !weightIntake.quantity || isLoading}
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
              <button onClick={() => deleteWeightIntake(item.id)}>
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
          