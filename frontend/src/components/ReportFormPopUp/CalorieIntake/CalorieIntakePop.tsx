import React, { useState } from "react"
import { AiOutlineClose , AiFillDelete} from 'react-icons/ai'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { Button, TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import dayjs, { Dayjs } from "dayjs";
import "../popUp.css"


interface CalorieIntakePopupProps {
    setShowCalorieIntakePop: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const CalorieIntakePop: React.FC<CalorieIntakePopupProps> = ({ setShowCalorieIntakePop }) => {
    
    const [date, setDate]= useState<Date | null>(new Date())
    const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

    const handleDateChange = (val: Date | null) => {
      console.log(val);
      setDate(val);
    };

    const selectedDay = (val:any)=>{
      console.log(val)
    }
    return (
      <div className="popup">
        
       <div className="popupbox">
       <button className= "close"
             onClick={()=>{
              setShowCalorieIntakePop(false)
             }}>
          <AiOutlineClose/>
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

<TextField id="outlined-basic" label="Food item name" variant="outlined" color="warning" />
        <TextField id="outlined-basic" label="Food item amount (in gms)" variant="outlined" color="warning" />
        <div className='timebox'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimeClock value={value} onChange={(newValue) => setValue(newValue)} />
          </LocalizationProvider>

        </div>

<Button variant="contained" color="primary" onClick={() => console.log("Date Selected:", date)}>
          save
        </Button>

        <div className='hrline'></div>
        <div className='items'>
          <div className='item'>
            <h3>Apple</h3>
            <h3>100 gms</h3>
            <button> <AiFillDelete /></button>
          </div>
          <div className='item'>
            <h3>Banana</h3>
            <h3>200 gms</h3>
            <button> <AiFillDelete /></button>

          </div>
          <div className='item'>
            <h3>Rice</h3>
            <h3>300 gms</h3>
            <button> <AiFillDelete /></button>

          </div>
        </div>
       </div>
      </div>
    )
  };
export default CalorieIntakePop;