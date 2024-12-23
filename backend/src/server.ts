import dotenv from 'dotenv'
dotenv.config();
import express from "express";
import mongoose from "mongoose"
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoute from './route/authRoute';
import calorieRoute from './route/calorieRoute';
import imageRoute from './route/imageRoute';
import sleepRoute from './route/sleepRoute';
import waterRoute from './route/waterRoute';
import workoutPlanRoute from "./route/workoutPlanRoute";
import workoutTrackRoute from "./route/workoutTrackRoute";
import adminRoute from './route/adminRoute';
import reportRoute from './route/reportRoute';

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ['http://localhost:3000']; // Add more origins as needed

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow credentials
    })
);
app.use(cookieParser());
app.use('/api/auth', authRoute)
app.use('/calorie', calorieRoute)
app.use('/image', imageRoute)
app.use('/sleep', sleepRoute)
app.use('/water', waterRoute)
app.use('/plan', workoutPlanRoute)
app.use('/track', workoutTrackRoute)
app.use('/admin', adminRoute)
app.use('/report', reportRoute);



console.log(process.env.DB_NAME)
console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL!,{
    dbName: process.env.DB_NAME!
    
}).then(()=>{
    console.log('Connected to database')
}
).catch((error) => {
    console.log(`Database synchronization error: ${error}`);
});


const PORT = process.env.PORT || 1000; 

app.listen(PORT, ()=>{
    console.log('Server is up and running on port:', `${PORT}`)
})