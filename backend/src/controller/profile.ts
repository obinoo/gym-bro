import { Request, Response, NextFunction} from 'express';
import  { updateProfileSchema} from '../validator/profile.validator';
import User from '../model/user';
import bcrypt from 'bcrypt';
import cloudinary from '../config/cloudinary';


type User={
   name?: string;
   email?: string;
   height?: { height: number; date: Date }[];
   weight?: { weight: number; date: Date }[];
   age?: string| number;
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {          
    try { 
        const email = req.user
        const userProfile = await User.findOne({ email });

        if (!userProfile) {            
            return res.status(404).json({ error: 'Profile not found' });        
        }   
        //name, email, height, weight, age
        const updatedData : User = {};

        if(req.body.name !== ''){
            updatedData.name = req.body.name
        }
        if(req.body.email !== ''){
            updatedData.email = req.body.email
        }
        // Handle height as an array of measurements
        if (req.body.height !== '') {
            const newHeight = {
                height: Number(req.body.height),
                date: new Date()
            };
            updatedData.height = [...(userProfile.height || []), newHeight];
        }

        // Handle weight as an array of measurements
        if (req.body.weight !== '') {
            const newWeight = {
                weight: Number(req.body.weight),
                date: new Date()
            };
            updatedData.weight = [...(userProfile.weight || []), newWeight];
        }

        if(req.body.age !== ''){
            updatedData.age = req.body.age}


            const updatedProfile = await User.findOneAndUpdate(
                { email },
                { $set: updatedData },
                { new: true, runValidators: true }
            );
    
            return res.status(200).json({ 
                message: 'Profile updated successfully', 
                profile: updatedProfile 
            });   
    } catch (err) {        
        console.error("Error during profile update:", err);        
        return res.status(500).json({ error: 'Something went wrong during the update.' });    
    }};


// In your profile controller
export const getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      console.log("User making profile request:", req.user); // Debugging
  
      const email = req.user;
      if (!email) {
        return res.status(401).json({ error: "Unauthorized: No user found" });
      }
  
      const userProfile = await User.findOne({ email });
  
      if (!userProfile) {
        return res.status(404).json({ error: "Profile not found" });
      }
  
      return res.status(200).json(userProfile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      return res.status(500).json({ error: "Error fetching profile" });
    }
  };
  
  


// export const changePassword = async (req: Request, res: Response) => {

//     try {

//         const { id } = req.params;

//     const { currentPassword, newPassword } = req.body;

//         const user: any = await User.findByPk(id);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const isMatch = await bcrypt.compare(currentPassword, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ message: 'Password is incorrect' });
//         }

//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         await user.update({ password: hashedPassword });

//         return res.status(200).json({ message: 'Password changed successfully' });
//     } catch (error) {
//         return res.status(500).json({ message: 'Error changing password', error });
//     }
// };
