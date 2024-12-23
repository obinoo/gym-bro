import React, { useEffect, useState } from "react";
import CircularProgress from '@mui/joy/CircularProgress';
import { AiOutlineEye } from 'react-icons/ai'
import './HomeBanner1.css'
import { useNavigate } from "react-router-dom";

const HomeBanner1 = () => {

    const [data , setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        // let temp : any = [
        //     {
        //       "name": "Calories ",
        //       "value": 2000,
        //       "unit": "kcal",
        //       "goal": 2500,
        //       "goalUnit": "kcal"
        //     },
        //     {
        //       "name": "Sleep",
        //       "value": 8,
        //       "unit": "hrs",
        //       "goal": 8,
        //       "goalUnit": "hrs"
        //     },
        //     {
        //       "name": "Steps",
        //       "value": 50,
        //       "unit": "steps",
        //       "goal": 10000,
        //       "goalUnit": "steps"
        //     },
        //     {
        //       "name": "Water",
        //       "value": 2000,
        //       "unit": "ml",
        //       "goal": 3000,
        //       "goalUnit": "ml"
        //     },
        //     {
        //       "name": "Weight",
        //       "value": 75,
        //       "unit": "kg",
        //       "goal": 70,
        //       "goalUnit": "kg"
        //     },
        //     {
        //       "name": "Workout",
        //       "value": 2,
        //       "unit": "days",
        //       "goal": 6,
        //       "goalUnit": "days"

        //     }
        //   ]
          try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/report/getreport`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(result);
            setData(result || []);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } 
            
    }

    // function simplifyFraction(numerator: number, denominator: number): [number, number] {
    //     function gcd(a: number, b: number): number {
    //       while (b !== 0) {
    //         const temp = b;
    //         b = a % b;
    //         a = temp;
    //       }
    //       return a;
    //     }
      
    //     const commonDivisor = gcd(numerator, denominator);
      
    //     // Simplify the fraction
    //     return [numerator / commonDivisor, denominator / commonDivisor];
    //   }
      
    useEffect(()=>{
    fetchData();
    }, [])

    return (
        <>
        <div className="meters">
        {data.length > 0 ? (
         data.map((item : any, index: number)=> (
            <div key={index} className="card">
           
           <div className="card-header">
            <div className="card-header-box">
                <div className="card-header-box-name">{item.name}</div>
                <div className="card-header-box-value">{parseInt(item.value)} {item.unit}</div>
            </div>

            <div className='card-header-box'>
                  <div className='card-header-box-name'>Target</div>
                  <div className='card-header-box-value'>{parseInt(item.goal)} {item.goalUnit}</div>
                </div>
           </div>

           <CircularProgress
                color="neutral"
                determinate
                variant="solid"
                size="lg"
                value={
                  (item.value / item.goal) * 100
                }
            >
           <div className="textincircle">
           {/* {simplifyFraction(item.value, item.goal)[0] + ' / ' + simplifyFraction(item.value, item.goal)[1]} */}
           <span>{
            parseInt(item.value)
            }</span>
            <span className="hrline"></span>
            <span>{
              parseInt(item.goal)}</span>
           </div>
            </CircularProgress>

            <button
            onClick={()=>{
              navigate(`/report/${item.name}`)
             }}>Show Report <AiOutlineEye/></button>
            </div>
         ))
        ): (
            <div>Loading data...</div>
        )}
        </div>
        </>
    )
}

export default HomeBanner1;