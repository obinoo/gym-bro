import dotenv from "dotenv"
dotenv.config();
import express,{Request, response, Response} from "express";
import User from "../model/user";

export const addWorkout = async (req:Request, res:Response)=>{
    const {date, exercise, durationInMinutes} = req.body;

    if(!date || !exercise || !durationInMinutes){
       res.status(400).json({message:`Please provide the details`})
       return; 
    }

    const id = req.userId;
    const user = await User.findById(id);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return; 
    }

    user.workouts.push({
        date: new Date(date),
        exercise,
        durationInMinutes
    })

    await user.save()
     res.status(200).json({message: `Workout entry added`})
}

export const getWorkoutByDate = async (req:Request, res:Response)=>{

    const {date}= req.query;

    const id = req.userId;

    const user = await User.findById(id)

    if (!user) {
         res.status(404).json({ message: "User not found" });
         return; 
    }

    if(!date){
        let date = new Date();
        user.workouts = filterEntriesByDate(user?.workouts,  date)

         res.json({message: user.workouts});
         return;
    }

    user.workouts = filterEntriesByDate(user.workouts, new Date(date as string));
     res.json({message: 'Water entries for the date'});
}

export const getWorkoutTrackByLimit = async (req:Request, res:Response)=>{

    try{
         // 1. Extract the 'limit' from query parameters
         const { limit } = req.query;

         // 2. Get the user ID from the authenticated request
         const userId = req.userId;
 
         // 3. Find the user in the database by ID
         const user = await User.findById(userId);
 
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
         }
 
         // 6. Handle 'all' limit option
         if (limit === 'all') {
             // If limit is 'all', return all steps entries
              res.status(200).json({
                 message: 'All sleep entries',
                 sleep: user.sleep
             });
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
 
         // 10. Filter workout track entries based on the cutoff date
         const filteredWorkout = user.steps.filter((item) => {
             // Convert the entry's date to a Date object
             const itemDate = new Date(item.date);
             
             // Keep entries that are on or after the cutoff date
             return itemDate >= cutoffDate;
         });
 
         // 11. Return the filtered sleep entries
        res.status(200).json({
             message: `Step entries for the last ${limit} days`,
             workout: filteredWorkout
         });
 
     } catch (error) {
         // 12. Handle any unexpected errors
         console.error('Error fetching step entries:', error);
         res.status(500).json({ message: 'Internal server error' });
     }
}

export const deleteWorkout = async (req:Request, res:Response)=>{

    const {date} = req.query;

    if(!date){
         res.status(400).json({messgae: `Please provide the date`})
         return;
    }

    const id = req.userId;
    const user = await User.findById( id)

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    
    const targetDate = new Date(date as string);
   
    const filteredWorkout = user.steps.filter(entry => {
        const entryDate = new Date(entry.date);
        return !(
            entryDate.getDate() === targetDate.getDate() &&
                entryDate.getMonth() === targetDate.getMonth() &&
                entryDate.getFullYear() === targetDate.getFullYear()
        );
    });

            await user.save();

               res.status(200).json({ 
                message: "Workout entries deleted successfully" , 
                workout: filteredWorkout});
}

export const usergoalWorkout = async (req:Request, res: Response)=>{

    const userId = req.userId;
    const user = await User.findById( userId);

    if(!user){
         res.status(404).json({ message: "User not found" });
         return;
    }

    if(user.goal == "weightLoss"){
        let goal = 7;
        res.json({message: 'User goal workout days',  goal });
    }
    else if(user.goal == "weightGain"){

        let goal = 4;
        res.json({message: 'User goal workout days',  goal });
    }
    else{
   
        let goal = 5;
        res.json({message: 'User goal workout days',  goal });
    }

    res.json({message: 'User workout history',  workouts: user.workouts });
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