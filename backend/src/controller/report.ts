import dotenv from "dotenv"
dotenv.config();
import express,{Request, Response} from "express";
import User from "../model/user";

export const getReport = async(req:Request, res:Response) : Promise<void>=>{

    const email = req.user;
    console.log(email);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const today = new Date();

    let calorieIntake = 0;

    const userCalorie = user?.calorieIntake.forEach((entry)=>{
        if(entry.date.getDate() === today.getDate() && entry.date.getMonth() === today.getMonth()
             && entry.date.getFullYear() === today.getFullYear()) {
            calorieIntake += entry.calorieIntake;
        }
    })

    // get today's sleep
    let sleep = 0;

    const userSleep = user?.sleep.forEach((entry) => {
        if (entry.date.getDate() === today.getDate() && entry.date.getMonth() === today.getMonth() 
            && entry.date.getFullYear() === today.getFullYear()) {
            sleep += entry.durationInHrs;
        }
    });

     // get today's water
     let water = 0;
     const userWater = user?.water.forEach((entry) => {
         if (entry.date.getDate() === today.getDate() && entry.date.getMonth() === today.getMonth() 
            && entry.date.getFullYear() === today.getFullYear()) {
             water += entry.amountInMilliliters;
         }
     });

       // get today's steps
    let steps = 0;
    const userStep = user?.steps.forEach((entry) => {
        if (entry.date.getDate() === today.getDate() && entry.date.getMonth() === today.getMonth() 
            && entry.date.getFullYear() === today.getFullYear()) {
            steps += entry.steps;
        }
    });


     // get today's weight
     let weight = user?.weight?.length
    ? user.weight[user.weight.length - 1].weight
    : 0; 

     // get today's height
     let height = user?.height?.length
    ? user.height[user.height.length - 1].height
    : 0;;
    

       // get this week's workout
    let workout = 0;
    const userWorkout = user?.workouts.forEach((entry) => {
        if (entry.date.getDate() >= today.getDate() - 7 && entry.date.getMonth() === today.getMonth()
             && entry.date.getFullYear() === today.getFullYear()) {
            workout += 1;
        }
    });


    // get goal calorieIntake

    let maxCalorieIntake = 0;

let heightInCm = parseFloat(String(user?.height?.[user.height.length - 1]?.height ?? '0'));
let weightInKg = parseFloat(String(user?.weight?.[user.weight.length - 1]?.weight ?? '0'));
let age = user?.dob 
    ? new Date().getFullYear() - new Date(user.dob).getFullYear()
    : 0;
let BMR = 0;
let gender = user?.gender;

if (gender === 'male') {
    BMR = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age);
} else if (gender === 'female') {
    BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age);
} else {
    BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age);
}

if (user?.goal === 'weightLoss') {
    maxCalorieIntake = BMR - 500;
} else if (user?.goal === 'weightGain') {
    maxCalorieIntake = BMR + 500;
} else {
    maxCalorieIntake = BMR;
}


if (!user){
     res.status(500).json({message: `Internal server error`})
     return;
}

// get goal weight
let goalWeight = 22 * ((user?.height[user.height.length - 1].height / 100) ** 2);

// get goal workout
let goalWorkout = 0;
if (user.goal == "weightLoss") {

    goalWorkout = 7;
}
else if (user.goal == "weightGain") {

    goalWorkout = 4;
}
else {

    goalWorkout = 5;
}


// get goal steps
let goalSteps = 0;
if (user.goal == "weightLoss") {
    goalSteps = 10000;
}
else if (user.goal == "weightGain") {
    goalSteps = 5000;
}
else {
    goalSteps = 7500;
}

// get goal sleep
let goalSleep = 6;

// get goal water
let goalWater = 4000;



let tempResponse = [
    {
        name : "Calorie Intake",
        value : calorieIntake,
        goal : maxCalorieIntake,
        unit : "cal",
    },
    {
        name : "Sleep",
        value : sleep,
        goal : goalSleep,
        unit : "hrs",
    },
    {
        name: "Steps",
        value : steps,
        goal : goalSteps,
        unit : "steps",
    },
    {
        name : "Water",
        value : water,
        goal : goalWater,
        unit : "ml",
    },
    {
        name : "Workout",
        value : workout,
        goal : goalWorkout,
        unit : "days",
    },
    {
        name : "Weight",
        value : weight,
        goal : goalWeight,
        unit : "kg",
    },
    {
        name : "Height",
        value : height,
        goal : "",
        unit : "cm",
    },
]

res.status(200).json({message:`succesful`, tempResponse})
}



// export const getReport = async (req: Request, res: Response): Promise<void> => {
//     const email = req.user;

//     const user = await User.findOne({ email });
//     if (!user) {
//         res.status(404).json({ message: "User not found" });
//         return;
//     }

//     const today = new Date();

//     const calorieIntake = user.calorieIntake.reduce((total, entry) => {
//         const entryDate = new Date(entry.date);
//         return (entryDate.toDateString() === today.toDateString())
//             ? total + entry.calorieIntake
//             : total;
//     }, 0);

//     const sleep = user.sleep.reduce((total, entry) => {
//         const entryDate = new Date(entry.date);
//         return (entryDate.toDateString() === today.toDateString())
//             ? total + entry.durationInHrs
//             : total;
//     }, 0);

//     const water = user.water.reduce((total, entry) => {
//         const entryDate = new Date(entry.date);
//         return (entryDate.toDateString() === today.toDateString())
//             ? total + entry.amountInMilliliters
//             : total;
//     }, 0);

//     const steps = user.steps.reduce((total, entry) => {
//         const entryDate = new Date(entry.date);
//         return (entryDate.toDateString() === today.toDateString())
//             ? total + entry.steps
//             : total;
//     }, 0);

//     const height = user.height.length
//         ? user.height[user.height.length - 1].height
//         : 0;
//     const weight = user.weight.length
//         ? user.weight[user.weight.length - 1].weight
//         : 0;

//     const BMR = calculateBMR(user.gender, weight, height, user.dob);
//     const maxCalorieIntake = user.goal === 'weightLoss'
//         ? BMR - 500
//         : user.goal === 'weightGain'
//         ? BMR + 500
//         : BMR;

//     const tempResponse = [
//         { name: "Calorie Intake", value: calorieIntake, goal: maxCalorieIntake, unit: "cal" },
//         { name: "Sleep", value: sleep, goal: 6, unit: "hrs" },
//         { name: "Steps", value: steps, goal: 7500, unit: "steps" },
//         { name: "Water", value: water, goal: 4000, unit: "ml" },
//         { name: "Weight", value: weight, goal: 22 * (height / 100) ** 2, unit: "kg" },
//     ];

//     res.status(200).json({ message: "successful", tempResponse });
// };
// function calculateBMR(gender: string, weight: number, height: number, dob: string): number {
//     const age = new Date().getFullYear() - new Date(dob).getFullYear();
//     if (gender === 'male') {
//         return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
//     } else if (gender === 'female') {
//         return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
//     } else {
//         return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
//     }
// }
