import mongoose from "mongoose";

const userShcmea = new mongoose.Schema({
    firstName :{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true

    },
    password:{
        type:String,
        required:true,
        minlength:8
    }

},{timestamps:true})

const userModel= mongoose.model('User',userShcmea)

export default userModel;