import dotenv from "dotenv"
dotenv.config();
import bcrypt from "bcrypt"
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken'
import User from "../model/user";
import {signUpValidate, loginValidate }from '../validator/userValidator'
import {NextFunction, Request, Response} from "express";
import crypto from "crypto"



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: "nnubiacobinna@gmail.com",
        pass: process.env.GMAIL_PASS
    }
})

export const testing = async (req: Request,res:Response)=>{
        console.log('testing')
        res.send('Testing async function!');
}


export const signUp= async (req:Request, res: Response) : Promise<any>=>{
  
    try{
        const {error} = signUpValidate.validate(req.body)
        console.log(req.body)

        if(error) return res.status(400).json({error: error.details[0].message});

        const { name, email, password, weightInKg, heightInCm, gender, dob, goal, activityLevel } = req.body;

        const existingUser = await User.findOne({
            where: {
                email
            }
        })
        console.log(existingUser);

        if(existingUser) {
            return res.status(401).json({message: "User alreasy exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const createUser = new User({
            name,
            email,
            password: hashedPassword,
            weight: [
                {
                    weight: weightInKg,
                    unit: "kg",
                    date: Date.now()
                }
            ],
            height: [
                {
                    height: heightInCm,
                    date: Date.now(),
                    unit: "cm"
                }
            ],
            gender,
            dob,
            goal,
            activityLevel
        })
        console.log(createUser);
         await createUser.save();
         
        res.status(201).json({message: "User created", user:createUser})
    }
    catch(err){
        console.log(err)
        console.error(err)
        res.status(500).json({err: `Error occured, not able to create user`})
    }
}

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        // Log validation details
        const validationResult = loginValidate.validate(req.body);
        console.log('Validation Result:', validationResult);

        const { error } = validationResult;
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = req.body;

        // Log database query details
        console.log('Searching for user with email:', email);

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        console.log('Found User:', user);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Log password comparison
        const isPassword = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isPassword);

        if (!isPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { email: user.email }, 
            process.env.JWT_SECRET!, 
            { expiresIn: '1hr' }
        );

        // Send single response with both tokens
        return res.status(200).json({
            message: 'Login successfully',
            accessToken
        });

    } catch (err: any) {
        console.error('Login Error:', err);
        return res.status(500).json({ error: err.message });
    }
}

export const otpSender = (req:Request, res:Response, next:NextFunction)=>{
    try {
        
        const {email} = req.body;
        const otp = crypto.randomInt(100000, 1000000);

        const mailOptions = {
            from: "nnubiacobinna@gmail.com",
            to :   email,
            subject: "OTP verification code",
            text:  `Your otp is ${otp}`,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }

        transporter.sendMail(mailOptions, async (error, info)=>{
            if(error){
                console.log(error)
                return res.status(500).json({message: error.message})
            }else{
                res.status(201).json({message:"OTP sent succesfully", otp})
            }
        })
    } catch (error) {
        next(error);
    }
}