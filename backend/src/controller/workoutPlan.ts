import dotenv from "dotenv";
dotenv.config();
import {Request, Response} from "express";
import Workout from "../model/workout";


type WorkoutDTO = {
    name?: string;
    description?: string;
    durationInMinutes?: number;
    exercises?: Array<{
        name?: string;
        description?: string;
        sets?: number;
        reps?: number;
        imageURL?: string;
    }>;
    imageURL?: string;
};


export const addWorkout = async(req:Request, res: Response)=>{

    try {
        
        const {name, description, durationInMinutes, exercises, imageURL} = req.body;

    if(!name || !description || !durationInMinutes|| !exercises|| !imageURL){
         res.status(400).json({message: `Please provide all the details`})
         return;
    }

    const workout = new Workout({
        name,
        description,
        durationInMinutes,
        exercises,
        imageURL,
    })

    await workout.save();
    res.status(200).json({message: `workout created`})

    } catch (error) {
        res.status(400).json({message: `Error occured`, error})
    }
} 


export const getWorkouts = async (req: Request, res: Response)=>{

   try {
    const workouts = await Workout.find({});

    res.status(200).json({message: `Workouts fetched succesfully`, workouts})

   } catch (error) {
    res.status(400).json({message: `Error occured in fetching workouts`, error})
   }
}

export const getWorkoutById = async(req: Request, res: Response)=>{

    try {
        const {email} = req.params;

    const user = await Workout.findOne({email});

    res.status(200).json({message: `workout for ${email} fetched successfully`, user})

    } catch (error) {
        res.status(400).json({message: `Error occured in fetching workout`, error})
    }
}

export const updateWorkout = async(req:Request, res:Response)=>{

   try {
    const {email} = req.params;

    const updatedData: WorkoutDTO = {};

    if(!email){
        res.status(400).json({message: `Please provide the id`})
        return;
    }

    const workout = await Workout.findOne({email});

    if (!workout) {
         res.status(404).json({ message: 'Workout not found' });
    return;
        }

    if (req.body.name != ''){
        updatedData.name = req.body.name;
    }
    if (req.body.description != ''){
        updatedData.description = req.body.description;
    }
    if (req.body.durationInMinutes != ''){
        updatedData.durationInMinutes = req.body.durationInMinutes;
    }
    if (req.body.exercises != ''){
        updatedData.exercises = req.body.exercises;
    }
    if (req.body.imageURL != ''){
        updatedData.imageURL = req.body.imageURL;
    }

    await workout.save();

     res.status(200).json({
        message: "Workout updated successfully",
        workout
    });
   } catch (error) {
    console.error('Error updating workout:', error);
         res.status(500).json({ message: 'Internal server error' });
   }
}

export const deleteWorkout = async (req: Request, res:Response)=>{

    try {
        const {id} = req.params;

        if(!id){
           res.status(400).json({message: `Please provide the id`})
           return;
        }

        const workout = await Workout.deleteOne({id})

        res.status(200).json({message: `workout deleted`, workout})
    } catch (error) {
        console.error('Error deleting workout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}