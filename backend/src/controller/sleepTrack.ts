import dotenv from "dotenv"
dotenv.config();
import express,{Request, response, Response} from "express";
import User from "../model/user";
import { Types } from "mongoose";

export const addSleep = async (req: Request, res: Response): Promise<any> => {
    try {
      const { date, durationInHrs } = req.body;
  
      // Log received data
      console.log('Received data:', { date, durationInHrs });
  
      if (!date || !durationInHrs) {
        return res.status(400).json({ message: 'Please provide date and duration' });
      }
  
      const email = req.user;
      console.log('User email:', email);
  
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add the sleep entry
      user.sleep.push({
        date: new Date(date),
        durationInHrs: Number(durationInHrs)
      });
  
      await user.save();
      return res.status(200).json({ 
        message: 'Sleep entry added',
        sleep: user.sleep[user.sleep.length - 1] // Return the added entry
      });
  
    } catch (error) {
      console.error('Error in addSleep:', error);
      return res.status(500).json({ 
        message: 'Server error while saving sleep data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

export const getSleepByDate = async (req:Request, res:Response)=>{

    const {date}= req.query;

    const email = req.user;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    if(!date){
        let date = new Date();
        user.sleep = filterEntriesByDate(user?.sleep,  date)

         res.json({message: user.sleep});
         return;
    }

    user.sleep = filterEntriesByDate(user.sleep, new Date(date as string));
     res.json({message: user.sleep});
     return;
}

export const getSleepByLimit = async (req: Request, res: Response) => {
    try {
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
            // If limit is 'all', return all sleep entries
             res.status(200).json({
                message: 'All sleep entries',
                sleep: user.sleep
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

        // 10. Filter sleep entries based on the cutoff date
        const filteredSleep = user.sleep.filter((item) => {
            // Convert the entry's date to a Date object
            const itemDate = new Date(item.date);
            
            // Keep entries that are on or after the cutoff date
            return itemDate >= cutoffDate;
        });

        // 11. Return the filtered sleep entries
        res.status(200).json({
            message: `Sleep entries for the last ${limit} days`,
            sleep: filteredSleep
        });

    } catch (error) {
        // 12. Handle any unexpected errors
        console.error('Error fetching sleep entries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSleep = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        
        if (!date) {
             res.status(400).json({ message: `Please provide the date` });
             return;
        }

        const email = req.userId;
        const user = await User.findOne({ email});

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const targetDate = new Date(date as string);
        const initialLength = user.sleep.length;

        // Use Mongoose array methods for type safety
        const filteredSleep = user.sleep.filter(entry => {
            const entryDate = new Date(entry.date);
            return !(
                entryDate.getDate() === targetDate.getDate() &&
                entryDate.getMonth() === targetDate.getMonth() &&
                entryDate.getFullYear() === targetDate.getFullYear()
            );
        });

        await user.save();

         res.status(200).json({ 
            message: "Sleep entries deleted successfully",
            sleep: filteredSleep,
            deletedCount: initialLength - user.sleep.length
        });

    } catch (error) {
        console.error('Error deleting sleep data:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserSleep = (req:Request, res:Response)=>{

    const email = req.user;

    const user = User.findOne({email});

    const goalSleep = 6;

    res.status(201).json({message:`User sleep info`, goalSleep})
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