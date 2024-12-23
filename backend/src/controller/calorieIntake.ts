import dotenv from "dotenv"
dotenv.config();
import express,{Request, response, Response} from "express";
import User from "../model/user";
import { Types } from "mongoose";


export const addCalories =  async(req:Request, res:Response)=>{

    try {

        const { item, date, quantity, quantityType } = req.body;

        if(!item || !date || !quantity || !quantityType){
             res.status(400).json({message: `Please provide all the details`})
             return;
        }

        let qtyInGrams = 0;
        if(quantityType === 'g'){
            qtyInGrams = quantity;
        }
        else if(quantityType === 'kg'){
            qtyInGrams = quantity * 1000;
        }
        else if(quantityType === 'ml'){
            qtyInGrams = quantity;
        }
        else if(quantityType === 'l'){
            qtyInGrams = quantity * 1000;
        }

        else{
            res.status(400).json({message: `Invalid quantity type`})
            return;
        }

        const headers = new Headers({
            'X-Api-Key': process.env.NUTRITION_API_KEY || ''
        });

        const response = await fetch(`https://api.api-ninjas.com/v1/nutrition?query=${item}`, {
            method: 'GET',
            headers: headers
        });
    
        if (!response.ok) {
             res.status(response.status).json({ message: 'Failed to fetch nutrition data' });
             return;
        }
    
        const nutritionData = await response.json();
        console.log(nutritionData);

        if (!nutritionData || nutritionData.length === 0) {
             res.status(404).json({
                message: 'No nutrition information found for the item'
            });
            return;
        }

        const calorieIntake = (nutritionData[0].calories / nutritionData[0].serving_size_g) * qtyInGrams;
        const userId = req.userId;
        const user = await User.findOne({ _id: userId });

        if (!user) {
             res.status(404).json({
                message: 'User not found'
            });
            return;
        }

        user.calorieIntake.push({
            item,
            date: new Date(date),
            quantity,
            quantityType,
            calorieIntake: Math.round(calorieIntake) 
        });
        await user.save();
        res.status(200).json({ message: 'Calorie intake added successfully', calorieIntake: user.calorieIntake });
        
        
    } catch (error) {
        console.error('Error adding calorie intake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export const getCalorieByDate = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        const userId = req.userId;

        const user = await User.findById(userId)

        if (!user) {
             res.status(404).json({ message: "User not found" });
             return;
        }

        const targetDate = date ? new Date(date as string) : new Date();

        const filteredCalorieIntake = filterEntriesByDate(user.calorieIntake, targetDate);

         res.status(200).json({
            message: date 
                ? `Calorie intake for ${targetDate.toDateString()}` 
                : "Calorie intake for today",
            calorieIntake: filteredCalorieIntake
        });
        

    } catch (error) {
        console.error('Error fetching calorie intake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getCalorieIntakeByLimit = async (req: Request, res: Response) => {
    try {
        const { limit } = req.query; // Changed from req.body to req.query
        const userId = req.userId;

        const user = await User.findById(userId);

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

export const deleteCalorie = async (req: Request, res: Response) => {
    try {
        const { calorieIntakeId } = req.params; // Assumes you pass the specific entry ID
        
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
             res.status(404).json({ message: "User not found" });
             return;
        }

        // Remove specific calorie intake entry
        user.calorieIntake.pull(calorieIntakeId);

        await user.save();

        res.status(200).json({ 
            message: "Calorie intake deleted",
            user 
        });

    } catch (error) {
        console.error('Error deleting calorie intake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getGoalCalorie = async (req: Request, res: Response)=>{

    const userId = req.userId;
    const user = await User.findById(userId);

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


function filterEntriesByDate(entries: Types.DocumentArray<{ date: Date }>, targetDate: Date) {
    return entries.filter((entry: { date: string | number | Date; }) => {
        const entryDate = new Date(entry.date);
        return (
            entryDate.getDate() === targetDate.getDate() &&
            entryDate.getMonth() === targetDate.getMonth() &&
            entryDate.getFullYear() === targetDate.getFullYear()
        );
    });
}