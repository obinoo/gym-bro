import dotenv from "dotenv"
dotenv.config();
import express,{Request, response, Response} from "express";
import User from "../model/user";

export const addWeight = async (req:Request,res:Response)=>{
    const {date, weight} = req.body;

    if(!date || !weight){
        return res.status(400).json({message:`Please provide the details`})
    
    }

    const id = req.userId;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.weight.push({
        date: new Date(date),
        weight
    })

    await user.save()
    return res.status(200).json({message: `Weight entry added`})
}

export const getWeightByDate = async (req:Request, res:Response)=>{

    const {date}= req.query;

    const id = req.userId;

    const user = await User.findById(id)

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if(!date){
        let date = new Date();
        user.weight = filterEntriesByDate(user?.weight,  date)

        return res.json({message: user.weight});
    }

    user.sleep = filterEntriesByDate(user.sleep, new Date(date as string));
    return res.json({message: user.weight});
}

export const getWeightByLimit = async (req:Request, res:Response)=>{

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
             return res.status(404).json({ message: "User not found" });
         }
 
         // 5. Validate that a limit was provided
         if (!limit) {
             // If no limit is provided, return a 400 error
             return res.status(400).json({ message: 'Please provide limit' });
         }
 
         // 6. Handle 'all' limit option
         if (limit === 'all') {
             // If limit is 'all', return all steps entries
             return res.status(200).json({
                 message: 'All sleep entries',
                 sleep: user.sleep
             });
         }
 
         // 7. Convert limit to a number
         const days = parseInt(limit as string);
         
         // 8. Validate the converted number
         if (isNaN(days)) {
             // If conversion fails, return a 400 error
             return res.status(400).json({ message: "Invalid limit provided" });
         }
 
         // 9. Calculate the cutoff date
         const cutoffDate = new Date();
         // Subtract the specified number of days from current date
         cutoffDate.setDate(cutoffDate.getDate() - days);
 
         // 10. Filter water entries based on the cutoff date
         const filteredWater = user.steps.filter((item) => {
             // Convert the entry's date to a Date object
             const itemDate = new Date(item.date);
             
             // Keep entries that are on or after the cutoff date
             return itemDate >= cutoffDate;
         });
 
         // 11. Return the filtered sleep entries
         return res.status(200).json({
             message: `Step entries for the last ${limit} days`,
             sleep: filteredWater
         });
 
     } catch (error) {
         // 12. Handle any unexpected errors
         console.error('Error fetching water entries:', error);
         return res.status(500).json({ message: 'Internal server error' });
     }
}

export const deleteWeight = async (req:Request, res:Response)=>{

    const {date} = req.query;

    if(!date){
        return res.status(400).json({messgae: `Please provide the date`})
    }

    const id = req.userId;
    const user = await User.findById(id)

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

   
    const targetDate = new Date(date as string);
   
    const filteredWeight = user.steps.filter(entry => {
        const entryDate = new Date(entry.date);
        return !(
            entryDate.getDate() === targetDate.getDate() &&
                entryDate.getMonth() === targetDate.getMonth() &&
                entryDate.getFullYear() === targetDate.getFullYear()
        );
    });

            await user.save();

            return res.status(200).json({ message: "Sleep entries deleted successfully" , filteredWeight});
}


export const getUserWeight = async (req:Request, res:Response)=>{

    const id = req.userId;

    const user = await User.findById( id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const currentWeight = user.weight.length > 0 ? user.weight[user.weight.length - 1].weight : null;
    const goalWeight = 22 * ((user.height[user.height.length - 1].height / 100) ** 2);

    res.status(201).json({message:`User sleep info`,  data: { currentWeight, goalWeight }})
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