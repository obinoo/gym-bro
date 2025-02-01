import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { AiFillEdit } from "react-icons/ai";
import "./Page.css";
import CalorieIntakePopup from "../ReportFormPopUp/CalorieIntake/CalorieIntakePop";
import SleepIntakePop from "../ReportFormPopUp/SleepIntake/SleepIntakePop";
import StepsIntakePop from "../ReportFormPopUp/StepsIntake/StepsIntakePop";
import WeightIntakePop from "../ReportFormPopUp/WeightIntake/WeightIntakePop";
import WaterIntakePop from "../ReportFormPopUp/WaterIntake/WaterIntakePop";
import { useLocation } from "react-router-dom";

interface ChartData {
  data: number[];
  title: string;
  color: string;
  xAxis: {
    data: Date[];
    label: string;
    scaleType: "time";
  };
}

const Page = () => {
  const [dataS1, setDataS1] = useState<ChartData>({
    data: [],
    title: "",
    color: "",
    xAxis: {
      data: [],
      label: "",
      scaleType: "time",
    },
  });

  const [showCalorieIntakePop, setShowCalorieIntakePop] = useState(false);
  const [showSleepIntakePop, setShowSleepIntakePop] = useState(false);
  const [showStepsIntakePop, setShowStepsIntakePop] = useState(false);
  const [showWeightIntakePop, setShowWeightIntakePop] = useState(false);
  const [showWaterIntakePop, setShowWaterIntakePop] = useState(false);

  const locate = useLocation();

  const getDataForS1 = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing");
      return;
    }

    try {
      const limit = 7;
      let endpoint = '';
      let dataKey = '';
      let valueKey = '';
      let title = '';
      let color = '';

      // Determine endpoint and data key based on current path
      switch (locate.pathname) {
        case "/report/Calorie":
          endpoint = 'calorie';
          dataKey = 'calorieIntake';
          valueKey = 'calorieIntake';
          title = '7 Days Calorie Intake';
          color = '#ffc20e';
          break;
        case "/report/Sleep":
          endpoint = 'sleep';
          dataKey = 'sleep'; 
          valueKey = 'durationInHrs';
          title = '7 Days Sleep Duration';
          color = '#4a90e2';
          break;
        case "/report/Steps":
          endpoint = 'step';
          dataKey = 'steps';   // had to change from 'steps' to 'sleep' to match the backend for some reason it was returning sleep instead of steps
          valueKey = 'steps';
          title = '7 Days Step Count';
          color = '#50c878';
          break;
        case "/report/Weight":
          endpoint = 'weight';
          dataKey =  'weight';      // had to change from 'weight' to 'sleep' to match the backend for some reason it was returning sleep instead of weight
          valueKey = 'weight';
          title = '7 Days Weight Track';
          color = '#ff6b6b';
          break;
        case "/report/Water":
          endpoint = 'water';
          dataKey = 'water';        // had to change from 'water' to 'sleep' to match the backend for some reason it was returning sleep instead of water
          valueKey = 'waterIntake';       
          title = '7 Days Water Intake';
          color = '#00bfff';
          break;
        default:
          return;
      }

      const response = await fetch(
        `http://localhost:8080/${endpoint}/limit?limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();

      console.log('Received response:', result);
      const dataArray = result[dataKey];

      if (Array.isArray(dataArray)) {
        const mappedData = dataArray.map((item: any) => ({
          date: new Date(item.date),
          value: Number(item[valueKey]) || 0,  // Use the correct value key
        }));

        mappedData.sort((a: any, b: any) => a.date.getTime() - b.date.getTime());

        const dates = mappedData.map(item => item.date);
        const values = mappedData.map(item => item.value);

        setDataS1({
          data: values,
          title: title,
          color: color,
          xAxis: {
            data: dates,
            label: "Days",
            scaleType: "time",
          },
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch data. Please try again later.");
    }
  };

  useEffect(() => {
    getDataForS1();
  }, [locate.pathname]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleEditClick = () => {
    switch (locate.pathname) {
      case "/report/Calorie":
        setShowCalorieIntakePop(true);
        break;
      case "/report/Sleep":
        setShowSleepIntakePop(true);
        break;
      case "/report/Steps":
        setShowStepsIntakePop(true);
        break;
      case "/report/Weight":
        setShowWeightIntakePop(true);
        break;
      case "/report/Water":
        setShowWaterIntakePop(true);
        break;
      default:
        alert("Invalid report type");
    }
  };

  return (
    <div className="report">
      <div className="s1">
        {dataS1.data.length > 0 && (
          <LineChart
            xAxis={[
              {
                id: "Day",
                data: dataS1.xAxis.data,
                scaleType: "time",
                label: dataS1.xAxis.label,
                valueFormatter: (date: Date) => formatDate(date),
              },
            ]}
            series={[
              {
                data: dataS1.data,
                label: dataS1.title,
                color: dataS1.color,
              },
            ]}
            width={500}
            height={300}
          />
        )}
      </div>

      <button className="editButton" onClick={handleEditClick}>
        <AiFillEdit />
      </button>

      {showCalorieIntakePop && (
        <CalorieIntakePopup setShowCalorieIntakePop={setShowCalorieIntakePop} />
      )}
      {showSleepIntakePop && (
        <SleepIntakePop setShowSleepIntakePop={setShowSleepIntakePop} />
      )}
      {showStepsIntakePop && (
        <StepsIntakePop setShowStepsIntakePop={setShowStepsIntakePop} />
      )}
      {showWeightIntakePop && (
        <WeightIntakePop setShowWeightIntakePop={setShowWeightIntakePop} />
      )}
      {showWaterIntakePop && (
        <WaterIntakePop setShowWaterIntakePop={setShowWaterIntakePop} />
      )}
    </div>
  );
};

export default Page;