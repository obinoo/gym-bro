import cloudinary from '../config/cloudinary';
import {Request, Response} from 'express';
import multer from "multer";
import sharp from "sharp";


export const uploadImage = async (req: any, res: any) => {
    try {

        const file = req.file;
        if (!file) {
            return res.status(400).json({ ok: false, error: 'No image file provided' });
        }

        const processedImage = await sharp(file.buffer)
        .resize({width: 800})
        .toBuffer()

         cloudinary.uploader.upload_stream({
            resource_type: 'image'},
        (err: any, result: any)=>{

            if(err){
                console.error('Cloudinary upload error:', err);
          return res.status(500).json({ ok: false, error: 'Error uploading image' });
            }

            res.status(200).json({ success: true, message: 'Image uploaded successfully', imageUrl: result.secure_url });
        }).end(processedImage);

       
    } catch (error) {
        console.error('Unexpected error:', error);
    return res.status(500).json({ ok: false, error: 'Unexpected server error' });
    }
};