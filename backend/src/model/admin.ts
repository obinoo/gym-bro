import mongoose from "mongoose";

const admin = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
    ,
    email:{
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

const Admin = mongoose.model('Admin', admin)
export default Admin