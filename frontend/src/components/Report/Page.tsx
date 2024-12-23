import React, { useEffect } from 'react'
import { LineChart } from '@mui/x-charts/LineChart';
import { AiFillEdit } from 'react-icons/ai'
import { useState } from 'react';
import "./Page.css"
import CalorieIntakePopup from "../ReportFormPopUp/CalorieIntake/CalorieIntakePop"


const Page = ()=>{

    const [dataS1, setDataS1] = React.useState<any>({
        data: [],
        title: '',
        color: '',
        xAxis: {
            data: [],
            label: '',
            scaleType: '',
        },
    });
    
    const [showCalorieIntakePop, setShowCalorieIntakePop] = React.useState<any>(false)
      const color = '#ffc20e'

    const getDataForS1 = async ()=>{
        let temp: any = [
            {
                date: 'Sat Nov 30 2024 03:37:30 GMT+0100 (Nigeria Standard Time)',
                value: 2000,
                unit: 'kcal'
            },
            {
                date: 'Sun Dec 01 2024 03:37:30 GMT+0100 (Nigeria Standard Time)',
                value: 2500,
                unit: 'kcal'
            },
            {
                date: 'Mon Dec 02 2024 03:37:30 GMT+0100 (Nigeria Standard Time)',
                value: 2700,
                unit: 'kcal'
            },
            {
                date: 'Tue Dec 03 2024 03:37:30 GMT+0100 (Nigeria Standard Time)',
                value: 3000,
                unit: 'kcal'
            },
            {
                date: 'Wed Dec 04 2024 03:37:30 GMT+0100 (Nigeria Standard Time)',
                value: 2000,
                unit: 'kcal'
            },
            {
                date: 'Thu Dec 05 2024 03:37:30 GMT+0100 (Nigeria Standard Time)',
                value: 2300,
                unit: 'kcal'
            },
            {
                date: 'Fri 06 2024 03:37:30 GMT+0100 (Nigeria Standard Time)',
                value: 2500,
                unit: 'kcal'
            },
            {
                date: 'Sat Dec 07 2024 20:30:30 GMT+0100 (Nigeria Standard Time)',
                value: 2700,
                unit: 'kcal'
            },

        ]


        let dataFormLineChart = temp.map((item: any) => item.value);

        let dataForXAxis = temp.map((item: any) => new Date(item.date));


        setDataS1({
            data: dataFormLineChart,
            title: "1 Day Calorie Intake",
            color: color,
            xAxis: {
                data: dataForXAxis,
                label: 'Last 10 Days',
                scaleType: 'time'
            }
        });
        console.log(temp)

    }


    useEffect(()=>{
     getDataForS1();
    }, [])
    
    return(
      <>
      <div className='report'>
        <div className='s1'>
        {
                    dataS1 &&
                    <LineChart
                        xAxis={[{
                            id: 'Day',
                            data: dataS1.xAxis.data,
                            scaleType: dataS1.xAxis.scaleType,
                            label: dataS1.xAxis.label,
                            valueFormatter: (date: any) => {
                                return date.getDate();
                            }
                        }]}
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
                }
    </div>

    <div className='s2'>
    {
                    dataS1 &&
                    <LineChart
                        xAxis={[{
                            id: 'Day',
                            data: dataS1.xAxis.data,
                            scaleType: dataS1.xAxis.scaleType,
                            label: dataS1.xAxis.label,
                            valueFormatter: (date: any) => {
                                return date.getDate();
                            }
                        }]}
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
                }
    </div>

    <div className='s3'>
    {
                    dataS1 &&
                    <LineChart
                        xAxis={[{
                            id: 'Day',
                            data: dataS1.xAxis.data,
                            scaleType: dataS1.xAxis.scaleType,
                            label: dataS1.xAxis.label,
                            valueFormatter: (date: any) => {
                                return date.getDate();
                            }
                        }]}
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
                }
    </div>

    <div className='s4'>
    {
                    dataS1 &&
                    <LineChart
                        xAxis={[{
                            id: 'Day',
                            data: dataS1.xAxis.data,
                            scaleType: dataS1.xAxis.scaleType,
                            label: dataS1.xAxis.label,
                            valueFormatter: (date: any) => {
                                return date.getDate();
                            }
                        }]}
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
                }
    </div>

    <button className='editButton'
    onClick={()=>{
     setShowCalorieIntakePop(true);
    }}>
        <AiFillEdit/>
    </button>

    {
        showCalorieIntakePop &&
         <CalorieIntakePopup setShowCalorieIntakePop = {setShowCalorieIntakePop}/> 
         
    }
      </div>
      </>
    )
}
export default Page;