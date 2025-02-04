import dotenv from "dotenv"
dotenv.config();
import express,{Request, response, Response} from "express";
import User from "../model/user";
import { Types } from "mongoose";


export const addCalories = async (req: Request, res: Response) => {
    try {
        const { item, date, quantity, quantityType } = req.body;

        if (!item || !date || !quantity || !quantityType) {
            res.status(400).json({ message: `Please provide all the details` });
            return;
        }

        // Convert quantity to grams or milliliters
        let qtyInGrams = 0;
        if (quantityType === 'g' || quantityType === 'ml') {
            qtyInGrams = quantity;
        } else if (quantityType === 'kg' || quantityType === 'l') {
            qtyInGrams = quantity * 1000;
        } else {
            res.status(400).json({ message: `Invalid quantity type` });
            return;
        }

        // Fetch nutrition data from Open Food Facts
        const response = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
                item
            )}&search_simple=1&action=process&json=1`
        );

        if (!response.ok) {
            res.status(response.status).json({ message: 'Failed to fetch nutrition data' });
            return;
        }

        const data = await response.json();

        // Ensure product data exists
        if (!data.products || data.products.length === 0) {
            res.status(404).json({ message: 'No nutrition information found for the item' });
            return;
        }

        // Extract calorie data from the first product
        const product = data.products[0];
        const caloriesPer100g = product.nutriments['energy-kcal_100g'];

        // Handle missing or invalid calorie data
        if (typeof caloriesPer100g !== 'number') {
            res.status(400).json({
                message: `Calorie data unavailable for ${item}. Please check the item.`,
            });
            return;
        }

        // Calculate calorie intake
        const calorieIntake = (caloriesPer100g / 100) * qtyInGrams;

        // Find user by email
        const user = await User.findOne({ email: req.user });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

//         // Calculate total calorie intake so far
// const totalCalories = user.calorieIntake.reduce((sum, entry) => sum + entry.calorieIntake, 0);

// // Get goal calorie intake 
// const goalCalorieIntake = user.goalCalorieIntake;

// // Ensure new calorie intake does not exceed goal
// if (totalCalories + calorieIntake > goalCalorieIntake) {
//     return res.status(400).json({ message: "Calorie intake exceeds daily goal!" });
// }

        // Add calorie intake entry
        user.calorieIntake.push({
            item,
            date: new Date(date),
            quantity,
            quantityType,
            calorieIntake: Math.round(calorieIntake),
        });

        await user.save();

        res.status(200).json({
            message: 'Calorie intake added successfully',
            calorieIntake: user.calorieIntake,
        });
    } catch (error) {
        console.error('Error adding calorie intake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getCalorieByDate = async (req: Request, res: Response): Promise<any> => {
    try {
      const { date } = req.query;
      const email = req.user; 

      if (!email) {
        return res.status(401).json({ message: "Unauthorized: Email not provided" });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const targetDate = date ? new Date(date as string) : new Date();
      const filteredCalorieIntake = filterEntriesByDate(user.calorieIntake, targetDate);
  
      return res.status(200).json({
        message: date
          ? `Calorie intake for ${targetDate.toDateString()}`
          : "Calorie intake for today",
        calorieIntake: filteredCalorieIntake || [],
      });
    } catch (error) {
      console.error("Error fetching calorie intake:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  


export const getCalorieIntakeByLimit = async (req: Request, res: Response) => {
    try {
        const { limit } = req.query; // Changed from req.body to req.query
        const email = req.user;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return; 
        }

        if (!limit) {
            res.status(400).json({ message: "Please provide limit" });
            return; 
        }

        if (limit === 'all') {
             res.status(200).json({
                message: "Calorie Intake",
                calorieIntake: user.calorieIntake
            });
            return;
        }

        const days = parseInt(limit as string);
        
        if (isNaN(days)) {
            res.status(400).json({ message: "Invalid limit provided" });
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const filteredCalorieIntake = user.calorieIntake.filter(entry => 
            entry.date >= cutoffDate
        );

        res.status(200).json({
            message: `Calorie intake for the last ${limit} days`,
            calorieIntake: filteredCalorieIntake
        });

    } catch (error) {
        console.error('Error fetching calorie intake:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteCalorie = async (req: Request, res: Response):Promise<any> => {
    try {
        const { calorieIntakeId } = req.params; 
        const email = req.user; 
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if calorieIntakeId exists in user's records
        const entryIndex = user.calorieIntake.findIndex(entry => entry._id.toString() === calorieIntakeId);
        if (entryIndex === -1) {
            return res.status(404).json({ message: "Calorie entry not found" });
        }

        // Remove the specific entry
        user.calorieIntake.splice(entryIndex, 1);
        await user.save();

        res.status(200).json({ 
            message: "Calorie intake deleted successfully!",
            user 
        });

    } catch (error) {
        console.error("Error deleting calorie intake:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getGoalCalorie = async (req: Request, res: Response)=>{

    const email = req.user;
    const user = await User.findOne({ email });

    if(!user){
         res.json({message: `user is null`})
         return;
    }

    let maxCalorieIntake = 0;
    let heightInCm = (user.height[user.height.length - 1].height);
    let weightInKg = (user.weight[user.weight.length - 1].weight);
    let age = new Date().getFullYear() - new Date(user.dob).getFullYear();
    let BMR = 0;
    let gender = user.gender;

    if (gender == 'male') {
        BMR = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age)

    }
    else if (gender == 'female') {
        BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age)

    }
    if (user.goal == 'weightLoss') {
        maxCalorieIntake = BMR - 500;
    }
    else if (user.goal == 'weightGain') {
        maxCalorieIntake = BMR + 500;
    }
    else {
        maxCalorieIntake = BMR;
    }

    res.json({message: `Max calorie Intake`, maxCalorieIntake });

}


// function filterEntriesByDate(entries: Types.DocumentArray<{ date: Date }>, targetDate: Date) {
//     return entries.filter((entry: { date: string | number | Date; }) => {
//         const entryDate = new Date(entry.date);
//         return (
//             entryDate.getDate() === targetDate.getDate() &&
//             entryDate.getMonth() === targetDate.getMonth() &&
//             entryDate.getFullYear() === targetDate.getFullYear()
//         );
//     });
// }

function filterEntriesByDate(entries: Types.DocumentArray<{ date: Date }>, targetDate: Date) {
    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);
    
    return entries.filter((entry: { date: string | number | Date }) => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
    });
}