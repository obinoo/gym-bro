import dotenv from "dotenv"
dotenv.config();
import express, {NextFunction, Request, Response} from "express"
import Admin from "../model/admin"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminSignUp =  async (req:Request, res:Response, next:NextFunction)=>{

    try{
      
        const {name, email, password} = req.body;

        const existingAdmin = await Admin.findOne({
            where:{
                email
            }
        })

        if(existingAdmin) {
             res.status(401).json({message: "Admin alreasy exists"})
             return;
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const createAdmin = new Admin({
            name,
            email,
            password:hashedPassword
    })
        await createAdmin.save(); 
        res.status(201).json({message: 'User created succesfully', admin: createAdmin})
    }
    catch(error){
        console.log(error)
        next(error);
    }
}

export const adminLogin = async(req: Request, res:Response, next:NextFunction)=>{

   try {
    const {email, password} = req.body;

    const admin = await Admin.findOne({
        where:{
            email
        }
    })
    if(!admin){
         res.status(400).json({message: 'Invalid admin credentials'});
         return;
    }
    const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
             res.status(400).json({message: 'Invalid admin credentials' });
             return;
        }

        const token = jwt.sign({email: admin.email}, process.env.JWT_SECRET!, {expiresIn: '1h'})
         res.json({message: 'Admin Login succesfully', token})
   } catch (error) {
    console.log(error);
    next(error);
   }
}