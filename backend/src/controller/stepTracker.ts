import dotenv from "dotenv"
dotenv.config();
import express,{Request, response, Response} from "express";
import User from "../model/user";
import { Types } from "mongoose";

export const addStep = async (req:Request,res:Response)=>{
    const {date, steps} = req.body;

    if(!date || !steps){
        res.status(400).json({message:`Please provide the details`})
    return;
    }

    const email = req.user; 
    console.log(email);
    const user = await User.findOne({ email: email });
    console.log(user);

    if (!user) {
         res.status(404).json({ message: "User not found" });
         return;
    }

    user.steps.push({
        date: new Date(date),
        steps
    })

    await user.save()
     res.status(200).json({message: `Step entry added`})
}

export const getStepsByDate = async (req:Request, res:Response)=>{

    const {date}= req.query;

    const email = req.user; 
   
    const user = await User.findOne({ email: email });
   

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    if(!date){
        let date = new Date();
        user.steps = filterEntriesByDate(user?.steps,  date)

         res.json({message: user.steps});
    }

    user.steps = filterEntriesByDate(user.steps, new Date(date as string));
    res.json({message: user.steps});
}

console.log('Starting getStepByLimit');
export const getStepByLimit = async (req:Request, res:Response)=>{

    try{
         // 1. Extract the 'limit' from query parameters
         const { limit } = req.query;

         // 2. Get the user ID from the authenticated request
         const email = req.user; 
 
         // 3. Find the user in the database by ID
         
        const user = await User.findOne({ email: email });
        console.log('User steps from DB:', user!.steps);
    
         // 4. Check if user exists
         if (!user) {
             // If no user found, return a 404 error
             res.status(404).json({ message: "User not found" });
             return;
         }
 
         // 5. Validate that a limit was provided
         if (!limit) {
             // If no limit is provided, return a 400 error
              res.status(400).json({ message: 'Please provide limit' });
              return;
         }
 
         // 6. Handle 'all' limit option
         if (limit === 'all') {
             // If limit is 'all', return all steps entries
              res.status(200).json({
                 message: 'All step entries',
                 steps: user.steps
             });
             return;
         }
 
         // 7. Convert limit to a number
         const days = parseInt(limit as string);
         
         // 8. Validate the converted number
         if (isNaN(days)) {
             // If conversion fails, return a 400 error
             res.status(400).json({ message: "Invalid limit provided" });
         }
 
         // 9. Calculate the cutoff date
         const cutoffDate = new Date();
         // Subtract the specified number of days from current date
         cutoffDate.setDate(cutoffDate.getDate() - days);
 
         // 10. Filter step entries based on the cutoff date
         const filteredStep: any = user.steps.filter((item) => {
             // Convert the entry's date to a Date object
             const itemDate = new Date(item.date);
             
             // Keep entries that are on or after the cutoff date
         return itemDate >= cutoffDate;          
         });
         console.log('Filtered steps:', filteredStep);

         console.log(filteredStep);
 
         // 11. Return the filtered step entries
        //  res.status(200).json({
        //     message: `Step entries for the last ${limit} days`,
        //     steps: filteredStep
        // });

        console.log('User object keys:', Object.keys(user.toObject()));
        console.log('Steps array direct:', user.steps);
        console.log('User document:', user);

        const response = {
            message: `Step entries for the last ${limit} days`,
            steps: filteredStep
        };
        console.log('Sending response:', response);
        res.status(200).json(response);
 
     } catch (error) {
         // 12. Handle any unexpected errors
         console.error('Error fetching step entries:', error);
          res.status(500).json({ message: 'Internal server error' });
     }
}


export const deleteSteps = async (req:Request, res:Response)=>{

    const {date} = req.query;

    if(!date){
        res.status(400).json({messgae: `Please provide the date`})
    }

    const email = req.user; 
   
    const user = await User.findOne({ email: email });

    if (!user) {
         res.status(404).json({ message: "User not found" });
         return;
    }

    const targetDate = new Date(date as string);
   
    const filteredSteps = user.steps.filter(entry => {
        const entryDate = new Date(entry.date);
        return !(
            entryDate.getDate() === targetDate.getDate() &&
                entryDate.getMonth() === targetDate.getMonth() &&
                entryDate.getFullYear() === targetDate.getFullYear()
        );
    });

            await user.save();

         res.status(200).json({ message: "Sleep entries deleted successfully" , steps: filteredSteps});
}


export const getUserStep = async (req:Request, res:Response)=>{

    const email = req.user; 
    
    const user = await User.findOne({ email: email });

    if (!user) {
         res.status(404).json({ message: "User not found" });
         return;
    }

    let totalSteps = 0;

    if(user.goal == "weightLoss"){
        totalSteps = 10000;
    }
    else if(user.goal == "weightGain"){
        totalSteps = 5000;
    }
    else{
        totalSteps = 7500;
    }   

    res.status(201).json({message:`User sleep info`, totalSteps})
}


function filterEntriesByDate(entries: any, targetDate: Date) {
    return entries.filter((entry: { date: string | number | Date; }) => {
        const entryDate = new Date(entry.date);
        return (
            entryDate.getDate() === targetDate.getDate() &&
            entryDate.getMonth() === targetDate.getMonth() &&
            entryDate.getFullYear() === targetDate.getFullYear()
        );
    });
}