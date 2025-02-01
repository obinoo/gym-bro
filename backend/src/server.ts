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
import testRoute from './route/testRoute';
import stepRoute from './route/stepRoute';
import weightRoute from './route/weightRoute';
import profileRoute from './route/profileRoute';

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function(body) {
        console.log('Response being sent:', body);
        return originalJson.call(this, body);
    };
    next();
});

const allowedOrigins = ['http://localhost:3000']; // Add more origins as needed

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`CORS blocked request from origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'], 
        credentials: true, 
    })
);
app.use(cookieParser());
app.use('/auth', authRoute)
app.use('/calorie', calorieRoute)
app.use('/image', imageRoute)
app.use('/sleep', sleepRoute)
app.use('/water', waterRoute)
app.use('/plan', workoutPlanRoute)
app.use('/track', workoutTrackRoute)
app.use('/admin', adminRoute)
app.use('/report', reportRoute);
app.use('/step', stepRoute);
app.use('/weight', weightRoute)
app.use('/profile', profileRoute);
app.use('/tests', testRoute);
console.log('Test route registered.');

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});



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
console.log(PORT)

app.listen(PORT, ()=>{
    console.log('Server is up and running on port:', `${PORT}`)
})


