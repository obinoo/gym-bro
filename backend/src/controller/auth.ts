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

export const signUp= async (req:Request, res: Response) : Promise<any>=>{
  
    try{
        const {error} = signUpValidate.validate(req.body)

        if(error) return res.status(400).json({error: error.details[0].message});

        const { name, email, password, weightInKg, heightInCm, gender, dob, goal, activityLevel } = req.body;

        const existingUser = await User.findOne({
            where: {
                email
            }
        })

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
         await createUser.save();
        res.status(201).json({message: "User created", user:createUser})
    }
    catch(err){
        console.log(err)
        res.status(500).json({err: `Error occured, not able to create user`})
    }
}

export const login = async (req:Request, res:Response): Promise<any>=>{

    try{

        const {error} = loginValidate.validate(req.body)

        if(error) return res.status(400).json({error: error.details[0].message});

        const {email, password} = req.body;

        const user = await User.findOne({
            where:{
                email
            }
        })

        if(!user) return res.status(401).json({message: "Invalid credentials"})

            const isPassword = await bcrypt.compare(password, user.password)
        if(!isPassword) return res.status(400).json({message: "Invalid credentials"})

            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined in the environment variables.");
            }

            const token = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'})
            return res.json({message: 'Login succesfully', token})
    }
    catch(err: any){
        console.log(err)
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