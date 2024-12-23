import dotenv from "dotenv"
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

const admin = (req:Request, res:Response, next:NextFunction)=>{

    try {
        const token = req.header('authorization')

        if(!token){
            return res.status(500).json({message: 'No token, authorization denied' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.admin = decoded;
        next();
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Token is not valid' });  
    }
}