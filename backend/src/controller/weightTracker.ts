import dotenv from "dotenv"
dotenv.config();
import express,{Request, response, Response} from "express";
import User from "../model/user";

export const addWeight = async (req:Request,res:Response) : Promise<void> =>{
    const {date, weight} = req.body;

    if(!date || !weight){
       res.status(400).json({message:`Please provide the details`})
       return ;
    
    }

    const email = req.user; 
    console.log(email);
    const user = await User.findOne({ email: email });
    console.log(user);

    if (!user) {
     res.status(404).json({ message: "User not found" });
     return;
    }

    user.weight.push({
        date: new Date(date),
        weight
    })

    await user.save()
    res.status(200).json({message: `Weight entry added`})
    return;
}

export const getWeightByDate = async (req:Request, res:Response) : Promise<void>=>{

    const {date}= req.query;

    const email = req.user; 
   
    const user = await User.findOne({ email: email });
    

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    if(!date){
        let date = new Date();
        user.weight = filterEntriesByDate(user?.weight,  date)

         res.json({message: user.weight});
         return;
    }

    user.sleep = filterEntriesByDate(user.sleep, new Date(date as string));
     res.json({message: user.weight});
     return;
}

export const getWeightByLimit = async (req:Request, res:Response) : Promise<void>=>{

    try{
         // 1. Extract the 'limit' from query parameters
         const { limit } = req.query;

         // 2. Get the user ID from the authenticated request
         const email = req.user;
 
         // 3. Find the user in the database by ID
         const user = await User.findOne({ email });
 
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
                 message: 'All weight entries',
                 weight: user.weight
             });
             return;
         }
 
         // 7. Convert limit to a number
         const days = parseInt(limit as string);
         
         // 8. Validate the converted number
         if (isNaN(days)) {
             // If conversion fails, return a 400 error
             res.status(400).json({ message: "Invalid limit provided" });
             return;
         }
 
         // 9. Calculate the cutoff date
         const cutoffDate = new Date();
         // Subtract the specified number of days from current date
         cutoffDate.setDate(cutoffDate.getDate() - days);
 
         // 10. Filter water entries based on the cutoff date
         const filteredWeight = user.weight.filter((item) => {
             // Convert the entry's date to a Date object
             const itemDate = new Date(item.date);
             
             // Keep entries that are on or after the cutoff date
             return itemDate >= cutoffDate;
         });
 
         // 11. Return the filtered sleep entries
         res.status(200).json({
             message: `weight entries for the last ${limit} days`,
             weight: filteredWeight
         });
         return ;
 
     } catch (error) {
         // 12. Handle any unexpected errors
         console.error('Error fetching weight entries:', error);
         res.status(500).json({ message: 'Internal server error' });
         return ;
     }
}

export const deleteWeight = async (req:Request, res:Response) : Promise<void>=>{

    const {date} = req.query;

    if(!date){
        res.status(400).json({messgae: `Please provide the date`})
        return ;
    }

    const email = req.user; 
   
    const user = await User.findOne({ email: email });

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return; 
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

         res.status(200).json({ message: "Sleep entries deleted successfully" , filteredWeight});
         return ;
}


export const getUserWeight = async (req:Request, res:Response) : Promise<void>=>{

    const email = req.user; 
    
    const user = await User.findOne({ email: email });

    if (!user) {
       res.status(404).json({ message: "User not found" });
       return; 
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